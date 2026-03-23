import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Users, 
  Megaphone, 
  BarChart3, 
  Settings, 
  ShieldAlert,
  LogOut,
  Menu,
  X,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Boîte de réception", href: "/inbox", icon: MessageSquareText },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Campagnes", href: "/campaigns", icon: Megaphone },
    { name: "Analytiques", href: "/analytics", icon: BarChart3 },
  ];

  const adminNavigation = [
    { name: "Admin Panel", href: "/admin", icon: ShieldAlert },
    { name: "Paramètres", href: "/settings", icon: Settings },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
    return (
      <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
        <div className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group cursor-pointer",
          isActive 
            ? "bg-primary/10 text-primary neon-border" 
            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
        )}>
          <item.icon className={cn("mr-3 h-5 w-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
          {item.name}
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 glass-panel flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">Whats<span className="text-primary">Master</span></span>
          </div>
          <button className="lg:hidden text-muted-foreground hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu Principal</h3>
            {navigation.map((item) => <NavItem key={item.name} item={item} />)}
          </div>

          {isAdmin && (
            <div className="space-y-1">
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Administration</h3>
              {adminNavigation.map((item) => <NavItem key={item.name} item={item} />)}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-20 glass-panel border-l-0 border-t-0 border-r-0 flex items-center justify-between px-6 lg:px-10 shrink-0 relative z-20">
          <button 
            className="lg:hidden text-muted-foreground hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              API Connectée
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label={`Basculer vers le thème ${theme === "dark" ? "clair" : "sombre"}`}
              title={`Thème ${theme === "dark" ? "clair" : "sombre"}`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
