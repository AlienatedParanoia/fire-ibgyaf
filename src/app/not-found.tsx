import Link from "next/link";
import { Flame, Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-fire to-electric shadow-lg">
        <Flame className="h-10 w-10 text-white" />
      </div>
      <p className="font-heading text-6xl font-extrabold fire-text-gradient">404</p>
      <h1 className="mt-2 font-heading text-2xl font-bold text-charcoal">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Looks like this opportunity has expired. Let&apos;s get you back on track.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({})}>
          <Home className="h-4 w-4" /> Back home
        </Link>
        <Link href="/competitions" className={buttonVariants({ variant: "outline" })}>
          <Search className="h-4 w-4" /> Browse competitions
        </Link>
      </div>
    </div>
  );
}
