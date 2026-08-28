import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { StorageService } from "../storage/storage.service";
import { MockKycProvider } from "./providers/mock-kyc.provider";
import {
  VerificationStatus,
  DocumentType,
  AccountStatus,
  SubmitKycDto,
  ReviewKycDecisionDto,
} from "@belle-ame/shared-types";
import * as crypto from "crypto";

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly kycProvider: MockKycProvider,
  ) {}

  /**
   * Calcul d'âge strict et déterministe côté serveur
   */
  public calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Étape 1 : Déclaration d'âge et initialisation du dossier KYC
   */
  async initiateVerification(
    userId: string,
    birthDateString: string,
    documentType: DocumentType,
  ) {
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException({
        code: "KYC_INVALID_DATE",
        message: "Date de naissance invalide.",
      });
    }

    // 1. CONTRÔLE SERVEUR STRICT DE LA MAJORITÉ (18+)
    const calculatedAge = this.calculateAge(birthDate);
    if (calculatedAge < 18) {
      this.logger.warn(`Tentative d'accès par un mineur (${calculatedAge} ans) - Utilisateur ${userId}`);
      throw new BadRequestException({
        code: "KYC_UNDERAGE_REJECTED",
        message: "L'accès à la plateforme est strictement réservé aux personnes majeures de 18 ans ou plus.",
      });
    }

    // 2. Vérifier si l'utilisateur a déjà un profil validé (la date de naissance ne peut plus être modifiée librement)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: "AUTH_USER_NOT_FOUND",
        message: "Utilisateur introuvable.",
      });
    }

    if (user.isIdentityVerified && user.profile) {
      throw new ForbiddenException({
        code: "KYC_ALREADY_VERIFIED",
        message: "Votre identité est déjà certifiée. La date de naissance ne peut plus être modifiée sans intervention du support.",
      });
    }

    // 3. Mise à jour ou création du brouillon de profil avec l'âge officiel calculé
    await this.prisma.profile.upsert({
      where: { userId },
      update: {
        birthDate,
        calculatedAge,
      },
      create: {
        userId,
        firstName: "Membre",
        birthDate,
        calculatedAge,
        gender: "FEMALE", // Valeur temporaire avant l'étape profil
        city: "En attente",
        country: "CM",
        personalValues: [],
      },
    });

    // 4. Création ou réinitialisation de la demande de vérification
    const request = await this.prisma.verificationRequest.create({
      data: {
        userId,
        status: VerificationStatus.PENDING,
        providerName: this.kycProvider.providerName,
      },
    });

    // 5. Génération des URLs présignées sécurisées pour la pièce et le selfie
    const docUpload = await this.storageService.getKycUploadSignedUrl(
      userId,
      documentType,
      "image/jpeg",
    );
    const selfieUpload = await this.storageService.getKycUploadSignedUrl(
      userId,
      DocumentType.SELFIE,
      "image/jpeg",
    );

    return {
      success: true,
      verificationRequestId: request.id,
      calculatedAge,
      documentUpload: docUpload,
      selfieUpload: selfieUpload,
    };
  }

  /**
   * Étape 2 : Soumission des pièces téléversées pour examen
   */
  async submitVerification(userId: string, dto: SubmitKycDto) {
    const request = await this.prisma.verificationRequest.findFirst({
      where: { userId, status: VerificationStatus.PENDING },
      orderBy: { createdAt: "desc" },
    });

    if (!request) {
      throw new BadRequestException({
        code: "KYC_NO_PENDING_REQUEST",
        message: "Aucune demande de vérification en attente trouvée.",
      });
    }

    // 1. Enregistrement des documents avec hash d'intégrité
    const docHash = crypto.createHash("sha256").update(dto.documentStorageKey).digest("hex");
    const selfieHash = crypto.createHash("sha256").update(dto.selfieStorageKey).digest("hex");

    await this.prisma.verificationDocument.createMany({
      data: [
        {
          verificationRequestId: request.id,
          documentType: dto.documentType,
          encryptedStorageKey: dto.documentStorageKey,
          fileHash: docHash,
          mimeType: "image/jpeg",
          fileSizeBytes: 1024 * 1024, // 1MB estimé
        },
        {
          verificationRequestId: request.id,
          documentType: DocumentType.SELFIE,
          encryptedStorageKey: dto.selfieStorageKey,
          fileHash: selfieHash,
          mimeType: "image/jpeg",
          fileSizeBytes: 800 * 1024,
        },
      ],
    });

    // 2. Passage en statut EN COURS D'EXAMEN
    await this.prisma.verificationRequest.update({
      where: { id: request.id },
      data: {
        status: VerificationStatus.UNDER_REVIEW,
        submittedAt: new Date(),
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { status: AccountStatus.PENDING_VERIFICATION },
    });

    // 3. Exécution de l'analyse automatisée par l'adaptateur KYC
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    const expectedDob = user?.profile?.birthDate || new Date("1995-01-01");
    const kycResult = await this.kycProvider.verifyIdentity(
      dto.documentStorageKey,
      dto.selfieStorageKey,
      expectedDob,
    );

    // Si le fournisseur simulé confirme la conformité avec un score élevé
    if (kycResult.isSuccess && kycResult.faceMatchScore >= 80) {
      await this.prisma.verificationRequest.update({
        where: { id: request.id },
        data: {
          status: VerificationStatus.VERIFIED,
          reviewedAt: new Date(),
          providerTxId: kycResult.providerTxId,
        },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          status: AccountStatus.ACTIVE,
          isIdentityVerified: true,
        },
      });

      if (user?.profile) {
        await this.prisma.profile.update({
          where: { userId },
          data: { isVerifiedBadge: true },
        });
      }

      this.logger.log(`✅ Dossier KYC automatiquement approuvé pour ${userId} (Score: ${kycResult.faceMatchScore}%)`);
    }

    return {
      success: true,
      status: kycResult.isSuccess ? VerificationStatus.VERIFIED : VerificationStatus.UNDER_REVIEW,
      message: kycResult.isSuccess
        ? "Votre identité a été certifiée avec succès !"
        : "Votre dossier a été transmis à l'équipe de modération pour revue manuelle (délai < 24h).",
    };
  }

  /**
   * Consultation de l'état de vérification
   */
  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        verificationRequests: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    const latestRequest = user.verificationRequests[0];

    return {
      isIdentityVerified: user.isIdentityVerified,
      accountStatus: user.status,
      isVerifiedBadge: user.profile?.isVerifiedBadge || false,
      calculatedAge: user.profile?.calculatedAge || null,
      verificationStatus: latestRequest?.status || VerificationStatus.NOT_STARTED,
      rejectionReason: latestRequest?.rejectionReason || null,
    };
  }

  /**
   * File de modération manuelle pour le Back-Office (Rôle MODERATOR)
   */
  async getPendingQueue(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, requests] = await Promise.all([
      this.prisma.verificationRequest.count({
        where: { status: { in: [VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW] } },
      }),
      this.prisma.verificationRequest.findMany({
        where: { status: { in: [VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW] } },
        skip,
        take: limit,
        include: {
          user: {
            include: { profile: true },
          },
          documents: true,
        },
        orderBy: { submittedAt: "asc" },
      }),
    ]);

    // Génération des URLs de consultation sécurisées temporaires pour le modérateur
    const items = await Promise.all(
      requests.map(async (req) => {
        const docsWithUrls = await Promise.all(
          req.documents.map(async (doc) => ({
            ...doc,
            downloadUrl: await this.storageService.getKycDownloadSignedUrl(doc.encryptedStorageKey, 300),
          })),
        );

        return {
          ...req,
          documents: docsWithUrls,
        };
      }),
    );

    return {
      total,
      page,
      limit,
      items,
    };
  }

  /**
   * Décision motivée prise par un modérateur en Back-Office
   */
  async reviewDecision(
    moderatorId: string,
    moderatorIp: string,
    dto: ReviewKycDecisionDto,
  ) {
    const request = await this.prisma.verificationRequest.findUnique({
      where: { id: dto.verificationRequestId },
      include: { user: true },
    });

    if (!request) {
      throw new NotFoundException("Demande de vérification introuvable");
    }

    const previousStatus = request.status;

    // 1. Enregistrement de la décision
    await this.prisma.verificationDecision.create({
      data: {
        verificationRequestId: request.id,
        moderatorId,
        previousStatus,
        newStatus: dto.status,
        decisionReason: dto.decisionReason,
        comment: dto.comment,
      },
    });

    // 2. Journalisation d'audit infalsifiable
    await this.prisma.adminAuditLog.create({
      data: {
        adminId: moderatorId,
        action: `KYC_DECISION_${dto.status}`,
        entityType: "VerificationRequest",
        entityId: request.id,
        ipAddress: moderatorIp,
        metadata: {
          userId: request.userId,
          decisionReason: dto.decisionReason,
          comment: dto.comment,
        },
      },
    });

    // 3. Mise à jour de la demande
    await this.prisma.verificationRequest.update({
      where: { id: request.id },
      data: {
        status: dto.status,
        reviewedAt: new Date(),
        rejectionReason: dto.status === VerificationStatus.REJECTED ? dto.decisionReason : null,
      },
    });

    // 4. Mise à jour du statut utilisateur et du badge de profil
    if (dto.status === VerificationStatus.VERIFIED) {
      await this.prisma.user.update({
        where: { id: request.userId },
        data: {
          status: AccountStatus.ACTIVE,
          isIdentityVerified: true,
        },
      });

      await this.prisma.profile.update({
        where: { userId: request.userId },
        data: { isVerifiedBadge: true },
      });
    } else if (dto.status === VerificationStatus.REJECTED) {
      await this.prisma.user.update({
        where: { id: request.userId },
        data: {
          isIdentityVerified: false,
          status: AccountStatus.UNVERIFIED,
        },
      });
    }

    this.logger.log(`Décision de modération KYC enregistrée par ${moderatorId} : ${dto.status} pour ${request.userId}`);

    return {
      success: true,
      status: dto.status,
      message: `Décision [${dto.status}] enregistrée avec succès.`,
    };
  }

  /**
   * Politique de purge automatique des pièces KYC après 30 jours (Principe de minimisation)
   */
  async purgeExpiredDocuments(retentionDays = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    const expiredDocs = await this.prisma.verificationDocument.findMany({
      where: {
        createdAt: { lt: cutoffDate },
        isPurged: false,
      },
    });

    for (const doc of expiredDocs) {
      await this.storageService.purgeKycDocument(doc.encryptedStorageKey);
      await this.prisma.verificationDocument.update({
        where: { id: doc.id },
        data: {
          isPurged: true,
          purgedAt: new Date(),
        },
      });
    }

    this.logger.log(`🧹 Purge KYC terminée : ${expiredDocs.length} pièces physiques supprimées (hash conservés).`);
    return expiredDocs.length;
  }
}
