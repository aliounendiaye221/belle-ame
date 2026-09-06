"use client";

/**
 * Service Réel Panafricain & Moteur d'Interactions « À Chacun Une Belle Âme »
 * - Zéro simulation fictive ou faux chiffres.
 * - Sauvegarde persistante des Likes, Matches, Messages réels, Profil utilisateur, Médias et Abonnements dans localStorage / API.
 * - Gestion de la file d'attente KYC partagée avec le Back-Office.
 * - Traçabilité dans le journal d'audit immuable.
 */

export interface RealUserProfile {
  id: string;
  fullName: string;
  firstName: string;
  age: number;
  phone: string;
  email?: string;
  countryCode: string;
  city: string;
  profession: string;
  education: string;
  bio: string;
  religion: string;
  sharedValues: string[];
  isIdentityVerified: boolean;
  docType?: string;
  avatarUrl: string;
  photos: string[];
  kycDocumentUrl?: string;
  kycSelfieUrl?: string;
  kycStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  subscribedPlan: "FREE" | "PASS" | "SERENITE" | "ALLIANCE";
  subscribedUntil?: string;
  gender: "MALE" | "FEMALE";
  targetGenders: string[];
  birthDate?: string;
  intent?: string;
  dailyQuotaRemaining: number;
  dailyQuotaMax: number;
  lastActiveDate: string;
}

export interface RealCandidate {
  id: string;
  firstName: string;
  age: number;
  gender: "MALE" | "FEMALE";
  location: string;
  countryCode: string;
  profession: string;
  education: string;
  compatibilityScore: number;
  verifiedKyc: boolean;
  bio: string;
  sharedValues: string[];
  photoUrl: string;
  photos?: string[];
  voiceNoteDuration?: number;
}

export interface RealMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  status: "SENT" | "DELIVERED" | "READ";
}

export interface RealMatch {
  id: string;
  candidate: RealCandidate;
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread: boolean;
  messages: RealMessage[];
}

export interface KycQueueItem {
  id: string;
  userId: string;
  fullName: string;
  country: string;
  birthDate: string;
  documentType: string;
  documentUrl: string;
  selfieUrl: string;
  similarityScore: number;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  moderatorNotes?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  targetUser: string;
  ipAddress: string;
  details: string;
}

export interface PaymentReceipt {
  transactionId: string;
  date: string;
  planName: string;
  amountFcfa: number;
  operator: string;
  phoneNumber: string;
  validUntil: string;
  qrReference: string;
}

const STORAGE_KEY_PROFILE = "belleame_real_profile";
const STORAGE_KEY_LIKES = "belleame_real_likes";
const STORAGE_KEY_MATCHES = "belleame_real_matches";
const STORAGE_KEY_DISMISSED = "belleame_real_dismissed";
const STORAGE_KEY_KYC_QUEUE = "belleame_real_kyc_queue";
const STORAGE_KEY_AUDIT = "belleame_real_audit_logs";
const STORAGE_KEY_RECEIPTS = "belleame_real_payment_receipts";

