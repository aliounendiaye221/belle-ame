import { Injectable, Logger } from "@nestjs/common";
import { IEmailProvider } from "../interfaces/email-provider.interface";
import * as crypto from "crypto";

@Injectable()
export class MockEmailProvider implements IEmailProvider {
  readonly providerName = "MOCK_TEST_EMAIL_PROVIDER";
  private readonly logger = new Logger(MockEmailProvider.name);

  public readonly sentEmails: Array<{ to: string; subject: string }> = [];

  async sendEmail(to: string, subject: string, html: string) {
    this.sentEmails.push({ to, subject });

    this.logger.warn(
      `[MODE TEST EXPLICITE - FOURNISSEUR EMAIL SIMULÉ] Envoi à ${to} | Objet : "${subject}"`,
    );

    return {
      success: true,
      messageId: `email-msg-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    };
  }
}
