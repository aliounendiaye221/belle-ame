import { Injectable, Logger } from "@nestjs/common";
import { IPushProvider } from "../interfaces/push-provider.interface";
import * as crypto from "crypto";

@Injectable()
export class MockPushProvider implements IPushProvider {
  readonly providerName = "MOCK_TEST_FCM_PROVIDER";
  private readonly logger = new Logger(MockPushProvider.name);

  // Historique des push pour les assertions de tests
  public readonly sentPushList: Array<{ fcmToken: string; title: string; body: string }> = [];

  async sendPush(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    this.sentPushList.push({ fcmToken, title, body });

    this.logger.warn(
      `[MODE TEST EXPLICITE - FOURNISSEUR PUSH FCM SIMULÉ] Envoi vers ${fcmToken.substring(0, 15)}... | Titre : "${title}" | Message : "${body}"`,
    );

    return {
      success: true,
      messageId: `fcm-msg-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    };
  }
}
