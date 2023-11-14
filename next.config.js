/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "static-cdn.jtvnw.net" }],
  },
};

module.exports = nextConfig;
