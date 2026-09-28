import { useMemo, useState } from "react";
import { ChainSheet } from "../components/ChainSheet";
import { Icon, IconTile } from "../components/IconTile";
import { PartnerSheet } from "../components/PartnerSheet";
import { linkById, partnerLinks, partners } from "../data/partners";
import { useAppStore } from "../store/useAppStore";

const categories = ["All", ...Array.from(new Set(partners.map((p) => p.category)))];

export function PartnersPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const linkStates = useAppStore((s) => s.linkStates);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const openLink = linkId ? linkById(linkId) : null;

  return (
    <div className="flex-1 pb-6">
      <div className="px-5 pb-4">
        <h1 className="font-display text-[26px] italic text-[var(--color-ink)]">Partners</h1>
        <p className="text-[13px] text-[var(--color-muted)]">
          {partners.length} businesses across 3 loops in Grünerløkka
        </p>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-surface-2)] px-4 py-3">
          <Icon name="Search" size={16} className="text-[var(--color-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search partners"
            className="w-full bg-transparent text-[14px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
          />
        </div>
      </div>

      <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              category === c
                ? "border-transparent bg-[var(--color-ink)] text-[var(--color-bg)]"
                : "border-[var(--color-line)] text-[var(--color-ink-dim)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-5">
        {filtered.map((p) => {
          const { earns, redeems } = partnerLinks(p.id);
          const readyCount = [...earns, ...redeems].filter(
            (l) => linkStates[l.id]?.status === "ready"
          ).length;
          return (
            <button
              key={p.id}
              onClick={() => setPartnerId(p.id)}
              className="flex flex-col items-start gap-2.5 rounded-2xl border border-[var(--color-line)] p-4 text-left transition-colors active:bg-[var(--color-surface-2)]"
            >
              <div className="flex w-full items-start justify-between">
                <IconTile name={p.icon} tone="ink" />
                {readyCount > 0 && (
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                )}
              </div>
              <div>
                <p className="text-[14px] font-semibold leading-tight text-[var(--color-ink)]">
                  {p.name}
                </p>
                <p className="mt-0.5 text-[12px] text-[var(--color-muted)]">{p.category}</p>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-[var(--color-muted)]">
            No partners match “{query}”
          </p>
        )}
      </div>

      <PartnerSheet
        partnerId={partnerId}
        onClose={() => setPartnerId(null)}
        onOpenLink={(id) => {
          setPartnerId(null);
          setLinkId(id);
        }}
      />
      <ChainSheet link={openLink} onClose={() => setLinkId(null)} />
    </div>
  );
}
