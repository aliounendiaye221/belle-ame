import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Notifications & Préférences")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Liste paginée des notifications in-app avec compteur non lu" })
  async getNotifications(
    @CurrentUser("id") userId: string,
    @Query("page") page = "1",
    @Query("limit") limit = "20",
  ) {
    return this.notificationsService.getUserNotifications(
      userId,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Marquer une notification comme lue" })
  async markAsRead(
    @CurrentUser("id") userId: string,
    @Param("id") notificationId: string,
  ) {
    return this.notificationsService.markAsRead(userId, notificationId);
  }

  @Post("read-all")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Tout marquer comme lu" })
  async markAllAsRead(@CurrentUser("id") userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Get("preferences")
  @ApiOperation({ summary: "Consultation des préférences de notifications" })
  async getPreferences(@CurrentUser("id") userId: string) {
    return this.notificationsService.getPreferences(userId);
  }

  @Put("preferences")
  @ApiOperation({ summary: "Mise à jour des préférences (alertes de sécurité protégées)" })
  async updatePreferences(
    @CurrentUser("id") userId: string,
    @Body()
    dto: {
      allowPushMatch?: boolean;
      allowPushMessage?: boolean;
      allowEmailDigest?: boolean;
    },
  ) {
    return this.notificationsService.updatePreferences(userId, dto);
  }

  @Post("device-token")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Enregistrement du jeton Push FCM pour l'appareil mobile courant" })
  async registerDeviceToken(
    @CurrentUser("id") userId: string,
    @Body("deviceFingerprint") deviceFingerprint: string,
    @Body("fcmToken") fcmToken: string,
  ) {
    return this.notificationsService.registerDeviceToken(userId, deviceFingerprint, fcmToken);
  }
}
