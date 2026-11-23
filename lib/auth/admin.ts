import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';
import type { User } from '@supabase/supabase-js';

export interface AdminAuthContext {
  user: User;
  profile: Profile;
}

/**
 * Lapisan keamanan kedua di server component / server actions.
 * Memverifikasi sesi login aktif, peran admin, dan status aktif.
 * Mengalihkan ke /admin/login jika tidak memenuhi syarat.
 */
export async function requireAdmin(): Promise<AdminAuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/admin/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    redirect('/admin/login?error=no_profile');
  }

  if (profile.role !== 'admin') {
    redirect('/admin/login?error=unauthorized');
  }

  if (!profile.is_active) {
    redirect('/admin/login?error=inactive');
  }

  return { user, profile };
}
