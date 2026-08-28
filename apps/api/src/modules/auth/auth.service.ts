import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { TokenService, GeneratedTokens } from "./services/token.service";
import { AuthRateLimitService } from "./services/rate-limit.service";
import { MockSmsProvider } from "./providers/mock-sms.provider";
import { SendOtpDto, VerifyOtpDto } from "@belle-ame/shared-types";
import { AccountStatus, RoleType } from "@belle-ame/shared-types";
import * as crypto from "crypto";

interface StoredOtp {
  code: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // Cache OTP en mémoire (remplaçable par Redis avec TTL)
  private readonly activeOtps = new Map<string, StoredOtp>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly rateLimitService: AuthRateLimitService,
    private readonly smsProvider: MockSmsProvider,
  ) {}

  private hashPhone(phoneNumber: string): string {
    return crypto.createHash("sha256").update(phoneNumber).digest("hex");
  }

  private generateSecureOtp(): string {
    // Génère un code 6 chiffres imprévisible (100000 à 999999)
    const buffer = crypto.randomBytes(4);
    const num = buffer.readUInt32BE(0) % 900000 + 100000;
    return num.toString();
  }

  async sendOtp(dto: SendOtpDto): Promise<{ success: boolean; message: string; provider: string }> {
    const phoneNumber = dto.phoneNumber.trim();

    // 1. Contrôle anti-brute force d'envois
    this.rateLimitService.checkOtpSendLimit(phoneNumber);

    // 2. Génération du code OTP
    const code = this.generateSecureOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.activeOtps.set(phoneNumber, { code, expiresAt });

    // 3. Dispatch via le fournisseur SMS (Mode Test sécurisé)
    const result = await this.smsProvider.sendOtp(phoneNumber, code);

    // 4. Initialisation ou récupération de l'utilisateur
    const phoneHash = this.hashPhone(phoneNumber);
    let user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phoneNumber,
          phoneHash,
          status: AccountStatus.UNVERIFIED,
          roles: {
            create: { role: RoleType.USER },
          },
        },
      });

      // Gestion du code de parrainage / invitation WhatsApp
      if (dto.referralCode) {
        const invite = await this.prisma.referralInvite.findUnique({
          where: { code: dto.referralCode },
        });

        if (invite && invite.currentUses < invite.maxUses && invite.expiresAt > new Date()) {
          await this.prisma.referralInvite.update({
            where: { id: invite.id },
            data: {
              currentUses: { increment: 1 },
              referredUserId: user.id,
            },
          });
          this.logger.log(`🎉 Inscription parrainée via ${invite.campaignName} pour l'utilisateur ${user.id}`);
        }
      }
    }

    return {
      success: true,
      message: "Un code de validation à 6 chiffres a été envoyé par SMS.",
      provider: result.provider,
    };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{
    user: {
      id: string;
      phoneNumber: string;
      status: AccountStatus;
      isIdentityVerified: boolean;
      roles: string[];
    };
    tokens: GeneratedTokens;
  }> {
    const phoneNumber = dto.phoneNumber.trim();

    // 1. Contrôle du nombre d'échecs de saisie
    this.rateLimitService.checkVerifyAttempts(phoneNumber);

    // 2. Vérification du code en mémoire
    const stored = this.activeOtps.get(phoneNumber);

    if (!stored || Date.now() > stored.expiresAt || stored.code !== dto.code) {
      this.rateLimitService.recordVerifyFailure(phoneNumber);
      throw new BadRequestException({
        code: "AUTH_INVALID_OR_EXPIRED_OTP",
        message: "Code de validation incorrect ou expiré. Veuillez vérifier votre saisie.",
      });
    }

    // Réinitialisation des échecs après succès
    this.rateLimitService.resetVerifyFailures(phoneNumber);
    this.activeOtps.delete(phoneNumber);

    // 3. Mise à jour de l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
      include: { roles: true },
    });

    if (!user) {
      throw new BadRequestException({
        code: "AUTH_USER_NOT_FOUND",
        message: "Compte introuvable.",
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isPhoneVerified: true,
        lastActiveAt: new Date(),
      },
    });

    // 4. Enregistrement / mise à jour de l'appareil
    await this.prisma.device.upsert({
      where: {
        userId_deviceFingerprint: {
          userId: user.id,
          deviceFingerprint: dto.deviceFingerprint,
        },
      },
      update: {
        deviceModel: dto.deviceModel,
        lastIpAddress: ipAddress,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        deviceFingerprint: dto.deviceFingerprint,
        deviceModel: dto.deviceModel,
        lastIpAddress: ipAddress,
      },
    });

    // 5. Émission des jetons JWT et Refresh Token rotatif
    const roles = user.roles.map((r) => r.role);
    const tokens = this.tokenService.generateTokens({
      sub: user.id,
      phoneNumber: user.phoneNumber,
      roles,
      isIdentityVerified: user.isIdentityVerified,
    });

    // 6. Sauvegarde de la session en base avec hash du refresh token
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshTokenHash: tokens.refreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        status: user.status as unknown as AccountStatus,
        isIdentityVerified: user.isIdentityVerified,
        roles,
      },
      tokens,
    };
  }

  async refreshTokens(
    rawRefreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<GeneratedTokens> {
    const hash = this.tokenService.hashToken(rawRefreshToken);

    const session = await this.prisma.userSession.findUnique({
      where: { refreshTokenHash: hash },
      include: {
        user: {
          include: { roles: true },
        },
      },
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      throw new UnauthorizedException({
        code: "AUTH_REFRESH_TOKEN_INVALID",
        message: "Session expirée ou invalide. Veuillez vous réauthentifier.",
      });
    }

    // Rotation du Refresh Token : on révoque l'ancienne session
    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { isRevoked: true },
    });

    // Émission du nouveau couple de tokens
    const roles = session.user.roles.map((r) => r.role);
    const newTokens = this.tokenService.generateTokens({
      sub: session.user.id,
      phoneNumber: session.user.phoneNumber,
      roles,
      isIdentityVerified: session.user.isIdentityVerified,
    });

    // Création de la nouvelle session active
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.prisma.userSession.create({
      data: {
        userId: session.user.id,
        refreshTokenHash: newTokens.refreshTokenHash,
        userAgent: userAgent || session.userAgent,
        ipAddress: ipAddress || session.ipAddress,
        expiresAt,
      },
    });

    return newTokens;
  }

  async logout(rawRefreshToken: string): Promise<void> {
    const hash = this.tokenService.hashToken(rawRefreshToken);
    await this.prisma.userSession.updateMany({
      where: { refreshTokenHash: hash },
      data: { isRevoked: true },
    });
  }

  async logoutAllDevices(userId: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async addEmail(userId: string, email: string): Promise<{ success: boolean; email: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing && existing.id !== userId) {
      throw new ConflictException({
        code: "AUTH_EMAIL_ALREADY_IN_USE",
        message: "Cette adresse e-mail est déjà associée à un autre compte.",
      });
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { email: normalizedEmail },
    });

    return { success: true, email: normalizedEmail };
  }

  async getUserSessions(userId: string) {
    return this.prisma.userSession.findMany({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { id: sessionId, userId },
      data: { isRevoked: true },
    });
  }
}
