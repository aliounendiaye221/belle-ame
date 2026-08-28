import { Test, TestingModule } from "@nestjs/testing";
import { ComplianceService } from "./compliance.service";
import { PrismaService } from "../database/prisma.service";
import { AccountStatus, RequestProcessStatus } from "@belle-ame/shared-types";

describe("ComplianceService", () => {
  let service: ComplianceService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    dataExportRequest: {
      create: jest.fn(),
    },
    accountDeletionRequest: {
      upsert: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplianceService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<ComplianceService>(ComplianceService);
  });

  describe("Exportation des données personnelles (Droit d'accès RGPD)", () => {
    it("doit compiler une archive complète sans divulguer de secrets", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "user-export-1",
        phoneNumber: "+237699112233",
        email: "member@example.com",
        status: AccountStatus.ACTIVE,
        isIdentityVerified: true,
        createdAt: new Date(),
        profile: { firstName: "Awa", city: "Cotonou", photos: [], interests: [] },
        sessions: [],
        devices: [],
        sentMessages: [],
        payments: [],
        subscriptions: [],
        notificationPreferences: [],
      });
      mockPrismaService.dataExportRequest.create.mockResolvedValue({
        id: "export-req-1",
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      });

      const res = await service.exportUserData("user-export-1");

      expect(res.exportId).toBe("export-req-1");
      expect(res.data.account.phoneNumber).toBe("+237699112233");
      expect(res.data.profile?.firstName).toBe("Awa");
      expect(mockPrismaService.dataExportRequest.create).toHaveBeenCalled();
    });
  });

  describe("Suppression de compte et délai de grâce de 14 jours", () => {
    it("doit planifier la suppression à J+14 et mettre le compte en statut PAUSED", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: "user-del-1" });
      mockPrismaService.accountDeletionRequest.upsert.mockResolvedValue({ id: "del-req-1" });
      mockPrismaService.user.update.mockResolvedValue({});

      const res = await service.requestAccountDeletion("user-del-1", "Déménagement");

      expect(res.success).toBe(true);
      expect(res.requestId).toBe("del-req-1");
      expect(mockPrismaService.accountDeletionRequest.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-del-1" },
          create: expect.objectContaining({ status: RequestProcessStatus.PENDING }),
        }),
      );
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: "user-del-1" },
        data: { status: AccountStatus.PAUSED },
      });
    });

    it("doit permettre l'annulation de la suppression pendant les 14 jours et réactiver le compte", async () => {
      mockPrismaService.accountDeletionRequest.findFirst.mockResolvedValue({
        id: "del-req-2",
        userId: "user-del-2",
        status: RequestProcessStatus.PENDING,
      });
      mockPrismaService.accountDeletionRequest.update.mockResolvedValue({});
      mockPrismaService.user.update.mockResolvedValue({});

      const res = await service.cancelAccountDeletion("user-del-2");

      expect(res.success).toBe(true);
      expect(mockPrismaService.accountDeletionRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "del-req-2" },
          data: expect.objectContaining({ status: RequestProcessStatus.CANCELLED }),
        }),
      );
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: "user-del-2" },
        data: { status: AccountStatus.ACTIVE },
      });
    });
  });
});
