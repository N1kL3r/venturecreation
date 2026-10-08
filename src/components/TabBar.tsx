import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "./IconTile";

const tabs = [
  { to: "/", label: "Loops", icon: "Infinity" },
  { to: "/partners", label: "Partners", icon: "Store" },
  { to: "/wallet", label: "Wallet", icon: "Wallet" },
];

export function TabBar() {
  const { pathname } = useLocation();
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => (t.to === "/" ? pathname === "/" : pathname.startsWith(t.to)))
  );

  return (
    <nav className="sticky bottom-0 z-40 mt-auto px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
      <div className="glass glass-raised glass-sheen relative flex items-center rounded-full p-1.5">
        <motion.div
          className="glass-strong absolute inset-y-1.5 rounded-full"
          style={{ width: `calc(${100 / tabs.length}% - 6px)` }}
          animate={{ left: `calc(${(activeIndex / tabs.length) * 100}% + 3px)` }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
        {tabs.map((tab, i) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className="relative z-10 flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[12.5px] font-semibold transition-colors duration-200"
            style={{ color: i === activeIndex ? "var(--color-ink)" : "var(--color-muted)" }}
          >
            <Icon name={tab.icon} size={18} />
            <span className="hidden min-[360px]:inline">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
