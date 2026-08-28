import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Conditions Générales d'Utilisation — À Chacun Une Belle Âme",
  description: "CGU, politique de confidentialité et mentions légales de la plateforme À Chacun Une Belle Âme."
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Objet de la Plateforme",
      content: `« À Chacun Une Belle Âme » est une plateforme communautaire de rencontres sérieuses réservée aux personnes majeures (18 ans et plus). Elle est destinée aux résidents du Cameroun, du Bénin, de la Côte d'Ivoire et à la diaspora africaine francophone. Son objectif est de faciliter des rencontres orientées vers des relations durables et le mariage, dans un cadre sécurisé et respectueux des valeurs culturelles et spirituelles.`
    },
    {
      title: "2. Conditions d'Inscription",
      content: `Pour s'inscrire, l'utilisateur doit :\n• Être âgé(e) d'au moins 18 ans révolus\n• Fournir un numéro de téléphone valide au format E.164\n• Compléter une vérification d'identité (KYC) comprenant une pièce d'identité officielle et un selfie en temps réel\n• Accepter les présentes CGU\n\nToute inscription frauduleuse entraîne la suspension immédiate et définitive du compte.`
    },
    {
      title: "3. Vérification d'Identité (KYC)",
      content: `La vérification Know Your Customer est obligatoire pour chaque membre. Les documents soumis (pièce d'identité, selfie) sont :\n• Chiffrés en transit (TLS 1.3) et au repos (AES-256-GCM)\n• Examinés par notre équipe de modération dans un SLA de 24 heures\n• Comparés par un algorithme de similarité faciale (score minimum requis : 85%)\n• Jamais partagés avec d'autres membres ou des tiers non autorisés\n\nLes documents sont conservés pendant la durée de l'inscription et supprimés dans les 30 jours suivant la clôture du compte.`
    },
    {
      title: "4. Comportement et Modération",
      content: `Les membres s'engagent à :\n• Respecter les autres membres avec dignité et bienveillance\n• Ne pas solliciter d'argent ou de transferts financiers (anti-broutage)\n• Ne pas publier de contenu inapproprié, discriminatoire ou illégal\n• Signaler tout comportement suspect via le bouton « Signaler »\n\nNotre système de modération prévoit 9 niveaux de sanctions graduées :\n1. Avertissement simple\n2. Mise en sourdine 24h\n3. Restriction de messagerie 72h\n4. Masquage temporaire du profil\n5. Suspension 7 jours\n6. Suspension 30 jours\n7. Restriction permanente de messagerie\n8. Bannissement définitif\n9. Signalement aux autorités compétentes`
    },
    {
      title: "5. Protection des Données (RGPD)",
      content: `Conformément au Règlement Général sur la Protection des Données (RGPD) et aux réglementations locales :\n\n• Finalité : Vos données sont collectées uniquement pour le fonctionnement de la plateforme de mise en relation\n• Droits : Vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données\n• Export : Vous pouvez exporter l'intégralité de vos données au format JSON depuis Paramètres > Confidentialité\n• Suppression : La suppression de compte inclut un délai de grâce de 14 jours pendant lequel vous pouvez annuler la demande\n• Responsable du traitement : À Chacun Une Belle Âme SARL, Douala, Cameroun\n• Contact DPO : dpo@belleame.africa`
    },
    {
      title: "6. Abonnement et Paiements",
      content: `L'accès de base est gratuit avec 10 découvertes quotidiennes. L'abonnement Premium « Pass Privilège » propose :\n• Tarif : 5 000 FCFA / mois\n• 50 découvertes quotidiennes\n• Mode Incognito Privilège\n• Accès prioritaire aux nouveaux profils\n\nPaiements acceptés : MTN Mobile Money, Orange Money, Wave FCFA via CinetPay. Le checkout est idempotent pour éviter les doubles débits. Annulation possible à tout moment, sans engagement longue durée.`
    },
    {
      title: "7. Propriété Intellectuelle",
      content: `Le nom « À Chacun Une Belle Âme », le logo, le design et l'ensemble du contenu de la plateforme sont protégés par le droit d'auteur et la propriété intellectuelle. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.`
    },
    {
      title: "8. Limitation de Responsabilité",
      content: `« À Chacun Une Belle Âme » s'efforce de fournir un service fiable et sécurisé mais ne peut garantir :\n• La véracité absolue des informations déclarées par les membres au-delà de la vérification KYC\n• La réussite des mises en relation\n• La disponibilité ininterrompue du service\n\nEn cas de litige, la juridiction compétente est le tribunal de commerce de Douala, Cameroun.`
    },
    {
      title: "9. Modification des CGU",
      content: `Nous nous réservons le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés par notification dans l'application et disposeront de 30 jours pour accepter les nouvelles conditions ou clôturer leur compte.\n\nDernière mise à jour : Août 2026`
    }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #d4a373, #e07a5f)", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.1rem" }}>Â</div>
          </Link>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>Mentions Légales & CGU</div>
            <div style={{ fontSize: "0.7rem", color: "#52b788" }}>Conditions Générales d&apos;Utilisation</div>
          </div>
        </div>
        <Link href="/" style={{ background: "rgba(212, 163, 115, 0.1)", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#d4a373", padding: "8px 16px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: "600" }}>
          Retour Accueil
        </Link>
      </header>

      <div style={{ maxWidth: "750px", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Intro */}
        <div style={{ marginBottom: "2rem", padding: "1.5rem", borderRadius: "18px", background: "linear-gradient(135deg, rgba(45, 106, 79, 0.25), rgba(26, 46, 34, 0.5))", border: "1px solid rgba(82, 183, 136, 0.15)" }}>
          <p style={{ fontSize: "0.9rem", color: "#c2c9c4", lineHeight: "1.6" }}>
            Bienvenue sur « À Chacun Une Belle Âme ». En utilisant notre plateforme, vous acceptez les présentes Conditions Générales d&apos;Utilisation. Veuillez les lire attentivement avant de vous inscrire.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {sections.map((section, idx) => (
            <section key={idx} style={{ padding: "1.5rem", borderRadius: "14px", background: "rgba(26, 46, 34, 0.4)", border: "1px solid rgba(212, 163, 115, 0.08)" }}>
              <h2 style={{ fontWeight: "800", fontSize: "1.05rem", color: "#d4a373", marginBottom: "0.75rem" }}>{section.title}</h2>
              <div style={{ fontSize: "0.85rem", color: "#c2c9c4", lineHeight: "1.7", whiteSpace: "pre-line" }}>
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "3rem", textAlign: "center", padding: "1.5rem", color: "#8a968f", fontSize: "0.8rem" }}>
          <p>© 2026 À Chacun Une Belle Âme SARL — Tous droits réservés</p>
          <p style={{ marginTop: "0.5rem" }}>Siège social : Douala, Cameroun | Contact : legal@belleame.africa</p>
        </div>
      </div>
    </div>
  );
}
