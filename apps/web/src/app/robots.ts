import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://belleame.africa";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/discover", "/subscription", "/faq", "/terms", "/sign-in", "/sign-up"],
        disallow: [
          "/chat/",
          "/profile/",
          "/settings/",
          "/verification/",
          "/matches/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
