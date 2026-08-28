export interface IPushProvider {
  readonly providerName: string;
  sendPush(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
