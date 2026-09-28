import { Icon } from "./IconTile";

export function Header({ onProfile }: { onProfile: () => void }) {
  return (
    <header className="flex items-center justify-between px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div>
        <h1 className="font-display text-[28px] italic leading-none text-[var(--color-ink)]">
          Loopa
        </h1>
        <p className="mt-1 flex items-center gap-1 text-[12px] text-[var(--color-muted)]">
          <Icon name="MapPin" size={12} />
          Grünerløkka, Oslo
        </p>
      </div>
      <button
        onClick={onProfile}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink)] transition-transform active:scale-90"
        aria-label="Profile"
      >
        <Icon name="User" size={18} />
      </button>
    </header>
  );
}
