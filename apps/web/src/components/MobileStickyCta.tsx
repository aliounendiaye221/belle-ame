"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function MobileStickyCta() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    try {
      const p = localStorage.getItem("belleame_real_profile");
      if (p) setIsLoggedIn(true);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div
      className="mobile-sticky-bar"
      style={{
        position: "fixed",
        bottom: "max(14px, env(safe-area-inset-bottom))",
        left: "14px",
        right: "14px",
        zIndex: 49,
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
          {isLoggedIn ? "Reprenez vos échanges" : "Votre moitié vous attend"}
        </span>
      </div>

      <Link
        href={isLoggedIn ? "/discover" : "/auth/login"}
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
        {isLoggedIn ? "Mon Espace" : "Rejoindre"} <ArrowRight size={14} />
      </Link>
    </div>
  );
}
