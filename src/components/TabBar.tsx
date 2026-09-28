import { NavLink } from "react-router-dom";
import { Icon } from "./IconTile";

const tabs = [
  { to: "/", label: "Loops", icon: "Infinity" },
  { to: "/partners", label: "Partners", icon: "Store" },
  { to: "/wallet", label: "Wallet", icon: "Wallet" },
];

export function TabBar() {
  return (
    <nav className="sticky bottom-0 z-40 mt-auto border-t border-[var(--color-line)] bg-[var(--color-surface)]/90 backdrop-blur-xl">
      <div className="flex items-stretch justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-1.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"
              }`
            }
          >
            <Icon name={tab.icon} size={21} />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
