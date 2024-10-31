// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // Sesuaikan dengan port API Anda
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
