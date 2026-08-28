import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RoleType, AccountStatus } from "@belle-ame/shared-types";

@ApiTags("Back-Office & Administration")
@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth("JWT-auth")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard/kpis")
  @Roles(
    RoleType.CUSTOMER_SUPPORT,
    RoleType.MODERATOR,
    RoleType.LEAD_MODERATOR,
    RoleType.ADMIN,
    RoleType.SUPER_ADMIN,
  )
  @ApiOperation({ summary: "Indicateurs clés du tableau de bord exécutif (inscriptions, conversion WhatsApp, CA)" })
  async getDashboardKPIs() {
    return this.adminService.getDashboardKPIs();
  }

  @Get("users")
  @Roles(RoleType.CUSTOMER_SUPPORT, RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Recherche et filtrage multicritères des utilisateurs" })
  async getUsers(
    @Query("search") search?: string,
    @Query("status") status?: AccountStatus,
    @Query("isVerified") isVerified?: string,
    @Query("role") role?: RoleType,
    @Query("page") page = "1",
    @Query("limit") limit = "20",
  ) {
    return this.adminService.getUsersList({
      search,
      status,
      isVerified: isVerified !== undefined ? isVerified === "true" : undefined,
      role,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }

  @Get("users/:id")
  @Roles(RoleType.CUSTOMER_SUPPORT, RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Consultation de la vue 360° d'un utilisateur (avec traçabilité d'audit)" })
  async getUserDetails(
    @CurrentUser("id") adminId: string,
    @CurrentUser("roles") roles: RoleType[],
    @Param("id") targetUserId: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
    const highestRole = roles.includes(RoleType.SUPER_ADMIN)
      ? RoleType.SUPER_ADMIN
      : roles.includes(RoleType.ADMIN)
      ? RoleType.ADMIN
      : roles[0] || RoleType.CUSTOMER_SUPPORT;

    return this.adminService.getUserDetails(adminId, highestRole, targetUserId, ip);
  }

  @Patch("users/:id/status")
  @Roles(RoleType.MODERATOR, RoleType.LEAD_MODERATOR, RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Changement de statut de compte (Suspension, Bannissement, Réactivation)" })
  async updateUserStatus(
    @CurrentUser("id") adminId: string,
    @Param("id") targetUserId: string,
    @Body("status") status: AccountStatus,
    @Body("reason") reason: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
    return this.adminService.updateUserStatus(adminId, targetUserId, status, reason, ip);
  }

  @Post("users/:id/roles")
  @Roles(RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Attribution ou révocation d'un rôle administratif (SUPER_ADMIN uniquement)" })
  async assignUserRole(
    @CurrentUser("id") superAdminId: string,
    @Param("id") targetUserId: string,
    @Body("role") role: RoleType,
    @Body("action") action: "ADD" | "REMOVE",
    @Req() req: Request,
  ) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
    return this.adminService.assignUserRole(superAdminId, targetUserId, role, action, ip);
  }

  @Get("audit-logs")
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @ApiOperation({ summary: "Consultation du journal d'audit infalsifiable des actions administratives" })
  async getAuditLogs(
    @Query("adminId") adminId?: string,
    @Query("action") action?: string,
    @Query("page") page = "1",
    @Query("limit") limit = "30",
  ) {
    return this.adminService.getAuditLogs({
      adminId,
      action,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }
}
