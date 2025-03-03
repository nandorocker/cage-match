import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/tier-:tier((?!1|2|3|4|5|6)[\\w-]*)',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
