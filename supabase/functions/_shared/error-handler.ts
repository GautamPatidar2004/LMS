import { corsHeaders } from './cors.ts';

export class PaymentError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export function handleResponseError(error: unknown): Response {
  console.error('[Payment Error]:', error);

  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let statusCode = 500;
  let details: any = undefined;

  if (error instanceof PaymentError) {
    code = error.code;
    message = error.message;
    statusCode = error.statusCode;
    details = error.details;
  } else if (error instanceof Error) {
    message = error.message;
    details = error.stack;
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code,
        message,
        details: Deno.env.get('DENO_REGION') ? undefined : details, // Hide stack traces in production environment
      },
    }),
    {
      status: statusCode,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

export function handleResponseSuccess(data: any, statusCode: number = 200): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    }),
    {
      status: statusCode,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}
