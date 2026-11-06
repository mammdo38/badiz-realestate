import type { NextConfig } from "next";
import path from "path";

const isGithubPages = process.env.GITHUB_ACTIONS === "true" || process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
  // Set turbopack root at top level in Next.js 15+
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
