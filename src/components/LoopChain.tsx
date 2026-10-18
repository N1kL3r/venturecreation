import { partnerById } from "../data/partners";
import { useLoopData } from "../hooks/useLoopData";
import { useAppStore } from "../store/useAppStore";
import { Icon } from "./IconTile";

export function LoopChain({
  loopId,
  onSelectLink,
}: {
  loopId: string;
  onSelectLink: (linkId: string) => void;
}) {
  const linkStates = useAppStore((s) => s.linkStates);
  const { linksForLoop } = useLoopData();
  const chainLinks = linksForLoop(loopId);
  const closed = chainLinks.filter((l) => linkStates[l.id]?.status === "redeemed").length;
  const firstPartner = partnerById(chainLinks[0].fromId);

  return (
    <div className="glass glass-sheen rounded-[28px] px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-dim)]">
          Connected loop
        </span>
        <span className="text-xs text-[var(--color-muted)]">
          {closed}/{chainLinks.length} closed
        </span>
      </div>

      <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-1">
        {chainLinks.map((link) => {
          const partner = partnerById(link.fromId);
          const state = linkStates[link.id]?.status ?? "progress";
          const ringClass =
            state === "redeemed"
              ? "ring-2 ring-[var(--color-lime)]"
              : state === "ready"
                ? "ring-2 ring-[var(--color-accent)] animate-pulse-ring"
                : "ring-1 ring-[var(--color-line)]";
          return (
            <div key={link.id} className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSelectLink(link.id)}
                className={`glass glass-sheen flex h-14 w-14 items-center justify-center rounded-2xl text-[var(--color-ink)] transition-transform active:scale-90 ${ringClass}`}
                aria-label={partner.name}
              >
                <Icon name={partner.icon} size={22} />
              </button>
              <Icon name="ArrowRight" size={16} className="shrink-0 text-[var(--color-muted)]" />
            </div>
          );
        })}

        <div
          className="glass flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[var(--color-muted)] opacity-50"
          aria-hidden
        >
          <Icon name={firstPartner.icon} size={22} />
        </div>
      </div>

      <p className="mt-3 text-[12px] text-[var(--color-muted)]">
        Earn at one partner, the reward unlocks at the next — the loop closes back where it started.
      </p>
    </div>
  );
}
