import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Onboarding } from "./components/Onboarding";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { TabBar } from "./components/TabBar";
import { HomePage } from "./pages/HomePage";
import { PartnersPage } from "./pages/PartnersPage";
import { WalletPage } from "./pages/WalletPage";
import { useAppStore } from "./store/useAppStore";

function App() {
  const theme = useAppStore((s) => s.theme);
  const onboarded = useAppStore((s) => s.onboarded);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (!onboarded) return <Onboarding />;

  return (
    <>
      <div className="glass-field" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="grain" />
      <div className="relative z-10 flex flex-1 flex-col">
        <Header onProfile={() => setProfileOpen(true)} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/wallet" element={<WalletPage />} />
        </Routes>
        <TabBar />
      </div>
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}

export default App;
