import { Test, TestingModule } from "@nestjs/testing";
import { NotificationsService } from "./notifications.service";
import { PrismaService } from "../database/prisma.service";
import { MockPushProvider } from "./providers/mock-push.provider";
import { MockEmailProvider } from "./providers/mock-email.provider";
import { NotificationType } from "@belle-ame/shared-types";

describe("NotificationsService", () => {
  let service: NotificationsService;
  let pushProvider: MockPushProvider;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    notificationPreference: {
      upsert: jest.fn(),
    },
    device: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        MockPushProvider,
        MockEmailProvider,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    pushProvider = module.get<MockPushProvider>(MockPushProvider);
  });

  describe("Envoi et routage multi-canaux", () => {
    it("doit créer la notification in-app et émettre un push si autorisé", async () => {
      mockPrismaService.notification.create.mockResolvedValue({
        id: "notif-1",
        title: "C'est un Match !",
        body: "Vous avez un coup de cœur partagé.",
      });
      mockPrismaService.notificationPreference.upsert.mockResolvedValue({
        allowPushMatch: true,
        allowPushMessage: true,
        allowEmailDigest: false,
        allowSmsSecurity: true,
      });
      mockPrismaService.device.findMany.mockResolvedValue([
        { fcmToken: "fcm-token-device-xyz" },
      ]);
      mockPrismaService.user.findUnique.mockResolvedValue({
        email: "user@test.com",
        phoneNumber: "+237699001122",
      });

      const notif = await service.notify(
        "user-1",
        NotificationType.NEW_MATCH,
        "C'est un Match !",
        "Vous avez un coup de cœur partagé.",
      );

      expect(notif.id).toBe("notif-1");
      expect(mockPrismaService.notification.create).toHaveBeenCalled();
      // Vérifie que le push a été envoyé
      expect(pushProvider.sentPushList.length).toBe(1);
      expect(pushProvider.sentPushList[0]?.fcmToken).toBe("fcm-token-device-xyz");
    });

    it("ne doit pas émettre de push si l'utilisateur a désactivé la préférence", async () => {
      mockPrismaService.notification.create.mockResolvedValue({ id: "notif-2" });
      mockPrismaService.notificationPreference.upsert.mockResolvedValue({
        allowPushMatch: false, // Désactivé !
        allowPushMessage: true,
        allowEmailDigest: false,
      });
      mockPrismaService.device.findMany.mockResolvedValue([
        { fcmToken: "fcm-token-device-xyz" },
      ]);
      mockPrismaService.user.findUnique.mockResolvedValue({ email: null });

      await service.notify(
        "user-2",
        NotificationType.NEW_MATCH,
        "Nouveau Match",
        "Texte",
      );

      expect(pushProvider.sentPushList.length).toBe(0);
    });

    it("doit protéger les alertes SMS de sécurité en forçant allowSmsSecurity: true", async () => {
      mockPrismaService.notificationPreference.upsert.mockResolvedValue({
        userId: "user-3",
        allowPushMatch: false,
        allowSmsSecurity: true,
      });

      const res = await service.updatePreferences("user-3", {
        allowPushMatch: false,
      });

      expect(mockPrismaService.notificationPreference.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ allowSmsSecurity: true }),
        }),
      );
    });
  });

  describe("Lecture et acquittement des notifications", () => {
    it("doit marquer une notification spécifique comme lue", async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        id: "notif-9",
        userId: "user-owner",
      });
      mockPrismaService.notification.update.mockResolvedValue({});

      await service.markAsRead("user-owner", "notif-9");

      expect(mockPrismaService.notification.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "notif-9" },
          data: expect.objectContaining({ isRead: true }),
        }),
      );
    });
  });
});
