import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TokenService } from "./services/token.service";
import { AuthRateLimitService } from "./services/rate-limit.service";
import { MockSmsProvider } from "./providers/mock-sms.provider";
import { TwilioSmsProvider } from "./providers/twilio-sms.provider";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>("JWT_ACCESS_SECRET") ||
          "local-dev-jwt-access-secret-minimum-32-characters-long!",
        signOptions: {
          expiresIn: "15m",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthRateLimitService,
    MockSmsProvider,
    TwilioSmsProvider,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthService, TokenService, JwtAuthGuard, PassportModule, MockSmsProvider, TwilioSmsProvider],
})
export class AuthModule {}
