"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, ArrowLeft, Upload, CheckCircle2, UserCheck, Heart, FileText, Camera } from "lucide-react";
import { AFRICAN_COUNTRIES } from "@belle-ame/shared-types";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    gender: "FEMALE",
    birthDate: "",
    country: "CAMEROON",
    city: "Douala",
    intent: "MARRIAGE",
    education: "MASTER",
    profession: "Ingénieur Télécom",
    religion: "CHRISTIANITY",
    familyGoal: "WANTS_CHILDREN",
    bio: "Femme pieuse et ambitieuse cherchant un partenaire de vie respectueux et orienté famille.",
    photos: [] as string[],
    kycDocument: null as string | null,
    selfie: null as string | null
  });

  const nextStep = () => setStep((s: number) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s: number) => Math.max(s - 1, 1));

  const handleFinish = () => {
    window.location.href = "/discover";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <span style={{ fontWeight: "700", fontSize: "1rem" }}>Création de Votre Profil Sincère</span>
        </div>
        <div style={{ fontSize: "0.85rem", color: "#d4a373", fontWeight: "600" }}>
          Étape {step} sur 5
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ height: "4px", backgroundColor: "#081c15", width: "100%" }}>
        <div style={{ height: "100%", backgroundColor: "#d4a373", width: `${(step / 5) * 100}%`, transition: "width 0.3s ease" }} />
      </div>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "600px", width: "100%", backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", padding: "2.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>

          {/* Step 1: Civility & Age */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>1. État Civil & Vérification de Majorité</h2>
              <p style={{ color: "#a0aba4", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Conformément aux règles de sécurité de la plateforme, seuls les célibataires majeurs (18 ans et plus) sont admis.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Prénom complet</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Ex: Aminata"
                    style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Genre</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                      style={{
                        padding: "0.9rem",
                        borderRadius: "12px",
                        border: formData.gender === "FEMALE" ? "2px solid #d4a373" : "1px solid rgba(212, 163, 115, 0.3)",
                        backgroundColor: formData.gender === "FEMALE" ? "rgba(212, 163, 115, 0.15)" : "#081c15",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Femme
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "MALE" })}
                      style={{
                        padding: "0.9rem",
                        borderRadius: "12px",
                        border: formData.gender === "MALE" ? "2px solid #d4a373" : "1px solid rgba(212, 163, 115, 0.3)",
                        backgroundColor: formData.gender === "MALE" ? "rgba(212, 163, 115, 0.15)" : "#081c15",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Homme
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Date de naissance (Obligatoire 18+)</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Intent & Location */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>2. Intention & Localisation</h2>
              <p style={{ color: "#a0aba4", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Définissez votre vision relationnelle et votre pays d'ancrage.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Objectif recherché</label>
                  <select
                    value={formData.intent}
                    onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none" }}
                  >
                    <option value="MARRIAGE">💍 Mariage durable & Construction de foyer</option>
                    <option value="SERIOUS_RELATIONSHIP">❤️ Relation sérieuse menant au mariage</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Pays de résidence actuel</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none" }}
                  >
                    {AFRICAN_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Douala, Cotonou, Abidjan, Paris..."
                    style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Values & Lifestyle */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>3. Valeurs Culturelles & Style de Vie</h2>
              <p style={{ color: "#a0aba4", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Ces critères alimentent directement notre algorithme déterministe de compatibilité (0-100%).
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Niveau d'études</label>
                  <select
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none" }}
                  >
                    <option value="BACHELOR">Licence / Bac +3</option>
                    <option value="MASTER">Master / Bac +5</option>
                    <option value="DOCTORATE">Doctorat / Ph.D.</option>
                    <option value="OTHER">Autre formation qualifiante</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Spiritualité / Foi</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none" }}
                  >
                    <option value="CHRISTIANITY">Chrétienne (Catholique, Évangélique, Protestante)</option>
                    <option value="ISLAM">Musulmane</option>
                    <option value="OTHER">Spiritualité personnelle / Respectueuse</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Bio & Présentation personnelle</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos Upload */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>4. Photos de Profil (Jusqu'à 6)</h2>
              <p style={{ color: "#a0aba4", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                🔒 Vos photos sont automatiquement anonymisées au niveau des métadonnées EXIF et optimisées en WebP pour protéger votre vie privée.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      height: "120px",
                      borderRadius: "16px",
                      border: "2px dashed rgba(212, 163, 115, 0.3)",
                      backgroundColor: "#081c15",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#d4a373",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      gap: "0.35rem"
                    }}
                  >
                    <Camera size={24} />
                    <span>Photo {idx}</span>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: "rgba(82, 183, 136, 0.1)", border: "1px solid rgba(82, 183, 136, 0.3)", padding: "0.75rem 1rem", borderRadius: "12px", color: "#52b788", fontSize: "0.85rem" }}>
                ✅ Filtre anti-nudité & purge géolocalisation activés par défaut.
              </div>
            </div>
          )}

          {/* Step 5: KYC Verification Vault */}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>5. Coffre-Fort KYC & Empreinte Faciale</h2>
              <p style={{ color: "#a0aba4", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Pour garantir la promesse de profils 100% réels et éviter les faux profils WhatsApp, soumettez votre pièce d'identité officielle.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ border: "2px dashed #d4a373", padding: "1.5rem", borderRadius: "16px", backgroundColor: "#081c15", textAlign: "center" }}>
                  <FileText size={32} color="#d4a373" style={{ marginBottom: "0.5rem" }} />
                  <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>Téléverser votre CNI ou Passeport</div>
                  <div style={{ fontSize: "0.8rem", color: "#7a8780", marginTop: "0.25rem" }}>Stockage chiffré dans le coffre-fort isolé `belleame-private-kyc-vault`</div>
                </div>

                <div style={{ border: "2px dashed #52b788", padding: "1.5rem", borderRadius: "16px", backgroundColor: "#081c15", textAlign: "center" }}>
                  <UserCheck size={32} color="#52b788" style={{ marginBottom: "0.5rem" }} />
                  <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>Prendre une photo selfie de contrôle</div>
                  <div style={{ fontSize: "0.8rem", color: "#7a8780", marginTop: "0.25rem" }}>Test de liveness et comparaison faciale automatisée</div>
                </div>
              </div>

              <div style={{ backgroundColor: "rgba(212, 163, 115, 0.1)", padding: "0.8rem 1rem", borderRadius: "12px", fontSize: "0.8rem", color: "#d4a373", lineHeight: "1.4" }}>
                🛡️ Votre document reste strictement confidentiel et sera détruit après validation conformément aux directives RGPD.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(212, 163, 115, 0.3)",
                  color: "#d4a373",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "600"
                }}
              >
                <ArrowLeft size={18} /> Précédent
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                style={{
                  backgroundColor: "#d4a373",
                  color: "#0b130e",
                  border: "none",
                  padding: "0.8rem 1.75rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "700"
                }}
              >
                Continuer <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                style={{
                  backgroundColor: "#52b788",
                  color: "#0b130e",
                  border: "none",
                  padding: "0.8rem 1.75rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "700"
                }}
              >
                Valider & Découvrir mes Profils <CheckCircle2 size={18} />
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
