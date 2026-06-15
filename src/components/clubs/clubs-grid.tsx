"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users2, Calendar, ArrowRight, Users } from "lucide-react";
import { Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CategoryBadge } from "@/components/competitions/badges";
import { CATEGORIES } from "@/lib/utils";
import type { Club } from "@/lib/types";

export function ClubsGrid({ clubs }: { clubs: Club[] }) {
  const [category, setCategory] = React.useState("");
  const filtered = category ? clubs.filter((c) => c.category === category) : clubs;

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
        <span className="text-sm text-muted-foreground">
          {filtered.length} club{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-7 w-7" />}
          title="No clubs here yet"
          description="Be the first to suggest a club for this category."
          actionLabel="Suggest a club"
          actionHref="/submit"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club, i) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
            >
              <ClubCard club={club} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-24 bg-gradient-to-br from-fire to-electric">
        <div className="absolute -bottom-6 left-5 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-white shadow">
          {club.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={club.logo_url} alt="" className="h-full w-full rounded-xl object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-fire to-electric font-heading text-lg font-bold text-white">
              {club.name.charAt(0)}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 pt-8">
        <div className="mb-2 flex items-center justify-between gap-2">
          <CategoryBadge category={club.category} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users2 className="h-3.5 w-3.5" /> {club.member_count}
          </span>
        </div>
        <h3 className="font-heading text-base font-semibold text-charcoal group-hover:text-fire">
          {club.name}
        </h3>
        {club.description && (
          <p className="mt-1 line-clamp-2 flex-1 text-sm text-charcoal/70">{club.description}</p>
        )}
        {club.meeting_schedule && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {club.meeting_schedule}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-electric group-hover:underline">
          Join / Learn more <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
