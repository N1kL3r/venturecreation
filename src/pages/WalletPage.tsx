import { useState } from "react";
import { ChainSheet } from "../components/ChainSheet";
import { RewardTicket } from "../components/RewardTicket";
import { allLinks } from "../store/useAppStore";
import { useAppStore } from "../store/useAppStore";
import { linkById } from "../data/partners";

export function WalletPage() {
  const linkStates = useAppStore((s) => s.linkStates);
  const [linkId, setLinkId] = useState<string | null>(null);
  const openLink = linkId ? linkById(linkId) : null;

  const ready = allLinks.filter((l) => linkStates[l.id]?.status === "ready");
  const progress = allLinks.filter((l) => linkStates[l.id]?.status === "progress");
  const redeemed = allLinks.filter((l) => linkStates[l.id]?.status === "redeemed");

  return (
    <div className="flex-1 pb-6">
      <div className="px-5 pb-5">
        <h1 className="font-display text-[26px] italic text-[var(--color-ink)]">Wallet</h1>
        <p className="text-[13px] text-[var(--color-muted)]">
          Every reward you're earning across the neighborhood
        </p>
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
