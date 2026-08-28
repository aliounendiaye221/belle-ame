"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Download, Trash2, Lock, AlertTriangle, ArrowLeft, Clock } from "lucide-react";

export default function PrivacyPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        exportDate: new Date().toISOString(),
        profile: { firstName: "Aminata", phone: "+237699000000", verifiedKyc: true },
        chatLogsCount: 42,
        rgpdConsentTimestamp: "2026-08-01T10:00:00Z"
      }));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "belleame_donnees_personnelles.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }, 1000);
  };

  const handleConfirmDelete = () => {
    setDeletionRequested(true);
    setShowDeleteModal(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <header style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>Portail RGPD & Sécurité</span>
        </Link>
        <Link href="/profile" style={{ color: "#d4a373", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <ArrowLeft size={16} /> Mon Profil
        </Link>
      </header>

      <main style={{ flex: 1, maxWidth: "760px", width: "100%", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "0.5rem" }}>Vos Droits RGPD & Données Personnelles</h1>
          <p style={{ color: "#a0aba4", fontSize: "0.95rem" }}>
            Conformément à la réglementation européenne et africaine sur la protection des données, vous disposez d'un contrôle total sur votre compte.
          </p>
        </div>

        {/* Status of Deletion */}
        {deletionRequested && (
          <div style={{ backgroundColor: "rgba(230, 57, 70, 0.15)", border: "1px solid #e63946", borderRadius: "20px", padding: "1.5rem", marginBottom: "2rem", color: "#f8f9fa" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <Clock size={24} color="#e63946" />
              <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#e63946" }}>Procédure de Suppression Enclenchée</div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#c2c9c4", margin: 0, lineHeight: "1.5" }}>
              Votre compte est placé dans le <strong>sas de rétractation de 14 jours</strong> (jusqu'au 11 Septembre 2026). Vous pouvez annuler la suppression à tout moment en vous re-connectant.
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Export Section */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.35rem" }}>Droit à la Portabilité (Export JSON)</h3>
              <p style={{ fontSize: "0.85rem", color: "#a0aba4", margin: 0 }}>
                Téléchargez l'intégralité de vos données de profil, préférences et métadonnées d'échanges.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              style={{
                backgroundColor: "rgba(212, 163, 115, 0.15)",
                border: "1px solid #d4a373",
                color: "#d4a373",
                padding: "0.75rem 1.25rem",
                borderRadius: "15px",
                fontWeight: "700",
                cursor: isExporting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Download size={18} /> {isExporting ? "Génération..." : "Télécharger mon archive"}
            </button>
          </div>

          {/* SMS Security Locked Section */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "20px", border: "1px solid rgba(82, 183, 136, 0.3)", padding: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Alertes SMS de Sécurité <Lock size={16} color="#52b788" />
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#a0aba4", margin: 0 }}>
                Les notifications SMS pour les tentatives de connexion inconnues sont <strong>verrouillées actives</strong> par sécurité.
              </p>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#52b788", backgroundColor: "rgba(82, 183, 136, 0.15)", padding: "0.4rem 0.8rem", borderRadius: "12px", fontWeight: "700" }}>
              Actif (Obligatoire)
            </span>
          </div>

          {/* Delete Account Section */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "20px", border: "1px solid rgba(230, 57, 70, 0.3)", padding: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#e63946", marginBottom: "0.35rem" }}>Droit à l'Oubli (Suppression Définitive)</h3>
              <p style={{ fontSize: "0.85rem", color: "#a0aba4", margin: 0 }}>
                Supprimez définitivement votre profil et vos photos. Sas de rétraction de 14 jours appliqué.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                backgroundColor: "rgba(230, 57, 70, 0.15)",
                border: "1px solid #e63946",
                color: "#e63946",
                padding: "0.75rem 1.25rem",
                borderRadius: "15px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Trash2 size={18} /> Demander la suppression
            </button>
          </div>

        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", zIndex: 100 }}>
            <div style={{ maxWidth: "460px", width: "100%", backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid #e63946", padding: "2rem" }}>
              <AlertTriangle size={40} color="#e63946" style={{ marginBottom: "1rem" }} />
              <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#ffffff", marginBottom: "0.5rem" }}>Confirmer la Demande de Suppression</h2>
              <p style={{ color: "#c2c9c4", fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                Votre compte sera désactivé immédiatement et vos données seront purgées après un <strong>délai de grâce obligatoire de 14 jours</strong>. Souhaitez-vous continuer ?
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{ flex: 1, backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem", borderRadius: "15px", fontWeight: "600", cursor: "pointer" }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  style={{ flex: 1, backgroundColor: "#e63946", border: "none", color: "#fff", padding: "0.8rem", borderRadius: "15px", fontWeight: "700", cursor: "pointer" }}
                >
                  Confirmer la suppression
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
