"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Heart, ShieldCheck, MessageCircle, Crown, Check, Trash2, Filter } from "lucide-react";

interface Notification {
  id: string;
  type: "MATCH" | "MESSAGE" | "KYC" | "SECURITY" | "PROMO" | "SYSTEM";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n-001",
      type: "MATCH",
      title: "Nouvelle affinité détectée 💫",
      body: "Grace (94% de compatibilité) a également exprimé un intérêt. Vous avez un Match !",
      timestamp: "Il y a 5 min",
      read: false,
      actionUrl: "/matches"
    },
    {
      id: "n-002",
      type: "MESSAGE",
      title: "Nouveau message de Bertrand",
      body: "« Bonjour ! J'ai beaucoup aimé votre profil, seriez-vous disponible pour... »",
      timestamp: "Il y a 22 min",
      read: false,
      actionUrl: "/chat/match-002"
    },
    {
      id: "n-003",
      type: "KYC",
      title: "Vérification d'identité validée ✅",
      body: "Votre pièce d'identité a été approuvée par notre équipe de modération. Votre profil affiche désormais le badge 🛡️.",
      timestamp: "Il y a 1h",
      read: true
    },
    {
      id: "n-004",
      type: "SECURITY",
      title: "⚠️ Alerte de sécurité",
      body: "Une nouvelle connexion a été détectée depuis Douala, Cameroun (iPhone 15 Pro). Si ce n'est pas vous, changez votre mot de passe immédiatement.",
      timestamp: "Il y a 3h",
      read: true
    },
    {
      id: "n-005",
      type: "PROMO",
      title: "🎁 Offre Pionnière WhatsApp",
      body: "En tant que membre de la communauté WhatsApp 9 000+, bénéficiez de votre premier mois Premium OFFERT avec le code WA-COMMUNITY-9000.",
      timestamp: "Hier",
      read: true
    },
    {
      id: "n-006",
      type: "SYSTEM",
      title: "Mise à jour de notre politique de confidentialité",
      body: "Nous avons actualisé nos CGU conformément au RGPD. Consultez les changements dans Paramètres > Confidentialité.",
      timestamp: "Il y a 2 jours",
      read: true,
      actionUrl: "/settings/privacy"
    }
  ]);

  interface TypeConfigItem {
    icon: React.ReactNode;
    color: string;
    label: string;
  }

  const fallbackConfig: TypeConfigItem = { icon: <Bell size={18} />, color: "#8a968f", label: "Système" };

  const typeConfig: Record<string, TypeConfigItem> = {
    MATCH: { icon: <Heart size={18} />, color: "#e07a5f", label: "Match" },
    MESSAGE: { icon: <MessageCircle size={18} />, color: "#52b788", label: "Message" },
    KYC: { icon: <ShieldCheck size={18} />, color: "#d4a373", label: "KYC" },
    SECURITY: { icon: <ShieldCheck size={18} />, color: "#e63946", label: "Sécurité" },
    PROMO: { icon: <Crown size={18} />, color: "#f4a261", label: "Promo" },
    SYSTEM: fallbackConfig
  };

  const filtered = filter === "ALL" ? notifications : notifications.filter((n: Notification) => n.type === filter);
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n: Notification) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n: Notification) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n: Notification) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #d4a373, #e07a5f)", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.1rem" }}>Â</div>
          </Link>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Notifications</div>
            <div style={{ fontSize: "0.7rem", color: "#52b788" }}>
              {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est à jour ✓"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background: "rgba(82, 183, 136, 0.15)", border: "1px solid rgba(82, 183, 136, 0.3)", color: "#52b788", padding: "8px 16px", borderRadius: "999px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={14} /> Tout marquer lu
            </button>
          )}
          <Link href="/discover" style={{ background: "rgba(212, 163, 115, 0.1)", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#d4a373", padding: "8px 16px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: "600" }}>
            Découvrir
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {[
            { key: "ALL", label: "Toutes" },
            { key: "MATCH", label: "Matchs" },
            { key: "MESSAGE", label: "Messages" },
            { key: "KYC", label: "KYC" },
            { key: "SECURITY", label: "Sécurité" },
            { key: "PROMO", label: "Promos" },
          ].map((f: { key: string; label: string }) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                border: filter === f.key ? "1px solid #d4a373" : "1px solid rgba(255,255,255,0.1)",
                background: filter === f.key ? "rgba(212, 163, 115, 0.2)" : "rgba(255,255,255,0.03)",
                color: filter === f.key ? "#d4a373" : "#8a968f",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#8a968f" }}>
              <Bell size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <p style={{ fontWeight: "600" }}>Aucune notification dans cette catégorie</p>
            </div>
          )}

          {filtered.map((n: Notification) => {
            const cfg: TypeConfigItem = typeConfig[n.type] ?? fallbackConfig;
            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "14px",
                  background: n.read ? "rgba(26, 46, 34, 0.4)" : "rgba(26, 46, 34, 0.8)",
                  border: n.read ? "1px solid rgba(212, 163, 115, 0.08)" : "1px solid rgba(212, 163, 115, 0.25)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative"
                }}
              >
                {/* Unread dot */}
                {!n.read && (
                  <div style={{ position: "absolute", top: "12px", right: "12px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#52b788", boxShadow: "0 0 8px rgba(82, 183, 136, 0.5)" }} />
                )}

                {/* Icon */}
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: `${cfg.color}20`,
                  border: `1px solid ${cfg.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: cfg.color,
                  flexShrink: 0
                }}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ fontWeight: n.read ? "500" : "700", fontSize: "0.9rem", lineHeight: "1.3" }}>{n.title}</div>
                    <span style={{ fontSize: "0.7rem", color: "#8a968f", whiteSpace: "nowrap", flexShrink: 0 }}>{n.timestamp}</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#c2c9c4", marginTop: "4px", lineHeight: "1.4" }}>{n.body}</p>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: "999px", backgroundColor: `${cfg.color}15`, color: cfg.color, fontWeight: "600", border: `1px solid ${cfg.color}30` }}>
                      {cfg.label}
                    </span>
                    {n.actionUrl && (
                      <Link href={n.actionUrl} style={{ fontSize: "0.75rem", color: "#d4a373", fontWeight: "600" }}>
                        Voir →
                      </Link>
                    )}
                    <button
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteNotification(n.id); }}
                      style={{ marginLeft: "auto", background: "none", border: "none", color: "#8a968f", cursor: "pointer", padding: "4px", display: "flex" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
