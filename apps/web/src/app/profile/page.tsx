"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  Settings,
  Lock,
  Edit3,
  Camera,
  Sparkles,
  MapPin,
  EyeOff,
  Save,
  Gift,
  CheckCircle2,
  Award,
  Crown,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";

export default function ProfilePage() {
  const [completion, setCompletion] = useState(85);
  const [isSaved, setIsSaved] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Aminata",
    age: 27,
    city: "Douala",
    country: "Cameroun 🇨🇲",
    profession: "Chef de Projet Digital",
    bio: "Femme respectueuse, attachée aux valeurs traditionnelles chrétiennes et engagée dans un projet de mariage sincère et durable.",
    religion: "Chrétienne Pratiquante",
    education: "Master 2 Sup de Co",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const milestones = [
    { threshold: 50, label: "Profil Actif", reward: "Visibilité standard", unlocked: true },
    { threshold: 75, label: "Profil Recommandé", reward: "+5 Super-Likes offerts", unlocked: true },
    { threshold: 100, label: "Badge Âme Pure 🛡️", reward: "+300% de mise en avant algorithmique", unlocked: false },
  ];

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

      {/* Header */}
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
          <Link href="/matches" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Correspondances
          </Link>
          <Link href="/chat" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Messages
          </Link>
          <Link
            href="/settings"
            style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <Settings size={15} /> Paramètres
          </Link>
          <Link
            href="/profile"
            style={{
              color: "#f4c07c",
              fontWeight: "700",
              textDecoration: "none",
              borderBottom: "2px solid #f4c07c",
              paddingBottom: "0.25rem",
              fontSize: "0.92rem",
            }}
          >
            Mon Profil
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1, maxWidth: "800px", width: "100%", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        {/* Endowed Progress Gamified Card */}
        <div
          className="glass-panel glow-halo"
          style={{
            padding: "2rem",
            marginBottom: "2rem",
            border: "1.5px solid rgba(244, 192, 124, 0.4)",
            borderRadius: "28px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#fbfbfb", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={22} color="#f4c07c" /> Puissance de Votre Profil
            </div>
            <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "#f4c07c" }}>{completion}%</span>
          </div>

          {/* Dynamic Progress Bar */}
          <div style={{ height: "12px", backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: "999px", overflow: "hidden", marginBottom: "1.25rem" }}>
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #52b788 0%, #f4c07c 60%, #e07a5f 100%)",
                width: `${completion}%`,
                borderRadius: "999px",
                boxShadow: "0 0 15px rgba(244, 192, 124, 0.5)",
                transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>

          {/* Tiered Unlocked Rewards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            {milestones.map((m, idx) => (
              <div
                key={idx}
                style={{
                  padding: "0.85rem",
                  borderRadius: "14px",
                  backgroundColor: m.unlocked ? "rgba(82, 183, 136, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  border: m.unlocked ? "1px solid rgba(82, 183, 136, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  {m.unlocked ? (
                    <CheckCircle2 size={14} color="#52b788" />
                  ) : (
                    <Lock size={14} color="#8a968f" />
                  )}
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", color: m.unlocked ? "#52b788" : "#8a968f" }}>
                    {m.threshold}% : {m.label}
                  </span>
                </div>
                <div style={{ fontSize: "0.72rem", color: m.unlocked ? "#c7cfcb" : "#8a968f", lineHeight: 1.3 }}>
                  {m.reward}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Edit Form */}
        <div
          className="glass-panel"
          style={{
            padding: "2rem",
            borderRadius: "28px",
          }}
        >
          {/* Avatar Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "2rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid rgba(212, 163, 115, 0.15)",
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"
                alt="Avatar"
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #f4c07c",
                  boxShadow: "0 0 20px rgba(244, 192, 124, 0.35)",
                }}
              />
              <button
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  backgroundColor: "#f4c07c",
                  color: "#070d09",
                  border: "none",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                <Camera size={16} />
              </button>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontSize: "1.35rem", fontWeight: "900", color: "#fbfbfb", margin: 0 }}>
                  {formData.firstName}, {formData.age} ans
                </h2>
                <span className="badge-emerald">
                  <ShieldCheck size={13} /> KYC Vérifié
                </span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#d4a373", fontWeight: "700", marginTop: "2px" }}>
                {formData.city}, {formData.country}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#8a968f", marginTop: "4px" }}>
                Photo certifiée par l&apos;algorithme de détection faciale.
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "6px" }}>
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(212, 163, 115, 0.25)",
                    color: "#fbfbfb",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "6px" }}>
                  Profession
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(212, 163, 115, 0.25)",
                    color: "#fbfbfb",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "6px" }}>
                Présentation Sincère &amp; Projet de Vie
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(212, 163, 115, 0.25)",
                  color: "#fbfbfb",
                  fontSize: "0.9rem",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
              />
            </div>

            {/* Incognito Mode Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                borderRadius: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(212, 163, 115, 0.15)",
                marginTop: "0.5rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", fontSize: "0.92rem", color: "#fbfbfb" }}>
                  <EyeOff size={18} color="#f4c07c" /> Mode Discrétion / Incognito
                </div>
                <div style={{ fontSize: "0.78rem", color: "#8a968f", marginTop: "2px" }}>
                  Seules les personnes que vous aimez en premier pourront voir votre profil.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIncognitoMode(!incognitoMode)}
                style={{
                  width: "50px",
                  height: "28px",
                  borderRadius: "999px",
                  backgroundColor: incognitoMode ? "#52b788" : "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "#fbfbfb",
                    position: "absolute",
                    top: "3px",
                    left: incognitoMode ? "25px" : "3px",
                    transition: "all 0.25s ease",
                  }}
                />
              </button>
            </div>

            {/* Save Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "14px 32px" }}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 size={18} /> Profil Mis à Jour !
                  </>
                ) : (
                  <>
                    <Save size={18} /> Enregistrer Mon Profil
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}
