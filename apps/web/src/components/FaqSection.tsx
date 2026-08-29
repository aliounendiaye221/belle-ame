"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldAlert, CreditCard, Lock, Sparkles } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: "Sécurité & Vérification",
    question: "Comment garantissez-vous l'absence totale de faux profils et de broutage ?",
    answer:
      "Chaque inscription fait l'objet d'une vérification humaine sous 24 heures avec exigence d'une pièce officielle d'identité (CNI, Passeport ou Permis de conduire) pour attester de l'âge légal (18 ans et plus). De plus, nos algorithmes scannent en temps réel les échanges pour bannir immédiatement toute détection de sollicitation d'argent ou de liens suspects.",
  },
  {
    category: "Vie Privée & Pudeur",
    question: "Puis-je masquer ou flouter mes photos pour préserver ma discrétion professionnelle ?",
    answer:
      "Absolument. Inspirée de nos valeurs de pudeur et de respect, notre plateforme intègre le « Mode Discrétion ». Vos photos peuvent être floutées par défaut, et vous seule ou vous seul décidez de les révéler aux personnes avec lesquelles un coup de cœur mutuel et respectueux aura été confirmé.",
  },
  {
    category: "Paiements FCFA & Mobile Money",
    question: "Quels sont les moyens de paiement acceptés pour les formules Sérénité & Alliance ?",
    answer:
      "Nous acceptons tous les portefeuilles Mobile Money les plus utilisés en Afrique de l'Ouest et Centrale : Wave (Sénégal, Côte d'Ivoire), Orange Money, MTN MoMo (Cameroun, Bénin, Côte d'Ivoire) et Moov Money, ainsi que les cartes bancaires internationales (Visa, Mastercard) pour les membres de la diaspora.",
  },
  {
    category: "Engagement & Démarche",
    question: "Pourquoi la plateforme est-elle sélective avec un tarif après la découverte ?",
    answer:
      "La gratuité totale attire malheureusement la légèreté, les curieux et les arnaques. Fixer un tarif accessible (à partir de 3 000 FCFA) constitue un filtre d'engagement fondamental qui garantit que chaque personne que vous croisez ici est animée d'une volonté sérieuse d'aboutir au mariage.",
  },
  {
    category: "Pionniers WhatsApp",
    question: "Comment utiliser mon code privilège WhatsApp (9 000 pionniers) ?",
    answer:
      "Si vous faisiez partie de notre communauté WhatsApp historique des 9 000 membres, entrez votre code privilège (ex: WA-COMMUNITY-9000) lors de votre inscription pour débloquer automatiquement 1 mois d'abonnement Sérénité offert ainsi que le badge exclusif « Ambassadeur Fondateur ».",
  },
  {
    category: "Zones Géographiques",
    question: "Dans quels pays la plateforme est-elle disponible ?",
    answer:
      "Nous concentrons nos actions au Cameroun, en Côte d'Ivoire, au Bénin, au Sénégal et dans la diaspora africaine (France, Belgique, Canada, États-Unis). Les célibataires d'autres pays d'Afrique subsaharienne peuvent également s'inscrire sous réserve de validation de leur pièce d'identité.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section style={{ padding: "5rem 2rem", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
            marginBottom: "12px",
          }}
        >
          ✦ Transparence & Réponses ✦
        </span>
        <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)", fontWeight: 800, letterSpacing: "-0.5px", color: "#fbfbfb" }}>
          Foire Aux Questions Fréquentes
        </h2>
        <p style={{ color: "#c7cfcb", fontSize: "1.02rem", maxWidth: "600px", margin: "10px auto 0", lineHeight: "1.6" }}>
          Toutes les réponses pour aborder votre démarche sentimentale l'esprit serein et le cœur confiant.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              style={{
                background: "linear-gradient(145deg, rgba(16, 32, 23, 0.75), rgba(7, 13, 9, 0.9))",
                border: isOpen ? "1px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.2)",
                borderRadius: "16px",
                overflow: "hidden",
                transition: "all 0.25s ease",
              }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                style={{
                  width: "100%",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  color: isOpen ? "#f4c07c" : "#fbfbfb",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  gap: "1rem",
                }}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    color: isOpen ? "#f4c07c" : "#94a39b",
                    flexShrink: 0,
                  }}
                />
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: "0 1.5rem 1.25rem",
                    color: "#c7cfcb",
                    fontSize: "0.95rem",
                    lineHeight: "1.65",
                    borderTop: "1px solid rgba(212, 163, 115, 0.12)",
                    paddingTop: "1rem",
                  }}
                >
                  <p style={{ margin: 0 }}>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
