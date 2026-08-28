import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { SendMessageSchema, SendMessageDto } from "@belle-ame/shared-types";

@ApiTags("Messagerie Instantanée")
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("conversations")
  @ApiOperation({ summary: "Liste de toutes les conversations actives issues de matchs mutuels" })
  @ApiResponse({ status: 200, description: "Liste des conversations avec dernier message et compteur non-lu." })
  async getConversations(@CurrentUser("id") userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get("conversations/:conversationId/messages")
  @ApiOperation({ summary: "Historique paginé par curseur des messages d'une conversation" })
  @ApiResponse({ status: 200, description: "Messages ordonnés chronologiquement avec curseur suivant." })
  async getMessages(
    @CurrentUser("id") userId: string,
    @Param("conversationId") conversationId: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limit = "30",
  ) {
    return this.chatService.getMessages(userId, conversationId, cursor, parseInt(limit, 10));
  }

  @Post("conversations/:conversationId/messages")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Envoi d'un message textuel (secours REST ou envoi standard)" })
  @ApiResponse({ status: 201, description: "Message envoyé avec succès." })
  @ApiResponse({ status: 403, description: "Refusé si le match n'est pas actif ou si l'utilisateur est bloqué." })
  @UsePipes(new ZodValidationPipe(SendMessageSchema))
  async sendMessage(
    @CurrentUser("id") senderId: string,
    @Param("conversationId") conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(senderId, conversationId, dto.content);
  }

  @Post("conversations/:conversationId/read")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Marquer tous les messages reçus de la conversation comme lus" })
  async markAsRead(
    @CurrentUser("id") userId: string,
    @Param("conversationId") conversationId: string,
  ) {
    const updatedCount = await this.chatService.markMessagesAsRead(userId, conversationId);
    return { success: true, updatedCount };
  }

  @Delete("messages/:messageId")
  @ApiOperation({ summary: "Suppression logique d'un message (conservé en base pour l'audit de modération)" })
  async deleteMessage(
    @CurrentUser("id") userId: string,
    @Param("messageId") messageId: string,
  ) {
    return this.chatService.deleteMessage(userId, messageId);
  }
}
