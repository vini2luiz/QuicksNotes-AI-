import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

if (!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NODE_ENV !== 'production') {
  console.warn('⚠️ Warning: NEXT_PUBLIC_SUPABASE_URL is not set in environment variables.');
}

/**
 * Cliente Supabase para operações no servidor (Server Components e API Routes).
 */
export const supabaseServer = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
