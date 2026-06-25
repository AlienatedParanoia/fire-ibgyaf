"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, Mail, User, X, Clock, Pencil, Users as UsersIcon } from "lucide-react";
import { Select } from "@/components/ui/input";
import { JoinClubButton } from "./join-club-button";
import { ClubFormDialog } from "./club-form-dialog";
import { CATEGORIES, cn, deadlineUrgency } from "@/lib/utils";
import type { Club, Competition } from "@/lib/types";

const BANNER_GRADIENT = "linear-gradient(135deg, #F75C4C 0%, #E0402F 70%, #020202 240%)";

export function ClubsGrid({
  clubs: initialClubs,
  compsByClub = {},
  isAdmin = false,
}: {
  clubs: Club[];
  compsByClub?: Record<string, Competition[]>;
  isAdmin?: boolean;
}) {
  const [clubs, setClubs] = React.useState<Club[]>(initialClubs);
  const [category, setCategory] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<Club | null>(null);

  const filtered = category ? clubs.filter((c) => c.category === category) : clubs;
  const active = clubs.find((c) => c.id === activeId) ?? null;

  React.useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveId(null);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-xs">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <span className="text-sm text-ink-faint">
          <b className="text-ink">{filtered.length}</b> club{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-beige text-ink">
            <UsersIcon className="h-7 w-7" />
          </div>
          <h3 className="font-heading text-2xl font-medium text-ink">No clubs in this category yet</h3>
          <p className="mt-2 text-ink-faint">Be the first to suggest a club for this category.</p>
          <button
            onClick={() => setCategory("")}
            className="mt-5 inline-flex h-11 items-center rounded-full border-[1.5px] border-ink px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Show all clubs
          </button>
        </div>
      ) : (
        <div className="grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club, i) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(i * 0.012, 0.1) }}
            >
              <ClubCard club={club} onOpen={() => setActiveId(club.id)} />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {active && (
          <ClubModal
            club={active}
            comps={compsByClub[active.id] ?? []}
            onClose={() => setActiveId(null)}
            isAdmin={isAdmin}
            onEdit={() => setEditing(active)}
          />
        )}
      </AnimatePresence>

      {isAdmin && (
        <ClubFormDialog
          open={!!editing}
          club={editing}
          onClose={() => setEditing(null)}
          onSaved={(c) => {
            setClubs((list) => list.map((x) => (x.id === c.id ? c : x)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function Avatar({ club, size, radius }: { club: Club; size: number; radius: number }) {
  if (club.logo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={club.logo_url}
        alt=""
        style={{ width: size, height: size, borderRadius: radius, objectFit: "cover" }}
        className="block"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, borderRadius: radius, background: "#020202" }}
      className="flex items-center justify-center font-heading font-medium text-paper"
    >
      <span style={{ fontSize: size * 0.45 }}>{club.name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

function Banner({ club, height, rounded }: { club: Club; height: number; rounded?: string }) {
  if (club.banner_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={club.banner_url}
        alt=""
        style={{ height, borderRadius: rounded }}
        className="block w-full object-cover"
      />
    );
  }
  return <div style={{ height, background: BANNER_GRADIENT, borderRadius: rounded }} className="w-full" />;
}

function ClubCard({ club, onOpen }: { club: Club; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[16px] border-[1.5px] border-ink/12 bg-panel shadow-hard-card transition-all hover:-translate-y-0.5 hover:shadow-hard-hover"
    >
      <div className="relative" style={{ height: 84 }}>
        <Banner club={club} height={84} />
        <div className="absolute" style={{ left: 18, bottom: -22 }}>
          <div className="rounded-[13px] border-[3px] border-panel">
            <Avatar club={club} size={54} radius={11} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 pt-8">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-beige px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">
            {club.category ?? "Other"}
          </span>
          <span className="flex items-center gap-1 text-xs text-ink-faint">
            <Users className="h-3.5 w-3.5" /> {club.member_count}
          </span>
        </div>
        <h3 className="font-heading text-[19px] font-medium leading-snug text-ink">{club.name}</h3>
        {club.description && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-soft">{club.description}</p>
        )}
        {club.meeting_schedule && (
          <p className="mt-3.5 flex items-center gap-1.5 text-xs text-ink-faint">
            <Calendar className="h-3.5 w-3.5" /> {club.meeting_schedule}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-ink-faint transition-colors group-hover:text-coral">
          Join / Learn more →
        </span>
      </div>
    </div>
  );
}

function ClubModal({
  club,
  comps,
  onClose,
  isAdmin,
  onEdit,
}: {
  club: Club;
  comps: Competition[];
  onClose: () => void;
  isAdmin: boolean;
  onEdit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      style={{ background: "rgba(2,2,2,0.5)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-[720px] overflow-hidden rounded-[20px] border-[1.5px] border-ink/16 bg-panel shadow-hard-modal"
      >
        {/* banner header */}
        <div className="relative" style={{ height: 120 }}>
          <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "20px 20px 0 0" }}>
            <Banner club={club} height={120} />
          </div>
          {isAdmin && (
            <button
              onClick={onEdit}
              aria-label="Edit club"
              className="absolute left-4 top-4 z-[2] flex rounded-[9px] p-2 text-paper"
              style={{ background: "rgba(2,2,2,0.35)" }}
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-[2] flex rounded-[9px] p-2 text-paper"
            style={{ background: "rgba(2,2,2,0.35)" }}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute z-[2]" style={{ left: 30, bottom: -30 }}>
            <div className="rounded-[16px] border-4 border-panel">
              <Avatar club={club} size={72} radius={13} />
            </div>
          </div>
        </div>

        <div className="px-6 pb-7 pt-11 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="rounded-full bg-beige px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">
                  {club.category ?? "Other"}
                </span>
                <span className="flex items-center gap-1 text-[13px] text-ink-faint">
                  <Users className="h-3.5 w-3.5" /> {club.member_count} members
                </span>
              </div>
              <h2 className="font-heading text-3xl font-medium leading-tight text-ink">{club.name}</h2>
            </div>
            <JoinClubButton clubId={club.id} clubName={club.name} />
          </div>

          {club.description && (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{club.description}</p>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <InfoCard icon={<Calendar className="h-3.5 w-3.5" />} label="Meets" value={club.meeting_schedule} />
            <InfoCard icon={<User className="h-3.5 w-3.5" />} label="Contact" value={club.contact_person} />
            <InfoCard icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={club.contact_email} breakAll />
          </div>

          {comps.length > 0 && (
            <>
              <h3 className="mb-3 mt-7 font-heading text-xl font-medium text-ink">
                Competitions from this club
              </h3>
              <div className="flex flex-col gap-2.5">
                {comps.map((k) => {
                  const urgency = deadlineUrgency(k.deadline);
                  return (
                    <Link
                      key={k.id}
                      href={`/competitions?c=${k.id}`}
                      className="flex items-center justify-between gap-3 rounded-[12px] border-[1.5px] border-ink/10 bg-paper px-4 py-3.5 transition-colors hover:border-ink/25"
                    >
                      <span>
                        <span className="block font-heading text-base font-medium text-ink">{k.title}</span>
                        {k.organizer && (
                          <span className="mt-0.5 block text-xs text-ink-faint">{k.organizer}</span>
                        )}
                      </span>
                      <span className={cn("flex flex-none items-center gap-1.5 text-[13px] font-semibold", urgency.color)}>
                        <Clock className="h-3.5 w-3.5" /> {urgency.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  breakAll,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  breakAll?: boolean;
}) {
  return (
    <div className="rounded-[12px] border-[1.5px] border-ink/12 bg-paper p-3.5">
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
        {icon} {label}
      </div>
      <div className={cn("mt-1.5 text-[13.5px] font-medium text-ink", breakAll && "break-all")}>
        {value || "—"}
      </div>
    </div>
  );
}
