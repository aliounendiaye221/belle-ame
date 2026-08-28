import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@belle-ame/database";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("✅ Connexion à PostgreSQL établie via Prisma.");
    } catch (error) {
      this.logger.warn("⚠️ Impossible de se connecter à PostgreSQL immédiatement (l'environnement de dev local peut être hors-ligne).");
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Connexion Prisma fermée.");
  }
}
