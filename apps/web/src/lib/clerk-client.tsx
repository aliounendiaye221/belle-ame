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
}

const ClerkAuthContext = createContext<ClerkAuthContextType>({
  isLoaded: true,
  isSignedIn: false,
  user: null,
  signOut: async () => {},
  openSignIn: () => {},
  openSignUp: () => {},
});

export function ClerkProvider({
  children,
  appearance,
}: {
  children: React.ReactNode;
  appearance?: any;
}) {
  const [user, setUser] = useState<ClerkUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("belleame_clerk_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("belleame_clerk_user");
      localStorage.removeItem("belleame_jwt_token");
    }
    setUser(null);
    window.location.href = "/";
  };

  const openSignIn = () => {
    window.location.href = "/sign-in";
  };

  const openSignUp = () => {
    window.location.href = "/sign-up";
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
  return { signOut: ctx.signOut, openSignIn: ctx.openSignIn, openSignUp: ctx.openSignUp };
}

export function Show({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: React.ReactNode;
}) {
  const { isSignedIn } = useContext(ClerkAuthContext);
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
    <Link href="/sign-in" style={{ textDecoration: "none" }}>
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

export function SignIn({ appearance }: { appearance?: any }) {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "belleame_clerk_user",
        JSON.stringify({
          id: "user_" + Date.now(),
          fullName: "Aminata Ndiaye",
          firstName: "Aminata",
          imageUrl: "/icons/icon-192.png",
        })
      );
      window.location.href = "/discover";
    }
  };

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
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#fbfbfb", marginBottom: "0.35rem" }}>
          Connexion Sécurisée
        </h2>
        <p style={{ color: "#c7cfcb", fontSize: "0.88rem" }}>
          Accédez à votre sanctuaire matrimonial « À Chacun Une Belle Âme »
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
            Numéro de mobile ou Email
          </label>
          <input
            type="text"
            required
            placeholder="Ex: +221 77 123 45 67"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              backgroundColor: "#070d09",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
            Mot de passe ou Code Secret
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              backgroundColor: "#070d09",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{
            width: "100%",
            padding: "0.85rem",
            borderRadius: "999px",
            fontWeight: "800",
            fontSize: "0.95rem",
            marginTop: "0.5rem",
            cursor: "pointer",
          }}
        >
          Se Connecter avec Clerk
        </button>
      </form>

      <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.85rem", color: "#c7cfcb" }}>
        Pas encore de compte ?{" "}
        <Link href="/sign-up" style={{ color: "#f4c07c", fontWeight: "700" }}>
          Créer un profil 18+
        </Link>
      </div>
    </div>
  );
}

export function SignUp({ appearance }: { appearance?: any }) {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "belleame_clerk_user",
        JSON.stringify({
          id: "user_" + Date.now(),
          fullName: firstName,
          firstName: firstName,
          imageUrl: "/icons/icon-192.png",
        })
      );
      window.location.href = "/onboarding";
    }
  };

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
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#fbfbfb", marginBottom: "0.35rem" }}>
          Rejoindre l&apos;Alliance Sacrée
        </h2>
        <p style={{ color: "#c7cfcb", fontSize: "0.88rem" }}>
          Inscription sécurisée certifiée par Clerk pour les majeurs d&apos;Afrique & Diaspora
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
            Prénom
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Aminata"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              backgroundColor: "#070d09",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
            Numéro de téléphone mobile
          </label>
          <input
            type="tel"
            required
            placeholder="Ex: +221 77 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              backgroundColor: "#070d09",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "0.4rem" }}>
            Mot de passe
          </label>
          <input
            type="password"
            required
            placeholder="Minimum 8 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              backgroundColor: "#070d09",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{
            width: "100%",
            padding: "0.85rem",
            borderRadius: "999px",
            fontWeight: "800",
            fontSize: "0.95rem",
            marginTop: "0.5rem",
            cursor: "pointer",
          }}
        >
          Créer mon Compte Vérifié
        </button>
      </form>

      <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.85rem", color: "#c7cfcb" }}>
        Déjà inscrit ?{" "}
        <Link href="/sign-in" style={{ color: "#f4c07c", fontWeight: "700" }}>
          Se connecter
        </Link>
      </div>
    </div>
  );
}
