import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "À Chacun Une Belle Âme — Rencontres Sérieuses & Vérifiées en Afrique",
  description:
    "La première plateforme communautaire de rencontres sérieuses réservée aux personnes majeures, sécurisée et certifiée par vérification d'identité. Cameroun, Bénin, Côte d'Ivoire et Diaspora.",
  keywords: [
    "rencontres sérieuses Afrique",
    "mariage Cameroun",
    "rencontre Bénin",
    "amour Côte d'Ivoire",
    "diaspora africaine",
    "plateforme vérifiée",
    "sécurité rencontres",
  ],
  authors: [{ name: "À Chacun Une Belle Âme" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "À Chacun Une Belle Âme — Rencontres Sérieuses & Vérifiées",
    description:
      "Transformez votre quête sentimentale avec une communauté de confiance de plus de 9 000 membres vérifiés.",
    type: "website",
    locale: "fr_FR",
    siteName: "À Chacun Une Belle Âme",
  },
  twitter: {
    card: "summary_large_image",
    title: "À Chacun Une Belle Âme — Rencontres Sérieuses & Vérifiées",
    description: "Rejoignez 9 000+ pionniers pour des rencontres sérieuses en Afrique francophone.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b130e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
