import { linksForLoop, partnerById } from "../data/partners";
import { useAppStore } from "../store/useAppStore";
import { Icon } from "./IconTile";

const SIZE = 288;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 108;
const GAP = 10;

function point(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

const statusColor: Record<string, string> = {
  redeemed: "var(--color-lime)",
  ready: "var(--color-accent)",
  progress: "var(--color-line)",
};

export function LoopDiagram({
  loopId,
  onSelectLink,
}: {
  loopId: string;
  onSelectLink: (linkId: string) => void;
}) {
  const linkStates = useAppStore((s) => s.linkStates);
  const chainLinks = linksForLoop(loopId);
  const n = chainLinks.length;
  const angleFor = (i: number) => -90 + i * (360 / n);

  const closed = chainLinks.filter((l) => linkStates[l.id]?.status === "redeemed").length;

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <div
        className="glass absolute rounded-full"
        style={{
          left: CX - R - 30,
          top: CY - R - 30,
          width: (R + 30) * 2,
          height: (R + 30) * 2,
        }}
      />
      <svg width={SIZE} height={SIZE} className="absolute inset-0">
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={2}
          strokeDasharray="1 9"
          strokeLinecap="round"
        />
        {chainLinks.map((link, i) => {
          const start = angleFor(i) + GAP;
          const end = (i === n - 1 ? angleFor(0) + 360 : angleFor(i + 1)) - GAP;
          const p1 = point(start, R);
          const p2 = point(end, R);
          const state = linkStates[link.id]?.status ?? "progress";
          const color = statusColor[state];
          return (
            <path
              key={link.id}
              d={`M ${p1.x} ${p1.y} A ${R} ${R} 0 0 1 ${p2.x} ${p2.y}`}
              fill="none"
              stroke={color}
              strokeWidth={state === "progress" ? 2 : 3}
              strokeLinecap="round"
              strokeDasharray={state === "progress" ? "1 7" : undefined}
              opacity={state === "progress" ? 0.5 : 1}
              style={
                state === "ready"
                  ? { filter: "drop-shadow(0 0 6px rgba(255,91,60,0.6))" }
                  : undefined
              }
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass glass-sheen flex h-28 w-28 flex-col items-center justify-center rounded-full text-center">
          <span className="font-display text-2xl font-bold tracking-[-0.02em] text-[var(--color-ink)]">
            {closed}/{n}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
            loop closed
          </span>
        </div>
      </div>

      {chainLinks.map((link, i) => {
        const angle = angleFor(i);
        const pos = point(angle, R);
        const partner = partnerById(link.fromId);
        const state = linkStates[link.id]?.status ?? "progress";
        const ring =
          state === "redeemed"
            ? "ring-2 ring-[var(--color-lime)]"
            : state === "ready"
              ? "ring-2 ring-[var(--color-accent)] animate-pulse-ring"
              : "";
        return (
          <button
            key={link.id}
            type="button"
            onClick={() => onSelectLink(link.id)}
            className={`glass glass-sheen absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl text-[var(--color-ink)] transition-transform active:scale-90 ${ring}`}
            style={{ left: pos.x, top: pos.y }}
            aria-label={partner.name}
          >
            <Icon name={partner.icon} size={20} />
          </button>
        );
      })}
    </div>
  );
}
