"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Trash2,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";
import MobileBottomNav from "@/components/MobileBottomNav";
import { UserButton } from "@clerk/nextjs";
import { realPlatformStore, RealUserProfile } from "@/lib/real-platform-store";
import { storageService } from "@/lib/storage-service";

export default function ProfilePage() {
  const [completion, setCompletion] = useState(85);
  const [isSaved, setIsSaved] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState<RealUserProfile | null>(null);

  const [formData, setFormData] = useState({
    firstName: "Aliou",
    age: 29,
    city: "Dakar",
    country: "Sénégal 🇸🇳",
    profession: "Ingénieur Télécoms & Entrepreneur",
    bio: "Homme croyant, respectueux des traditions et déterminé à bâtir une famille bénie et harmonieuse.",
    religion: "Musulman Pratiquant",
    education: "Master École Supérieure Polytechnique",
    avatarUrl: "",
    photos: [] as string[],
  });

  useEffect(() => {
    const prof = realPlatformStore.getProfile();
    setProfile(prof);
    setFormData({
      firstName: prof.firstName || "Aliou",
      age: prof.age || 29,
      city: prof.city || "Dakar",
      country: prof.countryCode === "SN" ? "Sénégal 🇸🇳" : prof.countryCode === "CI" ? "Côte d'Ivoire 🇨🇮" : "Sénégal 🇸🇳",
      profession: prof.profession || "Ingénieur",
      bio: prof.bio || "",
      religion: prof.religion || "Croyant",
      education: prof.education || "Enseignement Supérieur",
      avatarUrl: prof.avatarUrl || prof.photos?.[0] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
      photos: prof.photos && prof.photos.length > 0 ? prof.photos : [prof.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"],
    });

    // Calcul dynamique de complétion
    let score = 50;
    if (prof.bio && prof.bio.length > 30) score += 15;
    if (prof.photos && prof.photos.length >= 2) score += 15;
    if (prof.isIdentityVerified || prof.kycStatus === "VERIFIED") score += 20;
    setCompletion(Math.min(100, score));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = realPlatformStore.saveProfile({
      firstName: formData.firstName,
      age: formData.age,
      city: formData.city,
      profession: formData.profession,
      bio: formData.bio,
      religion: formData.religion,
      education: formData.education,
      photos: formData.photos,
      avatarUrl: formData.avatarUrl,
    });
    setProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    try {
      const file = files[0]!;
      const result = await storageService.uploadProfilePhoto(file, profile?.id || "user_current");
      const updatedPhotos = [result.url, ...formData.photos.filter((p) => p !== result.url)].slice(0, 6);

      setFormData((prev) => ({
        ...prev,
        avatarUrl: result.url,
        photos: updatedPhotos,
      }));

      realPlatformStore.saveProfile({
        avatarUrl: result.url,
        photos: updatedPhotos,
      });
    } catch {
      // Ignorer
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const milestones = [
    { threshold: 50, label: "Profil Actif", reward: "Visibilité standard", unlocked: true },
    { threshold: 75, label: "Profil Recommandé", reward: "+5 Super-Likes offerts", unlocked: completion >= 75 },
    { threshold: 100, label: "Badge Âme Pure 🛡️", reward: "+300% de mise en avant algorithmique", unlocked: completion === 100 },
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

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <nav className="desktop-only-nav" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link href="/discover" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
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
            <Link href="/settings/privacy" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
              Confidentialité &amp; RGPD
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

          <UserButton afterSignOutUrl="/" />
        </div>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
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
          {/* Avatar & KYC Status Section */}
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
                src={formData.avatarUrl}
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
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Changer la photo de profil"
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.35rem", fontWeight: "900", color: "#fbfbfb", margin: 0 }}>
                  {formData.firstName}, {formData.age} ans
                </h2>

                {profile?.kycStatus === "VERIFIED" ? (
                  <span className="badge-emerald" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={13} /> KYC Vérifié 🛡️
                  </span>
                ) : profile?.kycStatus === "PENDING" ? (
                  <span style={{ backgroundColor: "rgba(244, 192, 124, 0.15)", border: "1px solid #f4c07c", color: "#f4c07c", padding: "2px 8px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={12} /> KYC en cours d&apos;examen
                  </span>
                ) : (
                  <Link href="/onboarding" style={{ color: "#ff858d", fontSize: "0.75rem", fontWeight: "700", textDecoration: "underline" }}>
                    Vérifier mon identité
                  </Link>
                )}

                <span style={{ backgroundColor: "rgba(244, 192, 124, 0.12)", border: "1px solid rgba(244, 192, 124, 0.3)", color: "#f4c07c", padding: "2px 8px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "700" }}>
                  Formule {profile?.subscribedPlan || "SERENITE"}
                </span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#d4a373", fontWeight: "700", marginTop: "4px" }}>
                {formData.city}, {formData.country}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#8a968f", marginTop: "4px" }}>
                {isUploadingPhoto ? "Traitement WebP sécurisé en cours..." : "Photos protégées sans métadonnées EXIF."}
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
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "6px" }}>
                  Âge
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 18 })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(212, 163, 115, 0.25)",
                    color: "#fbfbfb",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "6px" }}>
                  Ville
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(212, 163, 115, 0.25)",
                    color: "#fbfbfb",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
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
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "6px" }}>
                Spiritualité / Foi
              </label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(212, 163, 115, 0.25)",
                  color: "#fbfbfb",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "6px" }}>
                Présentation Sincère (Bio)
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
                  boxSizing: "border-box",
                  lineHeight: "1.5",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "0.5rem",
              }}
            >
              <Save size={18} />
              {isSaved ? "Modifications Enregistrées avec Succès !" : "Mettre à jour mon profil"}
            </button>
          </form>
        </div>
      </main>

      {/* Floating Glass Bottom Navigation for Mobile */}
      <MobileBottomNav activeTab="profile" />
    </div>
  );
}
