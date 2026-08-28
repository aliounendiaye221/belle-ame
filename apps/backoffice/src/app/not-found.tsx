import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0b130e",
      color: "#f8f9fa",
      fontFamily: "system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem"
    }}>
      <div style={{ fontSize: "5rem", fontWeight: "900", background: "linear-gradient(135deg, #d4a373, #e07a5f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: "1" }}>
        404
      </div>
      <h1 style={{ fontWeight: "800", fontSize: "1.3rem", marginTop: "1rem", marginBottom: "0.5rem" }}>
        Page introuvable
      </h1>
      <p style={{ color: "#c2c9c4", fontSize: "0.9rem", maxWidth: "380px", lineHeight: "1.5", marginBottom: "2rem" }}>
        Cette page d&apos;administration n&apos;existe pas ou vous n&apos;y avez pas accès.
      </p>
      <Link href="/" style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        borderRadius: "999px",
        background: "linear-gradient(135deg, #d4a373, #e07a5f)",
        color: "#0b130e",
        fontWeight: "700",
        fontSize: "0.85rem",
        textDecoration: "none"
      }}>
        ← Dashboard Admin
      </Link>
    </div>
  );
}
