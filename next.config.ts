import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use standalone output for Docker builds, not Vercel
  ...(process.env.BUILD_STANDALONE === "true" && { output: "standalone" }),
};

export default nextConfig;
