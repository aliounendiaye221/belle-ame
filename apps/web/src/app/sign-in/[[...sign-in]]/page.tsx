"use client";

import { useEffect } from "react";

export default function SignInPage() {
  useEffect(() => {
    window.location.href = "/auth/login";
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070d09",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ color: "#c7cfcb", fontSize: "0.95rem" }}>
        Redirection vers la page de connexion sécurisée...
      </div>
    </div>
  );
}
