"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  X,
  Sparkles,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Crown,
  Flame,
  MessageCircle,
  Eye,
  EyeOff,
  Filter,
  Info,
  RotateCcw,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import StreakBanner from "@/components/StreakBanner";
import CompatibilityRadar from "@/components/CompatibilityRadar";
import MatchCelebrationModal from "@/components/MatchCelebrationModal";
import SecretAdmirerTeaser from "@/components/SecretAdmirerTeaser";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";
import MobileBottomNav from "@/components/MobileBottomNav";
import { UserButton } from "@clerk/nextjs";
import { realPlatformStore, RealCandidate } from "@/lib/real-platform-store";

export default function DiscoverPage() {
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [candidates, setCandidates] = useState<RealCandidate[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [quotaRemaining, setQuotaRemaining] = useState(10);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedCandidate, setMatchedCandidate] = useState<RealCandidate | null>(null);
  const [showRadarDetails, setShowRadarDetails] = useState(false);
  const [isModestyMode, setIsModestyMode] = useState(false);

  // Chargement des données au montage et lors du changement de filtre
  useEffect(() => {
    const profile = realPlatformStore.getProfile();
    setQuotaRemaining(profile.dailyQuotaRemaining);

    const list = realPlatformStore.getCandidates({
      countryCode: selectedCountry !== "ALL" ? selectedCountry : undefined,
    });
    setCandidates(list);
    setCurrentIdx(0);
  }, [selectedCountry]);

  const hasExhausted = currentIdx >= candidates.length;
  const candidate = !hasExhausted ? candidates[currentIdx]! : null;

  const handleLike = () => {
    if (!candidate) return;
    if (quotaRemaining > 0) {
      const result = realPlatformStore.likeCandidate(candidate.id);
      setQuotaRemaining(result.remainingQuota);

      if (result.isMatch || candidate.compatibilityScore >= 92) {
        setMatchedCandidate(candidate);
        setShowMatchModal(true);
      }
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePass = () => {
    if (!candidate) return;
    realPlatformStore.dismissCandidate(candidate.id);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    setSelectedCountry("ALL");
    const list = realPlatformStore.getCandidates();
    setCandidates(list);
    setCurrentIdx(0);
  };

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

      {/* Modal de célébration de match mutuel */}
      {matchedCandidate && (
        <MatchCelebrationModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          candidateName={matchedCandidate.firstName}
          candidateAge={matchedCandidate.age}
          candidateLocation={matchedCandidate.location}
          candidatePhoto={matchedCandidate.photoUrl}
          compatibilityScore={matchedCandidate.compatibilityScore}
          sharedValues={matchedCandidate.sharedValues}
        />
      )}

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

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <nav className="desktop-only-nav" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link
              href="/discover"
              style={{
                color: "#f4c07c",
                fontWeight: "700",
                textDecoration: "none",
                borderBottom: "2px solid #f4c07c",
                paddingBottom: "0.25rem",
                fontSize: "0.92rem",
              }}
            >
              Découverte
            </Link>
            <Link href="/matches" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
              Correspondances
            </Link>
            <Link
              href="/subscription"
              style={{
                color: "#c7cfcb",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "0.92rem",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Crown size={16} color="#f4c07c" /> Offres
            </Link>
            <Link href="/profile" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
              Mon Profil
            </Link>
          </nav>

          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Discover Layout */}
      <main
        className="discover-layout"
        style={{
          flex: 1,
          maxWidth: "1140px",
          width: "100%",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "2.5rem",
        }}
      >
        {/* Left Column: Discovery Card & Controls */}
        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Top Info Bar with Daily Quota & Modesty Switch */}
          <div
            className="discover-info-bar"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              backgroundColor: "#102017",
              padding: "0.85rem 1.25rem",
              borderRadius: "16px",
              border: "1px solid rgba(212, 163, 115, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} color="#f4c07c" />
              <span style={{ fontSize: "0.9rem", color: "#c7cfcb" }}>
                Quota quotidien :{" "}
                <strong style={{ color: quotaRemaining > 0 ? "#f4c07c" : "#e63946" }}>
                  {quotaRemaining}
                </strong>{" "}
                propositions restantes
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Bouton Mode Pudeur */}
              <button
                type="button"
                onClick={() => setIsModestyMode(!isModestyMode)}
                style={{
                  background: isModestyMode ? "rgba(244, 192, 124, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  border: isModestyMode ? "1px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.2)",
                  color: isModestyMode ? "#f4c07c" : "#c7cfcb",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {isModestyMode ? <EyeOff size={14} /> : <Eye size={14} />}
                Mode Pudeur {isModestyMode ? "Actif" : "Désactivé"}
              </button>

              <Link
                href="/subscription"
                style={{
                  fontSize: "0.8rem",
                  color: "#52b788",
                  fontWeight: "700",
                  textDecoration: "none",
                  backgroundColor: "rgba(82, 183, 136, 0.12)",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "999px",
                }}
              >
                + Illimité
              </Link>
            </div>
          </div>

          {/* Filtres Rapides par Pays Africains */}
          <div
            className="discover-country-scroll"
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "0.25rem",
            }}
          >
            {[
              { code: "ALL", label: "Tous les Pays 🌍" },
              { code: "SN", label: "Sénégal 🇸🇳" },
              { code: "CI", label: "Côte d'Ivoire 🇨🇮" },
              { code: "CM", label: "Cameroun 🇨🇲" },
              { code: "BJ", label: "Bénin 🇧🇯" },
              { code: "CD", label: "RDC 🇨🇩" },
              { code: "ML", label: "Mali 🇲🇱" },
              { code: "GA", label: "Gabon 🇬🇦" },
              { code: "FR", label: "Diaspora 🇫🇷" },
            ].map((f) => (
              <button
                key={f.code}
                type="button"
                onClick={() => setSelectedCountry(f.code)}
                style={{
                  padding: "0.45rem 0.95rem",
                  borderRadius: "999px",
                  border: selectedCountry === f.code ? "1.5px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.2)",
                  backgroundColor: selectedCountry === f.code ? "rgba(244, 192, 124, 0.18)" : "#102017",
                  color: selectedCountry === f.code ? "#f4c07c" : "#c7cfcb",
                  fontSize: "0.82rem",
                  fontWeight: selectedCountry === f.code ? "800" : "500",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Candidate Card */}
          {hasExhausted || !candidate ? (
            <div
              className="glass-panel"
              style={{
                padding: "3.5rem 2rem",
                borderRadius: "32px",
                border: "1.5px dashed rgba(212, 163, 115, 0.3)",
                textAlign: "center",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
              }}
            >
              <Sparkles size={52} color="#f4c07c" style={{ margin: "0 auto 1.25rem" }} />
              <h2 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.5rem" }}>
                Vous êtes à jour ! 🌟
              </h2>
              <p style={{ color: "#c7cfcb", fontSize: "0.92rem", lineHeight: "1.6", marginBottom: "2rem" }}>
                Vous avez consulté tous les profils certifiés actuellement disponibles pour ce filtre. De nouveaux célibataires vérifiés rejoignent l&apos;Alliance quotidiennement.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "280px", margin: "0 auto" }}>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn-primary"
                  style={{
                    padding: "12px 20px",
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <RotateCcw size={16} /> Élargir à toute l&apos;Afrique
                </button>
                <Link
                  href="/matches"
                  className="btn-secondary"
                  style={{ padding: "12px 20px", fontSize: "0.88rem", textDecoration: "none", textAlign: "center" }}
                >
                  Consulter mes correspondances
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="glass-panel"
              style={{
                position: "relative",
                borderRadius: "32px",
                overflow: "hidden",
                border: "2px solid rgba(244, 192, 124, 0.35)",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 163, 115, 0.2)",
              }}
            >
              {/* Photo Area with Modesty Mode */}
              <div className="discover-photo-area" style={{ position: "relative", height: "460px", overflow: "hidden" }}>
                <img
                  src={candidate.photoUrl}
                  alt={candidate.firstName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: isModestyMode ? "blur(24px)" : "none",
                    transform: isModestyMode ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.3s ease",
                  }}
                />

                {/* Top Floating Badges */}
                <div
                  className="discover-top-badges"
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    right: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    zIndex: 2,
                  }}
                >
                  <span className="badge-gold" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                    <Sparkles size={15} color="#f4c07c" /> {candidate.compatibilityScore}% AFFINITÉ SACRÉE
                  </span>
                  {candidate.verifiedKyc && (
                    <span className="badge-emerald" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                      <ShieldCheck size={15} color="#52b788" /> IDENTITÉ CERTIFIÉE 🛡️
                    </span>
                  )}
                </div>

                {/* Gradient Overlay for Info */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(16, 32, 23, 1) 15%, rgba(16, 32, 23, 0.6) 45%, transparent 75%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "1.75rem",
                    zIndex: 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <h2 className="discover-card-name" style={{ fontSize: "2rem", fontWeight: "900", color: "#fbfbfb", margin: 0 }}>
                      {candidate.firstName}, {candidate.age}
                    </h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#d4a373",
                      fontSize: "0.95rem",
                      fontWeight: "700",
                      marginTop: "4px",
                    }}
                  >
                    <MapPin size={16} /> {candidate.location}
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "6px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#c7cfcb", fontSize: "0.82rem" }}>
                      <Briefcase size={14} color="#8a968f" /> {candidate.profession}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#c7cfcb", fontSize: "0.82rem" }}>
                      <GraduationCap size={14} color="#8a968f" /> {candidate.education}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Values Preview */}
              <div className="discover-card-bio" style={{ padding: "1.25rem 1.75rem", backgroundColor: "#102017", borderTop: "1px solid rgba(212, 163, 115, 0.12)" }}>
                <p style={{ color: "#c7cfcb", fontSize: "0.92rem", lineHeight: "1.6", margin: "0 0 1rem 0" }}>
                  &laquo; {candidate.bio} &raquo;
                </p>

                {/* Values Tags */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {candidate.sharedValues.map((val, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: "rgba(212, 163, 115, 0.12)",
                        border: "1px solid rgba(212, 163, 115, 0.25)",
                        color: "#f4c07c",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        padding: "0.3rem 0.75rem",
                        borderRadius: "999px",
                      }}
                    >
                      {val}
                    </span>
                  ))}
                </div>

                {/* Toggle Radar */}
                <button
                  type="button"
                  onClick={() => setShowRadarDetails(!showRadarDetails)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#f4c07c",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Info size={14} /> {showRadarDetails ? "Masquer les détails mathématiques" : "Voir le radar de compatibilité détaillée"}
                </button>

                {showRadarDetails && (
                  <div style={{ marginTop: "1rem" }}>
                    <CompatibilityRadar
                      candidateName={candidate.firstName}
                      score={candidate.compatibilityScore}
                      valuesOverlap={candidate.sharedValues}
                      city={candidate.location}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons: Pass & Like */}
              <div
                className="discover-action-bar"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.5fr",
                  gap: "1rem",
                  padding: "1.25rem 1.75rem",
                  backgroundColor: "rgba(16, 32, 23, 0.95)",
                  borderTop: "1px solid rgba(212, 163, 115, 0.15)",
                }}
              >
                <button
                  type="button"
                  onClick={handlePass}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(230, 57, 70, 0.4)",
                    color: "#ff858d",
                    padding: "0.85rem",
                    borderRadius: "999px",
                    fontWeight: "700",
                    fontSize: "0.92rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <X size={18} /> Passer
                </button>

                <button
                  type="button"
                  onClick={handleLike}
                  disabled={quotaRemaining <= 0}
                  style={{
                    background: quotaRemaining > 0 ? "linear-gradient(135deg, #f4c07c, #d4a373)" : "#2c3e35",
                    border: "none",
                    color: quotaRemaining > 0 ? "#070d09" : "#6c7a72",
                    padding: "0.85rem",
                    borderRadius: "999px",
                    fontWeight: "800",
                    fontSize: "0.95rem",
                    cursor: quotaRemaining > 0 ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: quotaRemaining > 0 ? "0 6px 20px rgba(244, 192, 124, 0.35)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Heart size={18} fill={quotaRemaining > 0 ? "#070d09" : "transparent"} />
                  {quotaRemaining > 0 ? "Coup de Cœur d'Honneur" : "Quota atteint aujourd'hui"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Streaks & Secret Admirer */}
        <aside className="discover-sidebar" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Streak Banner */}
          <StreakBanner />

          {/* Secret Admirer Teaser */}
          <SecretAdmirerTeaser count={3} />
        </aside>
      </main>

      <MobileBottomNav activeTab="discover" />
    </div>
  );
}
