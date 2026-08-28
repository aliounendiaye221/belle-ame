import { z } from "zod";
import { ReportCategory } from "../enums";

export const SendMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Le message ne peut pas être vide")
    .max(3000, "Le message ne peut excéder 3000 caractères")
    .trim(),
});

export type SendMessageDto = z.infer<typeof SendMessageSchema>;

export const CreateReportSchema = z.object({
  reportedUserId: z.string().uuid("ID utilisateur à signaler invalide"),
  category: z.nativeEnum(ReportCategory, {
    errorMap: () => ({ message: "Catégorie de signalement invalide" }),
  }),
  description: z
    .string()
    .min(10, "Veuillez fournir une description détaillée d'au moins 10 caractères pour guider l'équipe de modération")
    .max(2000),
  evidenceUrls: z.array(z.string().url("URL de preuve invalide")).default([]),
});

export type CreateReportDto = z.infer<typeof CreateReportSchema>;

export const CreateBlockSchema = z.object({
  blockedId: z.string().uuid("ID utilisateur à bloquer invalide"),
  reason: z.string().max(255).optional(),
});

export type CreateBlockDto = z.infer<typeof CreateBlockSchema>;
