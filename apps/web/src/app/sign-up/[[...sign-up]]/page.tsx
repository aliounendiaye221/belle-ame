"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ShieldCheck, Search, UserPlus } from "lucide-react";
import { AFRICAN_COUNTRIES } from "@belle-ame/shared-types";
import { authService } from "@/lib/auth-service";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("SN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirmAge, setConfirmAge] = useState(false);
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

  const isFormValid = firstName.trim() && phoneNumber.trim() && password.length >= 6 && confirmAge && acceptTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setErrorMsg("");
    setIsSubmitting(true);

    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, "");
    const fullPhoneNumber = `${activeCountry.dialCode}${cleanNumber.startsWith("0") ? cleanNumber.slice(1) : cleanNumber}`;

    try {
      const result = await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        phone: fullPhoneNumber,
        countryCode: activeCountry.code,
        password,
      });

      if (result.success) {
        // Envoyer le code OTP pour vérification du numéro
        await authService.sendOtp(fullPhoneNumber, activeCountry.code);
        window.location.href = `/auth/otp?phone=${encodeURIComponent(fullPhoneNumber)}`;
        return;
      }
      setErrorMsg("Erreur lors de la création de votre compte.");
    } catch (err: any) {
      setErrorMsg(err.message || "Impossible de créer votre compte. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "#070d09",
    border: "1.5px solid rgba(212, 163, 115, 0.35)",
    color: "#ffffff",
    padding: "0.85rem 1rem",
    borderRadius: "16px",
    fontSize: "0.95rem",
    outline: "none",
    fontWeight: "600" as const,
    boxSizing: "border-box" as const,
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
      {/* Background halo */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "350px",
          background: "radial-gradient(circle, rgba(82, 183, 136, 0.12) 0%, rgba(244, 192, 124, 0.08) 60%, transparent 80%)",
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
              Inscription Sécurisée
            </div>
          </div>
        </Link>
        <Link
          href="/"
          style={{ color: "#d4a373", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}
        >
          ← Retour
        </Link>
      </header>

      {/* Main */}
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
            maxWidth: "520px",
            width: "100%",
            padding: "clamp(1.75rem, 5vw, 2.75rem)",
            borderRadius: "32px",
            border: "1.5px solid rgba(212, 163, 115, 0.3)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 35px rgba(82, 183, 136, 0.12)",
          }}
        >
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "999px",
                backgroundColor: "rgba(82, 183, 136, 0.12)",
                border: "1px solid rgba(82, 183, 136, 0.3)",
                color: "#52b788",
                fontSize: "0.85rem",
                fontWeight: "700",
                marginBottom: "1rem",
              }}
            >
              <UserPlus size={16} /> Rejoindre l&apos;Alliance Sacrée
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.5rem" }}>
              Créer Votre Profil
            </h1>
            <p style={{ color: "#c7cfcb", fontSize: "0.92rem", lineHeight: "1.5", margin: 0 }}>
              Inscription certifiée réservée aux majeurs d&apos;Afrique & Diaspora
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Name fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
                  Prénom *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aminata"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
                  Nom (Facultatif)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Diallo"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
                <span>Pays d&apos;origine *</span>
                <span style={{ fontSize: "0.75rem", color: "#52b788" }}>{activeCountry.flag} {activeCountry.name}</span>
              </label>
              <div
                style={{
                  backgroundColor: "#070d09",
                  border: "1px solid rgba(212, 163, 115, 0.35)",
                  borderRadius: "14px",
                  padding: "0.5rem 0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.5rem",
                }}
              >
                <Search size={14} color="#8a968f" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "0.82rem",
                    outline: "none",
                    width: "100%",
                  }}
                />
              </div>
              <select
                value={selectedCountryCode}
                onChange={(e) => { setSelectedCountryCode(e.target.value); setSearchCountry(""); }}
                style={{ ...inputStyle, fontSize: "0.9rem" }}
              >
                {filteredCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
                Numéro de téléphone mobile *
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div
                  style={{
                    backgroundColor: "rgba(244, 192, 124, 0.12)",
                    border: "1px solid rgba(212, 163, 115, 0.3)",
                    color: "#f4c07c",
                    padding: "0.8rem 0.9rem",
                    borderRadius: "16px",
                    fontWeight: "800",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    flexShrink: 0,
                  }}
                >
                  {activeCountry.flag} {activeCountry.dialCode}
                </div>
                <input
                  type="tel"
                  placeholder="77 123 45 67"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
                Mot de passe *
              </label>
              <input
                type="password"
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={inputStyle}
              />
              {password.length > 0 && password.length < 6 && (
                <div style={{ fontSize: "0.75rem", color: "#e63946", marginTop: "0.3rem" }}>
                  Le mot de passe doit contenir au moins 6 caractères.
                </div>
              )}
            </div>

            {/* Age Confirmation */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", cursor: "pointer", fontSize: "0.82rem", color: "#c7cfcb", lineHeight: "1.4" }}>
              <input
                type="checkbox"
                checked={confirmAge}
                onChange={(e) => setConfirmAge(e.target.checked)}
                style={{ marginTop: "0.2rem", accentColor: "#52b788", width: "17px", height: "17px", flexShrink: 0 }}
              />
              <span>
                Je certifie sur l&apos;honneur avoir <strong style={{ color: "#52b788" }}>18 ans ou plus</strong>. Cette plateforme est strictement réservée aux adultes majeurs.
              </span>
            </label>

            {/* Terms */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", cursor: "pointer", fontSize: "0.82rem", color: "#c7cfcb", lineHeight: "1.4" }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{ marginTop: "0.2rem", accentColor: "#e63946", width: "17px", height: "17px", flexShrink: 0 }}
              />
              <span>
                J&apos;accepte les <Link href="/terms" style={{ color: "#f4c07c", textDecoration: "underline" }}>Conditions Générales</Link> et la <Link href="/settings/privacy" style={{ color: "#f4c07c", textDecoration: "underline" }}>Politique de Confidentialité RGPD</Link>.
              </span>
            </label>

            {errorMsg && (
              <div style={{ color: "#e63946", fontSize: "0.85rem", textAlign: "center", fontWeight: "700" }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "999px",
                fontSize: "1rem",
                cursor: (!isFormValid || isSubmitting) ? "not-allowed" : "pointer",
                opacity: (!isFormValid || isSubmitting) ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {isSubmitting ? "Création en cours..." : "Créer mon Compte Vérifié"} <ArrowRight size={18} />
            </button>
          </form>

          {/* Link to Sign In */}
          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.88rem", color: "#c7cfcb" }}>
            Déjà inscrit ?{" "}
            <Link href="/auth/login" style={{ color: "#f4c07c", fontWeight: "700", textDecoration: "none" }}>
              Se connecter
            </Link>
          </div>

          {/* Security Badge */}
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              backgroundColor: "rgba(18, 34, 25, 0.6)",
              borderRadius: "14px",
              border: "1px solid rgba(82, 183, 136, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.8rem",
              color: "#a0aba4",
            }}
          >
            <ShieldCheck size={18} color="#52b788" style={{ flexShrink: 0 }} />
            <span>
              Inscription chiffrée de bout en bout. Vos données personnelles sont protégées conformément au RGPD.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
