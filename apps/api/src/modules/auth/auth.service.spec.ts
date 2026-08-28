import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PrismaService } from "../database/prisma.service";
import { TokenService } from "./services/token.service";
import { AuthRateLimitService } from "./services/rate-limit.service";
import { MockSmsProvider } from "./providers/mock-sms.provider";
import { BadRequestException } from "@nestjs/common";
import { AccountStatus, RoleType } from "@belle-ame/shared-types";

describe("AuthService", () => {
  let authService: AuthService;
  let smsProvider: MockSmsProvider;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
    device: {
      upsert: jest.fn(),
    },
    referralInvite: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        TokenService,
        AuthRateLimitService,
        MockSmsProvider,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: "ConfigService",
          useValue: {
            get: (key: string) => {
              if (key === "JWT_ACCESS_SECRET") return "test-secret-at-least-32-chars-long";
              if (key === "JWT_REFRESH_SECRET") return "test-refresh-secret-32-chars-long";
              return null;
            },
          },
        },
        {
          provide: "JwtService",
          useValue: {
            sign: () => "mocked-jwt-access-token",
            verify: () => ({ sub: "mock-id", phoneNumber: "+237699000000", roles: ["USER"] }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    smsProvider = module.get<MockSmsProvider>(MockSmsProvider);
  });

  it("doit être défini", () => {
    expect(authService).toBeDefined();
  });

  describe("sendOtp", () => {
    it("doit générer un code OTP, l'envoyer via le SmsProvider et créer l'utilisateur", async () => {
      const phoneNumber = "+237699000001";
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: "user-123",
        phoneNumber,
        status: AccountStatus.UNVERIFIED,
      });

      const response = await authService.sendOtp({ phoneNumber });

      expect(response.success).toBe(true);
      expect(response.provider).toBe("MOCK_TEST_SMS_PROVIDER");

      // Vérifie que le SMS provider a bien reçu le message
      const lastCode = smsProvider.getLastCodeFor(phoneNumber);
      expect(lastCode).toBeDefined();
      expect(lastCode?.length).toBe(6);
    });
  });

  describe("verifyOtp", () => {
    it("doit valider le code OTP et retourner les jetons de session", async () => {
      const phoneNumber = "+237699000002";
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "user-456",
        phoneNumber,
        status: AccountStatus.UNVERIFIED,
        isPhoneVerified: false,
        isIdentityVerified: false,
        roles: [{ role: RoleType.USER }],
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.device.upsert.mockResolvedValue({});
      mockPrismaService.userSession.create.mockResolvedValue({});

      // 1. Envoi OTP
      await authService.sendOtp({ phoneNumber });
      const sentCode = smsProvider.getLastCodeFor(phoneNumber)!;

      // 2. Validation avec le bon code
      const result = await authService.verifyOtp({
        phoneNumber,
        code: sentCode,
        deviceFingerprint: "fingerprint-test-abc",
        deviceModel: "Samsung Galaxy A14",
      });

      expect(result.user.id).toBe("user-456");
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(mockPrismaService.userSession.create).toHaveBeenCalled();
    });

    it("doit rejeter un code OTP erroné avec une BadRequestException", async () => {
      const phoneNumber = "+237699000003";
      await authService.sendOtp({ phoneNumber });

      await expect(
        authService.verifyOtp({
          phoneNumber,
          code: "000000", // mauvais code
          deviceFingerprint: "fingerprint-test-xyz",
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("logoutAllDevices", () => {
    it("doit révoquer toutes les sessions d'un utilisateur", async () => {
      mockPrismaService.userSession.updateMany.mockResolvedValue({ count: 3 });

      await authService.logoutAllDevices("user-789");

      expect(mockPrismaService.userSession.updateMany).toHaveBeenCalledWith({
        where: { userId: "user-789", isRevoked: false },
        data: { isRevoked: true },
      });
    });
  });
});
