import { Test, TestingModule } from "@nestjs/testing";
import { VerificationService } from "./verification.service";
import { PrismaService } from "../database/prisma.service";
import { StorageService } from "../storage/storage.service";
import { MockKycProvider } from "./providers/mock-kyc.provider";
import { BadRequestException } from "@nestjs/common";
import { DocumentType, VerificationStatus, AccountStatus } from "@belle-ame/shared-types";

describe("VerificationService", () => {
  let service: VerificationService;
  let mockKycProvider: MockKycProvider;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    profile: {
      upsert: jest.fn(),
      update: jest.fn(),
    },
    verificationRequest: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
    verificationDocument: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    verificationDecision: {
      create: jest.fn(),
    },
    adminAuditLog: {
      create: jest.fn(),
    },
  };

  const mockStorageService = {
    getKycUploadSignedUrl: jest.fn().mockResolvedValue({
      uploadUrl: "http://localhost:9000/upload-doc-signed",
      storageKey: "kyc/user-1/cni.enc",
      expiresInSeconds: 300,
      headers: {},
    }),
    getKycDownloadSignedUrl: jest.fn().mockResolvedValue("http://localhost:9000/download-signed"),
    purgeKycDocument: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        MockKycProvider,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
    mockKycProvider = module.get<MockKycProvider>(MockKycProvider);
  });

  describe("Calcul d'âge et protection des mineurs", () => {
    it("doit bloquer immédiatement une personne mineure (< 18 ans)", async () => {
      // Date de naissance correspondant à 17 ans
      const today = new Date();
      const minorDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate()).toISOString();

      await expect(
        service.initiateVerification("user-minor-1", minorDate, DocumentType.NATIONAL_ID),
      ).rejects.toThrow(BadRequestException);
    });

    it("doit accepter une personne majeure de 18 ans ou plus", async () => {
      const today = new Date();
      const adultDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate()).toISOString();

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "user-adult-1",
        isIdentityVerified: false,
        profile: null,
      });
      mockPrismaService.profile.upsert.mockResolvedValue({});
      mockPrismaService.verificationRequest.create.mockResolvedValue({ id: "req-123" });

      const result = await service.initiateVerification("user-adult-1", adultDate, DocumentType.NATIONAL_ID);

      expect(result.success).toBe(true);
      expect(result.calculatedAge).toBe(25);
      expect(result.documentUpload).toBeDefined();
      expect(result.selfieUpload).toBeDefined();
    });
  });

  describe("Soumission et modération KYC", () => {
    it("doit certifier l'utilisateur lorsque le fournisseur KYC valide le dossier", async () => {
      mockPrismaService.verificationRequest.findFirst.mockResolvedValue({
        id: "req-123",
        userId: "user-adult-1",
        status: VerificationStatus.PENDING,
      });
      mockPrismaService.verificationDocument.createMany.mockResolvedValue({});
      mockPrismaService.verificationRequest.update.mockResolvedValue({});
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "user-adult-1",
        profile: { birthDate: new Date("1998-05-12") },
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.profile.update.mockResolvedValue({});

      mockKycProvider.shouldSucceed = true;
      mockKycProvider.mockFaceMatchScore = 95.0;

      const result = await service.submitVerification("user-adult-1", {
        documentStorageKey: "kyc/user-adult-1/cni.enc",
        selfieStorageKey: "kyc/user-adult-1/selfie.enc",
        documentType: DocumentType.NATIONAL_ID,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(VerificationStatus.VERIFIED);
      expect(mockPrismaService.profile.update).toHaveBeenCalledWith({
        where: { userId: "user-adult-1" },
        data: { isVerifiedBadge: true },
      });
    });

    it("doit enregistrer une décision de modérateur avec audit log complet", async () => {
      mockPrismaService.verificationRequest.findUnique.mockResolvedValue({
        id: "req-999",
        userId: "user-test-mod",
        status: VerificationStatus.UNDER_REVIEW,
      });
      mockPrismaService.verificationDecision.create.mockResolvedValue({});
      mockPrismaService.adminAuditLog.create.mockResolvedValue({});
      mockPrismaService.verificationRequest.update.mockResolvedValue({});
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.profile.update.mockResolvedValue({});

      const response = await service.reviewDecision("mod-1", "192.168.1.10", {
        verificationRequestId: "req-999",
        status: VerificationStatus.VERIFIED,
        decisionReason: "Pièce nationale et selfie conformes",
      });

      expect(response.success).toBe(true);
      expect(mockPrismaService.verificationDecision.create).toHaveBeenCalled();
      expect(mockPrismaService.adminAuditLog.create).toHaveBeenCalled();
    });
  });

  describe("Purge des pièces après 30 jours", () => {
    it("doit supprimer les images S3 expirées tout en conservant les empreintes de contrôle", async () => {
      mockPrismaService.verificationDocument.findMany.mockResolvedValue([
        { id: "doc-1", encryptedStorageKey: "kyc/u1/doc1.enc" },
        { id: "doc-2", encryptedStorageKey: "kyc/u2/doc2.enc" },
      ]);
      mockPrismaService.verificationDocument.update.mockResolvedValue({});

      const count = await service.purgeExpiredDocuments(30);

      expect(count).toBe(2);
      expect(mockStorageService.purgeKycDocument).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.verificationDocument.update).toHaveBeenCalledTimes(2);
    });
  });
});
