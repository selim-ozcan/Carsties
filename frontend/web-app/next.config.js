/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    logging: {
      level: "verbose",
    },
    serverActions: true,
  },
  images: {
    domains: ["cdn.pixabay.com", "i0.shbdn.com"],
  },
  output: "standalone",
};

module.exports = nextConfig;
