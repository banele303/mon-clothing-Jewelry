/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "people.pic1.co",
      },
      {
        protocol: "https",
        hostname: "app-uploads-cdn.fera.ai",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'x-forwarded-host',
            value: 'automatic-eureka-945qvqx6wg9h74q5-3000.app.github.dev', // Replace with your actual hostname
          },
          {
            key: 'origin',
            value: 'http://localhost:3000', // Replace with your actual origin
          },
        ],
      },
    ];
  },
};

export default nextConfig;
