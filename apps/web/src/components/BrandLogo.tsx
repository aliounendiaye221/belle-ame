import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "hero";
  showText?: boolean;
  withLink?: boolean;
}

export default function BrandLogo({
  size = "md",
  showText = true,
  withLink = true,
}: BrandLogoProps) {
  const dimensions = {
    sm: { icon: 34, font: "1rem", sub: "0.65rem", gap: "0.6rem" },
    md: { icon: 42, font: "1.15rem", sub: "0.7rem", gap: "0.75rem" },
    lg: { icon: 54, font: "1.35rem", sub: "0.8rem", gap: "0.9rem" },
    hero: { icon: 72, font: "1.75rem", sub: "0.95rem", gap: "1.1rem" },
  }[size];

  const logoContent = (
    <div style={{ display: "inline-flex", alignItems: "center", gap: dimensions.gap, cursor: withLink ? "pointer" : "default" }}>
      {/* Emblem SVG with glowing gold and emerald heart knot */}
      <div
        style={{
          width: dimensions.icon,
          height: dimensions.icon,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, rgba(244, 192, 124, 0.25) 0%, rgba(16, 32, 23, 0.9) 70%)",
          border: "1.5px solid rgba(244, 192, 124, 0.5)",
          boxShadow: "0 4px 20px rgba(212, 163, 115, 0.35), inset 0 0 12px rgba(82, 183, 136, 0.25)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="82%"
          height="82%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#f4c07c" />
              <stop offset="70%" stopColor="#d4a373" />
              <stop offset="100%" stopColor="#e07a5f" />
            </linearGradient>
            <linearGradient id="emeraldDrop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#74c69d" />
              <stop offset="100%" stopColor="#2d6a4f" />
            </linearGradient>
          </defs>

          {/* Infinity Heart Knot */}
          <path
            d="M50 82 C22 62, 10 44, 18 28 C25 15, 42 16, 50 30 C58 16, 75 15, 82 28 C90 44, 78 62, 50 82 Z"
            stroke="url(#goldSheen)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Letter Â Silhouette inside */}
          <text
            x="50"
            y="59"
            textAnchor="middle"
            fill="url(#goldSheen)"
            fontSize="36"
            fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
            fontWeight="900"
            style={{ letterSpacing: "-1px" }}
          >
            Â
          </text>

          {/* Emerald Jewel Dot (Crowning the Â) */}
          <circle cx="50" cy="23" r="3.5" fill="url(#emeraldDrop)" stroke="#ffffff" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "900",
              fontSize: dimensions.font,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              background: "linear-gradient(135deg, #ffffff 10%, #f4c07c 65%, #d4a373 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            À Chacun Une Belle Âme
          </span>
          <span
            style={{
              fontSize: dimensions.sub,
              color: "#52b788",
              fontWeight: "700",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: "2px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ✦ Mariage &amp; Valeurs Africaines ✦
          </span>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
