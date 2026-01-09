import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

/**
 * Sends a password reset email to the user.
 * If RESEND_API_KEY is missing, it logs the reset link to the console for development.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    if (!resend) {
        console.log('--- DEVELOPMENT MODE (Email Mock) ---');
        console.log(`To: ${email}`);
        console.log(`Subject: Password Reset Request`);
        console.log(`Link: ${resetLink}`);
        console.log('--- END EMAIL MOCK ---');
        return { success: true, mock: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Section Studio <noreply@onboarding.resend.dev>', // Update this with your verified domain in production
            to: [email],
            subject: 'Reset Your Password - Section Studio',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 8px;">
          <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Section Studio</h2>
          <p>We received a request to reset your password. Click the button below to choose a new one. This link will expire in 1 hour.</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">The ultimate toolkit for Shopify developers.</p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Failed to send reset email:', error);
        return { success: false, error };
    }
}
