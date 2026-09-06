"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Send,
  AlertTriangle,
  ArrowLeft,
  MoreVertical,
  CheckCheck,
  Lock,
  PhoneCall,
  Flag,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import { realPlatformStore, RealMatch, RealMessage } from "@/lib/real-platform-store";

export default function ChatPage({ params }: { params: { matchId: string } }) {
  const [inputText, setInputText] = useState("");
  const [match, setMatch] = useState<RealMatch | null>(null);
  const [showAntiFraudAlert, setShowAntiFraudAlert] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("FINANCIAL_SOLICITATION");
  const [reportSuccess, setReportSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const matches = realPlatformStore.getMatches();
    const found = matches.find((m) => m.id === params.matchId) || matches[0] || null;
    setMatch(found);
    if (found) {
      realPlatformStore.markMatchAsRead(found.id);
    }
  }, [params.matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [match?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !match) return;

    const textToSend = inputText.trim();

    // Détection en temps réel des tentatives d'escroquerie ou de sollicitation financière
    const suspiciousKeywords = [
      "argent",
      "western union",
      "momo",
      "virement",
      "compte bancaire",
      "urgence",
      "prêter",
      "envoyer sous",
      "carte recharge",
    ];
    const hasSuspiciousWord = suspiciousKeywords.some((kw) =>
      textToSend.toLowerCase().includes(kw)
    );

    if (hasSuspiciousWord) {
      setShowAntiFraudAlert(true);
    }

    // Envoi du message réel et persistance dans le store
    const sent = realPlatformStore.sendMessage(match.id, textToSend);

    setMatch({
      ...match,
      messages: [...match.messages, sent],
      lastMessage: textToSend,
      lastMessageTime: sent.timestamp,
    });
    setInputText("");
  };

  const handleReportUser = () => {
    if (!match) return;
    realPlatformStore.logAuditEvent(
      "USER_REPORTED_FROM_CHAT",
      match.candidate.id,
      `Signalement émis par l'interlocuteur dans la conversation ${match.id} (Motif : ${reportReason})`
    );
    setReportSuccess(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess(false);
    }, 2000);
  };

  if (!match) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#070d09",
          color: "#fbfbfb",
          fontFamily: "var(--font-sans)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div className="glass-panel" style={{ textAlign: "center", padding: "2.5rem", borderRadius: "24px", maxWidth: "420px" }}>
          <Info size={40} color="#f4c07c" style={{ margin: "0 auto 1rem" }} />
          <h2 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "0.5rem" }}>Conversation Introuvable</h2>
          <p style={{ color: "#c7cfcb", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Cette conversation n&apos;existe pas ou a été archivée.
          </p>
          <Link href="/matches" className="btn-primary" style={{ textDecoration: "none", display: "inline-block", padding: "10px 20px" }}>
            Retour aux correspondances
          </Link>
        </div>
      </div>
    );
  }

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
      {/* Header Conversation */}
      <header
        style={{
          padding: "0.85rem 1.5rem",
          borderBottom: "1px solid rgba(212, 163, 115, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(18, 34, 25, 0.9)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/matches" style={{ color: "#f4c07c", textDecoration: "none", display: "flex", alignItems: "center" }}>
            <ArrowLeft size={22} />
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ position: "relative" }}>
              <img
                src={match.candidate?.photoUrl}
                alt={match.candidate?.firstName}
                style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #f4c07c" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#52b788",
                  border: "2px solid #070d09",
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontWeight: "800", fontSize: "1rem" }}>{match.candidate?.firstName}</span>
                {match.candidate?.verifiedKyc && <ShieldCheck size={16} color="#52b788" />}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#52b788", fontWeight: "600" }}>
                {match.candidate?.location} • En ligne
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={() => setShowCallModal(true)}
            title="Appel Vocal Sécurisé"
            style={{
              backgroundColor: "rgba(244, 192, 124, 0.12)",
              border: "1px solid rgba(244, 192, 124, 0.3)",
              color: "#f4c07c",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneCall size={17} />
          </button>

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            title="Signaler un comportement inapproprié"
            style={{
              backgroundColor: "rgba(230, 57, 70, 0.12)",
              border: "1px solid rgba(230, 57, 70, 0.3)",
              color: "#ff858d",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flag size={16} />
          </button>
        </div>
      </header>

      {/* Alerte Anti-Fraude & Broutage Lexicale */}
      {showAntiFraudAlert && (
        <div
          style={{
            backgroundColor: "rgba(230, 57, 70, 0.18)",
            borderBottom: "1px solid #e63946",
            padding: "0.75rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            color: "#ff858d",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <AlertTriangle size={18} color="#e63946" />
            <span>
              <strong>Alerte de Sécurité &amp; Pudeur :</strong> N&apos;envoyez jamais d&apos;argent ni de coordonnées bancaires à un membre. Toute tentative d&apos;escroquerie entraîne un bannissement immédiat.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAntiFraudAlert(false)}
            style={{ background: "none", border: "none", color: "#ff858d", cursor: "pointer", fontWeight: "bold" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Zone des Messages */}
      <main
        style={{
          flex: 1,
          maxWidth: "840px",
          width: "100%",
          margin: "0 auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflowY: "auto",
        }}
      >
        {/* Badge de réassurance mutuelle */}
        <div
          style={{
            textAlign: "center",
            backgroundColor: "rgba(244, 192, 124, 0.08)",
            border: "1px dashed rgba(244, 192, 124, 0.25)",
            padding: "0.85rem 1.25rem",
            borderRadius: "16px",
            color: "#c7cfcb",
            fontSize: "0.82rem",
            maxWidth: "500px",
            margin: "0.5rem auto 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <Lock size={15} color="#f4c07c" />
          <span>
            Échange protégé de bout en bout • Accord mutuel confirmé ({match.candidate?.compatibilityScore}% de compatibilité)
          </span>
        </div>

        {match.messages.map((msg) => {
          const isMe = msg.senderId === "me" || msg.senderId === "usr-live-01";
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  backgroundColor: isMe ? "linear-gradient(135deg, #f4c07c, #d4a373)" : "#14231a",
                  background: isMe ? "linear-gradient(135deg, #d4a373, #b08968)" : "#122219",
                  color: isMe ? "#070d09" : "#fbfbfb",
                  padding: "0.85rem 1.15rem",
                  borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  fontSize: "0.92rem",
                  lineHeight: "1.5",
                  fontWeight: isMe ? "600" : "400",
                  border: isMe ? "none" : "1px solid rgba(212, 163, 115, 0.18)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {msg.text}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#8a968f",
                  marginTop: "3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>{msg.timestamp}</span>
                {isMe && <CheckCheck size={13} color="#52b788" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Saisie de Message */}
      <footer
        style={{
          padding: "1rem 1.5rem",
          backgroundColor: "rgba(18, 34, 25, 0.95)",
          borderTop: "1px solid rgba(212, 163, 115, 0.18)",
          backdropFilter: "blur(20px)",
        }}
      >
        <form
          onSubmit={handleSend}
          style={{
            maxWidth: "840px",
            margin: "0 auto",
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Écrire un message d'honneur à ${match.candidate?.firstName}...`}
            style={{
              flex: 1,
              backgroundColor: "#070d09",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              color: "#fbfbfb",
              padding: "0.85rem 1.25rem",
              borderRadius: "999px",
              outline: "none",
              fontSize: "0.92rem",
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              background: inputText.trim() ? "linear-gradient(135deg, #f4c07c, #d4a373)" : "rgba(244, 192, 124, 0.2)",
              color: "#070d09",
              border: "none",
              borderRadius: "50%",
              width: "46px",
              height: "46px",
              cursor: inputText.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </footer>

      {/* Modal d'Appel Vocal Sécurisé */}
      {showCallModal && (
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
          <div
            className="glass-panel"
            style={{
              maxWidth: "460px",
              width: "100%",
              padding: "2rem",
              borderRadius: "28px",
              border: "1.5px solid rgba(212, 163, 115, 0.3)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "rgba(244, 192, 124, 0.15)",
                color: "#f4c07c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <PhoneCall size={28} />
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fbfbfb", marginBottom: "0.5rem" }}>
              Appel Vocal Sécurisé &amp; Pudeur
            </h3>
            <p style={{ color: "#c7cfcb", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Pour garantir la sérénité et le respect des convenances, les appels vocaux cryptés s&apos;activent automatiquement dès que vous avez échangé au moins 10 messages respectueux avec {match.candidate?.firstName}.
            </p>
            <button
              type="button"
              onClick={() => setShowCallModal(false)}
              className="btn-primary"
              style={{ padding: "10px 24px", width: "100%" }}
            >
              Compris, poursuivre les échanges écrits
            </button>
          </div>
        </div>
      )}

      {/* Modal de Signalement Modération */}
      {showReportModal && (
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
          <div
            className="glass-panel"
            style={{
              maxWidth: "460px",
              width: "100%",
              padding: "2rem",
              borderRadius: "28px",
              border: "1.5px solid rgba(230, 57, 70, 0.35)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "#ff858d" }}>
              <Flag size={20} />
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", margin: 0 }}>
                Signaler cette conversation
              </h3>
            </div>
            <p style={{ color: "#c7cfcb", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Nos modérateurs traitent chaque signalement sous 24h avec la plus stricte rigueur.
            </p>

            {reportSuccess ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "#52b788", fontWeight: "700" }}>
                ✅ Signalement transmis avec succès au centre de modération. Merci de protéger notre communauté.
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                    Motif du signalement
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#fff",
                      padding: "0.75rem",
                      borderRadius: "12px",
                      outline: "none",
                      fontSize: "0.85rem",
                    }}
                  >
                    <option value="FINANCIAL_SOLICITATION">Demande d&apos;argent ou sollicitation Mobile Money</option>
                    <option value="INAPPROPRIATE_LANGUAGE">Propos déplacés, vulgaires ou irrespectueux</option>
                    <option value="FAKE_IDENTITY">Suspicion d&apos;usurpation d&apos;identité ou de brouteur</option>
                    <option value="OFF_TOPIC">Non-respect de l&apos;intention matrimoniale sérieuse</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#c7cfcb",
                      padding: "0.65rem 1.25rem",
                      borderRadius: "999px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleReportUser}
                    style={{
                      backgroundColor: "#e63946",
                      border: "none",
                      color: "#fff",
                      padding: "0.65rem 1.25rem",
                      borderRadius: "999px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                    }}
                  >
                    Confirmer le signalement
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
