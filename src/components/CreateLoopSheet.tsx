import { useEffect, useState } from "react";
import { partners, unitMeta } from "../data/partners";
import { useAppStore } from "../store/useAppStore";
import type { Unit } from "../types";
import { Icon, IconTile } from "./IconTile";
import { Sheet } from "./Sheet";

const unitOptions: { value: Unit; label: string }[] = [
  { value: "stamps", label: "Stamps" },
  { value: "visits", label: "Visits" },
  { value: "purchases", label: "Purchases" },
  { value: "referrals", label: "Referrals" },
  { value: "classes", label: "Classes" },
  { value: "kr", label: "Kr spent" },
];

const MIN_PARTNERS = 3;
const MAX_PARTNERS = 6;

export function CreateLoopSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createCustomLoop = useAppStore((s) => s.createCustomLoop);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [unit, setUnit] = useState<Unit>("stamps");
  const [goal, setGoal] = useState(unitMeta.stamps.min);
  const [rewardText, setRewardText] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setSelected([]);
    setUnit("stamps");
    setGoal(unitMeta.stamps.min);
    setRewardText("");
  }, [open]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= MAX_PARTNERS) return prev;
      return [...prev, id];
    });
  }

  function changeUnit(u: Unit) {
    setUnit(u);
    setGoal(unitMeta[u].min);
  }

  const canCreate = selected.length >= MIN_PARTNERS && rewardText.trim().length > 0;

  function handleCreate() {
    if (!canCreate) return;
    createCustomLoop({ name, partnerIds: selected, unit, goal, rewardText });
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="px-5 pt-2 pb-2">
        <div className="mb-5 flex items-center gap-3">
          <IconTile name="Shapes" tone="accent" />
          <div>
            <h2 className="font-display text-[19px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
              Create a loop
            </h2>
            <p className="text-[12px] text-[var(--color-muted)]">
              Pick {MIN_PARTNERS}+ partners to link into a closed loop
            </p>
          </div>
        </div>

        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
          Loop name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Weekend Loop"
          className="glass-tint mb-5 w-full rounded-2xl px-4 py-3 text-[14px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
        />

        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
            Order the partners
          </label>
          <span className="text-xs text-[var(--color-muted)]">
            {selected.length}/{MAX_PARTNERS}
          </span>
        </div>

        {selected.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {selected.map((id, i) => {
              const p = partners.find((pp) => pp.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  className="glass-tint flex items-center gap-1.5 rounded-full bg-[var(--color-accent-tint)] py-1.5 pl-3 pr-2 text-xs font-medium text-[var(--color-ink)]"
                >
                  <span className="text-[var(--color-accent)]">{i + 1}</span>
                  {p.name}
                  <Icon name="X" size={12} className="text-[var(--color-muted)]" />
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mb-3 text-[12px] text-[var(--color-muted)]">
            Tap partners below, in the order the loop should flow
          </p>
        )}

        <div className="scrollbar-none mb-5 grid max-h-52 grid-cols-3 gap-2 overflow-y-auto pb-1 pr-0.5">
          {partners.map((p) => {
            const idx = selected.indexOf(p.id);
            const picked = idx !== -1;
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`glass relative flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center ${
                  picked ? "ring-2 ring-[var(--color-accent)]" : ""
                }`}
              >
                {picked && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-white">
                    {idx + 1}
                  </span>
                )}
                <IconTile name={p.icon} tone={picked ? "accent" : "ink"} size="sm" />
                <p className="truncate text-[11px] font-medium leading-tight text-[var(--color-ink)]">
                  {p.name}
                </p>
              </button>
            );
          })}
        </div>

        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
          The rule — applies to every hop
        </label>
        <div className="mb-3 flex flex-wrap gap-2">
          {unitOptions.map((o) => {
            const active = unit === o.value;
            return (
              <button
                key={o.value}
                onClick={() => changeUnit(o.value)}
                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  active
                    ? "glass-tint border-transparent bg-[var(--color-accent-tint)] text-[var(--color-accent)]"
                    : "border-[var(--color-line)] text-[var(--color-ink-dim)]"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="glass mb-4 flex items-center justify-between rounded-2xl px-4 py-3">
          <span className="text-[13px] text-[var(--color-ink-dim)]">Goal per hop</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGoal((g) => Math.max(unitMeta[unit].min, g - unitMeta[unit].step))}
              className="glass-tint flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink)]"
              aria-label="Decrease goal"
            >
              <Icon name="Minus" size={14} />
            </button>
            <span className="min-w-[4.5rem] text-center text-[14px] font-semibold text-[var(--color-ink)]">
              {goal} {unitMeta[unit].label}
            </span>
            <button
              onClick={() => setGoal((g) => g + unitMeta[unit].step)}
              className="glass-tint flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink)]"
              aria-label="Increase goal"
            >
              <Icon name="Plus" size={14} />
            </button>
          </div>
        </div>

        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
          Reward at each stop
        </label>
        <input
          value={rewardText}
          onChange={(e) => setRewardText(e.target.value)}
          placeholder="e.g. 10% off"
          className="glass-tint mb-6 w-full rounded-2xl px-4 py-3 text-[14px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
        />

        <button
          onClick={handleCreate}
          disabled={!canCreate}
          className="glass-sheen flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] py-3.5 text-[15px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          <Icon name="Sparkles" size={16} />
          {selected.length >= MIN_PARTNERS
            ? `Create loop with ${selected.length} partners`
            : `Pick at least ${MIN_PARTNERS} partners`}
        </button>
      </div>
    </Sheet>
  );
}
