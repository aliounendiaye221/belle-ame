"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Gift,
  CheckCircle2,
  Copy,
  ExternalLink,
  Plus,
  Sparkles,
  Share2,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";

interface PromoCode {
  code: string;
  discount: string;
  redemptions: number;
  maxRedemptions: number;
  status: "ACTIVE" | "PAUSED";
}

export default function GrowthAnalyticsPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    { code: "BIENVENUE-2026", discount: "50% sur le 1er mois Sérénité", redemptions: 0, maxRedemptions: 200, status: "ACTIVE" },
    { code: "ALLIANCE-PRESTIGE", discount: "2 mois offerts sur Formule Annuelle", redemptions: 0, maxRedemptions: 50, status: "ACTIVE" },
    { code: "PARRAIN-NOBLE", discount: "1 semaine Pass Découverte offert", redemptions: 0, maxRedemptions: 500, status: "ACTIVE" },
  ]);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [whatsappMsg, setWhatsappMsg] = useState(
    "Rejoins « À Chacun Une Belle Âme », la communauté matrimoniale certifiée 18+ où chaque profil est vérifié par pièce d'identité officielle : https://belle-ame-web.vercel.app"
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleOpenWhatsAppBroadcast = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(url, "_blank");
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
      <AdminNavbar title="Acquisition & Croissance WhatsApp" subtitle="Campagnes Virales, Liens Directs & Codes Privilège" />

      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        
        {/* Header Title */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "900", margin: 0, color: "#ffffff" }}>
            Leviers d&apos;Acquisition &amp; Croissance Communautaire
          </h1>
          <p style={{ color: "#a0aba4", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
            Diffusion sur les cercles d&apos;influence, parrainage noble et canaux WhatsApp
          </p>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
          
          {/* Module WhatsApp Direct Broadcast */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1.5px solid rgba(82, 183, 136, 0.35)", padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", color: "#52b788" }}>
              <Share2 size={24} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0, color: "#ffffff" }}>
                Générateur de Diffusion WhatsApp
              </h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#a0aba4", marginBottom: "1.25rem", lineHeight: "1.5" }}>
              Préparez un message d&apos;invitation avec lien tracké et lancez directement la diffusion vers les groupes WhatsApp partenaires ou vos contacts clés.
            </p>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "#f4c07c", marginBottom: "6px" }}>
                Texte du Message d&apos;Invitation
              </label>
              <textarea
                rows={4}
                value={whatsappMsg}
                onChange={(e) => setWhatsappMsg(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  backgroundColor: "#070d09",
                  border: "1px solid rgba(212, 163, 115, 0.3)",
                  color: "#fbfbfb",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  lineHeight: "1.5",
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleOpenWhatsAppBroadcast}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                color: "#ffffff",
                fontWeight: "900",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)",
              }}
            >
              <ExternalLink size={18} /> Diffuser sur WhatsApp Maintenant
            </button>
          </div>

          {/* Module Codes Privilèges Actifs */}
          <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.2)", padding: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f4c07c" }}>
                <Gift size={22} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0, color: "#ffffff" }}>
                  Codes Promotionnels Actifs
                </h3>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {promoCodes.map((p) => (
                <div
                  key={p.code}
                  style={{
                    padding: "1rem",
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(212, 163, 115, 0.18)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: "900", color: "#f4c07c", fontSize: "1rem", letterSpacing: "1px" }}>
                        {p.code}
                      </span>
                      <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(82, 183, 136, 0.2)", color: "#52b788", padding: "2px 8px", borderRadius: "999px", fontWeight: "800" }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#c7cfcb", marginTop: "4px" }}>
                      {p.discount}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#a0aba4", marginTop: "2px" }}>
                      {p.redemptions} / {p.maxRedemptions} activations
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(p.code)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      backgroundColor: copiedCode === p.code ? "rgba(82, 183, 136, 0.2)" : "rgba(244, 192, 124, 0.12)",
                      border: copiedCode === p.code ? "1px solid #52b788" : "1px solid rgba(244, 192, 124, 0.3)",
                      color: copiedCode === p.code ? "#52b788" : "#f4c07c",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {copiedCode === p.code ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {copiedCode === p.code ? "Copié !" : "Copier le Code"}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
