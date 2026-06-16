import { create } from "zustand";
import { persist } from "zustand/middleware";

type Draft = {
  title: string;
  content: string;
  tag: string;
};

type NoteDraftStore = {
  draft: Draft;
  setDraft: (value: Partial<Draft>) => void;
  clearDraft: () => void;
};

const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: { ...initialDraft },

      setDraft: (value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...value,
          },
        })),

      clearDraft: () =>
        set({
          draft: { ...initialDraft },
        }),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({
        draft: state.draft,
      }),
    }
  )
);