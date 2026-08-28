import { AuthRateLimitService } from "./rate-limit.service";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("AuthRateLimitService", () => {
  let service: AuthRateLimitService;

  beforeEach(() => {
    service = new AuthRateLimitService();
  });

  it("doit autoriser jusqu'à 3 envois OTP par heure pour un même numéro", () => {
    const phone = "+237699112233";

    expect(() => service.checkOtpSendLimit(phone)).not.toThrow();
    expect(() => service.checkOtpSendLimit(phone)).not.toThrow();
    expect(() => service.checkOtpSendLimit(phone)).not.toThrow();
  });

  it("doit bloquer avec HTTP 429 au 4ème envoi OTP dans l'heure", () => {
    const phone = "+22997001122";

    service.checkOtpSendLimit(phone);
    service.checkOtpSendLimit(phone);
    service.checkOtpSendLimit(phone);

    try {
      service.checkOtpSendLimit(phone);
      fail("Aurait dû lever une exception HTTP 429");
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    }
  });

  it("doit verrouiller le compte après 5 tentatives erronées de validation OTP", () => {
    const phone = "+22507889900";

    // 4 échecs consécutifs autorisés
    service.recordVerifyFailure(phone);
    service.recordVerifyFailure(phone);
    service.recordVerifyFailure(phone);
    service.recordVerifyFailure(phone);

    // Le 5ème échec déclenche le verrouillage (HTTP 403)
    try {
      service.recordVerifyFailure(phone);
      fail("Aurait dû déclencher le verrouillage au 5ème échec");
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
    }

    // Les tentatives suivantes sont immédiatement bloquées
    expect(() => service.checkVerifyAttempts(phone)).toThrow(HttpException);
  });

  it("doit réinitialiser le compteur d'échecs après succès", () => {
    const phone = "+237655443322";

    service.recordVerifyFailure(phone);
    service.recordVerifyFailure(phone);
    service.resetVerifyFailures(phone);

    expect(() => service.checkVerifyAttempts(phone)).not.toThrow();
  });
});
