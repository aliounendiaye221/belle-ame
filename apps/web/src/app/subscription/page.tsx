"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Crown,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Zap,
  ArrowLeft,
  Sparkles,
  Flame,
  Eye,
  Heart,
  Check,
  Download,
  FileCheck,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LiveSocialProofToast from "@/components/LiveSocialProofToast";
import { realPlatformStore, PaymentReceipt } from "@/lib/real-platform-store";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<"PASS" | "SERENITE" | "ALLIANCE">("SERENITE");
  const [paymentMethod, setPaymentMethod] = useState("WAVE");
  const [phone, setPhone] = useState("+221 77 000 00 00");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  const planPrices = {
    PASS: { amount: 3000, label: "Pass Découverte", duration: "7 Jours", quota: 50 },
    SERENITE: { amount: 7500, label: "Formule Sérénité", duration: "1 Mois", quota: 50 },
    ALLIANCE: { amount: 24000, label: "Cercle Alliance Sacrée", duration: "1 An", quota: 50 },
  };

  const activePlanInfo = planPrices[selectedPlan];

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsProcessing(true);

    setTimeout(() => {
      const newReceipt = realPlatformStore.activateSubscription(selectedPlan, {
        operator: paymentMethod,
        phoneNumber: phone,
        amountFcfa: activePlanInfo.amount,
      });

      setReceipt(newReceipt);
      setIsProcessing(false);
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

      <main style={{ flex: 1, maxWidth: "980px", width: "100%", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge-gold" style={{ marginBottom: "0.75rem", fontSize: "0.82rem" }}>
            <Crown size={15} color="#f4c07c" /> PRIVILÈGE &amp; SÉRÉNITÉ
          </span>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "#fbfbfb", marginBottom: "0.6rem" }}>
            Investissez Dans Votre <span className="gradient-text-gold">Futur Foyer</span>
          </h1>
          <p style={{ color: "#c7cfcb", fontSize: "1rem", maxWidth: "580px", margin: "0 auto", lineHeight: "1.6" }}>
            Accédez aux profils certifiés 18+, révélez vos admirateurs secrets et bénéficiez de 50 propositions hautement compatibles chaque jour.
          </p>
        </div>

        {/* Pricing Tier Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
          {/* Tier 1 : Pass Découverte */}
          <div
            onClick={() => { setSelectedPlan("PASS"); setReceipt(null); }}
            className="glass-panel"
            style={{
              padding: "1.75rem",
              borderRadius: "24px",
              border: selectedPlan === "PASS" ? "2px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.2)",
              backgroundColor: selectedPlan === "PASS" ? "rgba(244, 192, 124, 0.08)" : "rgba(16, 32, 23, 0.6)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "#fbfbfb", marginBottom: "0.5rem" }}>
              Pass Découverte
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#f4c07c", marginBottom: "0.25rem" }}>
              3 000 <span style={{ fontSize: "0.9rem", color: "#c7cfcb", fontWeight: "600" }}>FCFA</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8a968f", marginBottom: "1.25rem" }}>
              Validité 7 jours
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", color: "#c7cfcb" }}>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> 50 profils certifiés / jour
              </li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> Révélation admirateurs secrets
              </li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> Badge Vérifié Prioritaire
              </li>
            </ul>
          </div>

          {/* Tier 2 : Formule Sérénité (Recommandée) */}
          <div
            onClick={() => { setSelectedPlan("SERENITE"); setReceipt(null); }}
            className="glass-panel"
            style={{
              padding: "1.75rem",
              borderRadius: "24px",
              border: selectedPlan === "SERENITE" ? "2.5px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.3)",
              backgroundColor: selectedPlan === "SERENITE" ? "rgba(244, 192, 124, 0.12)" : "rgba(16, 32, 23, 0.8)",
              cursor: "pointer",
              position: "relative",
              boxShadow: selectedPlan === "SERENITE" ? "0 10px 30px rgba(244, 192, 124, 0.2)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#f4c07c",
                color: "#070d09",
                fontSize: "0.72rem",
                fontWeight: "900",
                padding: "2px 10px",
                borderRadius: "999px",
                letterSpacing: "0.5px",
              }}
            >
              LE PLUS CHOISI ⭐
            </div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "#fbfbfb", marginBottom: "0.5rem" }}>
              Formule Sérénité
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#f4c07c", marginBottom: "0.25rem" }}>
              7 500 <span style={{ fontSize: "0.9rem", color: "#c7cfcb", fontWeight: "600" }}>FCFA</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#52b788", fontWeight: "700", marginBottom: "1.25rem" }}>
              Validité 30 jours (Équivalent 250 FCFA/j)
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", color: "#c7cfcb" }}>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> 50 profils compatibles / jour
              </li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> Messagerie illimitée &amp; notes vocales
              </li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> Révélation immédiate des likes reçus
              </li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> Garantie respect &amp; modération SLA &lt;24h
              </li>
            </ul>
          </div>

          {/* Tier 3 : Cercle Alliance */}
          <div
            onClick={() => { setSelectedPlan("ALLIANCE"); setReceipt(null); }}
            className="glass-panel"
            style={{
              padding: "1.75rem",
              borderRadius: "24px",
              border: selectedPlan === "ALLIANCE" ? "2px solid #52b788" : "1px solid rgba(212, 163, 115, 0.2)",
              backgroundColor: selectedPlan === "ALLIANCE" ? "rgba(82, 183, 136, 0.1)" : "rgba(16, 32, 23, 0.6)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "#fbfbfb", marginBottom: "0.5rem" }}>
              Cercle Alliance
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#52b788", marginBottom: "0.25rem" }}>
              24 000 <span style={{ fontSize: "0.9rem", color: "#c7cfcb", fontWeight: "600" }}>FCFA</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#8a968f", marginBottom: "1.25rem" }}>
              Validité 1 An (-73% d&apos;économie)
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", color: "#c7cfcb" }}>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> Accès VIP permanent toute l&apos;année
              </li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> Accompagnement conseiller matrimonial
              </li>
              <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Check size={14} color="#52b788" /> Badge Prestige Âme Sacrée
              </li>
            </ul>
          </div>
        </div>

        {/* Reçu Digital Officiel si validation réussie */}
        {receipt ? (
          <div
            className="glass-panel"
            style={{
              padding: "2.5rem",
              borderRadius: "28px",
              border: "2px solid #52b788",
              backgroundColor: "rgba(82, 183, 136, 0.08)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(82, 183, 136, 0.2)",
                  color: "#52b788",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <FileCheck size={28} />
              </div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#fbfbfb", margin: 0 }}>
                Récépissé de Souscription Officiel
              </h2>
              <p style={{ color: "#52b788", fontWeight: "700", fontSize: "0.9rem", marginTop: "4px" }}>
                Paiement validé avec succès par {receipt.operator} • Statut Privilège Actif
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#070d09",
                border: "1px solid rgba(212, 163, 115, 0.2)",
                borderRadius: "18px",
                padding: "1.5rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.25rem",
                marginBottom: "1.5rem",
                fontSize: "0.88rem",
              }}
            >
              <div>
                <div style={{ color: "#8a968f", fontSize: "0.78rem" }}>Numéro de Transaction</div>
                <div style={{ fontWeight: "800", color: "#f4c07c" }}>{receipt.transactionId}</div>
              </div>
              <div>
                <div style={{ color: "#8a968f", fontSize: "0.78rem" }}>Date &amp; Heure</div>
                <div style={{ fontWeight: "700", color: "#fbfbfb" }}>{receipt.date}</div>
              </div>
              <div>
                <div style={{ color: "#8a968f", fontSize: "0.78rem" }}>Formule Souscrite</div>
                <div style={{ fontWeight: "700", color: "#fbfbfb" }}>{receipt.planName}</div>
              </div>
              <div>
                <div style={{ color: "#8a968f", fontSize: "0.78rem" }}>Montant Débité</div>
                <div style={{ fontWeight: "900", color: "#52b788" }}>{receipt.amountFcfa.toLocaleString()} FCFA</div>
              </div>
              <div>
                <div style={{ color: "#8a968f", fontSize: "0.78rem" }}>Compte Mobile Money</div>
                <div style={{ fontWeight: "700", color: "#fbfbfb" }}>{receipt.phoneNumber} ({receipt.operator})</div>
              </div>
              <div>
                <div style={{ color: "#8a968f", fontSize: "0.78rem" }}>Validité de l&apos;Alliance</div>
                <div style={{ fontWeight: "700", color: "#f4c07c" }}>Jusqu&apos;au {receipt.validUntil}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link
                href="/discover"
                className="btn-primary"
                style={{
                  padding: "12px 28px",
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Sparkles size={16} /> Profiter de mes 50 profils/jour
              </Link>
            </div>
          </div>
        ) : (
          /* Formulaire de Checkout Mobile Money */
          <div
            className="glass-panel"
            style={{
              padding: "2rem 2.5rem",
              borderRadius: "28px",
              border: "1px solid rgba(212, 163, 115, 0.25)",
            }}
          >
            <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginBottom: "1.25rem", color: "#fbfbfb" }}>
              Règlement Mobile Money Sécurisé en FCFA
            </h3>

            {/* Sélecteur d'opérateur */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { id: "WAVE", label: "Wave Money 🔵", desc: "Sénégal, Côte d'Ivoire & Bénin" },
                { id: "ORANGE_MONEY", label: "Orange Money 🟠", desc: "Sénégal, CI, Cameroun, Mali" },
                { id: "MTN_MOMO", label: "MTN MoMo 🟡", desc: "Côte d'Ivoire, Cameroun, Bénin" },
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
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#f4c07c", marginBottom: "6px" }}>
                  Numéro de Téléphone {paymentMethod} (Format E.164)
                </label>
                <input
                  type="tel"
                  placeholder="+221 77 000 00 00 ou +225 07 00 00 00"
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
                    boxSizing: "border-box",
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {isProcessing ? (
                  "Traitement de l'autorisation Mobile Money..."
                ) : (
                  <>
                    <Zap size={18} /> Confirmer le Règlement ({activePlanInfo.amount.toLocaleString()} FCFA pour {activePlanInfo.duration})
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
