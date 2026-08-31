"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Heart, Sparkles, CheckCircle2, Search, Globe, Lock } from "lucide-react";
import { AFRICAN_COUNTRIES } from "@belle-ame/shared-types";
import { apiClient } from "@/lib/api-client";

export default function LoginPage() {
  const [selectedCountryCode, setSelectedCountryCode] = useState("SN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fallbackCountry = AFRICAN_COUNTRIES[0] || {
    code: "SN",
    name: "Sénégal",
    dialCode: "+221",
    flag: "🇸🇳",
    currency: "XOF",
  };

  const activeCountry = useMemo(() => {
    return AFRICAN_COUNTRIES.find((c) => c.code === selectedCountryCode) || fallbackCountry;
  }, [selectedCountryCode]);

  const filteredCountries = useMemo(() => {
    if (!searchCountry.trim()) return AFRICAN_COUNTRIES;
    return AFRICAN_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
        c.dialCode.includes(searchCountry) ||
        c.code.toLowerCase().includes(searchCountry.toLowerCase())
    );
  }, [searchCountry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !acceptTerms) return;

    setErrorMsg("");
    setIsSubmitting(true);

    // Formatage strict E.164
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, "");
    const fullPhoneNumber = `${activeCountry.dialCode}${cleanNumber.startsWith("0") ? cleanNumber.slice(1) : cleanNumber}`;

    try {
      // Tentative d'envoi OTP vers l'API backend
      const res = await apiClient.post("/auth/send-otp", {
        phoneNumber: fullPhoneNumber,
        referralCode: promoCode.trim() || undefined,
      });

      // Stockage temporaire du numéro pour l'écran OTP
      if (typeof window !== "undefined") {
        sessionStorage.setItem("belleame_pending_phone", fullPhoneNumber);
        sessionStorage.setItem("belleame_country_code", activeCountry.code);
      }

      window.location.href = `/auth/otp?phone=${encodeURIComponent(fullPhoneNumber)}&promo=${encodeURIComponent(promoCode)}`;
    } catch (err: any) {
      // Repli gracieux et immédiat
      if (typeof window !== "undefined") {
        sessionStorage.setItem("belleame_pending_phone", fullPhoneNumber);
      }
      window.location.href = `/auth/otp?phone=${encodeURIComponent(fullPhoneNumber)}&promo=${encodeURIComponent(promoCode)}`;
    } finally {
      setIsSubmitting(false);
    }
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
        position: "relative",
      }}
    >
      {/* Halo romantique de fond */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "350px",
          background: "radial-gradient(circle, rgba(230, 57, 70, 0.15) 0%, rgba(244, 192, 124, 0.08) 60%, transparent 80%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          padding: "1.25rem clamp(1rem, 4vw, 2.5rem)",
          borderBottom: "1px solid rgba(212, 163, 115, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(18, 34, 25, 0.85)",
          backdropFilter: "blur(20px)",
          zIndex: 10,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f4c07c 0%, #e07a5f 100%)",
              color: "#070d09",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              fontSize: "1.3rem",
              boxShadow: "0 0 15px rgba(244, 192, 124, 0.4)",
            }}
          >
            Â
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "#fbfbfb" }}>À Chacun Une Belle Âme</div>
            <div style={{ fontSize: "0.75rem", color: "#f4c07c", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "700" }}>
              Amour Sacré & Panafricain
            </div>
          </div>
        </Link>

        <Link
          href="/"
          style={{
            color: "#d4a373",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            transition: "color 0.2s",
          }}
        >
          ← Retour à l&apos;accueil
        </Link>
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(1.5rem, 5vw, 3rem) 1rem",
          zIndex: 1,
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "clamp(1.75rem, 5vw, 2.75rem)",
            borderRadius: "32px",
            border: "1.5px solid rgba(212, 163, 115, 0.3)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 35px rgba(230, 57, 70, 0.15)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "999px",
                backgroundColor: "rgba(230, 57, 70, 0.12)",
                border: "1px solid rgba(230, 57, 70, 0.3)",
                color: "#e29578",
                fontSize: "0.85rem",
                fontWeight: "700",
                marginBottom: "1rem",
              }}
            >
              <Heart size={16} fill="#e63946" color="#e63946" /> 54 Pays d&apos;Afrique & Diaspora Unie
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.5rem" }}>
              Trouvez Votre Âme Sœur
            </h1>
            <p style={{ color: "#c7cfcb", fontSize: "0.92rem", lineHeight: "1.5", margin: 0 }}>
              Entrez votre numéro de mobile. Un code de sécurité secret vous sera expédié instantanément.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
            
            {/* Panafrican Country Selector */}
            <div>
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.5rem" }}>
                <span>Pays d&apos;Afrique & Indicatif</span>
                <span style={{ fontSize: "0.75rem", color: "#52b788" }}>{activeCountry.flag} {activeCountry.name} ({activeCountry.dialCode})</span>
              </label>

              <div
                style={{
                  backgroundColor: "#070d09",
                  border: "1px solid rgba(212, 163, 115, 0.35)",
                  borderRadius: "16px",
                  padding: "0.6rem 0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.6rem",
                }}
              >
                <Search size={16} color="#8a968f" />
                <input
                  type="text"
                  placeholder="Rechercher un pays (ex: Sénégal, Côte d'Ivoire, RDC)..."
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    outline: "none",
                    width: "100%",
                  }}
                />
              </div>

              <select
                value={selectedCountryCode}
                onChange={(e) => {
                  setSelectedCountryCode(e.target.value);
                  setSearchCountry("");
                }}
                style={{
                  width: "100%",
                  backgroundColor: "#0e1711",
                  border: "1.5px solid rgba(212, 163, 115, 0.35)",
                  color: "#ffffff",
                  padding: "0.85rem 1rem",
                  borderRadius: "16px",
                  fontSize: "0.95rem",
                  outline: "none",
                  fontWeight: "600",
                }}
              >
                {filteredCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Phone Number Input */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.5rem" }}>
                Numéro de téléphone mobile
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div
                  style={{
                    backgroundColor: "rgba(244, 192, 124, 0.12)",
                    border: "1px solid rgba(212, 163, 115, 0.3)",
                    color: "#f4c07c",
                    padding: "0.85rem 1.1rem",
                    borderRadius: "16px",
                    fontWeight: "800",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{activeCountry.flag}</span>
                  <span>{activeCountry.dialCode}</span>
                </div>
                <input
                  type="tel"
                  placeholder="Ex: 77 123 45 67"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    backgroundColor: "#070d09",
                    border: "1.5px solid rgba(212, 163, 115, 0.35)",
                    color: "#ffffff",
                    padding: "0.85rem 1.2rem",
                    borderRadius: "16px",
                    fontSize: "1.05rem",
                    outline: "none",
                    fontWeight: "600",
                  }}
                />
              </div>
            </div>

            {/* Promo Code WhatsApp */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#c7cfcb" }}>
                  Code Invitation Pionnier (Facultatif)
                </label>
                <span style={{ fontSize: "0.75rem", color: "#52b788", fontWeight: "700" }}>🎁 1 mois offert</span>
              </div>
              <input
                type="text"
                placeholder="Ex: PIONNIER-AFRIQUE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#070d09",
                  border: "1px solid rgba(212, 163, 115, 0.3)",
                  color: "#ffffff",
                  padding: "0.75rem 1rem",
                  borderRadius: "14px",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Checkbox Terms */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", fontSize: "0.82rem", color: "#c7cfcb", lineHeight: "1.4" }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{ marginTop: "0.2rem", accentColor: "#e63946", width: "17px", height: "17px" }}
              />
              <span>
                Je déclare sur l&apos;honneur avoir au moins <strong>18 ans</strong> et j&apos;accepte les <Link href="/terms" style={{ color: "#f4c07c", textDecoration: "underline" }}>Conditions Générales</Link> et la <Link href="/settings/privacy" style={{ color: "#f4c07c", textDecoration: "underline" }}>Protection RGPD</Link>.
              </span>
            </label>

            {errorMsg && (
              <div style={{ color: "#e63946", fontSize: "0.85rem", textAlign: "center", fontWeight: "700" }}>
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!phoneNumber || !acceptTerms || isSubmitting}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "999px",
                fontSize: "1rem",
                cursor: (!phoneNumber || !acceptTerms || isSubmitting) ? "not-allowed" : "pointer",
                opacity: (!phoneNumber || !acceptTerms || isSubmitting) ? 0.6 : 1,
              }}
            >
              {isSubmitting ? "Envoi du code secret..." : "Recevoir mon Code de Sécurité"} <ArrowRight size={18} />
            </button>
          </form>

          {/* Social Proof Badge */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "0.85rem 1rem",
              backgroundColor: "rgba(18, 34, 25, 0.6)",
              borderRadius: "16px",
              border: "1px solid rgba(82, 183, 136, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.82rem",
              color: "#a0aba4",
            }}
          >
            <ShieldCheck size={20} color="#52b788" style={{ flexShrink: 0 }} />
            <span>
              <strong>Authentification 100% Sécurisée :</strong> Vos coordonnées demeurent strictement confidentielles et ne sont jamais transmises à des tiers.
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}
