import { Module } from "@nestjs/common";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";
import { MediaModule } from "../media/media.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
