import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
} from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { VerificationService } from "./verification.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  DocumentType,
  RoleType,
  SubmitKycSchema,
  SubmitKycDto,
  ReviewKycDecisionSchema,
  ReviewKycDecisionDto,
} from "@belle-ame/shared-types";

@ApiTags("Vérification d'Identité & Majorité (KYC)")
@Controller("verification")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post("initiate")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Déclaration de la date de naissance et obtention des URLs d'upload pour le KYC" })
  @ApiResponse({ status: 200, description: "Âge validé (18+) et URLs présignées S3 générées." })
  @ApiResponse({ status: 400, description: "Accès refusé si l'âge est inférieur à 18 ans." })
  async initiate(
    @CurrentUser("id") userId: string,
    @Body("birthDate") birthDate: string,
    @Body("documentType") documentType: DocumentType,
  ) {
    return this.verificationService.initiateVerification(userId, birthDate, documentType);
  }

  @Post("submit")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Soumission des pièces d'identité téléversées pour examen" })
  @ApiResponse({ status: 200, description: "Dossier soumis avec succès pour revue." })
  @UsePipes(new ZodValidationPipe(SubmitKycSchema))
  async submit(
    @CurrentUser("id") userId: string,
    @Body() dto: SubmitKycDto,
  ) {
    return this.verificationService.submitVerification(userId, dto);
  }

  @Get("status")
  @ApiOperation({ summary: "Consultation de l'état de vérification du compte courant" })
  async getStatus(@CurrentUser("id") userId: string) {
    return this.verificationService.getStatus(userId);
  }

  // ==========================================
  // ROUTES BACK-OFFICE (RÔLES MODÉRATEUR / ADMIN)
  // ==========================================

  @Get("admin/queue")
  @UseGuards(RolesGuard)
  @Roles(RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Consultation de la file d'attente des dossiers KYC (Modérateurs uniquement)" })
  async getQueue(
    @Query("page") page = "1",
    @Query("limit") limit = "20",
  ) {
    return this.verificationService.getPendingQueue(parseInt(page, 10), parseInt(limit, 10));
  }

  @Post("admin/decide")
  @UseGuards(RolesGuard)
  @Roles(RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Validation ou rejet motivé d'un dossier KYC avec traçabilité d'audit" })
  @UsePipes(new ZodValidationPipe(ReviewKycDecisionSchema))
  async reviewDecision(
    @CurrentUser("id") moderatorId: string,
    @Req() req: Request,
    @Body() dto: ReviewKycDecisionDto,
  ) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
    return this.verificationService.reviewDecision(moderatorId, ip, dto);
  }

  @Post("admin/purge")
  @UseGuards(RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Déclenchement manuel de la purge des pièces d'identité > 30 jours (Super Admin)" })
  async triggerPurge(@Query("retentionDays") days = "30") {
    const purgedCount = await this.verificationService.purgeExpiredDocuments(parseInt(days, 10));
    return { success: true, purgedCount };
  }
}
