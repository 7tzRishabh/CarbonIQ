import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  Menu
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Calculator", href: "/app/calculator", icon: Calculator },
  { name: "AI Coach", href: "/app/coach", icon: Leaf },
  { name: "Reports", href: "/app/reports", icon: FileText },
  { name: "Leaderboard", href: "/app/leaderboard", icon: Trophy },
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile nav */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">CarbonIQ</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 space-y-1">
           {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-green-600" : "text-gray-400")} />
                  {item.name}
                </Link>
              );
            })}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-gray-900 tracking-tight">Carbon<span className="text-blue-600">IQ</span></span>
        </div>

        <div className="px-4 pb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-green-50 text-emerald-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 overflow-hidden relative group"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-emerald-600" : "text-gray-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 relative">
            <div className="bg-emerald-50 rounded-2xl p-4 mb-4 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-200 rounded-full blur-2xl opacity-50"></div>
                <p className="text-xs font-semibold text-emerald-800 mb-1">Go Premium</p>
                <p className="text-[10px] text-emerald-600 mb-3">Unlock deeper AI insights & advanced tracking.</p>
                <button className="w-full bg-emerald-600 text-white rounded-lg text-xs font-medium py-2 hover:bg-emerald-700 transition-colors">Upgrade</button>
            </div>

            <nav className="space-y-1">
            <Link to="/app/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <User className="w-5 h-5 text-gray-400" />Profile
            </Link>
            <Link to="/app/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />Settings
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5 text-red-500" />Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0">
        <div className="h-full">
            {children}
        </div>
      </main>
    </div>
  );
};
