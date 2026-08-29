"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function MobileStickyCta() {
  return (
    <div
      className="mobile-sticky-bar"
      style={{
        position: "fixed",
        bottom: "16px",
        left: "16px",
        right: "16px",
        zIndex: 99,
        background: "rgba(16, 32, 23, 0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(212, 163, 115, 0.4)",
        borderRadius: "20px",
        padding: "10px 16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 163, 115, 0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "0.72rem", color: "#52b788", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px" }}>
          <ShieldCheck size={13} /> 9 240+ Profils Vérifiés
        </span>
        <span style={{ fontSize: "0.85rem", color: "#fbfbfb", fontWeight: 700 }}>
          Votre moitié vous attend
        </span>
      </div>

      <Link
        href="/register"
        style={{
          background: "linear-gradient(135deg, #f4c07c, #d4a373)",
          color: "#070d09",
          fontWeight: 800,
          fontSize: "0.85rem",
          padding: "8px 18px",
          borderRadius: "999px",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 4px 12px rgba(212, 163, 115, 0.35)",
          flexShrink: 0,
        }}
      >
        Rejoindre <ArrowRight size={14} />
      </Link>
    </div>
  );
}
