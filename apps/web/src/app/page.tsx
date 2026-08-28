"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  Sparkles,
  MessageCircle,
  Crown,
  Lock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Zap,
  Flame,
  Star,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";

export default function HomePage() {
  const [demoLiked, setDemoLiked] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#070d09", color: "#fbfbfb", fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column" }}>
      {/* Live Social Proof Toast */}
      <LiveSocialProofToast />

      {/* Top Navbar */}
      <header
        style={{
          padding: "1.1rem 2rem",
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
        <BrandLogo size="md" useImage={true} />

        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/discover" style={{ color: "#f4c07c", textDecoration: "none", fontWeight: "700", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "4px" }}>
            <Sparkles size={16} /> Découverte
          </Link>
          <Link href="/matches" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            Correspondances
          </Link>
          <Link href="/subscription" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Crown size={15} color="#f4c07c" /> Abonnements FCFA
          </Link>
          <Link href="/faq" style={{ color: "#c7cfcb", textDecoration: "none", fontWeight: "500", fontSize: "0.92rem" }}>
            FAQ
          </Link>
          <Link
            href="/auth/login"
            style={{
              background: "linear-gradient(135deg, #f4c07c, #d4a373)",
              color: "#070d09",
              fontWeight: "800",
              padding: "0.6rem 1.4rem",
              borderRadius: "999px",
              textDecoration: "none",
              fontSize: "0.9rem",
              boxShadow: "0 4px 15px rgba(212, 163, 115, 0.35)",
            }}
          >
            Se Connecter
          </Link>
        </nav>
      </header>

      {/* Hero Section with 3D Interactive Card Showcase */}
      <section style={{ padding: "4.5rem 2rem 3rem", maxWidth: "1240px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "3.5rem", alignItems: "center" }}>
        
        {/* Left: Persuasive Hook Copy */}
        <div>
          {/* Trust Badge Pill */}
          <div
            style={{
              inlineSize: "fit-content",
              backgroundColor: "rgba(82, 183, 136, 0.15)",
              border: "1px solid rgba(82, 183, 136, 0.35)",
              padding: "0.55rem 1.25rem",
              borderRadius: "999px",
              color: "#52b788",
              fontSize: "0.85rem",
              fontWeight: "800",
              marginBottom: "1.5rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={18} /> 100% Profils Majeurs &amp; Vérifiés KYC | Anti-Broutage Certifié
          </div>

          <h1
            style={{
              fontSize: "3.2rem",
              fontWeight: "900",
              lineHeight: "1.12",
              letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
            }}
          >
            Bâtissez Une <span className="gradient-text-gold">Union Sacrée &amp; Durable</span> en Afrique &amp; Diaspora
          </h1>

          <p style={{ fontSize: "1.15rem", color: "#c7cfcb", lineHeight: "1.65", marginBottom: "2.5rem", maxWidth: "580px" }}>
            Fini les profils fantômes et les arnaques. Rejoignez le premier cercle matrimonial d&apos;élite d&apos;Afrique francophone (Cameroun, Bénin, Côte d&apos;Ivoire) fondé sur la sincérité, la foi et le mariage traditionnel &amp; civil.
          </p>

          {/* CTAs with Social Proof Micro-Tag */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "2.5rem" }}>
            <Link
              href="/auth/login"
              className="btn-primary"
              style={{ padding: "16px 36px", fontSize: "1.05rem" }}
            >
              Trouver Mon Âme Sœur <ArrowRight size={20} />
            </Link>

            <Link
              href="/onboarding"
              className="btn-secondary"
              style={{ padding: "16px 28px", fontSize: "1.05rem" }}
            >
              Créer Mon Profil (Gratuit)
            </Link>
          </div>

          {/* Live Micro Metric Counters */}
          <div style={{ display: "flex", gap: "2rem", borderTop: "1px solid rgba(212, 163, 115, 0.15)", paddingTop: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#fbfbfb" }}>9 420+</div>
              <div style={{ fontSize: "0.78rem", color: "#8a968f", fontWeight: "600" }}>Membres Vérifiés</div>
            </div>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#52b788" }}>842</div>
              <div style={{ fontSize: "0.78rem", color: "#8a968f", fontWeight: "600" }}>Unions &amp; Mariages</div>
            </div>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#f4a261" }}>94.8%</div>
              <div style={{ fontSize: "0.78rem", color: "#8a968f", fontWeight: "600" }}>Taux de Compatibilité</div>
            </div>
          </div>
        </div>

        {/* Right: Floating 3D Interactive Dating Card Mockup */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          {/* Ambient Glow behind card */}
          <div
            style={{
              position: "absolute",
              width: "360px",
              height: "480px",
              background: "radial-gradient(circle, rgba(212, 163, 115, 0.25) 0%, rgba(82, 183, 136, 0.15) 50%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />

          {/* Interactive Card */}
          <div
            className="animate-float"
            style={{
              position: "relative",
              zIndex: 1,
              width: "340px",
              backgroundColor: "#102017",
              borderRadius: "32px",
              overflow: "hidden",
              border: "2px solid rgba(244, 192, 124, 0.4)",
              boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 163, 115, 0.25)",
            }}
          >
            {/* Candidate Image with Badges */}
            <div style={{ position: "relative", height: "360px" }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&auto=format&fit=crop&q=80"
                alt="Grace"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              
              {/* Top Bar Badges */}
              <div style={{ position: "absolute", top: "14px", left: "14px", right: "14px", display: "flex", justifyContent: "space-between" }}>
                <span className="badge-gold">
                  <Sparkles size={13} /> 96% AFFINITÉ
                </span>
                <span className="badge-emerald">
                  <ShieldCheck size={13} /> KYC VÉRIFIÉ
                </span>
              </div>

              {/* Gradient Vignette for Text Readability */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(16, 32, 23, 1) 12%, rgba(16, 32, 23, 0.4) 40%, transparent 70%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "#fbfbfb", display: "flex", alignItems: "center", gap: "6px" }}>
                  Grace, 27 🇨🇲
                </div>
                <div style={{ fontSize: "0.82rem", color: "#d4a373", fontWeight: "700" }}>
                  Médecin Pédiatre · Douala
                </div>
                <div style={{ fontSize: "0.78rem", color: "#c7cfcb", marginTop: "4px" }}>
                  « Engagée pour une famille pieuse et harmonieuse. »
                </div>
              </div>
            </div>

            {/* Interactive Action Buttons */}
            <div
              style={{
                padding: "1rem 1.25rem",
                backgroundColor: "#102017",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <button
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1.5px solid rgba(255, 255, 255, 0.15)",
                  color: "#8a968f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setDemoLiked(false)}
              >
                ✕
              </button>

              <button
                onClick={() => setDemoLiked(true)}
                style={{
                  width: "64px",
                  height: "64px",
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
                  transform: demoLiked ? "scale(1.15)" : "scale(1)",
                }}
              >
                <Heart size={30} fill="#070d09" />
              </button>

              <button
                style={{
                  width: "52px",
                  height: "52px",
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
              >
                <Star size={20} fill="#f4c07c" />
              </button>
            </div>

            {demoLiked && (
              <div style={{ padding: "0.5rem", textAlign: "center", backgroundColor: "rgba(82, 183, 136, 0.15)", color: "#52b788", fontSize: "0.78rem", fontWeight: "800" }}>
                ✨ Coup de cœur enregistré ! Inscrivez-vous pour échanger.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Haute Couture African Couple Feature Section */}
      <section style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div
          className="glass-panel"
          style={{
            borderRadius: "36px",
            overflow: "hidden",
            border: "2px solid rgba(244, 192, 124, 0.4)",
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            backgroundColor: "#0d1b13",
          }}
        >
          {/* Couple Image with warm gradient glow */}
          <div style={{ position: "relative", minHeight: "380px" }}>
            <img
              src="/images/hero-couple.jpg"
              alt="Couple uni par À Chacun Une Belle Âme"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, transparent 60%, rgba(13, 27, 19, 1) 100%)",
              }}
            />
          </div>

          {/* Narrative Content */}
          <div style={{ padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <img
                src="/images/brand-logo.jpg"
                alt="Emblème Joaillerie"
                style={{ width: "42px", height: "42px", borderRadius: "50%", border: "1.5px solid #f4c07c", boxShadow: "0 0 15px rgba(244, 192, 124, 0.5)" }}
              />
              <span className="badge-gold" style={{ fontSize: "0.8rem" }}>
                LA PROMESSE DES ÂMES SINCÈRES
              </span>
            </div>

            <h2 style={{ fontSize: "2.1rem", fontWeight: "900", lineHeight: "1.2", marginBottom: "1rem" }}>
              Plus Qu&apos;une Rencontre : <span className="gradient-text-gold">Une Alliance d&apos;Honneur</span>
            </h2>

            <p style={{ fontSize: "0.95rem", color: "#c7cfcb", lineHeight: "1.65", marginBottom: "1.5rem" }}>
              Nous ne croyons pas au swipe infini et superficiel. Chaque profil sur <strong>À Chacun Une Belle Âme</strong> est minutieusement vérifié pour vous permettre de bâtir un foyer fort, respectueux de vos valeurs spirituelles et de vos traditions familiales africaines.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#52b788", fontWeight: "700" }}>
                <CheckCircle2 size={16} /> Respect mutuel garanti
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#52b788", fontWeight: "700" }}>
                <CheckCircle2 size={16} /> Zéro faux profils
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#52b788", fontWeight: "700" }}>
                <CheckCircle2 size={16} /> Accompagnement bienveillant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Trust Section */}
      <section style={{ padding: "4rem 2rem", backgroundColor: "#0b1510", borderTop: "1px solid rgba(212, 163, 115, 0.12)", borderBottom: "1px solid rgba(212, 163, 115, 0.12)" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", textAlign: "center" }}>
          
          <span className="glass-pill" style={{ marginBottom: "1rem" }}>
            <Award size={15} /> LA CHARTE D&apos;HONNEUR « BELLE ÂME »
          </span>
          
          <h2 style={{ fontSize: "2.4rem", fontWeight: "900", marginBottom: "1rem" }}>
            Pourquoi Notre Communauté Est <span className="gradient-text-gold">Incomparable</span>
          </h2>
          
          <p style={{ fontSize: "1.05rem", color: "#c7cfcb", maxWidth: "680px", margin: "0 auto 3rem" }}>
            Chaque fonctionnalité est minutieusement conçue pour décourager les imposteurs et valoriser les personnes prêtes pour le grand engagement.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", textAlign: "left" }}>
            {/* Feature 1 */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "rgba(244, 192, 124, 0.15)", color: "#f4c07c", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Sparkles size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.6rem", color: "#fbfbfb" }}>
                Matching Déterministe Jaccard
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#c7cfcb", lineHeight: "1.6" }}>
                Fini le hasard superficiel. Notre algorithme compare mathématiquement la foi, le désir d&apos;enfants, l&apos;ambition professionnelle et l&apos;attachement culturel.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "rgba(82, 183, 136, 0.15)", color: "#52b788", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.6rem", color: "#fbfbfb" }}>
                Coffre-Fort KYC Isolant
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#c7cfcb", lineHeight: "1.6" }}>
                Vérification humaine des pièces d&apos;identité sous 24h. Les documents sont hébergés dans un compartiment chiffré hermétique et détruits après audit.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel" style={{ padding: "2rem" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "rgba(224, 122, 95, 0.15)", color: "#e07a5f", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Zap size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.6rem", color: "#fbfbfb" }}>
                Mobile Money FCFA Instantané
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#c7cfcb", lineHeight: "1.6" }}>
                Abonnements mensuels ou annuels réglés facilement via MTN MoMo, Orange Money et Wave avec idempotence bancaire et reçu immédiat.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: "4.5rem 2rem", maxWidth: "1140px", margin: "0 auto", width: "100%", textAlign: "center" }}>
        <span className="glass-pill" style={{ marginBottom: "1rem" }}>
          <Heart size={14} color="#e07a5f" /> TÉMOIGNAGES OFFICIELS
        </span>

        <h2 style={{ fontSize: "2.3rem", fontWeight: "900", marginBottom: "3rem" }}>
          Ils Se Sont Aimés, Ils Se Sont <span className="gradient-text-gold">Mariés</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", textAlign: "left" }}>
          {[
            {
              names: "Sandrine & Paul",
              location: "Abidjan, Côte d'Ivoire 🇨🇮",
              date: "Mariés en Décembre 2025",
              story: "Nous avions tous les deux 32 ans et étions déçus des applications classiques. Ici, la vérification d'identité nous a immédiatement rassurés.",
              photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
            },
            {
              names: "Marc & Diane",
              location: "Douala & Paris 🇨🇲 🇫🇷",
              date: "Fiançailles en Février 2026",
              story: "Diane vit en France et moi au Cameroun. L'algorithme a détecté notre vision commune du retour au pays pour investir ensemble.",
              photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
            },
            {
              names: "Eric & Michelle",
              location: "Cotonou, Bénin 🇧🇯",
              date: "Mariés en Janvier 2026",
              story: "Le respect mutuel et l'absence totale de faux profils nous ont permis de vivre une rencontre authentique dès le premier message.",
              photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                  <img
                    src={item.photo}
                    alt={item.names}
                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid #d4a373" }}
                  />
                  <div>
                    <div style={{ fontWeight: "800", color: "#fbfbfb", fontSize: "1rem" }}>{item.names}</div>
                    <div style={{ fontSize: "0.75rem", color: "#52b788", fontWeight: "700" }}>{item.location}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#c7cfcb", fontStyle: "italic", lineHeight: "1.5", marginBottom: "1rem" }}>
                  « {item.story} »
                </p>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#f4a261", fontWeight: "800", borderTop: "1px solid rgba(212, 163, 115, 0.15)", paddingTop: "0.75rem" }}>
                💍 {item.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final High-Converting CTA Banner */}
      <section style={{ padding: "4rem 2rem", maxWidth: "980px", margin: "0 auto 4rem", width: "100%" }}>
        <div
          className="glass-panel glow-halo"
          style={{
            padding: "3.5rem 2rem",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(16, 32, 23, 0.95), rgba(31, 90, 58, 0.4))",
            border: "2px solid rgba(244, 192, 124, 0.4)",
            borderRadius: "36px",
          }}
        >
          <h2 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "1rem" }}>
            Prêt(e) Pour Le Dernier Premier Rendez-Vous de Votre Vie ?
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#c7cfcb", maxWidth: "580px", margin: "0 auto 2rem", lineHeight: "1.6" }}>
            Rejoignez plus de 9 000 célibataires certifiés en Afrique et dans la diaspora. L&apos;accès gratuit inclut 10 découvertes quotidiennes et l&apos;assistance modérateur prioritaire.
          </p>
          <Link
            href="/auth/login"
            className="btn-primary"
            style={{ padding: "18px 44px", fontSize: "1.1rem" }}
          >
            Créer Mon Compte Sincère Maintenant <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem",
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
        <div>© 2026 À Chacun Une Belle Âme. Tous droits réservés.</div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <Link href="/settings/privacy" style={{ color: "#d4a373", textDecoration: "none" }}>Portail RGPD</Link>
          <Link href="/terms" style={{ color: "#d4a373", textDecoration: "none" }}>CGU &amp; Mentions Légales</Link>
          <Link href="/faq" style={{ color: "#d4a373", textDecoration: "none" }}>FAQ</Link>
          <Link href="/notifications" style={{ color: "#d4a373", textDecoration: "none" }}>Notifications</Link>
          <Link href="/subscription" style={{ color: "#d4a373", textDecoration: "none" }}>Formules FCFA</Link>
        </div>
      </footer>
    </div>
  );
}
