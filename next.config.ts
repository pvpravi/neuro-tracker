import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: "20mb", // Fixed the warning from your log
  },
  compiler: {
    styledComponents: true, // Helps with CSS-in-JS build errors
  },
};

export default nextConfig;