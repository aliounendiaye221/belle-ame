"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";

interface BackofficeAdminUser {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  role: "SUPER_ADMIN" | "LEAD_MODERATOR" | "MODERATOR";
}

interface BackofficeAuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: BackofficeAdminUser | null;
  signOut: () => Promise<void>;
}

const BackofficeAuthContext = createContext<BackofficeAuthContextType>({
  isLoaded: true,
  isSignedIn: true,
  user: {
    id: "admin-super-01",
    fullName: "Aliou Ndiaye",
    firstName: "Aliou",
    email: "contact@belleame.africa",
    role: "SUPER_ADMIN",
  },
  signOut: async () => {},
});

export function ClerkProvider({
  children,
  appearance,
}: {
  children: React.ReactNode;
  appearance?: any;
}) {
  const [user, setUser] = useState<BackofficeAdminUser | null>({
    id: "admin-super-01",
    fullName: "Aliou Ndiaye",
    firstName: "Aliou",
    email: "contact@belleame.africa",
    role: "SUPER_ADMIN",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("belleame_admin_user");
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
      localStorage.removeItem("belleame_admin_user");
    }
    setUser(null);
    window.location.href = "/";
  };

  return (
    <BackofficeAuthContext.Provider
      value={{
        isLoaded: true,
        isSignedIn: !!user,
        user,
        signOut,
      }}
    >
      {children}
    </BackofficeAuthContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(BackofficeAuthContext);
  return { isLoaded: ctx.isLoaded, isSignedIn: ctx.isSignedIn, user: ctx.user };
}

export function UserButton() {
  const { user, signOut } = useContext(BackofficeAuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(212, 163, 115, 0.15)",
          border: "1px solid rgba(212, 163, 115, 0.35)",
          color: "#f4c07c",
          padding: "4px 12px",
          borderRadius: "999px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "0.82rem",
        }}
      >
        <span
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#d4a373",
            color: "#0b130e",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "900",
            fontSize: "0.75rem",
          }}
        >
          {user?.firstName ? user.firstName.charAt(0) : "A"}
        </span>
        <span>{user?.firstName || "Admin"}</span>
        <span style={{ fontSize: "0.68rem", backgroundColor: "#52b788", color: "#070d09", padding: "1px 6px", borderRadius: "999px", fontWeight: "800" }}>
          SUPER ADMIN
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "120%",
            right: 0,
            backgroundColor: "#14231a",
            border: "1px solid rgba(212, 163, 115, 0.3)",
            borderRadius: "16px",
            padding: "1rem",
            width: "220px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            zIndex: 1000,
          }}
        >
          <div style={{ fontWeight: "700", color: "#fbfbfb", fontSize: "0.9rem" }}>{user?.fullName}</div>
          <div style={{ fontSize: "0.75rem", color: "#8a968f", marginBottom: "0.75rem" }}>{user?.email}</div>
          <hr style={{ borderColor: "rgba(212, 163, 115, 0.15)", marginBottom: "0.75rem" }} />
          <Link href="/settings" style={{ display: "block", color: "#c7cfcb", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            ⚙️ Paramètres Système
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
            Déconnexion Admin
          </button>
        </div>
      )}
    </div>
  );
}
