import { Test, TestingModule } from "@nestjs/testing";
import { AdminService } from "./admin.service";
import { PrismaService } from "../database/prisma.service";
import { AccountStatus, RoleType } from "@belle-ame/shared-types";

describe("AdminService", () => {
  let service: AdminService;

  const mockPrismaService = {
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    match: {
      count: jest.fn(),
    },
    conversation: {
      count: jest.fn(),
    },
    report: {
      count: jest.fn(),
    },
    subscription: {
      count: jest.fn(),
    },
    payment: {
      aggregate: jest.fn(),
    },
    userSession: {
      updateMany: jest.fn(),
    },
    userRole: {
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
    adminAuditLog: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  describe("Tableau de bord et KPIs exécutifs", () => {
    it("doit calculer les KPIs (taux de vérification, conversion WhatsApp, chiffre d'affaires)", async () => {
      mockPrismaService.user.count
        .mockResolvedValueOnce(1500) // totalInscriptions
        .mockResolvedValueOnce(1420) // activeAccounts
        .mockResolvedValueOnce(1350); // verifiedAccounts
      mockPrismaService.match.count.mockResolvedValue(420);
      mockPrismaService.conversation.count.mockResolvedValue(380);
      mockPrismaService.report.count.mockResolvedValue(5);
      mockPrismaService.subscription.count.mockResolvedValue(180);
      mockPrismaService.payment.aggregate.mockResolvedValue({
        _sum: { amountInCents: 450000000 }, // 4 500 000 FCFA
      });

      const kpis = await service.getDashboardKPIs();

      expect(kpis.totalInscriptions).toBe(1500);
      expect(kpis.verifiedAccounts).toBe(1350);
      expect(kpis.verifiedPercentage).toBe(90); // 1350/1500 = 90%
      expect(kpis.totalRevenueInFcfa).toBe(4500000);
      expect(kpis.whatsappConversionRate).toBe(16.7); // 1500 / 9000 = 16.7%
    });
  });

  describe("Gestion des utilisateurs et révocation des sessions", () => {
    it("doit bannir un utilisateur, révoquer toutes ses sessions et émettre un audit log", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "target-bad-user",
        status: AccountStatus.ACTIVE,
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.userSession.updateMany.mockResolvedValue({ count: 2 });
      mockPrismaService.adminAuditLog.create.mockResolvedValue({});

      const res = await service.updateUserStatus(
        "admin-1",
        "target-bad-user",
        AccountStatus.BANNED,
        "Usurpation d'identité constatée",
        "10.0.0.5",
      );

      expect(res.success).toBe(true);
      expect(res.newStatus).toBe(AccountStatus.BANNED);
      // Vérifie la révocation des sessions
      expect(mockPrismaService.userSession.updateMany).toHaveBeenCalledWith({
        where: { userId: "target-bad-user", isRevoked: false },
        data: { isRevoked: true },
      });
      // Vérifie la trace d'audit
      expect(mockPrismaService.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "USER_STATUS_CHANGE_BANNED",
            adminId: "admin-1",
          }),
        }),
      );
    });

    it("doit masquer les clés KYC brutes pour le rôle CUSTOMER_SUPPORT lors de la consultation", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "target-view",
        phoneNumber: "+237699000000",
        verificationRequests: [
          {
            documents: [{ encryptedStorageKey: "kyc/target/secret_cni.enc" }],
          },
        ],
      });
      mockPrismaService.adminAuditLog.create.mockResolvedValue({});

      const user = await service.getUserDetails(
        "agent-support",
        RoleType.CUSTOMER_SUPPORT,
        "target-view",
        "127.0.0.1",
      );

      expect(user.verificationRequests[0]?.documents[0]?.encryptedStorageKey).toBe(
        "[MASQUÉ_POUR_LE_SUPPORT_CLIENT]",
      );
      expect(mockPrismaService.adminAuditLog.create).toHaveBeenCalled();
    });
  });

  describe("Attribution des rôles par le Super Admin", () => {
    it("doit attribuer un rôle administratif et tracer l'événement", async () => {
      mockPrismaService.userRole.upsert.mockResolvedValue({});
      mockPrismaService.adminAuditLog.create.mockResolvedValue({});

      const res = await service.assignUserRole(
        "superadmin-1",
        "new-mod-user",
        RoleType.MODERATOR,
        "ADD",
        "127.0.0.1",
      );

      expect(res.success).toBe(true);
      expect(mockPrismaService.userRole.upsert).toHaveBeenCalled();
      expect(mockPrismaService.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "ROLE_ADD_MODERATOR",
          }),
        }),
      );
    });
  });
});
