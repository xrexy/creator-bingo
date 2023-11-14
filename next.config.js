/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "static-cdn.jtvnw.net" }],
  },
  experimental: {
    ppr: true,
  }
};

module.exports = nextConfig;
