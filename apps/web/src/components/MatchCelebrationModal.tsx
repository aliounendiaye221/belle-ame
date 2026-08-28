"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Sparkles, MessageCircle, ArrowRight, X, Send } from "lucide-react";

interface MatchCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateAge: number;
  candidateLocation: string;
  candidatePhoto: string;
  compatibilityScore: number;
  matchId?: string;
  sharedValues?: string[];
}

export default function MatchCelebrationModal({
  isOpen,
  onClose,
  candidateName,
  candidateAge,
  candidateLocation,
  candidatePhoto,
  compatibilityScore,
  matchId = "match-new-001",
  sharedValues = ["Foi Chrétienne", "Projet Mariage", "Valeurs Africaines"],
}: MatchCelebrationModalProps) {
  const [selectedIcebreaker, setSelectedIcebreaker] = useState<string | null>(null);

  if (!isOpen) return null;

  const icebreakers = [
    `Bonjour ${candidateName} ! Notre affinité de ${compatibilityScore}% sur nos valeurs m'a immédiatement touché(e)...`,
    `Ravi(e) de faire ta connaissance ! Quel est ton plus grand rêve pour une vie de famille épanouie ?`,
    `Nos points communs sur « ${sharedValues[0] || "nos valeurs"} » ont attiré mon attention. Comment s'est passée ta journée ?`,
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(5, 12, 8, 0.92)",
        backdropFilter: "blur(18px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          backgroundColor: "#0d1b13",
          border: "2px solid rgba(244, 192, 124, 0.5)",
          borderRadius: "32px",
          padding: "2.5rem 1.75rem",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 163, 115, 0.35)",
          textAlign: "center",
          position: "relative",
          animation: "heartBurst 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#8a968f",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>

        {/* Celebration Title */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "0.5rem" }} className="badge-gold">
          <Sparkles size={14} color="#f4c07c" /> COUP DE FOUDRE MUTUEL !
        </div>

        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "900",
            background: "linear-gradient(135deg, #ffffff 10%, #f4c07c 60%, #e07a5f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
            lineHeight: 1.15,
          }}
        >
          Vos Âmes Se Sont Trouvées ✨
        </h2>

        <p style={{ fontSize: "0.88rem", color: "#c7cfcb", marginBottom: "1.75rem" }}>
          Vous et <strong>{candidateName}</strong> avez exprimé un intérêt réciproque avec un score d&apos;affinité exceptionnelle de{" "}
          <span style={{ color: "#52b788", fontWeight: "800" }}>{compatibilityScore}%</span>.
        </p>

        {/* Dual Avatars Interlocked with Heart Knot */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "2rem", position: "relative" }}>
          {/* User Avatar */}
          <div style={{ position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
              alt="Votre profil"
              style={{
                width: "92px",
                height: "92px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #52b788",
                boxShadow: "0 0 25px rgba(82, 183, 136, 0.5)",
              }}
            />
            <span style={{ position: "absolute", bottom: "-6px", right: "0px", fontSize: "1.2rem" }}>🇨🇲</span>
          </div>

          {/* Golden Heart Connector */}
          <div
            className="animate-heart-pulse"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#f4c07c",
              color: "#070d09",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 25px rgba(244, 192, 124, 0.7)",
              zIndex: 2,
              margin: "0 -10px",
            }}
          >
            <Heart size={24} fill="#070d09" color="#070d09" />
          </div>

          {/* Candidate Avatar */}
          <div style={{ position: "relative" }}>
            <img
              src={candidatePhoto}
              alt={candidateName}
              style={{
                width: "92px",
                height: "92px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #f4c07c",
                boxShadow: "0 0 25px rgba(244, 192, 124, 0.5)",
              }}
            />
            <span style={{ position: "absolute", bottom: "-6px", right: "0px", fontSize: "1.2rem" }}>
              {candidateLocation.includes("Bénin") ? "🇧🇯" : candidateLocation.includes("Ivoire") ? "🇨🇮" : "🇨🇲"}
            </span>
          </div>
        </div>

        {/* Icebreaker Suggestions (Eliminates cognitive friction) */}
        <div style={{ textAlign: "left", marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#d4a373", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            ⚡ Brisez la glace immédiatement (Suggestions) :
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {icebreakers.map((text, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIcebreaker(text)}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "14px",
                  backgroundColor: selectedIcebreaker === text ? "rgba(212, 163, 115, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  border: selectedIcebreaker === text ? "1.5px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.12)",
                  color: selectedIcebreaker === text ? "#fbfbfb" : "#c7cfcb",
                  fontSize: "0.8rem",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  lineHeight: 1.4,
                }}
              >
                « {text} »
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link
            href={`/chat/${matchId}`}
            style={{
              background: "linear-gradient(135deg, #f4c07c 0%, #d4a373 50%, #e07a5f 100%)",
              color: "#070d09",
              fontWeight: "900",
              fontSize: "1rem",
              padding: "1rem",
              borderRadius: "999px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 6px 25px rgba(224, 122, 95, 0.4)",
            }}
          >
            <Send size={18} /> Envoyer le Premier Message Maintenant
          </Link>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#8a968f",
              fontWeight: "600",
              fontSize: "0.85rem",
              padding: "0.75rem",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            Continuer à Explorer d&apos;Autres Profils
          </button>
        </div>
      </div>
    </div>
  );
}
