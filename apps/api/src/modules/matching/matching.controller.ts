import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { MatchingService } from "./matching.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Découverte & Matching")
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get("discovery/feed")
  @ApiOperation({ summary: "Flux quotidien de suggestions compatibles triées par score transparent" })
  @ApiResponse({ status: 200, description: "Candidats éligibles et quota restant du jour." })
  async getDailyFeed(
    @CurrentUser("id") userId: string,
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    return this.matchingService.getDailyFeed(userId, parseInt(page, 10), parseInt(limit, 10));
  }

  @Post("discovery/like/:receiverId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Envoi d'un coup de cœur (crée automatiquement un match et une conversation si réciproque)" })
  @ApiResponse({ status: 200, description: "Coup de cœur enregistré (ou match mutuel confirmé)." })
  @ApiResponse({ status: 403, description: "Quota quotidien de likes dépassé." })
  async sendLike(
    @CurrentUser("id") senderId: string,
    @Param("receiverId") receiverId: string,
  ) {
    return this.matchingService.sendLike(senderId, receiverId);
  }

  @Get("matching/matches")
  @ApiOperation({ summary: "Liste de tous les matchs mutuels actifs de l'utilisateur" })
  async getMatches(@CurrentUser("id") userId: string) {
    return this.matchingService.getMatches(userId);
  }

  @Delete("matching/matches/:matchId")
  @ApiOperation({ summary: "Annulation d'un match (ferme définitivement la conversation liée)" })
  async cancelMatch(
    @CurrentUser("id") userId: string,
    @Param("matchId") matchId: string,
  ) {
    return this.matchingService.cancelMatch(userId, matchId);
  }

  @Get("matching/likes-received")
  @ApiOperation({ summary: "Liste des coups de cœur reçus (masqués pour les membres gratuits, révélés pour Premium)" })
  async getLikesReceived(@CurrentUser("id") userId: string) {
    return this.matchingService.getLikesReceived(userId);
  }
}
