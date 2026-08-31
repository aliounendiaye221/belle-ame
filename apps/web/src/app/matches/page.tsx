"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, MessageCircle, Crown, Sparkles, Clock, CheckCircle, Flame, ArrowRight, Lock } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";
import { realPlatformStore, RealMatch } from "@/lib/real-platform-store";

export default function MatchesPage() {
  const [matches, setMatches] = React.useState<RealMatch[]>([]);

  React.useEffect(() => {
    setMatches(realPlatformStore.getMatches());
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070d09",
        color: "#fbfbfb",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LiveSocialProofToast />

      {/* Top Navbar */}
      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(212, 163, 115, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(16, 32, 23, 0.85)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <BrandLogo size="md" />

        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/discover" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Découverte
          </Link>
          <Link
            href="/matches"
            style={{
              color: "#f4c07c",
              fontWeight: "700",
              textDecoration: "none",
              borderBottom: "2px solid #f4c07c",
              paddingBottom: "0.25rem",
              fontSize: "0.92rem",
            }}
          >
            Correspondances ({matches.length})
          </Link>
          <Link href="/chat" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Messages
          </Link>
          <Link
            href="/subscription"
            style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <Crown size={16} color="#f4c07c" /> Offres
          </Link>
          <Link href="/profile" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Profil
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2.5rem 1.5rem", maxWidth: "920px", width: "100%", margin: "0 auto" }}>
        
        {/* Title Header with Urgency Alert */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: "0.5rem" }}>
              <Sparkles size={13} /> AFFINITÉS MUTUELLES ACTIVES
            </span>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#fbfbfb", margin: 0 }}>
              Vos Correspondances d&apos;Âme
            </h1>
            <p style={{ fontSize: "0.88rem", color: "#c7cfcb", marginTop: "4px" }}>
              Chaque correspondance représente un intérêt réciproque confirmé. Engagez la conversation avec sincérité.
            </p>
          </div>

          <div
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "14px",
              backgroundColor: "rgba(224, 122, 95, 0.15)",
              border: "1px solid rgba(224, 122, 95, 0.35)",
              color: "#f4a261",
              fontSize: "0.78rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Clock size={15} /> Règle anti-ghosting : 24h pour initier l&apos;échange
          </div>
        </div>

        {/* Matches List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {matches.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                textAlign: "center",
                padding: "3.5rem 1.5rem",
                borderRadius: "24px",
                border: "1px dashed rgba(212, 163, 115, 0.3)",
              }}
            >
              <Sparkles size={44} color="#d4a373" style={{ margin: "0 auto 1rem", opacity: 0.8 }} />
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#fbfbfb", marginBottom: "0.5rem" }}>
                Zéro faux profil. Aucune correspondance simulée.
              </h3>
              <p style={{ color: "#c7cfcb", fontSize: "0.9rem", maxWidth: "460px", margin: "0 auto 1.5rem", lineHeight: "1.5" }}>
                Votre espace est vierge et intègre. Explorez les profils certifiés de la communauté et envoyez vos premiers cœurs réels.
              </p>
              <Link
                href="/discover"
                className="btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
              >
                <Sparkles size={16} /> Découvrir des Profils Réels
              </Link>
            </div>
          ) : (
            matches.map((match) => (
              <Link
                key={match.id}
                href={`/chat/${match.id}`}
                className="glass-panel"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1.25rem 1.5rem",
                  borderRadius: "24px",
                  textDecoration: "none",
                  gap: "1.25rem",
                  position: "relative",
                  border: match.unread ? "1.5px solid rgba(244, 192, 124, 0.45)" : "1px solid rgba(212, 163, 115, 0.18)",
                }}
              >
              {/* Candidate Avatar with Status */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={match.candidate?.photoUrl || "/images/avatar-woman.jpg"}
                  alt={match.candidate?.firstName || "Membre"}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2.5px solid #d4a373",
                  }}
                />
                {match.unread && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "#52b788",
                      border: "2px solid #102017",
                      boxShadow: "0 0 10px #52b788",
                    }}
                  />
                )}
              </div>

              {/* Match Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1.15rem", fontWeight: "900", color: "#fbfbfb" }}>
                    {match.candidate?.firstName}, {match.candidate?.age} ans
                  </span>
                  <span className="badge-gold" style={{ fontSize: "0.72rem" }}>
                    <Sparkles size={11} /> {match.candidate?.compatibilityScore}% Compatibilité
                  </span>
                  {match.candidate?.verifiedKyc && (
                    <span className="badge-emerald" style={{ fontSize: "0.72rem" }}>
                      <ShieldCheck size={11} /> Certifié
                    </span>
                  )}
                </div>

                <div style={{ fontSize: "0.8rem", color: "#d4a373", fontWeight: "600", marginTop: "2px" }}>
                  {match.candidate?.location}
                </div>

                <p
                  style={{
                    fontSize: "0.85rem",
                    color: match.unread ? "#fbfbfb" : "#8a968f",
                    fontWeight: match.unread ? "700" : "400",
                    margin: "6px 0 0 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {match.lastMessage || "Correspondance active. Écrivez le premier message."}
                </p>
              </div>

              {/* Expiration Timer & CTA */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                <span style={{ fontSize: "0.75rem", color: "#8a968f" }}>{match.lastMessageTime || "Aujourd'hui"}</span>
                <span style={{ fontSize: "0.72rem", color: "#52b788", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={11} /> Accord Mutuel Actif
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "#f4c07c",
                    fontWeight: "800",
                  }}
                >
                  Ouvrir le Chat <ArrowRight size={14} />
                </div>
              </div>
            </Link>
            ))
          )}
        </div>

        {/* Invitation à la communauté réelle */}
        <div
          className="glass-panel"
          style={{
            marginTop: "2.5rem",
            padding: "2rem",
            borderRadius: "28px",
            border: "1.5px dashed rgba(212, 163, 115, 0.35)",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(16, 32, 23, 0.6), rgba(11, 21, 16, 0.8))",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛡️</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.4rem" }}>
            Plateforme Certifiée & Zéro Simulation
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#c7cfcb", maxWidth: "480px", margin: "0 auto 1.5rem" }}>
            Toutes les correspondances générées sur « À Chacun Une Belle Âme » proviennent exclusivement de profils réels vérifiés par pièce d&apos;identité officielle.
          </p>
          <Link href="/discover" className="btn-primary" style={{ fontSize: "0.9rem", padding: "12px 28px", display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <Sparkles size={15} /> Explorer le Radar d&apos;Affinités
          </Link>
        </div>

      </main>
    </div>
  );
}
