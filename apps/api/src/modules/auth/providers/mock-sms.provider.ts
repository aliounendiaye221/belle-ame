import { Injectable, Logger } from "@nestjs/common";
import { ISmsProvider, SmsSendResult } from "../interfaces/sms-provider.interface";

@Injectable()
export class MockSmsProvider implements ISmsProvider {
  readonly providerName = "MOCK_TEST_SMS_PROVIDER";
  private readonly logger = new Logger(MockSmsProvider.name);

  // Historique en mémoire pour les tests unitaires / assertions
  public readonly sentMessages: Array<{ phoneNumber: string; code: string; sentAt: Date }> = [];

  async sendOtp(phoneNumber: string, code: string): Promise<SmsSendResult> {
    const timestamp = new Date();
    this.sentMessages.push({ phoneNumber, code, sentAt: timestamp });

    this.logger.warn(
      `[MODE TEST EXPLICITE - FOURNISSEUR SMS SIMULÉ] OTP envoyé au ${phoneNumber} : << ${code} >> (Valide 10 minutes)`,
    );

    return {
      success: true,
      provider: this.providerName,
      messageId: `mock-sms-tx-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
  }

  getLastCodeFor(phoneNumber: string): string | undefined {
    const records = this.sentMessages.filter((m) => m.phoneNumber === phoneNumber);
    return records.length > 0 ? records[records.length - 1]?.code : undefined;
  }
}
