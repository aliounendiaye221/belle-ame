import { z } from "zod";
import { DocumentType, VerificationStatus } from "../enums";

export const InitiateKycSchema = z.object({
  documentType: z.nativeEnum(DocumentType, {
    errorMap: () => ({ message: "Type de document d'identité invalide" }),
  }),
});

export type InitiateKycDto = z.infer<typeof InitiateKycSchema>;

export const SubmitKycSchema = z.object({
  documentStorageKey: z.string().min(1, "La clé de stockage du document officiel est requise"),
  selfieStorageKey: z.string().min(1, "La clé de stockage du selfie de comparaison est requise"),
  documentType: z.nativeEnum(DocumentType),
});

export type SubmitKycDto = z.infer<typeof SubmitKycSchema>;

export const ReviewKycDecisionSchema = z.object({
  verificationRequestId: z.string().uuid("ID de demande invalide"),
  status: z.enum([
    VerificationStatus.VERIFIED,
    VerificationStatus.REJECTED,
    VerificationStatus.SUPPLEMENTARY_INFO_REQUIRED,
  ]),
  decisionReason: z.string().min(3, "Le motif de la décision est obligatoire"),
  comment: z.string().optional(),
});

export type ReviewKycDecisionDto = z.infer<typeof ReviewKycDecisionSchema>;
