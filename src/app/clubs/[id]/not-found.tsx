import Link from "next/link";
import { Users2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";

export default function ClubNotFound() {
  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-beige text-ink">
        <Users2 className="h-7 w-7" />
      </div>
      <h1 className="font-heading text-3xl font-medium text-ink">We couldn&apos;t find that club</h1>
      <p className="mt-2 max-w-md text-ink-soft">
        It may have been removed or isn&apos;t published yet. Browse the clubs that are open right now.
      </p>
      <Link href="/clubs" className={buttonVariants({ className: "mt-6" })}>
        Browse all clubs
      </Link>
    </div>
  );
}
