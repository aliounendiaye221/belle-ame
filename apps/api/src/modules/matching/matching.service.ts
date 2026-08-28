import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  AccountStatus,
  Gender,
  FamilyStatus,
  NotificationType,
  NotificationChannel,
  SubscriptionStatus,
  PhotoModerationStatus,
} from "@belle-ame/shared-types";

export interface CandidateScore {
  userId: string;
  firstName: string;
  calculatedAge: number;
  city: string;
  country: string;
  bio?: string | null;
  occupation?: string | null;
  educationLevel?: string | null;
  personalValues: string[];
  familyStatus?: FamilyStatus | null;
  isVerifiedBadge: boolean;
  completionRate: number;
  mainPhotoUrl?: string;
  totalScore: number;
  scoreBreakdown: {
    ageScore: number;
    geoScore: number;
    valuesScore: number;
    interestsScore: number;
    familyScore: number;
    completionScore: number;
    verificationBonus: number;
    inactivityPenalty: number;
  };
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  // Quotas quotidiens de coups de cœur / suggestions
  private readonly DAILY_QUOTA_FREE = 10;
  private readonly DAILY_QUOTA_PREMIUM = 50;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcul de l'indice de similarité de Jaccard entre deux ensembles de chaînes
   * J(A, B) = |A ∩ B| / |A ∪ B| * 100
   */
  public calculateJaccardScore(setA: string[], setB: string[]): number {
    if (!setA.length || !setB.length) return 0;

    const lowerA = new Set(setA.map((s) => s.toLowerCase().trim()));
    const lowerB = new Set(setB.map((s) => s.toLowerCase().trim()));

    let intersectionCount = 0;
    lowerA.forEach((item) => {
      if (lowerB.has(item)) intersectionCount++;
    });

    const unionSize = new Set([...lowerA, ...lowerB]).size;
    if (unionSize === 0) return 0;

    return Math.round((intersectionCount / unionSize) * 100);
  }

  /**
   * Formule mathématique déterministe de compatibilité (0 à 100)
   */
  public calculateCompatibilityScore(
    viewer: {
      calculatedAge: number;
      city: string;
      country: string;
      personalValues: string[];
      interests: string[];
      familyStatus?: FamilyStatus | null;
      completionRate: number;
      isVerifiedBadge: boolean;
      minAge: number;
      maxAge: number;
    },
    candidate: {
      calculatedAge: number;
      city: string;
      country: string;
      personalValues: string[];
      interests: string[];
      familyStatus?: FamilyStatus | null;
      completionRate: number;
      isVerifiedBadge: boolean;
      lastActiveAt: Date;
      minAge: number;
      maxAge: number;
    },
  ): { totalScore: number; breakdown: CandidateScore["scoreBreakdown"] } {
    // 1. Âge (20%)
    let ageScore = 100;
    if (candidate.calculatedAge < viewer.minAge || candidate.calculatedAge > viewer.maxAge) {
      const delta = Math.min(
        Math.abs(candidate.calculatedAge - viewer.minAge),
        Math.abs(candidate.calculatedAge - viewer.maxAge),
      );
      ageScore = Math.max(0, 100 - delta * 15);
    }

    // 2. Géographie (25%)
    let geoScore = 0;
    if (viewer.city.toLowerCase() === candidate.city.toLowerCase()) {
      geoScore = 100;
    } else if (viewer.country.toLowerCase() === candidate.country.toLowerCase()) {
      geoScore = 65;
    } else {
      geoScore = 30; // Zone régionale francophone limitrophe
    }

    // 3. Valeurs Partagées (20%)
    const valuesScore = this.calculateJaccardScore(viewer.personalValues, candidate.personalValues);

    // 4. Centres d'intérêt (15%)
    const interestsScore = this.calculateJaccardScore(viewer.interests, candidate.interests);

    // 5. Situation Familiale (10%)
    let familyScore = 50;
    if (viewer.familyStatus && candidate.familyStatus) {
      familyScore = viewer.familyStatus === candidate.familyStatus ? 100 : 70;
    }

    // 6. Taux de complétion (10%)
    const completionScore = Math.min(viewer.completionRate, candidate.completionRate);

    // 7. Bonus de vérification (+5 pts si les deux profils sont certifiés)
    const verificationBonus = viewer.isVerifiedBadge && candidate.isVerifiedBadge ? 5 : 0;

    // 8. Pénalité d'inactivité (-5 pts par semaine d'inactivité au-delà de 48h)
    const inactiveDays = Math.floor((Date.now() - candidate.lastActiveAt.getTime()) / (24 * 3600 * 1000));
    const inactivityPenalty = inactiveDays > 2 ? Math.min(Math.floor((inactiveDays - 2) / 7) * 5, 20) : 0;

    // Calcul pondéré
    const weighted =
      ageScore * 0.2 +
      geoScore * 0.25 +
      valuesScore * 0.2 +
      interestsScore * 0.15 +
      familyScore * 0.1 +
      completionScore * 0.1 +
      verificationBonus -
      inactivityPenalty;

    const totalScore = Math.min(100, Math.max(0, Math.round(weighted)));

    return {
      totalScore,
      breakdown: {
        ageScore,
        geoScore,
        valuesScore,
        interestsScore,
        familyScore,
        completionScore,
        verificationBonus,
        inactivityPenalty,
      },
    };
  }

