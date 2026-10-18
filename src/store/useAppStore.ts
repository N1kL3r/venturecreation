import { create } from "zustand";
import { persist } from "zustand/middleware";
import { earnLabelFor, linkById, links, loops } from "../data/partners";
import type { ChainLink, LinkState, Loop, Unit } from "../types";

export type RedeemAtPartnerResult =
  | { ok: true; links: ChainLink[] }
  | { ok: false; reason: "invalid_code" }
  | { ok: false; reason: "none_ready" };

const customLoopAccents = ["#A78BFA", "#38BDF8", "#F472B6", "#FB923C", "#2DD4BF"];

function makePassCode() {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `LIZLY-PASS-${rand.slice(0, 4)}-${rand.slice(4, 8)}`;
}

const seedState: Record<string, LinkState> = {
  "link-brew-sauna": { current: 4, status: "progress" },
  "link-sauna-pulse": { current: 3, status: "ready" },
  "link-pulse-havre": { current: 0, status: "progress" },
  "link-havre-wool": { current: 150, status: "progress" },
  "link-wool-brew": {
    current: 3,
    status: "redeemed",
    redeemedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  "link-bloom-vinyl": { current: 2, status: "progress" },
  "link-vinyl-barber": { current: 3, status: "ready" },
  "link-barber-press": { current: 1, status: "progress" },
  "link-press-bloom": { current: 0, status: "progress" },
  "link-yoga-gronn": {
    current: 6,
    status: "redeemed",
    redeemedAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  "link-gronn-massasje": { current: 120, status: "progress" },
  "link-massasje-yoga": { current: 0, status: "progress" },
};

interface CreateCustomLoopParams {
  name: string;
  partnerIds: string[];
  unit: Unit;
  goal: number;
  rewardText: string;
}

interface AppState {
  theme: "dark" | "light";
  onboarded: boolean;
  passCode: string;
  linkStates: Record<string, LinkState>;
  activeLoopId: string;
  customLoops: Loop[];
  customLinks: ChainLink[];
  toggleTheme: () => void;
  completeOnboarding: () => void;
  setActiveLoop: (id: string) => void;
  simulate: (linkId: string, amount?: number) => void;
  redeemAtPartner: (code: string, partnerId: string) => RedeemAtPartnerResult;
  createCustomLoop: (params: CreateCustomLoopParams) => void;
  deleteCustomLoop: (loopId: string) => void;
  resetDemo: () => void;
  loopClosedCount: (loopId: string) => number;
  stats: () => { loopsClosed: number; redeemed: number; inProgress: number; totalStamps: number };
}

function resolveLink(customLinks: ChainLink[], linkId: string): ChainLink {
  return customLinks.find((l) => l.id === linkId) ?? linkById(linkId);
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      onboarded: false,
      passCode: makePassCode(),
      linkStates: seedState,
      activeLoopId: loops[0].id,
      customLoops: [],
      customLinks: [],

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      completeOnboarding: () => set({ onboarded: true }),

      setActiveLoop: (id) => set({ activeLoopId: id }),

      simulate: (linkId, amount = 1) =>
        set((s) => {
          const link = resolveLink(s.customLinks, linkId);
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

      redeemAtPartner: (code, partnerId) => {
        const s = get();
        if (code.trim().toUpperCase() !== s.passCode) {
          return { ok: false, reason: "invalid_code" };
        }

        const allLinks = [...links, ...s.customLinks];
        const readyIds = allLinks
          .filter((l) => l.toId === partnerId && s.linkStates[l.id]?.status === "ready")
          .map((l) => l.id);
        if (readyIds.length === 0) return { ok: false, reason: "none_ready" };

        const redeemedAt = Date.now();
        set((s2) => ({
          linkStates: {
            ...s2.linkStates,
            ...Object.fromEntries(
              readyIds.map((id) => [id, { ...s2.linkStates[id], status: "redeemed" as const, redeemedAt }])
            ),
          },
        }));
        return { ok: true, links: readyIds.map((id) => resolveLink(get().customLinks, id)) };
      },

      createCustomLoop: ({ name, partnerIds, unit, goal, rewardText }) =>
        set((s) => {
          const ts = Date.now();
          const loopId = `custom-${ts}`;
          const newLinks: ChainLink[] = partnerIds.map((fromId, i) => ({
            id: `custom-link-${ts}-${i}`,
            loopId,
            order: i,
            fromId,
            toId: partnerIds[(i + 1) % partnerIds.length],
            earnLabel: earnLabelFor(unit, goal),
            goal,
            unit,
            rewardText: rewardText.trim() || "A reward",
          }));
          const newLoop: Loop = {
            id: loopId,
            name: name.trim() || "My Loop",
            tagline: `${partnerIds.length} partners · your loop`,
            accent: customLoopAccents[s.customLoops.length % customLoopAccents.length],
            linkIds: newLinks.map((l) => l.id),
            isCustom: true,
          };
          return {
            customLoops: [...s.customLoops, newLoop],
            customLinks: [...s.customLinks, ...newLinks],
            linkStates: {
              ...s.linkStates,
              ...Object.fromEntries(
                newLinks.map((l) => [l.id, { current: 0, status: "progress" as const }])
              ),
            },
            activeLoopId: loopId,
          };
        }),

      deleteCustomLoop: (loopId) =>
        set((s) => {
          const loop = s.customLoops.find((l) => l.id === loopId);
          if (!loop) return s;
          const nextLinkStates = { ...s.linkStates };
          loop.linkIds.forEach((id) => delete nextLinkStates[id]);
          return {
            customLoops: s.customLoops.filter((l) => l.id !== loopId),
            customLinks: s.customLinks.filter((l) => l.loopId !== loopId),
            linkStates: nextLinkStates,
            activeLoopId: s.activeLoopId === loopId ? loops[0].id : s.activeLoopId,
          };
        }),

      resetDemo: () =>
        set({ linkStates: seedState, customLoops: [], customLinks: [], activeLoopId: loops[0].id }),

      loopClosedCount: (loopId) => {
        const s = get();
        const loop = [...loops, ...s.customLoops].find((l) => l.id === loopId)!;
        return loop.linkIds.filter((id) => s.linkStates[id]?.status === "redeemed").length;
      },

      stats: () => {
        const s = get();
        const all = Object.values(s.linkStates);
        const redeemed = all.filter((l) => l.status === "redeemed").length;
        const inProgress = all.filter((l) => l.status === "progress").length;
        const totalStamps = all.reduce((sum, l) => sum + l.current, 0);
        const loopsClosed = [...loops, ...s.customLoops].filter((loop) =>
          loop.linkIds.every((id) => s.linkStates[id]?.status === "redeemed")
        ).length;
        return { loopsClosed, redeemed, inProgress, totalStamps };
      },
    }),
    {
      name: "lizly-storage",
      version: 5,
      partialize: (s) => ({
        theme: s.theme,
        onboarded: s.onboarded,
        passCode: s.passCode,
        linkStates: s.linkStates,
        activeLoopId: s.activeLoopId,
        customLoops: s.customLoops,
        customLinks: s.customLinks,
      }),
    }
  )
);

export const allLinks = links;
