/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Tree-shake heavy libraries so each page ships less JS (faster loads).
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts", "date-fns"],
  },
};

module.exports = nextConfig;
