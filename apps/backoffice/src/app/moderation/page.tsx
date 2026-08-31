"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2, Ban, EyeOff, Bell, Flag, MessageSquare } from "lucide-react";

import { UserButton } from "@/lib/clerk-admin";

interface ReportItem {
  id: string;
  reportedUser: string;
  reporterUser: string;
  reason: string;
  flaggedContent: string;
  slaRemainingHours: number;
  severity: string;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: "rep-801",
      reportedUser: "Désiré M. (usr-cam-102)",
      reporterUser: "Aminata N. (usr-cam-991)",
      reason: "SUSPICION_BROUTAGE_FINANCIER",
      flaggedContent: "Peux-tu m'envoyer 25 000 FCFA par Orange Money d'urgence ?",
      slaRemainingHours: 4,
      severity: "CRITICAL"
    },
    {
      id: "rep-802",
      reportedUser: "Fabrice K. (usr-ci-440)",
      reporterUser: "Marie-Joséphine (usr-ci-881)",
      reason: "PROPOS_INAPPROPRIES",
      flaggedContent: "Comportement irrespectueux et insistances téléphoniques.",
      slaRemainingHours: 14,
      severity: "MEDIUM"
    }
  ]);

  const [selectedReportId, setSelectedReportId] = useState("rep-801");
  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleApplySanction = (sanctionType: string) => {
    alert(`Sanction [${sanctionType}] appliquée avec succès. L'action est enregistrée de manière immuable dans le journal d'audit.`);
    const remaining = reports.filter((r) => r.id !== selectedReportId);
    setReports(remaining);
    if (remaining.length > 0) setSelectedReportId(remaining[0]!.id);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Admin Navbar */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Modération & Respect du SLA &lt; 24h</div>
            <div style={{ fontSize: "0.7rem", color: "#e63946", fontWeight: "600" }}>🚨 Traitement prioritaire des signalements</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Dashboard</Link>
            <Link href="/kyc" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>File KYC</Link>
            <Link href="/moderation" style={{ color: "#d4a373", fontWeight: "700", textDecoration: "none", borderBottom: "2px solid #d4a373", paddingBottom: "0.25rem", fontSize: "0.9rem" }}>Modération SLA ({reports.length})</Link>
            <Link href="/users" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Utilisateurs</Link>
            <Link href="/audit" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Piste d&apos;Audit</Link>
            <Link href="/growth" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>WhatsApp Growth</Link>
            <Link href="/settings" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>⚙️</Link>
          </nav>
          <UserButton />
        </div>
      </header>

      <main style={{ flex: 1, padding: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        
        {/* Queue List */}
        <div style={{ width: "340px", backgroundColor: "#14231a", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#e63946", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Flag size={18} /> Signalements SLA &lt; 24h ({reports.length})
          </h3>

          {reports.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedReportId(item.id)}
              style={{
                backgroundColor: selectedReportId === item.id ? "rgba(230, 57, 70, 0.15)" : "#081c15",
                border: selectedReportId === item.id ? "1px solid #e63946" : "1px solid rgba(212, 163, 115, 0.15)",
                borderRadius: "14px",
                padding: "1rem",
                cursor: "pointer"
              }}
            >
              <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>{item.reportedUser}</div>
              <div style={{ fontSize: "0.8rem", color: "#e63946", fontWeight: "600", marginBottom: "0.5rem" }}>Motif: {item.reason}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                <span style={{ backgroundColor: "rgba(230, 57, 70, 0.2)", color: "#ffb703", padding: "0.2rem 0.5rem", borderRadius: "10px", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                  <Clock size={12} /> Expiration SLA: {item.slaRemainingHours}h restant
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Inspection & 9 Graduated Sanctions */}
        {selectedReport && (
          <div style={{ flex: 1, backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", paddingBottom: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "0.25rem", color: "#e63946" }}>
                  Signalement {selectedReport.id} — {selectedReport.reason}
                </h2>
                <div style={{ fontSize: "0.85rem", color: "#a0aba4" }}>
                  Utilisateur mis en cause : <strong>{selectedReport.reportedUser}</strong> | Déclaré par : {selectedReport.reporterUser}
                </div>
              </div>
            </div>

            {/* Flagged Content Box */}
            <div style={{ backgroundColor: "#081c15", borderRadius: "16px", padding: "1.25rem", border: "1px solid rgba(230, 57, 70, 0.3)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#e63946", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <AlertTriangle size={16} /> Contenu de la conversation ayant déclenché l'alerte lexicale :
              </div>
              <blockquote style={{ fontSize: "1rem", fontStyle: "italic", color: "#fff", margin: 0, paddingLeft: "1rem", borderLeft: "3px solid #e63946" }}>
                "{selectedReport.flaggedContent}"
              </blockquote>
            </div>

            {/* 9 Graduated Sanctions Panel */}
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#d4a373", marginBottom: "1rem" }}>
                Panneau des 9 Actions Graduées de Sanction (Conformité SLA)
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {[
                  { name: "AVERTISSEMENT", label: "1. Avertissement officiel", color: "#ffb703" },
                  { name: "SUSPENSION_7D", label: "2. Suspension temporaire 7j", color: "#fb8500" },
                  { name: "SUSPENSION_30D", label: "3. Suspension temporaire 30j", color: "#fb8500" },
                  { name: "SHADOWBAN", label: "4. Shadowban (Masquage)", color: "#d4a373" },
                  { name: "BAN_PERMANENT", label: "5. Bannissement permanent", color: "#e63946" },
                  { name: "REVOKE_KYC", label: "6. Révocation badge KYC", color: "#e63946" },
                  { name: "FORCE_LOGOUT", label: "7. Révocation sessions", color: "#d4a373" },
                  { name: "RESTRICT_MESSAGES", label: "8. Restriction de messagerie", color: "#fb8500" },
                  { name: "DISMISS_REPORT", label: "9. Classer sans suite (Innocent)", color: "#52b788" }
                ].map((sanc) => (
                  <button
                    key={sanc.name}
                    onClick={() => handleApplySanction(sanc.name)}
                    style={{
                      backgroundColor: "#081c15",
                      border: `1px solid ${sanc.color}`,
                      color: sanc.color,
                      padding: "0.85rem 1rem",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "transform 0.15s ease"
                    }}
                  >
                    {sanc.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
