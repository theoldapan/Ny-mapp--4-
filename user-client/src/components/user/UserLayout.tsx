import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemberAuth } from "@/contexts/MemberAuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Newspaper,
  CreditCard,
  Calendar,
  User,
  LogOut,
  Menu,
  Dumbbell,
} from "lucide-react";
import { useState } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Hem", path: "/app", icon: Home },
  { label: "Blogg", path: "/app/blog", icon: Newspaper },
  { label: "Medlemskap", path: "/app/subscriptions", icon: CreditCard },
  { label: "Pass", path: "/app/classes", icon: Calendar },
];

export function UserLayout({ children }: UserLayoutProps) {
  const { member, logout, isAuthenticated } = useMemberAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/app/login");
  };

  const getInitials = () => {
    if (!member) return "U";
    return `${member.firstName?.[0] || ""}${
      member.lastName?.[0] || ""
    }`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/app" className="flex items-center gap-2 group">
              <img
                src="/halsoprofilen-logo.png"
                alt="Hälsoprofilen logotyp"
                className="h-12 w-12 object-contain group-hover:scale-105 transition-transform"
              />

              <span className="text-lg font-black uppercase tracking-tight">
                Hälsoprofilen
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={member?.profileImage} />
                      <AvatarFallback className="gym-gradient text-primary-foreground font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="gym-gradient text-primary-foreground text-xs font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold">
                        {member?.firstName} {member?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/app/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Min Profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logga ut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/app/login")}
                  className="font-bold uppercase text-sm tracking-wide"
                >
                  Logga in
                </Button>
                <Button
                  onClick={() => navigate("/app/register")}
                  className="font-bold uppercase text-sm tracking-wide gym-gradient"
                >
                  Bli Medlem
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t bg-muted/30 py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 group">
                <img
                  src="/halsoprofilen-logo.png"
                  alt="Hälsoprofilen logotyp"
                  className="h-12 w-12 object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="font-black uppercase tracking-tight">
                Hälsoprofilen
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hälsoprofilen. Träna hårt. Håll dig
              stark.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
