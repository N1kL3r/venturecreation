import * as icons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconName = keyof typeof icons;

interface IconTileProps {
  name: string;
  tone?: "ink" | "accent" | "lime";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { box: "h-9 w-9", icon: 16, radius: "rounded-lg" },
  md: { box: "h-12 w-12", icon: 20, radius: "rounded-xl" },
  lg: { box: "h-16 w-16", icon: 26, radius: "rounded-2xl" },
};

const toneMap = {
  ink: "bg-[var(--color-surface-2)] text-[var(--color-ink)]",
  accent: "bg-[var(--color-accent-tint)] text-[var(--color-accent)]",
  lime: "bg-[var(--color-lime-tint)] text-[var(--color-lime)]",
};

export function IconTile({ name, tone = "ink", size = "md" }: IconTileProps) {
  const Icon = (icons[name as IconName] ?? icons.Store) as React.ComponentType<LucideProps>;
  const s = sizeMap[size];
  return (
    <div
      className={`flex ${s.box} ${s.radius} ${toneMap[tone]} shrink-0 items-center justify-center`}
    >
      <Icon size={s.icon} strokeWidth={2} />
    </div>
  );
}

export function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Cmp = (icons[name as IconName] ?? icons.Circle) as React.ComponentType<LucideProps>;
  return <Cmp size={size} className={className} />;
}
