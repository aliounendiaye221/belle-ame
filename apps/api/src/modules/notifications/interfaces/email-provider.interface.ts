export interface IEmailProvider {
  readonly providerName: string;
  sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
