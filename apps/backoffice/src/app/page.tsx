"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Flag,
  FileText,
  TrendingUp,
  CreditCard,
  Clock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Activity,
  CheckCircle2,
  RefreshCw,
  Eye,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { backofficeStore } from "@/lib/backoffice-store";

export default function BackofficeDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    kycPending: 0,
    moderationPending: 0,
    totalRevenueFcfa: 0,
    verifiedKycCount: 0,
    premiumCount: 0,
  });

  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const loadData = () => {
    const s = backofficeStore.getDashboardStats();
    setStats(s);
    setRecentLogs(backofficeStore.getAuditLogs().slice(0, 6));
  };

  useEffect(() => {
    loadData();
  }, []);

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
      <AdminNavbar title="Tableau de Bord Super Admin" subtitle="« À Chacun Une Belle Âme » Production" />

      <main className="admin-container" style={{ flex: 1 }}>
        
        {/* Top Header with Quick Refresh */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#52b788", boxShadow: "0 0 10px #52b788" }} />
              <span style={{ fontSize: "0.8rem", color: "#52b788", fontWeight: "800", textTransform: "uppercase" }}>
                Serveurs &amp; Passerelles Mobile Money Opérationnels
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: "900", margin: 0, color: "#ffffff" }}>
              Console de Pilotage &amp; Modération
            </h1>
          </div>

          <button
            type="button"
            onClick={loadData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              backgroundColor: "rgba(244, 192, 124, 0.12)",
              border: "1px solid rgba(244, 192, 124, 0.35)",
              borderRadius: "14px",
              color: "#f4c07c",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={15} /> Actualiser les Métriques
          </button>
        </div>

        {/* 4 KPI Main Cards */}
        <div className="admin-kpi-grid">
          
          {/* Card 1 : Utilisateurs Réels */}
          <Link
            href="/users"
            style={{
              textDecoration: "none",
              backgroundColor: "#14231a",
              padding: "1.5rem",
              borderRadius: "22px",
              border: "1px solid rgba(212, 163, 115, 0.22)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#a0aba4", fontWeight: "700" }}>Membres Enregistrés</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(82, 183, 136, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#52b788" }}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2.4rem", fontWeight: "900", color: "#ffffff", lineHeight: 1 }}>
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#52b788", marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 size={13} /> {stats.premiumCount} abonnements actifs
            </div>
          </Link>

          {/* Card 2 : File KYC */}
          <Link
            href="/kyc"
            style={{
              textDecoration: "none",
              backgroundColor: stats.kycPending > 0 ? "rgba(244, 192, 124, 0.08)" : "#14231a",
              padding: "1.5rem",
              borderRadius: "22px",
              border: stats.kycPending > 0 ? "1.5px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.22)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#f4c07c", fontWeight: "700" }}>File d&apos;Attente KYC</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(244, 192, 124, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f4c07c" }}>
                <ShieldCheck size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2.4rem", fontWeight: "900", color: "#f4c07c", lineHeight: 1 }}>
              {stats.kycPending}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#d4a373", marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
              {stats.kycPending > 0 ? "⚠️ Pièces d'identité à valider" : "✅ File 100% à jour"}
            </div>
          </Link>

          {/* Card 3 : Signalements Modération SLA */}
          <Link
            href="/moderation"
            style={{
              textDecoration: "none",
              backgroundColor: stats.moderationPending > 0 ? "rgba(230, 57, 70, 0.08)" : "#14231a",
              padding: "1.5rem",
              borderRadius: "22px",
              border: stats.moderationPending > 0 ? "1.5px solid #e63946" : "1px solid rgba(230, 57, 70, 0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#ff858d", fontWeight: "700" }}>Modération SLA &lt; 24h</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(230, 57, 70, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff858d" }}>
                <Flag size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2.4rem", fontWeight: "900", color: stats.moderationPending > 0 ? "#ff858d" : "#52b788", lineHeight: 1 }}>
              {stats.moderationPending}
            </div>
            <div style={{ fontSize: "0.78rem", color: stats.moderationPending > 0 ? "#ff858d" : "#52b788", marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={13} /> {stats.moderationPending > 0 ? "Traitement requis sous SLA" : "Zéro incident signalé"}
            </div>
          </Link>

          {/* Card 4 : Revenu Mobile Money FCFA */}
          <Link
            href="/analytics"
            style={{
              textDecoration: "none",
              backgroundColor: "#14231a",
              padding: "1.5rem",
              borderRadius: "22px",
              border: "1px solid rgba(212, 163, 115, 0.22)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#a0aba4", fontWeight: "700" }}>Volume Recouvré FCFA</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(212, 163, 115, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f4c07c" }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2.1rem", fontWeight: "900", color: "#ffffff", lineHeight: 1 }}>
              {stats.totalRevenueFcfa.toLocaleString()} <span style={{ fontSize: "1rem", color: "#d4a373" }}>FCFA</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#52b788", marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={13} /> Wave, Orange Money &amp; MTN MoMo
            </div>
          </Link>

        </div>

        {/* Action Modules Direct Grid */}
        <h2 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1rem", color: "#ffffff" }}>
          Accès Direct aux Modules Opérationnels
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          
          <Link
            href="/kyc"
            style={{
              textDecoration: "none",
              backgroundColor: "#14231a",
              padding: "1.5rem",
              borderRadius: "20px",
              border: "1px solid rgba(212, 163, 115, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "background-color 0.2s ease",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "rgba(244, 192, 124, 0.15)", color: "#f4c07c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShieldCheck size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "800", fontSize: "1rem", color: "#ffffff" }}>File d&apos;Attente KYC 18+</div>
              <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginTop: "2px" }}>
                Inspection CNI, Passeports &amp; Comparaison Faciale
              </div>
            </div>
            <ArrowRight size={18} color="#d4a373" />
          </Link>

          <Link
            href="/moderation"
            style={{
              textDecoration: "none",
              backgroundColor: "#14231a",
              padding: "1.5rem",
              borderRadius: "20px",
              border: "1px solid rgba(230, 57, 70, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "background-color 0.2s ease",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "rgba(230, 57, 70, 0.15)", color: "#ff858d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Flag size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "800", fontSize: "1rem", color: "#ffffff" }}>File de Modération SLA</div>
              <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginTop: "2px" }}>
                Anti-Broutage &amp; 9 Sanctions Graduées
              </div>
            </div>
            <ArrowRight size={18} color="#e63946" />
          </Link>

          <Link
            href="/users"
            style={{
              textDecoration: "none",
              backgroundColor: "#14231a",
              padding: "1.5rem",
              borderRadius: "20px",
              border: "1px solid rgba(82, 183, 136, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "background-color 0.2s ease",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "rgba(82, 183, 136, 0.15)", color: "#52b788", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Users size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "800", fontSize: "1rem", color: "#ffffff" }}>Répertoire des Membres</div>
              <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginTop: "2px" }}>
                Statuts, Rôles, Tiers &amp; Suspension
              </div>
            </div>
            <ArrowRight size={18} color="#52b788" />
          </Link>

          <Link
            href="/audit"
            style={{
              textDecoration: "none",
              backgroundColor: "#14231a",
              padding: "1.5rem",
              borderRadius: "20px",
              border: "1px solid rgba(212, 163, 115, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "background-color 0.2s ease",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "rgba(212, 163, 115, 0.15)", color: "#f4c07c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "800", fontSize: "1rem", color: "#ffffff" }}>Piste d&apos;Audit Immuable</div>
              <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginTop: "2px" }}>
                Journalisation légale &amp; Export JSON/CSV
              </div>
            </div>
            <ArrowRight size={18} color="#d4a373" />
          </Link>

        </div>

        {/* Live Audit Trail Section */}
        <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.18)", padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", margin: 0, color: "#ffffff" }}>
                Derniers Événements Sécurité &amp; Plateforme
              </h3>
              <div style={{ fontSize: "0.78rem", color: "#a0aba4", marginTop: "2px" }}>
                Flux en direct des validations, paiements et modérations
              </div>
            </div>

            <Link
              href="/audit"
              style={{
                fontSize: "0.82rem",
                color: "#f4c07c",
                fontWeight: "700",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Voir l&apos;intégralité du journal <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        backgroundColor: log.action.includes("APPROVED")
                          ? "rgba(82, 183, 136, 0.2)"
                          : log.action.includes("REJECT") || log.action.includes("SANCTION")
                          ? "rgba(230, 57, 70, 0.2)"
                          : "rgba(244, 192, 124, 0.2)",
                        color: log.action.includes("APPROVED")
                          ? "#52b788"
                          : log.action.includes("REJECT") || log.action.includes("SANCTION")
                          ? "#ff858d"
                          : "#f4c07c",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        fontSize: "0.72rem",
                        fontWeight: "800",
                      }}
                    >
                      {log.action}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff" }}>
                      {log.targetUser}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginTop: "4px" }}>
                    {log.details}
                  </div>
                </div>

                <div style={{ fontSize: "0.75rem", color: "#6b7a72", textAlign: "right" }}>
                  {new Date(log.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
