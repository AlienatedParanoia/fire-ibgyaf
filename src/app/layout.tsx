import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk, Caveat } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HideOnAuthRoutes } from "@/components/hide-on-auth-routes";
import { PageTransition } from "@/components/page-transition";
import { RouteLoader } from "@/components/route-loader";
import { getCurrentUser } from "@/lib/supabase/server";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: ["400", "500"], style: ["normal", "italic"] });
const sans  = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const hand  = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "F.I.R.E — Find. Involve. Reach. Engage.",
  description:
    "Your gateway to every opportunity. F.I.R.E connects Singapore students to extracurricular competitions, clubs, and challenges.",
  keywords: ["Singapore", "students", "competitions", "clubs", "extracurricular", "F.I.R.E"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getCurrentUser();

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${hand.variable}`}>
      <body className="flex min-h-screen flex-col bg-background">
        <RouteLoader />
        <HideOnAuthRoutes>
          <Navbar profile={profile ?? null} />
        </HideOnAuthRoutes>
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <HideOnAuthRoutes>
          <Footer />
        </HideOnAuthRoutes>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{ style: { fontFamily: "var(--font-sans)" } }}
        />
      </body>
    </html>
  );
}