  /**
   * Vérifie si l'utilisateur est abonné Premium actif
   */
  async isUserPremium(userId: string): Promise<boolean> {
    const sub = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: { gt: new Date() },
      },
    });
    return !!sub;
  }

  /**
   * Flux de suggestions quotidiennes paginé avec score et quotas
   */
  async getDailyFeed(userId: string, page = 1, limit = 10): Promise<{ candidates: CandidateScore[]; totalAvailable: number; dailyQuotaRemaining: number }> {
    // 1. Récupérer le profil et préférences du demandeur
    const viewer = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            interests: true,
            preference: true,
          },
        },
      },
    });

    if (!viewer || !viewer.profile) {
      throw new BadRequestException("Veuillez compléter votre profil pour accéder aux suggestions.");
    }

    const isPremium = await this.isUserPremium(userId);
    const dailyLimit = isPremium ? this.DAILY_QUOTA_PREMIUM : this.DAILY_QUOTA_FREE;

    // 2. Compter le nombre de likes envoyés aujourd'hui pour vérifier le quota
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const todayLikesCount = await this.prisma.like.count({
      where: {
        senderId: userId,
        createdAt: { gte: todayMidnight },
      },
    });

    const dailyQuotaRemaining = Math.max(0, dailyLimit - todayLikesCount);

    // 3. Exclusions strictes :
    // - Pas soi-même
    // - Pas de personnes bloquées (dans les deux sens)
    // - Pas de personnes déjà likées
    // - Uniquement des profils ACTIVE
    const blockedUserIds = (
      await this.prisma.block.findMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
        select: { blockerId: true, blockedId: true },
      })
    ).flatMap((b) => [b.blockerId, b.blockedId]);

    const alreadyLikedIds = (
      await this.prisma.like.findMany({
        where: { senderId: userId },
        select: { receiverId: true },
      })
    ).map((l) => l.receiverId);

    const excludedIds = Array.from(new Set([userId, ...blockedUserIds, ...alreadyLikedIds]));

    // Filtre de genre selon les préférences
    const targetGenders = viewer.profile.preference?.targetGenders.length
      ? viewer.profile.preference.targetGenders
      : [viewer.profile.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE];

    // 4. Récupération des candidats éligibles
    const candidates = await this.prisma.user.findMany({
      where: {
        id: { notIn: excludedIds },
        status: AccountStatus.ACTIVE,
        isIdentityVerified: true,
        profile: {
          gender: { in: targetGenders },
        },
      },
      include: {
        profile: {
          include: {
            interests: true,
            preference: true,
            photos: {
              where: { moderationStatus: PhotoModerationStatus.APPROVED, isMain: true },
              take: 1,
            },
          },
        },
      },
      take: 100, // Pool de candidats pour tri déterministe
    });

    const viewerPref = viewer.profile.preference;
    const viewerData = {
      calculatedAge: viewer.profile.calculatedAge,
      city: viewer.profile.city,
      country: viewer.profile.country,
      personalValues: viewer.profile.personalValues,
      interests: viewer.profile.interests.map((i) => i.name),
      familyStatus: viewer.profile.familyStatus as unknown as FamilyStatus,
      completionRate: viewer.profile.completionRate,
      isVerifiedBadge: viewer.profile.isVerifiedBadge,
      minAge: viewerPref?.minAge || 18,
      maxAge: viewerPref?.maxAge || 60,
    };

    // 5. Calcul des scores pour chaque candidat
    const scoredCandidates: CandidateScore[] = candidates
      .filter((c) => c.profile !== null)
      .map((c) => {
        const p = c.profile!;
        const candPref = p.preference;

        const { totalScore, breakdown } = this.calculateCompatibilityScore(viewerData, {
          calculatedAge: p.calculatedAge,
          city: p.city,
          country: p.country,
          personalValues: p.personalValues,
          interests: p.interests.map((i) => i.name),
          familyStatus: p.familyStatus as unknown as FamilyStatus,
          completionRate: p.completionRate,
          isVerifiedBadge: p.isVerifiedBadge,
          lastActiveAt: c.lastActiveAt,
          minAge: candPref?.minAge || 18,
          maxAge: candPref?.maxAge || 60,
        });

        return {
          userId: c.id,
          firstName: p.firstName,
          calculatedAge: p.calculatedAge,
          city: p.city,
          country: p.country,
          bio: p.bio,
          occupation: p.occupation,
          educationLevel: p.educationLevel,
          personalValues: p.personalValues,
          familyStatus: p.familyStatus as unknown as FamilyStatus,
          isVerifiedBadge: p.isVerifiedBadge,
          completionRate: p.completionRate,
          mainPhotoUrl: p.photos[0]?.url,
          totalScore,
          scoreBreakdown: breakdown,
        };
      });

    // 6. Tri décroissant par score de compatibilité
    scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);

    const skip = (page - 1) * limit;
    const paginated = scoredCandidates.slice(skip, skip + limit);

    return {
      candidates: paginated,
      totalAvailable: scoredCandidates.length,
      dailyQuotaRemaining,
    };
  }

  /**
   * Envoi d'un Like / Coup de cœur avec détection de match réciproque
   */
  async sendLike(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException("Impossible d'envoyer un coup de cœur à soi-même.");
    }

    // 1. Vérification du quota quotidien
    const isPremium = await this.isUserPremium(senderId);
    const dailyLimit = isPremium ? this.DAILY_QUOTA_PREMIUM : this.DAILY_QUOTA_FREE;

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const todayLikesCount = await this.prisma.like.count({
      where: {
        senderId,
        createdAt: { gte: todayMidnight },
      },
    });

    if (todayLikesCount >= dailyLimit) {
      throw new ForbiddenException({
        code: "DISCOVERY_DAILY_QUOTA_EXCEEDED",
        message: `Vous avez atteint votre quota quotidien de ${dailyLimit} coups de cœur. Passez à l'offre Premium pour débloquer davantage de suggestions !`,
      });
    }

    // 2. Enregistrement ou mise à jour du Like
    const like = await this.prisma.like.upsert({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
      update: {},
      create: { senderId, receiverId },
    });

    // 3. Vérification si le destinataire a également liké l'expéditeur (MATCH MUTUEL)
    const reciprocalLike = await this.prisma.like.findUnique({
      where: {
        senderId_receiverId: { senderId: receiverId, receiverId: senderId },
      },
    });

    if (reciprocalLike) {
      // MATCH MUTUEL CONFIRMÉ !
      await this.prisma.like.updateMany({
        where: {
          OR: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        data: { isMutual: true },
      });

      // Ordonnancement canonique des IDs pour la contrainte d'unicité
      const [u1, u2] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

      const match = await this.prisma.match.upsert({
        where: {
          user1Id_user2Id: { user1Id: u1, user2Id: u2 },
        },
        update: { isActive: true },
        create: {
          user1Id: u1,
          user2Id: u2,
          isActive: true,
        },
      });

      // Création automatique de la conversation liée
      const conversation = await this.prisma.conversation.upsert({
        where: { matchId: match.id },
        update: {},
        create: {
          matchId: match.id,
          members: {
            create: [{ userId: senderId }, { userId: receiverId }],
          },
        },
      });

      // Création de notifications in-app pour les deux membres
      await this.prisma.notification.createMany({
        data: [
          {
            userId: senderId,
            type: NotificationType.NEW_MATCH,
            channel: NotificationChannel.IN_APP,
            title: "C'est un Match mutuel !",
            body: "Vous avez un coup de cœur partagé. Vous pouvez dès maintenant échanger en toute confiance.",
            metadata: { matchId: match.id, conversationId: conversation.id },
          },
          {
            userId: receiverId,
            type: NotificationType.NEW_MATCH,
            channel: NotificationChannel.IN_APP,
            title: "C'est un Match mutuel !",
            body: "Vous avez un coup de cœur partagé. Vous pouvez dès maintenant échanger en toute confiance.",
            metadata: { matchId: match.id, conversationId: conversation.id },
          },
        ],
      });

      this.logger.log(`💖 MATCH MUTUEL créé entre ${senderId} et ${receiverId} (Match: ${match.id})`);

      return {
        isMatch: true,
        matchId: match.id,
        conversationId: conversation.id,
        message: "Félicitations ! C'est un accord mutuel. La conversation est désormais ouverte.",
      };
    }

    return {
      isMatch: false,
      message: "Coup de cœur envoyé avec discrétion.",
    };
  }

  /**
   * Liste des matchs actifs
   */
  async getMatches(userId: string) {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        isActive: true,
      },
      include: {
        conversation: {
          select: { id: true, lastMessageAt: true },
        },
        user1: {
          include: {
            profile: {
              select: {
                firstName: true,
                calculatedAge: true,
                city: true,
                photos: { where: { isMain: true, moderationStatus: PhotoModerationStatus.APPROVED }, take: 1 },
              },
            },
          },
        },
        user2: {
          include: {
            profile: {
              select: {
                firstName: true,
                calculatedAge: true,
                city: true,
                photos: { where: { isMain: true, moderationStatus: PhotoModerationStatus.APPROVED }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return matches.map((m) => {
      const partner = m.user1Id === userId ? m.user2 : m.user1;
      return {
        matchId: m.id,
        conversationId: m.conversation?.id,
        matchedAt: m.createdAt,
        partner: {
          id: partner.id,
          firstName: partner.profile?.firstName || "Membre",
          calculatedAge: partner.profile?.calculatedAge,
          city: partner.profile?.city,
          mainPhotoUrl: partner.profile?.photos[0]?.url,
        },
      };
    });
  }

  /**
   * Annulation d'un match (ferme la conversation)
   */
  async cancelMatch(userId: string, matchId: string) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!match || (match.user1Id !== userId && match.user2Id !== userId)) {
      throw new NotFoundException("Match introuvable.");
    }

    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        isActive: false,
        cancelledById: userId,
      },
    });

    return { success: true, message: "Match annulé. La conversation a été fermée." };
  }

  /**
   * Liste des coups de cœur reçus (floutés ou masqués pour les comptes gratuits)
   */
  async getLikesReceived(userId: string) {
    const isPremium = await this.isUserPremium(userId);

    const likes = await this.prisma.like.findMany({
      where: {
        receiverId: userId,
        isMutual: false,
      },
      include: {
        sender: {
          include: {
            profile: {
              select: {
                firstName: true,
                calculatedAge: true,
                city: true,
                photos: { where: { isMain: true, moderationStatus: PhotoModerationStatus.APPROVED }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!isPremium) {
      // Pour les comptes gratuits : nombre visible mais identité partiellement masquée
      return {
        isPremium: false,
        totalLikesReceived: likes.length,
        message: "Passez à l'offre Premium pour découvrir qui a eu un coup de cœur pour vous !",
        likes: likes.map((l) => ({
          likeId: l.id,
          sentAt: l.createdAt,
          partnerMasked: {
            city: l.sender.profile?.city,
            calculatedAge: l.sender.profile?.calculatedAge,
          },
        })),
      };
    }

    return {
      isPremium: true,
      totalLikesReceived: likes.length,
      likes: likes.map((l) => ({
        likeId: l.id,
        sentAt: l.createdAt,
        partner: {
          id: l.sender.id,
          firstName: l.sender.profile?.firstName,
          calculatedAge: l.sender.profile?.calculatedAge,
          city: l.sender.profile?.city,
          mainPhotoUrl: l.sender.profile?.photos[0]?.url,
        },
      })),
    };
  }
}
