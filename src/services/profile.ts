import { supabase } from '../lib/supabase';
import { Profile, UserRole } from '../types/auth';

/**
 * Retrieves a user's profile from the database.
 * Returns null if the profile does not exist.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    throw new Error(error.message || 'Failed to retrieve profile.');
  }

  return data as Profile | null;
}

/**
 * Creates a new user profile in the database.
 */
export async function createProfile(
  id: string,
  fullName: string,
  role: UserRole = 'student',
  email: string | null = null
): Promise<Profile> {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id,
        full_name: fullName,
        role,
        email,
        created_at: now,
        updated_at: now,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    // Standard Supabase error code for duplicate keys is 23505
    if (error.code === '23505') {
      throw new Error('A profile already exists for this user.');
    }
    throw new Error(error.message || 'Failed to create profile.');
  }

  return data as Profile;
}

/**
 * Checks if a user's profile exists.
 */
export async function profileExists(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error checking profile existence:', error);
    throw new Error(error.message || 'Failed to check profile existence.');
  }

  return data !== null;
}
