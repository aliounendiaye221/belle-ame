"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, MessageCircle, Crown, Sparkles, Clock, CheckCircle } from "lucide-react";

export default function MatchesPage() {
  const matches = [
    {
      id: "match-101",
      firstName: "Grace",
      age: 26,
      location: "Douala, Cameroun 🇨🇲",
      score: 94,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      lastMessage: "Bonjour ! J'ai lu ta présentation sur tes valeurs spirituelles...",
      timeAgo: "Il y a 10 min",
      verified: true,
      unread: true
    },
    {
      id: "match-102",
      firstName: "Marie-Joséphine",
      age: 28,
      location: "Abidjan, Côte d'Ivoire 🇨🇮",
      score: 91,
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
      lastMessage: "Accord mutuel validé ! Vous pouvez échanger en toute sérénité.",
      timeAgo: "Hier",
      verified: true,
      unread: false
    }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Top Navbar */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>À Chacun Une Belle Âme</span>
        </div>

        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/discover" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500" }}>
            Découverte
          </Link>
          <Link href="/matches" style={{ color: "#d4a373", fontWeight: "700", textDecoration: "none", borderBottom: "2px solid #d4a373", paddingBottom: "0.25rem" }}>
            Correspondances ({matches.length})
          </Link>
          <Link href="/subscription" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Crown size={16} color="#d4a373" /> Offres
          </Link>
          <Link href="/profile" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500" }}>
            Profil
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1, maxWidth: "800px", width: "100%", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "0.5rem" }}>Vos Correspondances Sincères</h1>
          <p style={{ color: "#a0aba4", fontSize: "0.95rem" }}>
            Seules les personnes ayant exprimé un intérêt mutuel réciproque (Opt-in strict) apparaissent ici.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {matches.map((item) => (
            <Link
              key={item.id}
              href={`/chat/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  backgroundColor: "#14231a",
                  borderRadius: "20px",
                  border: item.unread ? "1px solid #d4a373" : "1px solid rgba(212, 163, 115, 0.2)",
                  padding: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  transition: "transform 0.2s ease, border-color 0.2s ease"
                }}
              >
                {/* Photo Avatar with Online Badge */}
                <div style={{ position: "relative" }}>
                  <img
                    src={item.photoUrl}
                    alt={item.firstName}
                    style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", border: "2px solid #d4a373" }}
                  />
                  <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#52b788", border: "2px solid #14231a" }} />
                </div>

                {/* Info & Last Message */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: "700" }}>{item.firstName}, {item.age} ans</span>
                      {item.verified && (
                        <span style={{ color: "#52b788", display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.75rem", backgroundColor: "rgba(82, 183, 136, 0.15)", padding: "0.2rem 0.5rem", borderRadius: "10px" }}>
                          <ShieldCheck size={12} /> Vérifiée
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#a0aba4" }}>{item.timeAgo}</span>
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Sparkles size={14} /> Score de compatibilité : {item.score}%
                  </div>

                  <div style={{ fontSize: "0.85rem", color: item.unread ? "#ffffff" : "#a0aba4", fontWeight: item.unread ? "600" : "400", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "420px" }}>
                    {item.lastMessage}
                  </div>
                </div>

                {/* Action Icon */}
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(212, 163, 115, 0.15)", color: "#d4a373", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageCircle size={20} />
                </div>

              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
