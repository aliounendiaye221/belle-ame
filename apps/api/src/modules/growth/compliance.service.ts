import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AccountStatus, RequestProcessStatus } from "@belle-ame/shared-types";

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Exportation intégrale et structurée des données personnelles (Droit d'accès et portabilité)
   */
  async exportUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            photos: { select: { id: true, url: true, isMain: true, moderationStatus: true } },
            interests: { select: { name: true, category: true } },
            preference: true,
          },
        },
        sessions: {
          select: { id: true, userAgent: true, ipAddress: true, createdAt: true },
        },
        devices: {
          select: { deviceFingerprint: true, createdAt: true },
        },
        sentMessages: {
          where: { isDeleted: false },
          select: { id: true, conversationId: true, content: true, createdAt: true, status: true },
        },
        payments: {
          select: { id: true, amountInCents: true, currency: true, status: true, receiptUrl: true, createdAt: true },
        },
        subscriptions: {
          include: { plan: { select: { name: true, interval: true } } },
        },
        notificationPreference: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Compte utilisateur introuvable.");
    }

    // Données nettoyées de tout secret cryptographique
    const exportArchive = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        userId: user.id,
        legalNotice: "Données personnelles fournies en conformité avec la réglementation sur la protection des données.",
      },
      account: {
        phoneNumber: user.phoneNumber,
        email: user.email,
        status: user.status,
        isIdentityVerified: user.isIdentityVerified,
        createdAt: user.createdAt,
      },
      profile: user.profile,
      activity: {
        sentMessages: user.sentMessages,
        payments: user.payments,
        subscriptions: user.subscriptions,
        devices: user.devices,
        sessions: user.sessions,
      },
    };

    // Enregistrement de la demande d'export
    const request = await this.prisma.dataExportRequest.create({
      data: {
        userId,
        status: RequestProcessStatus.COMPLETED,
        downloadUrl: `https://belleame.africa/api/v1/compliance/exports/${userId}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Téléchargeable pendant 7 jours
      },
    });

    this.logger.log(`Archive de données personnelles générée pour l'utilisateur : ${userId}`);

    return {
      exportId: request.id,
      expiresAt: request.expiresAt,
      data: exportArchive,
    };
  }

  /**
   * Demande de suppression de compte avec PÉRIODE DE GRÂCE DE 14 JOURS
   */
  async requestAccountDeletion(userId: string, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Utilisateur introuvable.");

    // Date programmée d'effacement définitif = Date actuelle + 14 jours
    const gracePeriodEndAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const deletionRequest = await this.prisma.accountDeletionRequest.upsert({
      where: { userId },
      update: {
        reason,
        gracePeriodEndAt,
        status: RequestProcessStatus.PENDING,
        cancelledAt: null,
      },
      create: {
        userId,
        reason,
        gracePeriodEndAt,
        status: RequestProcessStatus.PENDING,
      },
    });

    // Mise en pause immédiate du profil (invisible dans le matching)
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: AccountStatus.PAUSED },
    });

    this.logger.warn(`Demande de suppression enregistrée pour ${userId} (Effacement programmé le ${gracePeriodEndAt.toLocaleDateString("fr-FR")})`);

    return {
      success: true,
      requestId: deletionRequest.id,
      gracePeriodEndAt,
      message: `Votre demande d'effacement a été prise en compte. Conformément à notre politique, vous disposez d'un délai de grâce de 14 jours (jusqu'au ${gracePeriodEndAt.toLocaleDateString("fr-FR")}) pour vous reconnecter et annuler cette action.`,
    };
  }

  /**
   * Rétractation / Annulation d'une demande de suppression pendant le délai de 14 jours
   */
  async cancelAccountDeletion(userId: string) {
    const pendingRequest = await this.prisma.accountDeletionRequest.findFirst({
      where: { userId, status: RequestProcessStatus.PENDING },
    });

    if (!pendingRequest) {
      throw new BadRequestException("Aucune demande de suppression en attente pour ce compte.");
    }

    await this.prisma.accountDeletionRequest.update({
      where: { id: pendingRequest.id },
      data: {
        status: RequestProcessStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    // Réactivation du compte
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: AccountStatus.ACTIVE },
    });

    this.logger.log(`Suppression de compte annulée par l'utilisateur ${userId}. Compte réactivé.`);

    return {
      success: true,
      message: "Ravi de vous revoir ! Votre demande de suppression a été annulée et votre profil est de nouveau actif.",
    };
  }
}
