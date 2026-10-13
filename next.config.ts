import type { NextConfig } from "next";

// Static export: `npm run build` writes plain HTML/JS to out/, served by Firebase Hosting.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
};

export default nextConfig;
