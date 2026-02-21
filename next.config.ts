import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-8aa95c7abe354643896780aa1f701553.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
