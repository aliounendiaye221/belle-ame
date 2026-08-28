export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
}

export interface ISmsProvider {
  readonly providerName: string;
  sendOtp(phoneNumber: string, code: string): Promise<SmsSendResult>;
}
