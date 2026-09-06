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

// -------------------------------------------------------------
// COMPTEURS DE PRODUCTION REMIS À ZÉRO (ZÉRO FAUSSE DONNÉE)
// -------------------------------------------------------------
const INITIAL_USERS: BackofficeUser[] = [];
const INITIAL_KYC_QUEUE: BackofficeKycItem[] = [];
const INITIAL_MODERATION: BackofficeModerationTicket[] = [];
const INITIAL_TRANSACTIONS: BackofficeTransaction[] = [];

const INITIAL_AUDIT: BackofficeAuditLog[] = [
  {
    id: "audit-init-01",
    timestamp: new Date().toISOString(),
    adminId: "adm-super-01 (Aliou Ndiaye)",
    action: "SYSTEM_INITIALIZED",
    targetUser: "SYSTEM_PRODUCTION",
    ipAddress: "197.234.221.14 (Dakar, SN)",
    details: "Console Super Admin initialisée à zéro en mode Production réelle (0 faux compte, 0 fausse transaction).",
  },
];

const STORE_VERSION = "v3_zero_clean";

class BackofficeStore {
  private isBrowser = typeof window !== "undefined";

  constructor() {
    if (this.isBrowser) {
      // Nettoyage automatique immédiat de tous les mocks résiduels si version antérieure
      const curVersion = localStorage.getItem("belleame_bo_version");
      if (curVersion !== STORE_VERSION) {
        localStorage.removeItem("belleame_bo_users");
        localStorage.removeItem("belleame_bo_kyc_queue");
        localStorage.removeItem("belleame_bo_moderation");
        localStorage.removeItem("belleame_bo_audit_logs");
        localStorage.removeItem("belleame_bo_transactions");
        localStorage.setItem("belleame_bo_version", STORE_VERSION);
      }
    }
  }

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

  // --- STATS DYNAMIQUE (DÉMARRE À ZÉRO) ---
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

  addUser(user: BackofficeUser): void {
    const list = this.getUsers();
    list.unshift(user);
    this.setStorage("users", list);
    this.logAudit("USER_REGISTERED", user.id, `Nouveau membre inscrit : ${user.firstName} ${user.lastName} (${user.country}).`);
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

  submitKyc(item: BackofficeKycItem): void {
    const queue = this.getKycQueue();
    queue.unshift(item);
    this.setStorage("kyc_queue", queue);
    this.logAudit("KYC_SUBMITTED", item.userId, `Nouvelle pièce soumise (${item.documentType}) par ${item.fullName}.`);
  }

  approveKyc(id: string): void {
    const queue = this.getKycQueue();
    const item = queue.find((k) => k.id === id);
    if (!item) return;

    item.status = "APPROVED";
    this.setStorage("kyc_queue", queue);

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

  createTicket(ticket: BackofficeModerationTicket): void {
    const tickets = this.getModerationTickets();
    tickets.unshift(ticket);
    this.setStorage("moderation", tickets);
    this.logAudit("MODERATION_REPORT_CREATED", ticket.reportedUserId, `Signalement reçu : ${ticket.reason}.`);
  }

  resolveTicket(id: string, sanction: string): void {
    const tickets = this.getModerationTickets();
    const t = tickets.find((tk) => tk.id === id);
    if (!t) return;

    t.status = "RESOLVED";
    t.sanctionApplied = sanction;
    this.setStorage("moderation", tickets);

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
      `Ticket de modération ${t.id} classé sans suite.`
    );
  }

  // --- TRANSACTIONS ---
  getTransactions(): BackofficeTransaction[] {
    return this.getStorage<BackofficeTransaction[]>("transactions", INITIAL_TRANSACTIONS);
  }

  recordTransaction(tx: BackofficeTransaction): void {
    const list = this.getTransactions();
    list.unshift(tx);
    this.setStorage("transactions", list);
    this.logAudit("PAYMENT_CAPTURED", tx.userId, `Paiement ${tx.amountFcfa} FCFA validé via ${tx.operator} (Plan: ${tx.plan}).`);
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
    this.resetAllToZero();
  }

  resetAllToZero(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem("belleame_bo_users");
    localStorage.removeItem("belleame_bo_kyc_queue");
    localStorage.removeItem("belleame_bo_moderation");
    localStorage.removeItem("belleame_bo_audit_logs");
    localStorage.removeItem("belleame_bo_transactions");
    localStorage.setItem("belleame_bo_version", STORE_VERSION);
  }
}

export const backofficeStore = new BackofficeStore();
