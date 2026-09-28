import type { Unit } from "../types";

export function unitLabel(unit: Unit, current: number, goal: number) {
  if (unit === "kr") return `${current} / ${goal} kr`;
  return `${current} of ${goal}`;
}

export function ProgressIndicator({
  current,
  goal,
  unit,
  compact = false,
}: {
  current: number;
  goal: number;
  unit: Unit;
  compact?: boolean;
}) {
  const useDots = goal <= 6 && unit !== "kr";
  const pct = Math.min(100, (current / goal) * 100);

  if (useDots) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {Array.from({ length: goal }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i < current ? "bg-[var(--color-accent)]" : "bg-[var(--color-line)]"
              }`}
            />
          ))}
        </div>
        {!compact && (
          <span className="text-xs text-[var(--color-muted)]">
            {current} of {goal}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-w-[92px] flex-col items-end gap-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-line)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {!compact && (
        <span className="text-xs text-[var(--color-muted)]">
          {unitLabel(unit, current, goal)}
        </span>
      )}
    </div>
  );
}
