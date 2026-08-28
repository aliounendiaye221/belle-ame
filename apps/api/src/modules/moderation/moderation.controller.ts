import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
} from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ModerationService } from "./moderation.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  RoleType,
  ModActionType,
  ModerationStatus,
  ReportPriority,
  CreateReportSchema,
  CreateReportDto,
  CreateBlockSchema,
  CreateBlockDto,
} from "@belle-ame/shared-types";

@ApiTags("Sécurité & Modération")
@Controller("moderation")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post("reports")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Création d'un signalement citoyen (profil, photo, message ou fraude)" })
  @ApiResponse({ status: 201, description: "Signalement enregistré en file prioritaire avec blocage automatique." })
  @UsePipes(new ZodValidationPipe(CreateReportSchema))
  async createReport(
    @CurrentUser("id") reporterId: string,
    @Body() dto: CreateReportDto,
  ) {
    return this.moderationService.createReport(reporterId, dto);
  }

  @Post("blocks")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Blocage bilatéral immédiat d'un membre (ferme tout échange)" })
  @ApiResponse({ status: 200, description: "Utilisateur bloqué avec succès." })
  @UsePipes(new ZodValidationPipe(CreateBlockSchema))
  async createBlock(
    @CurrentUser("id") blockerId: string,
    @Body() dto: CreateBlockDto,
  ) {
    return this.moderationService.createBlock(blockerId, dto.blockedId, dto.reason);
  }

  @Delete("blocks/:blockedId")
  @ApiOperation({ summary: "Déblocage d'un membre" })
  async removeBlock(
    @CurrentUser("id") blockerId: string,
    @Param("blockedId") blockedId: string,
  ) {
    return this.moderationService.removeBlock(blockerId, blockedId);
  }

  // ==========================================
  // ROUTES BACK-OFFICE (RÔLES MODÉRATEUR / ADMIN)
  // ==========================================

  @Get("admin/cases")
  @UseGuards(RolesGuard)
  @Roles(RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "File des dossiers de modération triée par priorité et SLA (Modérateurs uniquement)" })
  async getCases(
    @Query("page") page = "1",
    @Query("limit") limit = "20",
    @Query("status") status?: ModerationStatus,
    @Query("priority") priority?: ReportPriority,
  ) {
    return this.moderationService.getModerationCases(
      parseInt(page, 10),
      parseInt(limit, 10),
      status,
      priority,
    );
  }

  @Post("admin/cases/:id/assign")
  @UseGuards(RolesGuard)
  @Roles(RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Attribution d'un dossier à un modérateur" })
  async assignCase(
    @CurrentUser("id") moderatorId: string,
    @Param("id") caseId: string,
  ) {
    return this.moderationService.assignCase(moderatorId, caseId);
  }

  @Post("admin/cases/:id/action")
  @UseGuards(RolesGuard)
  @Roles(RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Exécution de l'une des 9 actions graduées de modération avec journalisation d'audit" })
  async executeAction(
    @CurrentUser("id") moderatorId: string,
    @Req() req: Request,
    @Param("id") caseId: string,
    @Body("actionType") actionType: ModActionType,
    @Body("internalRationale") internalRationale: string,
    @Body("userNotice") userNotice?: string,
  ) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
    return this.moderationService.executeModerationAction(
      moderatorId,
      ip,
      caseId,
      actionType,
      internalRationale,
      userNotice,
    );
  }
}
