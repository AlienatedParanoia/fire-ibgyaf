import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label="F.I.R.E home">
      {/* Sized to how it actually renders (h-8) — the source art is 4073px wide
          and this is preloaded on every page, so the optimizer must not be
          asked for a candidate anywhere near that. */}
      <Image
        src="/fire-logo-dark.png"
        alt="F.I.R.E"
        width={102}
        height={32}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}
