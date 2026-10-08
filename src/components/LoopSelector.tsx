import { motion } from "framer-motion";
import { useState } from "react";
import { useLoopData } from "../hooks/useLoopData";
import { useAppStore } from "../store/useAppStore";
import { CreateLoopSheet } from "./CreateLoopSheet";
import { Icon } from "./IconTile";

export function LoopSelector() {
  const activeLoopId = useAppStore((s) => s.activeLoopId);
  const setActiveLoop = useAppStore((s) => s.setActiveLoop);
  const loopClosedCount = useAppStore((s) => s.loopClosedCount);
  const { allLoops } = useLoopData();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="scrollbar-none flex gap-2 overflow-x-auto px-5 pb-1">
        {allLoops.map((loop) => {
          const active = loop.id === activeLoopId;
          const closed = loopClosedCount(loop.id);
          return (
            <button
              key={loop.id}
              onClick={() => setActiveLoop(loop.id)}
              className={`relative shrink-0 rounded-full border px-4 py-2.5 text-left transition-colors ${
                active ? "border-transparent" : "border-[var(--color-line)] text-[var(--color-ink-dim)]"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="loop-pill"
                  className="glass glass-sheen absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <div
                className={`relative z-10 flex items-center gap-2 ${active ? "text-[var(--color-ink)]" : ""}`}
              >
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

        <button
          onClick={() => setCreateOpen(true)}
          className="glass-tint flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-[var(--color-line)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)]"
        >
          <Icon name="Plus" size={15} />
          New loop
        </button>
      </div>

      <CreateLoopSheet open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
