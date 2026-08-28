import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { TokenService } from "./token.service";
import * as crypto from "crypto";

describe("TokenService", () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: "test-secret-at-least-32-characters-long!",
          signOptions: { expiresIn: "15m" },
        }),
      ],
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it("doit être défini", () => {
    expect(service).toBeDefined();
  });

  it("doit générer un couple de jetons valide (AccessToken court et RefreshToken aléatoire)", () => {
    const payload = {
      sub: "user-uuid-123",
      phoneNumber: "+237699000000",
      roles: ["USER"],
      isIdentityVerified: false,
    };

    const tokens = service.generateTokens(payload);

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.refreshToken.length).toBe(96); // 48 bytes hex = 96 chars
    expect(tokens.refreshTokenHash).toBeDefined();
    expect(tokens.expiresInSeconds).toBe(900); // 15 min

    // Vérification que le hash SHA-256 est exact
    const expectedHash = crypto.createHash("sha256").update(tokens.refreshToken).digest("hex");
    expect(tokens.refreshTokenHash).toBe(expectedHash);
  });

  it("doit vérifier et décoder un AccessToken valide", () => {
    const payload = {
      sub: "user-uuid-456",
      phoneNumber: "+225070000000",
      roles: ["USER", "MODERATOR"],
      isIdentityVerified: true,
    };

    const tokens = service.generateTokens(payload);
    const decoded = service.verifyAccessToken(tokens.accessToken);

    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.phoneNumber).toBe(payload.phoneNumber);
    expect(decoded.roles).toEqual(payload.roles);
    expect(decoded.isIdentityVerified).toBe(true);
  });

  it("doit rejeter un AccessToken invalide ou corrompu", () => {
    expect(() => service.verifyAccessToken("jeton.invalide.faussaire")).toThrow();
  });
});
