import { FraudDetectionService } from "./fraud-detection.service";
import { ReportCategory, ReportPriority } from "@belle-ame/shared-types";

describe("FraudDetectionService", () => {
  let service: FraudDetectionService;

  beforeEach(() => {
    service = new FraudDetectionService();
  });

  it("doit calculer correctement le ratio de similarité de Levenshtein", () => {
    const textA = "Bonjour, tu es très jolie, envoie moi ton numéro WhatsApp";
    const textB = "Bonjour, tu es très jolie, envoie moi ton numero WhatsApp"; // 1 variation

    const ratio = service.calculateSimilarityRatio(textA, textB);
    expect(ratio).toBeGreaterThan(0.95);
  });

  it("doit identifier une sollicitation financière comme CRITIQUE", () => {
    const description = "Cet utilisateur me demande un virement Western Union en urgence médicale";

    const result = service.analyzeReport(
      ReportCategory.FINANCIAL_SCAM_SOLICITATION,
      description,
      {
        recentReportsCount: 2,
        accountAgeHours: 12,
        isIdentityVerified: false,
      },
    );

    expect(result.riskScore).toBeGreaterThanOrEqual(75);
    expect(result.suggestedPriority).toBe(ReportPriority.CRITICAL);
    expect(result.detectedSignals.length).toBeGreaterThan(1);
    expect(result.requiresImmediateSuspension).toBe(true);
  });

  it("doit traiter un motif mineur avec priorité normale (SLA 24h)", () => {
    const description = "Ce profil semble inactif depuis plusieurs jours";

    const result = service.analyzeReport(
      ReportCategory.INAPPROPRIATE_PROFILE,
      description,
      {
        recentReportsCount: 0,
        accountAgeHours: 200,
        isIdentityVerified: true,
      },
    );

    expect(result.riskScore).toBeLessThan(50);
    expect(result.suggestedPriority).not.toBe(ReportPriority.CRITICAL);
    expect(result.requiresImmediateSuspension).toBe(false);
  });
});
