import { z } from "zod";

// Validation E.164 (+237..., +229..., +225..., etc.)
export const phoneRegex = /^\+[1-9]\d{6,14}$/;

export const SendOtpSchema = z.object({
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Le numéro de téléphone doit être au format international E.164 (ex: +237699000000)"),
  referralCode: z.string().optional(),
});

export type SendOtpDto = z.infer<typeof SendOtpSchema>;

export const VerifyOtpSchema = z.object({
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Le numéro de téléphone doit être au format international E.164"),
  code: z
    .string()
    .length(6, "Le code de vérification OTP est composé exactement de 6 chiffres")
    .regex(/^\d{6}$/, "Le code OTP ne doit contenir que des chiffres"),
  deviceFingerprint: z.string().min(8, "Empreinte appareil requise pour la sécurité de session"),
  deviceModel: z.string().optional(),
});

export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Le refresh token est requis"),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;
