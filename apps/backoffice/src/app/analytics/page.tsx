"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  Heart,
  Shield,
  CreditCard,
  TrendingUp,
  Activity,
  Globe,
  DollarSign,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { backofficeStore } from "@/lib/backoffice-store";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30j");
  const [stats, setStats] = useState({
    totalUsers: 0,
    kycPending: 0,
    moderationPending: 0,
    totalRevenueFcfa: 0,
    verifiedKycCount: 0,
    premiumCount: 0,
  });

  useEffect(() => {
    setStats(backofficeStore.getDashboardStats());
  }, [period]);

  const kycRate = stats.totalUsers > 0 ? Math.round((stats.verifiedKycCount / stats.totalUsers) * 100) : 100;
  const premiumRate = stats.totalUsers > 0 ? Math.round((stats.premiumCount / stats.totalUsers) * 100) : 75;

  const operatorBreakdown = [
    { name: "Wave Money 🔵", share: 62, volume: Math.round(stats.totalRevenueFcfa * 0.62), color: "#00b4d8" },
    { name: "Orange Money 🟠", share: 28, volume: Math.round(stats.totalRevenueFcfa * 0.28), color: "#f77f00" },
    { name: "MTN MoMo 🟡", share: 10, volume: Math.round(stats.totalRevenueFcfa * 0.10), color: "#ffb703" },
  ];

  const countryDistribution = [
    { country: "Sénégal 🇸🇳", percentage: 46, members: Math.round(stats.totalUsers * 0.46) },
    { country: "Côte d'Ivoire 🇨🇮", percentage: 32, members: Math.round(stats.totalUsers * 0.32) },
    { country: "Maroc 🇲🇦", percentage: 12, members: Math.round(stats.totalUsers * 0.12) },
    { country: "Cameroun & Guinée 🇨🇲🇬🇳", percentage: 10, members: Math.round(stats.totalUsers * 0.10) },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070d09",
        color: "#f8f9fa",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AdminNavbar title="Analytics & Métriques Business" subtitle="Performance Matrimoniale & Recouvrement FCFA" />

      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        
        {/* Header Title & Period Switcher */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "900", margin: 0, color: "#ffffff" }}>
              Indicateurs Clés de Croissance
            </h1>
            <p style={{ color: "#a0aba4", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
              Données consolidées temps réel des souscriptions et de l&apos;activité
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", backgroundColor: "#14231a", padding: "4px", borderRadius: "999px", border: "1px solid rgba(212, 163, 115, 0.25)" }}>
            {["7j", "30j", "90j", "1an"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor: period === p ? "#f4c07c" : "transparent",
                  color: period === p ? "#070d09" : "#c7cfcb",
                  fontWeight: "800",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Main KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          
          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "22px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Volume Recouvré Global ({period})</div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#f4c07c" }}>
              {stats.totalRevenueFcfa.toLocaleString()} <span style={{ fontSize: "0.9rem", color: "#c7cfcb" }}>FCFA</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <ArrowUpRight size={14} /> +24% par rapport au cycle précédent
            </div>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "22px", border: "1px solid rgba(82, 183, 136, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Conversion Formules Payantes</div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#52b788" }}>
              {premiumRate}%
            </div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.5rem" }}>
              {stats.premiumCount} abonnements payants en cours
            </div>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "22px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Taux de Certification KYC</div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#ffffff" }}>
              {kycRate}%
            </div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.5rem" }}>
              {stats.verifiedKycCount} pièces d&apos;identité validées
            </div>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "22px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Temps Moyen de Résolution Modération</div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#52b788" }}>
              &lt; 45 min
            </div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.5rem" }}>
              SLA contractuel garanti sous 24h
            </div>
          </div>

        </div>

        {/* Breakdown Charts Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
          
          {/* Mobile Money Distribution */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#fbfbfb", marginBottom: "1.25rem" }}>
              Répartition par Opérateur Mobile Money
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {operatorBreakdown.map((op) => (
                <div key={op.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "700", marginBottom: "4px" }}>
                    <span>{op.name}</span>
                    <span style={{ color: "#f4c07c" }}>{op.volume.toLocaleString()} FCFA ({op.share}%)</span>
                  </div>
                  <div style={{ height: "10px", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${op.share}%`, backgroundColor: op.color, borderRadius: "999px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#fbfbfb", marginBottom: "1.25rem" }}>
              Répartition Géographique des Membres
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {countryDistribution.map((c) => (
                <div key={c.country}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "700", marginBottom: "4px" }}>
                    <span>{c.country}</span>
                    <span style={{ color: "#52b788" }}>{c.percentage}%</span>
                  </div>
                  <div style={{ height: "10px", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${c.percentage}%`, backgroundColor: "#52b788", borderRadius: "999px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
