export interface CreateOrderRequest {
  courseId: string;
}

export interface CreateOrderResponse {
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

export interface VerifyPaymentResponse {
  enrolled: boolean;
  courseId: string;
  enrollmentId: string;
}
