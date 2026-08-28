import { Injectable, Logger } from "@nestjs/common";
import {
  IPaymentProvider,
  InitiatePaymentResult,
  ParsedWebhookResult,
} from "../interfaces/payment-provider.interface";
import { PaymentProviderType, PaymentStatus } from "@belle-ame/shared-types";
import * as crypto from "crypto";

@Injectable()
export class MockPaymentProvider implements IPaymentProvider {
  readonly providerType = PaymentProviderType.MOCK_TEST;
  private readonly logger = new Logger(MockPaymentProvider.name);

  // Configuration de test : simule un succès ou un échec
  public simulateFailure = false;

  async initiatePayment(params: {
    paymentId: string;
    amountInCents: number;
    currency: string;
    customerPhone?: string;
    returnUrl?: string;
  }): Promise<InitiatePaymentResult> {
    const providerTxId = `mock-tx-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const amountInFcfa = Math.round(params.amountInCents / 100);

    this.logger.warn(
      `[MODE TEST EXPLICITE - PAIEMENT MOBILE MONEY SIMULÉ] Initiation débit de ${amountInFcfa} ${params.currency} pour paiement ${params.paymentId} (Tél: ${params.customerPhone || "Non renseigné"})`,
    );

    const checkoutUrl = `http://localhost:4000/api/v1/payments/test-checkout/${params.paymentId}`;

    return {
      paymentId: params.paymentId,
      providerTxId,
      checkoutUrl,
      instructions: `[MODE TEST] Veuillez valider le paiement fictif de ${amountInFcfa} ${params.currency} sur votre interface de test.`,
      provider: this.providerType,
      isTestMode: true,
    };
  }

  async parseWebhook(payload: any): Promise<ParsedWebhookResult> {
    this.logger.log(`[MODE TEST] Réception d'un webhook simulé pour transaction ${payload.providerTxId}`);

    const externalEventId =
      payload.externalEventId || `mock-evt-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    if (this.simulateFailure) {
      return {
        externalEventId,
        providerTxId: payload.providerTxId,
        status: PaymentStatus.FAILED,
        amountInCents: payload.amountInCents || 300000,
        currency: payload.currency || "XOF",
        errorMessage: "Solde Mobile Money insuffisant (Simulation de test).",
      };
    }

    return {
      externalEventId,
      providerTxId: payload.providerTxId,
      status: PaymentStatus.SUCCESSFUL,
      amountInCents: payload.amountInCents || 300000,
      currency: payload.currency || "XOF",
    };
  }
}
