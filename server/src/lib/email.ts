// Email service stub — logs to console in development.
// Replace with a real email provider (SendGrid, Mailgun, SES) in production.

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/verify-email?token=${token}`;
  console.log(`[EMAIL] Verification email to ${email}: ${link}`);
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/reset-password?token=${token}`;
  console.log(`[EMAIL] Password reset email to ${email}: ${link}`);
}
