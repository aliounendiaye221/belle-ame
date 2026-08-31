import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@/lib/clerk-admin";
import "./globals.css";

export const metadata: Metadata = {
  title: "Back-Office — À Chacun Une Belle Âme",
  description: "Portail de modération, gestion KYC, analytics et administration commerciale de la plateforme À Chacun Une Belle Âme.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      </head>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
