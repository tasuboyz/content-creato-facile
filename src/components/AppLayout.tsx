import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Sparkles, Calendar, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Carica", icon: Upload },
  { to: "/genera", label: "Genera", icon: Sparkles },
  { to: "/calendario", label: "Calendario", icon: Calendar },
  { to: "/impostazioni", label: "Impostazioni", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card p-4">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-bold text-primary">Tasuthor</h1>
          <p className="text-xs text-muted-foreground">Piano Editoriale</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Button variant="ghost" size="sm" onClick={signOut} className="mt-auto justify-start gap-2 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Esci
        </Button>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex md:hidden items-center justify-between border-b border-border bg-card px-4 py-3">
          <h1 className="text-lg font-bold text-primary">Tasuthor</h1>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileOpen && (
          <nav className="flex md:hidden flex-col gap-1 border-b border-border bg-card p-3">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Button variant="ghost" size="sm" onClick={signOut} className="justify-start gap-2 text-muted-foreground mt-2">
              <LogOut className="h-4 w-4" />
              Esci
            </Button>
          </nav>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
