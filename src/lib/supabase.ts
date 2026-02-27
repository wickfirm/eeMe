import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Public client — uses anon key, subject to schema/RLS grants
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — uses service_role key, bypasses schema permissions and RLS.
// NEVER import this in client components (no 'use client' files).
// Only used in server-side api.ts and route handlers.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
  },
})
