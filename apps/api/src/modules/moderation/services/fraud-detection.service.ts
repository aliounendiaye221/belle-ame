import { Injectable, Logger } from "@nestjs/common";
import { ReportPriority, ReportCategory } from "@belle-ame/shared-types";

export interface FraudAnalysisResult {
  riskScore: number; // 0 à 100
  suggestedPriority: ReportPriority;
  detectedSignals: string[];
  requiresImmediateSuspension: boolean;
}

@Injectable()
export class FraudDetectionService {
  private readonly logger = new Logger(FraudDetectionService.name);

  // Mots-clés de sollicitation financière et escroquerie sentimentale
  private readonly FINANCIAL_PATTERNS = [
    /western\s+union/i,
    /moneygram/i,
    /orange\s+money/i,
    /wave/i,
    /mtn\s+momo/i,
    /virement\s+(bancaire|urgent)/i,
    /dépann(er|age)\s+(financier|d'argent)/i,
    /urgence\s+médicale/i,
    /envoyer\s+de\s+l'argent/i,
    /problème\s+de\s+famille\s+grave/i,
  ];

  // Détection de liens suspects externes
  private readonly SUSPICIOUS_URL_PATTERN =
    /(https?:\/\/(?!belleame\.africa)[^\s]+|t\.me\/[^\s]+|wa\.me\/[^\s]+)/i;

  /**
   * Calcul de la distance de Levenshtein entre deux chaînes pour détection de spam cloné
   */
  public calculateLevenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0]![j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i]![j] = matrix[i - 1]![j - 1]!;
        } else {
          matrix[i]![j] = Math.min(
            matrix[i - 1]![j - 1]! + 1,
            matrix[i]![j - 1]! + 1,
            matrix[i - 1]![j]! + 1,
          );
        }
      }
    }

    return matrix[b.length]![a.length]!;
  }

  /**
   * Calcule le ratio de similarité textuelle (0 à 1)
   */
  public calculateSimilarityRatio(a: string, b: string): number {
    if (!a.length && !b.length) return 1;
    if (!a.length || !b.length) return 0;
    const distance = this.calculateLevenshteinDistance(a, b);
    const maxLen = Math.max(a.length, b.length);
    return 1 - distance / maxLen;
  }

  /**
   * Analyse globale du signalement et des signaux suspects
   */
  public analyzeReport(
    category: ReportCategory,
    description: string,
    history: {
      recentReportsCount: number;
      accountAgeHours: number;
      isIdentityVerified: boolean;
    },
  ): FraudAnalysisResult {
    let riskScore = 0;
    const detectedSignals: string[] = [];

    // 1. Gravité intrinsèque de la catégorie
    switch (category) {
      case ReportCategory.FINANCIAL_SCAM_SOLICITATION:
        riskScore += 45;
        detectedSignals.push("Catégorie : Sollicitation financière ou tentative d'escroquerie");
        break;
      case ReportCategory.UNDERAGE_SUSPICION:
        riskScore += 50;
        detectedSignals.push("Catégorie : Suspicion d'utilisateur mineur");
        break;
      case ReportCategory.IDENTITY_THEFT:
        riskScore += 35;
        detectedSignals.push("Catégorie : Usurpation d'identité déclarée");
        break;
      case ReportCategory.OBSCENE_PHOTO:
        riskScore += 30;
        detectedSignals.push("Catégorie : Cliché obscène ou inapproprié");
        break;
      default:
        riskScore += 15;
    }

    // 2. Mots-clés financiers dans la description ou les preuves
    for (const pattern of this.FINANCIAL_PATTERNS) {
      if (pattern.test(description)) {
        riskScore += 25;
        detectedSignals.push(`Mot-clé financier détecté : ${pattern.source}`);
        break;
      }
    }

    // 3. Détection de liens suspects hors plateforme
    if (this.SUSPICIOUS_URL_PATTERN.test(description)) {
      riskScore += 20;
      detectedSignals.push("Lien externe suspect détecté (ex: Telegram / WhatsApp hors app)");
    }

    // 4. Historique de signalements multiples
    if (history.recentReportsCount >= 3) {
      riskScore += 30;
      detectedSignals.push(`Signalements multiples répétés (${history.recentReportsCount} signalements récents)`);
    } else if (history.recentReportsCount >= 1) {
      riskScore += 15;
      detectedSignals.push("Antécédent de signalement enregistré");
    }

    // 5. Compte très récent (< 24h)
    if (history.accountAgeHours < 24) {
      riskScore += 15;
      detectedSignals.push("Compte créé il y a moins de 24 heures");
    }

    const finalScore = Math.min(100, riskScore);

    // Détermination de la priorité
    let suggestedPriority: ReportPriority = ReportPriority.LOW;
    if (finalScore >= 75) {
      suggestedPriority = ReportPriority.CRITICAL;
    } else if (finalScore >= 50) {
      suggestedPriority = ReportPriority.HIGH;
    } else if (finalScore >= 30) {
      suggestedPriority = ReportPriority.MEDIUM;
    }

    // Mesure conservative : suspension temporaire automatique pour revue humaine immédiate si score critique
    const requiresImmediateSuspension = finalScore >= 80;

    return {
      riskScore: finalScore,
      suggestedPriority,
      detectedSignals,
      requiresImmediateSuspension,
    };
  }
}
