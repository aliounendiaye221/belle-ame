import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Santé Système")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Vérification de l'état de l'API" })
  @ApiResponse({ status: 200, description: "L'API fonctionne nominalement." })
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "belle-ame-api",
      version: "0.1.0",
      environment: process.env.NODE_ENV ?? "development",
    };
  }
}
