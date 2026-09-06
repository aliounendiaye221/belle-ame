"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070d09",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#f4c07c",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
