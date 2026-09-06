"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Ban,
  EyeOff,
  Bell,
  Flag,
  MessageSquare,
  RefreshCcw,
  Check,
  XCircle,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { backofficeStore, BackofficeModerationTicket } from "@/lib/backoffice-store";

export default function ModerationPage() {
  const [reports, setReports] = useState<BackofficeModerationTicket[]>([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = () => {
    const list = backofficeStore.getModerationTickets();
    setReports(list);
    const pending = list.filter((r) => r.status === "PENDING");
    if (pending.length > 0) {
      setSelectedReportId(pending[0]!.id);
    } else if (list.length > 0) {
      setSelectedReportId(list[0]!.id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingReports = reports.filter((r) => r.status === "PENDING");
  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleApplySanction = (sanction: string) => {
    if (!selectedReport) return;
    backofficeStore.resolveTicket(selectedReport.id, sanction);
    setFeedback(`Action exécutée : [${sanction}] appliquée à ${selectedReport.reportedUserName}. Journalisé.`);
    loadData();
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDismiss = () => {
    if (!selectedReport) return;
    backofficeStore.dismissTicket(selectedReport.id);
    setFeedback(`Signalement #${selectedReport.id} classé sans suite (Faux signalement avéré).`);
    loadData();
    setTimeout(() => setFeedback(null), 3500);
  };

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
      <AdminNavbar title="Modération & Respect du SLA < 24h" subtitle="Traitement Prioritaire des Signalements" />

      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        
        {/* Feedback notification toast */}
        {feedback && (
          <div
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "16px",
              backgroundColor: "rgba(82, 183, 136, 0.15)",
              border: "1px solid #52b788",
              color: "#52b788",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "700",
            }}
          >
            <CheckCircle2 size={18} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Title Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ backgroundColor: pendingReports.length > 0 ? "rgba(230, 57, 70, 0.2)" : "rgba(82, 183, 136, 0.2)", color: pendingReports.length > 0 ? "#ff858d" : "#52b788", padding: "3px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "800" }}>
                {pendingReports.length} Signalements en Attente
              </span>
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "900", margin: "0.4rem 0 0 0", color: "#ffffff" }}>
              File de Modération Active (SLA Garanti &lt; 24h)
            </h1>
          </div>

          <button
            type="button"
            onClick={loadData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(212, 163, 115, 0.25)",
              color: "#f4c07c",
              fontSize: "0.82rem",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            <RefreshCcw size={14} /> Rafraîchir
          </button>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
          
          {/* Left Column : Tickets List */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.25rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#ff858d", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <Flag size={16} /> Signalements Reçus ({reports.length})
            </h3>

            {reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#a0aba4", fontSize: "0.9rem" }}>
                🛡️ Aucun incident signalé. La communauté est intègre et respectueuse.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {reports.map((item) => {
                  const isSelected = item.id === selectedReportId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedReportId(item.id)}
                      style={{
                        padding: "1rem",
                        borderRadius: "16px",
                        backgroundColor: isSelected ? "rgba(230, 57, 70, 0.12)" : "rgba(255, 255, 255, 0.02)",
                        border: isSelected ? "1.5px solid #e63946" : "1px solid rgba(255, 255, 255, 0.06)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "#ffffff" }}>
                          {item.reportedUserName}
                        </span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: "800",
                            padding: "2px 8px",
                            borderRadius: "999px",
                            backgroundColor: item.status === "RESOLVED" ? "rgba(82, 183, 136, 0.2)" : item.status === "DISMISSED" ? "rgba(255,255,255,0.1)" : "rgba(230, 57, 70, 0.2)",
                            color: item.status === "RESOLVED" ? "#52b788" : item.status === "DISMISSED" ? "#a0aba4" : "#ff858d",
                          }}
                        >
                          {item.status === "RESOLVED" ? "TRAITÉ" : item.status === "DISMISSED" ? "CLASSÉ" : "EN COURS"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#ff858d", fontWeight: "700", marginBottom: "4px" }}>
                        Motif : {item.reason}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "#a0aba4" }}>
                        <span>Signalé par : {item.reporterUserName}</span>
                        <span style={{ color: "#f4c07c", fontWeight: "700", display: "flex", alignItems: "center", gap: "3px" }}>
                          <Clock size={11} /> SLA: {item.slaRemainingHours}h
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column : Incident Inspector & Actions */}
          {selectedReport ? (
            <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(230, 57, 70, 0.3)", padding: "1.75rem" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", paddingBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img
                    src={selectedReport.reportedUserAvatar}
                    alt={selectedReport.reportedUserName}
                    style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e63946" }}
                  />
                  <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#ffffff", margin: 0 }}>
                      {selectedReport.reportedUserName}
                    </h2>
                    <div style={{ fontSize: "0.8rem", color: "#ff858d", fontWeight: "700", marginTop: "2px" }}>
                      Signalé pour : {selectedReport.reason}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#a0aba4", marginTop: "2px" }}>
                      Signalé par {selectedReport.reporterUserName} ({new Date(selectedReport.createdAt).toLocaleDateString("fr-FR")})
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: "rgba(230, 57, 70, 0.15)", border: "1px solid #e63946", padding: "6px 14px", borderRadius: "12px", textAlign: "right" }}>
                  <div style={{ fontSize: "0.72rem", color: "#ff858d", fontWeight: "700" }}>Délai SLA Restant</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "#ffffff" }}>{selectedReport.slaRemainingHours} Heures</div>
                </div>
              </div>

              {/* Message / Content Evidence */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "6px" }}>
                  Extrait de la Conversation / Preuve Signalée
                </div>
                <div
                  style={{
                    backgroundColor: "#070d09",
                    border: "1px solid rgba(230, 57, 70, 0.3)",
                    borderRadius: "14px",
                    padding: "1rem 1.25rem",
                    fontSize: "0.92rem",
                    color: "#fbfbfb",
                    lineHeight: "1.5",
                    fontStyle: "italic",
                  }}
                >
                  {selectedReport.flaggedContent}
                </div>
              </div>

              {/* Sanctions Graduées - 100% Cliquables */}
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: "800", color: "#f4c07c", marginBottom: "0.75rem" }}>
                  Décision du Super Admin (Sanctions Graduées)
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => handleApplySanction("Avertissement Officiel")}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid rgba(244, 192, 124, 0.4)",
                      backgroundColor: "rgba(244, 192, 124, 0.08)",
                      color: "#f4c07c",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Bell size={15} /> Avertissement SMS/Push
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplySanction("Suspension Temporaire 48h")}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid rgba(230, 57, 70, 0.5)",
                      backgroundColor: "rgba(230, 57, 70, 0.12)",
                      color: "#ff858d",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Clock size={15} /> Suspension 48h
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplySanction("Bannissement Définitif & Révocation")}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: "#e63946",
                      color: "#ffffff",
                      fontWeight: "800",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Ban size={15} /> Bannir Définitivement
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDismiss}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    color: "#a0aba4",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Classer sans suite (Signalement infondé / Non conforme)
                </button>
              </div>

            </div>
          ) : (
            <div style={{ backgroundColor: "#14231a", borderRadius: "24px", padding: "3rem", textAlign: "center", color: "#a0aba4" }}>
              Sélectionnez un ticket de modération dans la colonne de gauche.
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
