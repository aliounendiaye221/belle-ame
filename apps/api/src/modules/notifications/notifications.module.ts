import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { MockPushProvider } from "./providers/mock-push.provider";
import { MockEmailProvider } from "./providers/mock-email.provider";
import { FirebaseAdminPushProvider } from "./providers/firebase-push.provider";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    MockPushProvider,
    MockEmailProvider,
    FirebaseAdminPushProvider,
  ],
  exports: [
    NotificationsService,
    MockPushProvider,
    MockEmailProvider,
    FirebaseAdminPushProvider,
  ],
})
export class NotificationsModule {}
