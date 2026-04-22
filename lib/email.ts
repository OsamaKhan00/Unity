import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string, isAdmin = false) {
  const subject = isAdmin ? 'Admin Portal — Reset your password' : 'Reset your Apex Talent Group password';
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="color:#1d4ed8">Password Reset</h2>
      <p>We received a request to reset your ${isAdmin ? 'admin portal' : 'account'} password.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
      </p>
      <p style="color:#6b7280;font-size:13px">This link expires in 15 minutes. If you didn't request this, ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Apex Talent Group" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
