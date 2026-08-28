import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";

export interface JwtPayload {
  sub: string;
  phoneNumber: string;
  roles: string[];
  isIdentityVerified: boolean;
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  expiresInSeconds: number;
}

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret =
      this.configService.get<string>("JWT_ACCESS_SECRET") ||
      "local-dev-jwt-access-secret-minimum-32-characters-long!";
    this.refreshSecret =
      this.configService.get<string>("JWT_REFRESH_SECRET") ||
      "local-dev-jwt-refresh-secret-minimum-32-characters-long!";
  }

  hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  generateTokens(payload: JwtPayload): GeneratedTokens {
    // 1. Access Token (15 minutes de durée de vie)
    const accessToken = this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: "15m",
    });

    // 2. Refresh Token opaque sécurisé (64 octets hex)
    const rawRefreshToken = crypto.randomBytes(48).toString("hex");
    const refreshTokenHash = this.hashToken(rawRefreshToken);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      refreshTokenHash,
      expiresInSeconds: 15 * 60, // 900s
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.accessSecret,
      });
    } catch {
      throw new UnauthorizedException({
        code: "AUTH_TOKEN_EXPIRED_OR_INVALID",
        message: "Session expirée ou jeton d'accès invalide. Veuillez vous reconnecter.",
      });
    }
  }
}
