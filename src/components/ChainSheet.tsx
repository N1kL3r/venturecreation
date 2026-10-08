import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { partnerById } from "../data/partners";
import { useAppStore } from "../store/useAppStore";
import type { ChainLink, Unit } from "../types";
import { Confetti } from "./Confetti";
import { Icon, IconTile } from "./IconTile";
import { ProgressIndicator, unitLabel } from "./Progress";
import { Sheet } from "./Sheet";

const incrementFor: Record<Unit, number> = {
  stamps: 1,
  visits: 1,
  referrals: 1,
  purchases: 1,
  classes: 1,
  kr: 50,
};

const actionLabel: Record<Unit, string> = {
  stamps: "Log a stamp",
  visits: "Log this visit",
  referrals: "Log a referral",
  purchases: "Log a purchase",
  classes: "Log this class",
  kr: "Log 50 kr spent",
};

export function ChainSheet({
  link,
  onClose,
}: {
  link: ChainLink | null;
  onClose: () => void;
}) {
  const state = useAppStore((s) => (link ? s.linkStates[link.id] : undefined));
  const simulate = useAppStore((s) => s.simulate);
  const reveal = useAppStore((s) => s.reveal);
  const redeem = useAppStore((s) => s.redeem);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevStatus = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!link || !state) return;
    if (prevStatus.current === "progress" && state.status === "ready") {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 1000);
      return () => clearTimeout(t);
    }
    prevStatus.current = state.status;
  }, [state, link]);

  useEffect(() => {
    prevStatus.current = state?.status;
  }, [link?.id]);

  const from = link ? partnerById(link.fromId) : null;
  const to = link ? partnerById(link.toId) : null;
  const isRedeemed = state?.status === "redeemed";
  const isReady = state?.status === "ready";

  return (
    <Sheet open={!!link} onClose={onClose}>
      {link && state && from && to && (
      <div className="relative px-5 pt-2">
        {showConfetti && <Confetti />}

        <div className="flex items-center gap-3 border-b border-[var(--color-line)] pb-5">
          <IconTile name={from.icon} tone="ink" size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-semibold text-[var(--color-ink)]">{from.name}</p>
            <p className="text-[13px] text-[var(--color-muted)]">{link.earnLabel}</p>
          </div>
        </div>

        <div className="py-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Your progress
            </span>
            <span className="text-xs text-[var(--color-muted)]">
              {unitLabel(link.unit, state.current, link.goal)}
            </span>
          </div>
          <ProgressIndicator current={state.current} goal={link.goal} unit={link.unit} compact />

          {state.status === "progress" && (
            <button
              onClick={() => simulate(link.id, incrementFor[link.unit])}
              className="glass-tint mt-4 w-full rounded-2xl py-3 text-sm font-medium text-[var(--color-ink-dim)] transition-transform active:scale-[0.98]"
            >
              + {actionLabel[link.unit]}
            </button>
          )}
        </div>

        <div className="glass-tint flex items-center gap-2 rounded-2xl bg-[var(--color-accent-tint)] px-4 py-3">
          <Icon name="CornerDownRight" size={16} className="text-[var(--color-accent)]" />
          <p className="text-[13px] font-semibold text-[var(--color-accent)]">
            Unlocks {link.rewardText} at {to.name}
          </p>
        </div>

        <div className="glass glass-sheen mt-4 flex items-center gap-3 rounded-[22px] px-4 py-4">
          <IconTile name={to.icon} tone="accent" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">{to.name}</p>
            <p className="truncate text-[13px] text-[var(--color-muted)]">{to.address}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs text-[var(--color-muted)]">
            <Icon name="MapPin" size={13} />
            {to.walkTime}
          </div>
        </div>

        <div className="mt-6">
          {!isReady && !isRedeemed && (
            <div className="glass-tint flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-surface-2)]/50 py-4 text-sm text-[var(--color-muted)]">
              <Icon name="Lock" size={15} />
              Reach your goal to unlock the redeem code
            </div>
          )}

          {isReady && !state.code && (
            <button
              onClick={() => reveal(link.id)}
              className="glass-sheen flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] py-4 text-[15px] font-semibold text-white shadow-lg shadow-[var(--color-accent-tint)] transition-transform active:scale-[0.98]"
            >
              <Icon name="Sparkles" size={17} />
              Reveal your reward
            </button>
          )}

          {isReady && state.code && (
            <div className="glass glass-sheen flex flex-col items-center gap-4 rounded-[26px] py-6">
              <div className="rounded-xl bg-white p-3">
                <QRCodeSVG value={state.code} size={132} />
              </div>
              <div className="glass-tint flex items-center gap-2 rounded-full px-4 py-1.5">
                <span className="font-mono text-sm tracking-wider text-[var(--color-ink)]">
                  {state.code}
                </span>
              </div>
              <p className="px-8 text-center text-xs text-[var(--color-muted)]">
                Show this to staff at {to.name} to redeem
              </p>
              <button
                onClick={() => redeem(link.id)}
                className="glass-sheen mx-5 flex items-center gap-2 rounded-2xl bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] transition-transform active:scale-[0.98]"
              >
                <Icon name="Check" size={16} />
                Mark as redeemed
              </button>
            </div>
          )}

          {isRedeemed && (
            <div className="glass-tint flex flex-col items-center gap-3 rounded-[26px] bg-[var(--color-lime-tint)] py-6">
              <Icon name="CheckCircle2" size={28} className="text-[var(--color-lime)]" />
              <p className="text-sm font-semibold text-[var(--color-ink)]">Reward redeemed</p>
              {state.redeemedAt && (
                <p className="text-xs text-[var(--color-muted)]">
                  {new Date(state.redeemedAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl py-3 text-center text-sm font-medium text-[var(--color-muted)]"
        >
          Done
        </button>
      </div>
      )}
    </Sheet>
  );
}
