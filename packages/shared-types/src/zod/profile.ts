import { z } from "zod";
import { Gender, FamilyStatus } from "../enums";

// Fonction de calcul d'âge côté client / partagé
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const CreateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit comporter au moins 2 caractères")
    .max(50, "Le prénom ne peut dépasser 50 caractères")
    .trim(),
  birthDate: z
    .string()
    .refine((val: string) => !isNaN(Date.parse(val)), "Date de naissance invalide")
    .refine((val: string) => {
      const age = calculateAge(new Date(val));
      return age >= 18;
    }, "L'accès à la plateforme est strictement réservé aux personnes majeures (18 ans ou plus)"),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: "Genre invalide" }) }),
  city: z.string().min(2, "La ville est requise").max(60),
  country: z.string().length(2, "Le code pays ISO doit faire 2 caractères (ex: CM, BJ, CI)"),
  occupation: z.string().max(80).optional(),
  educationLevel: z.string().max(80).optional(),
  bio: z
    .string()
    .min(30, "La présentation doit contenir au moins 30 caractères pour encourager des échanges de qualité")
    .max(2000, "La présentation ne peut dépasser 2000 caractères")
    .trim(),
  relationshipGoal: z.string().max(500).optional(),
  personalValues: z
    .array(z.string())
    .min(2, "Veuillez sélectionner au moins 2 valeurs qui vous définissent")
    .max(8, "Vous pouvez sélectionner jusqu'à 8 valeurs"),
  familyStatus: z.nativeEnum(FamilyStatus).optional(),
  interestIds: z.array(z.string()).min(2, "Veuillez sélectionner au moins 2 centres d'intérêt"),
});

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;

export const UpdatePreferencesSchema = z.object({
  targetGenders: z.array(z.nativeEnum(Gender)).min(1, "Veuillez sélectionner au moins un genre recherché"),
  minAge: z.number().int().min(18, "L'âge minimum recherché doit être d'au moins 18 ans").max(99),
  maxAge: z.number().int().min(18).max(99),
  targetCountries: z.array(z.string()).default([]),
  targetCities: z.array(z.string()).default([]),
  targetFamilyStatus: z.array(z.nativeEnum(FamilyStatus)).default([]),
}).refine((data: { minAge: number; maxAge: number }) => data.minAge <= data.maxAge, {
  message: "L'âge minimum doit être inférieur ou égal à l'âge maximum",
  path: ["minAge"],
});

export type UpdatePreferencesDto = z.infer<typeof UpdatePreferencesSchema>;
