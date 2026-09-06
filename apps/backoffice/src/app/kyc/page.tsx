"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  Eye,
  ArrowLeft,
  RefreshCcw,
  Lock,
  Sparkles,
  AlertCircle,
  ZoomIn,
  X,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { backofficeStore, BackofficeKycItem } from "@/lib/backoffice-store";

export default function KycQueuePage() {
  const [queue, setQueue] = useState<BackofficeKycItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("Document illisible ou flou");
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = () => {
    const list = backofficeStore.getKycQueue();
    setQueue(list);
    const pending = list.filter((k) => k.status === "PENDING");
    if (pending.length > 0) {
      setSelectedId(pending[0]!.id);
    } else if (list.length > 0) {
      setSelectedId(list[0]!.id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingCount = queue.filter((k) => k.status === "PENDING").length;
  const selectedItem = queue.find((q) => q.id === selectedId) || queue[0];

  const handleApprove = (id: string) => {
    backofficeStore.approveKyc(id);
    setFeedbackMessage({
      type: "success",
      text: `Dossier de ${selectedItem?.fullName} approuvé avec succès ! Le badge officiel Âme Pure 🛡️ est désormais actif.`,
    });
    loadData();
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleConfirmReject = () => {
    if (!selectedItem) return;
    backofficeStore.rejectKyc(selectedItem.id, rejectReason);
    setShowRejectModal(false);
    setFeedbackMessage({
      type: "error",
      text: `Dossier de ${selectedItem.fullName} refusé pour le motif : ${rejectReason}. Notification transmise.`,
    });
    loadData();
    setTimeout(() => setFeedbackMessage(null), 3500);
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
      <AdminNavbar title="File KYC & Certification 18+" subtitle="Examen Assermenté d'Identité" />

      {/* Lightbox Modal for Document Zoom */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <img
              src={zoomImage}
              alt="Pièce agrandie"
              style={{ width: "100%", height: "100%", maxHeight: "85vh", objectFit: "contain", borderRadius: "16px", border: "2px solid #f4c07c" }}
            />
            <button
              onClick={() => setZoomImage(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#e63946",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Rejection Modal with Motives */}
      {showRejectModal && selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              backgroundColor: "#14231a",
              border: "1.5px solid rgba(230, 57, 70, 0.4)",
              borderRadius: "24px",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ff858d", marginBottom: "0.5rem" }}>
              <XCircle size={22} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: "900", margin: 0 }}>Motif de Refus Officiel</h3>
            </div>
            <p style={{ color: "#a0aba4", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Indiquez la raison motivant le rejet de la pièce fournie par <strong>{selectedItem.fullName}</strong>.
            </p>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#d4a373", marginBottom: "6px" }}>
                Raison du Refus
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  backgroundColor: "#070d09",
                  border: "1px solid rgba(212, 163, 115, 0.3)",
                  color: "#fbfbfb",
                  fontSize: "16px",
                  outline: "none",
                }}
              >
                <option value="Document illisible ou flou">Document illisible ou flou (Résolution insuffisante)</option>
                <option value="Non-concordance faciale (Selfie vs Pièce)">Non-concordance faciale (Score &lt; 85%)</option>
                <option value="Pièce d'identité expirée">Pièce d&apos;identité expirée ou caduque</option>
                <option value="Document tronqué / Bords coupés">Document tronqué / Angles coupés</option>
                <option value="Suspicion de falsification numérique">Suspicion de retouche ou falsification</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "transparent",
                  color: "#c7cfcb",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#e63946",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "800",
                }}
              >
                Confirmer le Refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        
        {/* Feedback Alert Banner */}
        {feedbackMessage && (
          <div
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "16px",
              backgroundColor: feedbackMessage.type === "success" ? "rgba(82, 183, 136, 0.15)" : "rgba(230, 57, 70, 0.15)",
              border: feedbackMessage.type === "success" ? "1px solid #52b788" : "1px solid #e63946",
              color: feedbackMessage.type === "success" ? "#52b788" : "#ff858d",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "700",
              fontSize: "0.9rem",
            }}
          >
            {feedbackMessage.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Title Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ backgroundColor: pendingCount > 0 ? "rgba(244, 192, 124, 0.2)" : "rgba(82, 183, 136, 0.2)", color: pendingCount > 0 ? "#f4c07c" : "#52b788", padding: "3px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "800" }}>
                {pendingCount} En Attente d&apos;Examen
              </span>
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "900", margin: "0.4rem 0 0 0", color: "#ffffff" }}>
              Validation des Dossiers d&apos;Identité Officielle
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
            <RefreshCcw size={14} /> Rafraîchir la File
          </button>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
          
          {/* Left Column : Dossiers List */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.25rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#f4c07c", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <FileText size={16} /> Liste des Candidats ({queue.length})
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {queue.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      padding: "1rem",
                      borderRadius: "16px",
                      backgroundColor: isSelected ? "rgba(244, 192, 124, 0.12)" : "rgba(255, 255, 255, 0.02)",
                      border: isSelected ? "1.5px solid #f4c07c" : "1px solid rgba(255, 255, 255, 0.06)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <img
                      src={item.avatarUrl}
                      alt={item.fullName}
                      style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #d4a373" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: "800", fontSize: "0.95rem", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.fullName}, {item.age} ans
                        </div>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: "900",
                            padding: "2px 8px",
                            borderRadius: "999px",
                            backgroundColor: item.status === "APPROVED" ? "rgba(82, 183, 136, 0.2)" : item.status === "REJECTED" ? "rgba(230, 57, 70, 0.2)" : "rgba(244, 192, 124, 0.2)",
                            color: item.status === "APPROVED" ? "#52b788" : item.status === "REJECTED" ? "#ff858d" : "#f4c07c",
                          }}
                        >
                          {item.status === "APPROVED" ? "VALIDÉ" : item.status === "REJECTED" ? "REFUSÉ" : "EN ATTENTE"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#a0aba4", marginTop: "2px" }}>
                        {item.country} • {item.documentType} • Score {item.similarityScore}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column : Detail Inspector */}
          {selectedItem ? (
            <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", padding: "1.75rem" }}>
              
              {/* Header Candidate Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", paddingBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img
                    src={selectedItem.avatarUrl}
                    alt={selectedItem.fullName}
                    style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid #f4c07c" }}
                  />
                  <div>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#ffffff", margin: 0 }}>
                      {selectedItem.fullName}
                    </h2>
                    <div style={{ fontSize: "0.82rem", color: "#d4a373", fontWeight: "700", marginTop: "2px" }}>
                      {selectedItem.profession} • {selectedItem.country}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#a0aba4", marginTop: "2px" }}>
                      Date de naissance déclarée : {selectedItem.birthDate} ({selectedItem.age} ans révolus)
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "#a0aba4" }}>Score Biométrique Facial</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "900", color: selectedItem.similarityScore >= 85 ? "#52b788" : "#f4a261" }}>
                    {selectedItem.similarityScore}%
                  </div>
                  <div style={{ fontSize: "0.7rem", color: selectedItem.similarityScore >= 85 ? "#52b788" : "#f4a261", fontWeight: "700" }}>
                    {selectedItem.similarityScore >= 85 ? "Liveness & Concordance Forte" : "Vérification Manuelle Requise"}
                  </div>
                </div>
              </div>

              {/* Document & Selfie Side-by-Side Comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "1.75rem" }}>
                
                {/* Official ID Document */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#f4c07c" }}>
                      Pièce Officielle ({selectedItem.documentType})
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomImage(selectedItem.documentUrl)}
                      style={{ background: "none", border: "none", color: "#d4a373", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}
                    >
                      <ZoomIn size={12} /> Agrandir
                    </button>
                  </div>
                  <div
                    onClick={() => setZoomImage(selectedItem.documentUrl)}
                    style={{
                      height: "190px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      backgroundColor: "#070d09",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <img
                      src={selectedItem.documentUrl}
                      alt="Document KYC"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>

                {/* Selfie Comparison */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#52b788" }}>
                      Selfie de Contrôle en Direct
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomImage(selectedItem.selfieUrl)}
                      style={{ background: "none", border: "none", color: "#52b788", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}
                    >
                      <ZoomIn size={12} /> Agrandir
                    </button>
                  </div>
                  <div
                    onClick={() => setZoomImage(selectedItem.selfieUrl)}
                    style={{
                      height: "190px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid rgba(82, 183, 136, 0.3)",
                      backgroundColor: "#070d09",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <img
                      src={selectedItem.selfieUrl}
                      alt="Selfie Biométrique"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons: 100% Functional Approve / Reject */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid rgba(212, 163, 115, 0.15)" }}>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedItem.id)}
                  disabled={selectedItem.status === "APPROVED"}
                  style={{
                    flex: 1,
                    minWidth: "160px",
                    padding: "14px 20px",
                    borderRadius: "14px",
                    border: "none",
                    background: selectedItem.status === "APPROVED" ? "#1b4332" : "linear-gradient(135deg, #52b788 0%, #2d6a4f 100%)",
                    color: "#ffffff",
                    fontWeight: "900",
                    fontSize: "0.95rem",
                    cursor: selectedItem.status === "APPROVED" ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(82, 183, 136, 0.3)",
                  }}
                >
                  <CheckCircle2 size={18} />
                  {selectedItem.status === "APPROVED" ? "Dossier Déjà Approuvé" : "Approuver Officiellement 🛡️"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  disabled={selectedItem.status === "REJECTED"}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "14px",
                    border: "1px solid rgba(230, 57, 70, 0.5)",
                    backgroundColor: "rgba(230, 57, 70, 0.12)",
                    color: "#ff858d",
                    fontWeight: "800",
                    fontSize: "0.95rem",
                    cursor: selectedItem.status === "REJECTED" ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <XCircle size={18} />
                  {selectedItem.status === "REJECTED" ? "Dossier Rejeté" : "Rejeter la Pièce"}
                </button>
              </div>

            </div>
          ) : (
            <div style={{ backgroundColor: "#14231a", borderRadius: "24px", padding: "3rem", textAlign: "center", color: "#a0aba4" }}>
              Sélectionnez un dossier à examiner dans la colonne de gauche.
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
