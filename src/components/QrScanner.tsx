import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./IconTile";

type Status = "requesting" | "scanning" | "denied" | "unsupported";

export function QrScanner({
  open,
  title,
  subtitle,
  onResult,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onResult: (value: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
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
          if (code?.data) {
            onResultRef.current(code.data);
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
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] mx-auto flex max-w-[30rem] flex-col bg-[#05070c]">
      <div className="relative z-10 flex items-center justify-between px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div>
          <p className="text-[15px] font-semibold text-white">{title}</p>
          {subtitle && <p className="text-[12px] text-white/50">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="glass flex h-10 w-10 items-center justify-center rounded-full text-white"
          aria-label="Close scanner"
        >
          <Icon name="X" size={18} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="pointer-events-none absolute inset-0 bg-black/25" />

        {status === "scanning" && (
          <div className="relative z-10 h-64 w-64">
            {["-top-1 -left-1 border-r-0 border-b-0", "-top-1 -right-1 border-l-0 border-b-0", "-bottom-1 -left-1 border-r-0 border-t-0", "-bottom-1 -right-1 border-l-0 border-t-0"].map(
              (pos, i) => (
                <span
                  key={i}
                  className={`absolute ${pos} h-10 w-10 rounded-[6px] border-[3px] border-[var(--color-accent)]`}
                />
              )
            )}
          </div>
        )}

        {status !== "scanning" && (
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
                  Allow camera access in your browser, or enter the code manually.
                </p>
              </>
            )}
            {status === "unsupported" && (
              <>
                <Icon name="CameraOff" size={26} className="text-[var(--color-accent)]" />
                <p className="text-sm font-medium text-white">Camera not available</p>
                <p className="text-xs text-white/60">Enter the code manually instead.</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 text-center">
        <p className="mb-3 text-[12px] text-white/50">
          {status === "scanning" ? "Point the camera at the customer's QR code" : " "}
        </p>
        <button
          onClick={onClose}
          className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-[13px] font-medium text-white"
        >
          <Icon name="Keyboard" size={15} />
          Enter code manually instead
        </button>
      </div>
    </div>
  );
}
