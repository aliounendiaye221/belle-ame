"use client";

import React, { useState } from "react";
import { Sparkles, MessageCircle, Bot, Send, CheckCircle2, ChevronRight, Shield } from "lucide-react";

interface AdvicePrompt {
  id: string;
  label: string;
  advice: string;
  script?: string;
}

const ADVICE_LIST: AdvicePrompt[] = [
  {
    id: "icebreaker",
    label: "✨ Phrase d'accroche élégante & respectueuse",
    advice:
      "Dans notre culture, la noblesse des mots fait la différence. Évitez les simples « cc », « cv ? » ou les compliments physiques appuyés. Privilégiez un point d'intérêt commun découvert sur son profil.",
    script:
      "« Bonjour [Prénom], j'ai été touché par votre démarche et la place centrale que vous accordez à [Valeur/Projet]. Dans une démarche sincère de bâtir un foyer solide, je serais honoré d'échanger avec vous si le cœur vous en dit. Que votre journée soit paisible. »",
  },
  {
    id: "finance",
    label: "💰 Aborder la vision financière & la gestion du foyer",
    advice:
      "L'argent est un des piliers de sérénité du mariage. Il ne s'agit pas de juger les revenus, mais de vérifier l'alignement des valeurs : solidarité avec la belle-famille, épargne, investissements en Afrique.",
    script:
      "« Pour moi, la réussite d'un foyer repose sur la transparence et l'entraide financière. Quelle est votre conception du rôle de chacun et du soutien envers nos proches ? »",
  },
  {
    id: "family",
    label: "👑 Concilier foi, traditions & autonomie du couple",
    advice:
      "L'accord et le respect des aînés sont précieux, mais le couple doit rester soudé et autonome dans ses choix quotidiens. Posez les jalons dès le début.",
    script:
      "« Comment envisagez-vous l'équilibre entre la vie intime de notre futur foyer et les attentes respectives de nos familles élargies ? »",
  },
  {
    id: "redflags",
    label: "🛡️ Détecter le sérieux et repousser les opportunistes",
    advice:
      "Règle d'or sur À Chacun Une Belle Âme : quiconque sollicite un transfert d'argent, une recharge téléphonique ou refuse un appel vidéo après quelques échanges n'est pas sincère. Signalez immédiatement le profil.",
    script:
      "Rappel de sécurité : Ne transférez jamais d'argent par Mobile Money à une personne que vous n'avez pas rencontrée physiquement en présence de témoins.",
  },
];

export default function AiMatrimonialAdvisor() {
  const [selectedId, setSelectedId] = useState<string>("icebreaker");
  const fallbackAdvice = ADVICE_LIST[0] as AdvicePrompt;
  const currentAdvice = (ADVICE_LIST.find((a) => a.id === selectedId) || fallbackAdvice) as AdvicePrompt;

  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(16, 32, 23, 0.95), rgba(7, 13, 9, 0.98))",
        border: "1px solid rgba(212, 163, 115, 0.3)",
        borderRadius: "24px",
        padding: "2.25rem",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f4c07c, #d4a373)",
              color: "#070d09",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(244, 192, 124, 0.35)",
            }}
          >
            <Bot size={26} />
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "#f4c07c", fontWeight: 800 }}>
              ✦ Conseiller d'Honneur IA ✦
            </span>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fbfbfb", margin: 0 }}>
              L'Aîné Bienveillant & Coach Matrimonial
            </h3>
          </div>
        </div>

        <span
          style={{
            fontSize: "0.78rem",
            color: "#52b788",
            backgroundColor: "rgba(82, 183, 136, 0.12)",
            border: "1px solid rgba(82, 183, 136, 0.25)",
            padding: "4px 12px",
            borderRadius: "999px",
            fontWeight: 700,
          }}
        >
          ● Disponible 24h/24
        </span>
      </div>

      <p style={{ color: "#c7cfcb", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
        Inspiré de la sagesse des mariages d'Afrique et soutenu par nos algorithmes : posez une question ou cliquez sur un sujet pour recevoir un conseil raffiné.
      </p>

      {/* Prompts list */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        {ADVICE_LIST.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            onClick={() => setSelectedId(prompt.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              border: prompt.id === selectedId ? "1px solid #f4c07c" : "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: prompt.id === selectedId ? "rgba(212, 163, 115, 0.2)" : "rgba(7, 13, 9, 0.6)",
              color: prompt.id === selectedId ? "#f4c07c" : "#94a39b",
              fontWeight: prompt.id === selectedId ? 800 : 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Advice Display Box */}
      <div
        style={{
          backgroundColor: "rgba(7, 13, 9, 0.85)",
          border: "1px solid rgba(212, 163, 115, 0.25)",
          borderRadius: "16px",
          padding: "1.5rem",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "1rem" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(212, 163, 115, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f4c07c", flexShrink: 0, marginTop: "2px" }}>
            <Sparkles size={14} />
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f4c07c", marginBottom: "6px" }}>
              Recommandation de l'Aîné :
            </h4>
            <p style={{ color: "#fbfbfb", fontSize: "0.92rem", lineHeight: "1.6", margin: 0 }}>
              {currentAdvice.advice}
            </p>
          </div>
        </div>

        {currentAdvice.script && (
          <div
            style={{
              backgroundColor: "rgba(212, 163, 115, 0.08)",
              border: "1px dashed rgba(212, 163, 115, 0.35)",
              borderRadius: "12px",
              padding: "1rem",
              marginTop: "1rem",
            }}
          >
            <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#d4a373", fontWeight: 800, marginBottom: "6px" }}>
              Exemple de formulation d'honneur :
            </span>
            <p style={{ fontStyle: "italic", color: "#f4c07c", fontSize: "0.88rem", lineHeight: "1.5", margin: 0 }}>
              {currentAdvice.script}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
