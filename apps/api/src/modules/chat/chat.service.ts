import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { MessageStatus, NotificationType, NotificationChannel, PhotoModerationStatus } from "@belle-ame/shared-types";

export interface ConversationSummary {
  id: string;
  matchId: string;
  lastMessageAt?: Date | null;
  unreadCount: number;
  partner: {
    id: string;
    firstName: string;
    calculatedAge?: number;
    city?: string;
    mainPhotoUrl?: string;
    isVerifiedBadge: boolean;
  };
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    status: MessageStatus;
  } | null;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  // Mots-clés de détection heuristique anti-fraude (sollicitations financières / broutage)
  private readonly FRAUD_REGEX =
    /\b(western\s+union|moneygram|orange\s+money|wave|mtn\s+momo|virement|dépannage|dépanner|urgences?\s+médicale|envoyer\s+de\s+l'argent|prêter\s+de\s+l'argent)\b/i;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Analyse du contenu pour détecter les sollicitations financières suspectes
   */
  public analyzeContentForFraud(content: string): { isSuspicious: boolean; keyword?: string } {
    const match = this.FRAUD_REGEX.exec(content);
    if (match && match[0]) {
      return { isSuspicious: true, keyword: match[0] };
    }
    return { isSuspicious: false };
  }

  /**
   * Récupère la liste des conversations actives d'un membre
   */
  async getConversations(userId: string): Promise<ConversationSummary[]> {
    const memberships = await this.prisma.conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            match: {
              include: {
                user1: {
                  include: {
                    profile: {
                      select: {
                        firstName: true,
                        calculatedAge: true,
                        city: true,
                        isVerifiedBadge: true,
                        photos: { where: { isMain: true, moderationStatus: PhotoModerationStatus.APPROVED }, take: 1 },
                      },
                    },
                  },
                },
                user2: {
                  include: {
                    profile: {
                      select: {
                        firstName: true,
                        calculatedAge: true,
                        city: true,
                        isVerifiedBadge: true,
                        photos: { where: { isMain: true, moderationStatus: PhotoModerationStatus.APPROVED }, take: 1 },
                      },
                    },
                  },
                },
              },
            },
            messages: {
              where: { isDeleted: false },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { conversation: { lastMessageAt: "desc" } },
    });

    const activeConversations = memberships.filter(
      (m) => m.conversation.match.isActive && !m.conversation.match.cancelledById,
    );

    return Promise.all(
      activeConversations.map(async (m) => {
        const conv = m.conversation;
        const partner = conv.match.user1Id === userId ? conv.match.user2 : conv.match.user1;
        const lastMsg = conv.messages[0];

        // Calcul des messages non lus
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: partner.id,
            status: { in: [MessageStatus.SENT, MessageStatus.DELIVERED] },
            isDeleted: false,
          },
        });

        return {
          id: conv.id,
          matchId: conv.matchId,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
          partner: {
            id: partner.id,
            firstName: partner.profile?.firstName || "Membre",
            calculatedAge: partner.profile?.calculatedAge,
            city: partner.profile?.city,
            mainPhotoUrl: partner.profile?.photos[0]?.url,
            isVerifiedBadge: partner.profile?.isVerifiedBadge || false,
          },
          lastMessage: lastMsg
            ? {
                id: lastMsg.id,
                content: lastMsg.content,
                senderId: lastMsg.senderId,
                createdAt: lastMsg.createdAt,
                status: lastMsg.status as unknown as MessageStatus,
              }
            : null,
        };
      }),
    );
  }

  /**
   * Récupère l'historique paginé par curseur temporel
   */
  async getMessages(
    userId: string,
    conversationId: string,
    cursor?: string,
    limit = 30,
  ) {
    // 1. Vérification que l'utilisateur est bien membre de la conversation
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      include: {
        conversation: {
          include: { match: true },
        },
      },
    });

    if (!member) {
      throw new ForbiddenException("Accès refusé : vous ne faites pas partie de cette conversation.");
    }

    if (!member.conversation.match.isActive) {
      throw new ForbiddenException({
        code: "CHAT_MATCH_CANCELLED",
        message: "Cette conversation est fermée car le match a été rompu.",
      });
    }

    // 2. Pagination par curseur
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      include: { attachments: true },
    });

    const hasMore = messages.length > limit;
    const items = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = items.length > 0 ? items[items.length - 1]?.createdAt.toISOString() : null;

    // Remplacement du texte pour les messages supprimés logiquement
    const sanitized = items.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      content: msg.isDeleted ? "Ce message a été supprimé." : msg.content,
      status: msg.status,
      isDeleted: msg.isDeleted,
      deliveredAt: msg.deliveredAt,
      readAt: msg.readAt,
      createdAt: msg.createdAt,
      attachments: msg.isDeleted ? [] : msg.attachments,
    }));

    return {
      messages: sanitized.reverse(), // Ordre chronologique pour l'affichage
      nextCursor,
      hasMore,
    };
  }

  /**
   * Envoi d'un message avec contrôle d'accord mutuel et analyse heuristique
   */
  async sendMessage(senderId: string, conversationId: string, content: string) {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new BadRequestException("Le message ne peut pas être vide.");
    }

    // 1. Vérification du membership et du statut du match
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId: senderId } },
      include: {
        conversation: {
          include: {
            match: true,
            members: true,
          },
        },
      },
    });

    if (!member) {
      throw new ForbiddenException("Vous ne faites pas partie de cette conversation.");
    }

    if (!member.conversation.match.isActive) {
      throw new ForbiddenException({
        code: "CHAT_NO_ACTIVE_MATCH",
        message: "Impossible d'envoyer un message sans match mutuel actif.",
      });
    }

    // 2. Vérification des blocages
    const recipientMember = member.conversation.members.find((m) => m.userId !== senderId);
    if (!recipientMember) {
      throw new BadRequestException("Destinataire introuvable dans cette conversation.");
    }

    const recipientId = recipientMember.userId;

    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedId: recipientId },
          { blockerId: recipientId, blockedId: senderId },
        ],
      },
    });

    if (block) {
      throw new ForbiddenException({
        code: "CHAT_USER_BLOCKED",
        message: "La communication avec ce membre est bloquée.",
      });
    }

    // 3. Détection heuristique anti-fraude (sollicitations financières)
    const fraudCheck = this.analyzeContentForFraud(trimmedContent);
    if (fraudCheck.isSuspicious) {
      this.logger.warn(
        `🚨 ALERTE SÉCURITÉ : Mot-clé suspect détecté [${fraudCheck.keyword}] dans message de ${senderId} vers ${recipientId}`,
      );
      // Enregistrement d'un journal d'audit de sécurité
      await this.prisma.adminAuditLog.create({
        data: {
          adminId: senderId, // Tracé au nom de l'émetteur
          action: "FRAUD_KEYWORD_TRIGGERED",
          entityType: "Message",
          entityId: conversationId,
          metadata: {
            keyword: fraudCheck.keyword,
            preview: trimmedContent.substring(0, 100),
          },
        },
      });
    }

    // 4. Enregistrement du message dans PostgreSQL
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: trimmedContent,
        status: MessageStatus.SENT,
      },
    });

    // 5. Mise à jour de la date du dernier message de la conversation
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // 6. Création d'une notification in-app pour le destinataire
    await this.prisma.notification.create({
      data: {
        userId: recipientId,
        type: NotificationType.NEW_MESSAGE,
        channel: NotificationChannel.IN_APP,
        title: "Nouveau message reçu",
        body: trimmedContent.length > 50 ? `${trimmedContent.substring(0, 47)}...` : trimmedContent,
        metadata: { conversationId, messageId: message.id },
      },
    });

    return message;
  }

  /**
   * Marquer les messages d'une conversation comme lus
   */
  async markMessagesAsRead(userId: string, conversationId: string): Promise<number> {
    const readAt = new Date();

    const updated = await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        status: { in: [MessageStatus.SENT, MessageStatus.DELIVERED] },
      },
      data: {
        status: MessageStatus.READ,
        readAt,
      },
    });

    await this.prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: readAt },
    });

    return updated.count;
  }

  /**
   * Suppression logique d'un message (Soft Delete pour conformité légale et modération)
   */
  async deleteMessage(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });

    if (!message) {
      throw new NotFoundException("Message introuvable.");
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException("Vous ne pouvez supprimer que vos propres messages.");
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return { success: true, message: "Message supprimé avec succès." };
  }
}
