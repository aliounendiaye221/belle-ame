import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { MockPaymentProvider } from "./providers/mock-payment.provider";
import { CinetPayPaymentProvider } from "./providers/cinetpay.provider";
import { WavePaymentProvider } from "./providers/wave.provider";
import { IPaymentProvider } from "./interfaces/payment-provider.interface";
import {
  PaymentProviderType,
  PaymentStatus,
  SubscriptionStatus,
  PlanInterval,
  NotificationType,
  NotificationChannel,
  CheckoutSubscriptionDto,
  BuyBoostDto,
} from "@belle-ame/shared-types";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  // Prix d'un boost ponctuel : 500 FCFA (50 000 centimes)
  private readonly BOOST_PRICE_IN_CENTS = 50000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mockPaymentProvider: MockPaymentProvider,
    private readonly cinetPayProvider: CinetPayPaymentProvider,
    private readonly waveProvider: WavePaymentProvider,
  ) {}

  private resolveProvider(providerType: PaymentProviderType): IPaymentProvider {
    switch (providerType) {
      case PaymentProviderType.CINETPAY:
      case PaymentProviderType.MTN_MOMO:
      case PaymentProviderType.ORANGE_MONEY:
      case PaymentProviderType.MOOV_MONEY:
        return this.cinetPayProvider;
      case PaymentProviderType.WAVE:
        return this.waveProvider;
      case PaymentProviderType.MOCK_TEST:
      default:
        return this.mockPaymentProvider;
    }
  }

  /**
   * Consultation de la grille tarifaire officielle
   */
  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceInCents: "asc" },
    });
  }

  /**
   * Initiation d'une souscription d'abonnement (Mobile Money ou Carte)
   */
  async checkoutSubscription(userId: string, dto: CheckoutSubscriptionDto) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan || !plan.isActive) {
      throw new NotFoundException("Plan d'abonnement introuvable ou inactif.");
    }

    // 1. Création de l'abonnement en statut temporaire
    const now = new Date();
    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: SubscriptionStatus.PAST_DUE, // Deviendra ACTIVE après confirmation webhook
        startDate: now,
        endDate: now,
      },
    });

    // 2. Création de l'entité Payment
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        provider: dto.provider as any,
        amountInCents: plan.priceInCents,
        currency: plan.currency,
        status: PaymentStatus.PENDING,
      },
    });

    // 3. Appel du fournisseur de paiement résolu (Mode Test ou Passerelle Réelle CinetPay/Wave)
    const activeProvider = this.resolveProvider(dto.provider);
    const initResult = await activeProvider.initiatePayment({
      paymentId: payment.id,
      amountInCents: payment.amountInCents,
      currency: payment.currency,
      customerPhone: dto.phoneNumber,
    });

    // 4. Mise à jour de l'identifiant de transaction fournisseur
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { providerTxId: initResult.providerTxId },
    });

    return {
      success: true,
      paymentId: payment.id,
      providerTxId: initResult.providerTxId,
      checkoutUrl: initResult.checkoutUrl,
      instructions: initResult.instructions,
      isTestMode: initResult.isTestMode,
    };
  }

  /**
   * Achat ponctuel d'un Boost de visibilité (1 heure à 500 FCFA)
   */
  async buyBoost(userId: string, dto: BuyBoostDto) {
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        provider: dto.provider as any,
        amountInCents: this.BOOST_PRICE_IN_CENTS,
        currency: "XOF",
        status: PaymentStatus.PENDING,
      },
    });

    // 3. Appel du fournisseur de paiement
    const activeProvider = this.resolveProvider(dto.provider);
    const initResult = await activeProvider.initiatePayment({
      paymentId: payment.id,
      amountInCents: payment.amountInCents,
      currency: payment.currency,
      customerPhone: dto.phoneNumber,
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { providerTxId: initResult.providerTxId },
    });

    return {
      success: true,
      paymentId: payment.id,
      checkoutUrl: initResult.checkoutUrl,
      instructions: initResult.instructions,
      isTestMode: initResult.isTestMode,
    };
  }

  /**
   * Traitement d'un Webhook entrant avec vérification d'idempotence
   */
  async handleWebhook(providerType: PaymentProviderType, rawPayload: any, signature?: string) {
    const activeProvider = this.resolveProvider(providerType);
    const parsed = await activeProvider.parseWebhook(rawPayload, signature);

    // 1. CONTRÔLE STRICT D'IDEMPOTENCE
    // Si l'événement a déjà été traité avec succès, on ne le rejoue pas !
    const existingEvent = await this.prisma.paymentWebhookEvent.findUnique({
      where: { externalEventId: parsed.externalEventId },
    });

    if (existingEvent && existingEvent.isProcessed) {
      this.logger.warn(`[IDEMPOTENCE] Webhook ${parsed.externalEventId} déjà traité. Aucune action répétée.`);
      return { success: true, message: "Événement déjà traité avec succès (Idempotence)." };
    }

    // 2. Recherche du paiement associé
    const payment = await this.prisma.payment.findFirst({
      where: {
        OR: [
          { providerTxId: parsed.providerTxId },
          { id: rawPayload?.paymentId || "" },
        ],
      },
      include: { subscription: { include: { plan: true } } },
    });

    if (!payment) {
      this.logger.error(`Paiement introuvable pour transaction ${parsed.providerTxId}`);
      throw new NotFoundException("Paiement non identifié.");
    }

    // 3. Enregistrement de l'événement dans le journal des webhooks
    const webhookRecord = await this.prisma.paymentWebhookEvent.upsert({
      where: { externalEventId: parsed.externalEventId },
      update: { payload: rawPayload },
      create: {
        paymentId: payment.id,
        provider: providerType as any,
        externalEventId: parsed.externalEventId,
        payload: rawPayload,
      },
    });

    // 4. Traitement selon le statut retourné
    if (parsed.status === PaymentStatus.SUCCESSFUL) {
      const receiptUrl = `http://localhost:4000/api/v1/payments/receipts/${payment.id}`;

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCESSFUL,
          receiptUrl,
        },
      });

      // Si c'est un abonnement : calcul de la durée et activation
      if (payment.subscription) {
        const plan = payment.subscription.plan;
        let durationDays = 30;
        if (plan.interval === PlanInterval.QUARTERLY) durationDays = 90;
        else if (plan.interval === PlanInterval.YEARLY) durationDays = 365;

        const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

        await this.prisma.subscription.update({
          where: { id: payment.subscription.id },
          data: {
            status: SubscriptionStatus.ACTIVE,
            endDate,
          },
        });

        // Notification in-app
        await this.prisma.notification.create({
          data: {
            userId: payment.userId,
            type: NotificationType.SUBSCRIPTION_CONFIRMED,
            channel: NotificationChannel.IN_APP,
            title: "Abonnement Premium activé !",
            body: `Félicitations ! Votre formule ${plan.name} est active jusqu'au ${endDate.toLocaleDateString("fr-FR")}.`,
          },
        });

        this.logger.log(`💎 Abonnement activé pour utilisateur ${payment.userId} (${plan.name})`);
      } else {
        // Achat ponctuel d'un Boost
        await this.prisma.boost.create({
          data: {
            userId: payment.userId,
            durationMin: 60,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            isActive: true,
          },
        });
        this.logger.log(`🚀 Boost activé pour utilisateur ${payment.userId}`);
      }

      // Marquer l'événement comme traité
      await this.prisma.paymentWebhookEvent.update({
        where: { id: webhookRecord.id },
        data: { isProcessed: true, processedAt: new Date() },
      });

      return { success: true, status: PaymentStatus.SUCCESSFUL };
    } else {
      // Échec de paiement
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          errorMessage: parsed.errorMessage || "Échec de transaction.",
        },
      });

      await this.prisma.paymentWebhookEvent.update({
        where: { id: webhookRecord.id },
        data: { isProcessed: true, processedAt: new Date() },
      });

      return { success: true, status: PaymentStatus.FAILED };
    }
  }

  /**
   * Annulation du renouvellement automatique d'un abonnement
   */
  async cancelSubscription(userId: string, subscriptionId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!sub || sub.userId !== userId) {
      throw new NotFoundException("Abonnement introuvable.");
    }

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        autoRenew: false,
        cancelledAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Votre abonnement ne sera pas renouvelé. Vos privilèges restent actifs jusqu'au ${sub.endDate.toLocaleDateString("fr-FR")}.`,
    };
  }

  /**
   * Remboursement administratif (Rôle ADMIN / SUPER_ADMIN)
   */
  async refundPayment(adminId: string, paymentId: string, rationale: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { subscription: true },
    });

    if (!payment) throw new NotFoundException("Paiement introuvable.");

    // Mise à jour du statut de paiement
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.REFUNDED },
    });

    // Révocation de l'abonnement si rattaché
    if (payment.subscription) {
      await this.prisma.subscription.update({
        where: { id: payment.subscription.id },
        data: { status: SubscriptionStatus.CANCELLED },
      });
    }

    // Journal d'audit obligatoire
    await this.prisma.adminAuditLog.create({
      data: {
        adminId,
        action: "PAYMENT_REFUNDED",
        entityType: "Payment",
        entityId: paymentId,
        metadata: {
          amountInCents: payment.amountInCents,
          currency: payment.currency,
          rationale,
        },
      },
    });

    this.logger.warn(`💸 Remboursement effectué par ${adminId} pour paiement ${paymentId} (${rationale})`);

    return { success: true, message: "Paiement remboursé et privilèges révoqués." };
  }

  /**
   * Historique des transactions de l'utilisateur avec reçus
   */
  async getUserTransactions(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amountInCents: true,
        currency: true,
        status: true,
        provider: true,
        receiptUrl: true,
        createdAt: true,
      },
    });
  }
}
