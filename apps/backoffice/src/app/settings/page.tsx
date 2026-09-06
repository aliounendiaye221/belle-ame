"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Shield,
  Bell,
  Database,
  Globe,
  Lock,
  Mail,
  Save,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { backofficeStore } from "@/lib/backoffice-store";

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: string;
}

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const [settings, setSettings] = useState<SettingToggle[]>([
    { id: "panafrican-all-countries", label: "Ouverture 54 Pays Panafricains", description: "Autoriser l'inscription et la vérification des célibataires de l'ensemble des 54 nations d'Afrique et de la diaspora.", enabled: true, category: "Croissance" },
    { id: "kyc-auto-reject", label: "Contrôle Strict de Majorité 18+", description: "Bloquer et rejeter automatiquement toute tentative de profil d'un mineur.", enabled: true, category: "Modération" },
    { id: "anti-broutage", label: "Détection Anti-Broutage en Direct", description: "Activer la détection automatique des mots-clés financiers suspects dans le chat.", enabled: true, category: "Sécurité" },
    { id: "sla-alert", label: "Alerte SLA Modération &lt; 24h", description: "Avertir les modérateurs assermentés si un dossier dépasse 18h sans traitement.", enabled: true, category: "Modération" },
    { id: "rgpd-export", label: "Portail Export RGPD Utilisateur", description: "Permettre aux membres de télécharger l'intégralité de leurs données chiffrées en JSON.", enabled: true, category: "Conformité" },
    { id: "audit-ip-log", label: "Horodatage Immuable & Logging IP", description: "Enregistrer l'adresse IP et l'horodatage de chaque action dans le registre d'audit.", enabled: true, category: "Sécurité" }
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    setSaved(false);
  };

  const handleSave = () => {
    backofficeStore.logAudit(
      "SETTINGS_UPDATED",
      "SYSTEM_CONFIG",
      "Mise à jour des paramètres de sécurité et des règles de modération SLA."
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDemoData = () => {
    backofficeStore.resetToDefault();
    setResetFeedback("Données de production réinitialisées avec succès !");
    setTimeout(() => {
      setResetFeedback(null);
      window.location.reload();
    }, 1500);
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
      <AdminNavbar title="Paramètres Plateforme" subtitle="Configuration Système, SLA &amp; Règles de Sécurité" />

      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "980px", width: "100%", margin: "0 auto" }}>
        
        {/* Header Title & Save Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "900", margin: 0, color: "#ffffff" }}>
              Configuration Globale de la Plateforme
            </h1>
            <p style={{ color: "#a0aba4", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
              Règles d&apos;intégrité, seuils SLA et paramètres de conformité légale
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "14px",
              background: saved ? "rgba(82, 183, 136, 0.2)" : "linear-gradient(135deg, #f4c07c 0%, #d4a373 100%)",
              border: saved ? "1px solid #52b788" : "none",
              color: saved ? "#52b788" : "#070d09",
              fontWeight: "900",
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(212, 163, 115, 0.3)",
            }}
          >
            {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saved ? "Modifications Enregistrées !" : "Enregistrer les Réglages"}
          </button>
        </div>

        {/* Feedback Alerts */}
        {resetFeedback && (
          <div style={{ padding: "1rem", borderRadius: "14px", backgroundColor: "rgba(82, 183, 136, 0.15)", border: "1px solid #52b788", color: "#52b788", marginBottom: "1.5rem", fontWeight: "700" }}>
            {resetFeedback}
          </div>
        )}

        {/* Settings Toggle List */}
        <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.75rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {settings.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1.5rem",
                  paddingBottom: "1.25rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div>
                  <div style={{ fontWeight: "800", fontSize: "1rem", color: "#ffffff", marginBottom: "4px" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#a0aba4", lineHeight: "1.4" }}>
                    {s.description}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSetting(s.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: s.enabled ? "#52b788" : "#6b7a72",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {s.enabled ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency System Reset Section */}
        <div style={{ backgroundColor: "rgba(230, 57, 70, 0.06)", border: "1px solid rgba(230, 57, 70, 0.3)", borderRadius: "24px", padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ff858d", marginBottom: "0.5rem" }}>
            <AlertTriangle size={22} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", margin: 0 }}>
              Zone de Réinitialisation des Données
            </h3>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#c7cfcb", marginBottom: "1.25rem", lineHeight: "1.5" }}>
            Permet de réinitialiser le registre local vers la graine initiale propre de démonstration et restaurer les files KYC et de modération.
          </p>
          <button
            type="button"
            onClick={handleResetDemoData}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: "1px solid #e63946",
              backgroundColor: "rgba(230, 57, 70, 0.15)",
              color: "#ff858d",
              fontWeight: "800",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCcw size={15} /> Réinitialiser les Données du Back-Office
          </button>
        </div>

      </main>
    </div>
  );
}
