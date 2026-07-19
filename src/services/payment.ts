import { supabase } from '../lib/supabase';
import { 
  CreateOrderRequest, 
  CreateOrderResponseData, 
  VerifyPaymentRequest, 
  VerifyPaymentResponseData, 
  ApiResponse 
} from '../types/payment';

/**
 * Invokes the 'create-order' Supabase Edge Function.
 * The Supabase Client SDK automatically passes the active user session JWT in the Authorization header.
 */
export async function createPaymentOrder(
  data: CreateOrderRequest
): Promise<ApiResponse<CreateOrderResponseData>> {
  try {
    const { data: response, error } = await supabase.functions.invoke<ApiResponse<CreateOrderResponseData>>(
      'create-order',
      {
        method: 'POST',
        body: data,
      }
    );

    if (error) {
      return {
        success: false,
        error: {
          code: 'FUNCTION_INVOCATION_ERROR',
          message: error.message || 'Failed to call create-order function',
          details: error,
        },
      };
    }

    return response || { success: false, error: { code: 'EMPTY_RESPONSE', message: 'Received empty response' } };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'CLIENT_ERROR',
        message: err.message || 'An unexpected client error occurred',
        details: err,
      },
    };
  }
}

/**
 * Invokes the 'verify-payment' Supabase Edge Function.
 * The Supabase Client SDK automatically passes the active user session JWT in the Authorization header.
 */
export async function verifyPaymentSignature(
  data: VerifyPaymentRequest
): Promise<ApiResponse<VerifyPaymentResponseData>> {
  try {
    const { data: response, error } = await supabase.functions.invoke<ApiResponse<VerifyPaymentResponseData>>(
      'verify-payment',
      {
        method: 'POST',
        body: data,
      }
    );

    if (error) {
      return {
        success: false,
        error: {
          code: 'FUNCTION_INVOCATION_ERROR',
          message: error.message || 'Failed to call verify-payment function',
          details: error,
        },
      };
    }

    return response || { success: false, error: { code: 'EMPTY_RESPONSE', message: 'Received empty response' } };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'CLIENT_ERROR',
        message: err.message || 'An unexpected client error occurred',
        details: err,
      },
    };
  }
}
