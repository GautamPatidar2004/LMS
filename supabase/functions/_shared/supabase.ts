import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

// Create a Supabase client with the service role key to bypass RLS.
// This is safe because it only runs inside the Supabase Edge Functions environment.
export const getSupabaseServiceClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Create a Supabase client using the user's authorization header.
// Used when we want to perform queries on behalf of the user under RLS policies (e.g., fetch course details).
export const getSupabaseUserClient = (authHeader: string) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: SUPABASE_URL or SUPABASE_ANON_KEY');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
