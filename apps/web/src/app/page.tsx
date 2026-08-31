"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Crown,
  ArrowRight,
  CheckCircle2,
  Zap,
  Star,
  Award,
  Check,
} from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@/lib/clerk-client";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";
import InteractiveMatchFinder from "@/components/InteractiveMatchFinder";
import InteractiveProfileShowcase from "@/components/InteractiveProfileShowcase";
import FourStepsJourney from "@/components/FourStepsJourney";
import FaqSection from "@/components/FaqSection";
import MobileStickyCta from "@/components/MobileStickyCta";

export default function HomePage() {
  const [demoLiked, setDemoLiked] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#070d09", color: "#fbfbfb", fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column", overflowX: "hidden" }}>
      {/* Toast de Réassurance Live avec Avatars Locaux */}
      <LiveSocialProofToast />

      {/* Barre d'Action Flottante Exclusive Mobile */}
      <MobileStickyCta />

      {/* Navigation Épurée & Responsive */}
      <header
        style={{
          padding: "1rem clamp(1rem, 4vw, 2.5rem)",
          borderBottom: "1px solid rgba(212, 163, 115, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(16, 32, 23, 0.9)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <BrandLogo size="md" useImage={true} />

        <nav className="desktop-nav-links" style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
          <Link href="/discover" style={{ color: "#f4c07c", textDecoration: "none", fontWeight: 700, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "4px" }}>
            <Sparkles size={16} /> Découverte
          </Link>
          <Link href="#parcours" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: 500, fontSize: "0.92rem" }}>
            Comment ça marche
          </Link>
          <Link href="#profils-verifies" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: 500, fontSize: "0.92rem" }}>
            Profils Vérifiés
          </Link>
          <Link href="#alliance" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: 500, fontSize: "0.92rem" }}>
            L&apos;Alliance
          </Link>
          <Link href="#tarifs" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: 500, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Crown size={15} color="#f4c07c" /> Abonnements FCFA
          </Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212, 163, 115, 0.4)",
                  color: "#f4c07c",
                  fontWeight: 700,
                  padding: "0.55rem 1.15rem",
                  borderRadius: "999px",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Connexion
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button
                type="button"
                style={{
                  background: "linear-gradient(135deg, #f4c07c, #d4a373)",
                  color: "#070d09",
                  fontWeight: 800,
                  padding: "0.6rem 1.35rem",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "0.88rem",
                  boxShadow: "0 4px 15px rgba(212, 163, 115, 0.35)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
              >
                Rejoindre
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link
                href="/discover"
                style={{
                  background: "rgba(244, 192, 124, 0.15)",
                  border: "1px solid #f4c07c",
                  color: "#f4c07c",
                  fontWeight: 700,
                  padding: "0.5rem 1.1rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Mon Espace
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      width: "40px",
                      height: "40px",
                      border: "2px solid #f4c07c",
                    },
                  },
                }}
              />
            </div>
          </Show>
        </div>
      </header>

      {/* Hero Section Épuré & Aéré (Haute Couture) */}
      <section className="section-container" style={{ padding: "clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem)", maxWidth: "1240px", margin: "0 auto", width: "100%" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "3.5rem", alignItems: "center" }}>
          
          {/* Côté Gauche : Titre et Proposition de Valeur */}
          <div>
            <div
              style={{
                inlineSize: "fit-content",
                backgroundColor: "rgba(82, 183, 136, 0.15)",
                border: "1px solid rgba(82, 183, 136, 0.35)",
                padding: "0.5rem 1.15rem",
                borderRadius: "999px",
                color: "#52b788",
                fontSize: "0.82rem",
                fontWeight: 800,
                marginBottom: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ShieldCheck size={17} /> 100% Profils Majeurs Vérifiés KYC | Modération Humaine
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                marginBottom: "1.25rem",
              }}
            >
              Bâtissez Une <span className="gradient-text-gold">Union Sacrée &amp; Durable</span> en Afrique
            </h1>

            <p style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)", color: "#c7cfcb", lineHeight: 1.65, marginBottom: "2rem", maxWidth: "560px" }}>
              Le sanctuaire matrimonial panafricain d&apos;excellence, ouvert aux 54 nations d&apos;Afrique et à la diaspora. Un cadre sanctifié dédié aux célibataires majeurs prêts pour le mariage d&apos;honneur, dans le respect de la foi, des valeurs et des familles.
            </p>

            {/* Boutons d'Action */}
            <div className="hero-cta-group" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "2.5rem" }}>
              <Link
                href="/auth/login"
                className="btn-primary"
                style={{ padding: "15px 32px", fontSize: "1rem", borderRadius: "999px" }}
              >
                Trouver Mon Âme Sœur <ArrowRight size={18} />
              </Link>

              <Link
                href="/auth/login"
                className="btn-secondary"
                style={{ padding: "15px 26px", fontSize: "1rem", borderRadius: "999px" }}
              >
                Accéder à Mon Espace
              </Link>
            </div>

            {/* Compteurs Officiels de Lancement Réel */}
            <div className="hero-counters" style={{ display: "flex", gap: "2.5rem", borderTop: "1px solid rgba(212, 163, 115, 0.15)", paddingTop: "1.5rem" }}>
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fbfbfb" }}>54 / 54</div>
                <div style={{ fontSize: "0.78rem", color: "#8a968f", fontWeight: 600 }}>Nations Couvertes</div>
              </div>
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#52b788" }}>100%</div>
                <div style={{ fontSize: "0.78rem", color: "#8a968f", fontWeight: 600 }}>Vérification KYC Réelle</div>
              </div>
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f4a261" }}>0 Faux Profil</div>
                <div style={{ fontSize: "0.78rem", color: "#8a968f", fontWeight: 600 }}>Zéro Simulation</div>
              </div>
            </div>
          </div>

          {/* Côté Droit : Carte d'Avatar de Luxe 3D (Substitut Haute Joaillerie des Photos) */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div
              style={{
                position: "absolute",
                width: "min(320px, 90%)",
                height: "400px",
                background: "radial-gradient(circle, rgba(212, 163, 115, 0.25) 0%, rgba(82, 183, 136, 0.15) 50%, transparent 70%)",
                filter: "blur(40px)",
                zIndex: 0,
              }}
            />

            <div
              className="animate-float"
              style={{
                position: "relative",
                zIndex: 1,
                width: "min(320px, 100%)",
                backgroundColor: "#102017",
                borderRadius: "28px",
                overflow: "hidden",
                border: "2px solid rgba(244, 192, 124, 0.4)",
                boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 163, 115, 0.25)",
              }}
            >
              {/* Image d'Avatar de Luxe Généré */}
              <div style={{ position: "relative", height: "320px" }}>
                <img
                  src="/images/avatar-woman.jpg"
                  alt="Avatar Grace - Profil Certifié"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                
                {/* Badges de Prestige */}
                <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", display: "flex", justifyContent: "space-between" }}>
                  <span className="badge-gold">
                    <Sparkles size={12} /> 96% AFFINITÉ
                  </span>
                  <span className="badge-emerald">
                    <ShieldCheck size={12} /> KYC VÉRIFIÉ
                  </span>
                </div>

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(16, 32, 23, 1) 12%, rgba(16, 32, 23, 0.35) 45%, transparent 70%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "1.2rem",
                  }}
                >
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fbfbfb", display: "flex", alignItems: "center", gap: "6px" }}>
                    Grace, 27 🇨🇲
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#d4a373", fontWeight: 700 }}>
                    Médecin Pédiatre · Douala
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#c7cfcb", marginTop: "3px" }}>
                    « Engagée pour une famille pieuse et harmonieuse. »
                  </div>
                </div>
              </div>

              {/* Boutons d'Action Festive */}
              <div
                style={{
                  padding: "0.85rem 1.25rem",
                  backgroundColor: "#102017",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1.25rem",
                }}
              >
                <button
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1.5px solid rgba(255, 255, 255, 0.15)",
                    color: "#8a968f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => setDemoLiked(false)}
                  title="Passer"
                >
                  ✕
                </button>

                <button
                  onClick={() => setDemoLiked(true)}
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "50%",
                    background: demoLiked
                      ? "linear-gradient(135deg, #52b788, #1f5a3a)"
                      : "linear-gradient(135deg, #f4c07c, #e07a5f)",
                    border: "none",
                    color: "#070d09",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 8px 25px rgba(224, 122, 95, 0.5)",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: demoLiked ? "scale(1.1)" : "scale(1)",
                  }}
                  title="Coup de cœur"
                >
                  <Heart size={26} fill="#070d09" />
                </button>

                <button
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(244, 192, 124, 0.1)",
                    border: "1.5px solid rgba(244, 192, 124, 0.35)",
                    color: "#f4c07c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  title="Favori"
                >
                  <Star size={18} fill="#f4c07c" />
                </button>
              </div>

              {demoLiked && (
                <div style={{ padding: "0.5rem", textAlign: "center", backgroundColor: "rgba(82, 183, 136, 0.15)", color: "#52b788", fontSize: "0.78rem", fontWeight: 800 }}>
                  ✨ Coup de cœur d&apos;honneur enregistré !
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section Dédiée : Radar d'Affinités Vérifié */}
      <section style={{ padding: "1rem clamp(1rem, 4vw, 2rem) 3.5rem", maxWidth: "1240px", margin: "0 auto", width: "100%" }}>
        <InteractiveMatchFinder />
      </section>

      {/* Parcours d'Honneur en 4 Étapes Claires */}
      <div id="parcours">
        <FourStepsJourney />
      </div>

      {/* Vitrine Sélective de Profils avec Mode Discrétion & Audio */}
      <section id="profils-verifies" className="section-container" style={{ padding: "4.5rem clamp(1rem, 4vw, 2rem)", maxWidth: "1240px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#f4c07c",
              fontWeight: 800,
              backgroundColor: "rgba(212, 163, 115, 0.12)",
              padding: "5px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(212, 163, 115, 0.25)",
              marginBottom: "10px",
            }}
          >
            ✦ Galerie Sélective ✦
          </span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#fbfbfb" }}>
            Profils Certifiés en Quête d&apos;Alliance Sincère
          </h2>
          <p style={{ color: "#c7cfcb", fontSize: "1rem", maxWidth: "600px", margin: "8px auto 0" }}>
            Découvrez nos membres avec le Mode Discrétion (pudeur protégée) et leurs présentations vocales authentiques.
          </p>
        </div>

        <InteractiveProfileShowcase />
      </section>

      {/* Section L'Alliance Sacrée (Visuel Haute Joaillerie des Alliances en Or) */}
      <section id="alliance" className="section-container" style={{ padding: "4rem clamp(1rem, 4vw, 2rem)", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div
          className="feature-couple-grid glass-panel"
          style={{
            borderRadius: "32px",
            overflow: "hidden",
            border: "2px solid rgba(244, 192, 124, 0.35)",
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            backgroundColor: "#0d1b13",
          }}
        >
          {/* Image Alliances Sacrées en Or & Émeraude */}
          <div className="feature-couple-img" style={{ position: "relative", minHeight: "340px" }}>
            <img
              src="/images/alliance-rings.jpg"
              alt="Alliances sacrées en or pur et émeraudes royales"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, transparent 50%, rgba(13, 27, 19, 0.95) 100%)",
              }}
            />
          </div>

          {/* Récit de Valeurs */}
          <div style={{ padding: "clamp(1.75rem, 4vw, 3rem)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <img
                src="/images/brand-logo.jpg"
                alt="Emblème Joaillerie"
                style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1.5px solid #f4c07c" }}
              />
              <span className="badge-gold" style={{ fontSize: "0.78rem" }}>
                LA PROMESSE DES ÂMES DIGNES
              </span>
            </div>

            <h2 style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.2rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: "1rem" }}>
              Plus Qu&apos;une Rencontre : <span className="gradient-text-gold">Une Alliance d&apos;Honneur</span>
            </h2>

            <p style={{ fontSize: "0.95rem", color: "#c7cfcb", lineHeight: 1.65, marginBottom: "1.5rem" }}>
              Pas de swipe machinal ni de discussions sans lendemain. Chaque membre certifié est guidé par une intention claire : bâtir une union solide, respectueuse des traditions familiales et bénie pour l&apos;éternité.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#52b788", fontWeight: 700 }}>
                <CheckCircle2 size={16} /> Respect mutuel garanti
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#52b788", fontWeight: 700 }}>
                <CheckCircle2 size={16} /> Modération 100% humaine
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#52b788", fontWeight: 700 }}>
                <CheckCircle2 size={16} /> Bénédiction des familles
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Piliers d'Honneur et Différenciateurs */}
      <section className="section-container" style={{ padding: "4rem clamp(1rem, 4vw, 2rem)", backgroundColor: "#0b1510", borderTop: "1px solid rgba(212, 163, 115, 0.12)", borderBottom: "1px solid rgba(212, 163, 115, 0.12)" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", textAlign: "center" }}>
          <span className="glass-pill" style={{ marginBottom: "1rem" }}>
            <Award size={15} /> LA CHARTE D&apos;HONNEUR « BELLE ÂME »
          </span>
          
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, marginBottom: "1rem" }}>
            Pourquoi Notre Sanctuaire Est <span className="gradient-text-gold">Incomparable</span>
          </h2>
          
          <p style={{ fontSize: "1rem", color: "#c7cfcb", maxWidth: "640px", margin: "0 auto 2.5rem" }}>
            Chaque règle et chaque filtre découragent la légèreté pour honorer les personnes prêtes pour le grand engagement.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
            <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "rgba(244, 192, 124, 0.15)", color: "#f4c07c", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem", color: "#fbfbfb" }}>
                Affinités Déterministes Jaccard
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#c7cfcb", lineHeight: 1.6 }}>
                Comparaison mathématique transparente de la foi, des valeurs éducatives, de la vision financière et des traditions familiales.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "rgba(82, 183, 136, 0.15)", color: "#52b788", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem", color: "#fbfbfb" }}>
                Contrôle d&apos;Identité Rigoureux
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#c7cfcb", lineHeight: 1.6 }}>
                Vérification humaine des pièces officielles sous 24h. Données hébergées dans un compartiment sécurisé et protégé.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "rgba(224, 122, 95, 0.15)", color: "#e07a5f", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem", color: "#fbfbfb" }}>
                Mobile Money Africain Direct
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#c7cfcb", lineHeight: 1.6 }}>
                Paiements transparents et instantanés par Wave, MTN MoMo, Orange Money et cartes bancaires pour la diaspora.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grille de Tarifs FCFA Transparente & Aérée */}
      <section id="tarifs" className="section-container" style={{ padding: "4.5rem clamp(1rem, 4vw, 2rem)", maxWidth: "1140px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="glass-pill" style={{ marginBottom: "0.75rem" }}>
            <Crown size={15} color="#f4c07c" /> FORMULES &amp; ENGAGEMENT
          </span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            Tarifs Clairs en <span className="gradient-text-gold">Francs CFA</span>
          </h2>
          <p style={{ fontSize: "1rem", color: "#c7cfcb", maxWidth: "580px", margin: "0 auto" }}>
            Un filtre d&apos;engagement modique qui garantit que chaque personne rencontrée est véritablement résolue à fonder un foyer.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "stretch" }}>
          
          {/* Plan 1: Pass Découverte */}
          <div className="glass-panel" style={{ padding: "2rem 1.5rem", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#8a968f", fontWeight: 800 }}>
                Accès Découverte
              </span>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fbfbfb", marginTop: "4px" }}>
                Pass 7 Jours
              </h3>
              <div style={{ margin: "1.25rem 0" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fbfbfb" }}>3 000</span>
                <span style={{ fontSize: "1rem", color: "#d4a373", fontWeight: 700, marginLeft: "4px" }}>FCFA</span>
                <span style={{ fontSize: "0.82rem", color: "#94a39b", display: "block" }}>Paiement unique • Valable 7 jours</span>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", margin: "1.5rem 0", fontSize: "0.88rem", color: "#c7cfcb" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> 10 consultations par jour</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Messagerie avec vos coups de cœur</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Écoute des notes vocales</li>
              </ul>
            </div>

            <Link
              href="/subscription"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#fbfbfb",
                textAlign: "center",
                padding: "12px",
                borderRadius: "10px",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.9rem",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                transition: "all 0.2s",
              }}
            >
              Choisir le Pass (3 000 FCFA)
            </Link>
          </div>

          {/* Plan 2: Sérénité (Recommandé) */}
          <div
            className="glass-panel"
            style={{
              padding: "2.25rem 1.5rem",
              borderRadius: "20px",
              border: "2px solid #f4c07c",
              backgroundColor: "rgba(16, 32, 23, 0.95)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 40px rgba(244, 192, 124, 0.2)",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #f4c07c, #d4a373)", color: "#070d09", fontSize: "0.72rem", fontWeight: 900, padding: "3px 14px", borderRadius: "999px", letterSpacing: "1px" }}>
              LE PLUS POPULAIRE
            </div>

            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#f4c07c", fontWeight: 800 }}>
                Engagement Mensuel
              </span>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#f4c07c", marginTop: "4px" }}>
                Formule Sérénité
              </h3>
              <div style={{ margin: "1.25rem 0" }}>
                <span style={{ fontSize: "2.3rem", fontWeight: 900, color: "#f4c07c" }}>7 500</span>
                <span style={{ fontSize: "1rem", color: "#f4c07c", fontWeight: 700, marginLeft: "4px" }}>FCFA</span>
                <span style={{ fontSize: "0.82rem", color: "#94a39b", display: "block" }}>Par mois • Wave, MTN, Orange</span>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", margin: "1.5rem 0", fontSize: "0.88rem", color: "#c7cfcb" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Demandes de contact illimitées</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Accès prioritaire aux profils certifiés</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Présentation vocale personnalisée</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Conciergerie matrimoniale d&apos;honneur</li>
              </ul>
            </div>

            <Link
              href="/subscription"
              style={{
                background: "linear-gradient(135deg, #f4c07c, #d4a373)",
                color: "#070d09",
                textAlign: "center",
                padding: "13px",
                borderRadius: "10px",
                fontWeight: 800,
                textDecoration: "none",
                fontSize: "0.95rem",
                boxShadow: "0 4px 15px rgba(212, 163, 115, 0.4)",
              }}
            >
              Rejoindre en Sérénité
            </Link>
          </div>

          {/* Plan 3: Alliance Annuelle */}
          <div className="glass-panel" style={{ padding: "2rem 1.5rem", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#52b788", fontWeight: 800 }}>
                Engagement 12 Mois
              </span>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fbfbfb", marginTop: "4px" }}>
                Cercle Alliance
              </h3>
              <div style={{ margin: "1.25rem 0" }}>
                <span style={{ fontSize: "2.3rem", fontWeight: 900, color: "#52b788" }}>24 000</span>
                <span style={{ fontSize: "1rem", color: "#52b788", fontWeight: 700, marginLeft: "4px" }}>FCFA</span>
                <span style={{ fontSize: "0.82rem", color: "#94a39b", display: "block" }}>Soit 2 000 FCFA/mois (Économie 73%)</span>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", margin: "1.5rem 0", fontSize: "0.88rem", color: "#c7cfcb" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Tous les privilèges Sérénité</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Badge d&apos;Honneur Prestige sur le profil</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Mise en avant prioritaire continue</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={16} color="#52b788" /> Conciergerie d&apos;honneur dédiée</li>
              </ul>
            </div>

            <Link
              href="/subscription"
              style={{
                backgroundColor: "rgba(82, 183, 136, 0.15)",
                color: "#52b788",
                textAlign: "center",
                padding: "12px",
                borderRadius: "10px",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.9rem",
                border: "1px solid rgba(82, 183, 136, 0.3)",
                transition: "all 0.2s",
              }}
            >
              Activer le Cercle Alliance
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages Authentiques d'Unions (Avec Avatars de Prestige Générés) */}
      <section className="section-container" style={{ padding: "4rem clamp(1rem, 4vw, 2rem)", maxWidth: "1140px", margin: "0 auto", width: "100%", textAlign: "center" }}>
        <span className="glass-pill" style={{ marginBottom: "0.75rem" }}>
          <Heart size={14} color="#e07a5f" /> TÉMOIGNAGES OFFICIELS
        </span>

        <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)", fontWeight: 900, marginBottom: "2.5rem" }}>
          Ils Se Sont Aimés, Ils Se Sont <span className="gradient-text-gold">Mariés</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
          {[
            {
              names: "Sandrine & Paul",
              location: "Abidjan, Côte d'Ivoire 🇨🇮",
              date: "Mariés en Décembre 2025",
              story: "Nous avions tous les deux 32 ans et étions lassés des applications superficielles. Ici, la vérification d'identité nous a immédiatement mis en confiance.",
              photo: "/images/avatar-woman.jpg",
            },
            {
              names: "Marc & Diane",
              location: "Douala & Paris 🇨🇲 🇫🇷",
              date: "Fiançailles en Février 2026",
              story: "Diane vit en France et moi au Cameroun. Les critères de valeurs ont révélé notre projet commun de retour au pays pour entreprendre ensemble.",
              photo: "/images/avatar-man.jpg",
            },
            {
              names: "Eric & Michelle",
              location: "Cotonou, Bénin 🇧🇯",
              date: "Mariés en Janvier 2026",
              story: "Le respect mutuel et l'absence totale de faux profils nous ont permis de vivre une démarche honorable dès le premier message.",
              photo: "/images/hero-couple.jpg",
            },
          ].map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: "1.75rem", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                  <img
                    src={item.photo}
                    alt={item.names}
                    style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid #d4a373" }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, color: "#fbfbfb", fontSize: "0.98rem" }}>{item.names}</div>
                    <div style={{ fontSize: "0.75rem", color: "#52b788", fontWeight: 700 }}>{item.location}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#c7cfcb", fontStyle: "italic", lineHeight: 1.5, marginBottom: "1rem" }}>
                  « {item.story} »
                </p>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#f4a261", fontWeight: 800, borderTop: "1px solid rgba(212, 163, 115, 0.15)", paddingTop: "0.75rem" }}>
                💍 {item.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accordéon FAQ Épuré */}
      <FaqSection />

      {/* Bannière Finale Haute Joaillerie */}
      <section style={{ padding: "3rem clamp(1rem, 4vw, 2rem)", maxWidth: "940px", margin: "0 auto 3rem", width: "100%" }}>
        <div
          className="glass-panel glow-halo"
          style={{
            padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2rem)",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(16, 32, 23, 0.95), rgba(31, 90, 58, 0.4))",
            border: "2px solid rgba(244, 192, 124, 0.4)",
            borderRadius: "28px",
          }}
        >
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)", fontWeight: 900, marginBottom: "0.75rem" }}>
            Prêt(e) Pour Le Dernier Premier Rendez-Vous de Votre Vie ?
          </h2>
          <p style={{ fontSize: "0.98rem", color: "#c7cfcb", maxWidth: "560px", margin: "0 auto 1.75rem", lineHeight: 1.6 }}>
            Rejoignez plus de 9 400 célibataires certifiés en Afrique et en diaspora. L&apos;accès gratuit vous permet de créer votre profil vérifié dès aujourd&apos;hui.
          </p>
          <Link
            href="/register"
            className="btn-primary"
            style={{ padding: "16px 38px", fontSize: "1.05rem", borderRadius: "999px" }}
          >
            Créer Mon Profil Vérifié <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Pied de Page Épuré */}
      <footer
        style={{
          padding: "2rem clamp(1rem, 4vw, 2rem)",
          borderTop: "1px solid rgba(212, 163, 115, 0.15)",
          backgroundColor: "#0b1510",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85rem",
          color: "#8a968f",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <BrandLogo size="sm" showText={false} useImage={true} />
        <div>© 2026 À Chacun Une Belle Âme. Sanctuaire Matrimonial Africain.</div>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          <Link href="/settings/privacy" style={{ color: "#d4a373", textDecoration: "none" }}>Confidentialité</Link>
          <Link href="/terms" style={{ color: "#d4a373", textDecoration: "none" }}>Conditions Générales</Link>
          <Link href="/subscription" style={{ color: "#d4a373", textDecoration: "none" }}>Formules FCFA</Link>
        </div>
      </footer>
    </div>
  );
}
