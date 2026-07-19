import { corsHeaders } from '../_shared/cors.ts';
import { handleResponseError, handleResponseSuccess, PaymentError } from '../_shared/error-handler.ts';
import { verifyRazorpaySignature } from '../_shared/razorpay.ts';
import { getSupabaseServiceClient, getSupabaseUserClient } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new PaymentError('METHOD_NOT_ALLOWED', 'Only POST requests are allowed', 405);
    }

    // STEP 1: Authenticate the logged-in user using Supabase JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new PaymentError('UNAUTHORIZED', 'Missing Authorization header', 401);
    }

    const userClient = getSupabaseUserClient(authHeader);
    const { data: { user }, error: authError } = await userClient.auth.getUser();

    if (authError || !user) {
      throw new PaymentError('UNAUTHORIZED', 'Invalid or expired authorization token', 401);
    }

    // Request Validation
    let body;
    try {
      body = await req.json();
    } catch {
      throw new PaymentError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    const razorpay_order_id = body.razorpay_order_id || body.razorpayOrderId;
    const razorpay_payment_id = body.razorpay_payment_id || body.razorpayPaymentId;
    const razorpay_signature = body.razorpay_signature || body.razorpaySignature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new PaymentError(
        'BAD_REQUEST',
        'Missing required parameters: razorpay_order_id, razorpay_payment_id, razorpay_signature',
        400
      );
    }

    const serviceClient = getSupabaseServiceClient();

    // STEP 5 (Partial - early exit check for Idempotency): Check duplicate payment
    const { data: existingPayment, error: checkPaymentError } = await serviceClient
      .from('payments')
      .select('id, order_id, student_id, course_id')
      .eq('gateway_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (checkPaymentError) {
      console.error('Database error checking payment:', checkPaymentError);
      throw new PaymentError('DATABASE_ERROR', 'Failed to verify payment history', 500);
    }

    if (existingPayment) {
      // If payment is already registered, check if enrollment is also registered.
      const { data: existingEnrollment } = await serviceClient
        .from('course_enrollments')
        .select('id')
        .eq('student_id', existingPayment.student_id)
        .eq('course_id', existingPayment.course_id)
        .maybeSingle();

      if (!existingEnrollment) {
        // Enforce recovery if enrollment failed during first invocation
        const { error: insertEnrollError } = await serviceClient
          .from('course_enrollments')
          .insert({
            student_id: existingPayment.student_id,
            course_id: existingPayment.course_id,
            payment_id: existingPayment.id,
            status: 'active',
            enrolled_at: new Date().toISOString(),
          });

        if (insertEnrollError) {
          console.error('Recovery enrollment insert failed:', insertEnrollError);
          throw new PaymentError('DATABASE_ERROR', 'Failed to enroll student during transaction recovery', 500);
        }
      }

      return handleResponseSuccess({ message: 'Payment verified successfully.' });
    }

    // STEP 2: Find the matching order in the orders table using gateway_order_id
    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .select('*')
      .eq('gateway_order_id', razorpay_order_id)
      .maybeSingle();

    if (orderError) {
      console.error('Database error fetching order:', orderError);
      throw new PaymentError('DATABASE_ERROR', 'Failed to retrieve order details', 500);
    }

    if (!order) {
      throw new PaymentError('ORDER_NOT_FOUND', 'Order matching gateway_order_id not found', 404);
    }

    // STEP 3: Verify order attributes
    if (order.student_id !== user.id) {
      throw new PaymentError('FORBIDDEN', 'This order does not belong to you', 403);
    }

    if (order.status === 'paid') {
      const { data: existingEnrollment } = await serviceClient
        .from('course_enrollments')
        .select('id')
        .eq('student_id', order.student_id)
        .eq('course_id', order.course_id)
        .maybeSingle();

      if (existingEnrollment) {
        return handleResponseSuccess({ message: 'Payment verified successfully.' });
      }
      // Do not throw ORDER_ALREADY_PAID; instead, fall through to verify signature
      // and call the RPC transaction to complete enrollment recovery.
    } else if (order.status !== 'pending') {
      throw new PaymentError('INVALID_ORDER_STATUS', `Order status is ${order.status}, expected pending`, 400);
    }

    // STEP 4: Verify Razorpay Signature using HMAC SHA256
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayKeySecret) {
      throw new PaymentError('CONFIGURATION_ERROR', 'Razorpay API secret is not set on server', 500);
    }

    const isValidSignature = await verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpayKeySecret
    );

    if (!isValidSignature) {
      throw new PaymentError('INVALID_SIGNATURE', 'Razorpay payment signature verification failed', 400);
    }

    // STEP 5: Call the atomic PostgreSQL function to complete order, insert payment, and enroll user
    const { data: rpcResult, error: rpcError } = await serviceClient.rpc(
      'complete_order_payment',
      {
        p_order_id: order.id,
        p_student_id: user.id,
        p_course_id: order.course_id,
        p_gateway_order_id: razorpay_order_id,
        p_gateway_payment_id: razorpay_payment_id,
        p_gateway_signature: razorpay_signature,
        p_amount: order.amount,
        p_currency: order.currency,
      }
    );

    if (rpcError) {
      console.error('Database RPC transaction error:', rpcError);
      throw new PaymentError('TRANSACTION_ERROR', rpcError.message || 'Failed to complete transaction atomically', 500);
    }

    if (!rpcResult || !rpcResult.success) {
      throw new PaymentError('TRANSACTION_FAILED', 'Database transaction failed to complete payment registration', 500);
    }

    // STEP 6: Return success response with context
    return handleResponseSuccess({
      message: 'Payment verified and enrollment completed successfully.',
      paymentId: rpcResult.payment_id,
      enrollmentId: rpcResult.enrollment_id,
      recovered: rpcResult.recovered || false,
    });
  } catch (error) {
    return handleResponseError(error);
  }
});
