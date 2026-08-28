import { Injectable, Logger } from "@nestjs/common";
import { IKycProvider, KycVerificationResult } from "../interfaces/kyc-provider.interface";

@Injectable()
export class MockKycProvider implements IKycProvider {
  readonly providerName = "MOCK_TEST_KYC_PROVIDER";
  private readonly logger = new Logger(MockKycProvider.name);

  // Configuration dynamique pour simuler des scénarios de test
  public shouldSucceed = true;
  public mockFaceMatchScore = 96.5;

  async verifyIdentity(
    documentStorageKey: string,
    selfieStorageKey: string,
    expectedBirthDate: Date,
  ): Promise<KycVerificationResult> {
    this.logger.warn(
      `[MODE TEST EXPLICITE - FOURNISSEUR KYC SIMULÉ] Analyse de la pièce (${documentStorageKey}) et du selfie (${selfieStorageKey})`,
    );

    const txId = `mock-kyc-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    if (!this.shouldSucceed) {
      return {
        isSuccess: false,
        provider: this.providerName,
        providerTxId: txId,
        faceMatchScore: 42.0,
        isLiveFace: false,
        confidenceScore: 35.0,
        failureReason: "La ressemblance faciale entre le selfie et la pièce officielle est insuffisante (< 80%).",
      };
    }

    return {
      isSuccess: true,
      provider: this.providerName,
      providerTxId: txId,
      faceMatchScore: this.mockFaceMatchScore,
      isLiveFace: true,
      extractedBirthDate: expectedBirthDate,
      extractedFullName: "Utilisateur Test Vérifié",
      documentNumberMasked: "CNI-***-789",
      confidenceScore: 98.2,
    };
  }
}
