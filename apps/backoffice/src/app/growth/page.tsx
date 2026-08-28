"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, Users, TrendingUp, Gift, CheckCircle2, ArrowRight } from "lucide-react";

interface PromoCode {
  code: string;
  discount: string;
  redemptions: number;
  maxRedemptions: number;
  status: string;
}

export default function GrowthAnalyticsPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    { code: "WA-COMMUNITY-9000", discount: "1 Mois Offert", redemptions: 1420, maxRedemptions: 9000, status: "ACTIVE" },
    { code: "DIASPORA-PARIS-2026", discount: "50% sur 3 Mois", redemptions: 340, maxRedemptions: 1000, status: "ACTIVE" }
  ]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Admin Navbar */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Analyse d'Acquisition & Migration WhatsApp</div>
            <div style={{ fontSize: "0.7rem", color: "#52b788", fontWeight: "600" }}>📈 Communauté Pionnière (9 000+ Membres)</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <Link href="/" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Dashboard</Link>
          <Link href="/kyc" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>File KYC</Link>
          <Link href="/moderation" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Modération SLA</Link>
          <Link href="/users" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Utilisateurs</Link>
          <Link href="/audit" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Piste d'Audit</Link>
          <Link href="/growth" style={{ color: "#d4a373", fontWeight: "700", textDecoration: "none", borderBottom: "2px solid #d4a373", paddingBottom: "0.25rem", fontSize: "0.9rem" }}>WhatsApp Growth</Link>
        </nav>
      </header>

      <main style={{ flex: 1, padding: "2.5rem", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        
        {/* Growth Funnel KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }}>
          
          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Clics Cibles WhatsApp</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#d4a373" }}>6 840</div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.35rem" }}>+18% cette semaine</div>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Inscriptions OTP Validées</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#fff" }}>4 120</div>
            <div style={{ fontSize: "0.75rem", color: "#d4a373", marginTop: "0.35rem" }}>60.2% de taux de conversion</div>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(82, 183, 136, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Profils Vérifiés KYC 🛡️</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#52b788" }}>2 890</div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.35rem" }}>70.1% des inscrits</div>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Abonnés Privilège FCFA</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#d4a373" }}>1 420</div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.35rem" }}>34.4% de taux de souscription</div>
          </div>

        </div>

        {/* Promo Codes Table */}
        <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", padding: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#d4a373", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Gift size={22} /> Suivi des Codes Promo Pionniers WhatsApp
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#081c15", borderBottom: "1px solid rgba(212, 163, 115, 0.2)", color: "#d4a373" }}>
                <th style={{ padding: "1rem 1.5rem" }}>Code Promo</th>
                <th style={{ padding: "1rem 1.5rem" }}>Avantage Offert</th>
                <th style={{ padding: "1rem 1.5rem" }}>Utilisations</th>
                <th style={{ padding: "1rem 1.5rem" }}>Plafond Maximale</th>
                <th style={{ padding: "1rem 1.5rem" }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((p) => (
                <tr key={p.code} style={{ borderBottom: "1px solid rgba(212, 163, 115, 0.1)" }}>
                  <td style={{ padding: "1.25rem 1.5rem", fontFamily: "monospace", fontWeight: "800", color: "#fff" }}>{p.code}</td>
                  <td style={{ padding: "1.25rem 1.5rem", color: "#52b788", fontWeight: "700" }}>{p.discount}</td>
                  <td style={{ padding: "1.25rem 1.5rem", fontWeight: "700" }}>{p.redemptions}</td>
                  <td style={{ padding: "1.25rem 1.5rem", color: "#a0aba4" }}>{p.maxRedemptions} membres</td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <span style={{ backgroundColor: "rgba(82, 183, 136, 0.15)", border: "1px solid #52b788", color: "#52b788", padding: "0.25rem 0.6rem", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "700" }}>
                      ● ACTIF
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
