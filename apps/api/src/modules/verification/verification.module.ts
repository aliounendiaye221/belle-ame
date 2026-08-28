import { Module } from "@nestjs/common";
import { VerificationController } from "./verification.controller";
import { VerificationService } from "./verification.service";
import { MockKycProvider } from "./providers/mock-kyc.provider";
import { StorageModule } from "../storage/storage.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [VerificationController],
  providers: [VerificationService, MockKycProvider],
  exports: [VerificationService, MockKycProvider],
})
export class VerificationModule {}
