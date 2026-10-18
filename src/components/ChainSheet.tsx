import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { partnerById } from "../data/partners";
import { useAppStore } from "../store/useAppStore";
import type { ChainLink, Unit } from "../types";
import { Confetti } from "./Confetti";
import { Icon, IconTile } from "./IconTile";
import { ProgressIndicator, unitLabel } from "./Progress";
import { ScanOverlay } from "./ScanOverlay";
import { Sheet } from "./Sheet";

const incrementFor: Record<Unit, number> = {
  stamps: 1,
  visits: 1,
  referrals: 1,
  purchases: 1,
  classes: 1,
  kr: 50,
};

const scanCaption: Record<Unit, string> = {
  stamps: "logs a stamp",
  visits: "logs this visit",
  referrals: "logs a referral",
  purchases: "logs a purchase",
  classes: "logs this class",
  kr: "logs 50 kr spent",
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
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
    <>
    <Sheet open={!!link} onClose={onClose}>
      {link && state && from && to && (
      <div className="relative px-5 pt-2">
        {showConfetti && <Confetti />}

        <div className="flex items-start gap-3 border-b border-[var(--color-line)] pb-5">
          <IconTile name={from.icon} tone="ink" size="lg" />
          <div className="min-w-0 flex-1 pt-1">
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
            <>
              <button
                onClick={() => setScanOpen(true)}
                className="glass-sheen mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-ink)] py-3.5 text-sm font-semibold text-[var(--color-bg)] transition-transform active:scale-[0.98]"
              >
                <Icon name="ScanLine" size={16} />
                Scan to check in
              </button>
              <p className="mt-2 text-center text-[11px] text-[var(--color-muted)]">
                Scanning the code at {from.name}&rsquo;s counter {scanCaption[link.unit]}
              </p>
            </>
          )}
        </div>

        <div className="glass-tint flex items-start gap-2 rounded-2xl bg-[var(--color-accent-tint)] px-4 py-3">
          <Icon name="CornerDownRight" size={16} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
          <p className="text-[13px] font-semibold text-[var(--color-accent)]">
            Unlocks {link.rewardText} at {to.name}
          </p>
        </div>

        <div className="glass glass-sheen mt-4 flex items-start gap-3 rounded-[22px] px-4 py-4">
          <IconTile name={to.icon} tone="accent" />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">{to.name}</p>
            <p className="truncate text-[13px] text-[var(--color-muted)]">{to.address}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 self-center text-xs text-[var(--color-muted)]">
            <Icon name="MapPin" size={13} />
            {to.walkTime}
          </div>
        </div>

        <div className="mt-6">
          {!isReady && !isRedeemed && (
            <div className="glass-tint flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-surface-2)]/50 py-4 text-sm text-[var(--color-muted)]">
              <Icon name="Lock" size={15} />
              Reach your goal to add this reward to your Lizly Pass
            </div>
          )}

          {isReady && (
            <div className="glass glass-sheen flex flex-col items-center gap-3 rounded-[26px] px-6 py-6 text-center">
              <div className="glass-tint flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-tint)] text-[var(--color-accent)]">
                <Icon name="Wallet" size={22} />
              </div>
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">
                Already on your Lizly Pass
              </p>
              <p className="text-[12px] leading-relaxed text-[var(--color-muted)]">
                No separate code to reveal — show your one Lizly Pass at {to.name} and this
                reward is matched and redeemed automatically.
              </p>
              <Link
                to="/wallet"
                className="glass-sheen mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] py-3 text-[14px] font-semibold text-white transition-transform active:scale-[0.98]"
              >
                <Icon name="QrCode" size={16} />
                Open my Lizly Pass
              </Link>
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
    {link && from && (
      <ScanOverlay
        open={scanOpen}
        partnerName={from.name}
        partnerId={from.id}
        onDetected={() => {
          simulate(link.id, incrementFor[link.unit]);
          setScanOpen(false);
        }}
        onClose={() => setScanOpen(false)}
      />
    )}
    </>
  );
}
