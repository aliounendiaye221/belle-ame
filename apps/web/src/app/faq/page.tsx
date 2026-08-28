"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Shield, Heart, CreditCard, Search } from "lucide-react";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "Inscription",
    question: "Qui peut s'inscrire sur « À Chacun Une Belle Âme » ?",
    answer: "La plateforme est réservée aux personnes majeures (18 ans minimum) cherchant une relation sérieuse orientée vers le mariage ou un engagement durable. L'inscription est ouverte aux résidents du Cameroun 🇨🇲, Bénin 🇧🇯, Côte d'Ivoire 🇨🇮 et à la diaspora africaine 🇫🇷. Une vérification d'identité KYC est obligatoire pour garantir l'authenticité des profils."
  },
  {
    id: "faq-2",
    category: "Inscription",
    question: "Pourquoi dois-je fournir une pièce d'identité et un selfie ?",
    answer: "La vérification KYC (Know Your Customer) est au cœur de notre engagement de sécurité. Elle nous permet de confirmer que chaque membre est une personne réelle et majeure, éliminant ainsi les faux profils et les tentatives de broutage. Vos documents sont chiffrés AES-256-GCM et ne sont jamais partagés avec d'autres membres."
  },
  {
    id: "faq-3",
    category: "Sécurité",
    question: "Comment la plateforme me protège-t-elle contre le broutage ?",
    answer: "Notre système anti-broutage analyse en temps réel les messages échangés. Si des mots-clés financiers suspects sont détectés (demandes d'argent, transferts Mobile Money, etc.), une alerte automatique est déclenchée. Notre équipe de modération intervient sous un SLA de 24 heures maximum. 9 niveaux de sanctions sont appliqués selon la gravité."
  },
  {
    id: "faq-4",
    category: "Sécurité",
    question: "Mes données personnelles sont-elles protégées ?",
    answer: "Absolument. Nous respectons le RGPD et les réglementations africaines de protection des données. Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Vous pouvez à tout moment exporter vos données (Paramètres > Confidentialité > Export JSON) ou demander la suppression de votre compte avec un délai de grâce de 14 jours."
  },
  {
    id: "faq-5",
    category: "Compatibilité",
    question: "Comment fonctionne le score de compatibilité ?",
    answer: "Notre algorithme de compatibilité utilise l'indice de Jaccard pour calculer un score déterministe de 0 à 100% basé sur vos valeurs culturelles, spirituelles, vos intentions de vie (mariage, enfants), et vos préférences déclarées. Aucune IA opaque — vous voyez exactement pourquoi vous êtes compatibles à X%."
  },
  {
    id: "faq-6",
    category: "Compatibilité",
    question: "Combien de profils puis-je découvrir par jour ?",
    answer: "Les membres gratuits disposent de 10 découvertes par jour. Les abonnés Premium (Pass Privilège à 5 000 FCFA/mois) bénéficient de 50 découvertes quotidiennes, de la fonctionnalité « Incognito Privilège » pour naviguer sans être vu, et d'un accès prioritaire aux nouveaux profils."
  },
  {
    id: "faq-7",
    category: "Abonnement",
    question: "Comment fonctionne le paiement ?",
    answer: "Nous acceptons les paiements Mobile Money (MTN MoMo, Orange Money, Wave FCFA) via notre partenaire CinetPay. Le processus est sécurisé par un checkout idempotent : si votre réseau est instable, vous ne serez jamais débité deux fois. Vous recevez une confirmation SMS immédiate."
  },
  {
    id: "faq-8",
    category: "Abonnement",
    question: "Puis-je annuler mon abonnement ?",
    answer: "Oui, vous pouvez annuler à tout moment depuis Paramètres > Abonnement. Votre accès Premium reste actif jusqu'à la fin de la période payée. Aucun engagement longue durée — vous êtes libre mois par mois."
  },
  {
    id: "faq-9",
    category: "WhatsApp",
    question: "Comment rejoindre la communauté WhatsApp des pionniers ?",
    answer: "Rejoignez notre communauté de 9 000+ membres sur WhatsApp pour recevoir des conseils relationnels, des témoignages de couples formés, et des codes promo exclusifs. Lors de votre inscription, entrez votre code pionnier pour bénéficier d'un mois Premium offert."
  },
  {
    id: "faq-10",
    category: "Support",
    question: "Comment contacter le support ?",
    answer: "Vous pouvez nous contacter via le chat intégré (icône en bas à droite), par e-mail à support@belleame.africa, ou via nos communautés WhatsApp. Notre équipe de modération répond sous 24 heures ouvrées. Pour les urgences de sécurité, utilisez le bouton « Signaler » disponible sur chaque profil et dans chaque conversation."
  }
];

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Toutes");

  const categories = ["Toutes", ...Array.from(new Set(FAQ_DATA.map((f: FaqItem) => f.category)))];

  const filtered = FAQ_DATA.filter((f: FaqItem) => {
    const matchesSearch = searchTerm === "" || f.question.toLowerCase().includes(searchTerm.toLowerCase()) || f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "Toutes" || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryIcons: Record<string, React.ReactNode> = {
    Inscription: <Heart size={16} />,
    Sécurité: <Shield size={16} />,
    Compatibilité: <Heart size={16} />,
    Abonnement: <CreditCard size={16} />,
    WhatsApp: <MessageCircle size={16} />,
    Support: <HelpCircle size={16} />
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #d4a373, #e07a5f)", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.1rem" }}>Â</div>
          </Link>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Questions Fréquentes</div>
            <div style={{ fontSize: "0.7rem", color: "#52b788" }}>Centre d&apos;aide & Support</div>
          </div>
        </div>
        <Link href="/" style={{ background: "rgba(212, 163, 115, 0.1)", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#d4a373", padding: "8px 16px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: "600" }}>
          Retour Accueil
        </Link>
      </header>

      <div style={{ maxWidth: "750px", margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8a968f" }} />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 14px 14px 42px",
              borderRadius: "14px",
              border: "1px solid rgba(212, 163, 115, 0.2)",
              background: "rgba(26, 46, 34, 0.6)",
              color: "#f8f9fa",
              fontSize: "0.9rem",
              outline: "none"
            }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: categoryFilter === cat ? "1px solid #d4a373" : "1px solid rgba(255,255,255,0.1)",
                background: categoryFilter === cat ? "rgba(212, 163, 115, 0.2)" : "rgba(255,255,255,0.03)",
                color: categoryFilter === cat ? "#d4a373" : "#8a968f",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease"
              }}
            >
              {cat !== "Toutes" && categoryIcons[cat]}
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#8a968f" }}>
              <HelpCircle size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <p style={{ fontWeight: "600" }}>Aucun résultat pour votre recherche</p>
            </div>
          )}

          {filtered.map((faq: FaqItem) => (
            <div
              key={faq.id}
              style={{
                borderRadius: "14px",
                background: "rgba(26, 46, 34, 0.5)",
                border: openId === faq.id ? "1px solid rgba(212, 163, 115, 0.3)" : "1px solid rgba(212, 163, 115, 0.08)",
                overflow: "hidden",
                transition: "all 0.2s ease"
              }}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                style={{
                  width: "100%",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  background: "none",
                  border: "none",
                  color: "#f8f9fa",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                  <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: "999px", backgroundColor: "rgba(82, 183, 136, 0.15)", color: "#52b788", fontWeight: "600", border: "1px solid rgba(82, 183, 136, 0.3)", whiteSpace: "nowrap" }}>
                    {faq.category}
                  </span>
                  <span style={{ fontWeight: "600", fontSize: "0.9rem", lineHeight: "1.3" }}>{faq.question}</span>
                </div>
                {openId === faq.id ? <ChevronUp size={18} style={{ color: "#d4a373", flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "#8a968f", flexShrink: 0 }} />}
              </button>

              {openId === faq.id && (
                <div style={{ padding: "0 1.25rem 1.25rem 1.25rem", borderTop: "1px solid rgba(212, 163, 115, 0.1)" }}>
                  <p style={{ fontSize: "0.85rem", color: "#c2c9c4", lineHeight: "1.6", paddingTop: "1rem" }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{ marginTop: "3rem", padding: "2rem", borderRadius: "18px", background: "linear-gradient(135deg, rgba(45, 106, 79, 0.3), rgba(26, 46, 34, 0.6))", border: "1px solid rgba(82, 183, 136, 0.2)", textAlign: "center" }}>
          <MessageCircle size={32} style={{ color: "#52b788", marginBottom: "0.75rem" }} />
          <h3 style={{ fontWeight: "800", fontSize: "1.1rem", marginBottom: "0.5rem" }}>Vous ne trouvez pas votre réponse ?</h3>
          <p style={{ fontSize: "0.85rem", color: "#c2c9c4", marginBottom: "1.25rem" }}>Notre équipe de support vous répond sous 24 heures ouvrées.</p>
          <a href="mailto:support@belleame.africa" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "999px", background: "linear-gradient(135deg, #d4a373, #e07a5f)", color: "#0b130e", fontWeight: "700", fontSize: "0.9rem", textDecoration: "none" }}>
            ✉️ support@belleame.africa
          </a>
        </div>
      </div>
    </div>
  );
}
