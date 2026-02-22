export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  private from: string = "noreply@api.example.com";

  async send(options: EmailOptions): Promise<SendResult> {
    try {
      if (!this.isValidEmail(options.to)) {
        return { success: false, error: "Invalid recipient email" };
      }

      // Simulate sending email
      const messageId = `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      console.log(`[EMAIL] To: ${options.to}`);
      console.log(`[EMAIL] Subject: ${options.subject}`);
      console.log(`[EMAIL] Message ID: ${messageId}`);

      return { success: true, messageId };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async sendWelcome(email: string, name: string): Promise<SendResult> {
    return this.send({
      to: email,
      subject: "Welcome to our API",
      body: `Hello ${name}, welcome to our platform!`,
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<SendResult> {
    return this.send({
      to: email,
      subject: "Password Reset",
      body: `Click here to reset your password: https://example.com/reset?token=${resetToken}`,
    });
  }

  async sendOrderConfirmation(email: string, orderId: number): Promise<SendResult> {
    return this.send({
      to: email,
      subject: `Order Confirmation #${orderId}`,
      body: `Your order #${orderId} has been confirmed. Thank you for your purchase!`,
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

export const emailService = new EmailService();
