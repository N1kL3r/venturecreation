import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { loops } from "../data/partners";
import { useAppStore } from "../store/useAppStore";
import { Icon } from "./IconTile";

export function ProfileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const resetDemo = useAppStore((s) => s.resetDemo);
  const linkStates = useAppStore((s) => s.linkStates);
  const stats = useMemo(() => {
    const all = Object.values(linkStates);
    const redeemed = all.filter((l) => l.status === "redeemed").length;
    const inProgress = all.filter((l) => l.status === "progress").length;
    const totalStamps = all.reduce((sum, l) => sum + l.current, 0);
    const loopsClosed = loops.filter((loop) =>
      loop.linkIds.every((id) => linkStates[id]?.status === "redeemed")
    ).length;
    return { loopsClosed, redeemed, inProgress, totalStamps };
  }, [linkStates]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[30rem] justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="glass-strong relative z-10 flex h-full w-[84%] max-w-xs flex-col rounded-l-[32px] border-r-0 px-5 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Profile
              </span>
              <button onClick={onClose} className="text-[var(--color-muted)]">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="glass-tint flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-tint)] text-[var(--color-accent)]">
                <Icon name="User" size={24} />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[var(--color-ink)]">Niklas</p>
                <p className="text-[12px] text-[var(--color-muted)]">Member since Sep 2025</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <StatTile icon="Repeat" label="Loops closed" value={stats.loopsClosed} />
              <StatTile icon="Ticket" label="Rewards redeemed" value={stats.redeemed} />
              <StatTile icon="Flame" label="Chains in progress" value={stats.inProgress} />
              <StatTile icon="Award" label="Total taps logged" value={stats.totalStamps} />
            </div>

            <div className="glass mt-6 flex items-center justify-between rounded-2xl px-4 py-3.5">
              <div className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                <Icon name={theme === "dark" ? "Moon" : "Sun"} size={16} />
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </div>
              <button
                onClick={toggleTheme}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  theme === "dark" ? "bg-[var(--color-accent)]" : "bg-[var(--color-line)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={resetDemo}
              className="glass mt-3 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium text-[var(--color-ink-dim)] transition-transform active:scale-[0.98]"
            >
              <Icon name="RotateCcw" size={15} />
              Reset demo progress
            </button>

            <Link
              to="/merchant"
              onClick={onClose}
              className="glass mt-3 flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-transform active:scale-[0.98]"
            >
              <Icon name="Store" size={16} className="text-[var(--color-accent)]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-ink)]">Merchant console</p>
                <p className="text-[11px] text-[var(--color-muted)]">Verify codes as a store (demo)</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-[var(--color-muted)]" />
            </Link>

            <div className="glass mt-auto rounded-2xl p-4 text-[12px] leading-relaxed text-[var(--color-muted)]">
              <p className="mb-1 font-semibold text-[var(--color-ink-dim)]">How Lizly works</p>
              Every reward you unlock is redeemed at a different business than where you
              earned it — so loyalty flows between shops instead of sitting in one.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function StatTile({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="glass glass-sheen rounded-2xl p-3.5">
      <Icon name={icon} size={16} className="text-[var(--color-accent)]" />
      <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">{value}</p>
      <p className="text-[11px] leading-tight text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
