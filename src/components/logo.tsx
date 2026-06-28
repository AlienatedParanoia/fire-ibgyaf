import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  /** "dark" = dark mark for light backgrounds; "light" = cream mark for dark backgrounds */
  variant?: "dark" | "light";
}) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label="F.I.R.E home">
      <Image
        src={variant === "light" ? "/fire-logo.png" : "/fire-logo-dark.png"}
        alt="F.I.R.E"
        width={4073}
        height={1281}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}
