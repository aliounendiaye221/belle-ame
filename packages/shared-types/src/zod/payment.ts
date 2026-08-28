import { z } from "zod";
import { PaymentProviderType } from "../enums";

export const CheckoutSubscriptionSchema = z.object({
  planId: z.string().uuid("ID de plan invalide"),
  provider: z.nativeEnum(PaymentProviderType, {
    errorMap: () => ({ message: "Mode de paiement non supporté" }),
  }),
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, "Numéro de téléphone requis pour le débit Mobile Money")
    .optional(),
});

export type CheckoutSubscriptionDto = z.infer<typeof CheckoutSubscriptionSchema>;

export const BuyBoostSchema = z.object({
  provider: z.nativeEnum(PaymentProviderType),
  phoneNumber: z.string().optional(),
});

export type BuyBoostDto = z.infer<typeof BuyBoostSchema>;
