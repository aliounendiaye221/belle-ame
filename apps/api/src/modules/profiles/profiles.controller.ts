import {
  Controller,
  Get,
  Patch,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ProfilesService } from "./profiles.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  RoleType,
  PhotoModerationStatus,
  UpdatePreferencesSchema,
  UpdatePreferencesDto,
} from "@belle-ame/shared-types";

@ApiTags("Profils & Photos")
@Controller("profiles")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get("me")
  @ApiOperation({ summary: "Consultation de son propre profil (avec état de modération des photos)" })
  async getMyProfile(@CurrentUser("id") userId: string) {
    return this.profilesService.getMyProfile(userId);
  }

  @Patch("me")
  @ApiOperation({ summary: "Mise à jour des informations de profil et recalcul du taux de complétion" })
  async updateProfile(
    @CurrentUser("id") userId: string,
    @Body() dto: any,
  ) {
    return this.profilesService.updateProfile(userId, dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Consultation d'un profil public (photos approuvées uniquement, masque d'activité)" })
  async getPublicProfile(
    @CurrentUser("id") viewerUserId: string,
    @Param("id") targetUserId: string,
  ) {
    return this.profilesService.getPublicProfile(targetUserId, viewerUserId);
  }

  @Put("preferences")
  @ApiOperation({ summary: "Définition des critères de recherche et filtres de découverte" })
  @UsePipes(new ZodValidationPipe(UpdatePreferencesSchema))
  async updatePreferences(
    @CurrentUser("id") userId: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.profilesService.updatePreferences(userId, dto);
  }

  @Post("photos")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Ajout d'une photo de profil (nettoyage EXIF, WebP, modération)" })
  async addPhoto(
    @CurrentUser("id") userId: string,
    @Body() body: { imageBase64: string; mimeType: string; isMain?: boolean },
  ) {
    const buffer = Buffer.from(body.imageBase64, "base64");
    return this.profilesService.addPhoto(userId, buffer, body.mimeType, body.isMain);
  }

  @Delete("photos/:photoId")
  @ApiOperation({ summary: "Suppression d'une photo de profil" })
  async deletePhoto(
    @CurrentUser("id") userId: string,
    @Param("photoId") photoId: string,
  ) {
    return this.profilesService.deletePhoto(userId, photoId);
  }

  @Patch("photos/:photoId/main")
  @ApiOperation({ summary: "Définir une photo validée comme photo principale" })
  async setMainPhoto(
    @CurrentUser("id") userId: string,
    @Param("photoId") photoId: string,
  ) {
    return this.profilesService.setMainPhoto(userId, photoId);
  }

  // ==========================================
  // ROUTES BACK-OFFICE (MODÉRATEURS)
  // ==========================================

  @Get("admin/photos/queue")
  @UseGuards(RolesGuard)
  @Roles(RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "File des photos en attente de validation (Modérateurs uniquement)" })
  async getPhotosQueue(
    @Query("page") page = "1",
    @Query("limit") limit = "20",
  ) {
    return this.profilesService.getPendingPhotosQueue(parseInt(page, 10), parseInt(limit, 10));
  }

  @Post("admin/photos/:photoId/decide")
  @UseGuards(RolesGuard)
  @Roles(RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Validation ou rejet motivé d'une photo de profil" })
  async decidePhoto(
    @CurrentUser("id") moderatorId: string,
    @Param("photoId") photoId: string,
    @Body("status") status: PhotoModerationStatus,
    @Body("reason") reason?: string,
  ) {
    return this.profilesService.decidePhotoModeration(moderatorId, photoId, status, reason);
  }
}
