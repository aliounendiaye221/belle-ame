"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Crown, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Zap, ArrowLeft } from "lucide-react";

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
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <header style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <Link href="/discover" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>Abonnements Privilège FCFA</span>
        </Link>
        <Link href="/discover" style={{ color: "#d4a373", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <ArrowLeft size={16} /> Retour à la découverte
        </Link>
      </header>

      <main style={{ flex: 1, maxWidth: "900px", width: "100%", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ inlineSize: "fit-content", margin: "0 auto 0.75rem", backgroundColor: "rgba(212, 163, 115, 0.15)", border: "1px solid rgba(212, 163, 115, 0.3)", padding: "0.4rem 1rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.4rem", color: "#d4a373", fontSize: "0.85rem", fontWeight: "700" }}>
            <Crown size={18} /> Passer à la Vitesse Supérieure
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem" }}>Choisissez votre Pass Sérénité</h1>
          <p style={{ color: "#a0aba4", fontSize: "0.95rem" }}>
            Débloquez 50 opportunités de correspondances quotidiennes et accédez prioritairement aux profils KYC vérifiés.
          </p>
        </div>

        {/* Pricing Tier Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
          
          {/* Free Tier */}
          <div
            onClick={() => setSelectedPlan("FREE")}
            style={{
              backgroundColor: "#14231a",
              borderRadius: "20px",
              border: selectedPlan === "FREE" ? "2px solid #a0aba4" : "1px solid rgba(212, 163, 115, 0.15)",
              padding: "1.75rem",
              cursor: "pointer",
              position: "relative"
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Pass Découverte</h3>
            <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#a0aba4", marginBottom: "1rem" }}>
              Gratuit
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "#c2c9c4" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={16} color="#52b788" /> 10 fiches de découverte par jour</li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={16} color="#52b788" /> Messagerie après accord mutuel</li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={16} color="#52b788" /> Badges et filtres basiques</li>
            </ul>
          </div>

          {/* Premium Tier */}
          <div
            onClick={() => setSelectedPlan("PREMIUM")}
            style={{
              backgroundColor: "#14231a",
              borderRadius: "20px",
              border: selectedPlan === "PREMIUM" ? "2px solid #d4a373" : "1px solid rgba(212, 163, 115, 0.3)",
              padding: "1.75rem",
              cursor: "pointer",
              position: "relative",
              boxShadow: "0 10px 30px rgba(212, 163, 115, 0.15)"
            }}
          >
            <div style={{ position: "absolute", top: "-12px", right: "20px", backgroundColor: "#d4a373", color: "#0b130e", fontSize: "0.75rem", fontWeight: "800", padding: "0.25rem 0.75rem", borderRadius: "12px", textTransform: "uppercase" }}>
              Recommandé
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem", color: "#d4a373" }}>Pass Privilège FCFA</h3>
            <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#ffffff", marginBottom: "1rem" }}>
              5 000 FCFA <span style={{ fontSize: "0.9rem", color: "#a0aba4", fontWeight: "400" }}>/ mois</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "#c2c9c4" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={16} color="#d4a373" /> <strong>50 fiches de découverte par jour</strong></li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={16} color="#d4a373" /> Accès prioritaire aux profils KYC 🛡️</li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={16} color="#d4a373" /> Mode Incognito & Masquage présence</li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={16} color="#d4a373" /> Support prioritaire SLA &lt; 1h</li>
            </ul>
          </div>

        </div>

        {/* Mobile Money Payment Drawer */}
        {selectedPlan === "PREMIUM" && !success && (
          <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.3)", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem" }}>Paiement Sécurisé Mobile Money (FCFA)</h3>
            
            <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Sélectionnez votre opérateur Mobile Money
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                  {[
                    { id: "MTN_MOMO", label: "MTN MoMo", color: "#ffb703" },
                    { id: "ORANGE_MONEY", label: "Orange Money", color: "#fb8500" },
                    { id: "WAVE", label: "Wave FCFA", color: "#219ebc" },
                    { id: "CINETPAY", label: "CinetPay / CB", color: "#8ecae6" }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        padding: "0.8rem 0.5rem",
                        borderRadius: "12px",
                        border: paymentMethod === m.id ? "2px solid #d4a373" : "1px solid rgba(212, 163, 115, 0.2)",
                        backgroundColor: paymentMethod === m.id ? "rgba(212, 163, 115, 0.15)" : "#081c15",
                        color: "#fff",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Numéro de téléphone du compte MoMo
                </label>
                <input
                  type="tel"
                  placeholder="Ex: 699 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                disabled={!phone || isProcessing}
                style={{
                  backgroundColor: !phone || isProcessing ? "#5a6660" : "#d4a373",
                  color: "#0b130e",
                  fontWeight: "700",
                  padding: "1rem",
                  borderRadius: "30px",
                  border: "none",
                  fontSize: "1rem",
                  cursor: !phone || isProcessing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem"
                }}
              >
                {isProcessing ? "Initialisation du transfert FCFA..." : "Payer 5 000 FCFA via MoMo"} <ArrowRight size={18} />
              </button>

              <div style={{ fontSize: "0.75rem", color: "#7a8780", textAlign: "center" }}>
                🔒 Idempotence garantie — Aucun double débit en cas de coupure réseau.
              </div>

            </form>
          </div>
        )}

        {/* Success Screen */}
        {success && (
          <div style={{ backgroundColor: "rgba(82, 183, 136, 0.15)", border: "1px solid #52b788", borderRadius: "24px", padding: "2.5rem", textAlign: "center", color: "#f8f9fa" }}>
            <Zap size={48} color="#52b788" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>Félicitations ! Votre Pass Privilège est Actif 🎉</h2>
            <p style={{ color: "#c2c9c4", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Votre quota quotidien est passé immédiatement à **50 fiches de découverte**. Profitez d'une expérience exclusive !
            </p>
            <Link
              href="/discover"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#52b788", color: "#0b130e", fontWeight: "700", padding: "0.8rem 2rem", borderRadius: "25px", textDecoration: "none" }}
            >
              Retourner à la Découverte
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
