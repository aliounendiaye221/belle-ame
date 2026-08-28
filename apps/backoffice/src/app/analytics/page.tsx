"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BarChart3, Users, Heart, Shield, CreditCard, TrendingUp, TrendingDown, Activity, Globe, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30j");

  const metrics: MetricCard[] = [
    { label: "Utilisateurs Actifs", value: "8 742", change: "+12.3%", trend: "up", icon: <Users size={20} />, color: "#52b788" },
    { label: "Matchs Mutuels", value: "1 284", change: "+8.7%", trend: "up", icon: <Heart size={20} />, color: "#e07a5f" },
    { label: "Taux de Conversion Premium", value: "14.2%", change: "+2.1%", trend: "up", icon: <CreditCard size={20} />, color: "#d4a373" },
    { label: "Signalements Actifs", value: "23", change: "-18%", trend: "down", icon: <Shield size={20} />, color: "#f4a261" },
    { label: "Revenus MRR (FCFA)", value: "6 180 000", change: "+22.4%", trend: "up", icon: <TrendingUp size={20} />, color: "#52b788" },
    { label: "Temps Modération Moyen", value: "4.2h", change: "-32%", trend: "down", icon: <Activity size={20} />, color: "#52b788" }
  ];

  const countryBreakdown = [
    { country: "Cameroun 🇨🇲", users: 4120, percentage: 47, color: "#52b788" },
    { country: "Côte d'Ivoire 🇨🇮", users: 2180, percentage: 25, color: "#d4a373" },
    { country: "Bénin 🇧🇯", users: 1350, percentage: 15, color: "#e07a5f" },
    { country: "Diaspora 🇫🇷", users: 1092, percentage: 13, color: "#f4a261" }
  ];

  const conversionFunnel = [
    { step: "Inscription SMS", count: 12400, percentage: 100 },
    { step: "OTP Vérifié", count: 11160, percentage: 90 },
    { step: "Onboarding Complété", count: 9300, percentage: 75 },
    { step: "KYC Soumis", count: 8370, percentage: 67 },
    { step: "KYC Approuvé", count: 7905, percentage: 64 },
    { step: "Premier Match", count: 5580, percentage: 45 },
    { step: "Premier Message", count: 4464, percentage: 36 },
    { step: "Abonné Premium", count: 1736, percentage: 14 }
  ];

  const recentActivity = [
    { action: "Nouveau match mutuel", detail: "Aminata ↔ Bertrand (94%)", time: "Il y a 2 min", color: "#e07a5f" },
    { action: "KYC approuvé", detail: "Fabrice K. (usr-ci-440)", time: "Il y a 8 min", color: "#52b788" },
    { action: "Paiement reçu", detail: "5 000 FCFA — MTN MoMo", time: "Il y a 15 min", color: "#d4a373" },
    { action: "Signalement traité", detail: "rep-801 — Sanction Niveau 3", time: "Il y a 22 min", color: "#f4a261" },
    { action: "Nouveau membre", detail: "+237 6XX XXX 890 (Douala)", time: "Il y a 31 min", color: "#52b788" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif" }}>

      {/* Admin Navbar */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>Â</div>
          </Link>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Analytics Dashboard</div>
            <div style={{ fontSize: "0.7rem", color: "#52b788", fontWeight: "600" }}>📊 Vue d&apos;Ensemble Business</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["7j", "30j", "90j", "1an"].map((p: string) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: period === p ? "1px solid #d4a373" : "1px solid rgba(255,255,255,0.1)",
                background: period === p ? "rgba(212, 163, 115, 0.2)" : "transparent",
                color: period === p ? "#d4a373" : "#8a968f",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      <div style={{ padding: "1.5rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>

        {/* Navigation breadcrumb */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { href: "/", label: "Dashboard" },
            { href: "/kyc", label: "KYC" },
            { href: "/moderation", label: "Modération" },
            { href: "/users", label: "Utilisateurs" },
            { href: "/analytics", label: "Analytics" },
            { href: "/growth", label: "Croissance" },
            { href: "/audit", label: "Audit" },
            { href: "/settings", label: "Paramètres" }
          ].map((link: { href: string; label: string }) => (
            <Link key={link.href} href={link.href} style={{
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: "600",
              backgroundColor: link.href === "/analytics" ? "rgba(212, 163, 115, 0.2)" : "rgba(255,255,255,0.03)",
              color: link.href === "/analytics" ? "#d4a373" : "#8a968f",
              border: link.href === "/analytics" ? "1px solid rgba(212, 163, 115, 0.3)" : "1px solid rgba(255,255,255,0.06)"
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* KPI Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {metrics.map((m: MetricCard, idx: number) => (
            <div key={idx} style={{
              padding: "1.25rem",
              borderRadius: "16px",
              background: "rgba(26, 46, 34, 0.5)",
              border: "1px solid rgba(212, 163, 115, 0.1)",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: `${m.color}15`, border: `1px solid ${m.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: m.color }}>
                  {m.icon}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.75rem", fontWeight: "600", color: m.trend === "up" ? "#52b788" : (m.label.includes("Signalements") || m.label.includes("Temps") ? "#52b788" : "#e63946") }}>
                  {m.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {m.change}
                </div>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>{m.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#8a968f", marginTop: "2px" }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>

          {/* Country breakdown */}
          <div style={{ padding: "1.5rem", borderRadius: "18px", background: "rgba(26, 46, 34, 0.4)", border: "1px solid rgba(212, 163, 115, 0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <Globe size={18} style={{ color: "#d4a373" }} />
              <h3 style={{ fontWeight: "700", fontSize: "0.95rem" }}>Répartition par Pays</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {countryBreakdown.map((c, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{c.country}</span>
                    <span style={{ fontSize: "0.8rem", color: "#c2c9c4" }}>{c.users.toLocaleString()} ({c.percentage}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <div style={{ width: `${c.percentage}%`, height: "100%", borderRadius: "999px", backgroundColor: c.color, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion funnel */}
          <div style={{ padding: "1.5rem", borderRadius: "18px", background: "rgba(26, 46, 34, 0.4)", border: "1px solid rgba(212, 163, 115, 0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <TrendingUp size={18} style={{ color: "#52b788" }} />
              <h3 style={{ fontWeight: "700", fontSize: "0.95rem" }}>Tunnel de Conversion</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {conversionFunnel.map((step, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "20px", fontSize: "0.7rem", color: "#8a968f", textAlign: "right", flexShrink: 0 }}>{idx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ width: "100%", height: "24px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.03)", position: "relative", overflow: "hidden" }}>
                      <div style={{
                        width: `${step.percentage}%`,
                        height: "100%",
                        borderRadius: "6px",
                        background: `linear-gradient(90deg, rgba(82, 183, 136, ${0.15 + (step.percentage / 100) * 0.35}), rgba(82, 183, 136, ${0.1 + (step.percentage / 100) * 0.2}))`,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "8px"
                      }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: "600", whiteSpace: "nowrap", color: "#f8f9fa" }}>{step.step}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: "55px", textAlign: "right", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#52b788" }}>{step.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div style={{ padding: "1.5rem", borderRadius: "18px", background: "rgba(26, 46, 34, 0.4)", border: "1px solid rgba(212, 163, 115, 0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <Activity size={18} style={{ color: "#f4a261" }} />
            <h3 style={{ fontWeight: "700", fontSize: "0.95rem" }}>Activité en Temps Réel</h3>
            <div style={{ marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#52b788", boxShadow: "0 0 8px rgba(82, 183, 136, 0.5)", animation: "pulse 2s infinite" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentActivity.map((a, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: a.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{a.action}</span>
                  <span style={{ fontSize: "0.8rem", color: "#c2c9c4", marginLeft: "0.5rem" }}>— {a.detail}</span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#8a968f", whiteSpace: "nowrap" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
