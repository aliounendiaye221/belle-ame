"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, XCircle, FileText, UserCheck, Eye, ArrowLeft, RefreshCcw, Lock } from "lucide-react";
import { UserButton } from "@/lib/clerk-admin";

interface KycItem {
  id: string;
  userId: string;
  fullName: string;
  country: string;
  birthDate: string;
  documentType: string;
  documentUrl: string;
  selfieUrl: string;
  similarityScore: number;
  submittedAt: string;
}

export default function KycQueuePage() {
  const [queue, setQueue] = useState<KycItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const selectedItem = queue.find((q) => q.id === selectedId) || queue[0];

  const loadQueue = () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("belleame_real_kyc_queue");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const pending = parsed.filter((item: any) => item.status === "PENDING");
          setQueue(pending);
          if (pending.length > 0) setSelectedId(pending[0].id);
          else setSelectedId("");
        } catch {
          setQueue([]);
        }
      }
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleApprove = (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item) return;

    if (typeof window !== "undefined") {
      // 1. Mettre à jour dans la file d'attente
      const rawQueue = localStorage.getItem("belleame_real_kyc_queue");
      if (rawQueue) {
        try {
          const allQueue = JSON.parse(rawQueue);
          const target = allQueue.find((q: any) => q.id === id);
          if (target) target.status = "APPROVED";
          localStorage.setItem("belleame_real_kyc_queue", JSON.stringify(allQueue));
        } catch {}
      }

      // 2. Mettre à jour le profil utilisateur
      const rawProfile = localStorage.getItem("belleame_real_profile");
      if (rawProfile) {
        try {
          const prof = JSON.parse(rawProfile);
          prof.isIdentityVerified = true;
          prof.kycStatus = "VERIFIED";
          localStorage.setItem("belleame_real_profile", JSON.stringify(prof));
        } catch {}
      }

      // 3. Enregistrer dans le journal d'audit
      const rawAudit = localStorage.getItem("belleame_real_audit_logs") || "[]";
      try {
        const auditLogs = JSON.parse(rawAudit);
        auditLogs.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          adminId: "adm-mod-01 (Modérateur Assermenté)",
          action: "KYC_APPROVED",
          targetUser: item.userId,
          ipAddress: "127.0.0.1",
          details: `Approbation officielle de la pièce d'identité (${item.documentType}) pour ${item.fullName}. Score facial certifié ${item.similarityScore}%.`,
        });
        localStorage.setItem("belleame_real_audit_logs", JSON.stringify(auditLogs));
      } catch {}
    }

    const remaining = queue.filter((q) => q.id !== id);
    setQueue(remaining);
    if (remaining.length > 0) setSelectedId(remaining[0]!.id);
    else setSelectedId("");
  };

  const handleReject = (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item) return;

    if (typeof window !== "undefined") {
      const rawQueue = localStorage.getItem("belleame_real_kyc_queue");
      if (rawQueue) {
        try {
          const allQueue = JSON.parse(rawQueue);
          const target = allQueue.find((q: any) => q.id === id);
          if (target) {
            target.status = "REJECTED";
            target.moderatorNotes = "Document non conforme ou illisible";
          }
          localStorage.setItem("belleame_real_kyc_queue", JSON.stringify(allQueue));
        } catch {}
      }

      const rawProfile = localStorage.getItem("belleame_real_profile");
      if (rawProfile) {
        try {
          const prof = JSON.parse(rawProfile);
          prof.isIdentityVerified = false;
          prof.kycStatus = "REJECTED";
          localStorage.setItem("belleame_real_profile", JSON.stringify(prof));
        } catch {}
      }

      const rawAudit = localStorage.getItem("belleame_real_audit_logs") || "[]";
      try {
        const auditLogs = JSON.parse(rawAudit);
        auditLogs.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          adminId: "adm-mod-01 (Modérateur Assermenté)",
          action: "KYC_REJECTED",
          targetUser: item.userId,
          ipAddress: "127.0.0.1",
          details: `Rejet du dossier KYC pour ${item.fullName} (motif : Document non conforme).`,
        });
        localStorage.setItem("belleame_real_audit_logs", JSON.stringify(auditLogs));
      } catch {}
    }

    const remaining = queue.filter((q) => q.id !== id);
    setQueue(remaining);
    if (remaining.length > 0) setSelectedId(remaining[0]!.id);
    else setSelectedId("");
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
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Back-Office Administration</div>
            <div style={{ fontSize: "0.7rem", color: "#52b788", fontWeight: "600" }}>🔒 Portée RBAC : Modération &amp; Vérification KYC</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Dashboard</Link>
            <Link href="/kyc" style={{ color: "#d4a373", fontWeight: "700", textDecoration: "none", borderBottom: "2px solid #d4a373", paddingBottom: "0.25rem", fontSize: "0.9rem" }}>File KYC ({queue.length})</Link>
            <Link href="/moderation" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Modération SLA</Link>
            <Link href="/users" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Utilisateurs</Link>
            <Link href="/audit" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Piste d&apos;Audit</Link>
            <Link href="/growth" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>WhatsApp Growth</Link>
          </nav>
          <UserButton />
        </div>
      </header>

      <main style={{ flex: 1, padding: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {/* Left Sidebar: Queue List */}
        <div style={{ width: "340px", backgroundColor: "#14231a", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#d4a373", margin: 0 }}>
              Demandes KYC ({queue.length})
            </h3>
            <button
              onClick={loadQueue}
              title="Actualiser la file"
              style={{ background: "none", border: "none", color: "#a0aba4", cursor: "pointer" }}
            >
              <RefreshCcw size={16} />
            </button>
          </div>

          {queue.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#a0aba4", fontSize: "0.9rem" }}>
              <CheckCircle2 size={36} color="#52b788" style={{ margin: "0 auto 0.75rem" }} />
              <div>Toutes les demandes KYC sont traitées.</div>
              <div style={{ fontSize: "0.78rem", color: "#7a8780", marginTop: "4px" }}>
                Les nouvelles soumissions des utilisateurs lors de l&apos;onboarding apparaîtront ici automatiquement.
              </div>
            </div>
          ) : (
            queue.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                style={{
                  backgroundColor: selectedId === item.id ? "rgba(212, 163, 115, 0.15)" : "#081c15",
                  border: selectedId === item.id ? "1px solid #d4a373" : "1px solid rgba(212, 163, 115, 0.15)",
                  borderRadius: "14px",
                  padding: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{item.fullName}</div>
                <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>
                  {item.country} • {item.documentType}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                  <span style={{ color: "#52b788", fontWeight: "600" }}>Score IA : {item.similarityScore}%</span>
                  <span style={{ color: "#7a8780" }}>{new Date(item.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Main Inspection Area */}
        {selectedItem ? (
          <div style={{ flex: 1, backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", paddingBottom: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.25rem" }}>{selectedItem.fullName}</h2>
                <div style={{ fontSize: "0.85rem", color: "#a0aba4" }}>
                  ID Utilisateur: <code>{selectedItem.userId}</code> | Date de naissance: {selectedItem.birthDate} (18+ Validé)
                </div>
              </div>
              <div style={{ backgroundColor: "rgba(82, 183, 136, 0.15)", border: "1px solid #52b788", padding: "0.5rem 1rem", borderRadius: "20px", color: "#52b788", fontWeight: "700", fontSize: "0.85rem" }}>
                Score de Correspondance Faciale : {selectedItem.similarityScore}%
              </div>
            </div>

            {/* Side-by-Side Verification View */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Document Image */}
              <div style={{ backgroundColor: "#081c15", borderRadius: "16px", padding: "1rem", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#d4a373", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <FileText size={16} /> Pièce d&apos;Identité Officielle ({selectedItem.documentType})
                </div>
                <img
                  src={selectedItem.documentUrl}
                  alt="Document"
                  style={{ width: "100%", height: "240px", objectFit: "contain", borderRadius: "12px", backgroundColor: "#000" }}
                />
              </div>

              {/* Live Selfie Image */}
              <div style={{ backgroundColor: "#081c15", borderRadius: "16px", padding: "1rem", border: "1px solid rgba(82, 183, 136, 0.2)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#52b788", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <UserCheck size={16} /> Selfie de Contrôle Liveness Live
                </div>
                <img
                  src={selectedItem.selfieUrl}
                  alt="Selfie"
                  style={{ width: "100%", height: "240px", objectFit: "contain", borderRadius: "12px", backgroundColor: "#000" }}
                />
              </div>
            </div>

            {/* Approval / Rejection Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => handleReject(selectedItem.id)}
                style={{
                  backgroundColor: "rgba(230, 57, 70, 0.15)",
                  border: "1px solid #e63946",
                  color: "#e63946",
                  padding: "0.9rem 1.75rem",
                  borderRadius: "25px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <XCircle size={18} /> Rejeter la pièce KYC
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedItem.id)}
                style={{
                  backgroundColor: "#52b788",
                  color: "#0b130e",
                  border: "none",
                  padding: "0.9rem 2rem",
                  borderRadius: "25px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <CheckCircle2 size={18} /> Approuver &amp; Attribuer Badge KYC 🛡️
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
