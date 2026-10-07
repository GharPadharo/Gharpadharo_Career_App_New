/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/careers",
        destination: "/jobs",
        permanent: true,
      },
      {
        source: "/careers/jobs/:id",
        destination: "/jobs/:id",
        permanent: true,
      },
      {
        source: "/careers/jobs/:id/apply",
        destination: "/jobs/:id/apply",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
