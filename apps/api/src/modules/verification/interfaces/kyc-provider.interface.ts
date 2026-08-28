export interface KycVerificationResult {
  isSuccess: boolean;
  provider: string;
  providerTxId: string;
  faceMatchScore: number; // 0 à 100
  isLiveFace: boolean;
  extractedBirthDate?: Date;
  extractedFullName?: string;
  documentNumberMasked?: string;
  confidenceScore: number;
  failureReason?: string;
}

export interface IKycProvider {
  readonly providerName: string;
  verifyIdentity(
    documentStorageKey: string,
    selfieStorageKey: string,
    expectedBirthDate: Date,
  ): Promise<KycVerificationResult>;
}
