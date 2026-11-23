'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';

export interface UserActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Ubah peran akun (user <-> admin)
 * Admin tidak dapat mengubah peran akun dirinya sendiri.
 */
export async function updateUserRole(
  targetUserId: string,
  newRole: 'user' | 'admin'
): Promise<UserActionResponse> {
  try {
    const { user: currentAdmin } = await requireAdmin();

    // 1. Validasi perlindungan diri sendiri
    if (currentAdmin.id === targetUserId) {
      return {
        success: false,
        error: 'Anda tidak dapat mengubah peran akun Anda sendiri.',
      };
    }

    if (newRole !== 'user' && newRole !== 'admin') {
      return {
        success: false,
        error: 'Pilihan peran pengguna tidak valid.',
      };
    }

    const supabase = await createClient();

    // 2. Coba update lewat klien terotentikasi
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (updateError) {
      // Tangani kode error PostgreSQL 42501 (kebijakan keamanan)
      if (updateError.code === '42501' || updateError.message?.includes('42501')) {
        return {
          success: false,
          error: 'Operasi ditolak oleh sistem keamanan: Admin tidak dapat mengubah peran akun ini.',
        };
      }

      // Fallback service role bila klien sesi terkendala izin tabel sistem
      const adminClient = createAdminClient();
      const { error: adminErr } = await adminClient
        .from('profiles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUserId);

      if (adminErr) {
        console.error('Error updateUserRole via adminClient:', adminErr);
        return { success: false, error: 'Gagal memperbarui peran akun pengguna.' };
      }
    }

    revalidatePath('/admin/pengguna');
    revalidatePath(`/admin/pengguna/${targetUserId}`);

    return { success: true };
  } catch (err) {
    console.error('Error saat updateUserRole:', err);
    return { success: false, error: 'Terjadi kesalahan sistem saat memperbarui peran pengguna.' };
  }
}

/**
 * Aktifkan atau Nonaktifkan akun pengguna
 * Admin tidak dapat menonaktifkan akun dirinya sendiri.
 */
export async function toggleUserStatus(
  targetUserId: string,
  isActive: boolean
): Promise<UserActionResponse> {
  try {
    const { user: currentAdmin } = await requireAdmin();

    // 1. Validasi perlindungan diri sendiri
    if (currentAdmin.id === targetUserId) {
      return {
        success: false,
        error: 'Anda tidak dapat mengubah status keaktifan akun Anda sendiri.',
      };
    }

    const supabase = await createClient();

    // 2. Coba update lewat klien terotentikasi
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (updateError) {
      if (updateError.code === '42501' || updateError.message?.includes('42501')) {
        return {
          success: false,
          error: 'Operasi ditolak oleh sistem keamanan: Anda tidak memiliki izin mengubah status akun ini.',
        };
      }

      // Fallback service role
      const adminClient = createAdminClient();
      const { error: adminErr } = await adminClient
        .from('profiles')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUserId);

      if (adminErr) {
        console.error('Error toggleUserStatus via adminClient:', adminErr);
        return { success: false, error: 'Gagal memperbarui status keaktifan akun pengguna.' };
      }
    }

    revalidatePath('/admin/pengguna');
    revalidatePath(`/admin/pengguna/${targetUserId}`);

    return { success: true };
  } catch (err) {
    console.error('Error saat toggleUserStatus:', err);
    return { success: false, error: 'Terjadi kesalahan sistem saat mengubah status pengguna.' };
  }
}
