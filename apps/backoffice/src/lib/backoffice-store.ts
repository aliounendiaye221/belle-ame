"use client";

export interface BackofficeUser {
  id: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  age: number;
  phone: string;
  country: string;
  countryCode: string;
  city: string;
  profession: string;
  subscriptionTier: "ALLIANCE" | "SERENITE" | "PASS" | "FREE";
  kycStatus: "VERIFIED" | "PENDING" | "REJECTED" | "UNVERIFIED";
  accountStatus: "ACTIVE" | "SUSPENDED";
  avatarUrl: string;
  photos: string[];
  createdAt: string;
  lastLogin: string;
  bio: string;
}

export interface BackofficeKycItem {
  id: string;
  userId: string;
  fullName: string;
  country: string;
  countryCode: string;
  age: number;
  birthDate: string;
  documentType: "CNI" | "PASSEPORT" | "TITRE_SEJOUR";
  documentUrl: string;
  selfieUrl: string;
  avatarUrl: string;
  similarityScore: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  profession: string;
  rejectionReason?: string;
}

export interface BackofficeModerationTicket {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserAvatar: string;
  reporterUserId: string;
  reporterUserName: string;
  reason: string;
  flaggedContent: string;
  slaRemainingHours: number;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  severity: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
  sanctionApplied?: string;
}

export interface BackofficeAuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  targetUser: string;
  ipAddress: string;
  details: string;
}

export interface BackofficeTransaction {
  id: string;
  userId: string;
  userName: string;
  operator: "WAVE" | "ORANGE_MONEY" | "MTN_MOMO";
  amountFcfa: number;
  plan: "ALLIANCE" | "SERENITE" | "PASS";
  date: string;
  status: "SUCCESS" | "FAILED";
}

const INITIAL_USERS: BackofficeUser[] = [
  {
    id: "usr-live-01",
    firstName: "Aminata",
    lastName: "Diallo",
    gender: "FEMALE",
    age: 26,
    phone: "+221 77 123 45 67",
    country: "Sénégal",
    countryCode: "SN",
    city: "Dakar",
    profession: "Ingénieure Télécoms",
    subscriptionTier: "SERENITE",
    kycStatus: "VERIFIED",
    accountStatus: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-08-15",
    lastLogin: "Il y a 10 min",
    bio: "Femme respectueuse des valeurs spirituelles et familiales, déterminée à bâtir un foyer vertueux et harmonieux."
  },
  {
    id: "usr-live-02",
    firstName: "Moussa",
    lastName: "Traoré",
    gender: "MALE",
    age: 31,
    phone: "+225 07 45 67 89",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    city: "Abidjan (Cocody)",
    profession: "Directeur Financier",
    subscriptionTier: "ALLIANCE",
    kycStatus: "PENDING",
    accountStatus: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-08-20",
    lastLogin: "Il y a 1h",
    bio: "Homme d'affaires intègre, loyal et pratiquant. Recherche une femme de valeur pour mariage béni."
  },
  {
    id: "usr-live-03",
    firstName: "Fatima",
    lastName: "Zahra",
    gender: "FEMALE",
    age: 28,
    phone: "+212 6 12 34 56 78",
    country: "Maroc",
    countryCode: "MA",
    city: "Casablanca",
    profession: "Médecin Généraliste",
    subscriptionTier: "ALLIANCE",
    kycStatus: "PENDING",
    accountStatus: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-08-25",
    lastLogin: "Hier",
    bio: "Pudeur, bienveillance et rigueur morale. Souhaite rencontrer une belle âme sincère et croyante."
  },
  {
    id: "usr-live-04",
    firstName: "Cheikh",
    lastName: "Tidiane Ndiaye",
    gender: "MALE",
    age: 29,
    phone: "+221 78 987 65 43",
    country: "Sénégal",
    countryCode: "SN",
    city: "Thiès",
    profession: "Architecte d'Intérieur",
    subscriptionTier: "PASS",
    kycStatus: "PENDING",
    accountStatus: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-08-28",
    lastLogin: "Il y a 3h",
    bio: "Créatif, posé et attaché aux traditions sénégalaises et aux principes de dignité."
  },
  {
    id: "usr-live-05",
    firstName: "Ibrahim",
    lastName: "Koné",
    gender: "MALE",
    age: 33,
    phone: "+225 05 11 22 33",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    city: "Bouaké",
    profession: "Ingénieur Agronome",
    subscriptionTier: "SERENITE",
    kycStatus: "PENDING",
    accountStatus: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-09-01",
    lastLogin: "Aujourd'hui",
    bio: "Amoureux de la nature et entrepreneur passionné. Objectif mariage et épanouissement spirituel."
  },
  {
    id: "usr-live-06",
    firstName: "Aïcha",
    lastName: "Camara",
    gender: "FEMALE",
    age: 27,
    phone: "+224 62 00 11 22",
    country: "Guinée",
    countryCode: "GN",
    city: "Conakry",
    profession: "Juriste d'Affaires",
    subscriptionTier: "SERENITE",
    kycStatus: "VERIFIED",
    accountStatus: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-08-10",
    lastLogin: "Il y a 2h",
    bio: "Sérieuse, souriante et pieuse. Recherche un compagnon de vie partageant mes principes."
  },
  {
    id: "usr-live-07",
    firstName: "Samuel",
    lastName: "Eto'o Mba",
    gender: "MALE",
    age: 34,
    phone: "+237 67 12 34 56",
    country: "Cameroun",
    countryCode: "CM",
    city: "Douala",
    profession: "Cadre Logistique Maritime",
    subscriptionTier: "FREE",
    kycStatus: "UNVERIFIED",
    accountStatus: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-09-02",
    lastLogin: "Il y a 5h",
    bio: "Homme stable, respectueux et chrétien pratiquant."
  },
  {
    id: "usr-live-08",
    firstName: "Khadija",
    lastName: "Sow",
    gender: "FEMALE",
    age: 25,
    phone: "+221 76 543 21 00",
    country: "Sénégal",
    countryCode: "SN",
    city: "Saint-Louis",
    profession: "Professeure de Lettres",
    subscriptionTier: "SERENITE",
    kycStatus: "VERIFIED",
    accountStatus: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-08-18",
    lastLogin: "Il y a 30 min",
    bio: "Érudition, douceur et piété sincère."
  }
];

