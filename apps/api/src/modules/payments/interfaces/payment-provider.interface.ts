import { PaymentProviderType, PaymentStatus } from "@belle-ame/shared-types";

export interface InitiatePaymentResult {
  paymentId: string;
  providerTxId: string;
  checkoutUrl?: string;
  instructions?: string;
  provider: PaymentProviderType;
  isTestMode: boolean;
}

export interface ParsedWebhookResult {
  externalEventId: string;
  providerTxId: string;
  status: PaymentStatus;
  amountInCents: number;
  currency: string;
  errorMessage?: string;
}

export interface IPaymentProvider {
  readonly providerType: PaymentProviderType;

  initiatePayment(params: {
    paymentId: string;
    amountInCents: number;
    currency: string;
    customerPhone?: string;
    returnUrl?: string;
  }): Promise<InitiatePaymentResult>;

  parseWebhook(payload: any, signature?: string): Promise<ParsedWebhookResult>;
}
