import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createPaymentOrder } from '../../services/payment';
import { loadRazorpayScript } from '../../utils/razorpayLoader';
import { Loader2, AlertCircle, CreditCard } from 'lucide-react';

interface BuyCourseButtonProps {
  courseId: string;
  courseTitle: string;
  className?: string;
  onPaymentSuccess: (paymentDetails: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  onPaymentError?: (errorMessage: string) => void;
}

export default function BuyCourseButton({
  courseId,
  courseTitle,
  className = '',
  onPaymentSuccess,
  onPaymentError,
}: BuyCourseButtonProps) {
  const { user, profile, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBuyClick = async () => {
    if (!isAuthenticated || !user) {
      const errorMsg = 'Please sign in to purchase this course.';
      setErrorMessage(errorMsg);
      if (onPaymentError) onPaymentError(errorMsg);
      return;
    }

    // Reset error state and set loading to prevent duplicate requests
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Load Razorpay script dynamically
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment portal script. Please check your internet connection.');
      }

      // 2. Call Supabase Edge Function to create order
      const response = await createPaymentOrder({ courseId });

      if (!response.success || !response.data) {
        const errorDetail = response.error?.message || 'Failed to create payment order.';
        throw new Error(errorDetail);
      }

      const { orderId, amount, currency, razorpayKey } = response.data;

      // 3. Configure Razorpay Checkout options
      const options = {
        key: razorpayKey,
        amount: amount, // in paise
        currency: currency,
        name: 'LMS Academy',
        description: courseTitle,
        order_id: orderId,
        handler: async (paymentResponse: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setIsLoading(false);
          // Pass cryptographic payment parameters to parent container (for server-side validation)
          await onPaymentSuccess({
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          });
        },
        prefill: {
          name: profile?.full_name || '',
          email: profile?.email || user?.email || '',
        },
        modal: {
          ondismiss: () => {
            // Safe cleanup: reset loading state if checkout window is dismissed by user
            setIsLoading(false);
          },
        },
        theme: {
          color: '#2563eb', // Theme color matching Blue branding
        },
      };

      // 4. Open Razorpay checkout portal modal
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (failedResponse: any) => {
        setIsLoading(false);
        const failMsg = failedResponse.error?.description || 'Payment transaction failed.';
        setErrorMessage(failMsg);
        if (onPaymentError) onPaymentError(failMsg);
      });

      rzp.open();
    } catch (err: any) {
      setIsLoading(false);
      const errorText = err.message || 'An unexpected error occurred during checkout setup.';
      setErrorMessage(errorText);
      if (onPaymentError) onPaymentError(errorText);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        onClick={handleBuyClick}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          isLoading
            ? 'bg-blue-600/80 text-white cursor-wait opacity-80'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:scale-[1.01] active:scale-[0.99]'
        } ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Initializing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Buy Course Now
          </>
        )}
      </button>

      {errorMessage && (
        <div className="flex items-center gap-2 text-red-500 text-xs font-semibold bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
