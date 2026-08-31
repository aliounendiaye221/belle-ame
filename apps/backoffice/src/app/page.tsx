"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Users, Flag, FileText, TrendingUp, DollarSign, Clock, CheckCircle2, ArrowRight } from "lucide-react";

import { UserButton } from "@/lib/clerk-admin";

export default function BackofficeDashboard() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Admin Navbar */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Tableau de Bord Back-Office Super Admin</div>
            <div style={{ fontSize: "0.7rem", color: "#d4a373", fontWeight: "600" }}>« À Chacun Une Belle Âme » Production</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#d4a373", fontWeight: "700", textDecoration: "none", borderBottom: "2px solid #d4a373", paddingBottom: "0.25rem", fontSize: "0.9rem" }}>Dashboard</Link>
            <Link href="/kyc" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>File KYC</Link>
            <Link href="/moderation" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Modération SLA</Link>
            <Link href="/users" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Utilisateurs</Link>
            <Link href="/analytics" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Analytics</Link>
            <Link href="/audit" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>Piste d&apos;Audit</Link>
            <Link href="/growth" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>WhatsApp Growth</Link>
            <Link href="/settings" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>⚙️</Link>
          </nav>
          <UserButton />
        </div>
      </header>

      <main style={{ flex: 1, padding: "2.5rem", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        
        {/* Top KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }}>
          
          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ fontSize: "0.85rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Membres Inscrits Réels</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#ffffff" }}>0</div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.35rem" }}>Lancement officiel ouvert</div>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(82, 183, 136, 0.2)" }}>
            <div style={{ fontSize: "0.85rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Taux de Vérification KYC 🛡️</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#52b788" }}>100%</div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.35rem" }}>0 faux profil toléré</div>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(230, 57, 70, 0.2)" }}>
            <div style={{ fontSize: "0.85rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Signalements Modération SLA</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#52b788" }}>0</div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.35rem" }}>File vierge &lt; 24h</div>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ fontSize: "0.85rem", color: "#a0aba4", marginBottom: "0.5rem" }}>Revenu MoMo FCFA Réel</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#d4a373" }}>0 FCFA</div>
            <div style={{ fontSize: "0.75rem", color: "#52b788", marginTop: "0.35rem" }}>Passerelles Wave & MoMo prêtes</div>
          </div>

        </div>

        {/* Quick Access Admin Modules Grid */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#d4a373", marginBottom: "1.25rem" }}>
          Modules d'Administration & Supervision
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          
          <Link href="/kyc" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ backgroundColor: "#14231a", padding: "1.75rem", borderRadius: "20px", border: "1px solid rgba(82, 183, 136, 0.3)", height: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <ShieldCheck size={28} color="#52b788" />
                <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(82, 183, 136, 0.15)", color: "#52b788", padding: "0.25rem 0.6rem", borderRadius: "10px", fontWeight: "700" }}>2 en attente</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.5rem" }}>File de Vérification KYC</h3>
              <p style={{ fontSize: "0.85rem", color: "#a0aba4", margin: 0, lineHeight: "1.5" }}>
                Inspectez les CNI / Passeports et photos selfie live avec calcul de correspondance faciale IA.
              </p>
            </div>
          </Link>

          <Link href="/moderation" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ backgroundColor: "#14231a", padding: "1.75rem", borderRadius: "20px", border: "1px solid rgba(230, 57, 70, 0.3)", height: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <Flag size={28} color="#e63946" />
                <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(230, 57, 70, 0.15)", color: "#e63946", padding: "0.25rem 0.6rem", borderRadius: "10px", fontWeight: "700" }}>2 signalements</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.5rem" }}>Modération & SLA &lt; 24h</h3>
              <p style={{ fontSize: "0.85rem", color: "#a0aba4", margin: 0, lineHeight: "1.5" }}>
                Traitez les alertes anti-broutage et appliquez l'une des 9 sanctions graduées.
              </p>
            </div>
          </Link>

          <Link href="/users" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ backgroundColor: "#14231a", padding: "1.75rem", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.3)", height: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <Users size={28} color="#d4a373" />
                <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(212, 163, 115, 0.15)", color: "#d4a373", padding: "0.25rem 0.6rem", borderRadius: "10px", fontWeight: "700" }}>0 inscrit (Lancement)</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.5rem" }}>Annuaire Utilisateurs & Support</h3>
              <p style={{ fontSize: "0.85rem", color: "#a0aba4", margin: 0, lineHeight: "1.5" }}>
                Recherchez les membres, démasquez temporairement les données PII et révoquez les sessions actives.
              </p>
            </div>
          </Link>

        </div>

      </main>
    </div>
  );
}
