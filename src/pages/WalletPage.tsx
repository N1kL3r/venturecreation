import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ChainSheet } from "../components/ChainSheet";
import { partnerById } from "../data/partners";
import { Icon } from "../components/IconTile";
import { RewardTicket } from "../components/RewardTicket";
import { useLoopData } from "../hooks/useLoopData";
import { useAppStore } from "../store/useAppStore";

export function WalletPage() {
  const linkStates = useAppStore((s) => s.linkStates);
  const passCode = useAppStore((s) => s.passCode);
  const [linkId, setLinkId] = useState<string | null>(null);
  const { allLinks, linkById } = useLoopData();
  const openLink = linkId ? linkById(linkId) : null;

  const ready = allLinks.filter((l) => linkStates[l.id]?.status === "ready");
  const progress = allLinks.filter((l) => linkStates[l.id]?.status === "progress");
  const redeemed = allLinks.filter((l) => linkStates[l.id]?.status === "redeemed");
  const readyShops = [...new Map(ready.map((l) => [l.toId, partnerById(l.toId)])).values()];

  return (
    <div className="flex-1 pb-28">
      <div className="px-5 pb-5">
        <h1 className="font-display text-[26px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
          Wallet
        </h1>
        <p className="text-[13px] text-[var(--color-muted)]">
          Every reward you're earning across the neighborhood
        </p>
      </div>

      <div className="mb-6 px-5">
        <div className="glass glass-sheen flex flex-col items-center gap-4 rounded-[28px] px-6 py-7 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Your Lizly Pass
          </span>
          <div className="rounded-2xl bg-white p-3">
            <QRCodeSVG value={passCode} size={188} level="M" marginSize={4} />
          </div>
          <span className="font-mono text-[13px] tracking-wider text-[var(--color-ink-dim)]">
            {passCode}
          </span>
          {readyShops.length > 0 ? (
            <div className="w-full">
              <p className="mb-2 text-[12px] text-[var(--color-muted)]">
                This pass currently unlocks rewards at:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {readyShops.map((p) => (
                  <span
                    key={p.id}
                    className="glass-tint flex items-center gap-1.5 rounded-full bg-[var(--color-accent-tint)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-accent)]"
                  >
                    <Icon name={p.icon} size={13} />
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-[var(--color-muted)]">
              One pass, every partner — show it at the counter and it matches whatever you've
              earned in the background.
            </p>
          )}
        </div>
      </div>

      {ready.length > 0 && (
        <Section title={`Ready to redeem (${ready.length})`}>
          {ready.map((link) => (
            <RewardTicket
              key={link.id}
              link={link}
              state={linkStates[link.id]}
              onOpen={() => setLinkId(link.id)}
            />
          ))}
        </Section>
      )}

      <Section title={`In progress (${progress.length})`}>
        {progress.map((link) => (
          <RewardTicket
            key={link.id}
            link={link}
            state={linkStates[link.id]}
            onOpen={() => setLinkId(link.id)}
          />
        ))}
      </Section>

      {redeemed.length > 0 && (
        <Section title={`Redeemed (${redeemed.length})`}>
          {redeemed.map((link) => (
            <RewardTicket
              key={link.id}
              link={link}
              state={linkStates[link.id]}
              onOpen={() => setLinkId(link.id)}
            />
          ))}
        </Section>
      )}

      <ChainSheet link={openLink} onClose={() => setLinkId(null)} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 px-5">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {title}
      </p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}
