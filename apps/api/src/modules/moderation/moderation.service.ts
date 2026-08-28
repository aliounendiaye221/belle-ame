import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { FraudDetectionService } from "./services/fraud-detection.service";
import {
  ReportCategory,
  ReportPriority,
  ModerationStatus,
  ModActionType,
  AccountStatus,
  PhotoModerationStatus,
  NotificationType,
  NotificationChannel,
  CreateReportDto,
} from "@belle-ame/shared-types";

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fraudDetectionService: FraudDetectionService,
  ) {}

  /**
   * Création d'un signalement citoyen avec analyse heuristique et blocage automatique
   */
  async createReport(reporterId: string, dto: CreateReportDto) {
    if (reporterId === dto.reportedUserId) {
      throw new BadRequestException("Vous ne pouvez pas vous signaler vous-même.");
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: dto.reportedUserId },
      include: { profile: true },
    });

    if (!targetUser) {
      throw new NotFoundException("Utilisateur signalé introuvable.");
    }

    // 1. Analyse de l'historique du compte signalé
    const recentReportsCount = await this.prisma.report.count({
      where: { reportedUserId: dto.reportedUserId },
    });

    const accountAgeHours = Math.floor(
      (Date.now() - targetUser.createdAt.getTime()) / (3600 * 1000),
    );

    const fraudAnalysis = this.fraudDetectionService.analyzeReport(
      dto.category,
      dto.description,
      {
        recentReportsCount,
        accountAgeHours,
        isIdentityVerified: targetUser.isIdentityVerified,
      },
    );

    // 2. Calcul du SLA (< 24h garanti, < 4h si critique)
    let slaHours = 24;
    if (fraudAnalysis.suggestedPriority === ReportPriority.CRITICAL) slaHours = 4;
    else if (fraudAnalysis.suggestedPriority === ReportPriority.HIGH) slaHours = 12;

    const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000);

    // 3. Création du Report et du ModerationCase
    const report = await this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId: dto.reportedUserId,
        category: dto.category,
        priority: fraudAnalysis.suggestedPriority,
        description: dto.description,
        evidenceUrls: dto.evidenceUrls || [],
        status: ModerationStatus.OPEN,
        moderationCase: {
          create: {
            slaDeadline,
          },
        },
      },
      include: { moderationCase: true },
    });

    // 4. Blocage automatique immédiat pour protéger la victime
    await this.createBlock(
      reporterId,
      dto.reportedUserId,
      `Blocage automatique suite à signalement (${dto.category})`,
    );

    // 5. Mesure conservative temporaire si score critique (suspension préventive pour revue humaine)
    if (fraudAnalysis.requiresImmediateSuspension && targetUser.status === AccountStatus.ACTIVE) {
      await this.prisma.user.update({
        where: { id: targetUser.id },
        data: { status: AccountStatus.SUSPENDED },
      });

      this.logger.warn(
        `🚨 Suspension préventive automatique de l'utilisateur ${targetUser.id} suite au signalement ${report.id} (Score: ${fraudAnalysis.riskScore}/100)`,
      );
    }

    return {
      success: true,
      reportId: report.id,
      priority: report.priority,
      slaDeadline,
      message: "Votre signalement a été enregistré en priorité. Cet utilisateur a été immédiatement bloqué pour vous.",
    };
  }

  /**
   * Blocage bilatéral immédiat d'un membre
   */
  async createBlock(blockerId: string, blockedId: string, reason?: string) {
    if (blockerId === blockedId) {
      throw new BadRequestException("Impossible de se bloquer soi-même.");
    }

    // 1. Enregistrement du blocage
    const block = await this.prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      update: { reason },
      create: { blockerId, blockedId, reason },
    });

    // 2. Annulation de tout match actif entre les deux membres
    await this.prisma.match.updateMany({
      where: {
        OR: [
          { user1Id: blockerId, user2Id: blockedId },
          { user1Id: blockedId, user2Id: blockerId },
        ],
        isActive: true,
      },
      data: {
        isActive: false,
        cancelledById: blockerId,
      },
    });

    return {
      success: true,
      blockId: block.id,
      message: "Ce membre a été bloqué avec succès. Vous ne pourrez plus vous voir ni échanger.",
    };
  }

  /**
   * Déblocage d'un membre
   */
  async removeBlock(blockerId: string, blockedId: string) {
    await this.prisma.block.deleteMany({
      where: { blockerId, blockedId },
    });
    return { success: true, message: "Membre débloqué." };
  }

  /**
   * File d'attente des dossiers de modération pour le Back-Office (triée par urgence SLA)
   */
  async getModerationCases(
    page = 1,
    limit = 20,
    status?: ModerationStatus,
    priority?: ReportPriority,
  ) {
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;

    const [total, reports] = await Promise.all([
      this.prisma.report.count({ where: whereClause }),
      this.prisma.report.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          reporter: {
            select: { id: true, phoneNumber: true, profile: { select: { firstName: true } } },
          },
          reportedUser: {
            select: {
              id: true,
              phoneNumber: true,
              status: true,
              isIdentityVerified: true,
              profile: { select: { firstName: true, calculatedAge: true, city: true } },
            },
          },
          moderationCase: {
            include: {
              assignedModerator: { select: { id: true, email: true } },
              actions: true,
            },
          },
        },
        orderBy: [
          { priority: "desc" },
          { moderationCase: { slaDeadline: "asc" } },
        ],
      }),
    ]);

    return { total, page, limit, reports };
  }

  /**
   * Attribution d'un dossier à un modérateur
   */
  async assignCase(moderatorId: string, caseId: string) {
    const modCase = await this.prisma.moderationCase.findUnique({
      where: { id: caseId },
      include: { report: true },
    });

    if (!modCase) throw new NotFoundException("Dossier introuvable.");

    await this.prisma.moderationCase.update({
      where: { id: caseId },
      data: { assignedModId: moderatorId },
    });

    await this.prisma.report.update({
      where: { id: modCase.reportId },
      data: { status: ModerationStatus.ASSIGNED },
    });

    return { success: true, message: "Dossier attribué." };
  }

  /**
   * Exécution de l'une des 9 actions graduées de modération
   */
  async executeModerationAction(
    moderatorId: string,
    moderatorIp: string,
    caseId: string,
    actionType: ModActionType,
    internalRationale: string,
    userNotice?: string,
  ) {
    const modCase = await this.prisma.moderationCase.findUnique({
      where: { id: caseId },
      include: { report: true },
    });

    if (!modCase) throw new NotFoundException("Dossier de modération introuvable.");

    const targetUserId = modCase.report.reportedUserId;

    // 1. Application de la sanction selon l'action choisie
    switch (actionType) {
      case ModActionType.WARNING_SENT:
        await this.prisma.notification.create({
          data: {
            userId: targetUserId,
            type: NotificationType.REPORT_UPDATE,
            channel: NotificationChannel.IN_APP,
            title: "Avertissement de modération",
            body: userNotice || "Votre comportement a fait l'objet d'un avertissement pour non-respect de la charte.",
          },
        });
        break;

      case ModActionType.PHOTO_HIDDEN:
        await this.prisma.photo.updateMany({
          where: { profile: { userId: targetUserId } },
          data: {
            moderationStatus: PhotoModerationStatus.REJECTED,
            rejectionReason: userNotice || "Photo masquée par l'équipe de modération.",
          },
        });
        break;

      case ModActionType.ACCOUNT_SUSPENDED:
        await this.prisma.user.update({
          where: { id: targetUserId },
          data: { status: AccountStatus.SUSPENDED },
        });
        // Révocation de toutes les sessions actives
        await this.prisma.userSession.updateMany({
          where: { userId: targetUserId },
          data: { isRevoked: true },
        });
        break;

      case ModActionType.ACCOUNT_BANNED:
        await this.prisma.user.update({
          where: { id: targetUserId },
          data: { status: AccountStatus.BANNED },
        });
        await this.prisma.userSession.updateMany({
          where: { userId: targetUserId },
          data: { isRevoked: true },
        });
        break;

      case ModActionType.RE_VERIFICATION_REQUIRED:
        await this.prisma.user.update({
          where: { id: targetUserId },
          data: {
            isIdentityVerified: false,
            status: AccountStatus.PENDING_VERIFICATION,
          },
        });
        break;

      case ModActionType.CASE_DISMISSED:
      case ModActionType.ESCALATED_TO_LEAD:
      case ModActionType.INFO_REQUESTED:
      case ModActionType.TEMP_RESTRICTION:
        // Gestion des statuts administratifs
        break;
    }

    // 2. Enregistrement de l'action de modération
    const action = await this.prisma.moderationAction.create({
      data: {
        moderationCaseId: caseId,
        moderatorId,
        actionType,
        internalRationale,
        userNotice,
      },
    });

    // 3. Enregistrement du journal d'audit infalsifiable
    await this.prisma.adminAuditLog.create({
      data: {
        adminId: moderatorId,
        action: `MOD_ACTION_${actionType}`,
        entityType: "ModerationCase",
        entityId: caseId,
        ipAddress: moderatorIp,
        metadata: {
          targetUserId,
          actionType,
          internalRationale,
        },
      },
    });

    // 4. Clôture ou mise à jour du statut du signalement
    const finalStatus =
      actionType === ModActionType.CASE_DISMISSED
        ? ModerationStatus.DISMISSED
        : ModerationStatus.RESOLVED;

    await this.prisma.report.update({
      where: { id: modCase.reportId },
      data: {
        status: finalStatus,
        resolvedAt: new Date(),
      },
    });

    this.logger.log(
      `⚖️ Action de modération exécutée : ${actionType} par ${moderatorId} sur dossier ${caseId} (Cible: ${targetUserId})`,
    );

    return {
      success: true,
      actionId: action.id,
      actionType,
      status: finalStatus,
      message: `Action [${actionType}] appliquée avec succès.`,
    };
  }
}
