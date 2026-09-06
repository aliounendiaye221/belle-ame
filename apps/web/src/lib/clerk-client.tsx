"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";

interface ClerkUser {
  id: string;
  fullName: string | null;
  firstName: string | null;
  imageUrl: string;
  primaryEmailAddress?: { emailAddress: string };
  primaryPhoneNumber?: { phoneNumber: string };
}

interface ClerkAuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: ClerkUser | null;
  signOut: () => Promise<void>;
  openSignIn: () => void;
  openSignUp: () => void;
  setUserSession: (user: ClerkUser) => void;
}

const ClerkAuthContext = createContext<ClerkAuthContextType>({
  isLoaded: true,
  isSignedIn: false,
  user: null,
  signOut: async () => {},
  openSignIn: () => {},
  openSignUp: () => {},
  setUserSession: () => {},
});

export function ClerkProvider({
  children,
  appearance,
}: {
  children: React.ReactNode;
  appearance?: any;
}) {
  const [user, setUser] = useState<ClerkUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("belleame_clerk_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // corrupted data, clear it
          localStorage.removeItem("belleame_clerk_user");
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("belleame_clerk_user");
      localStorage.removeItem("belleame_access_token");
      localStorage.removeItem("belleame_jwt_token");
      sessionStorage.removeItem("belleame_pending_phone");
    }
    setUser(null);
    window.location.href = "/";
  };

  const openSignIn = () => {
    window.location.href = "/auth/login";
  };

  const openSignUp = () => {
    window.location.href = "/sign-up";
  };

  const setUserSession = (newUser: ClerkUser) => {
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("belleame_clerk_user", JSON.stringify(newUser));
    }
  };

  return (
    <ClerkAuthContext.Provider
      value={{
        isLoaded,
        isSignedIn: !!user,
        user,
        signOut,
        openSignIn,
        openSignUp,
        setUserSession,
      }}
    >
      {children}
    </ClerkAuthContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(ClerkAuthContext);
  return { isLoaded: ctx.isLoaded, isSignedIn: ctx.isSignedIn, user: ctx.user };
}

export function useClerk() {
  const ctx = useContext(ClerkAuthContext);
  return {
    signOut: ctx.signOut,
    openSignIn: ctx.openSignIn,
    openSignUp: ctx.openSignUp,
    setUserSession: ctx.setUserSession,
  };
}

export function Show({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useContext(ClerkAuthContext);
  if (!isLoaded) return null;
  if (when === "signed-in" && isSignedIn) return <>{children}</>;
  if (when === "signed-out" && !isSignedIn) return <>{children}</>;
  return null;
}

export function SignInButton({
  children,
  mode,
}: {
  children?: React.ReactNode;
  mode?: "modal" | "redirect";
}) {
  return (
    <Link href="/auth/login" style={{ textDecoration: "none" }}>
      {children || <button type="button">Connexion</button>}
    </Link>
  );
}

export function SignUpButton({
  children,
  mode,
}: {
  children?: React.ReactNode;
  mode?: "modal" | "redirect";
}) {
  return (
    <Link href="/sign-up" style={{ textDecoration: "none" }}>
      {children || <button type="button">Inscription</button>}
    </Link>
  );
}

export function UserButton({
  afterSignOutUrl,
  appearance,
}: {
  afterSignOutUrl?: string;
  appearance?: any;
}) {
  const { user, signOut } = useContext(ClerkAuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f4c07c 0%, #e07a5f 100%)",
          color: "#070d09",
          fontWeight: "800",
          border: "2px solid #f4c07c",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 12px rgba(244, 192, 124, 0.4)",
        }}
      >
        {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "Â"}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "115%",
            right: 0,
            backgroundColor: "#122219",
            border: "1px solid rgba(212, 163, 115, 0.3)",
            borderRadius: "16px",
            padding: "1rem",
            width: "220px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            zIndex: 1000,
          }}
        >
          <div style={{ fontWeight: "700", color: "#fbfbfb", fontSize: "0.95rem", marginBottom: "0.25rem" }}>
            {user?.fullName || "Membre Privilège"}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#52b788", marginBottom: "0.75rem" }}>
            ✅ Compte Certifié 18+
          </div>
          <hr style={{ borderColor: "rgba(212, 163, 115, 0.15)", marginBottom: "0.75rem" }} />
          <Link
            href="/profile"
            style={{
              display: "block",
              color: "#c7cfcb",
              textDecoration: "none",
              fontSize: "0.85rem",
              marginBottom: "0.5rem",
            }}
          >
            👤 Mon Profil Sincère
          </Link>
          <Link
            href="/settings"
            style={{
              display: "block",
              color: "#c7cfcb",
              textDecoration: "none",
              fontSize: "0.85rem",
              marginBottom: "0.75rem",
            }}
          >
            ⚙️ Paramètres
          </Link>
          <button
            type="button"
            onClick={signOut}
            style={{
              width: "100%",
              background: "rgba(230, 57, 70, 0.15)",
              border: "1px solid #e63946",
              color: "#e63946",
              padding: "0.45rem",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SignIn & SignUp components are kept for backward compatibility
   but now redirect directly to the real auth pages.
   ============================================================ */

export function SignIn({ appearance }: { appearance?: any }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#122219",
        borderRadius: "24px",
        border: "1px solid rgba(212, 163, 115, 0.3)",
        padding: "2.25rem",
        boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
        textAlign: "center",
      }}
    >
      <div style={{ color: "#c7cfcb", fontSize: "0.92rem" }}>
        Redirection vers la page de connexion sécurisée...
      </div>
    </div>
  );
}

export function SignUp({ appearance }: { appearance?: any }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/sign-up";
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "440px",
        backgroundColor: "#122219",
        borderRadius: "24px",
        border: "1px solid rgba(212, 163, 115, 0.3)",
        padding: "2.25rem",
        boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
        textAlign: "center",
      }}
    >
      <div style={{ color: "#c7cfcb", fontSize: "0.92rem" }}>
        Redirection vers la page d&apos;inscription...
      </div>
    </div>
  );
}
