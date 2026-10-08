import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ChainSheet } from "../components/ChainSheet";
import { Icon, IconTile } from "../components/IconTile";
import { PartnerSheet } from "../components/PartnerSheet";
import { partners } from "../data/partners";
import { useLoopData } from "../hooks/useLoopData";
import { useAppStore } from "../store/useAppStore";

const categories = ["All", ...Array.from(new Set(partners.map((p) => p.category)))];

export function PartnersPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const linkStates = useAppStore((s) => s.linkStates);
  const { linkById, partnerLinks, allLoops } = useLoopData();

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const openLink = linkId ? linkById(linkId) : null;

  return (
    <div className="flex-1 pb-28">
      <div className="px-5 pb-4">
        <h1 className="font-display text-[26px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
          Partners
        </h1>
        <p className="text-[13px] text-[var(--color-muted)]">
          {partners.length} businesses across {allLoops.length} loop{allLoops.length === 1 ? "" : "s"} in
          Grünerløkka
        </p>
      </div>

      <div className="px-5">
        <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3">
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
        {categories.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`relative shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                active ? "border-transparent" : "border-[var(--color-line)] text-[var(--color-ink-dim)]"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="category-pill"
                  className="glass glass-sheen absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className={`relative z-10 ${active ? "text-[var(--color-ink)]" : ""}`}>{c}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-5">
        {filtered.map((p) => {
          const { earns, redeems } = partnerLinks(p.id);
          const readyCount = [...earns, ...redeems].filter(
            (l) => linkStates[l.id]?.status === "ready"
          ).length;
          return (
            <motion.button
              key={p.id}
              onClick={() => setPartnerId(p.id)}
              whileTap={{ scale: 0.96 }}
              className="glass glass-sheen flex flex-col items-start gap-2.5 rounded-[24px] p-4 text-left"
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
            </motion.button>
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
