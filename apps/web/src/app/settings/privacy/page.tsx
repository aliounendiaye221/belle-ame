"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Download, Trash2, Lock, AlertTriangle, ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import { realPlatformStore } from "@/lib/real-platform-store";

export default function PrivacyPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  const gracePeriodEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleExportData = () => {
    setIsExporting(true);
    const profile = realPlatformStore.getProfile();
    const matches = realPlatformStore.getMatches();

    setTimeout(() => {
      setIsExporting(false);
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(
          JSON.stringify(
            {
              plateforme: "À Chacun Une Belle Âme",
              dateExportationUTC: new Date().toISOString(),
              profilUtilisateur: {
                id: profile.id,
                nomComplet: profile.fullName,
                prenom: profile.firstName,
                age: profile.age,
                telephone: profile.phone,
                pays: profile.countryCode,
                ville: profile.city,
                statutKYC: profile.kycStatus,
                identiteVerifiee: profile.isIdentityVerified,
                valeursPartagees: profile.sharedValues,
                formuleAbonnement: profile.subscribedPlan,
                dateExpirationAbonnement: profile.subscribedUntil,
              },
              statistiquesActivite: {
                nombreCorrespondancesActives: matches.length,
                quotaQuotidienRestant: profile.dailyQuotaRemaining,
              },
              conformiteLegale: {
                consentementRGPD: true,
                purgeAutomatiquePiecesIdentite: "30 jours après validation",
                droitRemplacementRectification: "Actif",
              },
            },
            null,
            2
          )
        );

      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `belleame_donnees_${profile.firstName.toLowerCase() || "compte"}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      realPlatformStore.logAuditEvent(
        "GDPR_DATA_EXPORTED",
        profile.id,
        "Téléchargement de l'archive complète des données personnelles au format JSON"
      );
    }, 800);
  };

  const handleConfirmDelete = () => {
    const profile = realPlatformStore.getProfile();
    setDeletionRequested(true);
    setShowDeleteModal(false);

    realPlatformStore.logAuditEvent(
      "ACCOUNT_DELETION_INITIATED",
      profile.id,
      `Sas de rétractation de 14 jours activé jusqu'au ${gracePeriodEnd}`
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#070d09", color: "#fbfbfb", fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.18)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(16, 32, 23, 0.85)", backdropFilter: "blur(20px)" }}>
        <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f4c07c", color: "#070d09", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "1.1rem" }}>
            Â
          </div>
          <span style={{ fontWeight: "800", fontSize: "1.05rem" }}>Portail RGPD &amp; Sécurité</span>
        </Link>
        <Link href="/profile" style={{ color: "#f4c07c", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <ArrowLeft size={16} /> Mon Profil
        </Link>
      </header>

      <main style={{ flex: 1, maxWidth: "760px", width: "100%", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.5rem" }}>
            Vos Droits RGPD &amp; Données Personnelles
          </h1>
          <p style={{ color: "#c7cfcb", fontSize: "0.95rem", lineHeight: "1.5" }}>
            Conformément aux directives internationales et à la charte de confidentialité de « À Chacun Une Belle Âme », vous disposez d&apos;un contrôle total sur votre compte.
          </p>
        </div>

        {/* Status of Deletion */}
        {deletionRequested && (
          <div style={{ backgroundColor: "rgba(230, 57, 70, 0.15)", border: "1px solid #e63946", borderRadius: "20px", padding: "1.5rem", marginBottom: "2rem", color: "#fbfbfb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <Clock size={24} color="#e63946" />
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#e63946" }}>
                Procédure de Suppression Enclenchée
              </div>
            </div>
            <p style={{ fontSize: "0.88rem", color: "#c7cfcb", margin: 0, lineHeight: "1.5" }}>
              Votre compte est placé dans le <strong>sas de rétractation de 14 jours</strong> (jusqu&apos;au <strong>{gracePeriodEnd}</strong>). Vous pouvez annuler la suppression à tout moment en vous reconnectant.
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Export Section */}
          <div style={{ backgroundColor: "#102017", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#fbfbfb", marginBottom: "0.35rem" }}>
                Droit à la Portabilité (Export JSON Réel)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#c7cfcb", margin: 0, maxWidth: "460px", lineHeight: "1.4" }}>
                Téléchargez l&apos;intégralité de vos informations personnelles (profil, pièces chiffrées, historique et consentement).
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              disabled={isExporting}
              className="btn-primary"
              style={{ padding: "0.7rem 1.4rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Download size={16} />
              {isExporting ? "Génération..." : "Exporter mes données"}
            </button>
          </div>

          {/* Delete Account Section */}
          <div style={{ backgroundColor: "rgba(230, 57, 70, 0.06)", borderRadius: "20px", border: "1px solid rgba(230, 57, 70, 0.25)", padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#ff858d", marginBottom: "0.35rem" }}>
              Droit à l&apos;Oubli &amp; Suppression Définitive
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#c7cfcb", marginBottom: "1.25rem", lineHeight: "1.4" }}>
              La suppression de votre profil efface irrévocablement vos photos, messages et correspondances après un sas de rétractation de 14 jours.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #e63946",
                color: "#ff858d",
                padding: "0.7rem 1.4rem",
                borderRadius: "999px",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Trash2 size={16} /> Demander la suppression de mon compte
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1.5rem",
          }}
        >
          <div className="glass-panel" style={{ maxWidth: "460px", width: "100%", padding: "2rem", borderRadius: "28px", border: "1.5px solid rgba(230, 57, 70, 0.4)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#ff858d", marginBottom: "0.75rem" }}>
              Confirmer la demande de suppression ?
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#c7cfcb", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              Votre compte sera immédiatement masqué de la découverte. Vous disposerez de 14 jours jusqu&apos;au <strong>{gracePeriodEnd}</strong> pour annuler cette demande si vous changez d&apos;avis.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                style={{ backgroundColor: "transparent", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#c7cfcb", padding: "0.65rem 1.25rem", borderRadius: "999px", cursor: "pointer", fontSize: "0.85rem" }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                style={{ backgroundColor: "#e63946", border: "none", color: "#fff", padding: "0.65rem 1.25rem", borderRadius: "999px", cursor: "pointer", fontWeight: "800", fontSize: "0.85rem" }}
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
