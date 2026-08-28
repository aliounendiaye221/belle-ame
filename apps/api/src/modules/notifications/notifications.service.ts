import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { MockPushProvider } from "./providers/mock-push.provider";
import { MockEmailProvider } from "./providers/mock-email.provider";
import {
  NotificationType,
  NotificationChannel,
} from "@belle-ame/shared-types";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pushProvider: MockPushProvider,
    private readonly emailProvider: MockEmailProvider,
  ) {}

  /**
   * Envoi d'une notification multi-canaux respectant les préférences utilisateur
   */
  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    metadata?: any,
  ) {
    // 1. Création systématique de la notification In-App
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        channel: NotificationChannel.IN_APP,
        title,
        body,
        metadata: metadata || {},
      },
    });

    // 2. Récupération des préférences et des appareils enregistrés
    const [preferences, devices, user] = await Promise.all([
      this.getPreferences(userId),
      this.prisma.device.findMany({
        where: { userId, fcmToken: { not: null }, isTrusted: true },
        select: { fcmToken: true },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, phoneNumber: true },
      }),
    ]);

    // 3. Routage Push Mobile selon les préférences
    let shouldSendPush = false;
    if (type === NotificationType.NEW_MATCH && preferences.allowPushMatch) shouldSendPush = true;
    if (type === NotificationType.NEW_MESSAGE && preferences.allowPushMessage) shouldSendPush = true;
    if (
      [
        NotificationType.KYC_APPROVED,
        NotificationType.KYC_REJECTED,
        NotificationType.SUBSCRIPTION_CONFIRMED,
        NotificationType.REPORT_UPDATE,
      ].includes(type)
    ) {
      shouldSendPush = true;
    }

    if (shouldSendPush && devices.length > 0) {
      for (const d of devices) {
        if (d.fcmToken) {
          await this.pushProvider.sendPush(d.fcmToken, title, body, {
            type,
            notificationId: notification.id,
          });
        }
      }
    }

    // 4. Routage E-mail si configuré
    if (user?.email && preferences.allowEmailDigest && [NotificationType.SUBSCRIPTION_CONFIRMED, NotificationType.KYC_APPROVED].includes(type)) {
      const html = `<h2>${title}</h2><p>${body}</p><p>L'équipe « À Chacun Une Belle Âme »</p>`;
      await this.emailProvider.sendEmail(user.email, title, html);
    }

    return notification;
  }

  /**
   * Consultation des notifications In-App de l'utilisateur
   */
  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, unreadCount, items] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return { total, unreadCount, page, limit, items };
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(userId: string, notificationId: string) {
    const notif = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notif || notif.userId !== userId) {
      throw new NotFoundException("Notification introuvable.");
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Tout marquer comme lu
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { success: true, updatedCount: result.count };
  }

  /**
   * Récupération des préférences de notifications
   */
  async getPreferences(userId: string) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        allowPushMatch: true,
        allowPushMessage: true,
        allowEmailDigest: false,
        allowSmsSecurity: true, // Toujours actif par défaut
      },
    });
  }

  /**
   * Mise à jour des préférences (avec protection stricte des alertes de sécurité)
   */
  async updatePreferences(
    userId: string,
    dto: {
      allowPushMatch?: boolean;
      allowPushMessage?: boolean;
      allowEmailDigest?: boolean;
    },
  ) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        allowPushMatch: dto.allowPushMatch,
        allowPushMessage: dto.allowPushMessage,
        allowEmailDigest: dto.allowEmailDigest,
        allowSmsSecurity: true, // Non désactivable pour la sécurité du compte !
      },
      create: {
        userId,
        allowPushMatch: dto.allowPushMatch ?? true,
        allowPushMessage: dto.allowPushMessage ?? true,
        allowEmailDigest: dto.allowEmailDigest ?? false,
        allowSmsSecurity: true,
      },
    });
  }

  /**
   * Enregistrement du jeton Push Mobile FCM d'un appareil
   */
  async registerDeviceToken(userId: string, deviceFingerprint: string, fcmToken: string) {
    return this.prisma.device.upsert({
      where: {
        userId_deviceFingerprint: { userId, deviceFingerprint },
      },
      update: { fcmToken, updatedAt: new Date() },
      create: {
        userId,
        deviceFingerprint,
        fcmToken,
      },
    });
  }
}
