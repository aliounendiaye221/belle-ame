"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileCheck,
  Camera,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  Lock,
  Sparkles,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";

export default function VerificationStatusPage() {
  const [docType, setDocType] = useState<"NATIONAL_ID" | "PASSPORT" | "VOTER_CARD">("NATIONAL_ID");
  const [documentFile, setDocumentFile] = useState<string | null>("cni_cameroun_recto.jpg");
  const [selfieFile, setSelfieFile] = useState<string | null>("selfie_live_01.jpg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Données de statut KYC simulées (synchronisables avec GET /verification/status)
  const [kycStatus, setKycStatus] = useState({
    status: "VERIFIED", // "NOT_STARTED" | "PENDING" | "VERIFIED" | "REJECTED"
    calculatedAge: 27,
    isMajor: true,
    faceSimilarityScore: 96.5,
    submittedAt: "28 Août 2026",
    reviewedAt: "28 Août 2026",
    rejectionReason: null as string | null,
  });

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setKycStatus((prev) => ({
        ...prev,
        status: "PENDING",
        submittedAt: "À l'instant",
      }));
    }, 1500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070d09",
        color: "#fbfbfb",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LiveSocialProofToast />

      {/* Header */}
      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(212, 163, 115, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(16, 32, 23, 0.85)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <BrandLogo size="md" />

        <Link
          href="/profile"
          style={{
            color: "#d4a373",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <ArrowLeft size={16} /> Mon Profil
        </Link>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: "760px", width: "100%", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        {/* Title Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "rgba(82, 183, 136, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#52b788",
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#fbfbfb", margin: 0 }}>
              Certification d&apos;Honneur & KYC 18+
            </h1>
          </div>
          <p style={{ color: "#8a968f", fontSize: "0.92rem", margin: 0 }}>
            Garantie d&apos;authenticité : chaque membre d&apos;« À Chacun Une Belle Âme » est vérifié par pièce officielle et reconnaissance faciale.
          </p>
        </div>

        {/* Status Card */}
        <div
          style={{
            backgroundColor: "rgba(16, 32, 23, 0.8)",
            borderRadius: "24px",
            border: kycStatus.status === "VERIFIED" ? "1.5px solid rgba(82, 183, 136, 0.5)" : "1.5px solid rgba(244, 192, 124, 0.4)",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.82rem", color: "#8a968f", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
                État Actuel du Dossier
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                {kycStatus.status === "VERIFIED" && (
                  <>
                    <CheckCircle2 size={24} color="#52b788" />
                    <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "#52b788" }}>
                      Profil Officiellement Certifié 🛡️
                    </span>
                  </>
                )}
                {kycStatus.status === "PENDING" && (
                  <>
                    <Clock size={24} color="#f4c07c" />
                    <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "#f4c07c" }}>
                      En Cours d&apos;Examen SLA &lt; 24h
                    </span>
                  </>
                )}
                {kycStatus.status === "REJECTED" && (
                  <>
                    <AlertCircle size={24} color="#e63946" />
                    <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "#e63946" }}>
                      Dossier Rejeté — Mise à Jour Requise
                    </span>
                  </>
                )}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(7, 13, 9, 0.8)",
                padding: "8px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(212, 163, 115, 0.25)",
                textAlign: "right",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "#8a968f" }}>Score de Similarité Faciale</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "900", color: "#52b788" }}>
                {kycStatus.faceSimilarityScore}% (Excellente)
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div
            style={{
              backgroundColor: "rgba(7, 13, 9, 0.5)",
              borderRadius: "16px",
              padding: "1.2rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              fontSize: "0.85rem",
              border: "1px solid rgba(212, 163, 115, 0.15)",
            }}
          >
            <div>
              <span style={{ color: "#8a968f" }}>Âge vérifié au serveur : </span>
              <strong style={{ color: "#fbfbfb" }}>{kycStatus.calculatedAge} ans (Majeur 18+ validé)</strong>
            </div>
            <div>
              <span style={{ color: "#8a968f" }}>Date de soumission : </span>
              <strong style={{ color: "#fbfbfb" }}>{kycStatus.submittedAt}</strong>
            </div>
            <div>
              <span style={{ color: "#8a968f" }}>Chiffrement du coffre : </span>
              <strong style={{ color: "#52b788" }}>AES-256-GCM (Isolé S3)</strong>
            </div>
            <div>
              <span style={{ color: "#8a968f" }}>Délai légal de purge : </span>
              <strong style={{ color: "#fbfbfb" }}>30 jours post-clôture</strong>
            </div>
          </div>
        </div>

        {/* Update Form (Available if need update or new document) */}
        <div
          style={{
            backgroundColor: "rgba(16, 32, 23, 0.75)",
            borderRadius: "24px",
            border: "1px solid rgba(212, 163, 115, 0.2)",
            padding: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
            <UploadCloud size={20} color="#f4c07c" />
            <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#fbfbfb", margin: 0 }}>
              Téléverser une Nouvelle Pièce ou Renouveler mon Selfie
            </h2>
          </div>

          <form onSubmit={handleResubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", color: "#d4a373", fontWeight: "700", marginBottom: "6px" }}>
                Type de Pièce Officielle d&apos;Identité
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                style={{
                  width: "100%",
                  backgroundColor: "#070d09",
                  border: "1px solid rgba(212, 163, 115, 0.3)",
                  borderRadius: "14px",
                  padding: "0.75rem 1rem",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              >
                <option value="NATIONAL_ID">Carte Nationale d&apos;Identité (CNI)</option>
                <option value="PASSPORT">Passeport International</option>
                <option value="VOTER_CARD">Carte d&apos;Électeur Biométrique</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Document Upload Box */}
              <div
                style={{
                  border: "1.5px dashed rgba(212, 163, 115, 0.35)",
                  borderRadius: "16px",
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                  backgroundColor: "rgba(7, 13, 9, 0.5)",
                }}
              >
                <FileCheck size={28} color="#f4c07c" style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fbfbfb" }}>
                  Recto de la Pièce
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8a968f", margin: "4px 0 10px" }}>
                  PNG, JPG jusqu&apos;à 10 Mo
                </div>
                <button
                  type="button"
                  style={{
                    backgroundColor: "rgba(244, 192, 124, 0.15)",
                    border: "1px solid #f4c07c",
                    color: "#f4c07c",
                    padding: "6px 14px",
                    borderRadius: "12px",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Remplacer le fichier
                </button>
              </div>

              {/* Selfie Upload Box */}
              <div
                style={{
                  border: "1.5px dashed rgba(212, 163, 115, 0.35)",
                  borderRadius: "16px",
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                  backgroundColor: "rgba(7, 13, 9, 0.5)",
                }}
              >
                <Camera size={28} color="#52b788" style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fbfbfb" }}>
                  Selfie Live Instantané
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8a968f", margin: "4px 0 10px" }}>
                  Visage découvert et bien éclairé
                </div>
                <button
                  type="button"
                  style={{
                    backgroundColor: "rgba(82, 183, 136, 0.15)",
                    border: "1px solid #52b788",
                    color: "#52b788",
                    padding: "6px 14px",
                    borderRadius: "12px",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Reprendre un selfie
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  padding: "12px 28px",
                  fontSize: "0.9rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isSubmitting ? "Chiffrement et transmission..." : "Soumettre pour Réévaluation"}
              </button>
            </div>

            {submittedSuccess && (
              <div
                style={{
                  backgroundColor: "rgba(82, 183, 136, 0.15)",
                  border: "1px solid #52b788",
                  color: "#52b788",
                  borderRadius: "14px",
                  padding: "0.75rem 1rem",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  fontWeight: "700",
                }}
              >
                ✓ Votre dossier a été transmis avec succès. Décision sous 24h par la modération.
              </div>
            )}
          </form>
        </div>

      </main>
    </div>
  );
}
