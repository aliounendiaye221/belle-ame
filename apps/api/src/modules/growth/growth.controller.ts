import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { GrowthService } from "./growth.service";
import { ComplianceService } from "./compliance.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RoleType } from "@belle-ame/shared-types";

@ApiTags("Migration WhatsApp, Croissance & Conformité")
@Controller()
export class GrowthController {
  constructor(
    private readonly growthService: GrowthService,
    private readonly complianceService: ComplianceService,
  ) {}

  @Get("growth/campaigns/:code")
  @ApiOperation({ summary: "Consultation d'un lien d'invitation et enregistrement anonymisé du clic" })
  async getCampaign(
    @Param("code") code: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "unknown";
    return this.growthService.trackClick(code, ip, userAgent);
  }

  @Post("growth/campaigns/apply")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Application d'un code promo ou parrainage (débloque 1 mois Premium à la vérification)" })
  async applyCode(
    @CurrentUser("id") userId: string,
    @Body("code") code: string,
  ) {
    return this.growthService.applyReferralCode(userId, code);
  }

  @Get("growth/whatsapp-toolkit")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Boîte à outils de migration : messages types pour animateurs du groupe WhatsApp" })
  async getWhatsAppToolkit() {
    return this.growthService.getWhatsAppToolkit();
  }

  @Get("growth/admin/analytics")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Métriques du tunnel de conversion de la communauté WhatsApp" })
  async getAnalytics() {
    return this.growthService.getCampaignFunnel();
  }

  // ==========================================
  // CONFORMITÉ RGPD & PROTECTION DES DONNÉES
  // ==========================================

  @Post("compliance/data-export")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Téléchargement de l'archive complète de ses données personnelles (Droit d'accès)" })
  async exportData(@CurrentUser("id") userId: string) {
    return this.complianceService.exportUserData(userId);
  }

  @Post("compliance/account-deletion")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Demande d'effacement de compte avec délai de grâce protecteur de 14 jours" })
  async requestDeletion(
    @CurrentUser("id") userId: string,
    @Body("reason") reason?: string,
  ) {
    return this.complianceService.requestAccountDeletion(userId, reason);
  }

  @Post("compliance/account-deletion/cancel")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rétractation et annulation de la demande de suppression pendant les 14 jours" })
  async cancelDeletion(@CurrentUser("id") userId: string) {
    return this.complianceService.cancelAccountDeletion(userId);
  }
}
