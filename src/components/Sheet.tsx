import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

export function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[30rem] items-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
            className="relative z-10 max-h-[88dvh] w-full overflow-y-auto rounded-t-[28px] bg-[var(--color-surface)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_60px_rgba(0,0,0,0.4)]"
          >
            <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[var(--color-line)]" />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
