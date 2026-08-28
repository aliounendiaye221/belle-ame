"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Crown, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Zap, ArrowLeft, Sparkles, Flame, Eye, Heart } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState("PREMIUM");
  const [paymentMethod, setPaymentMethod] = useState("MTN_MOMO");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
    }, 1200);
  };

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
      <LiveSocialProofToast />

      {/* Header */}
      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(212, 163, 115, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(16, 32, 23, 0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <BrandLogo size="md" />

        <Link
          href="/discover"
          style={{
            color: "#f4c07c",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <ArrowLeft size={16} /> Retour à la découverte
        </Link>
      </header>

      <main style={{ flex: 1, maxWidth: "960px", width: "100%", margin: "0 auto", padding: "3rem 1.5rem" }}>
        
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge-gold" style={{ marginBottom: "0.75rem", fontSize: "0.82rem" }}>
            <Crown size={15} color="#f4c07c" /> PRIVILÈGE &amp; SÉRÉNITÉ
          </span>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.6rem" }}>
            Investissez Dans Votre <span className="gradient-text-gold">Futur Foyer</span>
          </h1>
          <p style={{ color: "#c7cfcb", fontSize: "1rem", maxWidth: "560px", margin: "0 auto" }}>
            Accédez aux profils les plus convoités, révélez vos admirateurs secrets et bénéficiez de 50 propositions hautement compatibles par jour.
          </p>
        </div>

        {/* Pricing Tier Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
          
          {/* Free Tier */}
          <div
            onClick={() => setSelectedPlan("FREE")}
            className="glass-panel"
            style={{
              padding: "2rem",
              borderRadius: "28px",
              border: selectedPlan === "FREE" ? "2px solid #52b788" : "1px solid rgba(212, 163, 115, 0.18)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "0.35rem" }}>Pass Découverte</div>
            <div style={{ fontSize: "0.85rem", color: "#8a968f", marginBottom: "1.25rem" }}>Idéal pour explorer la communauté</div>
            <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "1.5rem" }}>
              0 FCFA <span style={{ fontSize: "0.9rem", color: "#8a968f", fontWeight: "400" }}>/ gratuit</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.88rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={17} color="#52b788" /> 10 profils suggérés par jour
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={17} color="#52b788" /> Vérification KYC certifiée gratuite
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8a968f" }}>
                <CheckCircle2 size={17} color="#52b788" /> Messagerie instantanée sécurisée
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8a968f" }}>
                ✕ Admirateurs secrets masqués
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8a968f" }}>
                ✕ Retour en arrière limité
              </div>
            </div>
          </div>

          {/* Premium Tier (Privilege Hero Card) */}
          <div
            onClick={() => setSelectedPlan("PREMIUM")}
            className="glass-panel glow-halo"
            style={{
              padding: "2rem",
              borderRadius: "28px",
              border: selectedPlan === "PREMIUM" ? "2px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.25)",
              background: "linear-gradient(135deg, rgba(16, 32, 23, 0.95), rgba(31, 90, 58, 0.4))",
              position: "relative",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {/* Pop-out Badge */}
            <div
              style={{
                position: "absolute",
                top: "-14px",
                right: "24px",
                background: "linear-gradient(135deg, #f4c07c, #e07a5f)",
                color: "#070d09",
                fontWeight: "900",
                fontSize: "0.75rem",
                padding: "4px 14px",
                borderRadius: "999px",
                boxShadow: "0 4px 15px rgba(224, 122, 95, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              ✦ LE CHOIX DES FUTURS MARIÉS ✦
            </div>

            <div style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "0.35rem", color: "#f4c07c" }}>
              Pass Privilège Sérénité
            </div>
            <div style={{ fontSize: "0.85rem", color: "#c7cfcb", marginBottom: "1.25rem" }}>
              Multiplie par 4.2x vos chances d&apos;union
            </div>
            
            <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "1.5rem" }}>
              2 500 FCFA <span style={{ fontSize: "0.9rem", color: "#d4a373", fontWeight: "700" }}>/ mois</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.88rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#fbfbfb" }}>
                <CheckCircle2 size={17} color="#f4c07c" /> <strong>50 profils ciblés</strong> par jour (+400%)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#fbfbfb" }}>
                <Eye size={17} color="#f4c07c" /> <strong>Débloquez qui a aimé votre profil</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={17} color="#f4c07c" /> Retours en arrière illimités (Rewind)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={17} color="#f4c07c" /> Badge exclusif « Membre Privilège »
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Heart size={17} color="#f4c07c" /> Accès au cercle des conseillers matrimoniaux
              </div>
            </div>
          </div>

        </div>

        {/* Checkout Form */}
        <div
          className="glass-panel"
          style={{
            padding: "2rem 2.5rem",
            borderRadius: "28px",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: "900", marginBottom: "1.25rem", color: "#fbfbfb" }}>
            Paiement Mobile Money Sécurisé (FCFA)
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { id: "MTN_MOMO", label: "MTN Mobile Money 🟡", desc: "Cameroun & Bénin" },
              { id: "ORANGE_MONEY", label: "Orange Money 🟠", desc: "Cameroun & Côte d'Ivoire" },
              { id: "WAVE", label: "Wave Money 🔵", desc: "Côte d'Ivoire & Bénin" },
            ].map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                style={{
                  padding: "1rem",
                  borderRadius: "16px",
                  backgroundColor: paymentMethod === method.id ? "rgba(212, 163, 115, 0.18)" : "rgba(255, 255, 255, 0.03)",
                  border: paymentMethod === method.id ? "2px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.15)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontWeight: "800", fontSize: "0.95rem", color: "#fbfbfb" }}>{method.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#8a968f", marginTop: "2px" }}>{method.desc}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCheckout}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#d4a373", marginBottom: "6px" }}>
                Numéro de Téléphone Mobile Money (Format E.164)
              </label>
              <input
                type="tel"
                placeholder="+237 6XX XX XX XX ou +225 07XX XX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(212, 163, 115, 0.3)",
                  color: "#fbfbfb",
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "1.05rem",
                opacity: isProcessing ? 0.7 : 1,
              }}
            >
              {isProcessing ? (
                "Validation Mobile Money en cours..."
              ) : (
                <>
                  <Zap size={18} /> Valider l&apos;Abonnement (2 500 FCFA / mois)
                </>
              )}
            </button>

            {success && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: "14px",
                  backgroundColor: "rgba(82, 183, 136, 0.15)",
                  border: "1px solid rgba(82, 183, 136, 0.4)",
                  color: "#52b788",
                  fontWeight: "700",
                  textAlign: "center",
                  fontSize: "0.9rem",
                }}
              >
                🎉 Souscription réussie ! Votre compte bénéficie désormais du statut Privilège (50 profils/j).
              </div>
            )}
          </form>
        </div>

      </main>
    </div>
  );
}
