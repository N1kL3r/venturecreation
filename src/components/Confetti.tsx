import { motion } from "framer-motion";

const COLORS = ["var(--color-accent)", "var(--color-lime)", "var(--color-accent-2)", "#8FB8FF"];

export function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const distance = 90 + Math.random() * 70;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const color = COLORS[i % COLORS.length];
        const isCircle = i % 2 === 0;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
            animate={{ x, y, opacity: 0, scale: 1, rotate: Math.random() * 180 }}
            transition={{ duration: 0.9 + Math.random() * 0.4, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2"
            style={{
              width: 7,
              height: isCircle ? 7 : 10,
              background: color,
              borderRadius: isCircle ? "50%" : 2,
            }}
          />
        );
      })}
    </div>
  );
}
