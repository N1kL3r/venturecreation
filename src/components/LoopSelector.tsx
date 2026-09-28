import { loops } from "../data/partners";
import { useAppStore } from "../store/useAppStore";

export function LoopSelector() {
  const activeLoopId = useAppStore((s) => s.activeLoopId);
  const setActiveLoop = useAppStore((s) => s.setActiveLoop);
  const loopClosedCount = useAppStore((s) => s.loopClosedCount);

  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto px-5 pb-1">
      {loops.map((loop) => {
        const active = loop.id === activeLoopId;
        const closed = loopClosedCount(loop.id);
        return (
          <button
            key={loop.id}
            onClick={() => setActiveLoop(loop.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-left transition-all ${
              active
                ? "border-transparent bg-[var(--color-ink)] text-[var(--color-bg)]"
                : "border-[var(--color-line)] bg-transparent text-[var(--color-ink-dim)]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: active ? loop.accent : "var(--color-muted)" }}
              />
              <span className="text-sm font-medium">{loop.name}</span>
              <span
                className={`text-xs ${active ? "opacity-70" : "text-[var(--color-muted)]"}`}
              >
                {closed}/{loop.linkIds.length}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
