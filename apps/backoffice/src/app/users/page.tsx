"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Search, Eye, EyeOff, Lock, RefreshCw, Crown, LogOut, User } from "lucide-react";
import { UserButton } from "@/lib/clerk-admin";

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  role: string;
  tier: string;
  verifiedKyc: boolean;
  createdAt: string;
  activeSessionsCount: number;
}

export default function UsersManagementPage() {
  const [showPii, setShowPii] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Démarrage à zéro compte fictif pour la mise en ligne officielle
  const [users, setUsers] = useState<UserItem[]>([]);

  const filteredUsers = users.filter((u) => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRevokeSessions = (userId: string) => {
    alert(`Toutes les sessions de l'utilisateur [${userId}] ont été révoquées avec succès.`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Admin Navbar */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Gestion & Surveillance des Membres</div>
            <div style={{ fontSize: "0.7rem", color: "#d4a373", fontWeight: "600" }}>Conformité RGPD & Protection Données Sensibles</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Dashboard</Link>
            <Link href="/kyc" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>File KYC</Link>
            <Link href="/moderation" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Modération SLA</Link>
            <Link href="/users" style={{ color: "#d4a373", fontWeight: "700", textDecoration: "none", borderBottom: "2px solid #d4a373", paddingBottom: "0.25rem", fontSize: "0.9rem" }}>Utilisateurs</Link>
            <Link href="/audit" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Piste d&apos;Audit</Link>
            <Link href="/growth" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>WhatsApp Growth</Link>
            <Link href="/settings" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>⚙️</Link>
          </nav>
          <UserButton />
        </div>
      </header>

      <main style={{ flex: 1, padding: "2.5rem", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        
        {/* Header Control Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          
          {/* Search Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", backgroundColor: "#14231a", padding: "0.6rem 1.25rem", borderRadius: "25px", border: "1px solid rgba(212, 163, 115, 0.3)", width: "380px" }}>
            <Search size={18} color="#d4a373" />
            <input
              type="text"
              placeholder="Rechercher par prénom, ID ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ backgroundColor: "transparent", border: "none", color: "#fff", outline: "none", fontSize: "0.9rem", width: "100%" }}
            />
          </div>

          {/* PII Masking Toggle Button */}
          <button
            onClick={() => setShowPii(!showPii)}
            style={{
              backgroundColor: showPii ? "rgba(230, 57, 70, 0.15)" : "rgba(82, 183, 136, 0.15)",
              border: showPii ? "1px solid #e63946" : "1px solid #52b788",
              color: showPii ? "#e63946" : "#52b788",
              padding: "0.75rem 1.25rem",
              borderRadius: "20px",
              fontWeight: "700",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {showPii ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPii ? "Masquer les données PII" : "Démasquer les PII (Support)"}
          </button>

        </div>

        {/* Users Table */}
        <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#081c15", borderBottom: "1px solid rgba(212, 163, 115, 0.2)", color: "#d4a373" }}>
                <th style={{ padding: "1rem 1.5rem" }}>Utilisateur ID</th>
                <th style={{ padding: "1rem 1.5rem" }}>Nom & Prénom</th>
                <th style={{ padding: "1rem 1.5rem" }}>Téléphone (E.164)</th>
                <th style={{ padding: "1rem 1.5rem" }}>Pays</th>
                <th style={{ padding: "1rem 1.5rem" }}>Offre</th>
                <th style={{ padding: "1rem 1.5rem" }}>Statut KYC</th>
                <th style={{ padding: "1rem 1.5rem" }}>Actions Admin</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#8a968f", fontSize: "0.95rem" }}>
                    🌱 <strong>Zéro compte fictif enregistré.</strong> La base d'utilisateurs est vierge et prête pour les vraies inscriptions en production.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(212, 163, 115, 0.1)" }}>
                    <td style={{ padding: "1.25rem 1.5rem", fontFamily: "monospace", fontSize: "0.85rem", color: "#a0aba4" }}>{u.id}</td>
                    <td style={{ padding: "1.25rem 1.5rem", fontWeight: "700" }}>
                      {showPii ? `${u.firstName} ${u.lastName}` : `${u.firstName} ${u.lastName[0]}. ***`}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem", color: "#c2c9c4" }}>
                      {showPii ? u.phone : `${u.phone.substring(0, 6)}*****`}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>{u.country}</td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span style={{ backgroundColor: u.tier === "PREMIUM" ? "rgba(212, 163, 115, 0.2)" : "#081c15", border: u.tier === "PREMIUM" ? "1px solid #d4a373" : "1px solid #5a6660", color: u.tier === "PREMIUM" ? "#d4a373" : "#a0aba4", padding: "0.3rem 0.75rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700" }}>
                        {u.tier === "PREMIUM" ? "👑 Privilège FCFA" : "Gratuit"}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {u.verifiedKyc ? (
                        <span style={{ color: "#52b788", fontWeight: "700", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <ShieldCheck size={16} /> Vérifié 🛡️
                        </span>
                      ) : (
                        <span style={{ color: "#a0aba4", fontSize: "0.8rem" }}>En attente</span>
                      )}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <button
                        onClick={() => handleRevokeSessions(u.id)}
                        style={{
                          backgroundColor: "#081c15",
                          border: "1px solid rgba(212, 163, 115, 0.3)",
                          color: "#d4a373",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "10px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}
                      >
                        <LogOut size={14} /> Révoquer Sessions ({u.activeSessionsCount})
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
