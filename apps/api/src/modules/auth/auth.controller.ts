import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  Res,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  SendOtpSchema,
  SendOtpDto,
  VerifyOtpSchema,
  VerifyOtpDto,
  RefreshTokenSchema,
  RefreshTokenDto,
} from "@belle-ame/shared-types";

@ApiTags("Authentification & Sessions")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("send-otp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Envoi d'un code de vérification OTP par SMS ou WhatsApp" })
  @ApiResponse({ status: 200, description: "Code OTP envoyé avec succès." })
  @ApiResponse({ status: 429, description: "Limite de débit dépassée (max 3 envois par heure)." })
  @UsePipes(new ZodValidationPipe(SendOtpSchema))
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Validation du code OTP, création de session et émission de tokens" })
  @ApiResponse({ status: 200, description: "Authentification réussie, retourne le profil et les jetons." })
  @ApiResponse({ status: 400, description: "Code OTP erroné ou expiré." })
  @ApiResponse({ status: 403, description: "Compte temporairement verrouillé après trop d'échecs (5 max)." })
  @UsePipes(new ZodValidationPipe(VerifyOtpSchema))
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "unknown";

    const result = await this.authService.verifyOtp(dto, ip, userAgent);

    // Positionnement du Refresh Token dans un cookie HttpOnly sécurisé
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
      path: "/api/v1/auth",
    });

    return {
      success: true,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresInSeconds: result.tokens.expiresInSeconds,
      },
    };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rotation du Refresh Token et émission d'un nouvel Access Token" })
  @ApiResponse({ status: 200, description: "Nouveaux jetons émis avec succès." })
  @ApiResponse({ status: 401, description: "Refresh token révoqué ou expiré." })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body?: Partial<RefreshTokenDto>,
  ) {
    const rawToken = req.cookies?.refreshToken || body?.refreshToken;
    if (!rawToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: {
          code: "AUTH_NO_REFRESH_TOKEN",
          message: "Aucun refresh token fourni.",
        },
      });
    }

    const ip = req.ip || (req.headers["x-forwarded-for"] as string);
    const userAgent = req.headers["user-agent"];

    const newTokens = await this.authService.refreshTokens(rawToken, ip, userAgent);

    res.cookie("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/api/v1/auth",
    });

    return {
      success: true,
      data: {
        accessToken: newTokens.accessToken,
        expiresInSeconds: newTokens.expiresInSeconds,
      },
    };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Déconnexion de l'appareil courant et révocation de la session" })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refreshToken;
    if (token) {
      await this.authService.logout(token);
    }
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });
    return { success: true, message: "Déconnexion réussie." };
  }

  @Post("logout-all")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Déconnexion de tous les appareils (révocation globale des sessions)" })
  async logoutAll(
    @CurrentUser("id") userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logoutAllDevices(userId);
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });
    return { success: true, message: "Toutes les sessions ont été révoquées." };
  }

  @Get("sessions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Liste des sessions actives sur les différents appareils de l'utilisateur" })
  async getSessions(@CurrentUser("id") userId: string) {
    const sessions = await this.authService.getUserSessions(userId);
    return { success: true, data: sessions };
  }

  @Delete("sessions/:sessionId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Révocation à distance d'une session / appareil spécifique" })
  async revokeSession(
    @CurrentUser("id") userId: string,
    @Param("sessionId") sessionId: string,
  ) {
    await this.authService.revokeSession(userId, sessionId);
    return { success: true, message: "Session révoquée." };
  }

  @Post("email")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Ajout ou mise à jour de l'adresse e-mail de secours" })
  async addEmail(
    @CurrentUser("id") userId: string,
    @Body("email") email: string,
  ) {
    return this.authService.addEmail(userId, email);
  }
}
