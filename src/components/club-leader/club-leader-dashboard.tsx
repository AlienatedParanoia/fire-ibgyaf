"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  Trophy,
  Users2,
  PlusCircle,
  Loader2,
  Trash2,
  Clock,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CategoryBadge } from "@/components/competitions/badges";
import { CATEGORIES, cn, formatDate, initials } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Club, Competition, AppUser, CompFormat, CompRegion } from "@/lib/types";

type Tab = "club" | "competitions" | "members";

export function ClubLeaderDashboard({
  userId,
  initialClub,
  initialComps,
  members,
}: {
  userId: string;
  initialClub: Club | null;
  initialComps: Competition[];
  members: AppUser[];
}) {
  const [tab, setTab] = React.useState<Tab>("club");
  const [club, setClub] = React.useState<Club | null>(initialClub);
  const [comps, setComps] = React.useState<Competition[]>(initialComps);
  const [addOpen, setAddOpen] = React.useState(false);

  const tabs: { key: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { key: "club", label: "My Club", icon: Building2 },
    { key: "competitions", label: "Competitions", icon: Trophy, count: comps.length },
    { key: "members", label: "Members", icon: Users2, count: members.length },
  ];

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-xl border border-charcoal/10 bg-white p-1 shadow-sm sm:inline-flex">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-none",
              tab === t.key ? "bg-fire text-white shadow-sm" : "text-charcoal/70 hover:bg-muted"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  tab === t.key ? "bg-white/20" : "bg-charcoal/10"
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "club" && (
        <ClubForm userId={userId} club={club} onSaved={setClub} />
      )}

      {tab === "competitions" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Competitions you&apos;ve submitted. New ones await admin approval.
            </p>
            <Button onClick={() => setAddOpen(true)} disabled={!club}>
              <PlusCircle className="h-4 w-4" /> Add competition
            </Button>
          </div>
          {!club ? (
            <EmptyState
              title="Create your club first"
              description="Set up your club profile before listing competitions."
            />
          ) : comps.length === 0 ? (
            <EmptyState
              icon={<Trophy className="h-7 w-7" />}
              title="No competitions yet"
              description="Add your first competition for students to discover."
              actionLabel="Add competition"
              onAction={() => setAddOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {comps.map((c) => (
                <CompRow
                  key={c.id}
                  comp={c}
                  onDelete={async () => {
                    const supabase = getSupabaseBrowser();
                    if (!supabase) return;
                    setComps((list) => list.filter((x) => x.id !== c.id));
                    await supabase.from("competitions").delete().eq("id", c.id);
                    toast.success("Competition deleted");
                  }}
                />
              ))}
            </div>
          )}
          <AddCompetitionDialog
            open={addOpen}
            onClose={() => setAddOpen(false)}
            userId={userId}
            clubId={club?.id ?? null}
            onAdded={(c) => setComps((list) => [c, ...list])}
          />
        </div>
      )}

      {tab === "members" && (
        <div>
          {members.length === 0 ? (
            <EmptyState
              icon={<Users2 className="h-7 w-7" />}
              title="No members yet"
              description="When students join your club, they'll appear here."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-charcoal/10 bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fire to-electric text-xs font-bold text-white">
                            {initials(m.full_name || m.email)}
                          </span>
                          <div>
                            <p className="font-medium text-charcoal">{m.full_name || "Student"}</p>
                            <p className="text-xs text-muted-foreground">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.school ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.grade ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClubForm({
  userId,
  club,
  onSaved,
}: {
  userId: string;
  club: Club | null;
  onSaved: (c: Club) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: club?.name ?? "",
    description: club?.description ?? "",
    category: club?.category ?? "Tech",
    meeting_schedule: club?.meeting_schedule ?? "",
    contact_email: club?.contact_email ?? "",
    contact_person: club?.contact_person ?? "",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setLoading(true);
    if (club) {
      const { data, error } = await supabase
        .from("clubs")
        .update(form)
        .eq("id", club.id)
        .select()
        .single();
      setLoading(false);
      if (error) return toast.error(error.message);
      onSaved(data as Club);
      toast.success("Club updated");
    } else {
      const { data, error } = await supabase
        .from("clubs")
        .insert({ ...form, leader_id: userId, is_approved: false })
        .select()
        .single();
      setLoading(false);
      if (error) return toast.error(error.message);
      onSaved(data as Club);
      toast.success("Club created — pending admin approval");
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={save}
      className="max-w-2xl space-y-4 rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm"
    >
      {club && (
        <div className="flex items-center gap-2">
          {club.is_approved ? (
            <Badge className="gap-1 bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Approved &amp; live
            </Badge>
          ) : (
            <Badge className="gap-1 bg-amber-100 text-amber-700">
              <Clock className="h-3 w-3" /> Pending approval
            </Badge>
          )}
        </div>
      )}
      <div>
        <Label htmlFor="c-name">Club name *</Label>
        <Input id="c-name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div>
        <Label htmlFor="c-desc">Description</Label>
        <Textarea
          id="c-desc"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-cat">Category</Label>
          <Select id="c-cat" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="c-sched">Meeting schedule</Label>
          <Input
            id="c-sched"
            placeholder="e.g. Wednesdays 3:30–5:30pm"
            value={form.meeting_schedule}
            onChange={(e) => set("meeting_schedule", e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-person">Contact person</Label>
          <Input
            id="c-person"
            value={form.contact_person}
            onChange={(e) => set("contact_person", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="c-email">Contact email</Label>
          <Input
            id="c-email"
            type="email"
            value={form.contact_email}
            onChange={(e) => set("contact_email", e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {club ? "Save changes" : "Create club"}
      </Button>
    </motion.form>
  );
}

function CompRow({ comp, onDelete }: { comp: Competition; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-charcoal">{comp.title}</p>
          {comp.is_approved ? (
            <Badge className="bg-emerald-100 text-emerald-700">Live</Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
          )}
        </div>
        <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <CategoryBadge category={comp.category} /> Deadline {formatDate(comp.deadline)}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete">
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

function AddCompetitionDialog({
  open,
  onClose,
  userId,
  clubId,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  clubId: string | null;
  onAdded: (c: Competition) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    category: "STEM",
    organizer: "",
    deadline: "",
    event_date: "",
    eligibility: "",
    registration_link: "",
    prize: "",
    format: "online" as CompFormat,
    region: "Singapore" as CompRegion,
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return toast.error("Supabase not configured.");
    setLoading(true);
    const { data, error } = await supabase
      .from("competitions")
      .insert({
        title: form.title,
        description: form.description || null,
        category: form.category,
        organizer: form.organizer || null,
        deadline: form.deadline || null,
        event_date: form.event_date || null,
        eligibility: form.eligibility || null,
        registration_link: form.registration_link || null,
        prize: form.prize || null,
        format: form.format,
        region: form.region,
        club_id: clubId,
        submitted_by: userId,
        is_approved: false,
      })
      .select()
      .single();
    setLoading(false);
    if (error) return toast.error(error.message);
    onAdded(data as Competition);
    toast.success("Competition submitted for approval");
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add a competition" className="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="t">Title *</Label>
          <Input id="t" required value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="d">Description</Label>
          <Textarea id="d" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="org">Organiser</Label>
            <Input id="org" value={form.organizer} onChange={(e) => set("organizer", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cat">Category</Label>
            <Select id="cat" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="dl">Deadline</Label>
            <Input id="dl" type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ed">Event date</Label>
            <Input
              id="ed"
              type="date"
              value={form.event_date}
              onChange={(e) => set("event_date", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fmt">Format</Label>
            <Select id="fmt" value={form.format} onChange={(e) => set("format", e.target.value as CompFormat)}>
              <option value="online">Online</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="reg">Region</Label>
            <Select id="reg" value={form.region} onChange={(e) => set("region", e.target.value as CompRegion)}>
              <option value="Singapore">Singapore</option>
              <option value="Global">Global</option>
              <option value="Both">Both</option>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="elig">Eligibility</Label>
            <Input id="elig" value={form.eligibility} onChange={(e) => set("eligibility", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="prize">Prize</Label>
            <Input id="prize" value={form.prize} onChange={(e) => set("prize", e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="link">Registration link</Label>
          <Input
            id="link"
            type="url"
            placeholder="https://"
            value={form.registration_link}
            onChange={(e) => set("registration_link", e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Submit
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
