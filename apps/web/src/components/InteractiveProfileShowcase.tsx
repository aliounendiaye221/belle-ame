"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Heart,
  Eye,
  EyeOff,
  Volume2,
  Play,
  Pause,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react";

interface ProfileItem {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  occupation: string;
  education: string;
  intent: string;
  values: string[];
  compatibilityScore: number;
  voiceDuration: string;
  voiceText: string;
  bioSnippet: string;
  avatarUrl: string;
}

const SAMPLE_PROFILES: ProfileItem[] = [
  {
    id: "p1",
    name: "Aminata B.",
    age: 28,
    city: "Douala",
    country: "🇨🇲 Cameroun",
    occupation: "Ingénieure Télécoms & Entrepreneure",
    education: "Master Polytech",
    intent: "Mariage dans les 12 mois",
    values: ["Foi & Spiritualité", "Respect des Familles", "Ambition Saine", "Bienveillance"],
    compatibilityScore: 97,
    voiceDuration: "0:18",
    voiceText: "« Bonjour, je cherche un homme qui craint Dieu, qui aime bâtir et avec qui fonder un foyer d'honneur fondé sur le respect mutuel. »",
    bioSnippet: "Femme de principes, posée et sincère. Je valorise la franchise, l'honnêteté et la complicité durable. Pas là pour perdre du temps.",
    avatarUrl: "/images/avatar-woman.jpg",
  },
  {
    id: "p2",
    name: "Jean-Marc K.",
    age: 32,
    city: "Abidjan",
    country: "🇨🇮 Côte d'Ivoire",
    occupation: "Directeur Financier & Investisseur",
    education: "ESCP & HEC Executive",
    intent: "Foyer d'Honneur & Alliance de Vie",
    values: ["Honneur & Droiture", "Culture Africaine", "Éducation", "Projets d'Avenir"],
    compatibilityScore: 94,
    voiceDuration: "0:14",
    voiceText: "« Pour moi, la vie de couple est une alliance sacrée. Si vous partagez la même recherche de loyauté et de paix, faisons connaissance. »",
    bioSnippet: "Homme déterminé, respectueux de nos traditions et tourné vers l'avenir. Je recherche une femme mûre d'esprit pour une alliance sincère.",
    avatarUrl: "/images/avatar-man.jpg",
  },
  {
    id: "p3",
    name: "Aïssatou D.",
    age: 26,
    city: "Dakar / Paris",
    country: "🇸🇳 Sénégal / Diaspora",
    occupation: "Architecte d'Intérieur",
    education: "Master Design & Architecture",
    intent: "Union Traditionnelle & Mariage",
    values: ["Pudeur & Respect", "Harmonie du Foyer", "Art & Culture", "Générosité"],
    compatibilityScore: 98,
    voiceDuration: "0:21",
    voiceText: "« Je cherche mon alter ego pour cheminer ensemble avec dignité et sérénité, entourés de la bénédiction de nos parents. »",
    bioSnippet: "Douce et cultivée, j'accorde une place centrale à la spiritualité, à la famille et au raffinement. Fuyons le virtuel pour le concret.",
    avatarUrl: "/images/avatar-woman.jpg",
  },
];

