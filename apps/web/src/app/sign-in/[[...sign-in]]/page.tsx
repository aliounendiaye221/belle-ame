import { SignIn } from "@/lib/clerk-client";

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
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(244, 192, 124, 0.15) 0%, rgba(230, 57, 70, 0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <SignIn
        appearance={{
          elements: {
            rootBox: {
              boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 35px rgba(212, 163, 115, 0.2)",
              borderRadius: "24px",
              overflow: "hidden",
            },
            card: {
              backgroundColor: "#122219",
              border: "1px solid rgba(212, 163, 115, 0.3)",
            },
            headerTitle: {
              color: "#fbfbfb",
              fontWeight: "800",
            },
            headerSubtitle: {
              color: "#c7cfcb",
            },
            formButtonPrimary: {
              background: "linear-gradient(135deg, #f4c07c 0%, #e07a5f 100%)",
              color: "#070d09",
              fontWeight: "700",
              "&:hover": {
                opacity: 0.9,
              },
            },
            formFieldInput: {
              backgroundColor: "#070d09",
              borderColor: "rgba(212, 163, 115, 0.3)",
              color: "#ffffff",
            },
            footerActionLink: {
              color: "#f4c07c",
            },
          },
        }}
      />
    </div>
  );
}
