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
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "3px solid rgba(212, 163, 115, 0.15)",
        borderTopColor: "#d4a373",
        animation: "adminSpin 0.7s linear infinite"
      }} />
      <p style={{ color: "#c2c9c4", marginTop: "1rem", fontSize: "0.85rem", fontWeight: "500" }}>
        Chargement du module admin...
      </p>
      <style>{`
        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
