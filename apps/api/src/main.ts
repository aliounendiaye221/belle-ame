import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  // 1. En-têtes de sécurité avec Helmet
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // 2. Traitement des cookies (Refresh Token sécurisé HttpOnly)
  app.use(cookieParser());

  // 3. Politique CORS
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_BACKOFFICE_URL || "http://localhost:3001",
    "http://localhost:8081", // Expo local dev
    "http://localhost:19006", // Expo web
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".belleame.africa")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origine ${origin} non autorisée par la politique CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Device-Fingerprint"],
  });

  // 4. Préfixe d'API unifié
  const globalPrefix = "api/v1";
  app.setGlobalPrefix(globalPrefix);

  // 5. Filtre d'exception global
  app.useGlobalFilters(new AllExceptionsFilter());

  // 6. Documentation interactive Swagger / OpenAPI 3.0
  const swaggerConfig = new DocumentBuilder()
    .setTitle("« À Chacun Une Belle Âme » — API Core")
    .setDescription(
      "Spécification officielle de l'API REST de la plateforme SaaS de rencontres sérieuses et vérifiées.",
    )
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Entrez votre Access Token JWT émis après validation OTP",
        in: "header",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document, {
    customSiteTitle: "À Chacun Une Belle Âme — Documentation API",
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 API disponible sur : http://localhost:${port}/${globalPrefix}`);
  logger.log(`📚 Documentation Swagger sur : http://localhost:${port}/docs`);
}

if (process.env.VERCEL !== "1") {
  bootstrap();
}
