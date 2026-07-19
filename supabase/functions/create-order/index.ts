import { corsHeaders } from '../_shared/cors.ts';
import { handleResponseError, handleResponseSuccess, PaymentError } from '../_shared/error-handler.ts';
import { getSupabaseServiceClient, getSupabaseUserClient } from '../_shared/supabase.ts';
import { CreateOrderResponse } from '../_shared/types.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new PaymentError('METHOD_NOT_ALLOWED', 'Only POST requests are allowed', 405);
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new PaymentError('UNAUTHORIZED', 'Missing Authorization header', 401);
    }

    const userClient = getSupabaseUserClient(authHeader);
    const { data: { user }, error: authError } = await userClient.auth.getUser();

    if (authError || !user) {
      throw new PaymentError('UNAUTHORIZED', 'Invalid or expired authorization token', 401);
    }

    let body;
    try {
      body = await req.json();
    } catch {
      throw new PaymentError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    const { courseId } = body;
    if (!courseId || typeof courseId !== 'string') {
      throw new PaymentError('BAD_REQUEST', 'Missing or invalid courseId parameter', 400);
    }

    const serviceClient = getSupabaseServiceClient();
    const { data: course, error: courseError } = await serviceClient
      .from('courses')
      .select('id, price, discount_price, currency, is_published, status')
      .eq('id', courseId)
      .maybeSingle();

    if (courseError) {
      console.error('Database error fetching course:', courseError);
      throw new PaymentError('DATABASE_ERROR', 'Failed to retrieve course details', 500);
    }

    if (!course) {
      throw new PaymentError('COURSE_NOT_FOUND', 'The requested course does not exist', 404);
    }

    if (!course.is_published) {
      throw new PaymentError('COURSE_NOT_PUBLISHED', 'This course is currently not published', 400);
    }

    if (
      course.status && 
      course.status.toLowerCase() !== 'active' && 
      course.status.toLowerCase() !== 'published'
    ) {
      throw new PaymentError('COURSE_NOT_ACTIVE', 'This course is currently inactive', 400);
    }

    if (typeof course.price !== 'number' || course.price <= 0) {
      throw new PaymentError('INVALID_COURSE_PRICE', 'Course price must be a valid positive amount', 400);
    }

    const { data: enrollment, error: enrollmentError } = await serviceClient
      .from('course_enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (enrollmentError) {
      console.error('Database error checking enrollment:', enrollmentError);
      throw new PaymentError('DATABASE_ERROR', 'Failed to verify existing enrollments', 500);
    }

    if (enrollment) {
      throw new PaymentError('ALREADY_ENROLLED', 'You are already enrolled in this course', 400);
    }

    let payableAmount = course.price;
    if (
      typeof course.discount_price === 'number' &&
      course.discount_price >= 0 &&
      course.discount_price < course.price
    ) {
      payableAmount = course.discount_price;
    }

    const currency = course.currency || 'INR';

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new PaymentError('CONFIGURATION_ERROR', 'Razorpay API credentials are not set on server', 500);
    }

    const razorpayAmount = Math.round(payableAmount * 100);

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
      body: JSON.stringify({
        amount: razorpayAmount,
        currency,
        receipt: `rcpt_${courseId.slice(0, 8)}_${user.id.slice(0, 8)}`,
        notes: {
          student_id: user.id,
          course_id: courseId,
        },
      }),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.json().catch(() => ({}));
      console.error('Razorpay API error response:', errorData);
      throw new PaymentError(
        'GATEWAY_ERROR',
        errorData.error?.description || 'Failed to create order with Razorpay',
        502,
        errorData
      );
    }

    const razorpayOrder = await razorpayResponse.json();
    const gatewayOrderId = razorpayOrder.id;

    const { error: insertError } = await serviceClient
      .from('orders')
      .insert({
        student_id: user.id,
        course_id: courseId,
        amount: payableAmount,
        currency,
        gateway_order_id: gatewayOrderId,
        status: 'pending',
      });

    if (insertError) {
      console.error('Error inserting order record:', insertError);
      throw new PaymentError('DATABASE_ERROR', 'Failed to save order transaction details', 500);
    }

    const successData: CreateOrderResponse = {
      orderId: gatewayOrderId,
      amount: razorpayAmount,
      currency,
      razorpayKey: razorpayKeyId,
      courseId,
    };

    return handleResponseSuccess(successData);
  } catch (error) {
    return handleResponseError(error);
  }
});
