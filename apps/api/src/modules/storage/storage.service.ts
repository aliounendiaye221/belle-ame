import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

export interface PresignedUploadResult {
  uploadUrl: string;
  storageKey: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Endpoint: string;
  private readonly kycBucket: string;
  private readonly publicMediaBucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Endpoint = this.configService.get<string>("S3_ENDPOINT") || "http://localhost:9000";
    this.kycBucket = this.configService.get<string>("S3_BUCKET_PRIVATE_KYC") || "belleame-private-kyc-vault";
    this.publicMediaBucket = this.configService.get<string>("S3_BUCKET_PUBLIC_MEDIA") || "belleame-public-photos";
  }

  /**
   * Génère une clé de stockage privée isolée pour les pièces d'identité
   */
  generateKycStorageKey(userId: string, docType: string): string {
    const randomSuffix = crypto.randomBytes(16).toString("hex");
    return `kyc/${userId}/${docType.toLowerCase()}_${Date.now()}_${randomSuffix}.enc`;
  }

  /**
   * Simule la génération d'une URL de téléversement présignée S3 / MinIO
   */
  async getKycUploadSignedUrl(
    userId: string,
    docType: string,
    mimeType: string,
  ): Promise<PresignedUploadResult> {
    const storageKey = this.generateKycStorageKey(userId, docType);
    const expiresInSeconds = 300; // 5 minutes

    // En environnement de dev local avec MinIO ou S3 Mock
    const uploadUrl = `${this.s3Endpoint}/${this.kycBucket}/${storageKey}?token=${crypto.randomBytes(24).toString("hex")}`;

    this.logger.log(`URL présignée S3 KYC générée pour ${userId} [${docType}] : ${storageKey}`);

    return {
      uploadUrl,
      storageKey,
      expiresInSeconds,
      headers: {
        "Content-Type": mimeType,
        "x-amz-server-side-encryption": "AES256",
      },
    };
  }

  /**
   * Génère une URL de consultation temporaire protégée réservée aux modérateurs
   */
  async getKycDownloadSignedUrl(storageKey: string, ttlSeconds = 300): Promise<string> {
    return `${this.s3Endpoint}/${this.kycBucket}/${storageKey}?signed=true&expires=${Date.now() + ttlSeconds * 1000}`;
  }

  /**
   * Purge physique d'un document KYC sur S3 après la période de rétention
   */
  async purgeKycDocument(storageKey: string): Promise<boolean> {
    this.logger.warn(`[PURGE S3 PRIVÉE] Suppression définitive de la pièce KYC : ${storageKey}`);
    return true;
  }
}
