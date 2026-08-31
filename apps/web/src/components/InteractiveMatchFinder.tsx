"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Compass, ShieldCheck } from "lucide-react";

export default function InteractiveMatchFinder() {
  const [gender, setGender] = useState<"F" | "M">("F");
  const [targetGender, setTargetGender] = useState<"M" | "F">("M");
  const [ageRange, setAgeRange] = useState<string>("24-34");
  const [country, setCountry] = useState<string>("ALL");

  const estimatedMatches = React.useMemo(() => {
    let base = 1240;
    if (country === "CM") base = 480;
    else if (country === "CI") base = 510;
    else if (country === "BJ") base = 290;
    else if (country === "SN") base = 340;
    else if (country === "DIASPORA") base = 620;

    if (ageRange === "20-25") base = Math.round(base * 0.35);
    else if (ageRange === "24-34") base = Math.round(base * 0.55);
    else if (ageRange === "33-42") base = Math.round(base * 0.45);
    else base = Math.round(base * 0.25);

    return Math.max(120, base);
  }, [country, ageRange]);

  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(16, 32, 23, 0.92), rgba(8, 16, 12, 0.96))",
        border: "1px solid rgba(212, 163, 115, 0.3)",
        borderRadius: "24px",
        padding: "clamp(1.25rem, 3vw, 2.25rem)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
        position: "relative",
      }}
    >
      {/* Widget Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#f4c07c",
              fontWeight: 800,
              backgroundColor: "rgba(212, 163, 115, 0.12)",
              padding: "4px 12px",
              borderRadius: "999px",
              border: "1px solid rgba(212, 163, 115, 0.25)",
            }}
          >
            <Compass size={13} /> Radar d'Affinités Vérifié
          </span>
          <h3 style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.4rem)", fontWeight: 800, marginTop: "8px", color: "#fbfbfb", letterSpacing: "-0.5px" }}>
            Recherche par critères & valeurs sacrées
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#52b788", backgroundColor: "rgba(82, 183, 136, 0.12)", padding: "5px 12px", borderRadius: "999px", border: "1px solid rgba(82, 183, 136, 0.25)" }}>
          <ShieldCheck size={15} />
          <span><strong>100%</strong> Vérification Réelle • Zéro Simulation</span>
        </div>
      </div>

      {/* Filter Form Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        
        {/* Je suis */}
        <div>
          <label style={{ display: "block", fontSize: "0.78rem", color: "#c7cfcb", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginBottom: "6px" }}>
            Je suis
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", backgroundColor: "rgba(7, 13, 9, 0.7)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <button
              type="button"
              onClick={() => { setGender("M"); setTargetGender("F"); }}
              style={{
                padding: "8px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: gender === "M" ? "rgba(212, 163, 115, 0.25)" : "transparent",
                color: gender === "M" ? "#f4c07c" : "#94a39b",
                fontWeight: gender === "M" ? 800 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.85rem",
              }}
            >
              Un Homme
            </button>
            <button
              type="button"
              onClick={() => { setGender("F"); setTargetGender("M"); }}
              style={{
                padding: "8px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: gender === "F" ? "rgba(212, 163, 115, 0.25)" : "transparent",
                color: gender === "F" ? "#f4c07c" : "#94a39b",
                fontWeight: gender === "F" ? 800 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.85rem",
              }}
            >
              Une Femme
            </button>
          </div>
        </div>

        {/* Je recherche */}
        <div>
          <label style={{ display: "block", fontSize: "0.78rem", color: "#c7cfcb", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginBottom: "6px" }}>
            Je recherche
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", backgroundColor: "rgba(7, 13, 9, 0.7)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <button
              type="button"
              onClick={() => setTargetGender("F")}
              style={{
                padding: "8px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: targetGender === "F" ? "rgba(82, 183, 136, 0.25)" : "transparent",
                color: targetGender === "F" ? "#52b788" : "#94a39b",
                fontWeight: targetGender === "F" ? 800 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.85rem",
              }}
            >
              Une Femme
            </button>
            <button
              type="button"
              onClick={() => setTargetGender("M")}
              style={{
                padding: "8px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: targetGender === "M" ? "rgba(82, 183, 136, 0.25)" : "transparent",
                color: targetGender === "M" ? "#52b788" : "#94a39b",
                fontWeight: targetGender === "M" ? 800 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.85rem",
              }}
            >
              Un Homme
            </button>
          </div>
        </div>

        {/* Âge */}
        <div>
          <label style={{ display: "block", fontSize: "0.78rem", color: "#c7cfcb", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginBottom: "6px" }}>
            Tranche d'âge
          </label>
          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              backgroundColor: "rgba(7, 13, 9, 0.8)",
              border: "1px solid rgba(212, 163, 115, 0.25)",
              borderRadius: "12px",
              color: "#fbfbfb",
              fontWeight: 600,
              fontSize: "0.9rem",
              outline: "none",
            }}
          >
            <option value="20-25">20 à 25 ans</option>
            <option value="24-34">24 à 34 ans (Idéal)</option>
            <option value="33-42">33 à 42 ans</option>
            <option value="40-55">40 à 55 ans et plus</option>
          </select>
        </div>

        {/* Localisation */}
        <div>
          <label style={{ display: "block", fontSize: "0.78rem", color: "#c7cfcb", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginBottom: "6px" }}>
            Localisation
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              backgroundColor: "rgba(7, 13, 9, 0.8)",
              border: "1px solid rgba(212, 163, 115, 0.25)",
              borderRadius: "12px",
              color: "#fbfbfb",
              fontWeight: 600,
              fontSize: "0.9rem",
              outline: "none",
            }}
          >
            <option value="ALL">🌍 Tout pays & Diaspora</option>
            <option value="CM">🇨🇲 Cameroun</option>
            <option value="CI">🇨🇮 Côte d'Ivoire</option>
            <option value="BJ">🇧🇯 Bénin</option>
            <option value="SN">🇸🇳 Sénégal</option>
            <option value="DIASPORA">✈️ Diaspora</option>
          </select>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(212, 163, 115, 0.15)" }}>
        <div style={{ fontSize: "0.85rem", color: "#94a39b" }}>
          Confidentialité totale • Profils 100% majeurs vérifiés
        </div>

        <Link
          href={`/register?target=${targetGender}&age=${ageRange}&country=${country}`}
          style={{
            background: "linear-gradient(135deg, #f4c07c 0%, #d4a373 50%, #e07a5f 100%)",
            color: "#070d09",
            fontWeight: 800,
            fontSize: "0.95rem",
            padding: "12px 24px",
            borderRadius: "999px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 20px rgba(212, 163, 115, 0.35)",
            transition: "all 0.2s ease",
            justifyContent: "center",
          }}
        >
          <Search size={18} /> Voir les profils compatibles
        </Link>
      </div>
    </div>
  );
}
