import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://cryptologos.cc/logos/**")],
  },
};

export default nextConfig;
