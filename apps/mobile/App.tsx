import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"AUTH" | "DISCOVER" | "MATCHES" | "CHAT" | "SUBSCRIPTION" | "PROFILE">("AUTH");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // État Découverte & Quota
  const [quotaRemaining, setQuotaRemaining] = useState(8);
  const [activeProfileIdx, setActiveProfileIdx] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"FREE" | "PREMIUM" | "ALLIANCE">("PREMIUM");

  // Profils pour la découverte
  const candidates = [
    {
      id: "cand-1",
      name: "Grace",
      age: 26,
      city: "Douala, Cameroun 🇨🇲",
      profession: "Architecte d'Intérieur",
      bio: "Passionnée par le design, la spiritualité chrétienne et la cuisine traditionnelle. Cherche un compagnon sincère orienté mariage.",
      score: 96,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      values: ["Foi Chrétienne", "Projet Famille", "Respect"],
    },
    {
      id: "cand-2",
      name: "Marie-Joséphine",
      age: 28,
      city: "Abidjan, Côte d'Ivoire 🇨🇮",
      profession: "Chef de Projet Marketing",
      bio: "Rieuse, bienveillante et sincère dans mes démarches. J'aime les voyages en Afrique et la lecture.",
      score: 92,
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
      values: ["Foi", "Mariage", "Respect des aînés"],
    },
    {
      id: "cand-3",
      name: "Bertrand",
      age: 31,
      city: "Cotonou, Bénin 🇧🇯",
      profession: "Ingénieur Logiciel",
      bio: "Esprit calme, sportif et passionné d'entrepreneuriat. Je souhaite bâtir une famille basée sur la loyauté.",
      score: 89,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      values: ["Projet Famille", "Foi", "Sport"],
    },
  ];

  const currentCandidate = candidates[activeProfileIdx % candidates.length];

  // Chat message state
  const [chatMessages, setChatMessages] = useState([
    { id: "1", sender: "OTHER", text: "Bonjour ! J'ai beaucoup apprécié vos valeurs sur la famille." },
    { id: "2", sender: "ME", text: "Bonjour Grace, c'est un plaisir partagé. La sincérité est primordiale pour moi." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [antiFraudWarning, setAntiFraudWarning] = useState(false);

  const handleSendOtp = () => {
    if (phoneNumber.length >= 8) {
      setIsOtpSent(true);
    } else {
      Alert.alert("Numéro invalide", "Veuillez entrer un numéro valide au format E.164.");
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode.length === 6 || otpCode === "123456") {
      setIsLoggedIn(true);
      setCurrentTab("DISCOVER");
    } else {
      Alert.alert("Code incorrect", "Le code OTP doit comporter 6 chiffres (Ex: 123456 en démo).");
    }
  };

  const handleLike = () => {
    if (quotaRemaining > 0) {
      setQuotaRemaining(quotaRemaining - 1);
      if (currentCandidate.score >= 92) {
        setShowMatchModal(true);
      }
      setActiveProfileIdx(activeProfileIdx + 1);
    } else {
      Alert.alert("Quota Épuisé", "Passez au Pass Privilège pour obtenir 50 suggestions quotidiennes.");
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Détection heuristique anti-broutage
    const fraudWords = ["argent", "momo", "western union", "urgent", "dépanner"];
    if (fraudWords.some((w) => chatInput.toLowerCase().includes(w))) {
      setAntiFraudWarning(true);
    }

    setChatMessages([...chatMessages, { id: Date.now().toString(), sender: "ME", text: chatInput }]);
    setChatInput("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>Â</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>À Chacun Une Belle Âme</Text>
          <Text style={styles.subtitle}>Rencontres Sérieuses • 100% Vérifiées 18+</Text>
        </View>
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.quotaBadge}
            onPress={() => setCurrentTab("SUBSCRIPTION")}
          >
            <Text style={styles.quotaBadgeText}>Quota: {quotaRemaining}/10</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content Area based on Tab */}
      <ScrollView contentContainerStyle={styles.content}>

        {/* AUTH TAB */}
        {currentTab === "AUTH" && (
          <View style={styles.card}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>🛡️ Accès Strictement Réservé aux Majeurs (18+)</Text>
            </View>

            <Text style={styles.cardTitle}>
              {isOtpSent ? "Validation du Code Secret OTP" : "Connexion E.164 & Vérification"}
            </Text>
            <Text style={styles.cardDescription}>
              {isOtpSent
                ? `Un code à 6 chiffres a été envoyé au ${phoneNumber}. (Code démo : 123456)`
                : "Entrez votre numéro mobile (54 pays d'Afrique : Sénégal, Côte d'Ivoire, Cameroun, RDC, Bénin, Mali, Gabon ou Diaspora)."}
            </Text>

            {!isOtpSent ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.prefix}>🌍 Tous les indicatifs africains (+221, +225, +237, +243, +229, +33...)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: +221 77 123 45 67"
                    placeholderTextColor="#8a968f"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
                <TouchableOpacity style={styles.buttonPrimary} activeOpacity={0.8} onPress={handleSendOtp}>
                  <Text style={styles.buttonText}>Recevoir le Code par SMS</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { letterSpacing: 8, textAlign: "center", fontSize: 20 }]}
                    placeholder="123456"
                    placeholderTextColor="#8a968f"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otpCode}
                    onChangeText={setOtpCode}
                  />
                </View>
                <TouchableOpacity style={styles.buttonPrimary} activeOpacity={0.8} onPress={handleVerifyOtp}>
                  <Text style={styles.buttonText}>Confirmer & Accéder à l&apos;Espace</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsOtpSent(false)} style={{ alignItems: "center", marginTop: 8 }}>
                  <Text style={{ color: "#d4a373", fontSize: 12 }}>← Modifier le numéro de téléphone</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* DISCOVER TAB */}
        {currentTab === "DISCOVER" && (
          <View style={styles.card}>
            <View style={styles.scoreRow}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>✨ Affinité de Valeurs : {currentCandidate.score}%</Text>
              </View>
              <Text style={{ color: "#52b788", fontWeight: "700", fontSize: 12 }}>🛡️ KYC Validé</Text>
            </View>

            <Image source={{ uri: currentCandidate.photoUrl }} style={styles.profileImage} />

            <Text style={styles.cardTitle}>{currentCandidate.name}, {currentCandidate.age} ans</Text>
            <Text style={styles.cardSubtitle}>{currentCandidate.city} • {currentCandidate.profession}</Text>
            <Text style={styles.cardDescription}>&ldquo;{currentCandidate.bio}&rdquo;</Text>

            <View style={styles.tagsContainer}>
              {currentCandidate.values.map((v, i) => (
                <View key={i} style={styles.tagPill}>
                  <Text style={styles.tagText}>{v}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.buttonPass}
                onPress={() => setActiveProfileIdx(activeProfileIdx + 1)}
              >
                <Text style={styles.passText}>✕ Passer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonLike} onPress={handleLike}>
                <Text style={styles.likeText}>♥ Coup de Cœur ({quotaRemaining})</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* MATCHES TAB */}
        {currentTab === "MATCHES" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Correspondances Mutuelles (3)</Text>
            <Text style={styles.cardSubtitle}>Les deux belles âmes ont exprimé un accord mutuel.</Text>

            {candidates.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.matchRow}
                onPress={() => setCurrentTab("CHAT")}
              >
                <Image source={{ uri: c.photoUrl }} style={styles.thumbImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.chatName}>{c.name}, {c.age} ans 🛡️</Text>
                  <Text style={styles.chatLastMsg}>{c.city} • Affinité {c.score}%</Text>
                </View>
                <Text style={{ color: "#f4c07c", fontWeight: "700", fontSize: 12 }}>Discuter →</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CHAT TAB */}
        {currentTab === "CHAT" && (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80" }}
                style={styles.thumbImage}
              />
              <View>
                <Text style={styles.cardTitle}>Grace (Affinité 96%) 🛡️</Text>
                <Text style={{ color: "#52b788", fontSize: 11, fontWeight: "600" }}>● En ligne • Accord Mutuel Actif</Text>
              </View>
            </View>

            {antiFraudWarning && (
              <View style={styles.antiBroutageBox}>
                <Text style={styles.antiBroutageText}>
                  ⚠️ Alerte Anti-Broutage : Ne transférez jamais de code Mobile Money ni d&apos;argent liquide en ligne.
                </Text>
              </View>
            )}

            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              {chatMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    msg.sender === "ME" ? styles.chatBubbleMe : styles.chatBubbleOther,
                  ]}
                >
                  <Text style={msg.sender === "ME" ? styles.bubbleTextMe : styles.bubbleTextOther}>
                    {msg.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
              <TextInput
                style={[styles.inputContainer, { flex: 1, marginBottom: 0, paddingVertical: 8 }]}
                placeholder="Votre message respectueux..."
                placeholderTextColor="#8a968f"
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity
                style={[styles.buttonPrimary, { width: 44, height: 44, borderRadius: 22, marginBottom: 0, justifyContent: "center" }]}
                onPress={handleSendMessage}
              >
                <Text style={{ fontSize: 18 }}>➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* SUBSCRIPTION TAB */}
        {currentTab === "SUBSCRIPTION" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Formules d&apos;Abonnement en FCFA</Text>
            <Text style={styles.cardSubtitle}>Paiement sécurisé via MTN MoMo, Orange Money, Wave et CinetPay.</Text>

            <TouchableOpacity
              style={[styles.pricingCard, selectedPlan === "PREMIUM" && styles.pricingCardActive]}
              onPress={() => setSelectedPlan("PREMIUM")}
            >
              <Text style={{ color: "#f4c07c", fontWeight: "800", fontSize: 16 }}>Formule Sérénité</Text>
              <Text style={{ color: "#ffffff", fontWeight: "900", fontSize: 22 }}>7 500 FCFA <Text style={{ fontSize: 13, color: "#a0aba4" }}>/ mois</Text></Text>
              <Text style={{ color: "#c2c9c4", fontSize: 12, marginTop: 4 }}>• 50 Découvertes Quotidiennes • Mode Incognito • Admirateurs Débloqués</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pricingCard, selectedPlan === "ALLIANCE" && styles.pricingCardActive]}
              onPress={() => setSelectedPlan("ALLIANCE")}
            >
              <Text style={{ color: "#d4a373", fontWeight: "800", fontSize: 16 }}>Cercle Alliance (3 Mois)</Text>
              <Text style={{ color: "#ffffff", fontWeight: "900", fontSize: 22 }}>24 000 FCFA</Text>
              <Text style={{ color: "#c2c9c4", fontSize: 12, marginTop: 4 }}>• Badge Âme Pure • Mise en Avant Prioritaire • Conseiller Matrimonial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonPrimary, { marginTop: 15 }]}
              onPress={() => Alert.alert("Paiement Mobile Money", "Redirection vers le portail de validation USSD CinetPay...")}
            >
              <Text style={styles.buttonText}>Souscrire avec Mobile Money</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PROFILE TAB */}
        {currentTab === "PROFILE" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mon Profil Vérifié</Text>
            <Text style={styles.cardSubtitle}>Complété à 85% • Aminata Ndiaye (27 ans)</Text>

            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>🛡️ Statut d&apos;Honneur : Certifié KYC 18+</Text>
            </View>

            <View style={{ backgroundColor: "#081c15", padding: 14, borderRadius: 14, marginVertical: 12 }}>
              <Text style={{ color: "#fbfbfb", fontWeight: "700", fontSize: 13 }}>Protection RGPD & Délai de Grâce</Text>
              <Text style={{ color: "#8a968f", fontSize: 11, marginTop: 4 }}>
                Vos données biométriques sont chiffrées en transit et au repos. Sas de rétractation de 14 jours appliqué en cas de suppression.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.buttonPrimary, { backgroundColor: "#e63946", marginTop: 10 }]}
              onPress={() => {
                setIsLoggedIn(false);
                setCurrentTab("AUTH");
              }}
            >
              <Text style={styles.buttonText}>Se Déconnecter</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Match Celebration Modal */}
      <Modal visible={showMatchModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={{ fontSize: 40, textAlign: "center" }}>💖</Text>
            <Text style={styles.modalTitle}>C&apos;est une Belle Affinité !</Text>
            <Text style={styles.modalBody}>
              Vous et {currentCandidate?.name} partagez une compatibilité de valeurs exceptionnelle ({currentCandidate?.score}%).
            </Text>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() => {
                setShowMatchModal(false);
                setCurrentTab("CHAT");
              }}
            >
              <Text style={styles.buttonText}>Démarrer la Discussion Respectueuse</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowMatchModal(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: "#a0aba4", textAlign: "center", fontSize: 13 }}>Continuer à Explorer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      {isLoggedIn && (
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab("DISCOVER")}>
            <Text style={[styles.navText, currentTab === "DISCOVER" && styles.navTextActive]}>Découvrir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab("MATCHES")}>
            <Text style={[styles.navText, currentTab === "MATCHES" && styles.navTextActive]}>Affinités</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab("CHAT")}>
            <Text style={[styles.navText, currentTab === "CHAT" && styles.navTextActive]}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab("SUBSCRIPTION")}>
            <Text style={[styles.navText, currentTab === "SUBSCRIPTION" && styles.navTextActive]}>Offres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab("PROFILE")}>
            <Text style={[styles.navText, currentTab === "PROFILE" && styles.navTextActive]}>Profil</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070d09",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 163, 115, 0.2)",
    gap: 12,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f4c07c",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#070d09",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 10,
    color: "#f4c07c",
    fontWeight: "600",
  },
  quotaBadge: {
    backgroundColor: "rgba(244, 192, 124, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(244, 192, 124, 0.3)",
  },
  quotaBadgeText: {
    color: "#f4c07c",
    fontSize: 11,
    fontWeight: "800",
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#102017",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 163, 115, 0.22)",
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#f4c07c",
    marginBottom: 8,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 13,
    color: "#c7cfcb",
    lineHeight: 18,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  tagPill: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(212, 163, 115, 0.2)",
  },
  tagText: {
    color: "#f4c07c",
    fontSize: 11,
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: "#070d09",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(212, 163, 115, 0.3)",
    marginBottom: 14,
  },
  prefix: {
    fontSize: 10,
    color: "#f4c07c",
    fontWeight: "700",
    marginBottom: 4,
  },
  input: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  buttonPrimary: {
    backgroundColor: "#f4c07c",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: {
    color: "#070d09",
    fontSize: 14,
    fontWeight: "800",
  },
  badgeContainer: {
    backgroundColor: "rgba(82, 183, 136, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(82, 183, 136, 0.3)",
  },
  badgeText: {
    color: "#52b788",
    fontSize: 11,
    fontWeight: "700",
  },
  profileImage: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  buttonPass: {
    flex: 1,
    backgroundColor: "#070d09",
    borderWidth: 1,
    borderColor: "#e63946",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  passText: {
    color: "#e63946",
    fontWeight: "700",
    fontSize: 13,
  },
  buttonLike: {
    flex: 1.3,
    backgroundColor: "#f4c07c",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  likeText: {
    color: "#070d09",
    fontWeight: "800",
    fontSize: 13,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#070d09",
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(212, 163, 115, 0.15)",
  },
  thumbImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  chatName: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13,
  },
  chatLastMsg: {
    color: "#8a968f",
    fontSize: 11,
    marginTop: 2,
  },
  antiBroutageBox: {
    backgroundColor: "rgba(230, 57, 70, 0.15)",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.3)",
    marginBottom: 8,
  },
  antiBroutageText: {
    color: "#f4a261",
    fontSize: 10,
    fontWeight: "600",
  },
  chatBubble: {
    padding: 10,
    borderRadius: 14,
    marginBottom: 6,
    maxWidth: "80%",
  },
  chatBubbleMe: {
    backgroundColor: "#f4c07c",
    alignSelf: "flex-end",
  },
  chatBubbleOther: {
    backgroundColor: "#070d09",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(212, 163, 115, 0.2)",
  },
  bubbleTextMe: {
    color: "#070d09",
    fontSize: 12,
    fontWeight: "600",
  },
  bubbleTextOther: {
    color: "#ffffff",
    fontSize: 12,
  },
  pricingCard: {
    backgroundColor: "#070d09",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 163, 115, 0.2)",
    marginBottom: 10,
  },
  pricingCardActive: {
    borderColor: "#f4c07c",
    backgroundColor: "rgba(244, 192, 124, 0.08)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#102017",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#f4c07c",
    width: "100%",
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fbfbfb",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  modalBody: {
    color: "#c7cfcb",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  navbar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 163, 115, 0.2)",
    backgroundColor: "#102017",
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    color: "#8a968f",
    fontSize: 11,
    fontWeight: "600",
  },
  navTextActive: {
    color: "#f4c07c",
    fontWeight: "800",
  },
});
