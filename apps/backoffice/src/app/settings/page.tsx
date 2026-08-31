"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, Shield, Bell, Database, Globe, Lock, Mail, Save, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { UserButton } from "@/lib/clerk-admin";

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: string;
}

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<SettingToggle[]>([
    { id: "panafrican-all-countries", label: "Ouverture 54 Pays Panafricains", description: "Autoriser l'inscription et la vérification des célibataires de l'ensemble des 54 nations d'Afrique et de la diaspora.", enabled: true, category: "Croissance" },
    { id: "kyc-auto-reject", label: "Rejet KYC Automatique", description: "Rejeter automatiquement les soumissions KYC avec un score de similarité faciale inférieur à 60%.", enabled: true, category: "Modération" },
    { id: "anti-broutage", label: "Détection Anti-Broutage", description: "Activer la détection automatique de mots-clés financiers suspects dans les conversations.", enabled: true, category: "Sécurité" },
    { id: "sla-alert", label: "Alertes SLA Modération", description: "Envoyer une alerte à l'équipe si un signalement dépasse 18 heures sans traitement.", enabled: true, category: "Modération" },
    { id: "auto-ban-repeat", label: "Bannissement Auto Récidive", description: "Bannir automatiquement un utilisateur après 3 sanctions de niveau 5+ en 90 jours.", enabled: false, category: "Modération" },
    { id: "rgpd-export", label: "Export RGPD Utilisateur", description: "Permettre aux utilisateurs de télécharger l'intégralité de leurs données au format JSON.", enabled: true, category: "Conformité" },
    { id: "deletion-grace", label: "Délai de Grâce Suppression", description: "Appliquer un délai de 14 jours avant la suppression définitive des comptes.", enabled: true, category: "Conformité" },
    { id: "email-notif", label: "Notifications Email Admin", description: "Envoyer un résumé quotidien des KPIs et signalements critiques par email.", enabled: false, category: "Notifications" },
    { id: "whatsapp-sync", label: "Sync Communauté WhatsApp", description: "Synchroniser les codes promo pionniers avec les groupes WhatsApp communautaires.", enabled: true, category: "Croissance" },
    { id: "maintenance-mode", label: "Mode Maintenance", description: "Activer le mode maintenance — tous les utilisateurs verront une page de maintenance.", enabled: false, category: "Système" },
    { id: "audit-ip-log", label: "Logging IP Admin", description: "Enregistrer l'adresse IP de chaque action admin dans le journal d'audit immuable.", enabled: true, category: "Sécurité" }
  ]);

  const categories = Array.from(new Set(settings.map((s: SettingToggle) => s.category)));

  const categoryIcons: Record<string, React.ReactNode> = {
    "Modération": <Shield size={18} />,
    "Sécurité": <Lock size={18} />,
    "Conformité": <Database size={18} />,
    "Notifications": <Bell size={18} />,
    "Croissance": <Globe size={18} />,
    "Système": <Settings size={18} />
  };

  const toggleSetting = (id: string) => {
    setSettings(settings.map((s: SettingToggle) => s.id === id ? { ...s, enabled: !s.enabled } : s));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif" }}>

      {/* Admin Navbar */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>Â</div>
          </Link>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Paramètres Administration</div>
            <div style={{ fontSize: "0.7rem", color: "#52b788", fontWeight: "600" }}>⚙️ Configuration Plateforme</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={handleSave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 20px",
              borderRadius: "999px",
              background: saved ? "rgba(82, 183, 136, 0.2)" : "linear-gradient(135deg, #d4a373, #e07a5f)",
              border: saved ? "1px solid rgba(82, 183, 136, 0.4)" : "none",
              color: saved ? "#52b788" : "#0b130e",
              fontWeight: "700",
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            {saved ? <><CheckCircle2 size={16} /> Sauvegardé !</> : <><Save size={16} /> Sauvegarder</>}
          </button>
          <UserButton />
        </div>
      </header>

      <div style={{ padding: "1.5rem 2rem", maxWidth: "900px", margin: "0 auto" }}>

        {/* Navigation breadcrumb */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { href: "/", label: "Dashboard" },
            { href: "/kyc", label: "KYC" },
            { href: "/moderation", label: "Modération" },
            { href: "/users", label: "Utilisateurs" },
            { href: "/analytics", label: "Analytics" },
            { href: "/growth", label: "Croissance" },
            { href: "/audit", label: "Audit" },
            { href: "/settings", label: "Paramètres" }
          ].map((link: { href: string; label: string }) => (
            <Link key={link.href} href={link.href} style={{
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: "600",
              backgroundColor: link.href === "/settings" ? "rgba(212, 163, 115, 0.2)" : "rgba(255,255,255,0.03)",
              color: link.href === "/settings" ? "#d4a373" : "#8a968f",
              border: link.href === "/settings" ? "1px solid rgba(212, 163, 115, 0.3)" : "1px solid rgba(255,255,255,0.06)"
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Settings by Category */}
        {categories.map((category: string) => (
          <div key={category} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(212, 163, 115, 0.1)" }}>
              <div style={{ color: "#d4a373" }}>{categoryIcons[category]}</div>
              <h2 style={{ fontWeight: "700", fontSize: "1rem" }}>{category}</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {settings.filter((s: SettingToggle) => s.category === category).map((setting: SettingToggle) => (
                <div
                  key={setting.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    borderRadius: "14px",
                    background: "rgba(26, 46, 34, 0.4)",
                    border: setting.id === "maintenance-mode" && setting.enabled
                      ? "1px solid rgba(230, 57, 70, 0.4)"
                      : "1px solid rgba(212, 163, 115, 0.08)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{setting.label}</span>
                      {setting.id === "maintenance-mode" && setting.enabled && (
                        <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: "999px", backgroundColor: "rgba(230, 57, 70, 0.15)", color: "#e63946", fontWeight: "600", border: "1px solid rgba(230, 57, 70, 0.3)" }}>
                          ⚠️ ACTIF
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#8a968f", marginTop: "2px", lineHeight: "1.4" }}>{setting.description}</p>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: setting.enabled ? "#52b788" : "#8a968f",
                      display: "flex",
                      flexShrink: 0,
                      transition: "color 0.2s ease"
                    }}
                  >
                    {setting.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger zone */}
        <div style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "18px", border: "1px solid rgba(230, 57, 70, 0.3)", backgroundColor: "rgba(230, 57, 70, 0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <AlertTriangle size={18} style={{ color: "#e63946" }} />
            <h3 style={{ fontWeight: "700", fontSize: "0.95rem", color: "#e63946" }}>Zone Dangereuse</h3>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#c2c9c4", lineHeight: "1.5", marginBottom: "1rem" }}>
            Les actions ci-dessous sont irréversibles et nécessitent une confirmation à deux facteurs.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button style={{ padding: "8px 18px", borderRadius: "999px", border: "1px solid rgba(230, 57, 70, 0.4)", background: "rgba(230, 57, 70, 0.1)", color: "#e63946", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer" }}>
              Purger le Cache Global
            </button>
            <button style={{ padding: "8px 18px", borderRadius: "999px", border: "1px solid rgba(230, 57, 70, 0.4)", background: "rgba(230, 57, 70, 0.1)", color: "#e63946", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer" }}>
              Réinitialiser les Sessions Admin
            </button>
            <button style={{ padding: "8px 18px", borderRadius: "999px", border: "1px solid rgba(230, 57, 70, 0.4)", background: "rgba(230, 57, 70, 0.1)", color: "#e63946", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer" }}>
              Export Audit Complet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
