import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for PythonAnywhere single-server hosting
  output: "export",
  devIndicators: false,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
