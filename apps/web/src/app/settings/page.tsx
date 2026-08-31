"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Bell,
  Lock,
  Shield,
  Eye,
  Smartphone,
  CheckCircle2,
  Save,
  Globe,
  Sliders,
  LogOut,
  ArrowLeft,
  Crown,
} from "lucide-react";
import { AFRICAN_COUNTRIES } from "@belle-ame/shared-types";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";

export default function SettingsPage() {
  const [isSaved, setIsSaved] = useState(false);

  // Préférences de Notifications
  const [allowPushMatch, setAllowPushMatch] = useState(true);
  const [allowPushMessage, setAllowPushMessage] = useState(true);
  const [allowEmailDigest, setAllowEmailDigest] = useState(false);
  const [allowSmsSecurity] = useState(true); // Verrouillé sécurité RGPD

  // Préférences de Découverte Matrimoniale
  const [preferredMinAge, setPreferredMinAge] = useState(24);
  const [preferredMaxAge, setPreferredMaxAge] = useState(35);
  const [targetCountry, setTargetCountry] = useState("ALL");
  const [religionFilter, setReligionFilter] = useState("ALL");
  const [strictMarriageOnly, setStrictMarriageOnly] = useState(true);

  // Confidentialité & Sécurité
  const [incognitoSearch, setIncognitoSearch] = useState(false);
  const [blurPhotoInitially, setBlurPhotoInitially] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
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

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            href="/profile"
            style={{
              color: "#d4a373",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <ArrowLeft size={16} /> Mon Profil
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: "780px", width: "100%", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "rgba(244, 192, 124, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f4c07c",
              }}
            >
              <Settings size={22} />
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#fbfbfb", margin: 0 }}>
              Paramètres du Compte & Critères
            </h1>
          </div>
          <p style={{ color: "#8a968f", fontSize: "0.92rem", margin: 0 }}>
            Personnalisez vos notifications, affinez vos critères d&apos;union et ajustez votre niveau de discrétion.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Section 1 : Critères Matrimoniaux de Recherche */}
          <div
            style={{
              backgroundColor: "rgba(16, 32, 23, 0.75)",
              borderRadius: "24px",
              border: "1px solid rgba(212, 163, 115, 0.2)",
              padding: "1.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
              <Sliders size={20} color="#f4c07c" />
              <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#fbfbfb", margin: 0 }}>
                Critères de Compatibilité & Découverte
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "#d4a373", fontWeight: "700", marginBottom: "6px" }}>
                  Tranche d&apos;Âge Souhaitée : {preferredMinAge} à {preferredMaxAge} ans
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={preferredMinAge}
                    onChange={(e) => setPreferredMinAge(Math.min(Number(e.target.value), preferredMaxAge - 1))}
                    style={{ flex: 1, accentColor: "#f4c07c" }}
                  />
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={preferredMaxAge}
                    onChange={(e) => setPreferredMaxAge(Math.max(Number(e.target.value), preferredMinAge + 1))}
                    style={{ flex: 1, accentColor: "#f4c07c" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "#d4a373", fontWeight: "700", marginBottom: "6px" }}>
                  Bassin Géographique Prioritaire
                </label>
                <select
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#070d09",
                    border: "1px solid rgba(212, 163, 115, 0.3)",
                    borderRadius: "14px",
                    padding: "0.65rem 1rem",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                >
                  <option value="ALL">🌍 Toute l&apos;Afrique & Diaspora (Panafricain)</option>
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Strict Marriage Toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.9rem 1.2rem",
                borderRadius: "16px",
                backgroundColor: "rgba(7, 13, 9, 0.6)",
                border: "1px solid rgba(212, 163, 115, 0.15)",
              }}
            >
              <div>
                <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "#fbfbfb" }}>
                  Engagement Matrimonial Exclusif 💍
                </div>
                <div style={{ fontSize: "0.78rem", color: "#8a968f" }}>
                  Ne suggérer que des célibataires orientés explicitement vers le mariage.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStrictMarriageOnly(!strictMarriageOnly)}
                style={{
                  width: "48px",
                  height: "26px",
                  borderRadius: "999px",
                  backgroundColor: strictMarriageOnly ? "#52b788" : "rgba(255,255,255,0.15)",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    position: "absolute",
                    top: "3px",
                    left: strictMarriageOnly ? "25px" : "3px",
                    transition: "all 0.2s ease",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Section 2 : Notifications Multi-Canaux */}
          <div
            style={{
              backgroundColor: "rgba(16, 32, 23, 0.75)",
              borderRadius: "24px",
              border: "1px solid rgba(212, 163, 115, 0.2)",
              padding: "1.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
              <Bell size={20} color="#f4c07c" />
              <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#fbfbfb", margin: 0 }}>
                Canaux d&apos;Alertes & Notifications
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {/* Push Match */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "#fbfbfb" }}>
                    Notifications Push pour Nouveaux Matchs
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#8a968f" }}>
                    Recevez une alerte discrète dès qu&apos;une affinité mutuelle est confirmée.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowPushMatch(!allowPushMatch)}
                  style={{
                    width: "48px",
                    height: "26px",
                    borderRadius: "999px",
                    backgroundColor: allowPushMatch ? "#52b788" : "rgba(255,255,255,0.15)",
                    border: "none",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      position: "absolute",
                      top: "3px",
                      left: allowPushMatch ? "25px" : "3px",
                      transition: "all 0.2s ease",
                    }}
                  />
                </button>
              </div>

              {/* Push Message */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "#fbfbfb" }}>
                    Notifications Push pour Nouveaux Messages
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#8a968f" }}>
                    Avertissement instantané lors d&apos;une réponse dans vos correspondances.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowPushMessage(!allowPushMessage)}
                  style={{
                    width: "48px",
                    height: "26px",
                    borderRadius: "999px",
                    backgroundColor: allowPushMessage ? "#52b788" : "rgba(255,255,255,0.15)",
                    border: "none",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      position: "absolute",
                      top: "3px",
                      left: allowPushMessage ? "25px" : "3px",
                      transition: "all 0.2s ease",
                    }}
                  />
                </button>
              </div>

              {/* SMS Sécurité Verrouillé */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.85 }}>
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "#fbfbfb", display: "flex", alignItems: "center", gap: "6px" }}>
                    SMS de Sécurité & Codes OTP <Lock size={13} color="#f4c07c" />
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#8a968f" }}>
                    Verrouillé actif pour garantir la protection de votre compte et du coffre-fort KYC.
                  </div>
                </div>
                <span style={{ fontSize: "0.78rem", color: "#52b788", fontWeight: "800" }}>ACTIF OBLIGATOIRE</span>
              </div>
            </div>
          </div>

          {/* Section 3 : Mode Pudeur & Discrétion */}
          <div
            style={{
              backgroundColor: "rgba(16, 32, 23, 0.75)",
              borderRadius: "24px",
              border: "1px solid rgba(212, 163, 115, 0.2)",
              padding: "1.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
              <Eye size={20} color="#f4c07c" />
              <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#fbfbfb", margin: 0 }}>
                Pudeur & Confidentialité Visuelle
              </h2>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "#fbfbfb" }}>
                  Floutage de Pudeur Initial de ma Photo
                </div>
                <div style={{ fontSize: "0.78rem", color: "#8a968f" }}>
                  Vos photos ne seront révélées qu&apos;aux profils avec lesquels vous validez un intérêt mutuel.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBlurPhotoInitially(!blurPhotoInitially)}
                style={{
                  width: "48px",
                  height: "26px",
                  borderRadius: "999px",
                  backgroundColor: blurPhotoInitially ? "#52b788" : "rgba(255,255,255,0.15)",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    position: "absolute",
                    top: "3px",
                    left: blurPhotoInitially ? "25px" : "3px",
                    transition: "all 0.2s ease",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Section 4 : Raccourcis de Sécurité et RGPD */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Link
              href="/settings/privacy"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "1.25rem",
                borderRadius: "20px",
                backgroundColor: "rgba(16, 32, 23, 0.75)",
                border: "1px solid rgba(82, 183, 136, 0.3)",
                color: "#fbfbfb",
                textDecoration: "none",
              }}
            >
              <Lock size={20} color="#52b788" />
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: "800" }}>Portail RGPD & Export</div>
                <div style={{ fontSize: "0.78rem", color: "#8a968f" }}>Télécharger mes données JSON</div>
              </div>
            </Link>

            <Link
              href="/verification"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "1.25rem",
                borderRadius: "20px",
                backgroundColor: "rgba(16, 32, 23, 0.75)",
                border: "1px solid rgba(244, 192, 124, 0.3)",
                color: "#fbfbfb",
                textDecoration: "none",
              }}
            >
              <Shield size={20} color="#f4c07c" />
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: "800" }}>Certification KYC 18+</div>
                <div style={{ fontSize: "0.78rem", color: "#8a968f" }}>Statut d&apos;honneur & pièces</div>
              </div>
            </Link>

            <a
              href="https://belle-ame-backoffice.vercel.app"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "1.25rem",
                borderRadius: "20px",
                backgroundColor: "rgba(20, 35, 26, 0.9)",
                border: "1px solid rgba(82, 183, 136, 0.4)",
                color: "#52b788",
                textDecoration: "none",
              }}
            >
              <Sliders size={20} color="#52b788" />
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: "800" }}>Portail Back-Office Super Admin 🛡️</div>
                <div style={{ fontSize: "0.78rem", color: "#8a968f" }}>Modération SLA, File KYC & Pilotage</div>
              </div>
            </a>
          </div>

          {/* Save Button Bar */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: "14px 36px",
                fontSize: "0.95rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={18} /> Préférences Enregistrées !
                </>
              ) : (
                <>
                  <Save size={18} /> Sauvegarder Mes Réglages
                </>
              )}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
