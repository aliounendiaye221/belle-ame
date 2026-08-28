import { Test, TestingModule } from "@nestjs/testing";
import { MatchingService } from "./matching.service";
import { PrismaService } from "../database/prisma.service";
import { ForbiddenException, BadRequestException } from "@nestjs/common";

describe("MatchingService", () => {
  let service: MatchingService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    subscription: {
      findFirst: jest.fn(),
    },
    like: {
      count: jest.fn(),
      upsert: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
    block: {
      findMany: jest.fn(),
    },
    match: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    conversation: {
      upsert: jest.fn(),
    },
    notification: {
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
  });

  describe("Calculs mathématiques de similarité et score déterministe", () => {
    it("doit calculer correctement l'indice de Jaccard", () => {
      // 2 valeurs communes sur 4 au total = 50%
      const setA = ["Foi", "Respect", "Famille"];
      const setB = ["Travail", "Respect", "Famille"];

      const score = service.calculateJaccardScore(setA, setB);
      expect(score).toBe(50);
    });

    it("doit retourner 100 pour des ensembles identiques", () => {
      const score = service.calculateJaccardScore(["Foi", "Respect"], ["respect", "foi"]);
      expect(score).toBe(100);
    });

    it("doit attribuer un score de compatibilité élevé pour deux profils en phase dans la même ville", () => {
      const viewer = {
        calculatedAge: 28,
        city: "Douala",
        country: "CM",
        personalValues: ["Foi", "Respect", "Famille"],
        interests: ["Musique", "Voyages"],
        completionRate: 100,
        isVerifiedBadge: true,
        minAge: 24,
        maxAge: 35,
      };

      const candidate = {
        calculatedAge: 30,
        city: "Douala",
        country: "CM",
        personalValues: ["Foi", "Respect", "Famille"],
        interests: ["Musique", "Voyages"],
        completionRate: 100,
        isVerifiedBadge: true,
        lastActiveAt: new Date(),
        minAge: 25,
        maxAge: 32,
      };

      const { totalScore, breakdown } = service.calculateCompatibilityScore(viewer, candidate);

      expect(totalScore).toBeGreaterThanOrEqual(95);
      expect(breakdown.geoScore).toBe(100);
      expect(breakdown.ageScore).toBe(100);
      expect(breakdown.verificationBonus).toBe(5);
    });
  });

  describe("Quotas quotidiens de coups de cœur", () => {
    it("doit bloquer le 11ème like pour un compte gratuit (quota max 10/jour)", async () => {
      mockPrismaService.subscription.findFirst.mockResolvedValue(null); // Compte Free
      mockPrismaService.like.count.mockResolvedValue(10); // Déjà 10 likes aujourd'hui

      await expect(service.sendLike("sender-1", "target-1")).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("doit interdire d'envoyer un coup de cœur à soi-même", async () => {
      await expect(service.sendLike("user-same", "user-same")).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("Création de match mutuel et ouverture de conversation", () => {
    it("doit enregistrer un like simple si le destinataire n'a pas encore liké", async () => {
      mockPrismaService.subscription.findFirst.mockResolvedValue(null);
      mockPrismaService.like.count.mockResolvedValue(2);
      mockPrismaService.like.upsert.mockResolvedValue({});
      mockPrismaService.like.findUnique.mockResolvedValue(null); // Pas de like réciproque

      const res = await service.sendLike("user-a", "user-b");

      expect(res.isMatch).toBe(false);
      expect(mockPrismaService.match.upsert).not.toHaveBeenCalled();
    });

    it("doit créer un match, une conversation et des notifications si le like est réciproque", async () => {
      mockPrismaService.subscription.findFirst.mockResolvedValue(null);
      mockPrismaService.like.count.mockResolvedValue(2);
      mockPrismaService.like.upsert.mockResolvedValue({});
      mockPrismaService.like.findUnique.mockResolvedValue({ id: "like-reciprocal" }); // Match réciproque présent !
      mockPrismaService.like.updateMany.mockResolvedValue({});
      mockPrismaService.match.upsert.mockResolvedValue({ id: "match-uuid-123" });
      mockPrismaService.conversation.upsert.mockResolvedValue({ id: "conv-uuid-456" });
      mockPrismaService.notification.createMany.mockResolvedValue({});

      const res = await service.sendLike("user-a", "user-b");

      expect(res.isMatch).toBe(true);
      expect(res.matchId).toBe("match-uuid-123");
      expect(res.conversationId).toBe("conv-uuid-456");
      expect(mockPrismaService.conversation.upsert).toHaveBeenCalled();
      expect(mockPrismaService.notification.createMany).toHaveBeenCalled();
    });
  });

  describe("Annulation de match", () => {
    it("doit désactiver le match et fermer la conversation", async () => {
      mockPrismaService.match.findUnique.mockResolvedValue({
        id: "match-1",
        user1Id: "user-a",
        user2Id: "user-b",
      });
      mockPrismaService.match.update.mockResolvedValue({});

      const res = await service.cancelMatch("user-a", "match-1");

      expect(res.success).toBe(true);
      expect(mockPrismaService.match.update).toHaveBeenCalledWith({
        where: { id: "match-1" },
        data: { isActive: false, cancelledById: "user-a" },
      });
    });
  });
});
