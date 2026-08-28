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
      padding: "2rem",
      backgroundImage: "radial-gradient(circle at 50% 40%, rgba(45, 106, 79, 0.2) 0%, transparent 50%)"
    }}>
      <div style={{ fontSize: "6rem", fontWeight: "900", background: "linear-gradient(135deg, #d4a373, #e07a5f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: "1" }}>
        404
      </div>
      <h1 style={{ fontWeight: "800", fontSize: "1.5rem", marginTop: "1rem", marginBottom: "0.5rem" }}>
        Page introuvable
      </h1>
      <p style={{ color: "#c2c9c4", fontSize: "0.95rem", maxWidth: "400px", lineHeight: "1.6", marginBottom: "2rem" }}>
        Cette page n&apos;existe pas ou a été déplacée. Votre belle âme mérite un meilleur chemin. ✨
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "14px 28px",
          borderRadius: "999px",
          background: "linear-gradient(135deg, #d4a373, #e07a5f)",
          color: "#0b130e",
          fontWeight: "700",
          fontSize: "0.9rem",
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(224, 122, 95, 0.35)"
        }}>
          🏠 Retour à l&apos;accueil
        </Link>
        <Link href="/discover" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "14px 28px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(212, 163, 115, 0.3)",
          color: "#d4a373",
          fontWeight: "600",
          fontSize: "0.9rem",
          textDecoration: "none"
        }}>
          💫 Découvrir des profils
        </Link>
      </div>
    </div>
  );
}
