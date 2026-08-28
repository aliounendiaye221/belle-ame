import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { MediaService } from "../media/media.service";
import {
  PhotoModerationStatus,
  Gender,
  FamilyStatus,
  CreateProfileDto,
  UpdatePreferencesDto,
} from "@belle-ame/shared-types";

export interface PublicProfileView {
  id: string;
  userId: string;
  firstName: string;
  calculatedAge: number;
  gender: Gender;
  city: string;
  country: string;
  occupation?: string | null;
  educationLevel?: string | null;
  bio?: string | null;
  relationshipGoal?: string | null;
  personalValues: string[];
  familyStatus?: FamilyStatus | null;
  completionRate: number;
  isVerifiedBadge: boolean;
  lastActiveStatus: string;
  photos: Array<{
    id: string;
    url: string;
    thumbnailUrl: string;
    isMain: boolean;
    order: number;
  }>;
  interests: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Formatage respectueux de la vie privée pour la dernière activité
   */
  public formatPrivacyFriendlyLastActive(lastActiveAt: Date): string {
    const diffMs = Date.now() - lastActiveAt.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 15) return "En ligne";
    if (diffHours < 24) return "Actif aujourd'hui";
    if (diffDays < 7) return "Actif cette semaine";
    return "Actif récemment";
  }

  /**
   * Calcul déterministe du taux de complétion du profil (0 à 100%)
   */
  public calculateCompletionRate(profile: {
    firstName?: string | null;
    birthDate?: Date | null;
    city?: string | null;
    bio?: string | null;
    personalValues?: string[] | null;
    occupation?: string | null;
    educationLevel?: string | null;
    familyStatus?: FamilyStatus | null;
    photosCount?: number;
    interestsCount?: number;
    hasPreferences?: boolean;
  }): number {
    let score = 0;

    if (profile.firstName && profile.birthDate) score += 20; // Identité de base
    if (profile.city) score += 15; // Localisation
    if (profile.bio && profile.bio.length >= 30) score += 20; // Présentation sincère
    if (profile.personalValues && profile.personalValues.length >= 2) score += 10; // Valeurs
    if (profile.interestsCount && profile.interestsCount >= 2) score += 10; // Centres d'intérêt
    if (profile.occupation || profile.educationLevel) score += 10; // Vie pro/études
    if (profile.familyStatus) score += 5; // Situation familiale
    if (profile.photosCount && profile.photosCount >= 1) score += 10; // Au moins une photo

    return Math.min(score, 100);
  }

  /**
   * Consultation de son propre profil (avec état de toutes ses photos)
   */
  async getMyProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        photos: { orderBy: { order: "asc" } },
        interests: true,
        preference: true,
      },
    });

    if (!profile) {
      throw new NotFoundException({
        code: "PROFILE_NOT_FOUND",
        message: "Profil non initialisé. Veuillez déclarer votre date de naissance.",
      });
    }

    return profile;
  }

  /**
   * Consultation d'un profil public avec contrôle des blocages et filtrage des photos
   */
  async getPublicProfile(targetUserId: string, viewerUserId: string): Promise<PublicProfileView> {
    // 1. Vérifier si un blocage existe entre les deux utilisateurs
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: viewerUserId, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: viewerUserId },
        ],
      },
    });

    if (block) {
      throw new NotFoundException("Profil indisponible.");
    }

    // 2. Récupérer le profil et l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        profile: {
          include: {
            photos: {
              where: { moderationStatus: PhotoModerationStatus.APPROVED },
              orderBy: { order: "asc" },
            },
            interests: true,
          },
        },
      },
    });

    if (!user || !user.profile) {
      throw new NotFoundException("Profil introuvable.");
    }

    // 3. Enregistrer la visite de profil (sans doublon immédiat)
    if (viewerUserId !== targetUserId) {
      await this.prisma.profileView.upsert({
        where: {
          viewerId_targetId: {
            viewerId: viewerUserId,
            targetId: targetUserId,
          },
        },
        update: { createdAt: new Date() },
        create: {
          viewerId: viewerUserId,
          targetId: targetUserId,
        },
      });
    }

    const p = user.profile;

    return {
      id: p.id,
      userId: user.id,
      firstName: p.firstName,
      calculatedAge: p.calculatedAge,
      gender: p.gender as unknown as Gender,
      city: p.city,
      country: p.country,
      occupation: p.occupation,
      educationLevel: p.educationLevel,
      bio: p.bio,
      relationshipGoal: p.relationshipGoal,
      personalValues: p.personalValues,
      familyStatus: p.familyStatus as unknown as FamilyStatus,
      completionRate: p.completionRate,
      isVerifiedBadge: p.isVerifiedBadge,
      lastActiveStatus: this.formatPrivacyFriendlyLastActive(user.lastActiveAt),
      photos: p.photos.map((ph) => ({
        id: ph.id,
        url: ph.url,
        thumbnailUrl: ph.thumbnailUrl,
        isMain: ph.isMain,
        order: ph.order,
      })),
      interests: p.interests.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
      })),
    };
  }

  /**
   * Mise à jour des informations de profil
   */
  async updateProfile(userId: string, dto: Partial<CreateProfileDto>) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true, interests: true },
    });

    if (!profile) {
      throw new NotFoundException("Profil non trouvé.");
    }

    // Mise à jour des centres d'intérêt si spécifiés
    if (dto.interestIds) {
      await this.prisma.profile.update({
        where: { userId },
        data: {
          interests: {
            set: dto.interestIds.map((id) => ({ id })),
          },
        },
      });
    }

    // Recalcul du taux de complétion
    const newCompletionRate = this.calculateCompletionRate({
      firstName: dto.firstName || profile.firstName,
      birthDate: profile.birthDate,
      city: dto.city || profile.city,
      bio: dto.bio || profile.bio,
      personalValues: dto.personalValues || profile.personalValues,
      occupation: dto.occupation || profile.occupation,
      educationLevel: dto.educationLevel || profile.educationLevel,
      familyStatus: (dto.familyStatus || profile.familyStatus) as unknown as FamilyStatus,
      photosCount: profile.photos.length,
      interestsCount: dto.interestIds ? dto.interestIds.length : profile.interests.length,
    });

    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        firstName: dto.firstName,
        gender: dto.gender,
        city: dto.city,
        country: dto.country,
        occupation: dto.occupation,
        educationLevel: dto.educationLevel,
        bio: dto.bio,
        relationshipGoal: dto.relationshipGoal,
        personalValues: dto.personalValues,
        familyStatus: dto.familyStatus,
        completionRate: newCompletionRate,
      },
      include: { photos: true, interests: true },
    });

    return updated;
  }

  /**
   * Mise à jour des préférences de recherche
   */
  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Profil introuvable.");

    return this.prisma.preference.upsert({
      where: { profileId: profile.id },
      update: {
        targetGenders: dto.targetGenders,
        minAge: dto.minAge,
        maxAge: dto.maxAge,
        targetCountries: dto.targetCountries,
        targetCities: dto.targetCities,
        targetFamilyStatus: dto.targetFamilyStatus,
      },
      create: {
        profileId: profile.id,
        targetGenders: dto.targetGenders,
        minAge: dto.minAge,
        maxAge: dto.maxAge,
        targetCountries: dto.targetCountries,
        targetCities: dto.targetCities,
        targetFamilyStatus: dto.targetFamilyStatus,
      },
    });
  }

  /**
   * Ajout d'une photo de profil (avec pipeline EXIF, compression WebP et modération)
   */
  async addPhoto(userId: string, fileBuffer: Buffer, mimeType: string, isMain = false) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) throw new NotFoundException("Profil introuvable.");

    // Règle : maximum 6 photos par profil
    if (profile.photos.length >= 6) {
      throw new BadRequestException({
        code: "PROFILE_MAX_PHOTOS_EXCEEDED",
        message: "Vous ne pouvez pas ajouter plus de 6 photos à votre profil.",
      });
    }

    // 1. Pipeline de traitement média
    const processed = await this.mediaService.processProfilePhoto(userId, fileBuffer, mimeType);
    const safety = await this.mediaService.automatedSafetyCheck(fileBuffer);

    const firstPhoto = profile.photos.length === 0;
    const shouldBeMain = firstPhoto || isMain;

    if (shouldBeMain) {
      await this.prisma.photo.updateMany({
        where: { profileId: profile.id },
        data: { isMain: false },
      });
    }

    // 2. Création de la photo
    const photo = await this.prisma.photo.create({
      data: {
        profileId: profile.id,
        url: processed.publicUrl,
        storageKey: processed.originalStorageKey,
        thumbnailUrl: processed.thumbnailUrl,
        order: profile.photos.length,
        isMain: shouldBeMain,
        moderationStatus: safety.isSafe ? PhotoModerationStatus.APPROVED : PhotoModerationStatus.PENDING,
        rejectionReason: safety.isSafe ? null : safety.reason,
      },
    });

    // 3. Mise à jour du taux de complétion
    const newCompletion = this.calculateCompletionRate({
      firstName: profile.firstName,
      birthDate: profile.birthDate,
      city: profile.city,
      bio: profile.bio,
      personalValues: profile.personalValues,
      occupation: profile.occupation,
      educationLevel: profile.educationLevel,
      familyStatus: profile.familyStatus as unknown as FamilyStatus,
      photosCount: profile.photos.length + 1,
    });

    await this.prisma.profile.update({
      where: { id: profile.id },
      data: { completionRate: newCompletion },
    });

    return photo;
  }

  /**
   * Suppression d'une photo
   */
  async deletePhoto(userId: string, photoId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) throw new NotFoundException("Profil introuvable.");

    const photo = profile.photos.find((p) => p.id === photoId);
    if (!photo) throw new NotFoundException("Photo introuvable sur ce profil.");

    await this.prisma.photo.delete({ where: { id: photoId } });

    // Si c'était la photo principale, on promeut la première restante
    if (photo.isMain && profile.photos.length > 1) {
      const remaining = profile.photos.filter((p) => p.id !== photoId);
      if (remaining[0]) {
        await this.prisma.photo.update({
          where: { id: remaining[0].id },
          data: { isMain: true },
        });
      }
    }

    return { success: true, message: "Photo supprimée." };
  }

  /**
   * Définition de la photo principale
   */
  async setMainPhoto(userId: string, photoId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) throw new NotFoundException("Profil introuvable.");

    const photo = profile.photos.find((p) => p.id === photoId);
    if (!photo) throw new NotFoundException("Photo introuvable.");

    if (photo.moderationStatus !== PhotoModerationStatus.APPROVED) {
      throw new BadRequestException({
        code: "PHOTO_NOT_APPROVED",
        message: "Seule une photo approuvée par la modération peut être définie comme photo principale.",
      });
    }

    await this.prisma.photo.updateMany({
      where: { profileId: profile.id },
      data: { isMain: false },
    });

    return this.prisma.photo.update({
      where: { id: photoId },
      data: { isMain: true },
    });
  }

  /**
   * File des photos en attente de modération pour le Back-Office
   */
  async getPendingPhotosQueue(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, photos] = await Promise.all([
      this.prisma.photo.count({
        where: { moderationStatus: PhotoModerationStatus.PENDING },
      }),
      this.prisma.photo.findMany({
        where: { moderationStatus: PhotoModerationStatus.PENDING },
        skip,
        take: limit,
        include: {
          profile: {
            select: { firstName: true, calculatedAge: true, userId: true },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    return { total, page, limit, photos };
  }

  /**
   * Décision de modération sur une photo
   */
  async decidePhotoModeration(
    moderatorId: string,
    photoId: string,
    status: PhotoModerationStatus,
    reason?: string,
  ) {
    const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
    if (!photo) throw new NotFoundException("Photo introuvable.");

    const updated = await this.prisma.photo.update({
      where: { id: photoId },
      data: {
        moderationStatus: status,
        rejectionReason: status === PhotoModerationStatus.REJECTED ? reason : null,
      },
    });

    await this.prisma.adminAuditLog.create({
      data: {
        adminId: moderatorId,
        action: `PHOTO_MODERATION_${status}`,
        entityType: "Photo",
        entityId: photoId,
        metadata: { status, reason },
      },
    });

    return updated;
  }
}
