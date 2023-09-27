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
};

module.exports = nextConfig;
