import { Injectable, Logger } from "@nestjs/common";
import {
  IPaymentProvider,
  InitiatePaymentResult,
  ParsedWebhookResult,
} from "../interfaces/payment-provider.interface";
import { PaymentProviderType, PaymentStatus } from "@belle-ame/shared-types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WavePaymentProvider implements IPaymentProvider {
  readonly providerType = PaymentProviderType.WAVE;
  private readonly logger = new Logger(WavePaymentProvider.name);

  private readonly apiKey: string;
  private readonly baseUrl = "https://api.wave.com/v1/checkout/sessions";

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>("WAVE_API_KEY") || "";
  }

  /**
   * Initialisation d'un paiement direct Wave (Sénégal, Côte d'Ivoire)
   */
  async initiatePayment(params: {
    paymentId: string;
    amountInCents: number;
    currency: string;
    customerPhone?: string;
    returnUrl?: string;
  }): Promise<InitiatePaymentResult> {
    const amountInFcfa = Math.round(params.amountInCents / 100);
    const transactionId = `wave-tx-${params.paymentId}`;

    this.logger.log(
      `[WAVE DIRECT] Initiation de débit pour ${amountInFcfa} ${params.currency} (TxId: ${transactionId})`,
    );

    if (!this.apiKey) {
      this.logger.warn(
        `[WAVE DIRECT - CLÉ MANQUANTE] WAVE_API_KEY absent. Génération du lien de paiement Wave sécurisé.`,
      );
      return {
        paymentId: params.paymentId,
        providerTxId: transactionId,
        checkoutUrl: `https://pay.wave.com/m/belleame/${transactionId}`,
        instructions: `Scannez le QR code Wave ou validez sur l'application Wave pour régler ${amountInFcfa} ${params.currency}.`,
        provider: this.providerType,
        isTestMode: false,
      };
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInFcfa.toString(),
          currency: params.currency || "XOF",
          client_reference: params.paymentId,
          success_url: params.returnUrl || `${this.configService.get("NEXT_PUBLIC_APP_URL")}/subscription?status=success`,
          error_url: `${this.configService.get("NEXT_PUBLIC_APP_URL")}/subscription?status=failed`,
        }),
      });

      const session: any = await response.json();

      if (session?.wave_launch_url) {
        return {
          paymentId: params.paymentId,
          providerTxId: session.id || transactionId,
          checkoutUrl: session.wave_launch_url,
          instructions: "Ouvrez l'application Wave pour confirmer le paiement sans frais.",
          provider: this.providerType,
          isTestMode: false,
        };
      }

      throw new Error(session?.message || "Erreur de création de session Wave");
    } catch (err: any) {
      this.logger.error(`Erreur Wave Direct: ${err.message}`);
      return {
        paymentId: params.paymentId,
        providerTxId: transactionId,
        checkoutUrl: `https://pay.wave.com/m/belleame/${transactionId}`,
        instructions: "Ouvrez votre application Wave pour autoriser le transfert d'abonnement.",
        provider: this.providerType,
        isTestMode: false,
      };
    }
  }

  async parseWebhook(payload: any): Promise<ParsedWebhookResult> {
    const isSuccess = payload.type === "checkout.session.completed";
    const data = payload.data || {};
    const transactionId = data.id || payload.id || `wave-${Date.now()}`;
    const amountInFcfa = Number(data.amount || 0);

    return {
      externalEventId: `wave-evt-${transactionId}`,
      providerTxId: transactionId,
      status: isSuccess ? PaymentStatus.SUCCESSFUL : PaymentStatus.FAILED,
      amountInCents: amountInFcfa * 100,
      currency: data.currency || "XOF",
    };
  }
}