const INITIAL_KYC_QUEUE: BackofficeKycItem[] = [
  {
    id: "kyc-001",
    userId: "usr-live-02",
    fullName: "Moussa Traoré",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    age: 31,
    birthDate: "1995-04-12",
    documentType: "PASSEPORT",
    documentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
    selfieUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    similarityScore: 94,
    status: "PENDING",
    submittedAt: "2026-09-06T14:30:00Z",
    profession: "Directeur Financier"
  },
  {
    id: "kyc-002",
    userId: "usr-live-03",
    fullName: "Fatima Zahra",
    country: "Maroc",
    countryCode: "MA",
    age: 28,
    birthDate: "1998-02-19",
    documentType: "CNI",
    documentUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    selfieUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
    similarityScore: 96,
    status: "PENDING",
    submittedAt: "2026-09-06T15:10:00Z",
    profession: "Médecin Généraliste"
  },
  {
    id: "kyc-003",
    userId: "usr-live-04",
    fullName: "Cheikh Tidiane Ndiaye",
    country: "Sénégal",
    countryCode: "SN",
    age: 29,
    birthDate: "1997-07-08",
    documentType: "TITRE_SEJOUR",
    documentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    selfieUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    similarityScore: 89,
    status: "PENDING",
    submittedAt: "2026-09-06T16:00:00Z",
    profession: "Architecte d'Intérieur"
  },
  {
    id: "kyc-004",
    userId: "usr-live-05",
    fullName: "Ibrahim Koné",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    age: 33,
    birthDate: "1993-11-23",
    documentType: "CNI",
    documentUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80",
    selfieUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80",
    similarityScore: 84,
    status: "PENDING",
    submittedAt: "2026-09-06T16:45:00Z",
    profession: "Ingénieur Agronome"
  }
];

const INITIAL_MODERATION: BackofficeModerationTicket[] = [
  {
    id: "mod-104",
    reportedUserId: "usr-live-07",
    reportedUserName: "Samuel Eto'o Mba",
    reportedUserAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
    reporterUserId: "usr-live-01",
    reporterUserName: "Aminata Diallo",
    reason: "Sollicitation financière & Broutage suspect",
    flaggedContent: "« Envoie-moi 25 000 FCFA par Wave pour payer le taxi jusqu'à l'hôtel, je te rembourserai demain sans faute. »",
    slaRemainingHours: 14,
    status: "PENDING",
    severity: "HIGH",
    createdAt: "2026-09-06T11:00:00Z"
  },
  {
    id: "mod-108",
    reportedUserId: "usr-live-05",
    reportedUserName: "Ibrahim Koné",
    reportedUserAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80",
    reporterUserId: "usr-live-08",
    reporterUserName: "Khadija Sow",
    reason: "Insistance déplacée hors charte de bienséance",
    flaggedContent: "« Pourquoi tu ne réponds pas immédiatement ? Donne-moi ton numéro WhatsApp direct maintenant. »",
    slaRemainingHours: 21,
    status: "PENDING",
    severity: "MEDIUM",
    createdAt: "2026-09-06T14:15:00Z"
  }
];

