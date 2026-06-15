import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { getCurrentUser } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: "F.I.R.E — Find. Involve. Reach. Engage.",
  description:
    "Your gateway to every opportunity. F.I.R.E connects Singapore students to extracurricular competitions, clubs, and challenges.",
  keywords: ["Singapore", "students", "competitions", "clubs", "extracurricular", "F.I.R.E"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getCurrentUser();

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-screen flex-col bg-background">
        <Navbar profile={profile ?? null} />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{ style: { fontFamily: "var(--font-inter)" } }}
        />
      </body>
    </html>
  );
}
