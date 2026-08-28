const fs = require("fs");
const path = require("path");

let cachedServer;

function safeReaddir(dir) {
  try {
    return fs.readdirSync(dir);
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

function listRecursive(dir, depth) {
  if (depth <= 0) return ["..."];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const result = [];
    for (const entry of entries.slice(0, 20)) {
      if (entry.isDirectory()) {
        result.push(`${entry.name}/: ${JSON.stringify(listRecursive(path.join(dir, entry.name), depth - 1))}`);
      } else {
        result.push(entry.name);
      }
    }
    return result;
  } catch (e) {
    return [`Error: ${e.message}`];
  }
}

module.exports = async function handler(req, res) {
  try {
    if (!cachedServer) {
      // The nest build with monorepo paths produces: dist/apps/api/src/...
      const candidates = [
        // Direct paths (if rootDir is set to src)
        path.join(__dirname, "../dist/app.module"),
        path.join(__dirname, "../dist/src/app.module"),
        // Monorepo paths (nest build preserves full path structure)
        path.join(__dirname, "../dist/apps/api/src/app.module"),
        path.join(__dirname, "dist/apps/api/src/app.module"),
        path.join(process.cwd(), "apps/api/dist/apps/api/src/app.module"),
        // Fallbacks
        path.join(process.cwd(), "dist/apps/api/src/app.module"),
        path.join(__dirname, "../dist/app.module"),
      ];

      let AppModule, AllExceptionsFilter;
      let loadedPath = null;
      let loadErrors = [];

      for (const cand of candidates) {
        try {
          const mod = require(cand);
          AppModule = mod.AppModule;
          loadedPath = cand;
          break;
        } catch (e) {
          loadErrors.push({ path: cand, error: e.message });
        }
      }

      if (!AppModule) {
        const appDir = path.join(__dirname, "..");
        const diagnostics = {
          cwd: process.cwd(),
          dirname: __dirname,
          distContents: listRecursive(path.join(appDir, "dist"), 2),
          apiDistContents: listRecursive(path.join(__dirname, "dist"), 2),
          loadErrors: loadErrors.map(e => ({ path: e.path, error: e.error.split("\n")[0] })),
        };
        throw new Error(`DIAGNOSTICS: ${JSON.stringify(diagnostics, null, 2)}`);
      }

      const { NestFactory } = require("@nestjs/core");
      const { ExpressAdapter } = require("@nestjs/platform-express");
      const express = require("express");
      const helmet = require("helmet");
      const cookieParser = require("cookie-parser");
      const { DocumentBuilder, SwaggerModule } = require("@nestjs/swagger");

      try {
        const filterCand = loadedPath.replace("app.module", "common/filters/http-exception.filter");
        AllExceptionsFilter = require(filterCand).AllExceptionsFilter;
      } catch (e) {
        console.warn("Filtre AllExceptions non chargé:", e.message);
      }

      const expressApp = express();

      expressApp.use(
        helmet({
          contentSecurityPolicy: false,
          crossOriginEmbedderPolicy: false,
        }),
      );

      expressApp.use(cookieParser());

      const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

      app.enableCors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Device-Fingerprint"],
      });

      app.setGlobalPrefix("api/v1");

      if (AllExceptionsFilter) {
        app.useGlobalFilters(new AllExceptionsFilter());
      }

      const swaggerConfig = new DocumentBuilder()
        .setTitle("À Chacun Une Belle Âme — API")
        .setDescription("API Core pour la plateforme SaaS de rencontres sérieuses.")
        .setVersion("1.0.0")
        .addBearerAuth(
          {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            name: "JWT",
            in: "header",
          },
          "JWT-auth",
        )
        .build();

      const document = SwaggerModule.createDocument(app, swaggerConfig);
      SwaggerModule.setup("api/docs", app, document, {
        customSiteTitle: "Belle Âme API Documentation",
      });

      await app.init();
      cachedServer = expressApp;
    }

    return cachedServer(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(
        {
          statusCode: 500,
          error: err.message,
        },
        null,
        2,
      ),
    );
  }
};
