import { Test, TestingModule } from "@nestjs/testing";
import { ProfilesService } from "./profiles.service";
import { PrismaService } from "../database/prisma.service";
import { MediaService } from "../media/media.service";
import { PhotoModerationStatus, Gender, FamilyStatus } from "@belle-ame/shared-types";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("ProfilesService", () => {
  let service: ProfilesService;

  const mockPrismaService = {
    profile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    block: {
      findFirst: jest.fn(),
    },
    profileView: {
      upsert: jest.fn(),
    },
    preference: {
      upsert: jest.fn(),
    },
    photo: {
      create: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    adminAuditLog: {
      create: jest.fn(),
    },
  };

  const mockMediaService = {
    processProfilePhoto: jest.fn().mockResolvedValue({
      originalStorageKey: "photos/u1/p1.webp",
      publicUrl: "http://cdn/p1.webp",
      thumbnailUrl: "http://cdn/p1_thumb.webp",
      mimeType: "image/webp",
      fileSizeBytes: 200000,
      width: 800,
      height: 1000,
      exifStripped: true,
    }),
    automatedSafetyCheck: jest.fn().mockResolvedValue({ isSafe: true }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MediaService, useValue: mockMediaService },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  describe("Calcul déterministe du taux de complétion", () => {
    it("doit calculer correctement un profil minimal (nom, âge, ville = 35%)", () => {
      const rate = service.calculateCompletionRate({
        firstName: "Sophie",
        birthDate: new Date("1994-01-01"),
        city: "Douala",
      });
      expect(rate).toBe(35);
    });

    it("doit attribuer 100% pour un profil complet avec bio, valeurs, centres d'intérêt et photo", () => {
      const rate = service.calculateCompletionRate({
        firstName: "Sophie",
        birthDate: new Date("1994-01-01"),
        city: "Cotonou",
        bio: "Passionnée d'art et de culture africaine, en quête d'un partenariat sérieux pour bâtir un foyer.",
        personalValues: ["Respect", "Foi", "Travail"],
        interestsCount: 3,
        occupation: "Architecte",
        educationLevel: "Master",
        familyStatus: FamilyStatus.SINGLE_NO_CHILDREN,
        photosCount: 3,
      });
      expect(rate).toBe(100);
    });
  });

  describe("Formatage respectueux de la vie privée de la dernière activité", () => {
    it("doit afficher 'En ligne' pour une activité de moins de 15 minutes", () => {
      const recent = new Date(Date.now() - 5 * 60 * 1000);
      expect(service.formatPrivacyFriendlyLastActive(recent)).toBe("En ligne");
    });

    it("doit afficher 'Actif aujourd'hui' pour une activité de 4 heures", () => {
      const today = new Date(Date.now() - 4 * 60 * 60 * 1000);
      expect(service.formatPrivacyFriendlyLastActive(today)).toBe("Actif aujourd'hui");
    });

    it("doit afficher 'Actif cette semaine' pour une activité de 3 jours", () => {
      const thisWeek = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(service.formatPrivacyFriendlyLastActive(thisWeek)).toBe("Actif cette semaine");
    });
  });

  describe("Consultation de profil public", () => {
    it("doit rejeter l'accès si un blocage est actif entre les utilisateurs", async () => {
      mockPrismaService.block.findFirst.mockResolvedValue({ id: "block-1" });

      await expect(service.getPublicProfile("target-1", "viewer-1")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("ne doit retourner que les photos approuvées par la modération", async () => {
      mockPrismaService.block.findFirst.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "target-2",
        lastActiveAt: new Date(),
        profile: {
          id: "prof-2",
          firstName: "Jean",
          calculatedAge: 32,
          gender: Gender.MALE,
          city: "Abidjan",
          country: "CI",
          personalValues: ["Sincérité"],
          completionRate: 85,
          isVerifiedBadge: true,
          photos: [
            { id: "ph-1", url: "url-1", thumbnailUrl: "thumb-1", isMain: true, order: 0 },
          ],
          interests: [],
        },
      });
      mockPrismaService.profileView.upsert.mockResolvedValue({});

      const publicProfile = await service.getPublicProfile("target-2", "viewer-2");

      expect(publicProfile.firstName).toBe("Jean");
      expect(publicProfile.photos.length).toBe(1);
      expect(publicProfile.lastActiveStatus).toBe("En ligne");
      expect(mockPrismaService.profileView.upsert).toHaveBeenCalled();
    });
  });

  describe("Gestion des photos", () => {
    it("doit rejeter l'ajout au-delà du quota maximum de 6 photos", async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue({
        id: "prof-3",
        photos: [{}, {}, {}, {}, {}, {}], // Déjà 6 photos
      });

      const buffer = Buffer.from("dummy-image-data");

      await expect(service.addPhoto("user-3", buffer, "image/jpeg")).rejects.toThrow(
        BadRequestException,
      );
    });

    it("doit interdire de définir une photo non approuvée comme photo principale", async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue({
        id: "prof-4",
        photos: [{ id: "photo-pending", moderationStatus: PhotoModerationStatus.PENDING }],
      });

      await expect(service.setMainPhoto("user-4", "photo-pending")).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
