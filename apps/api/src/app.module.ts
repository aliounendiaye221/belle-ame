import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { HealthModule } from "./modules/health/health.module";
import { DatabaseModule } from "./modules/database/database.module";
import { StorageModule } from "./modules/storage/storage.module";
import { MediaModule } from "./modules/media/media.module";
import { AuthModule } from "./modules/auth/auth.module";
import { VerificationModule } from "./modules/verification/verification.module";
import { ProfilesModule } from "./modules/profiles/profiles.module";
import { MatchingModule } from "./modules/matching/matching.module";
import { ChatModule } from "./modules/chat/chat.module";
import { ModerationModule } from "./modules/moderation/moderation.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { AdminModule } from "./modules/admin/admin.module";
import { GrowthModule } from "./modules/growth/growth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    StorageModule,
    MediaModule,
    HealthModule,
    AuthModule,
    VerificationModule,
    ProfilesModule,
    MatchingModule,
    ChatModule,
    ModerationModule,
    PaymentsModule,
    NotificationsModule,
    AdminModule,
    GrowthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
