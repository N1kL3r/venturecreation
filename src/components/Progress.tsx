import type { LinkStatus, Unit } from "../types";
import { Icon } from "./IconTile";

const RING_SIZE = 56;
const STROKE = 4;

const ringTone: Record<LinkStatus, string> = {
  progress: "var(--color-ring-rust)",
  ready: "var(--color-ring-rust)",
  redeemed: "var(--color-ring-sage)",
};

const fillTone: Record<LinkStatus, string> = {
  progress: "bg-[var(--color-surface-2)]/60 text-[var(--color-ink)]",
  ready: "bg-[var(--color-ring-rust-tint)] text-[var(--color-ring-rust)]",
  redeemed: "bg-[var(--color-ring-sage-tint)] text-[var(--color-ring-sage)]",
};

export function StampRing({
  partnerIcon,
  current,
  goal,
  status,
  size = RING_SIZE,
}: {
  partnerIcon: string;
  current: number;
  goal: number;
  status: LinkStatus;
  size?: number;
}) {
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = status === "redeemed" ? 1 : Math.min(1, goal > 0 ? current / goal : 0);
  const offset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <div className={`relative shrink-0 ${status === "ready" ? "animate-pulse-ring rounded-full" : ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--color-line)" strokeWidth={STROKE} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ringTone[status]}
          strokeWidth={STROKE}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={
            status === "ready"
              ? { filter: "drop-shadow(0 0 5px rgba(166,84,60,0.5))" }
              : undefined
          }
        />
      </svg>
      <div
        className={`glass-tint flex items-center justify-center rounded-full ${fillTone[status]}`}
        style={{ position: "absolute", inset: STROKE + 3 }}
      >
        <Icon name={status === "redeemed" ? "Check" : partnerIcon} size={size <= 48 ? 15 : 18} />
      </div>
    </div>
  );
}

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
