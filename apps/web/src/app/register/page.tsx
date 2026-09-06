"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070d09",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#f4c07c",
        fontSize: "1.1rem",
        fontFamily: "var(--font-sans)",
      }}
    >
      Redirection vers l&apos;authentification sécurisée...
    </div>
  );
}
