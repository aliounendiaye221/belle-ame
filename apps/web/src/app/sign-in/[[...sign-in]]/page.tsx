"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
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
      <SignIn
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
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/discover"
      />
    </div>
  );
}
