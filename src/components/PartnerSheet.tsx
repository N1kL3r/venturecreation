import { partnerById } from "../data/partners";
import { useLoopData } from "../hooks/useLoopData";
import { useAppStore } from "../store/useAppStore";
import { Icon, IconTile } from "./IconTile";
import { Sheet } from "./Sheet";

export function PartnerSheet({
  partnerId,
  onClose,
  onOpenLink,
}: {
  partnerId: string | null;
  onClose: () => void;
  onOpenLink: (linkId: string) => void;
}) {
  const linkStates = useAppStore((s) => s.linkStates);
  const { partnerLinks } = useLoopData();
  const partner = partnerId ? partnerById(partnerId) : null;
  const related = partnerId ? partnerLinks(partnerId) : null;

  return (
    <Sheet open={!!partner} onClose={onClose}>
      {partner && related && (
        <div className="px-5 pt-2">
          <div className="flex items-start gap-3 border-b border-[var(--color-line)] pb-5">
            <IconTile name={partner.icon} tone="accent" size="lg" />
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-[18px] font-semibold text-[var(--color-ink)]">{partner.name}</p>
              <p className="text-[13px] text-[var(--color-muted)]">{partner.category}</p>
            </div>
          </div>

          <p className="py-4 text-[14px] leading-relaxed text-[var(--color-ink-dim)]">
            {partner.blurb}
          </p>

          <div className="glass flex flex-col gap-2.5 rounded-[22px] p-4">
            <Row icon="MapPin" text={partner.address} />
            <Row icon="Clock" text={partner.hours} />
            <Row icon="Footprints" text={partner.walkTime} />
          </div>

          {related.earns.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                Earn here
              </p>
              {related.earns.map((link) => {
                const state = linkStates[link.id];
                return (
                  <button
                    key={link.id}
                    onClick={() => onOpenLink(link.id)}
                    className="glass mb-2.5 flex w-full items-start gap-3 rounded-2xl px-4 py-3.5 text-left transition-transform active:scale-[0.98]"
                  >
                    <Icon name="Target" size={16} className="mt-1 shrink-0 text-[var(--color-accent)]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[var(--color-ink)]">
                        {link.earnLabel}
                      </p>
                      <p className="truncate text-[12px] text-[var(--color-muted)]">
                        Unlocks {link.rewardText}
                      </p>
                    </div>
                    <div className="self-center">
                      <StatusPill status={state?.status} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {related.redeems.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                Redeem here
              </p>
              {related.redeems.map((link) => {
                const state = linkStates[link.id];
                const from = partnerById(link.fromId);
                return (
                  <button
                    key={link.id}
                    onClick={() => onOpenLink(link.id)}
                    className="glass mb-2.5 flex w-full items-start gap-3 rounded-2xl px-4 py-3.5 text-left transition-transform active:scale-[0.98]"
                  >
                    <Icon name="Gift" size={16} className="mt-1 shrink-0 text-[var(--color-lime)]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[var(--color-ink)]">
                        {link.rewardText}
                      </p>
                      <p className="truncate text-[12px] text-[var(--color-muted)]">
                        Earned at {from.name}
                      </p>
                    </div>
                    <div className="self-center">
                      <StatusPill status={state?.status} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-2xl py-3 text-center text-sm font-medium text-[var(--color-muted)]"
          >
            Done
          </button>
        </div>
      )}
    </Sheet>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-[var(--color-ink-dim)]">
      <Icon name={icon} size={15} className="text-[var(--color-muted)]" />
      {text}
    </div>
  );
}

function StatusPill({ status }: { status?: string }) {
  if (status === "redeemed")
    return (
      <span className="glass-tint shrink-0 rounded-full bg-[var(--color-lime-tint)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-lime)]">
        Done
      </span>
    );
  if (status === "ready")
    return (
      <span className="glass-tint shrink-0 rounded-full bg-[var(--color-accent-tint)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-accent)]">
        Ready
      </span>
    );
  return <Icon name="ChevronRight" size={16} className="shrink-0 text-[var(--color-muted)]" />;
}
