export default function Loading() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0b130e",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "3px solid rgba(212, 163, 115, 0.15)",
        borderTopColor: "#d4a373",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "#c2c9c4", marginTop: "1.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
        Chargement en cours...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
