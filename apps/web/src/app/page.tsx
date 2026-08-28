"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, MessageCircle, Crown, Lock, PhoneCall, ArrowRight, UserCheck, CheckCircle2, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Navbar */}
      <header style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem" }}>
            Â
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>À Chacun Une Belle Âme</div>
            <div style={{ fontSize: "0.7rem", color: "#d4a373", textTransform: "uppercase", letterSpacing: "1px" }}>Afrique Francophone & Diaspora</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <Link href="/discover" style={{ color: "#d4a373", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}>
            Découverte
          </Link>
          <Link href="/matches" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>
            Correspondances
          </Link>
          <Link href="/subscription" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Crown size={15} color="#d4a373" /> Abonnements
          </Link>
          <Link href="/faq" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>
            FAQ
          </Link>
          <Link href="/auth/login" style={{ backgroundColor: "#d4a373", color: "#0b130e", fontWeight: "700", padding: "0.6rem 1.25rem", borderRadius: "20px", textDecoration: "none", fontSize: "0.9rem" }}>
            Se Connecter
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ padding: "5rem 2rem", textAlign: "center", maxWidth: "900px", margin: "0 auto", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        
        <div style={{ inlineSize: "fit-content", backgroundColor: "rgba(82, 183, 136, 0.15)", border: "1px solid rgba(82, 183, 136, 0.3)", padding: "0.5rem 1.25rem", borderRadius: "25px", color: "#52b788", fontSize: "0.85rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ShieldCheck size={18} /> 100% Profils Majeurs & Vérifiés KYC | SLA Modération &lt; 24h
        </div>

        <h1 style={{ fontSize: "3rem", fontWeight: "800", lineHeight: "1.15", marginBottom: "1.25rem", background: "linear-gradient(135deg, #ffffff 0%, #d4a373 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Bâtissez des Unions Sincères et Durables en Afrique & Dans la Diaspora
        </h1>

        <p style={{ fontSize: "1.15rem", color: "#c2c9c4", lineHeight: "1.6", maxWidth: "700px", marginBottom: "2.5rem" }}>
          La première plateforme SaaS matrimoniale dédiée aux célibataires majeurs d'Afrique francophone (Cameroun, Bénin, Côte d'Ivoire) et à sa diaspora. Matching déterministe par valeurs (0-100%), paiement Mobile Money et sécurité absolue.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3.5rem" }}>
          <Link
            href="/auth/login"
            style={{ backgroundColor: "#d4a373", color: "#0b130e", fontWeight: "800", padding: "1rem 2.25rem", borderRadius: "30px", textDecoration: "none", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 10px 25px rgba(212, 163, 115, 0.3)" }}
          >
            Commencer Mon Parcours Sincère <ArrowRight size={20} />
          </Link>
          <Link
            href="/onboarding"
            style={{ backgroundColor: "#14231a", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#d4a373", fontWeight: "700", padding: "1rem 2rem", borderRadius: "30px", textDecoration: "none", fontSize: "1.05rem" }}
          >
            Créer Mon Profil (5 Étapes)
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", textAlign: "left", width: "100%" }}>
          
          <div style={{ backgroundColor: "#14231a", padding: "1.75rem", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(212, 163, 115, 0.15)", color: "#d4a373", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>Matching Déterministe 0-100</h3>
            <p style={{ fontSize: "0.85rem", color: "#a0aba4", lineHeight: "1.5", margin: 0 }}>
              Algorithme basé sur l'indice de Jaccard comparant la spiritualité, le projet de vie, l'éducation et la vision de la famille.
            </p>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.75rem", borderRadius: "20px", border: "1px solid rgba(82, 183, 136, 0.2)" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(82, 183, 136, 0.15)", color: "#52b788", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>Coffre-Fort KYC Isolant</h3>
            <p style={{ fontSize: "0.85rem", color: "#a0aba4", lineHeight: "1.5", margin: 0 }}>
              Les pièces d'identité sont stockées dans le compartiment sécurisé `belleame-private-kyc-vault` et détruites après validation.
            </p>
          </div>

          <div style={{ backgroundColor: "#14231a", padding: "1.75rem", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.2)" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(212, 163, 115, 0.15)", color: "#d4a373", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>Paiements Mobile Money FCFA</h3>
            <p style={{ fontSize: "0.85rem", color: "#a0aba4", lineHeight: "1.5", margin: 0 }}>
              Abonnements en FCFA réglés par MTN MoMo, Orange Money ou Wave avec idempotence stricte des webhooks.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer style={{ padding: "1.5rem 2rem", borderTop: "1px solid rgba(212, 163, 115, 0.15)", backgroundColor: "#14231a", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "#7a8780", flexWrap: "wrap", gap: "1rem" }}>
        <div>© 2026 À Chacun Une Belle Âme. Tous droits réservés.</div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <Link href="/settings/privacy" style={{ color: "#d4a373", textDecoration: "none" }}>Portail RGPD</Link>
          <Link href="/terms" style={{ color: "#d4a373", textDecoration: "none" }}>CGU & Mentions Légales</Link>
          <Link href="/faq" style={{ color: "#d4a373", textDecoration: "none" }}>FAQ</Link>
          <Link href="/notifications" style={{ color: "#d4a373", textDecoration: "none" }}>Notifications</Link>
          <Link href="/subscription" style={{ color: "#d4a373", textDecoration: "none" }}>Formules FCFA</Link>
        </div>
      </footer>

    </div>
  );
}
