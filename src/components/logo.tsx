import Link from "next/link";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fire to-electric shadow-sm">
        <Flame className="h-5 w-5 text-white" />
      </span>
      {showText && (
        <span className="font-heading text-xl font-bold tracking-tight text-charcoal">
          F.I.R.E
        </span>
      )}
    </Link>
  );
}