export default function InteractiveProfileShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPhotoRevealed, setIsPhotoRevealed] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<Record<string, boolean>>({});

  const profile = (SAMPLE_PROFILES[activeIdx] || SAMPLE_PROFILES[0]) as ProfileItem;
  const isLiked = likedProfiles[profile.id] || false;

  const handleLike = () => {
    setLikedProfiles((prev) => ({ ...prev, [profile.id]: !isLiked }));
  };

  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(16, 32, 23, 0.9), rgba(7, 13, 9, 0.95))",
        border: "1px solid rgba(212, 163, 115, 0.25)",
        borderRadius: "24px",
        padding: "clamp(1.25rem, 3vw, 2rem)",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
        position: "relative",
      }}
    >
      {/* Top selector pills */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {SAMPLE_PROFILES.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setActiveIdx(idx);
                setIsPhotoRevealed(false);
                setIsPlayingVoice(false);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: idx === activeIdx ? "1px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.2)",
                backgroundColor: idx === activeIdx ? "rgba(212, 163, 115, 0.2)" : "rgba(7, 13, 9, 0.6)",
                color: idx === activeIdx ? "#f4c07c" : "#94a39b",
                fontWeight: idx === activeIdx ? 800 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {p.name.split(" ")[0]} ({p.age} ans)
            </button>
          ))}
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#52b788", fontSize: "0.82rem", fontWeight: 700 }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#52b788", display: "inline-block", boxShadow: "0 0 8px #52b788" }} />
          Profil Actif • En Ligne
        </div>
      </div>

      {/* Main Showcase Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "center" }}>
        
        {/* Left: Profile Visual with Privacy Blur Feature */}
        <div>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "360px",
              margin: "0 auto",
              aspectRatio: "1/1",
              borderRadius: "24px",
              overflow: "hidden",
              border: "2px solid rgba(212, 163, 115, 0.35)",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "1rem",
            }}
          >
            {/* Top Badges */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 5 }}>
              <span
                style={{
                  backgroundColor: "rgba(7, 13, 9, 0.85)",
                  backdropFilter: "blur(8px)",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  color: "#52b788",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  border: "1px solid rgba(82, 183, 136, 0.4)",
                }}
              >
                <ShieldCheck size={14} /> Pièce Certifiée
              </span>

              <span
                style={{
                  backgroundColor: "rgba(212, 163, 115, 0.25)",
                  backdropFilter: "blur(8px)",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  color: "#f4c07c",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  border: "1px solid rgba(212, 163, 115, 0.5)",
                }}
              >
                ★ {profile.compatibilityScore}% Jaccard
              </span>
            </div>

            {/* Avatar Image with Modesty Blur Toggle */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                filter: isPhotoRevealed ? "none" : "blur(16px)",
                transform: isPhotoRevealed ? "scale(1)" : "scale(1.08)",
                transition: "filter 0.4s ease, transform 0.4s ease",
              }}
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Vignette Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(7, 13, 9, 0.9) 15%, transparent 60%)",
                pointerEvents: "none",
              }}
            />

            {/* Blur Overlay Shield Button */}
            <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setIsPhotoRevealed(!isPhotoRevealed)}
                style={{
                  backgroundColor: "rgba(7, 13, 9, 0.88)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(212, 163, 115, 0.4)",
                  color: "#f4c07c",
                  padding: "8px 16px",
                  borderRadius: "999px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
                  transition: "all 0.2s",
                }}
              >
                {isPhotoRevealed ? (
                  <>
                    <EyeOff size={15} /> Activer le Mode Discrétion (Flouter)
                  </>
                ) : (
                  <>
                    <Eye size={15} /> Déflouter l&apos;avatar (Mode Pudeur)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Detailed Verified Attributes & Voice Intro */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fbfbfb", letterSpacing: "-0.5px" }}>
              {profile.name}
            </h3>
            <span style={{ fontSize: "1.15rem", color: "#f4c07c", fontWeight: 700 }}>
              {profile.age} ans
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#c7cfcb", fontSize: "0.9rem", marginBottom: "1rem" }}>
            <MapPin size={15} color="#52b788" />
            <span>{profile.city}, {profile.country}</span>
          </div>

          {/* Key tags */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <span style={{ backgroundColor: "rgba(212, 163, 115, 0.12)", border: "1px solid rgba(212, 163, 115, 0.25)", color: "#f4c07c", padding: "4px 10px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Briefcase size={12} /> {profile.occupation}
            </span>
            <span style={{ backgroundColor: "rgba(82, 183, 136, 0.12)", border: "1px solid rgba(82, 183, 136, 0.25)", color: "#52b788", padding: "4px 10px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <GraduationCap size={12} /> {profile.education}
            </span>
            <span style={{ backgroundColor: "rgba(224, 122, 95, 0.12)", border: "1px solid rgba(224, 122, 95, 0.25)", color: "#e07a5f", padding: "4px 10px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700 }}>
              💍 {profile.intent}
            </span>
          </div>

          {/* Voice note teaser */}
          <div
            style={{
              backgroundColor: "rgba(7, 13, 9, 0.75)",
              border: "1px solid rgba(212, 163, 115, 0.25)",
              borderRadius: "14px",
              padding: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "1px", color: "#f4c07c", fontWeight: 800, display: "flex", alignItems: "center", gap: "5px" }}>
                <Volume2 size={14} /> Présentation Vocale Vérifiée
              </span>
              <span style={{ fontSize: "0.78rem", color: "#94a39b", fontWeight: 600 }}>
                {profile.voiceDuration}s
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#f4c07c",
                  color: "#070d09",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 2px 10px rgba(244, 192, 124, 0.4)",
                }}
              >
                {isPlayingVoice ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: "2px" }} />}
              </button>

              {/* Oscillating audio wave bars */}
              <div style={{ display: "flex", alignItems: "center", gap: "3px", flex: 1, height: "24px" }}>
                {[30, 60, 90, 45, 75, 100, 40, 80, 50, 95, 65, 35, 70, 85, 40, 60, 90, 50, 75].map((height, i) => (
                  <div
                    key={i}
                    style={{
                      width: "3px",
                      height: isPlayingVoice ? `${Math.max(20, (height * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2)}%` : `${height * 0.4}%`,
                      backgroundColor: isPlayingVoice ? "#f4c07c" : "rgba(212, 163, 115, 0.3)",
                      borderRadius: "999px",
                      transition: "all 0.15s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            <p style={{ fontStyle: "italic", fontSize: "0.82rem", color: "#c7cfcb", marginTop: "8px", lineHeight: "1.4" }}>
              {profile.voiceText}
            </p>
          </div>

          {/* Values chips */}
          <div style={{ marginBottom: "1.25rem" }}>
            <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#94a39b", fontWeight: 700, marginBottom: "6px" }}>
              Valeurs Sacrées Non Négociables
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {profile.values.map((v, i) => (
                <span key={i} style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fbfbfb", padding: "3px 9px", borderRadius: "6px", fontSize: "0.78rem" }}>
                  ✓ {v}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleLike}
            style={{
              width: "100%",
              background: isLiked ? "linear-gradient(135deg, #e07a5f, #d4a373)" : "linear-gradient(135deg, #f4c07c, #d4a373)",
              color: "#070d09",
              border: "none",
              fontWeight: 800,
              fontSize: "0.95rem",
              padding: "12px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 6px 20px rgba(212, 163, 115, 0.35)",
              transition: "all 0.2s ease",
            }}
          >
            <Heart size={18} fill={isLiked ? "#070d09" : "none"} />
            {isLiked ? "Coup de Cœur d'Honneur Transmis !" : "Exprimer un Coup de Cœur Respectueux"}
          </button>
        </div>
      </div>
    </div>
  );
}
