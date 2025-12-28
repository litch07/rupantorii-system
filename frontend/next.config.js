/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**"
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "4000",
        pathname: "/uploads/**"
      },
      {
        protocol: "https",
        hostname: "rupantorii-system.onrender.com",
        pathname: "/uploads/**"
      }
    ]
  }
};

module.exports = nextConfig;
