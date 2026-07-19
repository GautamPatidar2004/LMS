export interface PaymentErrorDetails {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: PaymentErrorDetails;
}

export interface CreateOrderRequest {
  courseId: string;
}

export interface CreateOrderResponseData {
  orderId: string;
  amount: number;
  currency: string;
  razorpayKey: string;
  courseId: string;
}

export interface VerifyPaymentRequest {
  courseId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponseData {
  enrolled: boolean;
  courseId: string;
  enrollmentId: string;
}

// Razorpay Options to pass to Razorpay Checkout SDK
export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}
