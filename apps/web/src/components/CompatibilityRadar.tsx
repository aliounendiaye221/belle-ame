"use client";

import React from "react";
import { Sparkles, Heart, Compass, BookOpen } from "lucide-react";

interface PillarScore {
  label: string;
  score: number; // 0-100
  icon: React.ReactNode;
  color: string;
}

interface CompatibilityRadarProps {
  overallScore: number;
  pillars?: PillarScore[];
}

export default function CompatibilityRadar({
  overallScore,
  pillars = [
    { label: "Foi & Spiritualité", score: 95, icon: <Compass size={14} />, color: "#52b788" },
    { label: "Projet Famille & Mariage", score: 92, icon: <Heart size={14} />, color: "#f4a261" },
    { label: "Ambition & Éducation", score: 88, icon: <BookOpen size={14} />, color: "#d4a373" },
    { label: "Valeurs Ancestrales & Diaspora", score: 90, icon: <Sparkles size={14} />, color: "#74c69d" },
  ],
}: CompatibilityRadarProps) {
  // SVG circular gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div
      style={{
        background: "rgba(11, 21, 16, 0.9)",
        border: "1px solid rgba(212, 163, 115, 0.25)",
        borderRadius: "20px",
        padding: "1.25rem",
        backdropFilter: "blur(14px)",
      }}
    >
      {/* Header with circular animated score */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#d4a373", fontWeight: "700" }}>
            Indice de Jaccard Déterministe
          </div>
          <div style={{ fontSize: "1rem", fontWeight: "800", color: "#fbfbfb", marginTop: "2px" }}>
            Affinité Sacrée Recommandée
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div style={{ position: "relative", width: "90px", height: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#goldGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f4c07c" />
                <stop offset="100%" stopColor="#e07a5f" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", textAlign: "center" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: "900", color: "#f4c07c", lineHeight: 1 }}>
              {overallScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            style={{
              padding: "0.75rem",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(212, 163, 115, 0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ color: pillar.color, display: "flex" }}>{pillar.icon}</span>
              <span style={{ fontSize: "0.72rem", color: "#c7cfcb", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {pillar.label}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: "4px", borderRadius: "999px", backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
                <div
                  style={{
                    width: `${pillar.score}%`,
                    height: "100%",
                    borderRadius: "999px",
                    backgroundColor: pillar.color,
                    boxShadow: `0 0 8px ${pillar.color}80`,
                  }}
                />
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: "800", color: pillar.color }}>
                {pillar.score}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
