"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Phone, ArrowRight, Heart, Sparkles, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [countryCode, setCountryCode] = useState("+237");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !acceptTerms) return;
    setIsSubmitting(true);
    setTimeout(() => {
      window.location.href = `/auth/otp?phone=${encodeURIComponent(countryCode + phoneNumber)}&promo=${encodeURIComponent(promoCode)}`;
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem" }}>
            Â
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>À Chacun Une Belle Âme</div>
            <div style={{ fontSize: "0.75rem", color: "#d4a373", textTransform: "uppercase", letterSpacing: "1px" }}>SaaS Matrimonial</div>
          </div>
        </Link>
        <Link href="/" style={{ color: "#d4a373", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500" }}>
          ← Retour à l'accueil
        </Link>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "460px", width: "100%", backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", padding: "2.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ inlineSize: "fit-content", margin: "0 auto 1rem", backgroundColor: "rgba(82, 183, 136, 0.15)", border: "1px solid rgba(82, 183, 136, 0.3)", padding: "0.4rem 1rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.5rem", color: "#52b788", fontSize: "0.85rem", fontWeight: "600" }}>
              <ShieldCheck size={16} /> 100% Majeurs & Profils Vérifiés
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "0.5rem" }}>Connexion & Inscription</h1>
            <p style={{ color: "#a0aba4", fontSize: "0.9rem", lineHeight: "1.5" }}>
              Entrez votre numéro E.164 (Cameroun, Bénin, Côte d'Ivoire ou Diaspora) pour recevoir votre code OTP de sécurité.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* Phone Input with Country Code */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#d4a373", marginBottom: "0.5rem" }}>
                Numéro de téléphone portable
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{ backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#ffffff", padding: "0.8rem", borderRadius: "12px", fontSize: "0.95rem", outline: "none" }}
                >
                  <option value="+237">🇨🇲 Cameroun (+237)</option>
                  <option value="+229">🇧🇯 Bénin (+229)</option>
                  <option value="+225">🇨🇮 Côte d'Ivoire (+225)</option>
                  <option value="+33">🇫🇷 France / Diaspora (+33)</option>
                  <option value="+1">🇺🇸 USA / Canada (+1)</option>
                </select>
                <input
                  type="tel"
                  placeholder="Ex: 699 00 00 00"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={{ flex: 1, backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#ffffff", padding: "0.8rem 1rem", borderRadius: "12px", fontSize: "1rem", outline: "none" }}
                />
              </div>
            </div>

            {/* Promo Code WhatsApp */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#a0aba4" }}>
                  Code Pionnier WhatsApp (Facultatif)
                </label>
                <span style={{ fontSize: "0.75rem", color: "#52b788", fontWeight: "600" }}>🎁 1 mois offert</span>
              </div>
              <input
                type="text"
                placeholder="Ex: WA-COMMUNITY-9000"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#ffffff", padding: "0.8rem 1rem", borderRadius: "12px", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: "0.75rem", color: "#7a8780", marginTop: "0.35rem" }}>
                Réservé aux plus de 9 000 membres fondateurs du groupe WhatsApp d'origine.
              </p>
            </div>

            {/* Checkbox Terms */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", fontSize: "0.85rem", color: "#c2c9c4", lineHeight: "1.4" }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{ marginTop: "0.2rem", accentColor: "#d4a373", width: "16px", height: "16px" }}
              />
              <span>
                Je certifie avoir au moins **18 ans** et j'accepte les <Link href="#" style={{ color: "#d4a373" }}>Conditions Générales</Link> et la <Link href="#" style={{ color: "#d4a373" }}>Politique de Confidentialité RGPD</Link>.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!phoneNumber || !acceptTerms || isSubmitting}
              style={{
                backgroundColor: isSubmitting ? "#8a968f" : "#d4a373",
                color: "#0b130e",
                fontWeight: "700",
                padding: "1rem",
                borderRadius: "30px",
                border: "none",
                fontSize: "1rem",
                cursor: (!phoneNumber || !acceptTerms || isSubmitting) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
                transition: "all 0.2s ease"
              }}
            >
              {isSubmitting ? "Envoi du code..." : "Recevoir mon code OTP"} <ArrowRight size={18} />
            </button>
          </form>

          {/* Test mode note */}
          <div style={{ marginTop: "1.5rem", padding: "0.75rem 1rem", backgroundColor: "rgba(212, 163, 115, 0.1)", borderRadius: "12px", border: "1px dashed rgba(212, 163, 115, 0.3)", textAlign: "center", fontSize: "0.8rem", color: "#d4a373" }}>
            💡 <strong>Mode Démo / Test :</strong> Saisissez n'importe quel numéro valide pour simuler l'envoi du code OTP instantanément.
          </div>

        </div>
      </main>
    </div>
  );
}
