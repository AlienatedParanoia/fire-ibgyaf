"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        An unexpected error occurred. Try again, or head back to the homepage.
      </p>
      <Button onClick={reset} className="mt-6">
        <RotateCcw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
