import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./IconTile";

type Phase = "scanning" | "detected";

export function ScanOverlay({
  open,
  partnerName,
  partnerId,
  onDetected,
  onClose,
}: {
  open: boolean;
  partnerName: string;
  partnerId: string;
  onDetected: () => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("scanning");
  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;

  useEffect(() => {
    if (!open) return;
    setPhase("scanning");
    const detect = setTimeout(() => setPhase("detected"), 1700 + Math.random() * 500);
    return () => clearTimeout(detect);
  }, [open]);

  useEffect(() => {
    if (phase !== "detected") return;
    const close = setTimeout(() => onDetectedRef.current(), 700);
    return () => clearTimeout(close);
  }, [phase]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] mx-auto flex max-w-[30rem] flex-col bg-[#050408]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 50% 38%, rgba(60,56,72,0.55), transparent 60%), radial-gradient(circle at 20% 80%, rgba(255,91,60,0.1), transparent 55%)",
            }}
          />

          <div className="relative z-10 flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
            <div>
              <p className="text-[15px] font-semibold text-white">Check in at {partnerName}</p>
              <p className="text-[12px] text-white/50">Point your camera at the counter code</p>
            </div>
            <button
              onClick={onClose}
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-white"
              aria-label="Cancel scan"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10">
            <div className="relative h-72 w-72">
              {["-top-1 -left-1 border-r-0 border-b-0", "-top-1 -right-1 border-l-0 border-b-0", "-bottom-1 -left-1 border-r-0 border-t-0", "-bottom-1 -right-1 border-l-0 border-t-0"].map(
                (pos, i) => (
                  <span
                    key={i}
                    className={`absolute ${pos} h-10 w-10 rounded-[6px] border-[3px] transition-colors duration-300 ${
                      phase === "detected" ? "border-[var(--color-lime)]" : "border-[var(--color-accent)]"
                    }`}
                  />
                )
              )}

              <div className="absolute inset-4 flex items-center justify-center overflow-hidden rounded-2xl">
                <QRCodeSVG
                  value={`LIZLY-CHECKIN-${partnerId}`}
                  size={132}
                  fgColor="#55505f"
                  bgColor="transparent"
                  className="opacity-40"
                />

                {phase === "scanning" && (
                  <motion.div
                    initial={{ y: -110 }}
                    animate={{ y: 110 }}
                    transition={{ duration: 1.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute left-2 right-2 h-[2px] rounded-full bg-[var(--color-accent)]"
                    style={{ boxShadow: "0 0 12px 2px rgba(255,91,60,0.7)" }}
                  />
                )}

                <AnimatePresence>
                  {phase === "detected" && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="glass-strong absolute flex h-20 w-20 items-center justify-center rounded-full"
                    >
                      <Icon name="CheckCircle2" size={38} className="text-[var(--color-lime)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="mt-8 text-[13px] font-medium text-white/60">
              {phase === "scanning" ? "Scanning…" : "Checked in!"}
            </p>
          </div>

          <div className="relative z-10 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
            <button
              onClick={onDetected}
              className="text-[13px] font-medium text-white/40 underline-offset-2 hover:underline"
            >
              Trouble scanning? Check in manually
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
