"use client";

import React from "react";
import { UserCheck, ShieldCheck, HeartHandshake, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface StepItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  highlight: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Inscription Sélective",
    subtitle: "5 minutes chrono",
    description:
      "Renseignez votre vision du couple, votre démarche de foi, vos valeurs familiales et vos centres d'intérêt profonds. Zéro superflu.",
    icon: <UserCheck size={28} color="#f4c07c" />,
    highlight: "Profil confidentiel & protégé",
  },
  {
    number: "02",
    title: "Certification d'Honneur",
    subtitle: "Validation humaine sous 24h",
    description:
      "Vérification rigoureuse de la pièce d'identité officielle (CNI, Passeport). Bannissement instantané des faux profils et des mineurs.",
    icon: <ShieldCheck size={28} color="#52b788" />,
    highlight: "Sanctuaire 100% sans arnaque",
  },
  {
    number: "03",
    title: "Consentement Bilatéral",
    subtitle: "Radar d'Affinités Jaccard",
    description:
      "La messagerie ne s'ouvre que si les deux personnes expriment un intérêt mutuel. Vous ne recevrez jamais de messages importuns.",
    icon: <HeartHandshake size={28} color="#e07a5f" />,
    highlight: "Respect strict de votre pudeur",
  },
  {
    number: "04",
    title: "L'Alliance d'Honneur",
    subtitle: "Du virtuel au mariage béni",
    description:
      "Échangez, découvrez vos familles selon nos traditions et construisez une union solide, digne et durable dans la bénédiction divine.",
    icon: <Sparkles size={28} color="#f4c07c" />,
    highlight: "Bénédiction des familles",
  },
];

export default function FourStepsJourney() {
  return (
    <section style={{ padding: "5rem 2rem", maxWidth: "1240px", margin: "0 auto", width: "100%" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
        <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)", fontWeight: 800, letterSpacing: "-0.5px", color: "#fbfbfb" }}>
          De l'Inscription à l'Alliance Bénie
        </h2>
        <p style={{ color: "#c7cfcb", fontSize: "1.05rem", maxWidth: "680px", margin: "10px auto 0", lineHeight: "1.6" }}>
          Une démarche noble et sans détour. Fini les discussions sans lendemain : chaque étape a été conçue pour protéger votre cœur et honorer votre temps.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          position: "relative",
        }}
      >
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            style={{
              background: "linear-gradient(145deg, rgba(16, 32, 23, 0.8), rgba(7, 13, 9, 0.95))",
              border: "1px solid rgba(212, 163, 115, 0.2)",
              borderRadius: "20px",
              padding: "2rem 1.5rem",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "rgba(212, 163, 115, 0.5)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 163, 115, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(212, 163, 115, 0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Step Giant Number Watermark */}
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
              {step.number}
            </div>

            {/* Icon Bubble */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "rgba(212, 163, 115, 0.12)",
                border: "1px solid rgba(212, 163, 115, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              {step.icon}
            </div>

            {/* Step Titles */}
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#f4c07c", fontWeight: 800 }}>
                {step.subtitle}
              </span>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fbfbfb", marginTop: "4px" }}>
                {step.title}
              </h3>
            </div>

            {/* Description */}
            <p style={{ color: "#c7cfcb", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
              {step.description}
            </p>

            {/* Bottom Highlight Tag */}
            <div
              style={{
                paddingTop: "0.75rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "0.8rem",
                color: "#52b788",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              ✓ {step.highlight}
            </div>
          </div>
        ))}
      </div>

      {/* Mid CTA Link */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Link
          href="/register"
          style={{
            background: "linear-gradient(135deg, #f4c07c, #d4a373)",
            color: "#070d09",
            fontWeight: 800,
            padding: "14px 34px",
            borderRadius: "999px",
            textDecoration: "none",
            fontSize: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 20px rgba(212, 163, 115, 0.35)",
            transition: "all 0.2s ease",
          }}
        >
          Commencer mon parcours d'honneur <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
