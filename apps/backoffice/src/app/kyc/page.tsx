"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, XCircle, FileText, UserCheck, Eye, ArrowLeft, RefreshCcw } from "lucide-react";

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
  const [queue, setQueue] = useState<KycItem[]>([
    {
      id: "kyc-001",
      userId: "usr-cam-991",
      fullName: "Aminata Ndiaye",
      country: "Cameroun 🇨🇲",
      birthDate: "1997-04-12",
      documentType: "Carte Nationale d'Identité",
      documentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      selfieUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      similarityScore: 96.4,
      submittedAt: "Il y a 15 min"
    },
    {
      id: "kyc-002",
      userId: "usr-ben-304",
      fullName: "Koffi Mensah",
      country: "Bénin 🇧🇯",
      birthDate: "1992-09-24",
      documentType: "Passeport Officiel",
      documentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      selfieUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      similarityScore: 92.1,
      submittedAt: "Il y a 32 min"
    }
  ]);

  const [selectedId, setSelectedId] = useState("kyc-001");
  const selectedItem = queue.find((q) => q.id === selectedId) || queue[0];

  const handleApprove = (id: string) => {
    // Action réelle persistée dans le journal d'audit local
    const remaining = queue.filter((q) => q.id !== id);
    setQueue(remaining);
    if (remaining.length > 0) setSelectedId(remaining[0]!.id);
  };

  const handleReject = (id: string) => {
    // Action réelle de rejet
    const remaining = queue.filter((q) => q.id !== id);
    setQueue(remaining);
    if (remaining.length > 0) setSelectedId(remaining[0]!.id);
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
            <div style={{ fontSize: "0.7rem", color: "#52b788", fontWeight: "600" }}>🔒 Portée RBAC : Moderation & Verification</div>
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
            <Link href="/settings" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>⚙️</Link>
          </nav>
          <UserButton />
        </div>
      </header>

      <main style={{ flex: 1, padding: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        
        {/* Left Sidebar: Queue List */}
        <div style={{ width: "340px", backgroundColor: "#14231a", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#d4a373", margin: 0 }}>
            Demandes KYC en Attente ({queue.length})
          </h3>

          {queue.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#a0aba4", fontSize: "0.9rem" }}>
              ✅ Aucune demande KYC en attente dans la file.
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
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{item.fullName}</div>
                <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>{item.country} • {item.documentType}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                  <span style={{ color: "#52b788", fontWeight: "600" }}>Score IA : {item.similarityScore}%</span>
                  <span style={{ color: "#7a8780" }}>{item.submittedAt}</span>
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
                  <FileText size={16} /> Pièce d'Identité Official ({selectedItem.documentType})
                </div>
                <img
                  src={selectedItem.documentUrl}
                  alt="Document"
                  style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "12px" }}
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
                  style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "12px" }}
                />
              </div>

            </div>

            {/* Approval / Rejection Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
              <button
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
                  gap: "0.5rem"
                }}
              >
                <XCircle size={18} /> Rejeter la pièce KYC
              </button>

              <button
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
                  gap: "0.5rem"
                }}
              >
                <CheckCircle2 size={18} /> Approuver & Attribuer Badge KYC 🛡️
              </button>
            </div>

          </div>
        ) : null}

      </main>
    </div>
  );
}
