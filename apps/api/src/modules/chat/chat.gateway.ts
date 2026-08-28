import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { TokenService } from "../auth/services/token.service";

interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    phoneNumber: string;
    roles: string[];
  };
}

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  namespace: "/chat",
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Authentification au moment du handshake WebSocket via Bearer Token
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      const authHeader =
        client.handshake.auth?.token || client.handshake.headers?.authorization;

      if (!authHeader) {
        this.logger.warn(`Connexion WebSocket rejetée : jeton manquant (Socket ${client.id})`);
        client.disconnect(true);
        return;
      }

      const token = authHeader.replace(/^Bearer\s+/i, "");
      const payload = this.tokenService.verifyAccessToken(token);

      client.data = {
        userId: payload.sub,
        phoneNumber: payload.phoneNumber,
        roles: payload.roles,
      };

      // Rejoindre le salon personnel pour les notifications ciblées
      await client.join(`user:${payload.sub}`);
      this.logger.log(`🟢 Client connecté : ${payload.sub} (Socket ${client.id})`);
    } catch {
      this.logger.warn(`Connexion WebSocket rejetée : jeton invalide (Socket ${client.id})`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.data?.userId) {
      this.logger.log(`🔴 Client déconnecté : ${client.data.userId} (Socket ${client.id})`);
    }
  }

  /**
   * Rejoindre le salon d'une conversation spécifique
   */
  @SubscribeMessage("joinConversation")
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const roomName = `conversation:${data.conversationId}`;
    await client.join(roomName);
    return { success: true, room: roomName };
  }

  /**
   * Quitter le salon d'une conversation
   */
  @SubscribeMessage("leaveConversation")
  async handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    await client.leave(`conversation:${data.conversationId}`);
    return { success: true };
  }

  /**
   * Envoi d'un message en temps réel avec diffusion aux membres connectés
   */
  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { conversationId: string; content: string },
  ) {
    const senderId = client.data.userId;

    // Enregistrement persistant et analyse de conformité
    const message = await this.chatService.sendMessage(
      senderId,
      payload.conversationId,
      payload.content,
    );

    // Diffusion temps réel dans la salle de discussion
    this.server.to(`conversation:${payload.conversationId}`).emit("newMessage", {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      status: message.status,
      createdAt: message.createdAt,
    });

    return { success: true, messageId: message.id };
  }

  /**
   * Émission de l'accusé de lecture
   */
  @SubscribeMessage("markAsRead")
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    const count = await this.chatService.markMessagesAsRead(userId, data.conversationId);

    if (count > 0) {
      this.server.to(`conversation:${data.conversationId}`).emit("messagesRead", {
        conversationId: data.conversationId,
        readBy: userId,
        readAt: new Date().toISOString(),
      });
    }

    return { success: true, count };
  }

  /**
   * Indicateur de saisie en temps réel ("En train d'écrire...")
   */
  @SubscribeMessage("typing")
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    client.to(`conversation:${data.conversationId}`).emit("userTyping", {
      conversationId: data.conversationId,
      userId: client.data.userId,
      isTyping: data.isTyping,
    });
  }
}
