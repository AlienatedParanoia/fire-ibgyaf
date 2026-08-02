/** @type {import('next').NextConfig} */

// /_next/image fetches and caches whatever host it is allowed to, so the only
// remote source is the project's own Supabase storage.
function supabaseImageHost() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  } catch {
    return "*.supabase.co";
  }
}

// Applied to every route; frame-ancestors is the modern twin of X-Frame-Options
// and no other CSP directive is set, so nothing the app loads is restricted.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseImageHost(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Tree-shake heavy libraries so each page ships less JS (faster loads).
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts", "date-fns"],
  },
};

module.exports = nextConfig;
