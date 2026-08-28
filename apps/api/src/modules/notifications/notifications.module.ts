import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { MockPushProvider } from "./providers/mock-push.provider";
import { MockEmailProvider } from "./providers/mock-email.provider";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, MockPushProvider, MockEmailProvider],
  exports: [NotificationsService, MockPushProvider, MockEmailProvider],
})
export class NotificationsModule {}
