-- SQL migration to add the missing email column to the profiles table
-- Execute this script in your Supabase dashboard SQL Editor

-- Step 1: Add the email column to public.profiles if it doesn't already exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Step 2: Backfill any existing profiles with their corresponding email from auth.users
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND public.profiles.email IS NULL;

-- Step 3: Reload the PostgREST schema cache to ensure the API immediately recognizes the new column
NOTIFY pgrst, 'reload schema';
