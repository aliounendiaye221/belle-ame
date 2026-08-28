import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsService } from "./payments.service";
import { PrismaService } from "../database/prisma.service";
import { MockPaymentProvider } from "./providers/mock-payment.provider";
import {
  PaymentProviderType,
  PaymentStatus,
  SubscriptionStatus,
  PlanInterval,
} from "@belle-ame/shared-types";

describe("PaymentsService", () => {
  let service: PaymentsService;
  let provider: MockPaymentProvider;

  const mockPrismaService = {
    subscriptionPlan: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    subscription: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    payment: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    paymentWebhookEvent: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    boost: {
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    adminAuditLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        MockPaymentProvider,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    provider = module.get<MockPaymentProvider>(MockPaymentProvider);
  });

  describe("Initiation de souscription", () => {
    it("doit créer un paiement en attente et renvoyer les instructions de paiement Mobile Money", async () => {
      mockPrismaService.subscriptionPlan.findUnique.mockResolvedValue({
        id: "plan-monthly",
        name: "Belle Âme Mensuel",
        priceInCents: 300000,
        currency: "XOF",
        isActive: true,
      });
      mockPrismaService.subscription.create.mockResolvedValue({ id: "sub-1" });
      mockPrismaService.payment.create.mockResolvedValue({
        id: "pay-1",
        amountInCents: 300000,
        currency: "XOF",
      });
      mockPrismaService.payment.update.mockResolvedValue({});

      const res = await service.checkoutSubscription("user-1", {
        planId: "plan-monthly",
        provider: PaymentProviderType.MOCK_TEST,
        phoneNumber: "+237699001122",
      });

      expect(res.success).toBe(true);
      expect(res.paymentId).toBe("pay-1");
      expect(res.isTestMode).toBe(true);
      expect(mockPrismaService.payment.create).toHaveBeenCalled();
    });
  });

  describe("Traitement des Webhooks et Idempotence", () => {
    it("doit ignorer un webhook déjà traité en garantissant l'idempotence stricte", async () => {
      mockPrismaService.paymentWebhookEvent.findUnique.mockResolvedValue({
        id: "evt-existing",
        externalEventId: "evt-unique-123",
        isProcessed: true, // Déjà traité !
      });

      const res = await service.handleWebhook(PaymentProviderType.MOCK_TEST, {
        externalEventId: "evt-unique-123",
        providerTxId: "tx-test-123",
      });

      expect(res.success).toBe(true);
      expect(res.message).toContain("Idempotence");
      // Aucune mise à jour de paiement ne doit avoir eu lieu
      expect(mockPrismaService.payment.update).not.toHaveBeenCalled();
    });

    it("doit valider le paiement et activer l'abonnement lors d'un webhook SUCCESSFUL", async () => {
      mockPrismaService.paymentWebhookEvent.findUnique.mockResolvedValue(null);
      mockPrismaService.payment.findFirst.mockResolvedValue({
        id: "pay-456",
        userId: "user-buyer",
        subscription: {
          id: "sub-456",
          plan: { name: "Belle Âme Mensuel", interval: PlanInterval.MONTHLY },
        },
      });
      mockPrismaService.paymentWebhookEvent.upsert.mockResolvedValue({ id: "evt-db-1" });
      mockPrismaService.payment.update.mockResolvedValue({});
      mockPrismaService.subscription.update.mockResolvedValue({});
      mockPrismaService.notification.create.mockResolvedValue({});
      mockPrismaService.paymentWebhookEvent.update.mockResolvedValue({});

      provider.simulateFailure = false;

      const res = await service.handleWebhook(PaymentProviderType.MOCK_TEST, {
        externalEventId: "evt-new-789",
        providerTxId: "tx-success-789",
      });

      expect(res.success).toBe(true);
      expect(res.status).toBe(PaymentStatus.SUCCESSFUL);
      expect(mockPrismaService.subscription.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "sub-456" },
          data: expect.objectContaining({ status: SubscriptionStatus.ACTIVE }),
        }),
      );
      expect(mockPrismaService.notification.create).toHaveBeenCalled();
    });
  });

  describe("Remboursement administratif", () => {
    it("doit rembourser le paiement, annuler l'abonnement et consigner un audit log", async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue({
        id: "pay-refund",
        amountInCents: 300000,
        currency: "XOF",
        subscription: { id: "sub-refund" },
      });
      mockPrismaService.payment.update.mockResolvedValue({});
      mockPrismaService.subscription.update.mockResolvedValue({});
      mockPrismaService.adminAuditLog.create.mockResolvedValue({});

      const res = await service.refundPayment("admin-1", "pay-refund", "Demande légitime de rétractation");

      expect(res.success).toBe(true);
      expect(mockPrismaService.payment.update).toHaveBeenCalledWith({
        where: { id: "pay-refund" },
        data: { status: PaymentStatus.REFUNDED },
      });
      expect(mockPrismaService.subscription.update).toHaveBeenCalledWith({
        where: { id: "sub-refund" },
        data: { status: SubscriptionStatus.CANCELLED },
      });
      expect(mockPrismaService.adminAuditLog.create).toHaveBeenCalled();
    });
  });
});
