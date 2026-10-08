import { Icon } from "./IconTile";

export function Header({ onProfile }: { onProfile: () => void }) {
  return (
    <header className="glass sticky top-0 z-20 flex items-center justify-between rounded-b-[28px] border-t-0 px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div>
        <h1 className="font-display text-[26px] font-bold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
          Lizly
        </h1>
        <p className="mt-1 flex items-center gap-1 text-[12px] text-[var(--color-muted)]">
          <Icon name="MapPin" size={12} />
          Grünerløkka, Oslo
        </p>
      </div>
      <button
        onClick={onProfile}
        className="glass glass-sheen flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-ink)] transition-transform active:scale-90"
        aria-label="Profile"
      >
        <Icon name="User" size={18} />
      </button>
    </header>
  );
}
