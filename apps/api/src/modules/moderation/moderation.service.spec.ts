import { Test, TestingModule } from "@nestjs/testing";
import { ModerationService } from "./moderation.service";
import { FraudDetectionService } from "./services/fraud-detection.service";
import { PrismaService } from "../database/prisma.service";
import { ReportCategory, ModActionType, AccountStatus, ModerationStatus } from "@belle-ame/shared-types";
import { BadRequestException } from "@nestjs/common";

describe("ModerationService", () => {
  let service: ModerationService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    userSession: {
      updateMany: jest.fn(),
    },
    report: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    block: {
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
    match: {
      updateMany: jest.fn(),
    },
    photo: {
      updateMany: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    moderationCase: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    moderationAction: {
      create: jest.fn(),
    },
    adminAuditLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationService,
        FraudDetectionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ModerationService>(ModerationService);
  });

  describe("Création de signalement et blocage automatique", () => {
    it("doit refuser qu'un utilisateur se signale lui-même", async () => {
      await expect(
        service.createReport("user-same", {
          reportedUserId: "user-same",
          category: ReportCategory.INAPPROPRIATE_PROFILE,
          description: "Test description valide avec plus de 10 caractères",
          evidenceUrls: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("doit créer un signalement avec SLA < 24h et bloquer automatiquement la cible", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "target-user",
        createdAt: new Date(Date.now() - 48 * 3600 * 1000),
        isIdentityVerified: true,
        status: AccountStatus.ACTIVE,
      });
      mockPrismaService.report.count.mockResolvedValue(0);
      mockPrismaService.report.create.mockResolvedValue({
        id: "report-123",
        priority: "MEDIUM",
        moderationCase: { id: "case-123" },
      });
      mockPrismaService.block.upsert.mockResolvedValue({ id: "block-1" });
      mockPrismaService.match.updateMany.mockResolvedValue({});

      const response = await service.createReport("reporter-user", {
        reportedUserId: "target-user",
        category: ReportCategory.INAPPROPRIATE_PROFILE,
        description: "Comportement déplacé constaté lors des échanges",
        evidenceUrls: [],
      });

      expect(response.success).toBe(true);
      expect(response.reportId).toBe("report-123");
      expect(mockPrismaService.block.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            blockerId_blockedId: { blockerId: "reporter-user", blockedId: "target-user" },
          },
        }),
      );
    });
  });

  describe("Exécution des actions graduées de modération", () => {
    it("doit bannir un compte, révoquer ses sessions et journaliser l'audit", async () => {
      mockPrismaService.moderationCase.findUnique.mockResolvedValue({
        id: "case-999",
        report: { id: "rep-999", reportedUserId: "fraudster-user" },
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.userSession.updateMany.mockResolvedValue({});
      mockPrismaService.moderationAction.create.mockResolvedValue({ id: "action-1" });
      mockPrismaService.adminAuditLog.create.mockResolvedValue({});
      mockPrismaService.report.update.mockResolvedValue({});

      const res = await service.executeModerationAction(
        "mod-1",
        "10.0.0.1",
        "case-999",
        ModActionType.ACCOUNT_BANNED,
        "Tentative avérée de broutage et sollicitation financière",
      );

      expect(res.success).toBe(true);
      expect(res.status).toBe(ModerationStatus.RESOLVED);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: "fraudster-user" },
        data: { status: AccountStatus.BANNED },
      });
      expect(mockPrismaService.userSession.updateMany).toHaveBeenCalledWith({
        where: { userId: "fraudster-user" },
        data: { isRevoked: true },
      });
      expect(mockPrismaService.adminAuditLog.create).toHaveBeenCalled();
    });
  });
});
