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
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"AUTH" | "DISCOVER" | "CHAT" | "PROFILE">("AUTH");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (phoneNumber) {
      setIsLoggedIn(true);
      setCurrentTab("DISCOVER");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>Â</Text>
        </View>
        <View>
          <Text style={styles.title}>À Chacun Une Belle Âme</Text>
          <Text style={styles.subtitle}>Rencontres Sérieuses 100% Vérifiées</Text>
        </View>
      </View>

      {/* Main Content Area based on Tab */}
      <ScrollView contentContainerStyle={styles.content}>

        {/* Auth Screen */}
        {currentTab === "AUTH" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connexion E.164 & Verification</Text>
            <Text style={styles.cardDescription}>
              Entrez votre numéro de téléphone (Cameroun, Bénin, Côte d'Ivoire ou Diaspora) pour recevoir votre code OTP.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+237 / +229 / +225 / +33</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 699 00 00 00"
                placeholderTextColor="#8a968f"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <TouchableOpacity style={styles.buttonPrimary} activeOpacity={0.8} onPress={handleLogin}>
              <Text style={styles.buttonText}>Accéder à la plateforme</Text>
            </TouchableOpacity>

            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>🛡️ 100% Majeurs & Coffre-fort KYC</Text>
            </View>
          </View>
        )}

        {/* Discover Screen */}
        {currentTab === "DISCOVER" && (
          <View style={styles.card}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Sparkles Score Compatibilité : 94%</Text>
            </View>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80" }}
              style={styles.profileImage}
            />
            <Text style={styles.cardTitle}>Grace, 26 ans</Text>
            <Text style={styles.cardSubtitle}>Douala, Cameroun 🇨🇲 • Architecte</Text>
            <Text style={styles.cardDescription}>
              "Passionnée par le design, la spiritualité et la cuisine traditionnelle. Cherche un compagnon sincère orienté mariage."
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.buttonPass}>
                <Text style={styles.passText}>✕ Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonLike}>
                <Text style={styles.likeText}>♥ Like (Quota 9/10)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Chat Screen */}
        {currentTab === "CHAT" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Correspondances Mutuelles (2)</Text>
            <View style={styles.chatItem}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80" }}
                style={styles.thumbImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.chatName}>Grace (Score 94%) 🛡️</Text>
                <Text style={styles.chatLastMsg}>Bonjour ! J'ai apprécié vos valeurs...</Text>
              </View>
            </View>

            <View style={styles.antiBroutageBox}>
              <Text style={styles.antiBroutageText}>
                ⚠️ Protection anti-broutage active : Ne transférez aucun code MoMo ou argent.
              </Text>
            </View>
          </View>
        )}

        {/* Profile Screen */}
        {currentTab === "PROFILE" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mon Profil Sincère</Text>
            <Text style={styles.cardSubtitle}>Complété à 85% • Mode Incognito Privilège</Text>
            
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Abonnement : Pass Privilège FCFA (Actif)</Text>
            </View>

            <TouchableOpacity style={[styles.buttonPrimary, { marginTop: 15, backgroundColor: "#e63946" }]} onPress={() => setCurrentTab("AUTH")}>
              <Text style={styles.buttonText}>Se Déconnecter</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab("DISCOVER")}>
          <Text style={[styles.navText, currentTab === "DISCOVER" && styles.navTextActive]}>Découverte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab("CHAT")}>
          <Text style={[styles.navText, currentTab === "CHAT" && styles.navTextActive]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab("PROFILE")}>
          <Text style={[styles.navText, currentTab === "PROFILE" && styles.navTextActive]}>Profil</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b130e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 163, 115, 0.2)",
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d4a373",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0b130e",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 11,
    color: "#d4a373",
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#14231a",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 163, 115, 0.25)",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#d4a373",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 13,
    color: "#c2c9c4",
    lineHeight: 18,
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: "#081c15",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(212, 163, 115, 0.3)",
    marginBottom: 16,
  },
  prefix: {
    fontSize: 11,
    color: "#d4a373",
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600",
  },
  buttonPrimary: {
    backgroundColor: "#d4a373",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#0b130e",
    fontSize: 14,
    fontWeight: "700",
  },
  badgeContainer: {
    backgroundColor: "rgba(82, 183, 136, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(82, 183, 136, 0.3)",
  },
  badgeText: {
    color: "#52b788",
    fontSize: 12,
    fontWeight: "600",
  },
  profileImage: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  buttonPass: {
    flex: 1,
    backgroundColor: "#081c15",
    borderWidth: 1,
    borderColor: "#e63946",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  passText: {
    color: "#e63946",
    fontWeight: "700",
  },
  buttonLike: {
    flex: 1,
    backgroundColor: "#d4a373",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  likeText: {
    color: "#0b130e",
    fontWeight: "800",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#081c15",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  thumbImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  chatName: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  chatLastMsg: {
    color: "#a0aba4",
    fontSize: 12,
  },
  antiBroutageBox: {
    backgroundColor: "rgba(230, 57, 70, 0.15)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.3)",
    marginTop: 10,
  },
  antiBroutageText: {
    color: "#ffb703",
    fontSize: 11,
    fontWeight: "600",
  },
  navbar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 163, 115, 0.2)",
    backgroundColor: "#14231a",
    paddingVertical: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    color: "#a0aba4",
    fontSize: 13,
    fontWeight: "600",
  },
  navTextActive: {
    color: "#d4a373",
    fontWeight: "800",
  },
});