const INITIAL_AUDIT: BackofficeAuditLog[] = [
  {
    id: "audit-101",
    timestamp: "2026-09-06T16:50:00Z",
    adminId: "adm-super-01 (Aliou Ndiaye)",
    action: "ADMIN_LOGIN_SUCCESS",
    targetUser: "SYSTEM_CONSOLE",
    ipAddress: "197.234.221.14 (Dakar, SN)",
    details: "Authentification Super Admin réussie avec clé de sécurité et session autorisée."
  },
  {
    id: "audit-102",
    timestamp: "2026-09-06T15:20:00Z",
    adminId: "adm-mod-01 (Modération SLA)",
    action: "KYC_APPROVED",
    targetUser: "usr-live-01 (Aminata Diallo)",
    ipAddress: "197.234.221.14",
    details: "Validation officielle CNI sénégalaise. Score biométrique 94%. Badge Âme Pure octroyé."
  },
  {
    id: "audit-103",
    timestamp: "2026-09-06T14:00:00Z",
    adminId: "sys-payment-gateway",
    action: "MOMO_PAYMENT_CAPTURED",
    targetUser: "usr-live-02 (Moussa Traoré)",
    ipAddress: "160.154.24.89 (Abidjan, CI)",
    details: "Règlement 24 000 FCFA validé via Wave Côte d'Ivoire. Formule Alliance Sacrée activée (1 an)."
  }
];

const INITIAL_TRANSACTIONS: BackofficeTransaction[] = [
  { id: "tx-01", userId: "usr-live-02", userName: "Moussa Traoré", operator: "WAVE", amountFcfa: 24000, plan: "ALLIANCE", date: "2026-09-06", status: "SUCCESS" },
  { id: "tx-02", userId: "usr-live-03", userName: "Fatima Zahra", operator: "WAVE", amountFcfa: 24000, plan: "ALLIANCE", date: "2026-09-05", status: "SUCCESS" },
  { id: "tx-03", userId: "usr-live-01", userName: "Aminata Diallo", operator: "ORANGE_MONEY", amountFcfa: 7500, plan: "SERENITE", date: "2026-09-04", status: "SUCCESS" },
  { id: "tx-04", userId: "usr-live-06", userName: "Aïcha Camara", operator: "ORANGE_MONEY", amountFcfa: 7500, plan: "SERENITE", date: "2026-09-03", status: "SUCCESS" },
  { id: "tx-05", userId: "usr-live-08", userName: "Khadija Sow", operator: "WAVE", amountFcfa: 7500, plan: "SERENITE", date: "2026-09-02", status: "SUCCESS" },
  { id: "tx-06", userId: "usr-live-04", userName: "Cheikh Tidiane", operator: "MTN_MOMO", amountFcfa: 3000, plan: "PASS", date: "2026-09-01", status: "SUCCESS" },
];

class BackofficeStore {
  private isBrowser = typeof window !== "undefined";

