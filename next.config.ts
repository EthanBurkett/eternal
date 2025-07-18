import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["previews.dropbox.com", "storage.googleapis.com", "*"],
  },
};

export default nextConfig;
