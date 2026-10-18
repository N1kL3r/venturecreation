import { partnerById } from "../data/partners";
import { useLoopData } from "../hooks/useLoopData";
import { useAppStore } from "../store/useAppStore";
import { Icon } from "./IconTile";

const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 104;
const STROKE = 10;
const GAP = 8;

function point(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

export function LoopRing({
  loopId,
  onSelectLink,
}: {
  loopId: string;
  onSelectLink: (linkId: string) => void;
}) {
  const linkStates = useAppStore((s) => s.linkStates);
  const { loopById, linksForLoop } = useLoopData();
  const loop = loopById(loopId);
  const chainLinks = linksForLoop(loopId);
  const n = chainLinks.length;
  const angleFor = (i: number) => -90 + i * (360 / n);
  const closed = chainLinks.filter((l) => linkStates[l.id]?.status === "redeemed").length;

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
        <div
          className="absolute rounded-full opacity-30 blur-2xl"
          style={{
            left: CX - R - 20,
            top: CY - R - 20,
            width: (R + 20) * 2,
            height: (R + 20) * 2,
            background: `radial-gradient(circle, ${loop.accent}, transparent 70%)`,
          }}
        />

        <svg width={SIZE} height={SIZE} className="absolute inset-0">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--color-line)" strokeWidth={STROKE} />
          {chainLinks.map((link, i) => {
            const start = angleFor(i) + GAP;
            const end = (i === n - 1 ? angleFor(0) + 360 : angleFor(i + 1)) - GAP;
            const p1 = point(start, R);
            const p2 = point(end, R);
            const state = linkStates[link.id]?.status ?? "progress";
            const color = state === "redeemed" ? "var(--color-lime)" : loop.accent;
            return (
              <path
                key={link.id}
                d={`M ${p1.x} ${p1.y} A ${R} ${R} 0 0 1 ${p2.x} ${p2.y}`}
                fill="none"
                stroke={color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                opacity={state === "progress" ? 0.3 : 1}
                style={
                  state === "ready"
                    ? { filter: `drop-shadow(0 0 8px ${loop.accent}99)` }
                    : undefined
                }
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[56px] font-bold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
            {closed}
            <span className="text-[28px] text-[var(--color-muted)]">/{n}</span>
          </span>
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            loop closed
          </span>
        </div>

        {chainLinks.map((link, i) => {
          const angle = angleFor(i);
          const pos = point(angle, R);
          const partner = partnerById(link.fromId);
          const state = linkStates[link.id]?.status ?? "progress";
          const ring =
            state === "redeemed"
              ? "ring-2 ring-[var(--color-lime)]"
              : "ring-1 ring-[var(--color-line)]";
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelectLink(link.id)}
              className={`glass glass-sheen flex h-14 w-14 items-center justify-center rounded-2xl text-[var(--color-ink)] transition-transform active:scale-90 ${ring}`}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -50%)",
                ...(state === "ready"
                  ? { boxShadow: `0 0 0 2px ${loop.accent}, 0 0 18px ${loop.accent}80` }
                  : undefined),
              }}
              aria-label={partner.name}
            >
              <Icon name={partner.icon} size={22} />
            </button>
          );
        })}
      </div>

      <p className="mt-5 max-w-[17rem] text-center text-[12px] leading-snug text-[var(--color-muted)]">
        Earn at one partner, the reward unlocks at the next — the loop closes back where it started.
      </p>
    </div>
  );
}
