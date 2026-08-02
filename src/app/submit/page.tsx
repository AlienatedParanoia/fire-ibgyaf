import Link from "next/link";
import { Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { getSupabaseServer } from "@/lib/supabase/server";
import { SubmitForm } from "@/components/submit/submit-form";

// The admin can flip submissions off at any moment, so never serve a cached page.
export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const supabase = getSupabaseServer();
  // Respect the admin "allow community submissions" setting (fail open).
  const { data } = supabase
    ? await supabase.from("site_settings").select("allow_submissions").eq("id", 1).maybeSingle()
    : { data: null };
  const allowed = data?.allow_submissions !== false;

  if (!allowed) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="max-w-md rounded-2xl border border-ink/10 bg-panel p-8 text-center shadow-hard-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/5 text-ink-faint">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-medium text-ink">Submissions are closed</h1>
          <p className="mt-2 text-ink-soft">
            Community submissions are paused right now. Please check back later.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/competitions" className={buttonVariants({})}>Browse competitions</Link>
          </div>
        </div>
      </div>
    );
  }

  return <SubmitForm />;
}
