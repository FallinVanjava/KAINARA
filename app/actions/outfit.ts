'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';
import { outfitSchema, type OutfitInput } from '@/lib/validators/outfit';

export interface ActionResponse {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Hapus berkas gambar dari storage bucket 'outfits'
 */
async function removeOutfitStorageFile(url: string | null | undefined) {
  if (!url) return;
  try {
    const parts = url.split('/storage/v1/object/public/outfits/');
    if (parts.length === 2 && parts[1]) {
      const fileName = decodeURIComponent(parts[1]);
      const adminClient = createAdminClient();
      await adminClient.storage.from('outfits').remove([fileName]);
    }
  } catch (err) {
    console.warn('Gagal menghapus berkas lama dari storage outfits:', err);
  }
}

/**
 * Simpan data Outfit (Tambah baru atau Ubah)
 */
export async function saveOutfit(
  input: OutfitInput,
  oldImageUrl?: string | null
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const parsed = outfitSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Data outfit tidak valid.',
      };
    }

    const data = parsed.data;
    const supabase = await createClient();

    // 1. Cek keunikan nama outfit
    let nameCheckQuery = supabase
      .from('outfits')
      .select('id')
      .ilike('nama', data.nama);

    if (data.id) {
      nameCheckQuery = nameCheckQuery.neq('id', data.id);
    }

    const { data: existingName } = await nameCheckQuery.maybeSingle();
    if (existingName) {
      return {
        success: false,
        error: `Nama outfit "${data.nama}" sudah digunakan. Gunakan nama yang berbeda.`,
      };
    }

    let savedOutfitId = data.id;

    // 2. Simpan atau perbarui data tabel outfits
    if (data.id) {
      const { error: updateError } = await supabase
        .from('outfits')
        .update({
          nama: data.nama,
          deskripsi: data.deskripsi || null,
          kategori: data.kategori,
          warna_utama: data.warna_utama || null,
          gambar_url: data.gambar_url || null,
          is_published: data.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error update outfit:', updateError);
        return { success: false, error: updateError.message };
      }
    } else {
      const { data: newRow, error: insertError } = await supabase
        .from('outfits')
        .insert({
          nama: data.nama,
          deskripsi: data.deskripsi || null,
          kategori: data.kategori,
          warna_utama: data.warna_utama || null,
          gambar_url: data.gambar_url || null,
          is_published: data.is_published,
        })
        .select('id')
        .single();

      if (insertError || !newRow) {
        console.error('Error insert outfit:', insertError);
        return { success: false, error: insertError?.message || 'Gagal menambahkan outfit.' };
      }

      savedOutfitId = newRow.id;
    }

    // 3. Simpan relasi outfit_motif secara atomik
    if (savedOutfitId) {
      await supabase
        .from('outfit_motif')
        .delete()
        .eq('outfit_id', savedOutfitId);

      if (data.motif_ids && data.motif_ids.length > 0) {
        const pairsToInsert = data.motif_ids.map((motifId) => ({
          outfit_id: savedOutfitId as string,
          motif_id: motifId,
        }));

        const { error: pairError } = await supabase
          .from('outfit_motif')
          .insert(pairsToInsert);

        if (pairError) {
          console.error('Error insert outfit_motif:', pairError);
        }
      }
    }

    // 4. Hapus berkas lama jika gambar diganti
    if (oldImageUrl && oldImageUrl !== data.gambar_url) {
      await removeOutfitStorageFile(oldImageUrl);
    }

    // 5. Revalidasi cache
    revalidatePath('/');
    revalidatePath('/admin/outfit');

    return {
      success: true,
      id: savedOutfitId,
    };
  } catch (err) {
    console.error('Error saat saveOutfit:', err);
    return { success: false, error: 'Gagal menyimpan rekomendasi outfit.' };
  }
}

/**
 * Toggle status terbitkan outfit
 */
export async function togglePublishOutfit(
  id: string,
  is_published: boolean
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from('outfits')
      .update({
        is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/outfit');

    return { success: true };
  } catch (err) {
    console.error('Error saat togglePublishOutfit:', err);
    return { success: false, error: 'Gagal mengubah status terbit outfit.' };
  }
}

/**
 * Hapus outfit beserta gambarnya di storage
 */
export async function deleteOutfit(id: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // Dapatkan URL gambar terlebih dahulu
    const { data: outfit } = await supabase
      .from('outfits')
      .select('gambar_url')
      .eq('id', id)
      .single();

    // Hapus baris outfit (foreign key cascade menghapus outfit_motif secara otomatis)
    const { error: deleteError } = await supabase
      .from('outfits')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Hapus gambar dari storage bucket jika ada
    if (outfit?.gambar_url) {
      await removeOutfitStorageFile(outfit.gambar_url);
    }

    revalidatePath('/');
    revalidatePath('/admin/outfit');

    return { success: true };
  } catch (err) {
    console.error('Error saat deleteOutfit:', err);
    return { success: false, error: 'Gagal menghapus rekomendasi outfit.' };
  }
}
