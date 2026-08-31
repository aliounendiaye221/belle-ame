import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { MockPaymentProvider } from "./providers/mock-payment.provider";
import { CinetPayPaymentProvider } from "./providers/cinetpay.provider";
import { WavePaymentProvider } from "./providers/wave.provider";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    MockPaymentProvider,
    CinetPayPaymentProvider,
    WavePaymentProvider,
  ],
  exports: [
    PaymentsService,
    MockPaymentProvider,
    CinetPayPaymentProvider,
    WavePaymentProvider,
  ],
})
export class PaymentsModule {}
