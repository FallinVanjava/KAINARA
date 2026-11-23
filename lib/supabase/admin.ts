import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * PERINGATAN KEAMANAN:
 * Klien ini memakai SUPABASE_SERVICE_ROLE_KEY yang melewati seluruh aturan RLS (Row Level Security).
 * HANYA boleh dipanggil di lingkungan server (server action, route handler, server query),
 * dan TIDAK BOLEH dikirim ke bundle client browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase URL atau Service Role Key belum dikonfigurasi di environment variables.');
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
