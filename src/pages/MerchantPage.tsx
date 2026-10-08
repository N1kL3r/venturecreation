import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { partnerById, partners } from "../data/partners";
import { Icon, IconTile } from "../components/IconTile";
import { QrScanner } from "../components/QrScanner";
import { useLoopData } from "../hooks/useLoopData";
import { useAppStore } from "../store/useAppStore";

type Feedback =
  | { kind: "success"; rewardText: string; fromName: string; toName: string }
  | { kind: "error"; message: string };

export function MerchantPage() {
  const [partnerId, setPartnerId] = useState(partners[0].id);
  const [code, setCode] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const redeemByCode = useAppStore((s) => s.redeemByCode);
  const linkStates = useAppStore((s) => s.linkStates);
  const { allLinks } = useLoopData();

  const partner = partnerById(partnerId);

  const recent = useMemo(() => {
    return allLinks
      .filter((l) => l.toId === partnerId && linkStates[l.id]?.status === "redeemed")
      .map((l) => ({ link: l, state: linkStates[l.id] }))
      .sort((a, b) => (b.state.redeemedAt ?? 0) - (a.state.redeemedAt ?? 0));
  }, [partnerId, linkStates]);

  function handleVerify(raw?: string) {
    const value = (raw ?? code).trim();
    if (!value) return;
    const result = redeemByCode(value, partnerId);

    if (result.ok) {
      const from = partnerById(result.link.fromId);
      setFeedback({
        kind: "success",
        rewardText: result.link.rewardText,
        fromName: from.name,
        toName: partner.name,
      });
      setCode("");
      return;
    }

    if (result.reason === "not_found") {
      setFeedback({
        kind: "error",
        message: "Code not recognized. Double-check it with the customer.",
      });
    } else if (result.reason === "wrong_store") {
      const correctPartner = partnerById(result.link.toId);
      setFeedback({
        kind: "error",
        message: `This code is for ${correctPartner.name}, not ${partner.name}.`,
      });
    } else {
      setFeedback({ kind: "error", message: "This code has already been redeemed." });
    }
  }

  function handleScanResult(value: string) {
    setScannerOpen(false);
    handleVerify(value);
  }

  return (
    <div className="theme-merchant flex flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Link
          to="/"
          className="glass flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-ink)]"
          aria-label="Exit staff mode"
        >
          <Icon name="ArrowLeft" size={18} />
        </Link>
        <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
          Lizly Business
        </span>
        <span className="glass-tint rounded-full bg-[var(--color-accent-tint)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
          Staff
        </span>
      </header>

      <div className="flex-1 px-5 pb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
          Signed in as
        </p>
        <div className="scrollbar-none mb-6 flex gap-2 overflow-x-auto pb-1">
          {partners.map((p) => {
            const active = p.id === partnerId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPartnerId(p.id);
                  setFeedback(null);
                }}
                className={`relative shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? "border-transparent text-[var(--color-ink)]"
                    : "border-[var(--color-line)] text-[var(--color-ink-dim)]"
                }`}
              >
                {active && <div className="glass glass-sheen absolute inset-0 rounded-full" />}
                <span className="relative z-10">{p.name}</span>
              </button>
            );
          })}
        </div>

        <div className="glass glass-sheen rounded-[28px] p-5">
          <div className="mb-4 flex items-center gap-3">
            <IconTile name={partner.icon} tone="accent" />
            <div>
              <p className="text-[15px] font-semibold text-[var(--color-ink)]">{partner.name}</p>
              <p className="text-[12px] text-[var(--color-muted)]">Verify a customer's reward code</p>
            </div>
          </div>

          <button
            onClick={() => setScannerOpen(true)}
            className="glass-sheen flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] py-3.5 text-[15px] font-semibold text-white transition-transform active:scale-[0.98]"
          >
            <Icon name="ScanLine" size={17} />
            Scan customer's QR
          </button>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-line)]" />
            <span className="text-[11px] uppercase tracking-wide text-[var(--color-muted)]">or</span>
            <div className="h-px flex-1 bg-[var(--color-line)]" />
          </div>

          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
            Enter the code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            placeholder="LIZLY-XXXX-XXXX"
            className="glass-tint w-full rounded-2xl px-4 py-3.5 font-mono text-[15px] tracking-wider text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
          />

          <button
            onClick={() => handleVerify()}
            disabled={!code.trim()}
            className="glass mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium text-[var(--color-ink-dim)] transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            <Icon name="ShieldCheck" size={15} />
            Verify &amp; redeem
          </button>
        </div>

        {feedback && (
          <div
            className={`glass-tint mt-4 flex items-start gap-3 rounded-2xl px-4 py-3.5 ${
              feedback.kind === "success" ? "bg-[var(--color-lime-tint)]" : "bg-[var(--color-accent-tint)]"
            }`}
          >
            <Icon
              name={feedback.kind === "success" ? "CheckCircle2" : "AlertTriangle"}
              size={18}
              className={`mt-0.5 shrink-0 ${
                feedback.kind === "success" ? "text-[var(--color-lime)]" : "text-[var(--color-accent)]"
              }`}
            />
            {feedback.kind === "success" ? (
              <div>
                <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                  Approved — {feedback.rewardText}
                </p>
                <p className="text-[12px] text-[var(--color-muted)]">
                  Earned at {feedback.fromName} · redeemed at {feedback.toName}
                </p>
              </div>
            ) : (
              <p className="text-[13px] font-medium text-[var(--color-ink)]">{feedback.message}</p>
            )}
          </div>
        )}

        <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
          Recent redemptions at {partner.name}
        </p>
        {recent.length === 0 ? (
          <div className="glass flex items-center justify-center rounded-2xl py-8 text-sm text-[var(--color-muted)]">
            No redemptions yet
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recent.map(({ link, state }) => {
              const from = partnerById(link.fromId);
              return (
                <div key={link.id} className="glass flex items-start gap-3 rounded-2xl px-4 py-3.5">
                  <Icon name="CheckCircle2" size={16} className="mt-0.5 shrink-0 text-[var(--color-lime)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[var(--color-ink)]">
                      {link.rewardText}
                    </p>
                    <p className="truncate text-[12px] text-[var(--color-muted)]">
                      Earned at {from.name}
                      {state.redeemedAt &&
                        ` · ${new Date(state.redeemedAt).toLocaleString(undefined, {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <QrScanner
        open={scannerOpen}
        title={`Scan at ${partner.name}`}
        subtitle="Looking for the customer's reward QR"
        onResult={handleScanResult}
        onClose={() => setScannerOpen(false)}
      />
    </div>
  );
}
