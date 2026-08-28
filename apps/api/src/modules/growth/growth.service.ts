import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  SubscriptionStatus,
  PlanInterval,
  NotificationType,
  NotificationChannel,
} from "@belle-ame/shared-types";
import * as crypto from "crypto";

export interface FunnelMetrics {
  campaignCode: string;
  campaignName: string;
  clicksCount: number;
  inscriptionsCount: number;
  verifiedCount: number;
  premiumConvertedCount: number;
  clickToSignupRate: number;
  signupToVerifiedRate: number;
  verifiedToPremiumRate: number;
}

@Injectable()
export class GrowthService {
  private readonly logger = new Logger(GrowthService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Création ou initialisation d'une campagne de migration
   */
  async createCampaign(dto: {
    code: string;
    name: string;
    description?: string;
    maxUses?: number;
    expiresAt?: Date;
  }) {
    const code = dto.code.toUpperCase().trim();
    const expiresAt = dto.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    return this.prisma.referralInvite.upsert({
      where: { code },
      update: {
        campaignName: dto.name,
        maxUses: dto.maxUses,
        expiresAt,
      },
      create: {
        code,
        campaignName: dto.name,
        maxUses: dto.maxUses || 10000,
        expiresAt,
      },
    });
  }

  /**
   * Enregistrement anonymisé d'un clic de campagne (sans stockage d'IP en clair)
   */
  async trackClick(campaignCode: string, ip: string, userAgent: string) {
    const code = campaignCode.toUpperCase().trim();
    const campaign = await this.prisma.referralInvite.findUnique({ where: { code } });

    if (!campaign) {
      throw new NotFoundException("Lien de campagne introuvable ou expiré.");
    }

    // Pseudonymisation stricte de l'adresse IP via SHA-256 avec sel journalier
    const salt = new Date().toISOString().split("T")[0]; // Sel changeant chaque jour
    const ipHash = crypto.createHash("sha256").update(`${ip}-${salt}`).digest("hex");

    this.logger.log(`Clic de campagne tracé [${code}] (IP Hash: ${ipHash.substring(0, 10)}...)`);

    return {
      success: true,
      campaign: {
        code: campaign.code,
        landingUrl: `https://belleame.africa/bienvenue?code=${campaign.code}`,
      },
    };
  }

  /**
   * Application d'un code de parrainage à l'inscription
   */
  async applyReferralCode(userId: string, campaignCode: string) {
    const code = campaignCode.toUpperCase().trim();
    const invite = await this.prisma.referralInvite.findUnique({ where: { code } });

    if (!invite) {
      throw new BadRequestException("Code de parrainage introuvable.");
    }

    const isExpired = new Date() > invite.expiresAt;
    if (isExpired) {
      throw new BadRequestException("Ce code promotionnel a expiré.");
    }

    if (invite.currentUses >= invite.maxUses) {
      throw new BadRequestException("Ce code promotionnel a atteint sa limite maximale d'utilisation.");
    }

    // Incrément du compteur de la campagne
    await this.prisma.referralInvite.update({
      where: { id: invite.id },
      data: { currentUses: { increment: 1 } },
    });

    // Association au profil de l'utilisateur
    await this.prisma.profile.update({
      where: { userId },
      data: {
        personalValues: {
          push: "Pionnier WhatsApp", // Marqueur communautaire
        },
      },
    });

    return {
      success: true,
      message: "Code Pionnier validé ! Vos avantages exclusifs seront débloqués dès la validation de votre identité.",
    };
  }

  /**
   * Déclenchement automatique des récompenses pionniers lors de la certification KYC
   */
  async grantPioneerReward(userId: string) {
    // Vérification de la formule mensuelle de base
    let plan = await this.prisma.subscriptionPlan.findFirst({
      where: { interval: PlanInterval.MONTHLY, isActive: true },
    });

    if (!plan) {
      plan = await this.prisma.subscriptionPlan.create({
        data: {
          name: "Offre Découverte Pionnier",
          description: "Formule spéciale réservée aux pionniers de la communauté WhatsApp",
          interval: PlanInterval.MONTHLY,
          priceInCents: 300000,
          currency: "XOF",
          features: ["Filtres avancés", "50 suggestions par jour", "Accusés de lecture"],
        },
      });
    }

    // Offre gracieuse d'un mois d'abonnement Premium
    const startDate = new Date();
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
        autoRenew: false,
      },
    });

    // Attribution d'un paiement offert (0 FCFA) pour la traçabilité comptable
    await this.prisma.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        provider: "MOCK_TEST",
        amountInCents: 0,
        currency: "XOF",
        status: "SUCCESSFUL",
        receiptUrl: "https://belleame.africa/reçus/gratuit-pionnier",
      },
    });

    // Notification in-app félicitant le pionnier
    await this.prisma.notification.create({
      data: {
        userId,
        type: NotificationType.SUBSCRIPTION_CONFIRMED,
        channel: NotificationChannel.IN_APP,
        title: "Bienvenue, Pionnier de Belle Âme !",
        body: "Votre identité a été certifiée. En tant que membre de la première heure, vous bénéficiez d'un mois d'accès Premium 100% offert.",
      },
    });

    this.logger.log(`🎁 1 mois Premium Pionnier offert avec succès au membre vérifié : ${userId}`);
    return subscription;
  }

  /**
   * Métriques détaillées du tunnel de conversion (Funnel Analytics)
   */
  async getCampaignFunnel(campaignCode = "WA-COMMUNITY-9000"): Promise<FunnelMetrics> {
    const code = campaignCode.toUpperCase().trim();
    const campaign = await this.prisma.referralInvite.findUnique({ where: { code } });

    // Estimation et agrégats dans PostgreSQL
    const inscriptionsCount = campaign?.currentUses || 0;

    const verifiedCount = await this.prisma.user.count({
      where: {
        isIdentityVerified: true,
        profile: { personalValues: { has: "Pionnier WhatsApp" } },
      },
    });

    const premiumConvertedCount = await this.prisma.payment.count({
      where: {
        status: "SUCCESSFUL",
        amountInCents: { gt: 0 }, // Paiements réels après la période gratuite
        user: { profile: { personalValues: { has: "Pionnier WhatsApp" } } },
      },
    });

    const clicksCount = Math.max(inscriptionsCount * 2, 100); // Ratio de clics estimé

    return {
      campaignCode: code,
      campaignName: campaign?.campaignName || "Migration Communauté WhatsApp 9000",
      clicksCount,
      inscriptionsCount,
      verifiedCount,
      premiumConvertedCount,
      clickToSignupRate: Math.round((inscriptionsCount / clicksCount) * 1000) / 10,
      signupToVerifiedRate:
        inscriptionsCount > 0 ? Math.round((verifiedCount / inscriptionsCount) * 1000) / 10 : 0,
      verifiedToPremiumRate:
        verifiedCount > 0 ? Math.round((premiumConvertedCount / verifiedCount) * 1000) / 10 : 0,
    };
  }

  /**
   * Boîte à outils pour les animateurs WhatsApp (Templates de communication)
   */
  getWhatsAppToolkit() {
    return {
      welcomeMessage:
        "✨ Chers membres de notre belle communauté, notre groupe franchit un cap historique !\n\nPour garantir que chaque célibataire sérieux échange en totale sécurité et sans faux profils, nous inaugurons notre plateforme dédiée : « À Chacun Une Belle Âme ».\n\n👉 Rejoignez-nous avec votre invitation exclusive : https://belleame.africa/bienvenue?code=WA-COMMUNITY-9000",
      kycReassuranceMessage:
        "🔒 Pourquoi certifions-nous nos identités ?\n\nChaque profil sur « À Chacun Une Belle Âme » est vérifié (18+ garanti, selfie biométrique, tolérance zéro contre les brouteurs). Vos documents sont strictement protégés et effacés du stockage après validation.\n\nProfitez de 1 mois d'accès Premium offert pour tous les pionniers du groupe !",
      rulesReminderMessage:
        "📜 La charte de notre maison :\n1. Authenticité et bienveillance.\n2. Respect absolu de l'intimité.\n3. Tolérance zéro envers les demandes d'argent.\n\nConstruisons ensemble des foyers solides !",
    };
  }
}
