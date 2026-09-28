import { partnerById } from "../data/partners";
import { useAppStore } from "../store/useAppStore";
import type { ChainLink } from "../types";
import { Icon, IconTile } from "./IconTile";
import { ProgressIndicator } from "./Progress";

export function ChainRow({
  link,
  isLast,
  onOpen,
}: {
  link: ChainLink;
  isLast?: boolean;
  onOpen: (id: string) => void;
}) {
  const state = useAppStore((s) => s.linkStates[link.id]) ?? {
    current: 0,
    status: "progress" as const,
  };
  const from = partnerById(link.fromId);
  const to = partnerById(link.toId);

  const statusTone =
    state.status === "redeemed" ? "lime" : state.status === "ready" ? "accent" : "ink";

  return (
    <button
      type="button"
      onClick={() => onOpen(link.id)}
      className="group flex w-full flex-col gap-3 border-b border-[var(--color-line)] py-4 text-left last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <IconTile name={from.icon} tone={statusTone === "ink" ? "ink" : statusTone} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-[var(--color-ink)]">
            {from.name}
          </p>
          <p className="truncate text-[13px] text-[var(--color-muted)]">{link.earnLabel}</p>
        </div>
        <ProgressIndicator current={state.current} goal={link.goal} unit={link.unit} />
      </div>

      <div className="flex items-center gap-3 pl-[18px]">
        <div className="flex h-full w-9 shrink-0 justify-center">
          <div className="h-6 w-px border-l border-dashed border-[var(--color-accent)] opacity-60" />
        </div>
        <div className="flex items-center gap-1.5 text-[13px]">
          <Icon name="CornerDownRight" size={14} className="text-[var(--color-accent)]" />
          <span className="font-semibold text-[var(--color-accent)]">
            Unlocks {link.rewardText}
          </span>
          <span className="text-[var(--color-muted)]">at</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-[18px]">
        <div className="w-9 shrink-0" />
        <IconTile name={to.icon} tone="accent" size="sm" />
        <p className="text-[14px] font-semibold text-[var(--color-accent)]">{to.name}</p>
        {state.status === "redeemed" && (
          <span className="ml-auto rounded-full bg-[var(--color-lime-tint)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-lime)]">
            Redeemed
          </span>
        )}
        {state.status === "ready" && (
          <span className="ml-auto rounded-full bg-[var(--color-accent-tint)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-accent)]">
            Ready
          </span>
        )}
        {isLast && state.status === "progress" && (
          <span className="ml-auto rounded-full border border-[var(--color-line)] px-2 py-0.5 text-[11px] text-[var(--color-muted)]">
            Loop closes
          </span>
        )}
      </div>
    </button>
  );
}
