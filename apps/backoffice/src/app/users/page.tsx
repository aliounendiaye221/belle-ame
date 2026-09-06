"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Eye,
  Lock,
  RefreshCw,
  Crown,
  User,
  CheckCircle2,
  Ban,
  Filter,
  X,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { backofficeStore, BackofficeUser } from "@/lib/backoffice-store";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<BackofficeUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<BackofficeUser | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = () => {
    setUsers(backofficeStore.getUsers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSuspension = (id: string) => {
    const updated = backofficeStore.toggleUserSuspension(id);
    if (updated) {
      setFeedback(`Compte de ${updated.firstName} ${updated.lastName} passé à l'état : ${updated.accountStatus}`);
      loadData();
      if (selectedUser?.id === id) setSelectedUser(updated);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleChangeTier = (id: string, tier: "ALLIANCE" | "SERENITE" | "PASS" | "FREE") => {
    const updated = backofficeStore.updateUserTier(id, tier);
    if (updated) {
      setFeedback(`Formule de ${updated.firstName} modifiée : ${tier}`);
      loadData();
      if (selectedUser?.id === id) setSelectedUser(updated);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleToggleKyc = (id: string) => {
    const u = users.find((item) => item.id === id);
    if (!u) return;
    const newKyc = u.kycStatus === "VERIFIED" ? "UNVERIFIED" : "VERIFIED";
    const updated = backofficeStore.updateUser(id, { kycStatus: newKyc });
    if (updated) {
      setFeedback(`Statut KYC de ${updated.firstName} basculé vers : ${newKyc}`);
      loadData();
      if (selectedUser?.id === id) setSelectedUser(updated);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    if (!matchesSearch) return false;
    if (tierFilter !== "ALL" && u.subscriptionTier !== tierFilter) return false;
    return true;
  });

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
      <AdminNavbar title="Répertoire des Membres" subtitle="Surveillance, Conformité & Gestion de Comptes" />

      {/* User Details Modal */}
      {selectedUser && (
        <div
          onClick={() => setSelectedUser(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "540px",
              width: "100%",
              backgroundColor: "#14231a",
              border: "1.5px solid rgba(212, 163, 115, 0.35)",
              borderRadius: "24px",
              padding: "2rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img
                  src={selectedUser.avatarUrl}
                  alt={selectedUser.firstName}
                  style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid #f4c07c" }}
                />
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#ffffff", margin: 0 }}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "#d4a373", fontWeight: "700" }}>
                    {selectedUser.profession} • {selectedUser.age} ans
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#a0aba4" }}>
                    ID: {selectedUser.id}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                style={{ background: "none", border: "none", color: "#c7cfcb", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* User Meta Infos */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", backgroundColor: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "16px" }}>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#a0aba4" }}>Téléphone Réel</div>
                <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "#fbfbfb" }}>{selectedUser.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#a0aba4" }}>Localisation</div>
                <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "#fbfbfb" }}>{selectedUser.city}, {selectedUser.country}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#a0aba4" }}>Formule Actuelle</div>
                <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#f4c07c" }}>{selectedUser.subscriptionTier}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#a0aba4" }}>Statut Compte</div>
                <div style={{ fontSize: "0.88rem", fontWeight: "800", color: selectedUser.accountStatus === "ACTIVE" ? "#52b788" : "#ff858d" }}>
                  {selectedUser.accountStatus === "ACTIVE" ? "ACTIF" : "SUSPENDU"}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#d4a373", marginBottom: "4px" }}>
                Bio &amp; Intentions Matrimoniales
              </div>
              <p style={{ fontSize: "0.85rem", color: "#c7cfcb", margin: 0, lineHeight: "1.5" }}>
                {selectedUser.bio}
              </p>
            </div>

            {/* Quick Admin Actions */}
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: "800", color: "#f4c07c", marginBottom: "0.6rem" }}>
                Actions Directes Super Admin
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => handleChangeTier(selectedUser.id, "ALLIANCE")}
                  style={{ padding: "6px 12px", borderRadius: "10px", border: "1px solid #f4c07c", backgroundColor: "rgba(244, 192, 124, 0.15)", color: "#f4c07c", fontSize: "0.75rem", fontWeight: "800", cursor: "pointer" }}
                >
                  Passer en ALLIANCE
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeTier(selectedUser.id, "SERENITE")}
                  style={{ padding: "6px 12px", borderRadius: "10px", border: "1px solid #52b788", backgroundColor: "rgba(82, 183, 136, 0.15)", color: "#52b788", fontSize: "0.75rem", fontWeight: "800", cursor: "pointer" }}
                >
                  Passer en SÉRÉNITÉ
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleKyc(selectedUser.id)}
                  style={{ padding: "6px 12px", borderRadius: "10px", border: "1px solid #d4a373", backgroundColor: "transparent", color: "#d4a373", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}
                >
                  Basculer Statut KYC ({selectedUser.kycStatus === "VERIFIED" ? "Révoquer" : "Valider"})
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleToggleSuspension(selectedUser.id)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: selectedUser.accountStatus === "ACTIVE" ? "#e63946" : "#52b788",
                  color: "#ffffff",
                  fontWeight: "800",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Ban size={15} />
                {selectedUser.accountStatus === "ACTIVE" ? "Suspendre ce Compte Immédiatement" : "Réactiver ce Compte"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        
        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "14px",
              backgroundColor: "rgba(82, 183, 136, 0.15)",
              border: "1px solid #52b788",
              color: "#52b788",
              marginBottom: "1.5rem",
              fontWeight: "700",
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={18} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Top Control Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "900", margin: 0, color: "#ffffff" }}>
              Membres &amp; Abonnés ({filteredUsers.length})
            </h1>
            <p style={{ color: "#a0aba4", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
              Supervision de l&apos;annuaire matrimonial et respect des abonnements
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#14231a",
                border: "1px solid rgba(212, 163, 115, 0.3)",
                padding: "8px 14px",
                borderRadius: "14px",
                minWidth: "240px",
              }}
            >
              <Search size={16} color="#f4c07c" />
              <input
                type="text"
                placeholder="Rechercher par nom, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  outline: "none",
                  fontSize: "16px",
                  width: "100%",
                }}
              />
            </div>

            {/* Filter by Tier */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              style={{
                backgroundColor: "#14231a",
                border: "1px solid rgba(212, 163, 115, 0.3)",
                color: "#f4c07c",
                padding: "8px 12px",
                borderRadius: "14px",
                fontSize: "16px",
                outline: "none",
                fontWeight: "700",
              }}
            >
              <option value="ALL">Toutes Formules</option>
              <option value="ALLIANCE">Alliance Sacrée</option>
              <option value="SERENITE">Sérénité</option>
              <option value="PASS">Pass 7j</option>
              <option value="FREE">Gratuit</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View (Hidden on mobile < 768px via CSS) */}
        <div
          style={{
            backgroundColor: "#14231a",
            borderRadius: "24px",
            border: "1px solid rgba(212, 163, 115, 0.18)",
            overflow: "hidden",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(212, 163, 115, 0.18)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Membre</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Localisation</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Téléphone</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Formule</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Statut KYC</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800" }}>Compte</th>
                  <th style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#f4c07c", fontWeight: "800", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={u.avatarUrl}
                          alt={u.firstName}
                          style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #d4a373" }}
                        />
                        <div>
                          <div style={{ fontWeight: "800", fontSize: "0.92rem", color: "#ffffff" }}>
                            {u.firstName} {u.lastName}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#a0aba4" }}>
                            {u.profession} • {u.age} ans
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#c7cfcb" }}>
                      {u.city}, {u.country}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#a0aba4", fontFamily: "monospace" }}>
                      {u.phone}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          backgroundColor: u.subscriptionTier === "ALLIANCE" ? "rgba(244, 192, 124, 0.2)" : u.subscriptionTier === "SERENITE" ? "rgba(82, 183, 136, 0.2)" : "rgba(255,255,255,0.06)",
                          color: u.subscriptionTier === "ALLIANCE" ? "#f4c07c" : u.subscriptionTier === "SERENITE" ? "#52b788" : "#c7cfcb",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: "800",
                        }}
                      >
                        {u.subscriptionTier}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          backgroundColor: u.kycStatus === "VERIFIED" ? "rgba(82, 183, 136, 0.2)" : "rgba(244, 192, 124, 0.2)",
                          color: u.kycStatus === "VERIFIED" ? "#52b788" : "#f4c07c",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: "800",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {u.kycStatus === "VERIFIED" ? <ShieldCheck size={12} /> : null}
                        {u.kycStatus}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          backgroundColor: u.accountStatus === "ACTIVE" ? "rgba(82, 183, 136, 0.15)" : "rgba(230, 57, 70, 0.2)",
                          color: u.accountStatus === "ACTIVE" ? "#52b788" : "#ff858d",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: "800",
                        }}
                      >
                        {u.accountStatus}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(244, 192, 124, 0.12)",
                            border: "1px solid rgba(244, 192, 124, 0.3)",
                            color: "#f4c07c",
                            fontSize: "0.78rem",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          Détails
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSuspension(u.id)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "10px",
                            backgroundColor: u.accountStatus === "ACTIVE" ? "rgba(230, 57, 70, 0.12)" : "rgba(82, 183, 136, 0.12)",
                            border: u.accountStatus === "ACTIVE" ? "1px solid rgba(230, 57, 70, 0.3)" : "1px solid rgba(82, 183, 136, 0.3)",
                            color: u.accountStatus === "ACTIVE" ? "#ff858d" : "#52b788",
                            fontSize: "0.78rem",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          {u.accountStatus === "ACTIVE" ? "Suspendre" : "Activer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
