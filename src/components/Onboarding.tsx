import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { Icon } from "./IconTile";

const slides = [
  {
    icon: "Coffee",
    title: "Earn at one place",
    body: "Grab your coffee, hit the gym, buy a bouquet — every visit logs progress toward a reward.",
  },
  {
    icon: "CornerDownRight",
    title: "Unlock at another",
    body: "The reward is never at the same shop. Loyalty travels across the neighborhood, not just one till.",
  },
  {
    icon: "Repeat",
    title: "Close the loop",
    body: "Five, four, or three partners deep — when the last reward points back to the first, the loop closes.",
  },
];

export function Onboarding() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const last = step === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[60] mx-auto flex max-w-[30rem] flex-col bg-[var(--color-bg)] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-1.5">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-[var(--color-accent)]" : "bg-[var(--color-line)]"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="animate-float mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[var(--color-accent-tint)] text-[var(--color-accent)]">
              <Icon name={slide.icon} size={40} />
            </div>
            <h2 className="font-display text-[30px] italic leading-tight text-[var(--color-ink)]">
              {slide.title}
            </h2>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[var(--color-muted)]">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={completeOnboarding}
          className="px-2 py-3 text-sm font-medium text-[var(--color-muted)]"
        >
          Skip
        </button>
        <button
          onClick={() => (last ? completeOnboarding() : setStep((s) => s + 1))}
          className="flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-sm font-semibold text-[var(--color-bg)] transition-transform active:scale-[0.97]"
        >
          {last ? "Get started" : "Next"}
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}
