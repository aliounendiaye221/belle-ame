import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@/lib/clerk-client";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://belleame.africa"),
  title: {
    default: "À Chacun Une Belle Âme — Rencontres Sérieuses & Mariage dans Toute l'Afrique",
    template: "%s | À Chacun Une Belle Âme",
  },
  description:
    "La plateforme matrimoniale de référence pour les célibataires d'Afrique (Sénégal, Côte d'Ivoire, Cameroun, Bénin, RDC, Mali, Gabon...) et de la diaspora. Profils 100% majeurs vérifiés par pièce d'identité et reconnaissance faciale. Trouvez l'amour véritable orienté mariage.",
  keywords: [
    "rencontres sérieuses Afrique",
    "mariage chrétien Afrique",
    "mariage musulman Afrique",
    "rencontre Sénégal",
    "mariage Côte d'Ivoire",
    "amour Cameroun",
    "célibataires Bénin",
    "mariage RDC",
    "diaspora africaine mariage",
    "application matrimoniale africaine",
    "rencontres vérifiées 18+",
    "amour sincère Afrique",
  ],
  authors: [{ name: "À Chacun Une Belle Âme", url: "https://belleame.africa" }],
  creator: "À Chacun Une Belle Âme",
  publisher: "À Chacun Une Belle Âme",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "À Chacun Une Belle Âme — Trouvez Votre Partenaire de Vie en Afrique",
    description:
      "La première communauté matrimoniale panafricaine certifiée. Plus de 9 400 célibataires sincères orientés vers le mariage durable.",
    url: "https://belleame.africa",
    siteName: "À Chacun Une Belle Âme",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "À Chacun Une Belle Âme — Mariage & Rencontres Sérieuses Panafricaines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "À Chacun Une Belle Âme — Rencontres Sérieuses en Afrique",
    description: "Rejoignez la communauté panafricaine certifiée de célibataires engagés vers le mariage.",
    images: ["/icons/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070d09",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org JSON-LD pour Agence Matrimoniale et Communauté Sociale
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MarriageAgency",
    "name": "À Chacun Une Belle Âme",
    "alternateName": "Belle Âme Africa",
    "url": "https://belleame.africa",
    "logo": "https://belleame.africa/icons/icon-512.png",
    "description":
      "Plateforme matrimoniale panafricaine certifiée pour les célibataires majeurs d'Afrique et de la diaspora cherchant une union sincère et durable.",
    "areaServed": [
      { "@type": "Continent", "name": "Africa" },
      { "@type": "Country", "name": "Senegal" },
      { "@type": "Country", "name": "Ivory Coast" },
      { "@type": "Country", "name": "Cameroon" },
      { "@type": "Country", "name": "Benin" },
      { "@type": "Country", "name": "Democratic Republic of the Congo" },
      { "@type": "Country", "name": "Mali" },
      { "@type": "Country", "name": "Gabon" },
      { "@type": "Country", "name": "France" },
      { "@type": "Country", "name": "Canada" }
    ],
    "knowsAbout": ["Matrimonial Matchmaking", "Identity Verification KYC", "African Cultural Values", "Christian & Muslim Marriage"],
    "sameAs": [
      "https://facebook.com/belleame.africa",
      "https://instagram.com/belleame.africa"
    ]
  };

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#f4c07c",
              colorBackground: "#122219",
              colorText: "#fbfbfb",
              colorTextSecondary: "#c7cfcb",
              colorInputBackground: "#070d09",
              colorInputBorder: "rgba(212, 163, 115, 0.3)",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
