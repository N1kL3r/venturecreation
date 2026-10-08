import { useMemo } from "react";
import { links as staticLinks, loops as staticLoops } from "../data/partners";
import { useAppStore } from "../store/useAppStore";
import type { ChainLink, Loop } from "../types";

export function useLoopData() {
  const customLoops = useAppStore((s) => s.customLoops);
  const customLinks = useAppStore((s) => s.customLinks);

  return useMemo(() => {
    const allLoops: Loop[] = [...staticLoops, ...customLoops];
    const allLinks: ChainLink[] = [...staticLinks, ...customLinks];

    const loopById = (id: string): Loop => allLoops.find((l) => l.id === id)!;
    const linkById = (id: string): ChainLink => allLinks.find((l) => l.id === id)!;
    const linksForLoop = (loopId: string): ChainLink[] =>
      loopById(loopId).linkIds.map(linkById);
    const partnerLinks = (partnerId: string) => ({
      earns: allLinks.filter((l) => l.fromId === partnerId),
      redeems: allLinks.filter((l) => l.toId === partnerId),
    });

    return { allLoops, allLinks, loopById, linkById, linksForLoop, partnerLinks };
  }, [customLoops, customLinks]);
}
