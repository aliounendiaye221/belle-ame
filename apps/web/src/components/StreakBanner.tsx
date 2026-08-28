"use client";

import React, { useState, useEffect } from "react";
import { Flame, Clock, Gift, ShieldAlert, Sparkles, ChevronRight, X } from "lucide-react";
import Link from "next/link";

interface StreakBannerProps {
  streakDays?: number;
  quotaRemaining?: number;
  maxQuota?: number;
  isPremium?: boolean;
}

export default function StreakBanner({
  streakDays = 4,
  quotaRemaining = 8,
  maxQuota = 10,
  isPremium = false,
}: StreakBannerProps) {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState("05:42:19");

  // Simulated countdown timer until daily quota reset (Midnight Douala / GMT+1)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);
      const diffMs = nextMidnight.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          backgroundColor: "#102017",
          padding: "0.85rem 1.25rem",
          borderRadius: "20px",
          border: "1px solid rgba(212, 163, 115, 0.25)",
          marginBottom: "1.25rem",
          boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.5)",
          flexWrap: "wrap",
        }}
      >
        {/* Left: Streak Pill */}
        <div
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor: "rgba(224, 122, 95, 0.15)",
            border: "1px solid rgba(224, 122, 95, 0.4)",
          }}
        >
          <span className="animate-flame" style={{ display: "flex", fontSize: "1.1rem" }}>
            🔥
          </span>
          <span style={{ fontSize: "0.82rem", fontWeight: "800", color: "#f4a261" }}>
            {streakDays} Jours de Flamme
          </span>
          <ChevronRight size={14} color="#f4a261" />
        </div>

        {/* Center: Quota & Reset Counter */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.82rem" }}>
          <div style={{ color: "#c7cfcb" }}>
            Quota du jour :{" "}
            <strong style={{ color: quotaRemaining > 2 ? "#52b788" : "#e63946" }}>
              {quotaRemaining} / {maxQuota}
            </strong>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#d4a373",
              fontWeight: "600",
              fontSize: "0.75rem",
              backgroundColor: "rgba(212, 163, 115, 0.1)",
              padding: "2px 8px",
              borderRadius: "999px",
            }}
          >
            <Clock size={12} /> {timeLeft}
          </div>
        </div>

        {/* Right: Privilege Upgrade CTA */}
        {!isPremium && (
          <Link
            href="/subscription"
            style={{
              fontSize: "0.78rem",
              fontWeight: "800",
              color: "#070d09",
              background: "linear-gradient(135deg, #f4c07c, #d4a373)",
              padding: "6px 14px",
              borderRadius: "999px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 10px rgba(212, 163, 115, 0.35)",
            }}
          >
            <Sparkles size={13} /> 50 profils/j
          </Link>
        )}
      </div>

      {/* Streak Details Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(7, 13, 9, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "420px",
              width: "100%",
              backgroundColor: "#102017",
              border: "1px solid rgba(244, 192, 124, 0.4)",
              borderRadius: "28px",
              padding: "2rem",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 163, 115, 0.2)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "#8a968f",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }} className="animate-flame">
              🔥
            </div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.5rem" }}>
              Votre Flamme d&apos;Âme est Active !
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#c7cfcb", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              Revenez chaque jour sur la plateforme pour alimenter votre flamme et débloquer des privilèges réservés aux membres assidus.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "1.5rem" }}>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isCompleted = day <= streakDays;
                const isCurrent = day === streakDays;
                return (
                  <div
                    key={day}
                    style={{
                      width: "42px",
                      height: "56px",
                      borderRadius: "12px",
                      backgroundColor: isCompleted ? "rgba(224, 122, 95, 0.2)" : "rgba(255, 255, 255, 0.03)",
                      border: isCurrent
                        ? "2px solid #f4a261"
                        : isCompleted
                        ? "1px solid rgba(224, 122, 95, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ fontSize: "0.65rem", color: isCompleted ? "#f4a261" : "#8a968f", fontWeight: "700" }}>
                      J{day}
                    </span>
                    <span style={{ fontSize: "1rem" }}>{isCompleted ? "🔥" : "🔒"}</span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                backgroundColor: "rgba(82, 183, 136, 0.12)",
                border: "1px solid rgba(82, 183, 136, 0.3)",
                padding: "0.85rem",
                borderRadius: "14px",
                fontSize: "0.8rem",
                color: "#52b788",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <Gift size={16} /> Bonus actif : +25% de mise en avant dans l&apos;algorithme !
            </div>
          </div>
        </div>
      )}
    </>
  );
}
