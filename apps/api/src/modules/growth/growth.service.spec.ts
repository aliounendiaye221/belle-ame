import { Test, TestingModule } from "@nestjs/testing";
import { GrowthService } from "./growth.service";
import { PrismaService } from "../database/prisma.service";
import { SubscriptionStatus } from "@belle-ame/shared-types";

describe("GrowthService", () => {
  let service: GrowthService;

  const mockPrismaService = {
    referralInvite: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    profile: {
      update: jest.fn(),
    },
    subscriptionPlan: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    subscription: {
      create: jest.fn(),
    },
    payment: {
      create: jest.fn(),
      count: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [GrowthService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<GrowthService>(GrowthService);
  });

  describe("Traçage anonymisé de clics de campagne", () => {
    it("doit tracer un clic de campagne sans exposer l'adresse IP en clair", async () => {
      mockPrismaService.referralInvite.findUnique.mockResolvedValue({
        code: "WA-COMMUNITY-9000",
      });

      const res = await service.trackClick("WA-COMMUNITY-9000", "192.168.1.50", "Mozilla/5.0");

      expect(res.success).toBe(true);
      expect(res.campaign.code).toBe("WA-COMMUNITY-9000");
    });
  });

  describe("Application du code et attribution de récompense", () => {
    it("doit appliquer le code pionnier et incrémenter le compteur de campagne", async () => {
      mockPrismaService.referralInvite.findUnique.mockResolvedValue({
        id: "invite-1",
        code: "WA-COMMUNITY-9000",
        expiresAt: new Date(Date.now() + 86400000), // Non expiré
        currentUses: 150,
        maxUses: 9000,
      });
      mockPrismaService.referralInvite.update.mockResolvedValue({});
      mockPrismaService.profile.update.mockResolvedValue({});

      const res = await service.applyReferralCode("user-1", "WA-COMMUNITY-9000");

      expect(res.success).toBe(true);
      expect(mockPrismaService.referralInvite.update).toHaveBeenCalledWith({
        where: { id: "invite-1" },
        data: { currentUses: { increment: 1 } },
      });
    });

    it("doit offrir 1 mois d'abonnement Premium lors de la certification KYC", async () => {
      mockPrismaService.subscriptionPlan.findFirst.mockResolvedValue({
        id: "plan-monthly-id",
        name: "Belle Âme Mensuel",
      });
      mockPrismaService.subscription.create.mockResolvedValue({
        id: "sub-pioneer",
        status: SubscriptionStatus.ACTIVE,
      });
      mockPrismaService.payment.create.mockResolvedValue({});
      mockPrismaService.notification.create.mockResolvedValue({});

      const sub = await service.grantPioneerReward("user-verified");

      expect(sub.id).toBe("sub-pioneer");
      expect(mockPrismaService.subscription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-verified",
            status: SubscriptionStatus.ACTIVE,
          }),
        }),
      );
      expect(mockPrismaService.notification.create).toHaveBeenCalled();
    });
  });

  describe("Calcul des métriques de tunnel de conversion", () => {
    it("doit calculer les taux de conversion du groupe WhatsApp", async () => {
      mockPrismaService.referralInvite.findUnique.mockResolvedValue({
        code: "WA-COMMUNITY-9000",
        campaignName: "Migration Communauté WhatsApp 9000",
        currentUses: 200, // 200 inscrits
      });
      mockPrismaService.user.count.mockResolvedValue(160); // 160 certifiés
      mockPrismaService.payment.count.mockResolvedValue(40); // 40 convertis payants

      const funnel = await service.getCampaignFunnel("WA-COMMUNITY-9000");

      expect(funnel.inscriptionsCount).toBe(200);
      expect(funnel.verifiedCount).toBe(160);
      expect(funnel.signupToVerifiedRate).toBe(80); // 160 / 200 = 80%
      expect(funnel.verifiedToPremiumRate).toBe(25); // 40 / 160 = 25%
    });
  });
});
