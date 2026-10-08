import { useMemo, useState } from "react";
import { ChainRow } from "../components/ChainRow";
import { ChainSheet } from "../components/ChainSheet";
import { Icon } from "../components/IconTile";
import { LoopDiagram } from "../components/LoopDiagram";
import { LoopSelector } from "../components/LoopSelector";
import { useLoopData } from "../hooks/useLoopData";
import { useAppStore } from "../store/useAppStore";

export function HomePage() {
  const activeLoopId = useAppStore((s) => s.activeLoopId);
  const deleteCustomLoop = useAppStore((s) => s.deleteCustomLoop);
  const [openLinkId, setOpenLinkId] = useState<string | null>(null);
  const { loopById, linkById, linksForLoop } = useLoopData();
  const loop = loopById(activeLoopId);
  const chainLinks = useMemo(() => linksForLoop(activeLoopId), [activeLoopId, linksForLoop]);
  const openLink = openLinkId ? linkById(openLinkId) : null;

  return (
    <div className="flex-1 pb-28">
      <div className="glass-tint mx-5 mb-5 flex items-start gap-3 rounded-2xl bg-[var(--color-accent-tint)] px-4 py-3.5">
        <Icon name="ArrowRightLeft" size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
        <p className="text-[13px] font-medium leading-snug text-[var(--color-ink)]">
          Earn at one partner. Unlock a reward at another.
        </p>
      </div>

      <LoopSelector />

      <div className="mt-2 flex items-start justify-between px-5">
        <div>
          <p className="font-display text-[19px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
            {loop.name}
          </p>
          <p className="text-[13px] text-[var(--color-muted)]">{loop.tagline}</p>
        </div>
        {loop.isCustom && (
          <button
            onClick={() => {
              if (confirm(`Delete "${loop.name}"? This can't be undone.`)) {
                deleteCustomLoop(loop.id);
              }
            }}
            className="glass-tint mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)]"
            aria-label="Delete this loop"
          >
            <Icon name="Trash2" size={14} />
          </button>
        )}
      </div>

      <div className="mt-5">
        <LoopDiagram loopId={activeLoopId} onSelectLink={setOpenLinkId} />
      </div>

      <div className="mb-3 mt-7 flex items-center justify-between px-5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-dim)]">
          Your active chain
        </span>
        <span className="text-xs text-[var(--color-muted)]">
          {chainLinks.length} partners · closed loop
        </span>
      </div>

      <div className="px-5">
        {chainLinks.map((link, i) => (
          <ChainRow
            key={link.id}
            link={link}
            isLast={i === chainLinks.length - 1}
            onOpen={setOpenLinkId}
          />
        ))}
      </div>

      <ChainSheet link={openLink} onClose={() => setOpenLinkId(null)} />
    </div>
  );
}
