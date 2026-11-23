'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';

export interface StorageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImage(
  formData: FormData,
  bucket: 'motifs' | 'outfits'
): Promise<StorageUploadResult> {
  try {
    await requireAdmin();

    const file = formData.get('file') as File | null;
    const prefixRaw = (formData.get('prefix') as string | null) || bucket;
    const safePrefix = prefixRaw.replace(/[^a-z0-9-]/gi, '').toLowerCase() || bucket;

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: 'Berkas gambar belum dipilih.' };
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: 'Ukuran berkas melebihi batas 5 MB.' };
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: 'Format berkas harus JPG, PNG, atau WebP.' };
    }

    let ext = 'jpg';
    if (file.type === 'image/png') ext = 'png';
    else if (file.type === 'image/webp') ext = 'webp';

    const fileName = `${safePrefix}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const adminClient = createAdminClient();
    const { error: uploadError } = await adminClient.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(`Upload to bucket ${bucket} error:`, uploadError);
      return { success: false, error: 'Gagal mengunggah berkas ke penyimpanan server.' };
    }

    const { data: urlData } = adminClient.storage.from(bucket).getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (err) {
    console.error('Error saat uploadImage:', err);
    return { success: false, error: 'Terjadi kesalahan sistem saat unggah gambar.' };
  }
}
