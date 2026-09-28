import { create } from "zustand";
import { persist } from "zustand/middleware";
import { linkById, links, loops } from "../data/partners";
import type { LinkState } from "../types";

function makeCode(linkId: string) {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LIZLY-${linkId.slice(5, 9).toUpperCase()}-${rand}`;
}

const seedState: Record<string, LinkState> = {
  "link-brew-sauna": { current: 4, status: "progress" },
  "link-sauna-pulse": { current: 3, status: "ready" },
  "link-pulse-havre": { current: 0, status: "progress" },
  "link-havre-wool": { current: 150, status: "progress" },
  "link-wool-brew": {
    current: 3,
    status: "redeemed",
    code: "LIZLY-BREW-9K2L",
    redeemedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  "link-bloom-vinyl": { current: 2, status: "progress" },
  "link-vinyl-barber": { current: 3, status: "ready" },
  "link-barber-press": { current: 1, status: "progress" },
  "link-press-bloom": { current: 0, status: "progress" },
  "link-yoga-gronn": {
    current: 6,
    status: "redeemed",
    code: "LIZLY-GRON-4F7Q",
    redeemedAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  "link-gronn-massasje": { current: 120, status: "progress" },
  "link-massasje-yoga": { current: 0, status: "progress" },
};

interface AppState {
  theme: "dark" | "light";
  onboarded: boolean;
  linkStates: Record<string, LinkState>;
  activeLoopId: string;
  toggleTheme: () => void;
  completeOnboarding: () => void;
  setActiveLoop: (id: string) => void;
  simulate: (linkId: string, amount?: number) => void;
  reveal: (linkId: string) => void;
  redeem: (linkId: string) => void;
  resetDemo: () => void;
  loopClosedCount: (loopId: string) => number;
  stats: () => { loopsClosed: number; redeemed: number; inProgress: number; totalStamps: number };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      onboarded: false,
      linkStates: seedState,
      activeLoopId: loops[0].id,

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      completeOnboarding: () => set({ onboarded: true }),

      setActiveLoop: (id) => set({ activeLoopId: id }),

      simulate: (linkId, amount = 1) =>
        set((s) => {
          const link = linkById(linkId);
          const prev = s.linkStates[linkId] ?? { current: 0, status: "progress" };
          if (prev.status !== "progress") return s;
          const next = Math.min(link.goal, prev.current + amount);
          return {
            linkStates: {
              ...s.linkStates,
              [linkId]: {
                ...prev,
                current: next,
                status: next >= link.goal ? "ready" : "progress",
              },
            },
          };
        }),

      reveal: (linkId) =>
        set((s) => {
          const prev = s.linkStates[linkId];
          if (!prev || prev.status !== "ready" || prev.code) return s;
          return {
            linkStates: {
              ...s.linkStates,
              [linkId]: { ...prev, code: makeCode(linkId) },
            },
          };
        }),

      redeem: (linkId) =>
        set((s) => {
          const prev = s.linkStates[linkId];
          if (!prev || prev.status !== "ready") return s;
          return {
            linkStates: {
              ...s.linkStates,
              [linkId]: {
                ...prev,
                status: "redeemed",
                code: prev.code ?? makeCode(linkId),
                redeemedAt: Date.now(),
              },
            },
          };
        }),

      resetDemo: () => set({ linkStates: seedState }),

      loopClosedCount: (loopId) => {
        const s = get();
        const loop = loops.find((l) => l.id === loopId)!;
        return loop.linkIds.filter((id) => s.linkStates[id]?.status === "redeemed").length;
      },

      stats: () => {
        const s = get();
        const all = Object.values(s.linkStates);
        const redeemed = all.filter((l) => l.status === "redeemed").length;
        const inProgress = all.filter((l) => l.status === "progress").length;
        const totalStamps = all.reduce((sum, l) => sum + l.current, 0);
        const loopsClosed = loops.filter((loop) =>
          loop.linkIds.every((id) => s.linkStates[id]?.status === "redeemed")
        ).length;
        return { loopsClosed, redeemed, inProgress, totalStamps };
      },
    }),
    {
      name: "lizly-storage",
      version: 3,
      partialize: (s) => ({
        theme: s.theme,
        onboarded: s.onboarded,
        linkStates: s.linkStates,
        activeLoopId: s.activeLoopId,
      }),
    }
  )
);

export const allLinks = links;
