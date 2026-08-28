import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { MockPaymentProvider } from "./providers/mock-payment.provider";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, MockPaymentProvider],
  exports: [PaymentsService, MockPaymentProvider],
})
export class PaymentsModule {}
