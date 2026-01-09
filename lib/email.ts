import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
            from: 'Shopify Builder Studio <onboarding@resend.dev>',
            to: email,
            subject: 'Reset Your Password - Shopify Builder Studio',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Password Reset Request</h2>
          <p>You requested a password reset for your Shopify Builder Studio account.</p>
          <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Shopify Builder Studio &copy; ${new Date().getFullYear()}</p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
    }
}
