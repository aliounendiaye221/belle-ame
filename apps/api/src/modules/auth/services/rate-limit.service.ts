import { Injectable, HttpException, HttpStatus } from "@nestjs/common";

interface RateLimitRecord {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

@Injectable()
export class AuthRateLimitService {
  // En mémoire pour l'autonomie locale, déportable sur Redis
  private readonly otpSendRecords = new Map<string, RateLimitRecord>();
  private readonly verifyFailureRecords = new Map<string, RateLimitRecord>();

  private readonly MAX_OTP_SENDS_PER_HOUR = 3;
  private readonly MAX_VERIFY_FAILURES = 5;
  private readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  checkOtpSendLimit(phoneNumber: string): void {
    const now = Date.now();
    const record = this.otpSendRecords.get(phoneNumber);

    if (!record) {
      this.otpSendRecords.set(phoneNumber, { count: 1, firstAttemptAt: now });
      return;
    }

    // Si plus d'une heure s'est écoulée, on réinitialise la fenêtre
    if (now - record.firstAttemptAt > 60 * 60 * 1000) {
      this.otpSendRecords.set(phoneNumber, { count: 1, firstAttemptAt: now });
      return;
    }

    if (record.count >= this.MAX_OTP_SENDS_PER_HOUR) {
      const waitMinutes = Math.ceil((60 * 60 * 1000 - (now - record.firstAttemptAt)) / 60000);
      throw new HttpException(
        {
          code: "AUTH_RATE_LIMIT_EXCEEDED",
          message: `Limite d'envois OTP atteinte. Par mesure de sécurité, veuillez patienter ${waitMinutes} minute(s) avant de réessayer.`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count++;
  }

  checkVerifyAttempts(phoneNumber: string): void {
    const now = Date.now();
    const record = this.verifyFailureRecords.get(phoneNumber);

    if (record?.lockedUntil && now < record.lockedUntil) {
      const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
      throw new HttpException(
        {
          code: "AUTH_ACCOUNT_TEMPORARILY_LOCKED",
          message: `Trop de tentatives erronées. Compte temporairement verrouillé pour ${remainingMinutes} minute(s).`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  recordVerifyFailure(phoneNumber: string): void {
    const now = Date.now();
    const record = this.verifyFailureRecords.get(phoneNumber) || { count: 0, firstAttemptAt: now };

    record.count++;

    if (record.count >= this.MAX_VERIFY_FAILURES) {
      record.lockedUntil = now + this.LOCKOUT_DURATION_MS;
      this.verifyFailureRecords.set(phoneNumber, record);
      throw new HttpException(
        {
          code: "AUTH_ACCOUNT_LOCKED_AFTER_MAX_ATTEMPTS",
          message: `Trop de tentatives de validation échouées (5/5). Votre compte est verrouillé pour 15 minutes.`,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    this.verifyFailureRecords.set(phoneNumber, record);
  }

  resetVerifyFailures(phoneNumber: string): void {
    this.verifyFailureRecords.delete(phoneNumber);
  }
}
