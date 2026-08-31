"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Eye } from "lucide-react";

interface SecretAdmirerTeaserProps {
  location?: string;
  compatibilityScore?: number;
  timeAgo?: string;
}

export default function SecretAdmirerTeaser({
  location = "Afrique & Diaspora 🌍",
  compatibilityScore = 95,
  timeAgo = "À l'instant",
}: SecretAdmirerTeaserProps) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        border: "1.5px solid rgba(244, 192, 124, 0.3)",
        backgroundColor: "#102017",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)",
        marginBottom: "1.5rem",
        padding: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
        <span className="badge-gold" style={{ fontSize: "0.7rem" }}>
          <Sparkles size={12} /> COUPS DE CŒUR EN DIRECT
        </span>
      </div>

      <h4 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#fbfbfb", margin: "0 0 6px 0" }}>
        Vos coups de cœur apparaîtront ici
      </h4>
      <p style={{ fontSize: "0.8rem", color: "#c7cfcb", margin: "0 0 1.25rem 0", lineHeight: "1.4" }}>
        Dès qu&apos;un membre vérifié like votre profil, sa silhouette apparaîtra ici en temps réel.
      </p>

      <Link
        href="/profile"
        className="btn-outline-gold"
        style={{
          width: "100%",
          padding: "10px 16px",
          fontSize: "0.82rem",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          borderRadius: "999px",
          textDecoration: "none",
        }}
      >
        <Eye size={15} /> Optimiser mon profil pour être liké
      </Link>
    </div>
  );
}
