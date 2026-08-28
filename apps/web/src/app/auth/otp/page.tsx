"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight, RefreshCw, KeyRound } from "lucide-react";

export default function OtpPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const char = value.length > 1 ? value.slice(-1) : value;
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setError("Veuillez saisir le code à 6 chiffres.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      window.location.href = "/onboarding";
    }, 800);
  };

  const handleResend = () => {
    setCountdown(60);
    setDigits(["", "", "", "", "", ""]);
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem" }}>
            Â
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>À Chacun Une Belle Âme</div>
            <div style={{ fontSize: "0.75rem", color: "#d4a373", textTransform: "uppercase", letterSpacing: "1px" }}>Validation OTP</div>
          </div>
        </Link>
        <Link href="/auth/login" style={{ color: "#d4a373", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500" }}>
          ← Modifier le numéro
        </Link>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "460px", width: "100%", backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", padding: "2.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(212, 163, 115, 0.15)", border: "1px solid rgba(212, 163, 115, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "#d4a373" }}>
              <KeyRound size={28} />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "0.5rem" }}>Code de vérification</h1>
            <p style={{ color: "#a0aba4", fontSize: "0.9rem", lineHeight: "1.5" }}>
              Entrez le code à 6 chiffres envoyé par SMS ou WhatsApp à votre numéro.
            </p>
          </div>

          <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* 6 digits input grid */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  style={{
                    width: "48px",
                    height: "56px",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    backgroundColor: "#081c15",
                    border: digit ? "2px solid #d4a373" : "1px solid rgba(212, 163, 115, 0.3)",
                    color: "#ffffff",
                    borderRadius: "12px",
                    outline: "none"
                  }}
                />
              ))}
            </div>

            {error && (
              <div style={{ backgroundColor: "rgba(230, 57, 70, 0.15)", border: "1px solid rgba(230, 57, 70, 0.3)", color: "#e63946", padding: "0.75rem", borderRadius: "10px", fontSize: "0.85rem", textAlign: "center" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={digits.join("").length < 6 || isSubmitting}
              style={{
                backgroundColor: digits.join("").length < 6 || isSubmitting ? "#8a968f" : "#d4a373",
                color: "#0b130e",
                fontWeight: "700",
                padding: "1rem",
                borderRadius: "30px",
                border: "none",
                fontSize: "1rem",
                cursor: digits.join("").length < 6 || isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease"
              }}
            >
              {isSubmitting ? "Vérification en cours..." : "Valider mon identité"} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", fontSize: "0.85rem" }}>
            <span style={{ color: "#a0aba4" }}>
              {countdown > 0 ? `Renvoi possible dans ${countdown}s` : "Vous n'avez pas reçu le code ?"}
            </span>
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: countdown > 0 ? "#5a6660" : "#d4a373",
                fontWeight: "600",
                cursor: countdown > 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <RefreshCw size={14} /> Renvoyer
            </button>
          </div>

          <div style={{ marginTop: "1.5rem", padding: "0.75rem 1rem", backgroundColor: "rgba(82, 183, 136, 0.1)", borderRadius: "12px", border: "1px dashed rgba(82, 183, 136, 0.3)", textAlign: "center", fontSize: "0.8rem", color: "#52b788" }}>
            🛡️ <strong>MODE TEST AUTOMATIQUE :</strong> Vous pouvez saisir n'importe quel code à 6 chiffres (ex: <code>123456</code>) pour procéder à l'onboarding.
          </div>

        </div>
      </main>
    </div>
  );
}
