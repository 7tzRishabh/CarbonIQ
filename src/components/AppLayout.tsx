import React, { memo, useCallback, Suspense } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  LayoutDashboard, 
  Calculator, 
  Leaf, 
  FileText, 
  Trophy, 
  User, 
  Settings,
  LogOut,
  Menu,
  Loader2
} from "lucide-react";
import { cn } from "../lib/utils";

const NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Calculator", href: "/app/calculator", icon: Calculator },
  { name: "AI Coach", href: "/app/coach", icon: Leaf },
  { name: "Reports", href: "/app/reports", icon: FileText },
  { name: "Leaderboard", href: "/app/leaderboard", icon: Trophy },
];

const NavLink = memo(({ item, isActive, onClick, isMobile }: any) => {
  if (isMobile) {
    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-colors",
          isActive
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <item.icon aria-hidden="true" className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
        {item.name}
      </Link>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
        isActive
          ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200 translate-x-1"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 group"
      )}
    >
      <item.icon aria-hidden="true" className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-400")} />
      {item.name}
    </Link>
  );
});

NavLink.displayName = "NavLink";

export const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg focus:shadow-lg outline-none ring-2 ring-emerald-500 ring-offset-2"
      >
        Skip to main content
      </a>

      <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div aria-hidden="true" className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">CarbonIQ</span>
        </div>
        <button 
          onClick={toggleMobileMenu} 
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {mobileMenuOpen && (
        <nav id="mobile-navigation" className="md:hidden bg-white border-b border-gray-200 px-4 py-2 space-y-1" aria-label="Mobile Navigation">
           {NAVIGATION_ITEMS.map((item) => (
             <NavLink 
                key={item.name}
                item={item} 
                isActive={location.pathname === item.href} 
                onClick={closeMobileMenu}
                isMobile
              />
           ))}
        </nav>
      )}

      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0" aria-label="Sidebar Navigation">
        <div className="p-6 flex items-center gap-3">
          <div aria-hidden="true" className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-gray-900 tracking-tight">Carbon<span className="text-blue-600">IQ</span></span>
        </div>

        <nav className="px-4 pb-6 flex-1">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
          <div className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => (
              <NavLink 
                key={item.name}
                item={item} 
                isActive={location.pathname === item.href} 
              />
            ))}
          </div>
        </nav>

        <div className="p-4 relative">
            <section aria-label="Premium Upgrade" className="bg-emerald-50 rounded-2xl p-4 mb-4 relative overflow-hidden">
                <div aria-hidden="true" className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-200 rounded-full blur-2xl opacity-50"></div>
                <p className="text-xs font-bold text-emerald-900 mb-1">Go Premium</p>
                <p className="text-[10px] text-emerald-700 font-medium mb-3">Unlock deeper AI insights & advanced tracking.</p>
                <button className="w-full bg-emerald-600 text-white rounded-lg text-xs font-bold py-2 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors">Upgrade</button>
            </section>

            <nav className="space-y-1" aria-label="User Settings">
            <Link 
              to="/app/profile" 
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors",
                location.pathname === "/app/profile" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <User aria-hidden="true" className="w-5 h-5 text-gray-400" />Profile
            </Link>
            <Link 
              to="/app/settings" 
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors",
                location.pathname === "/app/settings" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Settings aria-hidden="true" className="w-5 h-5 text-gray-400" />Settings
            </Link>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-left"
            >
              <LogOut aria-hidden="true" className="w-5 h-5 text-red-600" />Sign Out
            </button>
          </nav>
        </div>
      </aside>

      <main id="main-content" className="flex-1 w-full min-w-0 outline-none" tabIndex={-1}>
        <div className="h-full">
            <Suspense fallback={<div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" /></div>}>
              {children || <Outlet />}
            </Suspense>
        </div>
      </main>
    </div>
  );
};
