"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Eye, Lock, Flame } from "lucide-react";

interface SecretAdmirerTeaserProps {
  location?: string;
  compatibilityScore?: number;
  timeAgo?: string;
}

export default function SecretAdmirerTeaser({
  location = "Douala, Cameroun 🇨🇲",
  compatibilityScore = 94,
  timeAgo = "14 minutes",
}: SecretAdmirerTeaserProps) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        border: "1.5px solid rgba(244, 192, 124, 0.4)",
        backgroundColor: "#102017",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 163, 115, 0.2)",
        marginBottom: "1.5rem",
      }}
    >
      {/* Blurred Silhouette Background */}
      <div
        style={{
          height: "170px",
          backgroundImage: "url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=40)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(22px) brightness(0.65) saturate(1.5)",
          transform: "scale(1.15)",
        }}
      />

      {/* Golden Overlay with Curiosity Hook */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(16, 32, 23, 0.98) 40%, rgba(16, 32, 23, 0.5) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
          <span className="badge-flame" style={{ fontSize: "0.7rem" }}>
            <Flame size={12} /> COUP DE CŒUR REÇU
          </span>
          <span style={{ fontSize: "0.75rem", color: "#d4a373", fontWeight: "700" }}>
            Il y a {timeAgo}
          </span>
        </div>

        <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.3rem", lineHeight: 1.25 }}>
          Une personne à {location} a aimé votre profil !
        </h4>

        <p style={{ fontSize: "0.8rem", color: "#c7cfcb", marginBottom: "1rem", lineHeight: 1.4 }}>
          Elle partage <strong style={{ color: "#52b788" }}>{compatibilityScore}%</strong> de vos valeurs fondamentales. Révélez son identité sans attendre.
        </p>

        <Link
          href="/subscription"
          style={{
            background: "linear-gradient(135deg, #f4c07c, #d4a373)",
            color: "#070d09",
            fontWeight: "800",
            fontSize: "0.85rem",
            padding: "0.65rem 1.25rem",
            borderRadius: "999px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: "0 4px 15px rgba(212, 163, 115, 0.4)",
            width: "fit-content",
          }}
        >
          <Eye size={15} /> Découvrir Son Profil Immédiatement
        </Link>
      </div>
    </div>
  );
}
