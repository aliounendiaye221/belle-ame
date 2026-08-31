"use client";

import React, { useState } from "react";
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
  Info,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import StreakBanner from "@/components/StreakBanner";
import CompatibilityRadar from "@/components/CompatibilityRadar";
import MatchCelebrationModal from "@/components/MatchCelebrationModal";
import SecretAdmirerTeaser from "@/components/SecretAdmirerTeaser";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";
import { realPlatformStore } from "@/lib/real-platform-store";

interface Candidate {
  id: string;
  firstName: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  compatibilityScore: number;
  verifiedKyc: boolean;
  bio: string;
  sharedValues: string[];
  photoUrl: string;
}

export default function DiscoverPage() {
  const [quotaRemaining, setQuotaRemaining] = useState(8);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedCandidate, setMatchedCandidate] = useState<Candidate | null>(null);
  const [showRadarDetails, setShowRadarDetails] = useState(false);

  const candidates: Candidate[] = [
    {
      id: "candidate-1",
      firstName: "Grace",
      age: 26,
      location: "Douala, Cameroun 🇨🇲",
      profession: "Architecte d'Intérieur",
      education: "Master Sup de Co",
      compatibilityScore: 96,
      verifiedKyc: true,
      bio: "Passionnée par le design épuré, la spiritualité chrétienne et la cuisine traditionnelle africaine. Cherche un compagnon sincère orienté mariage.",
      sharedValues: ["Foi Chrétienne", "Désir d'enfants", "Ambition professionnelle", "Non-fumeur"],
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&auto=format&fit=crop&q=80",
    },
    {
      id: "candidate-2",
      firstName: "Bertrand",
      age: 31,
      location: "Cotonou, Bénin 🇧🇯",
      profession: "Ingénieur Logiciel Lead",
      education: "Doctorat Polytechnique",
      compatibilityScore: 89,
      verifiedKyc: true,
      bio: "Esprit calme, sportif et passionné d'entrepreneuriat. Je souhaite bâtir une famille basée sur le respect mutuel et l'authenticité.",
      sharedValues: ["Projet Famille", "Diaspora / Retour", "Écoute active", "Sport"],
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=80",
    },
    {
      id: "candidate-3",
      firstName: "Marie-Joséphine",
      age: 28,
      location: "Abidjan, Côte d'Ivoire 🇨🇮",
      profession: "Chef de Projet Marketing",
      education: "Master ESC",
      compatibilityScore: 92,
      verifiedKyc: true,
      bio: "Rieuse, bienveillante et sincère dans mes démarches. J'aime les voyages en Afrique et la lecture.",
      sharedValues: ["Foi", "Mariage", "Respect des valeurs ancestrales"],
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&auto=format&fit=crop&q=80",
    },
  ];

  const candidate = candidates[currentIdx % candidates.length]!;

  const handleLike = () => {
    if (quotaRemaining > 0) {
      setQuotaRemaining((prev) => prev - 1);
      // Persister l'interaction dans le store réel de la plateforme
      const result = realPlatformStore.likeCandidate(candidate.id);
      
      if (result.isMatch || candidate.compatibilityScore >= 90) {
        setMatchedCandidate(candidate);
        setShowMatchModal(true);
      }
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePass = () => {
    realPlatformStore.dismissCandidate(candidate.id);
    setCurrentIdx((prev) => prev + 1);
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

      {/* Mutual Match Modal */}
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

        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
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
            style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <Crown size={16} color="#f4c07c" /> Offres
          </Link>
          <Link href="/profile" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Profil
          </Link>
        </nav>
      </header>

      {/* Main Discover Layout */}
      <main style={{ flex: 1, padding: "1.75rem 1rem", maxWidth: "1080px", width: "100%", margin: "0 auto" }}>
        
        {/* Habit Loop Streak Banner */}
        <StreakBanner streakDays={4} quotaRemaining={quotaRemaining} maxQuota={10} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
          
          {/* Left Column: Candidate Main Swipe Card */}
          <div style={{ maxWidth: "520px", width: "100%", margin: "0 auto" }}>
            
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
              {/* Photo Area */}
              <div style={{ position: "relative", height: "460px" }}>
                <img
                  src={candidate.photoUrl}
                  alt={candidate.firstName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Top Floating Badges */}
                <div style={{ position: "absolute", top: "16px", left: "16px", right: "16px", display: "flex", justifyContent: "space-between", zIndex: 2 }}>
                  <span className="badge-gold" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                    <Sparkles size={15} color="#f4c07c" /> {candidate.compatibilityScore}% AFFINITÉ SACRÉE
                  </span>
                  {candidate.verifiedKyc && (
                    <span className="badge-emerald" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                      <ShieldCheck size={15} color="#52b788" /> IDENTITÉ CERTIFIÉE
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
                    <h2 style={{ fontSize: "2rem", fontWeight: "900", color: "#fbfbfb", margin: 0 }}>
                      {candidate.firstName}, {candidate.age}
                    </h2>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#d4a373", fontSize: "0.95rem", fontWeight: "700", marginTop: "4px" }}>
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
              <div style={{ padding: "1.25rem 1.75rem", backgroundColor: "#102017", borderTop: "1px solid rgba(212, 163, 115, 0.12)" }}>
                <p style={{ fontSize: "0.88rem", color: "#c7cfcb", lineHeight: "1.5", margin: 0 }}>
                  « {candidate.bio} »
                </p>

                {/* Values Tags */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "1rem" }}>
                  {candidate.sharedValues.map((val, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(212, 163, 115, 0.2)",
                        fontSize: "0.75rem",
                        color: "#f4c07c",
                        fontWeight: "600",
                      }}
                    >
                      ✦ {val}
                    </span>
                  ))}
                </div>

                {/* Toggle Radar Breakdown Button */}
                <button
                  onClick={() => setShowRadarDetails(!showRadarDetails)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#52b788",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    marginTop: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: 0,
                  }}
                >
                  <Sparkles size={14} /> {showRadarDetails ? "Masquer les détails d'affinité" : "Voir les 4 Piliers d'Affinité Jaccard →"}
                </button>

                {/* Detailed Radar Breakdown */}
                {showRadarDetails && (
                  <div style={{ marginTop: "1rem" }}>
                    <CompatibilityRadar overallScore={candidate.compatibilityScore} />
                  </div>
                )}
              </div>

              {/* Action Buttons with Micro-Haptics */}
              <div
                style={{
                  padding: "1.25rem",
                  backgroundColor: "#0d1a13",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1.5rem",
                  borderTop: "1px solid rgba(212, 163, 115, 0.15)",
                }}
              >
                {/* Pass Button */}
                <button
                  onClick={handlePass}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1.5px solid rgba(255, 255, 255, 0.15)",
                    color: "#8a968f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  title="Passer ce profil"
                >
                  <X size={26} />
                </button>

                {/* Super-Like Star Button */}
                <button
                  onClick={handleLike}
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(244, 192, 124, 0.15)",
                    border: "1.5px solid rgba(244, 192, 124, 0.4)",
                    color: "#f4c07c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  title="Super-Like (Priorité d'affichage)"
                >
                  <Star size={24} fill="#f4c07c" />
                </button>

                {/* Like Button (Dopamine Trigger) */}
                <button
                  onClick={handleLike}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f4c07c 0%, #d4a373 50%, #e07a5f 100%)",
                    border: "none",
                    color: "#070d09",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(224, 122, 95, 0.5)",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  title="Aimer ce profil"
                >
                  <Heart size={34} fill="#070d09" />
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Psychological Engagement Sidebar */}
          <div>
            {/* Variable Reward: Secret Admirer Hook */}
            <SecretAdmirerTeaser location="Douala, Cameroun 🇨🇲" compatibilityScore={94} timeAgo="14 minutes" />

            {/* Privilege Perks Banner */}
            <div
              className="glass-panel"
              style={{
                padding: "1.5rem",
                borderRadius: "24px",
                border: "1px solid rgba(212, 163, 115, 0.25)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <Crown size={18} color="#f4c07c" />
                <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "#fbfbfb" }}>Pass Privilège FCFA</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#c7cfcb", lineHeight: "1.45", marginBottom: "1rem" }}>
                Débloquez 50 profils par jour, les retours en arrière illimités et la visibilité prioritaire auprès des profils les plus compatibles.
              </p>
              <Link
                href="/subscription"
                className="btn-primary"
                style={{ width: "100%", padding: "10px", fontSize: "0.85rem" }}
              >
                Activer pour 2 500 FCFA
              </Link>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
