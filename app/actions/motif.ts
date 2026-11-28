'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';
import { motifSchema, type MotifInput } from '@/lib/validators/motif';

export interface ActionResponse {
  success: boolean;
  error?: string;
  id?: string;
  url?: string;
}

/**
 * Hapus berkas dari storage bucket 'motifs' berdasarkan URL publiknya.
 */
async function removeStorageFile(url: string | null | undefined) {
  if (!url) return;
  try {
    const parts = url.split('/storage/v1/object/public/motifs/');
    if (parts.length === 2 && parts[1]) {
      const fileName = decodeURIComponent(parts[1]);
      const adminClient = createAdminClient();
      await adminClient.storage.from('motifs').remove([fileName]);
    }
  } catch (err) {
    console.warn('Gagal menghapus berkas lama dari storage:', err);
  }
}

/**
 * Unggah gambar motif ke bucket 'motifs' (JPG/PNG/WebP, maks. 5 MB)
 */
export async function uploadMotifImage(formData: FormData): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const file = formData.get('file') as File | null;
    const slugRaw = (formData.get('slug') as string | null) || 'motif';
    const safeSlug = slugRaw.replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'motif';

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: 'Berkas gambar belum dipilih.' };
    }

    // Validasi ukuran maksimal 5 MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: 'Ukuran berkas maksimal 5 MB.' };
    }

    // Validasi tipe berkas
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: 'Format berkas harus JPG, PNG, atau WebP.' };
    }

    let ext = 'jpg';
    if (file.type === 'image/png') ext = 'png';
    else if (file.type === 'image/webp') ext = 'webp';

    const fileName = `${safeSlug}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const adminClient = createAdminClient();
    const { error: uploadError } = await adminClient.storage
      .from('motifs')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload motif image error:', uploadError);
      return { success: false, error: 'Gagal mengunggah berkas gambar ke storage.' };
    }

    const { data: urlData } = adminClient.storage.from('motifs').getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (err) {
    console.error('Error saat uploadMotifImage:', err);
    return { success: false, error: 'Terjadi kesalahan sistem saat unggah gambar.' };
  }
}

/**
 * Simpan motif (Tambah baru atau Ubah)
 */
export async function saveMotif(
  input: MotifInput,
  oldImageUrl?: string | null
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const parsed = motifSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Data form motif tidak valid.',
      };
    }

    const data = parsed.data;
    const supabase = await createClient();

    // 1. Cek keunikan slug (selain id motif yang sedang diubah)
    let slugCheckQuery = supabase
      .from('motifs')
      .select('id')
      .eq('slug', data.slug);

    if (data.id) {
      slugCheckQuery = slugCheckQuery.neq('id', data.id);
    }

    const { data: existingSlug } = await slugCheckQuery.maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: `Slug "${data.slug}" sudah digunakan oleh motif lain. Buat slug yang berbeda.`,
      };
    }

    let savedMotifId = data.id;

    // 2. Simpan atau perbarui baris di tabel motifs
    if (data.id) {
      const { error: updateError } = await supabase
        .from('motifs')
        .update({
          nama: data.nama,
          slug: data.slug,
          daerah_asal: data.daerah_asal || null,
          deskripsi: data.deskripsi || null,
          makna_filosofi: data.makna_filosofi || null,
          sejarah: data.sejarah || null,
          warna_dominan: data.warna_dominan,
          gambar_url: data.gambar_url || null,
          is_published: data.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error update motif:', updateError);
        return { success: false, error: updateError.message };
      }
    } else {
      const { data: newRow, error: insertError } = await supabase
        .from('motifs')
        .insert({
          nama: data.nama,
          slug: data.slug,
          daerah_asal: data.daerah_asal || null,
          deskripsi: data.deskripsi || null,
          makna_filosofi: data.makna_filosofi || null,
          sejarah: data.sejarah || null,
          warna_dominan: data.warna_dominan,
          gambar_url: data.gambar_url || null,
          is_published: data.is_published,
        })
        .select('id')
        .single();

      if (insertError || !newRow) {
        console.error('Error insert motif:', insertError);
        return { success: false, error: insertError?.message || 'Gagal menambahkan motif.' };
      }

      savedMotifId = newRow.id;
    }

    // 3. Simpan relasi skintone secara atomik (hapus lalu sisipkan ulang)
    if (savedMotifId) {
      await supabase
        .from('motif_skintone_match')
        .delete()
        .eq('motif_id', savedMotifId);

      if (data.skintone_matches && data.skintone_matches.length > 0) {
        const matchesToInsert = data.skintone_matches.map((item) => ({
          motif_id: savedMotifId as string,
          skintone_id: item.skintone_id,
          skor_kecocokan: item.skor_kecocokan,
          catatan: item.catatan || null,
        }));

        const { error: matchInsertError } = await supabase
          .from('motif_skintone_match')
          .insert(matchesToInsert);

        if (matchInsertError) {
          console.error('Error insert skintone matches:', matchInsertError);
        }
      }
    }

    // 4. Hapus berkas lama jika gambar diganti
    if (oldImageUrl && oldImageUrl !== data.gambar_url) {
      await removeStorageFile(oldImageUrl);
    }

    // 5. Revalidasi halaman terkait
    revalidatePath('/');
    revalidatePath('/admin/motif');

    return {
      success: true,
      id: savedMotifId,
    };
  } catch (err) {
    console.error('Error saat saveMotif:', err);
    return { success: false, error: 'Gagal menyimpan data motif.' };
  }
}

/**
 * Toggle status terbitkan motif
 */
export async function togglePublishMotif(
  id: string,
  is_published: boolean
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from('motifs')
      .update({
        is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/motif');

    return { success: true };
  } catch (err) {
    console.error('Error saat togglePublishMotif:', err);
    return { success: false, error: 'Gagal mengubah status terbit motif.' };
  }
}

/**
 * Hapus motif beserta gambarnya di storage
 */
export async function deleteMotif(id: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // Ambil info motif untuk menghapus gambar storage dan revalidasi slug
    const { data: motif } = await supabase
      .from('motifs')
      .select('slug, gambar_url')
      .eq('id', id)
      .single();

    // Hapus dari tabel (cascade foreign key akan menghapus relasi otomatis)
    const { error: deleteError } = await supabase
      .from('motifs')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Hapus berkas gambar dari storage
    if (motif?.gambar_url) {
      await removeStorageFile(motif.gambar_url);
    }

    revalidatePath('/');
    revalidatePath('/admin/motif');

    return { success: true };
  } catch (err) {
    console.error('Error saat deleteMotif:', err);
    return { success: false, error: 'Gagal menghapus motif.' };
  }
}
