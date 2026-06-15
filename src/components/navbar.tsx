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
    <header className="sticky top-0 z-50 border-b border-[rgba(33,30,24,0.09)] bg-[rgba(243,239,230,0.85)] backdrop-blur-[8px]">
      <nav className="container flex h-[74px] items-center justify-between gap-4">
        <Logo />

        {/* center links — desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative rounded-lg px-3 py-2 text-[15.5px] transition-colors",
                isActive(l.href) ? "text-ember" : "text-ink-soft hover:text-ink"
              )}
            >
              {l.label}
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-ember"
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
                className="flex items-center gap-2 rounded-full border border-[rgba(33,30,24,0.12)] py-1 pl-1 pr-2.5 transition-colors hover:bg-paper"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">
                  {initials(profile.full_name || profile.email)}
                </span>
                <ChevronDown className="h-4 w-4 text-ink-faint" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-[rgba(33,30,24,0.12)] bg-panel p-1.5 shadow-xl"
                  >
                    <div className="border-b border-[rgba(33,30,24,0.08)] px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-ink">
                        {profile.full_name || "Student"}
                      </p>
                      <p className="truncate text-xs text-ink-faint">{profile.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-ember/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ember">
                        {profile.role.replace("_", " ")}
                      </span>
                    </div>
                    <MenuItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>Dashboard</MenuItem>
                    <MenuItem href="/tracker" icon={<ListChecks className="h-4 w-4" />}>My Tracker</MenuItem>
                    <MenuItem href="/portfolio" icon={<FolderHeart className="h-4 w-4" />}>My Portfolio</MenuItem>
                    <MenuItem href="/calendar" icon={<CalendarDays className="h-4 w-4" />}>Calendar</MenuItem>
                    {(profile.role === "club_leader" || profile.role === "admin") && (
                      <MenuItem href="/club-leader" icon={<Users2 className="h-4 w-4" />}>Club Dashboard</MenuItem>
                    )}
                    {profile.role === "admin" && (
                      <MenuItem href="/admin" icon={<Shield className="h-4 w-4" />}>Admin Panel</MenuItem>
                    )}
                    <MenuItem href="/dashboard#settings" icon={<Settings className="h-4 w-4" />}>Settings</MenuItem>
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
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/login" className="text-[15px] font-semibold text-ink hover:text-ember transition-colors">
                Log in
              </Link>
              <Link href="/signup" className={buttonVariants({ variant: "ember", size: "sm" })}>
                Sign up →
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
            className="overflow-hidden border-t border-[rgba(33,30,24,0.09)] bg-paper md:hidden"
          >
            <div className="container flex flex-col gap-1 py-3">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive(l.href) ? "bg-ember/10 text-ember" : "text-ink-soft hover:bg-paper-2"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-[rgba(33,30,24,0.09)]" />
              {profile ? (
                <>
                  <Link href="/dashboard" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-paper-2">Dashboard</Link>
                  {(profile.role === "club_leader" || profile.role === "admin") && (
                    <Link href="/club-leader" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-paper-2">Club Dashboard</Link>
                  )}
                  {profile.role === "admin" && (
                    <Link href="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-paper-2">Admin Panel</Link>
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
                  <Link href="/login" className={buttonVariants({ variant: "sketch", className: "flex-1" })}>Login</Link>
                  <Link href="/signup" className={buttonVariants({ variant: "ember", className: "flex-1" })}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuItem({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink"
    >
      {icon}
      {children}
    </Link>
  );
}
