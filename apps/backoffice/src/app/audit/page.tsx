"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Lock,
  Clock,
  Search,
  Download,
  Filter,
  RefreshCcw,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { backofficeStore, BackofficeAuditLog } from "@/lib/backoffice-store";

export default function AuditLogPage() {
  const [auditLogs, setAuditLogs] = useState<BackofficeAuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const loadLogs = () => {
    setAuditLogs(backofficeStore.getAuditLogs());
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleExportJson = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `belleame-audit-logs-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportFeedback("Export JSON téléchargé avec succès !");
    setTimeout(() => setExportFeedback(null), 3000);
  };

  const handleExportCsv = () => {
    const headers = ["ID", "Horodatage", "Administrateur", "Action", "Cible", "Adresse IP", "Détails"];
    const rows = auditLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.adminId}"`,
      `"${l.action}"`,
      `"${l.targetUser}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `belleame-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportFeedback("Export CSV téléchargé avec succès !");
    setTimeout(() => setExportFeedback(null), 3000);
  };

  const filteredLogs = auditLogs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.targetUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ipAddress.includes(searchTerm);

    if (!matchesSearch) return false;
    if (actionFilter !== "ALL" && !l.action.includes(actionFilter)) return false;
    return true;
  });

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
      <AdminNavbar title="Piste d'Audit Immuable" subtitle="Journalisation & Traçabilité Infalsifiable" />

      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        
        {/* Feedback Alert */}
        {exportFeedback && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "14px",
              backgroundColor: "rgba(82, 183, 136, 0.15)",
              border: "1px solid #52b788",
              color: "#52b788",
              marginBottom: "1.5rem",
              fontWeight: "700",
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={18} />
            <span>{exportFeedback}</span>
          </div>
        )}

        {/* Header Title & Export Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ backgroundColor: "rgba(82, 183, 136, 0.2)", color: "#52b788", padding: "3px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "800" }}>
                🔒 Horodatage UTC Actif
              </span>
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "900", margin: "0.4rem 0 0 0", color: "#ffffff" }}>
              Registre d&apos;Audit Légal ({filteredLogs.length})
            </h1>
          </div>

          {/* Export Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleExportCsv}
              style={{
                padding: "10px 16px",
                borderRadius: "14px",
                backgroundColor: "rgba(244, 192, 124, 0.15)",
                border: "1px solid rgba(244, 192, 124, 0.4)",
                color: "#f4c07c",
                fontWeight: "800",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FileSpreadsheet size={16} /> Exporter CSV
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              style={{
                padding: "10px 16px",
                borderRadius: "14px",
                backgroundColor: "rgba(82, 183, 136, 0.15)",
                border: "1px solid rgba(82, 183, 136, 0.4)",
                color: "#52b788",
                fontWeight: "800",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Download size={16} /> Exporter JSON
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#14231a",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              padding: "8px 14px",
              borderRadius: "14px",
              flex: 1,
              minWidth: "260px",
            }}
          >
            <Search size={16} color="#f4c07c" />
            <input
              type="text"
              placeholder="Filtrer par mot-clé, cible, action ou IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",
                outline: "none",
                fontSize: "16px",
                width: "100%",
              }}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={{
              backgroundColor: "#14231a",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              color: "#f4c07c",
              padding: "8px 14px",
              borderRadius: "14px",
              fontSize: "16px",
              outline: "none",
              fontWeight: "700",
            }}
          >
            <option value="ALL">Toutes les Actions</option>
            <option value="KYC">Validations &amp; Rejets KYC</option>
            <option value="MODERATION">Modération &amp; Sanctions</option>
            <option value="USER">Modifications Utilisateurs</option>
            <option value="ADMIN">Connexions Super Admin</option>
            <option value="MOMO">Paiements Mobile Money</option>
          </select>
        </div>

        {/* Audit Logs Table */}
        <div
          style={{
            backgroundColor: "#14231a",
            borderRadius: "24px",
            border: "1px solid rgba(212, 163, 115, 0.18)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(212, 163, 115, 0.18)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Horodatage (UTC)</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Action</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Opérateur / Source</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Cible</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Adresse IP</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Détails Légaux</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                  >
                    <td style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#a0aba4", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                      {new Date(log.timestamp).toLocaleString("fr-FR")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          backgroundColor: log.action.includes("APPROVED") || log.action.includes("SUCCESS")
                            ? "rgba(82, 183, 136, 0.2)"
                            : log.action.includes("REJECT") || log.action.includes("SANCTION")
                            ? "rgba(230, 57, 70, 0.2)"
                            : "rgba(244, 192, 124, 0.2)",
                          color: log.action.includes("APPROVED") || log.action.includes("SUCCESS")
                            ? "#52b788"
                            : log.action.includes("REJECT") || log.action.includes("SANCTION")
                            ? "#ff858d"
                            : "#f4c07c",
                          padding: "3px 8px",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: "800",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "0.82rem", color: "#fbfbfb", fontWeight: "700" }}>
                      {log.adminId}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700" }}>
                      {log.targetUser}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#a0aba4", fontFamily: "monospace" }}>
                      {log.ipAddress}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "0.82rem", color: "#c7cfcb", maxWidth: "340px", lineHeight: "1.4" }}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
