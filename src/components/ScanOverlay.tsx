import jsQR from "jsqr";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./IconTile";

type Status = "requesting" | "scanning" | "matched" | "denied" | "unsupported";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;
  const [status, setStatus] = useState<Status>("requesting");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus("requesting");

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }
        setStatus("scanning");
        tick();
      } catch {
        if (!cancelled) setStatus("denied");
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(frame.data, frame.width, frame.height, {
            inversionAttempts: "dontInvert",
          });
          if (code?.data === `LIZLY-CHECKIN-${partnerId}`) {
            setStatus("matched");
            return;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open, partnerId]);

  useEffect(() => {
    if (status !== "matched") return;
    const t = setTimeout(() => onDetectedRef.current(), 700);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] mx-auto flex max-w-[30rem] flex-col bg-[#050408]"
        >
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

          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="pointer-events-none absolute inset-0 bg-black/25" />

            {(status === "scanning" || status === "matched") && (
              <div className="relative z-10 h-72 w-72">
                {["-top-1 -left-1 border-r-0 border-b-0", "-top-1 -right-1 border-l-0 border-b-0", "-bottom-1 -left-1 border-r-0 border-t-0", "-bottom-1 -right-1 border-l-0 border-t-0"].map(
                  (pos, i) => (
                    <span
                      key={i}
                      className={`absolute ${pos} h-10 w-10 rounded-[6px] border-[3px] transition-colors duration-300 ${
                        status === "matched" ? "border-[var(--color-lime)]" : "border-[var(--color-accent)]"
                      }`}
                    />
                  )
                )}

                <AnimatePresence>
                  {status === "matched" && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="glass-strong absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full"
                    >
                      <Icon name="CheckCircle2" size={38} className="text-[var(--color-lime)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {(status === "requesting" || status === "denied" || status === "unsupported") && (
              <div className="glass-strong relative z-10 mx-8 flex flex-col items-center gap-2 rounded-[28px] p-6 text-center">
                {status === "requesting" && (
                  <>
                    <Icon name="Camera" size={26} className="text-white" />
                    <p className="text-sm font-medium text-white">Requesting camera access…</p>
                  </>
                )}
                {status === "denied" && (
                  <>
                    <Icon name="CameraOff" size={26} className="text-[var(--color-accent)]" />
                    <p className="text-sm font-medium text-white">Camera access denied</p>
                    <p className="text-xs text-white/60">
                      Allow camera access in your browser, or check in manually.
                    </p>
                  </>
                )}
                {status === "unsupported" && (
                  <>
                    <Icon name="CameraOff" size={26} className="text-[var(--color-accent)]" />
                    <p className="text-sm font-medium text-white">Camera not available</p>
                    <p className="text-xs text-white/60">Check in manually instead.</p>
                  </>
                )}
              </div>
            )}

            <p className="absolute bottom-6 z-10 text-[13px] font-medium text-white/60">
              {status === "scanning"
                ? "Scanning…"
                : status === "matched"
                  ? "Checked in!"
                  : ""}
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
