import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteStoreState {
  favoriteMotifIds: string[];
  favoriteOutfitIds: string[];
  addFavoriteMotif: (id: string) => void;
  removeFavoriteMotif: (id: string) => void;
  toggleFavoriteMotif: (id: string) => void;
  isMotifFavorited: (id: string) => boolean;
  addFavoriteOutfit: (id: string) => void;
  removeFavoriteOutfit: (id: string) => void;
  toggleFavoriteOutfit: (id: string) => void;
  isOutfitFavorited: (id: string) => boolean;
  clearAllFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStoreState>()(
  persist(
    (set, get) => ({
      favoriteMotifIds: [],
      favoriteOutfitIds: [],

      addFavoriteMotif: (id) =>
        set((state) => ({
          favoriteMotifIds: state.favoriteMotifIds.includes(id)
            ? state.favoriteMotifIds
            : [...state.favoriteMotifIds, id],
        })),

      removeFavoriteMotif: (id) =>
        set((state) => ({
          favoriteMotifIds: state.favoriteMotifIds.filter((m) => m !== id),
        })),

      toggleFavoriteMotif: (id) =>
        set((state) => ({
          favoriteMotifIds: state.favoriteMotifIds.includes(id)
            ? state.favoriteMotifIds.filter((m) => m !== id)
            : [...state.favoriteMotifIds, id],
        })),

      isMotifFavorited: (id) => get().favoriteMotifIds.includes(id),

      addFavoriteOutfit: (id) =>
        set((state) => ({
          favoriteOutfitIds: state.favoriteOutfitIds.includes(id)
            ? state.favoriteOutfitIds
            : [...state.favoriteOutfitIds, id],
        })),

      removeFavoriteOutfit: (id) =>
        set((state) => ({
          favoriteOutfitIds: state.favoriteOutfitIds.filter((o) => o !== id),
        })),

      toggleFavoriteOutfit: (id) =>
        set((state) => ({
          favoriteOutfitIds: state.favoriteOutfitIds.includes(id)
            ? state.favoriteOutfitIds.filter((o) => o !== id)
            : [...state.favoriteOutfitIds, id],
        })),

      isOutfitFavorited: (id) => get().favoriteOutfitIds.includes(id),

      clearAllFavorites: () =>
        set(() => ({
          favoriteMotifIds: [],
          favoriteOutfitIds: [],
        })),
    }),
    {
      name: "kainara-favorites-v2",
      version: 1,
    }
  )
);

