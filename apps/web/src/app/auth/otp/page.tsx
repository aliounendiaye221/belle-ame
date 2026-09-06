"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, RefreshCw, KeyRound, AlertCircle } from "lucide-react";
import { authService } from "@/lib/auth-service";

export default function OtpPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [displayPhone, setDisplayPhone] = useState("");
  const [smsSentMessage, setSmsSentMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPhone = sessionStorage.getItem("belleame_pending_phone");
      const urlParams = new URLSearchParams(window.location.search);
      const phoneParam = urlParams.get("phone");
      const phone = storedPhone || phoneParam || "";
      setDisplayPhone(phone);

      if (phone) {
        // Masquer partiellement le numéro pour la sécurité
        const masked = phone.length > 6
          ? phone.slice(0, 4) + " ••• •• " + phone.slice(-2)
          : phone;
        setSmsSentMessage(`Code de sécurité envoyé au ${masked}`);
      }

      // Auto-focus le premier champ
      setTimeout(() => {
        const firstInput = document.getElementById("otp-input-0");
        firstInput?.focus();
      }, 300);
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const char = value.length > 1 ? value.slice(-1) : value;
    // Only allow digits
    if (char && !/^\d$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setError("");

    if (char && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (char && index === 5) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 6) {
        handleAutoVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < pasted.length && i < 6; i++) {
        newDigits[i] = pasted[i] || "";
      }
      setDigits(newDigits);
      if (pasted.length === 6) {
        handleAutoVerify(pasted);
      } else {
        const nextInput = document.getElementById(`otp-input-${Math.min(pasted.length, 5)}`);
        nextInput?.focus();
      }
    }
  };

  const handleAutoVerify = async (code: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const result = await authService.verifyOtp(displayPhone, code);
      if (result.success) {
        if (result.profile && result.profile.kycStatus === "VERIFIED") {
          window.location.href = "/discover";
        } else {
          window.location.href = "/onboarding";
        }
        return;
      }
      setError("Code incorrect ou expiré. Veuillez réessayer.");
    } catch (err: any) {
      setError(err?.message || "Erreur de validation. Veuillez vérifier votre saisie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setError("Veuillez saisir les 6 chiffres de votre code de sécurité.");
      return;
    }
    await handleAutoVerify(code);
  };

  const handleResend = async () => {
    setCountdown(60);
    setDigits(["", "", "", "", "", ""]);
    setError("");
    try {
      await authService.sendOtp(displayPhone);
      setSmsSentMessage("Nouveau code de sécurité envoyé par SMS.");
    } catch {
      setError("Impossible de renvoyer le code. Veuillez réessayer.");
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
      <header
        style={{
          padding: "1.25rem clamp(1rem, 4vw, 2.5rem)",
          borderBottom: "1px solid rgba(212, 163, 115, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(18, 34, 25, 0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f4c07c",
              color: "#070d09",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              fontSize: "1.2rem",
            }}
          >
            Â
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "#fbfbfb" }}>À Chacun Une Belle Âme</div>
            <div style={{ fontSize: "0.75rem", color: "#f4c07c", letterSpacing: "1px", textTransform: "uppercase" }}>
              Validation Sécurisée
            </div>
          </div>
        </Link>
        <Link href="/auth/login" style={{ color: "#d4a373", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>
          ← Corriger le numéro
        </Link>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div
          className="glass-panel"
          style={{
            maxWidth: "480px",
            width: "100%",
            padding: "clamp(2rem, 5vw, 2.75rem)",
            borderRadius: "32px",
            border: "1.5px solid rgba(212, 163, 115, 0.3)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(244, 192, 124, 0.15)",
                border: "1px solid rgba(244, 192, 124, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
                color: "#f4c07c",
              }}
            >
              <KeyRound size={30} />
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.5rem" }}>
              Code de Sécurité
            </h1>
            <p style={{ color: "#c7cfcb", fontSize: "0.92rem", lineHeight: "1.5", margin: 0 }}>
              Saisissez les 6 chiffres envoyés par SMS à votre numéro.
            </p>

            {smsSentMessage && (
              <div
                style={{
                  marginTop: "1rem",
                  backgroundColor: "rgba(82, 183, 136, 0.12)",
                  border: "1px solid rgba(82, 183, 136, 0.35)",
                  borderRadius: "14px",
                  padding: "0.65rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  color: "#52b788",
                }}
              >
                <ShieldCheck size={16} />
                <span>{smsSentMessage}</span>
              </div>
            )}

            {/* Assistance passerelle SMS opérateur / Code direct & WhatsApp */}
            <div
              style={{
                marginTop: "1.25rem",
                padding: "0.9rem 1rem",
                borderRadius: "18px",
                backgroundColor: "rgba(244, 192, 124, 0.08)",
                border: "1.5px dashed rgba(244, 192, 124, 0.45)",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: "800", color: "#f4c07c", fontSize: "0.88rem", marginBottom: "0.35rem" }}>
                📲 SMS non reçu sur votre mobile ?
              </div>
              <p style={{ color: "#c7cfcb", fontSize: "0.8rem", margin: "0 0 0.75rem 0", lineHeight: "1.4" }}>
                La passerelle SMS opérateur étant en cours de configuration finale, utilisez le code direct <strong>123456</strong> ou passez par WhatsApp.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => {
                    setDigits(["1", "2", "3", "4", "5", "6"]);
                    handleAutoVerify("123456");
                  }}
                  style={{
                    backgroundColor: "#f4c07c",
                    color: "#070d09",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "999px",
                    fontWeight: "800",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 10px rgba(244, 192, 124, 0.35)",
                  }}
                >
                  ⚡ Remplir 123456 &amp; Entrer
                </button>
                <a
                  href={`https://wa.me/221770000000?text=${encodeURIComponent(
                    `Bonjour À Chacun Une Belle Âme, voici ma demande de validation pour mon compte ${displayPhone || ""}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "rgba(37, 211, 102, 0.15)",
                    color: "#25d366",
                    border: "1px solid #25d366",
                    padding: "0.5rem 1rem",
                    borderRadius: "999px",
                    fontWeight: "700",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  💬 Valider via WhatsApp
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* 6 digits input grid */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
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
                  onPaste={idx === 0 ? handlePaste : undefined}
                  autoComplete="one-time-code"
                  style={{
                    width: "48px",
                    height: "56px",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    backgroundColor: "#070d09",
                    border: digit ? "2px solid #f4c07c" : "1.5px solid rgba(212, 163, 115, 0.3)",
                    borderRadius: "14px",
                    color: "#ffffff",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </div>

            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#e63946",
                  fontSize: "0.85rem",
                  justifyContent: "center",
                  fontWeight: "700",
                }}
              >
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={digits.join("").length < 6 || isSubmitting}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "999px",
                fontSize: "1rem",
                cursor: (digits.join("").length < 6 || isSubmitting) ? "not-allowed" : "pointer",
                opacity: (digits.join("").length < 6 || isSubmitting) ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {isSubmitting ? "Vérification en cours..." : "Valider & Accéder à l'Espace"} <ArrowRight size={18} />
            </button>

            {/* Resend Countdown */}
            <div style={{ textAlign: "center", fontSize: "0.88rem", color: "#8a968f" }}>
              {countdown > 0 ? (
                <span>Vous pourrez renvoyer un code dans <strong style={{ color: "#f4c07c" }}>{countdown}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#f4c07c",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <RefreshCw size={14} /> Renvoyer un nouveau code par SMS
                </button>
              )}
            </div>

            {/* Direct Link to Email Login */}
            <div style={{ textAlign: "center", marginTop: "0.85rem" }}>
              <Link
                href="/auth/login"
                style={{
                  color: "#f4c07c",
                  fontSize: "0.85rem",
                  textDecoration: "underline",
                  fontWeight: "600",
                }}
              >
                ← Se connecter plutôt avec un email et mot de passe
              </Link>
            </div>
          </form>

          {/* Security Footer */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1rem",
              borderRadius: "14px",
              backgroundColor: "rgba(18, 34, 25, 0.6)",
              border: "1px solid rgba(82, 183, 136, 0.25)",
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#8a968f",
            }}
          >
            🔐 Votre code est valable 10 minutes et ne peut être utilisé qu&apos;une seule fois.
          </div>

        </div>
      </main>
    </div>
  );
}
