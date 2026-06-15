import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-heading text-2xl font-medium tracking-wide text-ink">F.I.R.E</span>
      <span
        className="font-hand text-[18px] text-ember"
        style={{ transform: "rotate(-6deg)", display: "inline-block" }}
      >
        (beta)
      </span>
    </Link>
  );
}
