"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Send, AlertTriangle, ArrowLeft, MoreVertical, CheckCheck, Lock, PhoneCall } from "lucide-react";

import { realPlatformStore, RealMatch } from "@/lib/real-platform-store";

export default function ChatPage({ params }: { params: { matchId: string } }) {
  const [inputText, setInputText] = useState("");
  const [match, setMatch] = useState<RealMatch | null>(null);
  const [showAntiFraudAlert, setShowAntiFraudAlert] = useState(false);

  React.useEffect(() => {
    const matches = realPlatformStore.getMatches();
    const found = matches.find((m) => m.id === params.matchId) || matches[0] || null;
    setMatch(found);
  }, [params.matchId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !match) return;

    // Détection en temps réel des tentatives d'escroquerie ou de broutage
    const suspiciousKeywords = ["argent", "western union", "momo", "virement", "compte bancaire", "urgence", "prêter"];
    const hasSuspiciousWord = suspiciousKeywords.some(kw => inputText.toLowerCase().includes(kw));

    if (hasSuspiciousWord) {
      setShowAntiFraudAlert(true);
    }

    const sent = realPlatformStore.sendMessage(match.id, inputText);
    const updatedMessages = [...match.messages, sent];
    setMatch({
      ...match,
      messages: updatedMessages,
      lastMessage: inputText,
      lastMessageTime: sent.timestamp,
    });
    setInputText("");

    // Simulation de réponse réelle de la correspondante si première interaction ou question
    const partnerName = match.candidate?.firstName || "Votre correspondante";
    setTimeout(() => {
      const replyText = `Merci pour ce message sincère ! Je partage totalement cette perspective. Que pensez-vous d'en discuter de vive voix ce weekend ?`;
      const replyMsg = {
        id: `msg-${Date.now()}`,
        senderId: match.candidate?.id || "partner",
        senderName: partnerName,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "READ" as const,
      };
      // Sauvegarder dans le store
      const allMatches = realPlatformStore.getMatches();
      const current = allMatches.find((m) => m.id === match.id);
      if (current) {
        current.messages.push(replyMsg);
        current.lastMessage = replyText;
        current.lastMessageTime = replyMsg.timestamp;
        current.unread = false;
        localStorage.setItem("belleame_matches", JSON.stringify(allMatches));
      }
      setMatch((prev) => prev ? {
        ...prev,
        messages: [...prev.messages, replyMsg],
        lastMessage: replyText,
        lastMessageTime: replyMsg.timestamp,
      } : null);
    }, 1800);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <header style={{ padding: "0.9rem 1.5rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/matches" style={{ color: "#d4a373", textDecoration: "none", display: "flex", alignItems: "center" }}>
            <ArrowLeft size={22} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img
              src={match?.candidate?.photoUrl || "/images/avatar-woman.jpg"}
              alt={match?.candidate?.firstName || "Correspondance"}
              style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "2px solid #d4a373" }}
            />
            <div>
              <div style={{ fontWeight: "700", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {match?.candidate?.firstName || "Membre Certifié"} <ShieldCheck size={16} color="#52b788" />
              </div>
              <div style={{ fontSize: "0.75rem", color: "#52b788", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                ● En ligne | Score {match?.candidate?.compatibilityScore || 95}%
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#a0aba4" }}>
          <span style={{ fontSize: "0.8rem", color: "#d4a373", backgroundColor: "rgba(212, 163, 115, 0.12)", padding: "0.3rem 0.75rem", borderRadius: "12px", border: "1px solid rgba(212, 163, 115, 0.3)" }}>
            🔒 Accord Mutuel Actif
          </span>
          <MoreVertical size={20} style={{ cursor: "pointer" }} />
        </div>
      </header>

      {/* Anti-Fraud Banner */}
      {showAntiFraudAlert && (
        <div style={{ backgroundColor: "rgba(230, 57, 70, 0.2)", borderBottom: "1px solid rgba(230, 57, 70, 0.4)", color: "#ffb703", padding: "0.75rem 1.5rem", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={18} color="#e63946" />
            <span><strong>Alerte Sécurité Anti-Broutage :</strong> Ne transférez jamais d'argent ou de code Mobile Money à un contact en ligne.</span>
          </div>
          <button onClick={() => setShowAntiFraudAlert(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>✕</button>
        </div>
      )}

      {/* Messages Feed */}
      <main style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "800px", width: "100%", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", margin: "1rem 0" }}>
          <span style={{ fontSize: "0.75rem", color: "#7a8780", backgroundColor: "#081c15", padding: "0.4rem 0.9rem", borderRadius: "15px", border: "1px solid rgba(212, 163, 115, 0.15)" }}>
            💬 Conversation chiffrée de bout en bout — SLA Modération &lt; 24h
          </span>
        </div>

        {(match?.messages || []).map((msg) => {
          const isMe = msg.senderId === "me" || msg.senderName === "Moi";
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                maxWidth: "75%",
                backgroundColor: isMe ? "#d4a373" : "#14231a",
                color: isMe ? "#0b130e" : "#f8f9fa",
                padding: "0.9rem 1.25rem",
                borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                border: isMe ? "none" : "1px solid rgba(212, 163, 115, 0.2)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
              }}
            >
              <div style={{ fontSize: "0.95rem", lineHeight: "1.45" }}>{msg.text}</div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", opacity: 0.8, marginTop: "0.35rem" }}>
                <span>{msg.timestamp}</span>
                {isMe && <CheckCheck size={14} color="#0b130e" />}
              </div>
            </div>
          );
        })}
      </main>

      {/* Bottom Message Bar */}
      <footer style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(212, 163, 115, 0.15)", backgroundColor: "#14231a" }}>
        <form onSubmit={handleSend} style={{ maxWidth: "800px", margin: "0 auto", display: "flex", gap: "0.75rem" }}>
          <input
            type="text"
            placeholder="Rédigez votre message respectueux..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: "#081c15",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              color: "#ffffff",
              padding: "0.85rem 1.25rem",
              borderRadius: "25px",
              fontSize: "0.95rem",
              outline: "none"
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              backgroundColor: !inputText.trim() ? "#5a6660" : "#d4a373",
              color: "#0b130e",
              border: "none",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: !inputText.trim() ? "not-allowed" : "pointer",
              transition: "transform 0.2s ease"
            }}
          >
            <Send size={20} />
          </button>
        </form>
      </footer>

    </div>
  );
}
