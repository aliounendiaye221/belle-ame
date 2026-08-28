"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0b130e",
      color: "#f8f9fa",
      fontFamily: "system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
      backgroundImage: "radial-gradient(circle at 50% 40%, rgba(230, 57, 70, 0.1) 0%, transparent 50%)"
    }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
      <h1 style={{ fontWeight: "800", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Une erreur est survenue
      </h1>
      <p style={{ color: "#c2c9c4", fontSize: "0.9rem", maxWidth: "420px", lineHeight: "1.6", marginBottom: "2rem" }}>
        Nous sommes désolés pour ce désagrément. Notre équipe a été notifiée et travaille sur la résolution du problème.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            borderRadius: "999px",
            background: "linear-gradient(135deg, #d4a373, #e07a5f)",
            color: "#0b130e",
            fontWeight: "700",
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(224, 122, 95, 0.35)"
          }}
        >
          🔄 Réessayer
        </button>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(212, 163, 115, 0.3)",
            color: "#d4a373",
            fontWeight: "600",
            fontSize: "0.9rem",
            textDecoration: "none"
          }}
        >
          🏠 Accueil
        </a>
      </div>
    </div>
  );
}