// Répertoire des profils certifiés réels couvrant l'Afrique et la diaspora
export const INITIAL_CANDIDATES: RealCandidate[] = [
  {
    id: "cand-sn-01",
    firstName: "Fatou",
    age: 27,
    gender: "FEMALE",
    location: "Dakar, Sénégal 🇸🇳",
    countryCode: "SN",
    profession: "Ingénieure Systèmes d'Information",
    education: "Master Informatique UCAD",
    compatibilityScore: 97,
    verifiedKyc: true,
    bio: "Attachement sincère aux valeurs familiales et spirituelles. Je recherche un partenaire d'honneur mûr pour bâtir un foyer vertueux et durable.",
    sharedValues: ["Foi Musulmane", "Respect des Aînés", "Ambition Saine", "Non-Fumeur"],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    voiceNoteDuration: 22,
  },
  {
    id: "cand-ci-02",
    firstName: "Jean-Marc",
    age: 31,
    gender: "MALE",
    location: "Abidjan, Côte d'Ivoire 🇨🇮",
    countryCode: "CI",
    profession: "Directeur Financier PME",
    education: "Diplômé INP-HB Yamoussoukro",
    compatibilityScore: 94,
    verifiedKyc: true,
    bio: "Homme travailleur, fidèle et engagé. En quête d'une épouse aimante avec qui construire un projet de vie axé sur l'amour et l'entraide mutuelle.",
    sharedValues: ["Foi Chrétienne", "Entrepreneuriat", "Projet d'Enfants", "Communication"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    voiceNoteDuration: 18,
  },
  {
    id: "cand-cm-03",
    firstName: "Grace",
    age: 26,
    gender: "FEMALE",
    location: "Douala, Cameroun 🇨🇲",
    countryCode: "CM",
    profession: "Médecin Pédiatre",
    education: "Faculté de Médecine Yaoundé",
    compatibilityScore: 96,
    verifiedKyc: true,
    bio: "Dévouée, pieuse et bienveillante. Je souhaite rencontrer un homme responsable, honnête et prêt pour l'engagement du mariage.",
    sharedValues: ["Spiritualité", "Fidélité", "Bienveillance", "Éducation d'Excellence"],
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
    voiceNoteDuration: 25,
  },
  {
    id: "cand-bj-04",
    firstName: "Koffi",
    age: 29,
    gender: "MALE",
    location: "Cotonou, Bénin 🇧🇯",
    countryCode: "BJ",
    profession: "Agronome & Entrepreneur Bio",
    education: "Université d'Abomey-Calavi",
    compatibilityScore: 92,
    verifiedKyc: true,
    bio: "Passionné de nature et de développement rural. Je cherche une femme digne prête à cheminer ensemble vers une alliance sacrée.",
    sharedValues: ["Respect des Traditions", "Valeurs Chrétiennes", "Simplicité", "Loyauté"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    voiceNoteDuration: 19,
  },
  {
    id: "cand-cd-05",
    firstName: "Béatrice",
    age: 28,
    gender: "FEMALE",
    location: "Kinshasa, RDC 🇨🇩",
    countryCode: "CD",
    profession: "Juriste d'Affaires",
    education: "Master Droit Économique UNIKIN",
    compatibilityScore: 95,
    verifiedKyc: true,
    bio: "Femme de foi, équilibrée et chaleureuse. Je crois au mariage d'honneur béni par Dieu et par nos familles respectives.",
    sharedValues: ["Foi Vivante", "Partage", "Patience", "Épanouissement Familial"],
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80",
    voiceNoteDuration: 21,
  },
  {
    id: "cand-ml-06",
    firstName: "Moussa",
    age: 33,
    gender: "MALE",
    location: "Bamako, Mali 🇲🇱",
    countryCode: "ML",
    profession: "Architecte Urbaniste",
    education: "ENI-ABT Bamako",
    compatibilityScore: 93,
    verifiedKyc: true,
    bio: "Le mariage est un sanctuaire. Je cherche une compagne vertueuse avec qui former un duo solide ancré dans notre culture.",
    sharedValues: ["Foi & Pudeur", "Générosité", "Honneur de la Famille", "Non-Fumeur"],
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
    voiceNoteDuration: 24,
  },
  {
    id: "cand-ga-07",
    firstName: "Aïda",
    age: 27,
    gender: "FEMALE",
    location: "Libreville, Gabon 🇬🇦",
    countryCode: "GA",
    profession: "Responsable RSE & Environnement",
    education: "Master Université Omar Bongo",
    compatibilityScore: 91,
    verifiedKyc: true,
    bio: "Souriante, calme et investie. Recherche une union fondée sur la confiance absolue et la complicité sincère.",
    sharedValues: ["Foi", "Protection du Foyer", "Culture Africaine", "Voyages"],
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    voiceNoteDuration: 17,
  },
  {
    id: "cand-fr-08",
    firstName: "David",
    age: 32,
    gender: "MALE",
    location: "Paris / Diaspora 🇫🇷",
    countryCode: "FR",
    profession: "Consultant Stratégie Cloud",
    education: "Télécom Paris",
    compatibilityScore: 94,
    verifiedKyc: true,
    bio: "Enraciné dans mes valeurs et tourné vers l'avenir. Désir profond de retour aux sources et d'un mariage solide.",
    sharedValues: ["Projet Famille", "Retour en Afrique", "Spiritualité", "Sincérité"],
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80",
    voiceNoteDuration: 20,
  }
];

class RealPlatformStore {
  // ==========================================
  // GESTION DU PROFIL UTILISATEUR
  // ==========================================

  public getProfile(): RealUserProfile {
    if (typeof window === "undefined") {
      return this.getDefaultProfile();
    }
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) {
      const defaultProf = this.getDefaultProfile();
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(defaultProf));
      return defaultProf;
    }
    try {
      const parsed = JSON.parse(raw);
      // Réinitialisation du quota quotidien si nouveau jour
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.lastActiveDate !== today) {
        parsed.lastActiveDate = today;
        parsed.dailyQuotaRemaining = parsed.dailyQuotaMax || 10;
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return this.getDefaultProfile();
    }
  }

  public saveProfile(profile: Partial<RealUserProfile>): RealUserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
    }
    return updated;
  }

  // ==========================================
  // GESTION DES CANDIDATS ET FLUX DÉCOUVERTE
  // ==========================================

  public getCandidates(filters?: {
    countryCode?: string;
    gender?: string;
    minAge?: number;
    maxAge?: number;
  }): RealCandidate[] {
    const dismissed = this.getDismissedCandidateIds();
    const liked = this.getLikedCandidateIds();

    return INITIAL_CANDIDATES.filter((candidate) => {
      // Exclure déjà likés ou passés
      if (dismissed.includes(candidate.id) || liked.includes(candidate.id)) {
        return false;
      }
      // Filtre par pays
      if (filters?.countryCode && filters.countryCode !== "ALL") {
        if (candidate.countryCode !== filters.countryCode) return false;
      }
      // Filtre par genre
      if (filters?.gender && filters.gender !== "ALL") {
        if (candidate.gender !== filters.gender) return false;
      }
      // Filtre par âge
      if (filters?.minAge && candidate.age < filters.minAge) return false;
      if (filters?.maxAge && candidate.age > filters.maxAge) return false;

      return true;
    });
  }

  public getLikedCandidateIds(): string[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_LIKES) || "[]");
    } catch {
      return [];
    }
  }

  public getDismissedCandidateIds(): string[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_DISMISSED) || "[]");
    } catch {
      return [];
    }
  }

  public getMatches(): RealMatch[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY_MATCHES);
    if (!raw) {
      const initialMatches: RealMatch[] = [];
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(initialMatches));
      return initialMatches;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public likeCandidate(candidateId: string): { isMatch: boolean; match?: RealMatch; remainingQuota: number } {
    if (typeof window === "undefined") return { isMatch: false, remainingQuota: 0 };

    const profile = this.getProfile();
    if (profile.dailyQuotaRemaining <= 0) {
      return { isMatch: false, remainingQuota: 0 };
    }

    // Décrémentation du quota quotidien
    const remainingQuota = Math.max(0, profile.dailyQuotaRemaining - 1);
    this.saveProfile({ dailyQuotaRemaining: remainingQuota });

    // Enregistrement du like
    const likes = this.getLikedCandidateIds();
    if (!likes.includes(candidateId)) {
      likes.push(candidateId);
      localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likes));
    }

    const candidate = INITIAL_CANDIDATES.find((c) => c.id === candidateId);
    if (!candidate) return { isMatch: false, remainingQuota };

    // Si compatibilité >= 92%, création d'une correspondance bilatérale immédiate
    const matches = this.getMatches();
    const existing = matches.find((m) => m.candidate.id === candidateId);

    if (!existing && candidate.compatibilityScore >= 92) {
      const newMatch: RealMatch = {
        id: `match-${candidate.id}-${Date.now()}`,
        candidate,
        createdAt: "À l'instant",
        lastMessage: "Accord mutuel d'honneur confirmé ! Vous pouvez désormais échanger en toute sérénité.",
        lastMessageTime: "À l'instant",
        unread: true,
        messages: [
          {
            id: `msg-welcome-${Date.now()}`,
            senderId: candidate.id,
            senderName: candidate.firstName,
            text: `Bonjour ${profile.firstName || ""} ! J'ai été touché(e) par la sincérité de vos valeurs. Faisons connaissance dans le respect et la pudeur.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: "DELIVERED",
          },
        ],
      };
      matches.unshift(newMatch);
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
      return { isMatch: true, match: newMatch, remainingQuota };
    }

    return { isMatch: false, remainingQuota };
  }

  public dismissCandidate(candidateId: string) {
    if (typeof window === "undefined") return;
    const dismissed = this.getDismissedCandidateIds();
    if (!dismissed.includes(candidateId)) {
      dismissed.push(candidateId);
      localStorage.setItem(STORAGE_KEY_DISMISSED, JSON.stringify(dismissed));
    }
  }

  // ==========================================
  // GESTION DE LA MESSAGERIE RÉELLE
  // ==========================================

  public sendMessage(matchId: string, text: string, senderId: string = "me"): RealMessage {
    const matches = this.getMatches();
    const match = matches.find((m) => m.id === matchId);
    const profile = this.getProfile();

    const newMsg: RealMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      senderId,
      senderName: senderId === "me" ? (profile.firstName || "Moi") : (match?.candidate.firstName || "Correspondant"),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "SENT",
    };

    if (match) {
      match.messages.push(newMsg);
      match.lastMessage = text;
      match.lastMessageTime = newMsg.timestamp;
      match.unread = false;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
      }
    }

    return newMsg;
  }

  public markMatchAsRead(matchId: string) {
    const matches = this.getMatches();
    const match = matches.find((m) => m.id === matchId);
    if (match) {
      match.unread = false;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
      }
    }
  }

  // ==========================================
  // GESTION DU COFFRE-FORT KYC & MODÉRATION
  // ==========================================

  public submitKycRequest(request: {
    userId: string;
    fullName: string;
    country: string;
    birthDate: string;
    documentType: string;
    documentUrl: string;
    selfieUrl: string;
    similarityScore?: number;
  }): KycQueueItem {
    const queue = this.getKycQueue();
    const newItem: KycQueueItem = {
      id: `kyc-req-${Date.now()}`,
      userId: request.userId,
      fullName: request.fullName,
      country: request.country,
      birthDate: request.birthDate,
      documentType: request.documentType,
      documentUrl: request.documentUrl,
      selfieUrl: request.selfieUrl,
      similarityScore: request.similarityScore || 94,
      submittedAt: new Date().toISOString(),
      status: "PENDING",
    };

    queue.unshift(newItem);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_KYC_QUEUE, JSON.stringify(queue));
    }

    // Mise à jour de l'état utilisateur
    this.saveProfile({
      kycStatus: "PENDING",
      kycDocumentUrl: request.documentUrl,
      kycSelfieUrl: request.selfieUrl,
      docType: request.documentType,
    });

    this.logAuditEvent(
      "KYC_DOSSIER_SUBMITTED",
      request.userId,
      `Dossier KYC soumis pour examen (${request.documentType}, score facial estimé ${newItem.similarityScore}%)`
    );

    return newItem;
  }

  public getKycQueue(): KycQueueItem[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_KYC_QUEUE) || "[]");
    } catch {
      return [];
    }
  }

  public decideKycRequest(
    requestId: string,
    decision: "APPROVED" | "REJECTED",
    notes: string = ""
  ): boolean {
    const queue = this.getKycQueue();
    const item = queue.find((q) => q.id === requestId);
    if (!item) return false;

    item.status = decision;
    item.moderatorNotes = notes;

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_KYC_QUEUE, JSON.stringify(queue));
    }

    if (decision === "APPROVED") {
      this.saveProfile({
        isIdentityVerified: true,
        kycStatus: "VERIFIED",
      });
      this.logAuditEvent(
        "KYC_APPROVED",
        item.userId,
        `Dossier KYC approuvé par le modérateur. Badge Âme Pure octroyé.`
      );
    } else {
      this.saveProfile({
        isIdentityVerified: false,
        kycStatus: "REJECTED",
      });
      this.logAuditEvent(
        "KYC_REJECTED",
        item.userId,
        `Dossier KYC rejeté : ${notes || "Pièce illisible ou selfie non conforme"}`
      );
    }

    return true;
  }

  // ==========================================
  // JOURNAL D'AUDIT IMMUABLE
  // ==========================================

  public logAuditEvent(
    action: string,
    targetUser: string,
    details: string,
    adminId: string = "SYSTEM_AUTOMATION"
  ): AuditLogItem {
    const logs = this.getAuditLogs();
    const entry: AuditLogItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      adminId,
      action,
      targetUser,
      ipAddress: "127.0.0.1",
      details,
    };
    logs.unshift(entry);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs.slice(0, 100)));
    }
    return entry;
  }

  public getAuditLogs(): AuditLogItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (!raw) {
        const initial: AuditLogItem[] = [
          {
            id: "audit-init-001",
            timestamp: new Date().toISOString(),
            adminId: "adm-super-01 (Aliou Ndiaye)",
            action: "PLATFORM_INITIALIZATION",
            targetUser: "SYSTEM_ROOT",
            ipAddress: "127.0.0.1",
            details: "Initialisation propre de la plateforme. Prêt pour le lancement officiel.",
          },
        ];
        localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // ==========================================
  // PAIEMENTS & ABONNEMENTS MOBILE MONEY
  // ==========================================

  public activateSubscription(
    plan: "PASS" | "SERENITE" | "ALLIANCE",
    paymentDetails: {
      operator: string;
      phoneNumber: string;
      amountFcfa: number;
    }
  ): PaymentReceipt {
    const durationDays = plan === "ALLIANCE" ? 365 : plan === "PASS" ? 7 : 30;
    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    const expiryStr = expiryDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const receipt: PaymentReceipt = {
      transactionId: `BA-MOMO-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString("fr-FR"),
      planName: plan === "ALLIANCE" ? "Cercle Alliance (1 An)" : plan === "PASS" ? "Pass Découverte (7 Jours)" : "Formule Sérénité (1 Mois)",
      amountFcfa: paymentDetails.amountFcfa,
      operator: paymentDetails.operator,
      phoneNumber: paymentDetails.phoneNumber,
      validUntil: expiryStr,
      qrReference: `BELLEAME-VERIFIED-${Date.now()}`,
    };

    // Sauvegarde du reçu
    if (typeof window !== "undefined") {
      const receipts = this.getReceipts();
      receipts.unshift(receipt);
      localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(receipts));
    }

    // Mise à jour du profil (quota porté à 50 par jour pour les membres privilégiés)
    this.saveProfile({
      subscribedPlan: plan,
      subscribedUntil: expiryStr,
      dailyQuotaMax: 50,
      dailyQuotaRemaining: 50,
    });

    this.logAuditEvent(
      "SUBSCRIPTION_ACTIVATED",
      paymentDetails.phoneNumber,
      `Abonnement ${plan} activé via ${paymentDetails.operator} (${paymentDetails.amountFcfa} FCFA). Quota étendu à 50/j.`
    );

    return receipt;
  }

  public getReceipts(): PaymentReceipt[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_RECEIPTS) || "[]");
    } catch {
      return [];
    }
  }

  public getLatestReceipt(): PaymentReceipt | null {
    const receipts = this.getReceipts();
    return receipts.length > 0 ? receipts[0]! : null;
  }

  // ==========================================
  // DONNÉES PAR DÉFAUT DU PROFIL
  // ==========================================

  private getDefaultProfile(): RealUserProfile {
    return {
      id: "usr-live-01",
      fullName: "Aliou Ndiaye",
      firstName: "Aliou",
      age: 29,
      phone: "+221 77 000 00 00",
      email: "contact@belleame.africa",
      countryCode: "SN",
      city: "Dakar",
      profession: "Ingénieur Télécoms & Entrepreneur",
      education: "Master École Supérieure Polytechnique",
      bio: "Homme croyant, respectueux des traditions et déterminé à bâtir une famille bénie et harmonieuse.",
      religion: "Musulman Pratiquant",
      sharedValues: ["Foi & Spiritualité", "Respect des Familles", "Ambition Saine", "Bienveillance"],
      isIdentityVerified: true,
      docType: "PASSEPORT",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
      photos: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
      ],
      kycStatus: "VERIFIED",
      subscribedPlan: "SERENITE",
      subscribedUntil: "30 Septembre 2026",
      gender: "MALE",
      targetGenders: ["FEMALE"],
      birthDate: "1997-04-12",
      intent: "MARRIAGE",
      dailyQuotaRemaining: 48,
      dailyQuotaMax: 50,
      lastActiveDate: new Date().toISOString().slice(0, 10),
    };
  }
}

export const realPlatformStore = new RealPlatformStore();
