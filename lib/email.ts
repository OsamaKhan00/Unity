import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendApplicationConfirmationEmail(to: string, {
  firstName,
  jobTitle,
  applicationId,
}: {
  firstName: string;
  jobTitle: string;
  applicationId: string;
}) {
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111827">
      <div style="background:#1d4ed8;padding:32px 32px 24px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">Application Received</h1>
        <p style="color:#bfdbfe;margin:6px 0 0;font-size:14px">Apex Talent Group</p>
      </div>
      <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 12px 12px">
        <p style="margin:0 0 16px">Hi ${firstName},</p>
        <p style="margin:0 0 16px">Thank you for applying for the <strong>${jobTitle}</strong> position. We&apos;ve received your application and our team will review it shortly.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin:24px 0">
          <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Application Reference</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#111827;font-family:monospace">${applicationId}</p>
        </div>
        <p style="margin:0 0 16px;font-size:14px;color:#374151">You can track your application status at any time by visiting <strong>My Applications</strong> on our site and entering this email address.</p>
        <p style="margin:24px 0 0;font-size:14px;color:#6b7280">If you have any questions, feel free to reply to this email.</p>
        <p style="margin:8px 0 0;font-size:14px;color:#6b7280">— The Apex Talent Group Team</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Apex Talent Group" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Application received — ${jobTitle}`,
    html,
  });
}

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
