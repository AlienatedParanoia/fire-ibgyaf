"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import "./globals.css";

/**
 * Catches errors thrown by the root layout itself. It replaces that layout, so
 * it brings its own <html>/<body> and stylesheet and can't use the fonts,
 * providers or navigation mounted there — hence the plain anchor home.
 */
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-ink antialiased">
        <div className="container flex min-h-screen flex-col items-center justify-center py-16 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-muted-foreground">
            An unexpected error occurred. Try again, or head back to the homepage.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={reset} className={buttonVariants()}>
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
            <a href="/" className={buttonVariants({ variant: "outline" })}>
              <Home className="h-4 w-4" /> Back home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
