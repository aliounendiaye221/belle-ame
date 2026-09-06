"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, AlertCircle, Sparkles, CheckCircle2, Loader2, KeyRound } from "lucide-react";

export default function CustomSignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Inscription par Email et Mot de passe (100% sans numéro de téléphone)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        password: password,
      });

      // Envoi du code de vérification par EMAIL
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "Une erreur est survenue lors de l'inscription. Vérifiez les informations saisies.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Validation du code reçu par Email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/onboarding");
      } else {
        setErrorMessage("Vérification incomplète. Veuillez réessayer.");
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "Code de validation incorrect ou expiré.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Inscription en 1 Clic via Google (Sans numéro de téléphone)
  const handleGoogleSignUp = () => {
    if (!isLoaded) return;
    signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/onboarding",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070d09",
        backgroundImage: "radial-gradient(ellipse at top, rgba(20, 45, 30, 0.7) 0%, #070d09 75%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      <div
        style={{
          maxWidth: "460px",
          width: "100%",
          backgroundColor: "rgba(16, 32, 23, 0.94)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1.5px solid rgba(212, 163, 115, 0.35)",
          borderRadius: "28px",
          padding: "2.5rem 2rem",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 163, 115, 0.15)",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d4a373, #f4c07c)",
              color: "#070d09",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              fontSize: "1.5rem",
              margin: "0 auto 1rem",
              boxShadow: "0 0 25px rgba(244, 192, 124, 0.4)",
            }}
          >
            Â
          </div>

          <h1 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#ffffff", margin: "0 0 0.35rem 0" }}>
            {pendingVerification ? "Valider Votre Email" : "Rejoindre le Sanctuaire"}
          </h1>
          <p style={{ color: "#a0aba4", fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
            {pendingVerification
              ? `Un code à 6 chiffres a été envoyé à ${email}`
              : "Inscription par Email ou Google sans restriction de pays"}
          </p>
        </div>

        {/* Étape 2 : Vérification du Code Email */}
        {pendingVerification ? (
          <form onSubmit={handleVerifyEmail} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {errorMessage && (
              <div
                style={{
                  backgroundColor: "rgba(230, 57, 70, 0.15)",
                  border: "1px solid #e63946",
                  color: "#ff858d",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "0.4rem" }}>
                Code de Validation Reçu par Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  placeholder="123456"
                  maxLength={6}
                  style={{
                    width: "100%",
                    backgroundColor: "#070d09",
                    border: "1px solid rgba(212, 163, 115, 0.3)",
                    color: "#ffffff",
                    padding: "0.85rem 1rem 0.85rem 2.6rem",
                    borderRadius: "14px",
                    outline: "none",
                    fontSize: "18px",
                    fontWeight: "800",
                    letterSpacing: "4px",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                />
                <KeyRound size={17} color="#8a968f" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: "linear-gradient(135deg, #f4c07c, #d4a373)",
                color: "#070d09",
                border: "none",
                padding: "0.95rem 1.5rem",
                borderRadius: "14px",
                fontWeight: "900",
                fontSize: "1rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 6px 20px rgba(212, 163, 115, 0.35)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Validation...
                </>
              ) : (
                <>
                  Confirmer Mon Compte <CheckCircle2 size={18} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setPendingVerification(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#a0aba4",
                fontSize: "0.82rem",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Modifier l&apos;adresse email
            </button>
          </form>
        ) : (
          /* Étape 1 : Formulaire d'Inscription */
          <>
            {/* Bouton Google Direct (1-Click) */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                backgroundColor: "#ffffff",
                color: "#1f1f1f",
                fontWeight: "700",
                fontSize: "0.92rem",
                padding: "0.85rem 1rem",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                marginBottom: "1.5rem",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                transition: "transform 0.15s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              S&apos;inscrire avec Google
            </button>

            {/* Separator */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(212, 163, 115, 0.2)" }} />
              <span style={{ fontSize: "0.75rem", color: "#8a968f", textTransform: "uppercase", fontWeight: "700" }}>
                ou avec votre email
              </span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(212, 163, 115, 0.2)" }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {errorMessage && (
                <div
                  style={{
                    backgroundColor: "rgba(230, 57, 70, 0.15)",
                    border: "1px solid #e63946",
                    color: "#ff858d",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    fontSize: "0.82rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "0.35rem" }}>
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Mamadou"
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#ffffff",
                      padding: "0.85rem 1rem",
                      borderRadius: "14px",
                      outline: "none",
                      fontSize: "15px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "0.35rem" }}>
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Diallo"
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#ffffff",
                      padding: "0.85rem 1rem",
                      borderRadius: "14px",
                      outline: "none",
                      fontSize: "15px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "0.35rem" }}>
                  Adresse Email
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="mamadou.diallo@exemple.com"
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#ffffff",
                      padding: "0.85rem 1rem 0.85rem 2.6rem",
                      borderRadius: "14px",
                      outline: "none",
                      fontSize: "15px",
                      boxSizing: "border-box",
                    }}
                  />
                  <Mail size={17} color="#8a968f" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "0.35rem" }}>
                  Mot de Passe
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Au moins 8 caractères"
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#ffffff",
                      padding: "0.85rem 1rem 0.85rem 2.6rem",
                      borderRadius: "14px",
                      outline: "none",
                      fontSize: "15px",
                      boxSizing: "border-box",
                    }}
                  />
                  <Lock size={17} color="#8a968f" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: "0.5rem",
                  background: "linear-gradient(135deg, #f4c07c, #d4a373)",
                  color: "#070d09",
                  border: "none",
                  padding: "0.95rem 1.5rem",
                  borderRadius: "14px",
                  fontWeight: "900",
                  fontSize: "1rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 6px 20px rgba(212, 163, 115, 0.35)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Inscription en cours...
                  </>
                ) : (
                  <>
                    Créer Mon Profil Vérifié <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: "2rem", textAlign: "center", borderTop: "1px solid rgba(212, 163, 115, 0.15)", paddingTop: "1.25rem" }}>
              <p style={{ color: "#a0aba4", fontSize: "0.85rem", margin: 0 }}>
                Déjà membre ?{" "}
                <Link href="/sign-in" style={{ color: "#f4c07c", fontWeight: "800", textDecoration: "none" }}>
                  Se Connecter
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
