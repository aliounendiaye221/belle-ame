"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  MessageCircle,
  Clock,
  CheckCheck,
  Sparkles,
  Lock,
  ArrowRight,
  Filter,
  AlertTriangle,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";

interface ConversationItem {
  id: string;
  matchId: string;
  partnerName: string;
  age: number;
  location: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  compatibilityScore: number;
  isVerified: boolean;
  isOnline: boolean;
  activeAgreement: boolean;
}

import { realPlatformStore, RealMatch } from "@/lib/real-platform-store";

export default function ChatInboxPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "UNREAD" | "VERIFIED">("ALL");
  const [matches, setMatches] = useState<RealMatch[]>([]);

  React.useEffect(() => {
    setMatches(realPlatformStore.getMatches());
  }, []);

  const conversations: ConversationItem[] = matches.map((m) => ({
    id: m.id,
    matchId: m.id,
    partnerName: m.candidate?.firstName || "Membre",
    age: m.candidate?.age || 26,
    location: m.candidate?.location || "Afrique",
    avatarUrl: m.candidate?.photoUrl || "/images/avatar-woman.jpg",
    lastMessage: m.lastMessage || "Conversation active.",
    lastMessageTime: m.lastMessageTime || "Aujourd'hui",
    unreadCount: m.unread ? 1 : 0,
    compatibilityScore: m.candidate?.compatibilityScore || 95,
    isVerified: m.candidate?.verifiedKyc || true,
    isOnline: true,
    activeAgreement: true,
  }));

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === "UNREAD") return c.unreadCount > 0;
    if (activeFilter === "VERIFIED") return c.isVerified;
    return true;
  });

  const totalUnread = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

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

      {/* Top Navbar */}
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

        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/discover" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Découverte
          </Link>
          <Link href="/matches" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Correspondances
          </Link>
          <Link
            href="/chat"
            style={{
              color: "#f4c07c",
              fontWeight: "700",
              textDecoration: "none",
              borderBottom: "2px solid #f4c07c",
              paddingBottom: "0.25rem",
              fontSize: "0.92rem",
            }}
          >
            Messages {totalUnread > 0 && `(${totalUnread})`}
          </Link>
          <Link href="/subscription" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Offres
          </Link>
          <Link href="/profile" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Profil
          </Link>
        </nav>
      </header>

      {/* Main Inbox Container */}
      <main style={{ flex: 1, padding: "2.5rem 1.5rem", maxWidth: "860px", width: "100%", margin: "0 auto" }}>
        
        {/* Header Title & Anti-Fraud Notice */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.75rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#fbfbfb", margin: 0 }}>
                Messagerie & Échanges Purs
              </h1>
              <p style={{ color: "#8a968f", fontSize: "0.92rem", marginTop: "4px", marginBottom: 0 }}>
                Conversations respectueuses chiffrées réservées aux membres mutuellement consentants.
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "999px",
                backgroundColor: "rgba(82, 183, 136, 0.12)",
                border: "1px solid rgba(82, 183, 136, 0.3)",
                color: "#52b788",
                fontSize: "0.8rem",
                fontWeight: "700",
              }}
            >
              <ShieldCheck size={16} /> Modération SLA &lt; 24h Active
            </div>
          </div>

          {/* Anti-Broutage Awareness Banner */}
          <div
            style={{
              backgroundColor: "rgba(244, 162, 97, 0.1)",
              border: "1px solid rgba(244, 162, 97, 0.3)",
              borderRadius: "16px",
              padding: "0.85rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#f4a261",
              fontSize: "0.85rem",
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>
              <strong>Règle d&apos;or de la communauté :</strong> Ne communiquez aucun code Mobile Money ni information bancaire. Tout échange suspect est automatiquement intercepté.
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              minWidth: "240px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(16, 32, 23, 0.7)",
              border: "1px solid rgba(212, 163, 115, 0.25)",
              borderRadius: "16px",
              padding: "0.75rem 1.2rem",
            }}
          >
            <Search size={18} color="#8a968f" />
            <input
              type="text"
              placeholder="Rechercher une correspondance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "0.92rem",
                width: "100%",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setActiveFilter("ALL")}
              style={{
                padding: "0.75rem 1.2rem",
                borderRadius: "16px",
                border: activeFilter === "ALL" ? "1px solid #f4c07c" : "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: activeFilter === "ALL" ? "rgba(244, 192, 124, 0.15)" : "rgba(16, 32, 23, 0.7)",
                color: activeFilter === "ALL" ? "#f4c07c" : "#8a968f",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveFilter("UNREAD")}
              style={{
                padding: "0.75rem 1.2rem",
                borderRadius: "16px",
                border: activeFilter === "UNREAD" ? "1px solid #52b788" : "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: activeFilter === "UNREAD" ? "rgba(82, 183, 136, 0.15)" : "rgba(16, 32, 23, 0.7)",
                color: activeFilter === "UNREAD" ? "#52b788" : "#8a968f",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Non lus ({totalUnread})
            </button>
            <button
              onClick={() => setActiveFilter("VERIFIED")}
              style={{
                padding: "0.75rem 1.2rem",
                borderRadius: "16px",
                border: activeFilter === "VERIFIED" ? "1px solid #f4c07c" : "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: activeFilter === "VERIFIED" ? "rgba(244, 192, 124, 0.15)" : "rgba(16, 32, 23, 0.7)",
                color: activeFilter === "VERIFIED" ? "#f4c07c" : "#8a968f",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              🛡️ Certifiés KYC
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {filteredConversations.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                backgroundColor: "rgba(16, 32, 23, 0.5)",
                borderRadius: "24px",
                border: "1px dashed rgba(212, 163, 115, 0.25)",
              }}
            >
              <MessageCircle size={48} color="#8a968f" style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#fbfbfb", marginBottom: "0.5rem" }}>
                Zéro faux message • Aucune discussion simulée
              </h3>
              <p style={{ color: "#8a968f", fontSize: "0.9rem", maxWidth: "440px", margin: "0 auto 1.5rem", lineHeight: "1.5" }}>
                Vos échanges seront 100% réels avec des membres certifiés ayant mutuellement liké votre profil.
              </p>
              <Link
                href="/discover"
                className="btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
              >
                <Sparkles size={16} /> Explorer la Découverte Réelle
              </Link>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.matchId}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.2rem",
                  padding: "1.2rem 1.5rem",
                  borderRadius: "20px",
                  backgroundColor: conv.unreadCount > 0 ? "rgba(20, 35, 26, 0.95)" : "rgba(16, 32, 23, 0.6)",
                  border: conv.unreadCount > 0 ? "1.5px solid rgba(244, 192, 124, 0.4)" : "1px solid rgba(212, 163, 115, 0.15)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  boxShadow: conv.unreadCount > 0 ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
                }}
              >
                {/* Avatar with Online indicator */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={conv.avatarUrl}
                    alt={conv.partnerName}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #d4a373",
                    }}
                  />
                  {conv.isOnline && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        right: "2px",
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: "#52b788",
                        border: "2px solid #070d09",
                      }}
                    />
                  )}
                </div>

                {/* Partner Info & Preview */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "1.05rem", fontWeight: "800", color: "#fbfbfb" }}>
                        {conv.partnerName}, {conv.age}
                      </span>
                      {conv.isVerified && <ShieldCheck size={16} color="#52b788" />}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#f4c07c",
                          backgroundColor: "rgba(244, 192, 124, 0.15)",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontWeight: "700",
                        }}
                      >
                        {conv.compatibilityScore}% Affinité
                      </span>
                    </div>

                    <span style={{ fontSize: "0.78rem", color: conv.unreadCount > 0 ? "#f4c07c" : "#8a968f", fontWeight: conv.unreadCount > 0 ? "700" : "500" }}>
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "#8a968f", marginBottom: "4px" }}>
                    {conv.location}
                  </div>

                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: conv.unreadCount > 0 ? "#fbfbfb" : "#a0aba4",
                      fontWeight: conv.unreadCount > 0 ? "700" : "400",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Unread badge & Action */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                  {conv.unreadCount > 0 ? (
                    <span
                      style={{
                        backgroundColor: "#f4c07c",
                        color: "#070d09",
                        fontSize: "0.75rem",
                        fontWeight: "900",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {conv.unreadCount}
                    </span>
                  ) : (
                    <CheckCheck size={18} color="#52b788" />
                  )}
                  <ArrowRight size={16} color="#d4a373" />
                </div>
              </Link>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
