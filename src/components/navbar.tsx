"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Settings,
  LogOut,
  Shield,
  Users2,
  FolderHeart,
  ChevronDown,
} from "lucide-react";
import { Logo } from "./logo";
import { Button, buttonVariants } from "./ui/button";
import { cn, initials } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AppUser } from "@/lib/types";

const NAV_LINKS = [
  { href: "/competitions", label: "Competitions" },
  { href: "/clubs", label: "Clubs" },
  { href: "/submit", label: "Submit" },
  { href: "/tracker", label: "Tracker" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/calendar", label: "Calendar" },
];

export function Navbar({ profile }: { profile: AppUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function logout() {
    const supabase = getSupabaseBrowser();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-white/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* center links — desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(l.href) ? "text-fire" : "text-charcoal/70 hover:text-charcoal"
              )}
            >
              {l.label}
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-fire"
                />
              )}
            </Link>
          ))}
        </div>

        {/* right side */}
        <div className="flex items-center gap-2">
          {profile ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-charcoal/10 py-1 pl-1 pr-2.5 transition-colors hover:bg-muted"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fire to-electric text-xs font-bold text-white">
                  {initials(profile.full_name || profile.email)}
                </span>
                <ChevronDown className="h-4 w-4 text-charcoal/50" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-charcoal/10 bg-white p-1.5 shadow-xl"
                  >
                    <div className="border-b border-charcoal/5 px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-charcoal">
                        {profile.full_name || "Student"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-fire-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fire-700">
                        {profile.role.replace("_", " ")}
                      </span>
                    </div>
                    <MenuItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                      Dashboard
                    </MenuItem>
                    <MenuItem href="/tracker" icon={<ListChecks className="h-4 w-4" />}>
                      My Tracker
                    </MenuItem>
                    <MenuItem href="/portfolio" icon={<FolderHeart className="h-4 w-4" />}>
                      My Portfolio
                    </MenuItem>
                    <MenuItem href="/calendar" icon={<CalendarDays className="h-4 w-4" />}>
                      Calendar
                    </MenuItem>
                    {(profile.role === "club_leader" || profile.role === "admin") && (
                      <MenuItem href="/club-leader" icon={<Users2 className="h-4 w-4" />}>
                        Club Dashboard
                      </MenuItem>
                    )}
                    {profile.role === "admin" && (
                      <MenuItem href="/admin" icon={<Shield className="h-4 w-4" />}>
                        Admin Panel
                      </MenuItem>
                    )}
                    <MenuItem href="/dashboard#settings" icon={<Settings className="h-4 w-4" />}>
                      Settings
                    </MenuItem>
                    <button
                      onClick={logout}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Login
              </Link>
              <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                Sign Up Free
              </Link>
            </div>
          )}

          {/* mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-charcoal/10 bg-white md:hidden"
          >
            <div className="container flex flex-col gap-1 py-3">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive(l.href) ? "bg-fire-50 text-fire" : "text-charcoal/80 hover:bg-muted"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-charcoal/10" />
              {profile ? (
                <>
                  <Link href="/dashboard" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                    Dashboard
                  </Link>
                  {(profile.role === "club_leader" || profile.role === "admin") && (
                    <Link href="/club-leader" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                      Club Dashboard
                    </Link>
                  )}
                  {profile.role === "admin" && (
                    <Link href="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-rose-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-1 pt-1">
                  <Link href="/login" className={buttonVariants({ variant: "outline", className: "flex-1" })}>
                    Login
                  </Link>
                  <Link href="/signup" className={buttonVariants({ className: "flex-1" })}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:bg-muted hover:text-charcoal"
    >
      {icon}
      {children}
    </Link>
  );
}
