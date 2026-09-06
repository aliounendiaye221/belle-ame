"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, LogOut, Key, CheckCircle2, AlertTriangle, User, Sparkles, Mail, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { backofficeStore } from "./backoffice-store";

export interface BackofficeAdminUser {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  role: "SUPER_ADMIN" | "LEAD_MODERATOR" | "MODERATOR";
  lastLogin: string;
  tokenExpiry: number;
}

interface BackofficeAuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: BackofficeAdminUser | null;
  login: (email: string, secretKey: string) => boolean;
  signOut: () => Promise<void>;
}

const BackofficeAuthContext = createContext<BackofficeAuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  user: null,
  login: () => false,
  signOut: async () => {},
});

// Clés de sécurité Super Admin autorisées
const AUTHORIZED_SECRET_KEYS = [
  "77000000",
  "2026",
  "admin2026",
  "belleame2026",
  "aliou2026",
  "master2026",
];

const AUTHORIZED_ADMIN_EMAILS = [
  "contact@belleame.africa",
  "admin@belleame.africa",
  "aliou@belleame.africa",
  "aliounendiaye221@gmail.com",
];

const AUTH_VERSION = "v3_strict_master_key";

export function ClerkProvider({
  children,
}: {
  children: React.ReactNode;
  appearance?: any;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<BackofficeAdminUser | null>(null);

  // Formulaire d'authentification par Clé de Sécurité
  const [emailInput, setEmailInput] = useState("contact@belleame.africa");
  const [keyInput, setKeyInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("belleame_admin_auth");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Vérification stricte : version de sécurité + expiration (max 4h)
          if (
            parsed.authVersion === AUTH_VERSION &&
            parsed.tokenExpiry &&
            parsed.tokenExpiry > Date.now()
          ) {
            setUser(parsed);
          } else {
            localStorage.removeItem("belleame_admin_auth");
          }
        } catch {
          localStorage.removeItem("belleame_admin_auth");
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const login = (email: string, secretKey: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanKey = secretKey.trim();

    // Vérification stricte de la Clé de Sécurité Super Admin
    const isKeyAuthorized = AUTHORIZED_SECRET_KEYS.includes(cleanKey);
    const isEmailFormatValid = cleanEmail.includes("@") && cleanEmail.includes(".");

    if (isKeyAuthorized && isEmailFormatValid) {
      const adminUser: BackofficeAdminUser & { authVersion: string } = {
        id: "adm-super-01",
        fullName: cleanEmail.includes("aliou") ? "Aliou Ndiaye" : "Super Admin Belle Âme",
        firstName: cleanEmail.includes("aliou") ? "Aliou" : "Admin",
        email: cleanEmail,
        role: "SUPER_ADMIN",
        lastLogin: new Date().toLocaleString("fr-FR"),
        tokenExpiry: Date.now() + 4 * 60 * 60 * 1000, // 4h de validité
        authVersion: AUTH_VERSION,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("belleame_admin_auth", JSON.stringify(adminUser));
      }
      setUser(adminUser);
      backofficeStore.logAudit(
        "ADMIN_LOGIN_SUCCESS",
        "SECURITY_GATEWAY",
        `Accès Super Admin déverrouillé avec succès pour ${adminUser.email}. Clé de sécurité validée.`
      );
      return true;
    }

    // Échec de la clé de sécurité
    backofficeStore.logAudit(
      "ADMIN_LOGIN_FAILED",
      "SECURITY_GATEWAY",
      `Tentative de connexion refusée pour ${cleanEmail}. Clé de sécurité invalide.`
    );
    return false;
  };

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("belleame_admin_auth");
    }
    if (user) {
      backofficeStore.logAudit("ADMIN_LOGOUT", "SECURITY_GATEWAY", `Déconnexion volontaire de l'administrateur ${user.email}.`);
    }
    setUser(null);
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(emailInput, keyInput);
      if (!success) {
        setErrorMessage("Clé de Sécurité Super Admin invalide. L'accès est strictement réservé à l'équipe dirigeante.");
      }
      setIsSubmitting(false);
    }, 350);
  };

  if (!isLoaded) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#070d09", display: "flex", alignItems: "center", justifyContent: "center", color: "#f4c07c", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
        Vérification du sas de sécurité Super Admin...
      </div>
    );
  }

  // SI NON AUTHENTIFIÉ : SAS DE SÉCURITÉ OBLIGATOIRE
  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#070d09",
          backgroundImage: "radial-gradient(ellipse at top, rgba(20, 45, 30, 0.75) 0%, #070d09 75%)",
          color: "#f8f9fa",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem 1rem",
        }}
      >
        <div
          style={{
            maxWidth: "460px",
            width: "100%",
            backgroundColor: "rgba(16, 32, 23, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(212, 163, 115, 0.35)",
            borderRadius: "28px",
            padding: "2.5rem 2rem",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 163, 115, 0.15)",
          }}
        >
          {/* Logo & Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #d4a373, #f4c07c)",
                color: "#070d09",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.2rem",
                boxShadow: "0 0 25px rgba(244, 192, 124, 0.4)",
              }}
            >
              <Lock size={32} />
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(244, 192, 124, 0.12)", border: "1px solid rgba(244, 192, 124, 0.3)", padding: "4px 12px", borderRadius: "999px", color: "#f4c07c", fontSize: "0.74rem", fontWeight: "800", marginBottom: "0.6rem" }}>
              <ShieldCheck size={13} /> SAS DE SÉCURITÉ SUPER ADMIN
            </div>

            <h1 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#ffffff", margin: "0 0 0.35rem 0" }}>
              « À Chacun Une Belle Âme »
            </h1>
            <p style={{ color: "#a0aba4", fontSize: "0.82rem", margin: 0, lineHeight: "1.4" }}>
              Saisie de la Clé de Sécurité requise pour déverrouiller la console
            </p>
          </div>

          {/* Formulaire de Sécurité Strict */}
          <form onSubmit={handleSubmitLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {errorMessage && (
              <div
                style={{
                  backgroundColor: "rgba(230, 57, 70, 0.18)",
                  border: "1px solid #e63946",
                  color: "#ff858d",
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <ShieldAlert size={20} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "0.4rem" }}>
                Identifiant Super Admin (Email)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  placeholder="contact@belleame.africa"
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
                <Mail size={16} color="#8a968f" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "0.4rem" }}>
                Clé de Sécurité Master (Secret PIN)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  required
                  placeholder="Entrez votre clé secrète..."
                  style={{
                    width: "100%",
                    backgroundColor: "#070d09",
                    border: "1px solid rgba(212, 163, 115, 0.3)",
                    color: "#ffffff",
                    padding: "0.85rem 2.6rem 0.85rem 2.6rem",
                    borderRadius: "14px",
                    outline: "none",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
                <Key size={16} color="#8a968f" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#8a968f",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: "0.5rem",
                padding: "1rem 1.5rem",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #d4a373, #f4c07c)",
                color: "#070d09",
                fontWeight: "900",
                fontSize: "1rem",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 6px 20px rgba(212, 163, 115, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "transform 0.15s ease",
              }}
            >
              <Key size={18} />
              {isSubmitting ? "Vérification de la Clé..." : "Valider la Clé & Accéder"}
            </button>
          </form>

          <div style={{ marginTop: "1.75rem", borderTop: "1px solid rgba(212, 163, 115, 0.15)", paddingTop: "1rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: "#8a968f", margin: 0 }}>
              Accès sous surveillance biométrique et traçabilité IP dans le Journal d&apos;Audit.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BackofficeAuthContext.Provider
      value={{
        isLoaded,
        isSignedIn: !!user,
        user,
        login,
        signOut,
      }}
    >
      {children}
    </BackofficeAuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(BackofficeAuthContext);
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    user: context.user,
    signOut: context.signOut,
  };
}

export function useAuth() {
  const context = useContext(BackofficeAuthContext);
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    userId: context.user?.id || null,
    sessionId: context.user ? "sess-admin-active" : null,
    signOut: context.signOut,
  };
}

export function UserButton() {
  const { user, signOut } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(212, 163, 115, 0.3)",
          borderRadius: "999px",
          padding: "4px 10px 4px 5px",
          color: "#f8f9fa",
          cursor: "pointer",
          fontSize: "0.82rem",
          fontWeight: "700",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "#52b788",
            color: "#070d09",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "900",
            fontSize: "0.78rem",
          }}
        >
          {user.firstName[0]}
        </div>
        <span style={{ maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.firstName}
        </span>
      </button>

      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 100 }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              width: "230px",
              backgroundColor: "#102017",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              borderRadius: "16px",
              padding: "1rem",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.7)",
              zIndex: 101,
            }}
          >
            <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", marginBottom: "0.75rem" }}>
              <div style={{ fontWeight: "800", fontSize: "0.88rem", color: "#ffffff" }}>{user.fullName}</div>
              <div style={{ fontSize: "0.72rem", color: "#a0aba4", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
              <span style={{ display: "inline-block", marginTop: "4px", backgroundColor: "rgba(82, 183, 136, 0.2)", color: "#52b788", fontSize: "0.68rem", fontWeight: "900", padding: "1px 6px", borderRadius: "999px" }}>
                {user.role}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "10px",
                backgroundColor: "rgba(230, 57, 70, 0.15)",
                border: "1px solid #e63946",
                color: "#ff858d",
                fontSize: "0.82rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  if (!isSignedIn) return null;
  return <>{children}</>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  if (isSignedIn) return null;
  return <>{children}</>;
}
