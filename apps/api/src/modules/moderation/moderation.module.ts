import { Module } from "@nestjs/common";
import { ModerationController } from "./moderation.controller";
import { ModerationService } from "./moderation.service";
import { FraudDetectionService } from "./services/fraud-detection.service";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ModerationController],
  providers: [ModerationService, FraudDetectionService],
  exports: [ModerationService, FraudDetectionService],
})
export class ModerationModule {}
