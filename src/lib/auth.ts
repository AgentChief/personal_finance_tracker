import { supabase } from './supabase';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Insert'];

export type AuthError = {
  message: string;
};

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // First try to get existing profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // If profile exists, return it
    if (profile) return profile;

    // If no profile exists (and no error), create one
    if (!profile && !fetchError) {
      const newProfile: Profile = {
        id: user.id,
        email: user.email!,
        full_name: null,
        avatar_url: null,
      };

      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (insertError) throw insertError;
      return createdProfile;
    }

    if (fetchError) throw fetchError;
    return null;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
}