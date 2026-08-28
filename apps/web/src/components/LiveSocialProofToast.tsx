"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, ShieldCheck, MapPin, X } from "lucide-react";

interface SocialPulse {
  id: string;
  avatarUrl: string;
  title: string;
  subtitle: string;
  badge: string;
}

const LIVE_EVENTS: SocialPulse[] = [
  {
    id: "e1",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    title: "Nouveau Match Validé (96%)",
    subtitle: "Grace & Bertrand viennent de se connecter à Douala 🇨🇲",
    badge: "Match Récent"
  },
  {
    id: "e2",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    title: "Vérification KYC Approuvée 🛡️",
    subtitle: "Fabrice K. (Abidjan 🇨🇮) a obtenu son badge certifié",
    badge: "100% Vérifié"
  },
  {
    id: "e3",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    title: "Témoignage Mariage 💍",
    subtitle: "Mireille & Serge (Diaspora Paris 🇫🇷) : « Mariés grâce à la plateforme »",
    badge: "Union Célébrée"
  },
  {
    id: "e4",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    title: "Forte Activité Communautaire",
    subtitle: "84 membres compatibles sont en ligne actuellement",
    badge: "En Ligne"
  }
];

export default function LiveSocialProofToast() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % LIVE_EVENTS.length);
        setVisible(true);
      }, 600);
    }, 7500);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const event = LIVE_EVENTS[currentIdx]!;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 40,
        maxWidth: "360px",
        width: "calc(100% - 48px)",
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        opacity: visible ? 1 : 0,
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 14px",
          borderRadius: "18px",
          backgroundColor: "rgba(16, 32, 23, 0.92)",
          border: "1px solid rgba(212, 163, 115, 0.35)",
          boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.8), 0 0 25px rgba(82, 183, 136, 0.15)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Pulsing Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={event.avatarUrl}
            alt="Activity avatar"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #d4a373",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#52b788",
              border: "2px solid #102017",
              boxShadow: "0 0 8px #52b788",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: "800",
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: "999px",
                backgroundColor: "rgba(212, 163, 115, 0.2)",
                color: "#f4c07c",
                letterSpacing: "0.04em",
              }}
            >
              {event.badge}
            </span>
          </div>
          <div style={{ fontSize: "0.82rem", fontWeight: "800", color: "#fbfbfb", marginTop: "2px", lineHeight: 1.2 }}>
            {event.title}
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "#c7cfcb",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: "2px",
            }}
          >
            {event.subtitle}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "none",
            border: "none",
            color: "#8a968f",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            flexShrink: 0,
          }}
          title="Fermer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
