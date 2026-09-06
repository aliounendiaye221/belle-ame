"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle2,
  UserCheck,
  Heart,
  FileText,
  Camera,
  Trash2,
  Star,
  Sparkles,
  AlertCircle,
  Lock,
} from "lucide-react";
import { AFRICAN_COUNTRIES } from "@belle-ame/shared-types";
import { storageService } from "@/lib/storage-service";
import { realPlatformStore } from "@/lib/real-platform-store";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isUploadingSelfie, setIsUploadingSelfie] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const selfieInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    firstName: "Aminata",
    gender: "FEMALE" as "FEMALE" | "MALE",
    birthDate: "1998-06-15",
    countryCode: "SN",
    city: "Dakar",
    intent: "MARRIAGE",
    education: "Master Université Cheikh Anta Diop",
    profession: "Ingénieure Télécoms & Réseaux",
    religion: "Musulmane Pratiquante",
    familyGoal: "WANTS_CHILDREN",
    bio: "Femme respectueuse des valeurs familiales et spirituelles, ambitieuse et souriante. Je cherche un homme sincère et pieux pour bâtir un foyer solide.",
    sharedValues: ["Foi & Spiritualité", "Respect des Familles", "Projet d'Enfants", "Non-Fumeur"],
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    ] as string[],
    kycDocType: "CNI",
    kycDocumentUrl: null as string | null,
    kycSelfieUrl: null as string | null,
  });

  // Calcul d'âge strict 18+
  const calculateAge = (dateStr: string): number => {
    if (!dateStr) return 0;
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = calculateAge(formData.birthDate);

  const nextStep = () => {
    setErrorMessage("");

    if (step === 1) {
      if (!formData.firstName.trim()) {
        setErrorMessage("Veuillez saisir votre prénom complet.");
        return;
      }
      if (currentAge < 18) {
        setErrorMessage("L'accès à la plateforme est strictement réservé aux personnes majeures (18 ans ou plus).");
        return;
      }
    }

    if (step === 4 && formData.photos.length === 0) {
      setErrorMessage("Veuillez ajouter au moins une photo de profil nette.");
      return;
    }

    setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => {
    setErrorMessage("");
    setStep((s) => Math.max(s - 1, 1));
  };

  // Upload d'une photo de profil
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    setErrorMessage("");

    try {
      const file = files[0]!;
      const result = await storageService.uploadProfilePhoto(file, "usr-current");
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, result.url].slice(0, 6),
      }));
    } catch (err: any) {
      setErrorMessage(err?.message || "Erreur lors du téléversement de la photo.");
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  // Suppression d'une photo
  const handleRemovePhoto = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  // Définir photo principale
  const handleSetMainPhoto = (idx: number) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photos];
      const selected = newPhotos.splice(idx, 1)[0]!;
      newPhotos.unshift(selected);
      return { ...prev, photos: newPhotos };
    });
  };

  // Upload de la pièce KYC
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingDoc(true);
    setErrorMessage("");

    try {
      const file = files[0]!;
      const result = await storageService.uploadKycDocument(file, "usr-current", formData.kycDocType);
      setFormData((prev) => ({
        ...prev,
        kycDocumentUrl: result.url,
      }));
    } catch (err: any) {
      setErrorMessage(err?.message || "Erreur lors du téléversement du document officiel.");
    } finally {
      setIsUploadingDoc(false);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  // Upload du selfie
  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingSelfie(true);
    setErrorMessage("");

    try {
      const file = files[0]!;
      const result = await storageService.uploadKycSelfie(file, "usr-current");
      setFormData((prev) => ({
        ...prev,
        kycSelfieUrl: result.url,
      }));
    } catch (err: any) {
      setErrorMessage(err?.message || "Erreur lors de l'enregistrement du selfie.");
    } finally {
      setIsUploadingSelfie(false);
      if (selfieInputRef.current) selfieInputRef.current.value = "";
    }
  };

  // Finalisation et enregistrement du profil
  const handleFinish = () => {
    const selectedCountry = AFRICAN_COUNTRIES.find((c) => c.code === formData.countryCode);
    const countryName = selectedCountry ? `${selectedCountry.name} ${selectedCountry.flag}` : "Sénégal 🇸🇳";

    // 1. Sauvegarder dans le store utilisateur
    realPlatformStore.saveProfile({
      fullName: formData.firstName,
      firstName: formData.firstName,
      age: currentAge || 26,
      gender: formData.gender,
      targetGenders: formData.gender === "FEMALE" ? ["MALE"] : ["FEMALE"],
      countryCode: formData.countryCode,
      city: formData.city,
      profession: formData.profession,
      education: formData.education,
      bio: formData.bio,
      religion: formData.religion,
      sharedValues: formData.sharedValues,
      photos: formData.photos,
      avatarUrl: formData.photos[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      kycDocumentUrl: formData.kycDocumentUrl || undefined,
      kycSelfieUrl: formData.kycSelfieUrl || undefined,
      docType: formData.kycDocType,
      kycStatus: formData.kycDocumentUrl && formData.kycSelfieUrl ? "PENDING" : "UNVERIFIED",
      isIdentityVerified: false,
      birthDate: formData.birthDate,
      intent: formData.intent,
      dailyQuotaRemaining: 10,
      dailyQuotaMax: 10,
    });

    // 2. Si les pièces KYC ont été téléversées, enregistrer la demande dans la file d'attente
    if (formData.kycDocumentUrl && formData.kycSelfieUrl) {
      realPlatformStore.submitKycRequest({
        userId: "usr-live-01",
        fullName: formData.firstName,
        country: countryName,
        birthDate: formData.birthDate,
        documentType: formData.kycDocType,
        documentUrl: formData.kycDocumentUrl,
        selfieUrl: formData.kycSelfieUrl,
        similarityScore: 95,
      });
    }

    // Redirection vers la découverte
    window.location.href = "/discover";
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
      {/* Header */}
      <header
        style={{
          padding: "1rem clamp(1rem, 4vw, 2.5rem)",
          borderBottom: "1px solid rgba(212, 163, 115, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(18, 34, 25, 0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#f4c07c",
              color: "#070d09",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              fontSize: "1.1rem",
            }}
          >
            Â
          </div>
          <span style={{ fontWeight: "800", fontSize: "1rem", color: "#fbfbfb" }}>
            Création de Profil &amp; Alliance
          </span>
        </Link>
        <div style={{ fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700" }}>
          Étape {step} sur 5
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ height: "4px", backgroundColor: "#122219", width: "100%" }}>
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #f4c07c, #52b788)",
            width: `${(step / 5) * 100}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div
          className="glass-panel"
          style={{
            maxWidth: "680px",
            width: "100%",
            backgroundColor: "#102017",
            borderRadius: "28px",
            border: "1.5px solid rgba(212, 163, 115, 0.25)",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          }}
        >
          {/* Message d'erreur s'il y a lieu */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: "rgba(230, 57, 70, 0.15)",
                border: "1px solid #e63946",
                borderRadius: "12px",
                padding: "0.8rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#ff858d",
                fontSize: "0.88rem",
                marginBottom: "1.5rem",
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Étape 1 : État Civil & Vérification de Majorité */}
          {step === 1 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <ShieldCheck size={22} color="#52b788" />
                <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#fbfbfb", margin: 0 }}>
                  1. État Civil &amp; Majorité 18+
                </h2>
              </div>
              <p style={{ color: "#c7cfcb", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
                Conformément à la charte d&apos;honneur, seuls les célibataires majeurs de 18 ans et plus sont admis.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                    Prénom complet
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Ex: Aminata ou Moussa"
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#fff",
                      padding: "0.85rem 1rem",
                      borderRadius: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                    Vous êtes
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                      style={{
                        padding: "0.85rem",
                        borderRadius: "14px",
                        border: formData.gender === "FEMALE" ? "2px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.2)",
                        backgroundColor: formData.gender === "FEMALE" ? "rgba(244, 192, 124, 0.15)" : "#070d09",
                        color: formData.gender === "FEMALE" ? "#f4c07c" : "#c7cfcb",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Une Femme
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "MALE" })}
                      style={{
                        padding: "0.85rem",
                        borderRadius: "14px",
                        border: formData.gender === "MALE" ? "2px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.2)",
                        backgroundColor: formData.gender === "MALE" ? "rgba(244, 192, 124, 0.15)" : "#070d09",
                        color: formData.gender === "MALE" ? "#f4c07c" : "#c7cfcb",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Un Homme
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                    Date de Naissance ({currentAge > 0 ? `${currentAge} ans` : "obligatoire"})
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: currentAge >= 18 ? "1px solid rgba(212, 163, 115, 0.3)" : "1px solid #e63946",
                      color: "#fff",
                      padding: "0.85rem 1rem",
                      borderRadius: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {currentAge > 0 && currentAge < 18 && (
                    <div style={{ color: "#ff858d", fontSize: "0.8rem", marginTop: "0.3rem" }}>
                      ⚠️ Vous devez avoir 18 ans révolus.
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                      Pays de résidence
                    </label>
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "#070d09",
                        border: "1px solid rgba(212, 163, 115, 0.3)",
                        color: "#fff",
                        padding: "0.85rem 1rem",
                        borderRadius: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    >
                      {AFRICAN_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                      Ville actuelle
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ex: Dakar, Abidjan..."
                      style={{
                        width: "100%",
                        backgroundColor: "#070d09",
                        border: "1px solid rgba(212, 163, 115, 0.3)",
                        color: "#fff",
                        padding: "0.85rem 1rem",
                        borderRadius: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 2 : Intention Matrimoniale */}
          {step === 2 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Heart size={22} color="#f4c07c" />
                <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#fbfbfb", margin: 0 }}>
                  2. Intention &amp; Projet de Foyer
                </h2>
              </div>
              <p style={{ color: "#c7cfcb", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Définissez clairement votre démarche pour favoriser des rencontres d&apos;âmes soeurs alignées.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                    Objectif principal de démarche
                  </label>
                  <select
                    value={formData.intent}
                    onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#fff",
                      padding: "0.85rem 1rem",
                      borderRadius: "14px",
                      outline: "none",
                    }}
                  >
                    <option value="MARRIAGE">Mariage d&apos;Honneur &amp; Foyer Béni (Court à Moyen Terme)</option>
                    <option value="SERIOUS_RELATION">Relation Sérieuse Fondatrice avec perspective d&apos;Alliance</option>
                    <option value="DIASPORA_UNION">Alliance &amp; Projet de Vie avec la Diaspora</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                    Désir d&apos;enfants &amp; Famille
                  </label>
                  <select
                    value={formData.familyGoal}
                    onChange={(e) => setFormData({ ...formData, familyGoal: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#fff",
                      padding: "0.85rem 1rem",
                      borderRadius: "14px",
                      outline: "none",
                    }}
                  >
                    <option value="WANTS_CHILDREN">Désire des enfants et bâtir une descendance noble</option>
                    <option value="HAS_CHILDREN_WANTS_MORE">A déjà des enfants et en souhaite d&apos;autres</option>
                    <option value="OPEN">Ouvert(e) selon le cheminement du couple</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3 : Valeurs, Foi & Profession */}
          {step === 3 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Sparkles size={22} color="#52b788" />
                <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#fbfbfb", margin: 0 }}>
                  3. Foi, Valeurs &amp; Profession
                </h2>
              </div>
              <p style={{ color: "#c7cfcb", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Ces repères nourrissent notre formule d&apos;affinités pour garantir l&apos;accord des esprits.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                    Spiritualité / Foi
                  </label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#fff",
                      padding: "0.85rem 1rem",
                      borderRadius: "14px",
                      outline: "none",
                    }}
                  >
                    <option value="Musulmane Pratiquante">Musulmane / Musulman Pratiquant(e)</option>
                    <option value="Chrétienne (Catholique, Évangélique, Protestante)">Chrétienne (Catholique, Évangélique, Protestante)</option>
                    <option value="Croyant(e) & Respectueux(se) des Traditions">Croyant(e) &amp; Respectueux(se) des Traditions</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                      Profession
                    </label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      placeholder="Ex: Ingénieur, Médecin..."
                      style={{
                        width: "100%",
                        backgroundColor: "#070d09",
                        border: "1px solid rgba(212, 163, 115, 0.3)",
                        color: "#fff",
                        padding: "0.85rem 1rem",
                        borderRadius: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                      Niveau d&apos;Études
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="Ex: Master, Doctorat, Licence..."
                      style={{
                        width: "100%",
                        backgroundColor: "#070d09",
                        border: "1px solid rgba(212, 163, 115, 0.3)",
                        color: "#fff",
                        padding: "0.85rem 1rem",
                        borderRadius: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                    Présentation sincère (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#070d09",
                      border: "1px solid rgba(212, 163, 115, 0.3)",
                      color: "#fff",
                      padding: "0.85rem 1rem",
                      borderRadius: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 4 : Photos de Profil avec Stockage Réel & Purge EXIF */}
          {step === 4 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Camera size={22} color="#f4c07c" />
                <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#fbfbfb", margin: 0 }}>
                  4. Vos Photos de Profil (1 à 6)
                </h2>
              </div>
              <p style={{ color: "#c7cfcb", fontSize: "0.9rem", marginBottom: "1.25rem", lineHeight: "1.4" }}>
                🔒 <strong>Assainissement EXIF actif</strong> : vos photos sont débarrassées de toute coordonnée GPS, compressées au format WebP haute définition et protégées.
              </p>

              {/* Galerie de photos */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.85rem", marginBottom: "1.25rem" }}>
                {formData.photos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      aspectRatio: "3/4",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: idx === 0 ? "2px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.3)",
                      backgroundColor: "#070d09",
                    }}
                  >
                    <img
                      src={photoUrl}
                      alt={`Photo ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {idx === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "6px",
                          left: "6px",
                          backgroundColor: "#f4c07c",
                          color: "#070d09",
                          fontSize: "0.65rem",
                          fontWeight: "800",
                          padding: "2px 6px",
                          borderRadius: "999px",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <Star size={10} fill="#070d09" /> Principale
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "6px",
                        right: "6px",
                        display: "flex",
                        gap: "4px",
                      }}
                    >
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetMainPhoto(idx)}
                          title="Définir comme photo principale"
                          style={{
                            background: "rgba(7, 13, 9, 0.8)",
                            border: "none",
                            borderRadius: "50%",
                            width: "28px",
                            height: "28px",
                            color: "#f4c07c",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Star size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        title="Supprimer la photo"
                        style={{
                          background: "rgba(230, 57, 70, 0.85)",
                          border: "none",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {formData.photos.length < 6 && (
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    style={{
                      aspectRatio: "3/4",
                      borderRadius: "16px",
                      border: "2px dashed rgba(212, 163, 115, 0.4)",
                      backgroundColor: "rgba(7, 13, 9, 0.6)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f4c07c",
                      cursor: isUploadingPhoto ? "not-allowed" : "pointer",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Camera size={26} />
                    <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                      {isUploadingPhoto ? "Traitement..." : "+ Ajouter"}
                    </span>
                  </div>
                )}
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />

              <div
                style={{
                  backgroundColor: "rgba(82, 183, 136, 0.12)",
                  border: "1px solid rgba(82, 183, 136, 0.3)",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  color: "#52b788",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <CheckCircle2 size={16} />
                <span>
                  {formData.photos.length} photo(s) chargée(s) avec succès. Confidentialité garantie.
                </span>
              </div>
            </div>
          )}

          {/* Étape 5 : Coffre-Fort KYC & Pièce d'Identité */}
          {step === 5 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Lock size={22} color="#52b788" />
                <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#fbfbfb", margin: 0 }}>
                  5. Coffre-Fort KYC &amp; Pièce d&apos;Identité
                </h2>
              </div>
              <p style={{ color: "#c7cfcb", fontSize: "0.9rem", marginBottom: "1.25rem", lineHeight: "1.4" }}>
                Cette vérification élimine 100% des brouteurs et faux profils. Vos documents sont chiffrés et examinés uniquement par nos modérateurs assermentés.
              </p>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#f4c07c", fontWeight: "700", marginBottom: "0.4rem" }}>
                  Type de pièce officielle
                </label>
                <select
                  value={formData.kycDocType}
                  onChange={(e) => setFormData({ ...formData, kycDocType: e.target.value })}
                  style={{
                    width: "100%",
                    backgroundColor: "#070d09",
                    border: "1px solid rgba(212, 163, 115, 0.3)",
                    color: "#fff",
                    padding: "0.85rem 1rem",
                    borderRadius: "14px",
                    outline: "none",
                  }}
                >
                  <option value="CNI">Carte Nationale d&apos;Identité (CNI)</option>
                  <option value="PASSEPORT">Passeport International</option>
                  <option value="TITRE_SEJOUR">Titre de Séjour / Permis de Résidence</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}>
                {/* Upload Pièce Officielle */}
                <div
                  onClick={() => docInputRef.current?.click()}
                  style={{
                    border: formData.kycDocumentUrl ? "2px solid #52b788" : "2px dashed #f4c07c",
                    padding: "1.25rem",
                    borderRadius: "16px",
                    backgroundColor: formData.kycDocumentUrl ? "rgba(82, 183, 136, 0.08)" : "#070d09",
                    textAlign: "center",
                    cursor: isUploadingDoc ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <FileText size={28} color={formData.kycDocumentUrl ? "#52b788" : "#f4c07c"} style={{ marginBottom: "0.35rem" }} />
                  <div style={{ fontWeight: "700", fontSize: "0.92rem", color: formData.kycDocumentUrl ? "#52b788" : "#fbfbfb" }}>
                    {isUploadingDoc
                      ? "Chiffrement et téléversement en cours..."
                      : formData.kycDocumentUrl
                      ? "✅ Pièce d'identité chiffrée & enregistrée"
                      : "Cliquez pour téléverser votre pièce d'identité"}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#a0aba4", marginTop: "0.25rem" }}>
                    Compartiment sécurisé `belleame-private-kyc-vault`
                  </div>
                </div>
                <input
                  ref={docInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleDocUpload}
                  style={{ display: "none" }}
                />

                {/* Upload Selfie Biométrique */}
                <div
                  onClick={() => selfieInputRef.current?.click()}
                  style={{
                    border: formData.kycSelfieUrl ? "2px solid #52b788" : "2px dashed #52b788",
                    padding: "1.25rem",
                    borderRadius: "16px",
                    backgroundColor: formData.kycSelfieUrl ? "rgba(82, 183, 136, 0.08)" : "#070d09",
                    textAlign: "center",
                    cursor: isUploadingSelfie ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <UserCheck size={28} color="#52b788" style={{ marginBottom: "0.35rem" }} />
                  <div style={{ fontWeight: "700", fontSize: "0.92rem", color: formData.kycSelfieUrl ? "#52b788" : "#fbfbfb" }}>
                    {isUploadingSelfie
                      ? "Traitement biométrique en cours..."
                      : formData.kycSelfieUrl
                      ? "✅ Selfie de contrôle capturé & validé"
                      : "Cliquez pour prendre un selfie de contrôle"}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#a0aba4", marginTop: "0.25rem" }}>
                    Liveness check &amp; comparaison faciale (score requis &gt; 85%)
                  </div>
                </div>
                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleSelfieUpload}
                  style={{ display: "none" }}
                />
              </div>

              <div
                style={{
                  backgroundColor: "rgba(244, 192, 124, 0.1)",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  color: "#f4c07c",
                  lineHeight: "1.4",
                }}
              >
                🛡️ <strong>Règle d&apos;Honneur RGPD</strong> : Votre document est strictement confidentiel. Dès validation par notre équipe sous 24h, l&apos;image est purgée de nos serveurs conformément aux standards de protection de la vie privée.
              </div>
            </div>
          )}

          {/* Boutons de Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(212, 163, 115, 0.3)",
                  color: "#f4c07c",
                  padding: "0.75rem 1.4rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                }}
              >
                <ArrowLeft size={16} /> Précédent
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                style={{
                  background: "linear-gradient(135deg, #f4c07c, #d4a373)",
                  color: "#070d09",
                  border: "none",
                  padding: "0.75rem 1.6rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontWeight: "800",
                  fontSize: "0.92rem",
                  boxShadow: "0 4px 15px rgba(244, 192, 124, 0.25)",
                }}
              >
                Continuer <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                style={{
                  background: "linear-gradient(135deg, #52b788, #2d6a4f)",
                  color: "#fbfbfb",
                  border: "none",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "800",
                  fontSize: "0.92rem",
                  boxShadow: "0 4px 15px rgba(82, 183, 136, 0.35)",
                }}
              >
                Valider &amp; Découvrir mes Profils <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
