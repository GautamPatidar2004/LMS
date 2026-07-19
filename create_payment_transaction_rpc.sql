-- SQL Script: Complete Order Payment Transaction
-- Execute this script in your Supabase SQL Editor to support atomic payment verification.

CREATE OR REPLACE FUNCTION public.complete_order_payment(
  p_order_id UUID,
  p_student_id UUID,
  p_course_id UUID,
  p_gateway_order_id TEXT,
  p_gateway_payment_id TEXT,
  p_gateway_signature TEXT,
  p_amount NUMERIC,
  p_currency TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to bypass RLS for updating payment/enrollment status
AS $$
DECLARE
  v_payment_id UUID;
  v_enrollment_id UUID;
  v_existing_payment_id UUID;
  v_existing_enrollment_id UUID;
  v_order_status TEXT;
BEGIN
  -- 1. Idempotency Check: check if payment record already exists for this transaction
  SELECT id INTO v_existing_payment_id
  FROM public.payments
  WHERE gateway_payment_id = p_gateway_payment_id;

  IF v_existing_payment_id IS NOT NULL THEN
    -- If payment already exists, check if enrollment is present.
    SELECT id INTO v_existing_enrollment_id
    FROM public.course_enrollments
    WHERE student_id = p_student_id AND course_id = p_course_id;

    IF v_existing_enrollment_id IS NULL THEN
      -- Create enrollment if missing (recovery scenario)
      INSERT INTO public.course_enrollments (student_id, course_id, payment_id, status, enrolled_at)
      VALUES (p_student_id, p_course_id, v_existing_payment_id, 'active', NOW())
      RETURNING id INTO v_existing_enrollment_id;
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'payment_id', v_existing_payment_id,
      'enrollment_id', v_existing_enrollment_id,
      'recovered', true
    );
  END IF;

  -- 2. Verify order exists and is in pending state
  SELECT status INTO v_order_status
  FROM public.orders
  WHERE id = p_order_id FOR UPDATE; -- Lock order row for update

  IF v_order_status IS NULL THEN
    RAISE EXCEPTION 'Order matching ID % not found', p_order_id;
  END IF;

  IF v_order_status = 'paid' THEN
    -- Order already marked as paid. Fetch existing payment and enrollment.
    SELECT id INTO v_existing_payment_id
    FROM public.payments
    WHERE order_id = p_order_id;

    SELECT id INTO v_existing_enrollment_id
    FROM public.course_enrollments
    WHERE student_id = p_student_id AND course_id = p_course_id;

    RETURN jsonb_build_object(
      'success', true,
      'payment_id', v_existing_payment_id,
      'enrollment_id', v_existing_enrollment_id,
      'recovered', true
    );
  END IF;

  -- 3. Insert payment record
  INSERT INTO public.payments (
    order_id,
    student_id,
    course_id,
    gateway,
    gateway_order_id,
    gateway_payment_id,
    gateway_signature,
    amount,
    currency,
    status,
    paid_at
  ) VALUES (
    p_order_id,
    p_student_id,
    p_course_id,
    'razorpay',
    p_gateway_order_id,
    p_gateway_payment_id,
    p_gateway_signature,
    p_amount,
    p_currency,
    'success',
    NOW()
  ) RETURNING id INTO v_payment_id;

  -- 4. Update orders status to 'paid'
  UPDATE public.orders
  SET status = 'paid'
  WHERE id = p_order_id;

  -- 5. Create course enrollment record (check if already enrolled first)
  SELECT id INTO v_existing_enrollment_id
  FROM public.course_enrollments
  WHERE student_id = p_student_id AND course_id = p_course_id;

  IF v_existing_enrollment_id IS NULL THEN
    INSERT INTO public.course_enrollments (
      student_id,
      course_id,
      payment_id,
      status,
      enrolled_at
    ) VALUES (
      p_student_id,
      p_course_id,
      v_payment_id,
      'active',
      NOW()
    ) RETURNING id INTO v_enrollment_id;
  ELSE
    v_enrollment_id := v_existing_enrollment_id;
  END IF;

  -- 6. Return success status and database IDs
  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment_id,
    'enrollment_id', v_enrollment_id,
    'recovered', false
  );

EXCEPTION WHEN OTHERS THEN
  -- Exception automatically rolls back transaction. Raise error to caller.
  RAISE EXCEPTION 'Atomic payment completion failed: %', SQLERRM;
END;
$$;
