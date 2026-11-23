export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'admin';
export type Undertone = 'warm' | 'cool' | 'neutral';
export type ScanType = 'motif' | 'skintone';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nama: string | null;
          email: string | null;
          role: UserRole;
          skintone_terakhir: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nama?: string | null;
          email?: string | null;
          role?: UserRole;
          skintone_terakhir?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama?: string | null;
          email?: string | null;
          role?: UserRole;
          skintone_terakhir?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_skintone_terakhir_fkey';
            columns: ['skintone_terakhir'];
            isOneToOne: false;
            referencedRelation: 'skintones';
            referencedColumns: ['id'];
          }
        ];
      };
      skintones: {
        Row: {
          id: string;
          nama: string;
          hex_color: string;
          undertone: Undertone;
          created_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          hex_color: string;
          undertone: Undertone;
          created_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          hex_color?: string;
          undertone?: Undertone;
          created_at?: string;
        };
        Relationships: [];
      };
      motifs: {
        Row: {
          id: string;
          nama: string;
          slug: string;
          daerah_asal: string | null;
          deskripsi: string | null;
          makna_filosofi: string | null;
          sejarah: string | null;
          warna_dominan: string[];
          gambar_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          slug: string;
          daerah_asal?: string | null;
          deskripsi?: string | null;
          makna_filosofi?: string | null;
          sejarah?: string | null;
          warna_dominan?: string[];
          gambar_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          slug?: string;
          daerah_asal?: string | null;
          deskripsi?: string | null;
          makna_filosofi?: string | null;
          sejarah?: string | null;
          warna_dominan?: string[];
          gambar_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      motif_skintone_match: {
        Row: {
          motif_id: string;
          skintone_id: string;
          skor_kecocokan: number;
          catatan: string | null;
        };
        Insert: {
          motif_id: string;
          skintone_id: string;
          skor_kecocokan?: number;
          catatan?: string | null;
        };
        Update: {
          motif_id?: string;
          skintone_id?: string;
          skor_kecocokan?: number;
          catatan?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'motif_skintone_match_motif_id_fkey';
            columns: ['motif_id'];
            isOneToOne: false;
            referencedRelation: 'motifs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'motif_skintone_match_skintone_id_fkey';
            columns: ['skintone_id'];
            isOneToOne: false;
            referencedRelation: 'skintones';
            referencedColumns: ['id'];
          }
        ];
      };
      outfits: {
        Row: {
          id: string;
          nama: string;
          deskripsi: string | null;
          gambar_url: string | null;
          kategori: string | null;
          warna_utama: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          deskripsi?: string | null;
          gambar_url?: string | null;
          kategori?: string | null;
          warna_utama?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          deskripsi?: string | null;
          gambar_url?: string | null;
          kategori?: string | null;
          warna_utama?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      outfit_motif: {
        Row: {
          outfit_id: string;
          motif_id: string;
        };
        Insert: {
          outfit_id: string;
          motif_id: string;
        };
        Update: {
          outfit_id?: string;
          motif_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'outfit_motif_outfit_id_fkey';
            columns: ['outfit_id'];
            isOneToOne: false;
            referencedRelation: 'outfits';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'outfit_motif_motif_id_fkey';
            columns: ['motif_id'];
            isOneToOne: false;
            referencedRelation: 'motifs';
            referencedColumns: ['id'];
          }
        ];
      };
      quiz_questions: {
        Row: {
          id: string;
          pertanyaan: string;
          opsi: string[];
          jawaban_benar: number; // 0-indexed
          penjelasan: string | null;
          motif_id: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          pertanyaan: string;
          opsi: string[] | Json;
          jawaban_benar: number; // 0-indexed
          penjelasan?: string | null;
          motif_id?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          pertanyaan?: string;
          opsi?: string[] | Json;
          jawaban_benar?: number; // 0-indexed
          penjelasan?: string | null;
          motif_id?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_questions_motif_id_fkey';
            columns: ['motif_id'];
            isOneToOne: false;
            referencedRelation: 'motifs';
            referencedColumns: ['id'];
          }
        ];
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string | null;
          skor: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          skor: number;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          skor?: number;
          total?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_attempts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      scan_logs: {
        Row: {
          id: string;
          user_id: string | null;
          tipe: ScanType;
          motif_id: string | null;
          skintone_id: string | null;
          hasil: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          tipe: ScanType;
          motif_id?: string | null;
          skintone_id?: string | null;
          hasil?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          tipe?: ScanType;
          motif_id?: string | null;
          skintone_id?: string | null;
          hasil?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'scan_logs_motif_id_fkey';
            columns: ['motif_id'];
            isOneToOne: false;
            referencedRelation: 'motifs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scan_logs_skintone_id_fkey';
            columns: ['skintone_id'];
            isOneToOne: false;
            referencedRelation: 'skintones';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scan_logs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_active_user: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      get_random_quiz: {
        Args: {
          p_limit?: number;
        };
        Returns: Database['public']['Tables']['quiz_questions']['Row'][];
      };
      admin_dashboard_summary: {
        Args: Record<PropertyKey, never>;
        Returns: {
          total_pengguna: number;
          pengguna_baru_7hari: number;
          total_scan_motif: number;
          total_scan_skintone: number;
          total_percobaan_kuis: number;
          rata_rata_skor_kuis: number;
          total_motif: number;
          total_outfit: number;
        };
      };
      admin_scan_per_day: {
        Args: {
          p_start?: string;
          p_end?: string;
        };
        Returns: {
          tanggal: string;
          scan_motif: number;
          scan_skintone: number;
        }[];
      };
      admin_top_motifs: {
        Args: {
          p_start?: string;
          p_end?: string;
          p_limit?: number;
        };
        Returns: {
          motif_id: string;
          nama: string;
          total: number;
        }[];
      };
      admin_skintone_distribution: {
        Args: Record<PropertyKey, never>;
        Returns: {
          skintone_id: string;
          nama: string;
          hex_color: string;
          total: number;
        }[];
      };
      admin_quiz_stats: {
        Args: {
          p_start?: string;
          p_end?: string;
        };
        Returns: {
          total_percobaan: number;
          rata_rata_skor_persen: number;
        }[];
      };
    };
    Enums: {
      user_role: UserRole;
      undertone: Undertone;
      scan_type: ScanType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Aliases for convenience
export type Profile = Tables<'profiles'>;
export type Skintone = Tables<'skintones'>;
export type Motif = Tables<'motifs'>;
export type MotifSkintoneMatch = Tables<'motif_skintone_match'>;
export type Outfit = Tables<'outfits'>;
export type OutfitMotif = Tables<'outfit_motif'>;
export type QuizQuestion = Tables<'quiz_questions'>;
export type QuizAttempt = Tables<'quiz_attempts'>;
export type ScanLog = Tables<'scan_logs'>;
