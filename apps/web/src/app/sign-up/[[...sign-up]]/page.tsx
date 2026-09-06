"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070d09",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#f4c07c",
            colorBackground: "#122219",
            colorText: "#fbfbfb",
            colorTextSecondary: "#c7cfcb",
            colorInputBackground: "#070d09",
            colorInputText: "#ffffff",
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/onboarding"
      />
    </div>
  );
}
