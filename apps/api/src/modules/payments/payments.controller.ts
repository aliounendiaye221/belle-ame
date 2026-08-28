import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  RoleType,
  PaymentProviderType,
  CheckoutSubscriptionSchema,
  CheckoutSubscriptionDto,
  BuyBoostSchema,
  BuyBoostDto,
} from "@belle-ame/shared-types";

@ApiTags("Abonnements & Paiements Mobile Money")
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("subscriptions/plans")
  @ApiOperation({ summary: "Consultation de la grille tarifaire officielle des abonnements Premium (en FCFA)" })
  @ApiResponse({ status: 200, description: "Liste des plans disponibles (mensuel, trimestriel, annuel)." })
  async getPlans() {
    return this.paymentsService.getPlans();
  }

  @Post("payments/checkout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Initiation d'une souscription d'abonnement (Mobile Money ou Carte)" })
  @UsePipes(new ZodValidationPipe(CheckoutSubscriptionSchema))
  async checkoutSubscription(
    @CurrentUser("id") userId: string,
    @Body() dto: CheckoutSubscriptionDto,
  ) {
    return this.paymentsService.checkoutSubscription(userId, dto);
  }

  @Post("payments/boost")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Achat ponctuel d'un Boost de visibilité (1h à 500 FCFA)" })
  @UsePipes(new ZodValidationPipe(BuyBoostSchema))
  async buyBoost(
    @CurrentUser("id") userId: string,
    @Body() dto: BuyBoostDto,
  ) {
    return this.paymentsService.buyBoost(userId, dto);
  }

  @Post("payments/webhooks/:provider")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Réception idempotente des notifications de paiement (Webhooks agrégateurs)" })
  @ApiResponse({ status: 200, description: "Webhook reçu et traité avec contrôle d'idempotence." })
  async handleWebhook(
    @Param("provider") provider: PaymentProviderType,
    @Body() payload: any,
  ) {
    return this.paymentsService.handleWebhook(provider, payload);
  }

  @Get("payments/history")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Historique des transactions et reçus de paiement de l'utilisateur" })
  async getHistory(@CurrentUser("id") userId: string) {
    return this.paymentsService.getUserTransactions(userId);
  }

  @Post("subscriptions/:id/cancel")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Annulation du renouvellement automatique de son abonnement" })
  async cancelSubscription(
    @CurrentUser("id") userId: string,
    @Param("id") subscriptionId: string,
  ) {
    return this.paymentsService.cancelSubscription(userId, subscriptionId);
  }

  // ==========================================
  // ROUTES BACK-OFFICE (RÔLES ADMIN / SUPER ADMIN)
  // ==========================================

  @Post("payments/admin/refund/:paymentId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Remboursement administratif d'un paiement avec traçabilité d'audit" })
  async refundPayment(
    @CurrentUser("id") adminId: string,
    @Param("paymentId") paymentId: string,
    @Body("rationale") rationale: string,
  ) {
    return this.paymentsService.refundPayment(adminId, paymentId, rationale);
  }
}
