import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ISmsProvider, SmsSendResult } from "../interfaces/sms-provider.interface";

@Injectable()
export class TwilioSmsProvider implements ISmsProvider {
  readonly providerName = "TWILIO_SMS_PROVIDER";
  private readonly logger = new Logger(TwilioSmsProvider.name);

  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly fromPhone: string;

  constructor(private readonly configService: ConfigService) {
    this.accountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID") || "";
    this.authToken = this.configService.get<string>("TWILIO_AUTH_TOKEN") || "";
    this.fromPhone = this.configService.get<string>("TWILIO_PHONE_NUMBER") || "+1234567890";
  }

  /**
   * Envoi d'un code OTP SMS via l'API REST de Twilio
   */
  async sendOtp(phoneNumber: string, code: string): Promise<SmsSendResult> {
    this.logger.log(`[TWILIO SMS] Envoi du code OTP vers ${phoneNumber}`);

    if (!this.accountSid || !this.authToken) {
      this.logger.warn(
        `[TWILIO IDENTIFIANTS MANQUANTS] TWILIO_ACCOUNT_SID ou TWILIO_AUTH_TOKEN absent. Simulation transparente pour les tests.`,
      );
      return {
        success: true,
        provider: this.providerName,
        messageId: `twilio-mock-${Date.now()}`,
      };
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const body = new URLSearchParams({
        To: phoneNumber,
        From: this.fromPhone,
        Body: `« À Chacun Une Belle Âme » : Votre code de sécurité temporaire est ${code}. Ne le partagez jamais. (Valide 10 min)`,
      });

      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const result: any = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Erreur d'envoi Twilio");
      }

      return {
        success: true,
        provider: this.providerName,
        messageId: result.sid || `twilio-${Date.now()}`,
      };
    } catch (err: any) {
      this.logger.error(`Erreur d'envoi Twilio vers ${phoneNumber}: ${err.message}`);
      return {
        success: false,
        provider: this.providerName,
        messageId: `error-${Date.now()}`,
      };
    }
  }
}
