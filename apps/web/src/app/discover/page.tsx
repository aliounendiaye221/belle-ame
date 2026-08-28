"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Heart, X, Sparkles, Filter, MessageCircle, Info, Crown, MapPin, Briefcase, GraduationCap } from "lucide-react";

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
  const [quotaRemaining, setQuotaRemaining] = useState(9); // 10 free quota
  const [currentIdx, setCurrentIdx] = useState(0);

  const candidates: Candidate[] = [
    {
      id: "candidate-1",
      firstName: "Grace",
      age: 26,
      location: "Douala, Cameroun 🇨🇲",
      profession: "Architecte d'Intérieur",
      education: "Master Sup de Co",
      compatibilityScore: 94,
      verifiedKyc: true,
      bio: "Passionnée par le design épuré, la spiritualité chrétienne et la cuisine traditionnelle africaine. Cherche un compagnon sincère orienté mariage.",
      sharedValues: ["Foi Chrétienne", "Désir d'enfants", "Ambition professionnelle", "Non-fumeur"],
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "candidate-2",
      firstName: "Bertrand",
      age: 31,
      location: "Cotonou, Bénin 🇧🇯",
      profession: "Ingénieur Logiciel Lead",
      education: "Doctorat Polytechnique",
      compatibilityScore: 88,
      verifiedKyc: true,
      bio: "Esprit calme, sportif et passionné d'entrepreneuriat. Je souhaite bâtir une famille basée sur le respect mutuel et l'authenticité.",
      sharedValues: ["Projet Famille", "Diaspora / Retour", "Écoute active", "Sport"],
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "candidate-3",
      firstName: "Marie-Joséphine",
      age: 28,
      location: "Abidjan, Côte d'Ivoire 🇨🇮",
      profession: "Chef de Projet Marketing",
      education: "Master ESC",
      compatibilityScore: 91,
      verifiedKyc: true,
      bio: "Rieuse, bienveillante et sincère dans mes démarches. J'aime les voyages en Afrique et la lecture.",
      sharedValues: ["Foi", "Mariage", "Respect des valeurs ancestrales"],
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80"
    }
  ];

  const candidate = candidates[currentIdx % candidates.length]!;

  const handleLike = () => {
    if (quotaRemaining > 0) {
      setQuotaRemaining(quotaRemaining - 1);
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePass = () => {
    setCurrentIdx(currentIdx + 1);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Top Navbar */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>À Chacun Une Belle Âme</span>
        </div>

        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/discover" style={{ color: "#d4a373", fontWeight: "700", textDecoration: "none", borderBottom: "2px solid #d4a373", paddingBottom: "0.25rem" }}>
            Découverte
          </Link>
          <Link href="/matches" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500" }}>
            Correspondances
          </Link>
          <Link href="/subscription" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Crown size={16} color="#d4a373" /> Offres
          </Link>
          <Link href="/profile" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500" }}>
            Profil
          </Link>
        </nav>
      </header>

      {/* Main Swipe Section */}
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "480px", width: "100%", position: "relative" }}>
          
          {/* Daily Quota Counter Banner */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", backgroundColor: "#14231a", padding: "0.75rem 1.25rem", borderRadius: "16px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ fontSize: "0.85rem", color: "#a0aba4" }}>
              Quota quotidien restant : <strong style={{ color: quotaRemaining > 0 ? "#52b788" : "#e63946" }}>{quotaRemaining} / 10 gratuit</strong>
            </div>
            <Link href="/subscription" style={{ fontSize: "0.8rem", color: "#d4a373", textDecoration: "none", fontWeight: "600" }}>
              Passez à 50/j →
            </Link>
          </div>

          {/* Profile Card */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(212, 163, 115, 0.25)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
            
            {/* Image Header with Badge Overlay */}
            <div style={{ position: "relative", height: "360px", backgroundImage: `url(${candidate.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20, 35, 26, 1) 0%, rgba(20, 35, 26, 0) 60%)" }} />
              
              {/* Score Badge */}
              <div style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: "rgba(11, 19, 14, 0.85)", backdropFilter: "blur(8px)", border: "1px solid #d4a373", padding: "0.5rem 0.9rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.4rem", color: "#d4a373", fontWeight: "800", fontSize: "0.95rem" }}>
                <Sparkles size={16} /> {candidate.compatibilityScore}% Compatible
              </div>

              {/* KYC Verified Badge */}
              {candidate.verifiedKyc && (
                <div style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "rgba(82, 183, 136, 0.85)", backdropFilter: "blur(8px)", padding: "0.4rem 0.8rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.35rem", color: "#0b130e", fontWeight: "700", fontSize: "0.8rem" }}>
                  <ShieldCheck size={14} /> Profil Vérifié KYC
                </div>
              )}

              {/* Identity Info */}
              <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px" }}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "0.25rem" }}>
                  {candidate.firstName}, {candidate.age} ans
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#d4a373", fontSize: "0.9rem", fontWeight: "600" }}>
                  <MapPin size={16} /> {candidate.location}
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "#a0aba4" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Briefcase size={14} color="#d4a373" /> {candidate.profession}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><GraduationCap size={14} color="#d4a373" /> {candidate.education}</span>
              </div>

              <p style={{ fontSize: "0.9rem", lineHeight: "1.5", color: "#c2c9c4", margin: 0 }}>
                "{candidate.bio}"
              </p>

              {/* Shared Values Tags */}
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "#d4a373", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Points forts de compatibilité :
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {candidate.sharedValues.map((val, idx) => (
                    <span key={idx} style={{ backgroundColor: "rgba(212, 163, 115, 0.12)", border: "1px solid rgba(212, 163, 115, 0.25)", color: "#d4a373", fontSize: "0.75rem", padding: "0.35rem 0.75rem", borderRadius: "15px", fontWeight: "500" }}>
                      ✓ {val}
                    </span>
                  ))}
                </div>
              </div>

              {/* Swiping Action Buttons */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", marginTop: "0.5rem" }}>
                <button
                  onClick={handlePass}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#081c15",
                    border: "1px solid rgba(230, 57, 70, 0.4)",
                    color: "#e63946",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s ease"
                  }}
                >
                  <X size={28} />
                </button>

                <button
                  onClick={handleLike}
                  disabled={quotaRemaining <= 0}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    backgroundColor: quotaRemaining <= 0 ? "#5a6660" : "#d4a373",
                    border: "none",
                    color: "#0b130e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: quotaRemaining <= 0 ? "not-allowed" : "pointer",
                    boxShadow: "0 10px 20px rgba(212, 163, 115, 0.3)"
                  }}
                >
                  <Heart size={32} fill="#0b130e" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
