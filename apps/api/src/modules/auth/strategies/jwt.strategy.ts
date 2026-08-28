import { Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../database/prisma.service";
import { JwtPayload } from "../services/token.service";
import { AccountStatus } from "@belle-ame/shared-types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>("JWT_ACCESS_SECRET") ||
        "local-dev-jwt-access-secret-minimum-32-characters-long!",
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: "AUTH_USER_NOT_FOUND",
        message: "Utilisateur introuvable.",
      });
    }

    if (user.status === AccountStatus.BANNED) {
      throw new ForbiddenException({
        code: "AUTH_USER_BANNED",
        message: "Ce compte a été définitivement suspendu pour non-respect de la charte de sécurité.",
      });
    }

    if (user.status === AccountStatus.DELETED) {
      throw new UnauthorizedException({
        code: "AUTH_USER_DELETED",
        message: "Ce compte a été supprimé.",
      });
    }

    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      status: user.status,
      isPhoneVerified: user.isPhoneVerified,
      isIdentityVerified: user.isIdentityVerified,
      roles: user.roles.map((r) => r.role),
    };
  }
}
