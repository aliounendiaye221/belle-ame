"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthOtpRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sign-in");
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
        fontFamily: "var(--font-sans)",
      }}
    >
      Redirection vers l&apos;authentification Clerk...
    </div>
  );
}
