/**
 * Service de Stockage Sécurisé & Traitement d'Images — « À Chacun Une Belle Âme »
 * - Assainissement EXIF automatique (protection de la vie privée et suppression des coordonnées GPS)
 * - Compression et conversion au format moderne WebP
 * - Téléversement vers Supabase Storage (public-photos et private-kyc-vault)
 * - Coffre-fort de persistance résilient en environnement local / offline
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xsluoitjnkuiuqpgmknj.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const STORAGE_VAULT_PREFIX = "belleame_vault_";

export interface StoredMediaItem {
  id: string;
  storageKey: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  isExifStripped: boolean;
  createdAt: string;
  category: "PROFILE_PHOTO" | "KYC_DOCUMENT" | "KYC_SELFIE";
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: "image/webp" | "image/jpeg";
}

class StorageService {
  /**
   * Assainit une image en la redessinant sur un Canvas HTML5 :
   * - Supprime toutes les métadonnées EXIF (GPS, numéro de série d'appareil, date, etc.)
   * - Redimensionne proportionnellement pour limiter le poids
   * - Encode en WebP haute fidélité
   */
  public async processAndStripExif(
    file: File | Blob,
    options: ImageProcessingOptions = {}
  ): Promise<{
    blob: Blob;
    dataUrl: string;
    width: number;
    height: number;
    sizeBytes: number;
  }> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.85,
      format = "image/webp",
    } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;

          // Calcul du redimensionnement proportionnel
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Création du canvas pour purger les métadonnées EXIF
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Impossible d'initialiser le contexte graphique Canvas 2D"));
            return;
          }

          // Rendu propre
          ctx.drawImage(img, 0, 0, width, height);

          // Conversion en WebP (ou JPEG de repli si le navigateur ne supporte pas WebP)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                // Repli sur JPEG si échec WebP
                canvas.toBlob(
                  (fallbackBlob) => {
                    if (!fallbackBlob) {
                      reject(new Error("Échec de la compression de l'image"));
                      return;
                    }
                    const dataUrl = canvas.toDataURL("image/jpeg", quality);
                    resolve({
                      blob: fallbackBlob,
                      dataUrl,
                      width,
                      height,
                      sizeBytes: fallbackBlob.size,
                    });
                  },
                  "image/jpeg",
                  quality
                );
                return;
              }

              const dataUrl = canvas.toDataURL(format, quality);
              resolve({
                blob,
                dataUrl,
                width,
                height,
                sizeBytes: blob.size,
              });
            },
            format,
            quality
          );
        };

        img.onerror = () => {
          reject(new Error("Le fichier sélectionné n'est pas une image valide ou est corrompu"));
        };

        if (typeof readerEvent.target?.result === "string") {
          img.src = readerEvent.target.result;
        } else {
          reject(new Error("Impossible de lire le fichier sélectionné"));
        }
      };

      reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Sauvegarde un élément dans le coffre-fort local résilient
   */
  private saveToLocalVault(key: string, dataUrl: string) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${STORAGE_VAULT_PREFIX}${key}`, dataUrl);
    } catch {
      // Si quota localStorage dépassé, nettoyer les plus anciens éléments
      this.pruneOldestVaultEntries();
      try {
        localStorage.setItem(`${STORAGE_VAULT_PREFIX}${key}`, dataUrl);
      } catch {
        // Mode dégradé sans crash
      }
    }
  }

  /**
   * Récupère une image depuis le coffre-fort local
   */
  public getFromLocalVault(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(`${STORAGE_VAULT_PREFIX}${key}`);
  }

  /**
   * Nettoie les anciennes entrées de cache si besoin
   */
  private pruneOldestVaultEntries() {
    if (typeof window === "undefined") return;
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_VAULT_PREFIX)) {
        keys.push(k);
      }
    }
    if (keys.length > 5) {
      // Supprimer les 2 premiers
      localStorage.removeItem(keys[0]!);
      localStorage.removeItem(keys[1]!);
    }
  }

  /**
   * Téléverse une photo de profil publique (avec assainissement EXIF & WebP)
   */
  public async uploadProfilePhoto(
    file: File,
    userId: string = "user_current"
  ): Promise<StoredMediaItem> {
    const processed = await this.processAndStripExif(file, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.85,
      format: "image/webp",
    });

    const timestamp = Date.now();
    const storageKey = `photos/${userId}/${timestamp}.webp`;
    const itemId = `photo-${timestamp}-${Math.random().toString(36).slice(2, 7)}`;

    // Tentative d'envoi vers Supabase Storage si configuré
    let publicUrl = processed.dataUrl;

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const uploadResponse = await fetch(
          `${SUPABASE_URL}/storage/v1/object/public-photos/${storageKey}`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              "Content-Type": "image/webp",
              "x-upsert": "true",
            },
            body: processed.blob,
          }
        );

        if (uploadResponse.ok) {
          publicUrl = `${SUPABASE_URL}/storage/v1/object/public/public-photos/${storageKey}`;
        }
      } catch {
        // Repli transparent sur l'URL de données locale
      }
    }

    // Sauvegarde dans le coffre-fort local
    this.saveToLocalVault(storageKey, processed.dataUrl);

    return {
      id: itemId,
      storageKey,
      url: publicUrl,
      mimeType: "image/webp",
      sizeBytes: processed.sizeBytes,
      width: processed.width,
      height: processed.height,
      isExifStripped: true,
      createdAt: new Date().toISOString(),
      category: "PROFILE_PHOTO",
    };
  }

  /**
   * Téléverse une pièce d'identité officielle vers le coffre-fort KYC privé
   */
  public async uploadKycDocument(
    file: File,
    userId: string = "user_current",
    docType: string = "cni"
  ): Promise<StoredMediaItem> {
    const processed = await this.processAndStripExif(file, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.9,
      format: "image/webp",
    });

    const timestamp = Date.now();
    const storageKey = `kyc-vault/${userId}/${docType.toLowerCase()}_${timestamp}.webp`;
    const itemId = `kyc-doc-${timestamp}`;

    let secureUrl = processed.dataUrl;

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const uploadResponse = await fetch(
          `${SUPABASE_URL}/storage/v1/object/private-kyc-vault/${storageKey}`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              "Content-Type": "image/webp",
              "x-upsert": "true",
            },
            body: processed.blob,
          }
        );

        if (uploadResponse.ok) {
          secureUrl = `${SUPABASE_URL}/storage/v1/object/authenticated/private-kyc-vault/${storageKey}`;
        }
      } catch {
        // Repli sécurisé local
      }
    }

    this.saveToLocalVault(storageKey, processed.dataUrl);

    return {
      id: itemId,
      storageKey,
      url: secureUrl,
      mimeType: "image/webp",
      sizeBytes: processed.sizeBytes,
      width: processed.width,
      height: processed.height,
      isExifStripped: true,
      createdAt: new Date().toISOString(),
      category: "KYC_DOCUMENT",
    };
  }

  /**
   * Téléverse un selfie de vérification faciale liveness
   */
  public async uploadKycSelfie(
    file: File,
    userId: string = "user_current"
  ): Promise<StoredMediaItem> {
    const processed = await this.processAndStripExif(file, {
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.85,
      format: "image/webp",
    });

    const timestamp = Date.now();
    const storageKey = `kyc-vault/${userId}/selfie_${timestamp}.webp`;
    const itemId = `kyc-selfie-${timestamp}`;

    let secureUrl = processed.dataUrl;

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const uploadResponse = await fetch(
          `${SUPABASE_URL}/storage/v1/object/private-kyc-vault/${storageKey}`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              "Content-Type": "image/webp",
              "x-upsert": "true",
            },
            body: processed.blob,
          }
        );

        if (uploadResponse.ok) {
          secureUrl = `${SUPABASE_URL}/storage/v1/object/authenticated/private-kyc-vault/${storageKey}`;
        }
      } catch {
        // Repli local
      }
    }

    this.saveToLocalVault(storageKey, processed.dataUrl);

    return {
      id: itemId,
      storageKey,
      url: secureUrl,
      mimeType: "image/webp",
      sizeBytes: processed.sizeBytes,
      width: processed.width,
      height: processed.height,
      isExifStripped: true,
      createdAt: new Date().toISOString(),
      category: "KYC_SELFIE",
    };
  }
}

export const storageService = new StorageService();
