"use client";

import React from "react";
import Link from "next/link";
import { UserCheck, ShieldCheck, HeartHandshake, Sparkles, ArrowRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Inscription Sélective",
    badge: "5 minutes chrono",
    desc: "Définissez votre vision du couple, votre démarche spirituelle, vos valeurs familiales et votre projet de vie. Zéro superflu.",
    icon: UserCheck,
    color: "#f4c07c",
    check: "Profil confidentiel & sécurisé",
  },
  {
    num: "02",
    title: "Certification d'Honneur",
    badge: "Validation humaine sous 24h",
    desc: "Vérification rigoureuse de la pièce d'identité officielle (CNI, Passeport). Exclusion immédiate des faux profils et des mineurs.",
    icon: ShieldCheck,
    color: "#52b788",
    check: "Sanctuaire 100% vérifié",
  },
  {
    num: "03",
    title: "Consentement Mutuel",
    badge: "Respect & Pudeur",
    desc: "La mise en relation ne s'effectue que si les deux personnes confirment un intérêt réciproque. Zéro message importun.",
    icon: HeartHandshake,
    color: "#e07a5f",
    check: "Aucun harcèlement possible",
  },
  {
    num: "04",
    title: "L'Alliance d'Honneur",
    badge: "Du virtuel au mariage béni",
    desc: "Échangez avec bienveillance, organisez les présentations selon nos traditions et cheminez vers une union durable et digne.",
    icon: Sparkles,
    color: "#f4c07c",
    check: "Bénédiction des familles",
  },
];

export default function FourStepsJourney() {
  return (
    <section className="section-container" style={{ padding: "4.5rem 2rem", maxWidth: "1240px", margin: "0 auto", width: "100%" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.78rem",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "#f4c07c",
            fontWeight: 800,
            backgroundColor: "rgba(212, 163, 115, 0.12)",
            padding: "5px 14px",
            borderRadius: "999px",
            border: "1px solid rgba(212, 163, 115, 0.25)",
            marginBottom: "12px",
          }}
        >
          ✦ Le Parcours Sacré ✦
        </span>
        <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.5px", color: "#fbfbfb" }}>
          De l'Inscription à l'Alliance Bénie
        </h2>
        <p style={{ color: "#c7cfcb", fontSize: "1rem", maxWidth: "620px", margin: "10px auto 0", lineHeight: "1.6" }}>
          Une démarche noble et sans détour : chaque étape protège votre intimité et honore votre temps.
        </p>
      </div>

      {/* Grid of Steps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              style={{
                background: "linear-gradient(145deg, rgba(16, 32, 23, 0.8), rgba(7, 13, 9, 0.95))",
                border: "1px solid rgba(212, 163, 115, 0.2)",
                borderRadius: "20px",
                padding: "2rem 1.5rem",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s ease, border-color 0.3s ease",
              }}
            >
              {/* Giant watermark number */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "3.2rem",
                  fontWeight: 900,
                  color: "rgba(212, 163, 115, 0.08)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(212, 163, 115, 0.12)",
                  border: "1px solid rgba(212, 163, 115, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <Icon size={26} color={step.color} />
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#f4c07c", fontWeight: 800 }}>
                  {step.badge}
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fbfbfb", marginTop: "4px" }}>
                  {step.title}
                </h3>
              </div>

              <p style={{ color: "#c7cfcb", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
                {step.desc}
              </p>

              <div style={{ paddingTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "0.8rem", color: "#52b788", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px" }}>
                ✓ {step.check}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <Link
          href="/register"
          style={{
            background: "linear-gradient(135deg, #f4c07c, #d4a373)",
            color: "#070d09",
            fontWeight: 800,
            padding: "13px 32px",
            borderRadius: "999px",
            textDecoration: "none",
            fontSize: "0.98rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 20px rgba(212, 163, 115, 0.35)",
            transition: "all 0.2s ease",
          }}
        >
          Commencer mon parcours d&apos;honneur <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
