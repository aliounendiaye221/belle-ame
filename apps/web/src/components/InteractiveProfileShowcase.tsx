"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Eye,
  EyeOff,
  Volume2,
  Play,
  Pause,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
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
  avatarColor: string;
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
    voiceText: "« Bonjour, je cherche quelqu'un qui craint Dieu, qui aime entreprendre et avec qui bâtir un foyer solide fondé sur le respect mutuel. »",
    bioSnippet: "Femme de principes, croyante et posée. Je valorise la franchise, l'honnêteté et la complicité durable. Pas là pour perdre du temps.",
    avatarColor: "linear-gradient(135deg, #1b4332, #2d6a4f)",
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
    voiceText: "« Salut à toi. Pour moi la vie de couple c'est un travail d'équipe. Si tu partages les mêmes valeurs de droiture et de famille, faisons connaissance. »",
    bioSnippet: "Homme déterminé, respectueux de nos traditions et tourné vers l'avenir. Je recherche une femme mûre d'esprit pour une alliance sincère.",
    avatarColor: "linear-gradient(135deg, #2b2d42, #4a4e69)",
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
    voiceText: "« As-salamu alaykum. Je cherche mon alter ego pour cheminer ensemble avec sérénité, entourés de la bénédiction de nos parents. »",
    bioSnippet: "Douce et cultivée, j'accorde une place centrale à la spiritualité, à la famille et au raffinement. Fuyons le virtuel pour le concret.",
    avatarColor: "linear-gradient(135deg, #403d39, #664e4c)",
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
        borderRadius: "28px",
        padding: "2rem",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
        position: "relative",
      }}
    >
      {/* Top selector pills */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", flexWrap: "wrap", gap: "12px" }}>
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
          En ligne • Actif(ve) récemment
        </div>
      </div>

      {/* Main Showcase Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "center" }}>
        
        {/* Left: Profile Visual with Privacy Blur Feature (Inspired by Farata) */}
        <div>
          <div
            style={{
              position: "relative",
              aspectRatio: "3/4",
              borderRadius: "20px",
              background: profile.avatarColor,
              overflow: "hidden",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "1.5rem",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Top badges */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 5 }}>
              <span
                style={{
                  backgroundColor: "rgba(7, 13, 9, 0.75)",
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
                <ShieldCheck size={14} /> Pièce d'Identité Certifiée
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

            {/* Silhouette Illustration or Blurred Avatar */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "12px",
                filter: isPhotoRevealed ? "none" : "blur(18px)",
                transition: "filter 0.4s ease",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f4c07c, #e07a5f)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  color: "#070d09",
                  boxShadow: "0 0 40px rgba(244, 192, 124, 0.4)",
                }}
              >
                {profile.name[0]}
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fbfbfb", letterSpacing: "1px" }}>
                {profile.name}
              </span>
            </div>

            {/* Blur Overlay Shield Button */}
            <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setIsPhotoRevealed(!isPhotoRevealed)}
                style={{
                  backgroundColor: "rgba(7, 13, 9, 0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(212, 163, 115, 0.35)",
                  color: "#f4c07c",
                  padding: "8px 16px",
                  borderRadius: "999px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
                  transition: "all 0.2s",
                }}
              >
                {isPhotoRevealed ? (
                  <>
                    <EyeOff size={15} /> Activer le Mode Pudeur (Flouter)
                  </>
                ) : (
                  <>
                    <Eye size={15} /> Déflouter la photo (Mode Discrétion)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Detailed Verified Attributes & Voice Intro */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
            <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#fbfbfb", letterSpacing: "-0.5px" }}>
              {profile.name}
            </h3>
            <span style={{ fontSize: "1.2rem", color: "#f4c07c", fontWeight: 700 }}>
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

          {/* Voice note teaser (Farata Inspiration) */}
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

              {/* Animated audio wave bars */}
              <div style={{ display: "flex", alignItems: "center", gap: "3px", flex: 1, height: "24px" }}>
                {[30, 60, 90, 45, 75, 100, 40, 80, 50, 95, 65, 35, 70, 85, 40, 60, 90, 50, 75].map((height, i) => (
                  <div
                    key={i}
                    style={{
                      width: "3px",
                      height: isPlayingVoice ? `${Math.max(15, (height * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2)}%` : `${height * 0.4}%`,
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

          {/* Action Row */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleLike}
              style={{
                flex: 1,
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
    </div>
  );
}
