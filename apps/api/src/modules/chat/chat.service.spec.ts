import { Test, TestingModule } from "@nestjs/testing";
import { ChatService } from "./chat.service";
import { PrismaService } from "../database/prisma.service";
import { ForbiddenException } from "@nestjs/common";
import { MessageStatus } from "@belle-ame/shared-types";

describe("ChatService", () => {
  let service: ChatService;

  const mockPrismaService = {
    conversationMember: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    conversation: {
      update: jest.fn(),
    },
    message: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
    },
    block: {
      findFirst: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    adminAuditLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  describe("Contrôle d'accès et sécurité de messagerie", () => {
    it("doit refuser l'envoi de message si le match n'est pas actif", async () => {
      mockPrismaService.conversationMember.findUnique.mockResolvedValue({
        conversation: {
          match: { isActive: false }, // Match inactif ou annulé !
          members: [{ userId: "sender-1" }, { userId: "recipient-1" }],
        },
      });

      await expect(
        service.sendMessage("sender-1", "conv-1", "Bonjour, comment vas-tu ?"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("doit refuser l'envoi de message si un blocage est actif entre les membres", async () => {
      mockPrismaService.conversationMember.findUnique.mockResolvedValue({
        conversation: {
          match: { isActive: true },
          members: [{ userId: "sender-1" }, { userId: "recipient-1" }],
        },
      });
      mockPrismaService.block.findFirst.mockResolvedValue({ id: "block-active" });

      await expect(
        service.sendMessage("sender-1", "conv-1", "Bonjour, comment vas-tu ?"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("doit détecter une tentative de sollicitation financière suspecte et enregistrer une alerte d'audit", async () => {
      mockPrismaService.conversationMember.findUnique.mockResolvedValue({
        conversation: {
          match: { isActive: true },
          members: [{ userId: "sender-1" }, { userId: "recipient-1" }],
        },
      });
      mockPrismaService.block.findFirst.mockResolvedValue(null);
      mockPrismaService.message.create.mockResolvedValue({
        id: "msg-1",
        content: "Peux-tu me faire un virement Orange Money en urgence médicale ?",
        status: MessageStatus.SENT,
      });
      mockPrismaService.conversation.update.mockResolvedValue({});
      mockPrismaService.notification.create.mockResolvedValue({});
      mockPrismaService.adminAuditLog.create.mockResolvedValue({});

      const suspiciousMessage = "Peux-tu me faire un virement Orange Money en urgence médicale ?";
      await service.sendMessage("sender-1", "conv-1", suspiciousMessage);

      // Vérifie qu'un log d'audit de fraude a été émis
      expect(mockPrismaService.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "FRAUD_KEYWORD_TRIGGERED",
          }),
        }),
      );
    });
  });

  describe("Gestion des accusés de réception et suppression logique", () => {
    it("doit marquer les messages reçus comme lus", async () => {
      mockPrismaService.message.updateMany.mockResolvedValue({ count: 4 });
      mockPrismaService.conversationMember.update.mockResolvedValue({});

      const count = await service.markMessagesAsRead("user-recipient", "conv-2");

      expect(count).toBe(4);
      expect(mockPrismaService.message.updateMany).toHaveBeenCalledWith({
        where: {
          conversationId: "conv-2",
          senderId: { not: "user-recipient" },
          status: { in: [MessageStatus.SENT, MessageStatus.DELIVERED] },
        },
        data: expect.objectContaining({ status: MessageStatus.READ }),
      });
    });

    it("doit effectuer une suppression logique (soft delete) sans détruire le message en base", async () => {
      mockPrismaService.message.findUnique.mockResolvedValue({
        id: "msg-99",
        senderId: "author-1",
      });
      mockPrismaService.message.update.mockResolvedValue({});

      const res = await service.deleteMessage("author-1", "msg-99");

      expect(res.success).toBe(true);
      expect(mockPrismaService.message.update).toHaveBeenCalledWith({
        where: { id: "msg-99" },
        data: expect.objectContaining({ isDeleted: true }),
      });
    });
  });
});
