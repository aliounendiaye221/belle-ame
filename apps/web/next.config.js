const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@belle-ame/shared-types", "lucide-react"],
  experimental: {
    outputFileTracingRoot: path.resolve(__dirname, "../../"),
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      "pk_test_d2FudGVkLXNlYXNuYWlsLTY5NzcuY2xlcmsuYWNjb3VudHMuZGV2JA",
    CLERK_SECRET_KEY:
      process.env.CLERK_SECRET_KEY ||
      "sk_test_nBjOjz7I7dx4SDoTq2Lqr8LctVwDp2k1m4JvgEzzfw",
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: "/sign-in",
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: "/sign-up",
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: "/discover",
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: "/onboarding",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
      {
        protocol: "https",
        hostname: "**.belleame.africa",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return [
        {
          source: "/api/v1/:path*",
          destination: `${apiUrl}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
