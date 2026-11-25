'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

export async function signInAdmin(input: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Data login tidak valid.',
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: 'Email atau kata sandi salah.',
    };
  }

  // Periksa profil, peran admin, dan status aktif akun
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    // Pengguna biasa bukan admin, batalkan sesi
    await supabase.auth.signOut();
    return {
      success: false,
      error: 'Akun ini tidak memiliki akses administrator.',
    };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: 'Akun administrator ini telah dinonaktifkan. Hubungi pengelola utama.',
    };
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get('x-forwarded-for');
  const ipAddress =
    forwardedFor?.split(',')[0]?.trim() ||
    requestHeaders.get('x-real-ip') ||
    null;
  const userAgent = requestHeaders.get('user-agent') || null;

  const { error: historyError } = await supabase.from('login_history').insert({
    user_id: authData.user.id,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  // Riwayat login tidak boleh menggagalkan proses masuk.
  if (historyError) console.error('login_history insert:', historyError.message);

  revalidatePath('/admin', 'layout');
  return { success: true };
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
