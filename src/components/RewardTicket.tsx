import { partnerById } from "../data/partners";
import type { ChainLink, LinkState } from "../types";
import { Icon, IconTile } from "./IconTile";
import { unitLabel } from "./Progress";

export function RewardTicket({
  link,
  state,
  onOpen,
}: {
  link: ChainLink;
  state: LinkState;
  onOpen: () => void;
}) {
  const to = partnerById(link.toId);
  const from = partnerById(link.fromId);
  const isReady = state.status === "ready";
  const isRedeemed = state.status === "redeemed";

  return (
    <button
      onClick={onOpen}
      className={`glass-tint relative flex w-full items-stretch overflow-hidden rounded-[22px] text-left transition-transform active:scale-[0.98] ${
        isRedeemed ? "opacity-60" : ""
      }`}
      style={{
        background: isReady
          ? "var(--color-accent-tint)"
          : isRedeemed
            ? "var(--color-lime-tint)"
            : "var(--glass-bg)",
      }}
    >
      <div className="flex flex-1 items-start gap-3 py-4 pl-4 pr-3">
        <IconTile name={to.icon} tone={isReady ? "accent" : isRedeemed ? "lime" : "ink"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[var(--color-ink)]">
            {link.rewardText}
          </p>
          <p className="truncate text-[12px] text-[var(--color-muted)]">at {to.name}</p>
          {!isRedeemed && (
            <p className="mt-1 truncate text-[11px] text-[var(--color-muted)]">
              Earn at {from.name} · {unitLabel(link.unit, state.current, link.goal)}
            </p>
          )}
        </div>
      </div>

      <div
        className="relative flex w-16 shrink-0 flex-col items-center justify-center gap-1 border-l border-dashed"
        style={{ borderColor: "var(--color-line)" }}
      >
        <div
          className="absolute -top-2 left-[-8px] h-4 w-4 rounded-full"
          style={{ background: "var(--color-bg)" }}
        />
        <div
          className="absolute -bottom-2 left-[-8px] h-4 w-4 rounded-full"
          style={{ background: "var(--color-bg)" }}
        />
        <Icon
          name={isRedeemed ? "CheckCircle2" : isReady ? "QrCode" : "Lock"}
          size={18}
          className={
            isRedeemed
              ? "text-[var(--color-lime)]"
              : isReady
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-muted)]"
          }
        />
        <span className="text-[9px] font-medium uppercase tracking-wide text-[var(--color-muted)]">
          {isRedeemed ? "Used" : isReady ? "Ready" : "Locked"}
        </span>
      </div>
    </button>
  );
}
