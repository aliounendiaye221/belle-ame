"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Lock, Clock, Search, Filter } from "lucide-react";

export default function AuditLogPage() {
  const auditLogs = [
    {
      id: "log-9001",
      timestamp: "2026-08-28T14:32:00Z",
      adminId: "adm-super-01 (Super Admin)",
      action: "KYC_APPROVE",
      targetUser: "usr-cam-991",
      ipAddress: "197.234.221.12",
      details: "Validation du document CNI Cameroun et attribution du badge KYC 🛡️"
    },
    {
      id: "log-9002",
      timestamp: "2026-08-28T13:15:00Z",
      adminId: "adm-mod-04 (Modérateur SLA)",
      action: "SANCTION_SHADOWBAN",
      targetUser: "usr-ci-440",
      ipAddress: "41.202.190.5",
      details: "Application de la sanction 4 (Shadowban) suite au signalement rep-801"
    },
    {
      id: "log-9003",
      timestamp: "2026-08-28T11:00:00Z",
      adminId: "SYSTEM_WEBHOOK",
      action: "PAYMENT_CREDIT_FCFA",
      targetUser: "usr-ben-304",
      ipAddress: "54.172.10.22",
      details: "Abonnement Privilège 5 000 FCFA activé via MTN MoMo webhook externalEventId: momo-txn-8812"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Admin Navbar */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Journal d'Audit Immuable (AuditLog)</div>
            <div style={{ fontSize: "0.7rem", color: "#52b788", fontWeight: "600" }}>🔒 Traçabilité infalsifiable en base PostgreSQL</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <Link href="/" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Dashboard</Link>
          <Link href="/kyc" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>File KYC</Link>
          <Link href="/moderation" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Modération SLA</Link>
          <Link href="/users" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Utilisateurs</Link>
          <Link href="/audit" style={{ color: "#d4a373", fontWeight: "700", textDecoration: "none", borderBottom: "2px solid #d4a373", paddingBottom: "0.25rem", fontSize: "0.9rem" }}>Piste d'Audit</Link>
          <Link href="/growth" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>WhatsApp Growth</Link>
        </nav>
      </header>

      <main style={{ flex: 1, padding: "2.5rem", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        
        <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#081c15", borderBottom: "1px solid rgba(212, 163, 115, 0.2)", color: "#d4a373" }}>
                <th style={{ padding: "1rem 1.5rem" }}>Horodatage (UTC)</th>
                <th style={{ padding: "1rem 1.5rem" }}>Auteur (Admin ID)</th>
                <th style={{ padding: "1rem 1.5rem" }}>Type d'Action</th>
                <th style={{ padding: "1rem 1.5rem" }}>Utilisateur Cible</th>
                <th style={{ padding: "1rem 1.5rem" }}>Adresse IP</th>
                <th style={{ padding: "1rem 1.5rem" }}>Détails de l'opération</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid rgba(212, 163, 115, 0.1)" }}>
                  <td style={{ padding: "1.25rem 1.5rem", color: "#a0aba4" }}>{log.timestamp}</td>
                  <td style={{ padding: "1.25rem 1.5rem", fontWeight: "700", color: "#d4a373" }}>{log.adminId}</td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <span style={{ backgroundColor: "rgba(212, 163, 115, 0.15)", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.25rem 0.6rem", borderRadius: "8px", fontWeight: "700" }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", fontFamily: "monospace", color: "#52b788" }}>{log.targetUser}</td>
                  <td style={{ padding: "1.25rem 1.5rem", color: "#a0aba4" }}>{log.ipAddress}</td>
                  <td style={{ padding: "1.25rem 1.5rem", color: "#c2c9c4" }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