  private getStorage<T>(key: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    try {
      const data = localStorage.getItem(`belleame_bo_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(`belleame_bo_${key}`, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  // --- STATS ---
  getDashboardStats() {
    const users = this.getUsers();
    const kycPending = this.getKycQueue().filter((k) => k.status === "PENDING").length;
    const modPending = this.getModerationTickets().filter((m) => m.status === "PENDING").length;
    const transactions = this.getTransactions();
    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amountFcfa, 0);

    return {
      totalUsers: users.length,
      kycPending,
      moderationPending: modPending,
      totalRevenueFcfa: totalRevenue,
      verifiedKycCount: users.filter((u) => u.kycStatus === "VERIFIED").length,
      premiumCount: users.filter((u) => u.subscriptionTier !== "FREE").length,
    };
  }

  // --- USERS ---
  getUsers(): BackofficeUser[] {
    return this.getStorage<BackofficeUser[]>("users", INITIAL_USERS);
  }

  getUserById(id: string): BackofficeUser | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  updateUser(id: string, updates: Partial<BackofficeUser>): BackofficeUser | null {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    list[idx] = { ...list[idx]!, ...updates };
    this.setStorage("users", list);

    this.logAudit(
      "USER_UPDATED",
      id,
      `Mise à jour du profil membre ${list[idx]!.firstName} ${list[idx]!.lastName}: ${Object.keys(updates).join(", ")}`
    );

    return list[idx]!;
  }

  toggleUserSuspension(id: string): BackofficeUser | null {
    const user = this.getUserById(id);
    if (!user) return null;

    const newStatus = user.accountStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    return this.updateUser(id, { accountStatus: newStatus });
  }

  updateUserTier(id: string, tier: "ALLIANCE" | "SERENITE" | "PASS" | "FREE"): BackofficeUser | null {
    return this.updateUser(id, { subscriptionTier: tier });
  }

  // --- KYC ---
  getKycQueue(): BackofficeKycItem[] {
    return this.getStorage<BackofficeKycItem[]>("kyc_queue", INITIAL_KYC_QUEUE);
  }

  approveKyc(id: string): void {
    const queue = this.getKycQueue();
    const item = queue.find((k) => k.id === id);
    if (!item) return;

    item.status = "APPROVED";
    this.setStorage("kyc_queue", queue);

    // Mettre à jour l'utilisateur correspondant
    this.updateUser(item.userId, { kycStatus: "VERIFIED" });

    this.logAudit(
      "KYC_APPROVED",
      item.userId,
      `Pièce ${item.documentType} approuvée pour ${item.fullName}. Score biométrique ${item.similarityScore}%.`
    );
  }

  rejectKyc(id: string, reason: string): void {
    const queue = this.getKycQueue();
    const item = queue.find((k) => k.id === id);
    if (!item) return;

    item.status = "REJECTED";
    item.rejectionReason = reason;
    this.setStorage("kyc_queue", queue);

    this.updateUser(item.userId, { kycStatus: "REJECTED" });

    this.logAudit(
      "KYC_REJECTED",
      item.userId,
      `Rejet de la pièce (${reason}) pour le candidat ${item.fullName}. Notification envoyée au membre.`
    );
  }

  // --- MODERATION ---
  getModerationTickets(): BackofficeModerationTicket[] {
    return this.getStorage<BackofficeModerationTicket[]>("moderation", INITIAL_MODERATION);
  }

  resolveTicket(id: string, sanction: string): void {
    const tickets = this.getModerationTickets();
    const t = tickets.find((tk) => tk.id === id);
    if (!t) return;

    t.status = "RESOLVED";
    t.sanctionApplied = sanction;
    this.setStorage("moderation", tickets);

    // Si bannissement, suspendre l'utilisateur
    if (sanction.includes("Bannissement") || sanction.includes("Suspension")) {
      this.updateUser(t.reportedUserId, { accountStatus: "SUSPENDED" });
    }

    this.logAudit(
      "MODERATION_SANCTION_APPLIED",
      t.reportedUserId,
      `Sanction appliquée: [${sanction}] sur le ticket ${t.id}. Motif: ${t.reason}.`
    );
  }

  dismissTicket(id: string): void {
    const tickets = this.getModerationTickets();
    const t = tickets.find((tk) => tk.id === id);
    if (!t) return;

    t.status = "DISMISSED";
    this.setStorage("moderation", tickets);

    this.logAudit(
      "MODERATION_DISMISSED",
      t.reportedUserId,
      `Ticket de modération ${t.id} classé sans suite (Faux signalement après audit de bienséance).`
    );
  }

  // --- TRANSACTIONS ---
  getTransactions(): BackofficeTransaction[] {
    return this.getStorage<BackofficeTransaction[]>("transactions", INITIAL_TRANSACTIONS);
  }

  // --- AUDIT LOGS ---
  getAuditLogs(): BackofficeAuditLog[] {
    return this.getStorage<BackofficeAuditLog[]>("audit_logs", INITIAL_AUDIT);
  }

  logAudit(action: string, targetUser: string, details: string): void {
    const logs = this.getAuditLogs();
    const entry: BackofficeAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminId: "adm-super-01 (Aliou Ndiaye)",
      action,
      targetUser,
      ipAddress: "197.234.221.14 (Dakar, SN)",
      details,
    };
    logs.unshift(entry);
    this.setStorage("audit_logs", logs.slice(0, 100));
  }

  resetToDefault(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem("belleame_bo_users");
    localStorage.removeItem("belleame_bo_kyc_queue");
    localStorage.removeItem("belleame_bo_moderation");
    localStorage.removeItem("belleame_bo_audit_logs");
    localStorage.removeItem("belleame_bo_transactions");
  }
}

export const backofficeStore = new BackofficeStore();
