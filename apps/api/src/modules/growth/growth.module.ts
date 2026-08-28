import { Module } from "@nestjs/common";
import { GrowthController } from "./growth.controller";
import { GrowthService } from "./growth.service";
import { ComplianceService } from "./compliance.service";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [GrowthController],
  providers: [GrowthService, ComplianceService],
  exports: [GrowthService, ComplianceService],
})
export class GrowthModule {}
