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
        <p style="margin:0 0 16px;font-size:14px;color:#374151">You can track your application status at any time by visiting <strong>My Applications</strong> on our website.</p>
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

const STATUS_READABLE: Record<string, { subject: string; heading: string; body: string }> = {
  reviewed:    {
    subject: 'Your application is under review',
    heading: 'Application Under Review',
    body:    'Great news — our team has started reviewing your application for the <strong>{jobTitle}</strong> position. We\'ll be in touch soon.',
  },
  shortlisted: {
    subject: 'You\'ve been shortlisted!',
    heading: 'You\'ve Been Shortlisted',
    body:    'We\'re pleased to let you know that you\'ve been shortlisted for the <strong>{jobTitle}</strong> role. A member of our team will be in contact with next steps.',
  },
  placed:      {
    subject: 'Congratulations — you\'ve been placed!',
    heading: 'Congratulations!',
    body:    'We\'re thrilled to let you know that you\'ve been placed for the <strong>{jobTitle}</strong> position. Welcome aboard — our team will be in touch with further details.',
  },
  rejected:    {
    subject: 'Update on your application',
    heading: 'Application Update',
    body:    'Thank you for your interest in the <strong>{jobTitle}</strong> position. After careful consideration, we\'ve decided to move forward with other candidates at this time. We appreciate you taking the time to apply and encourage you to apply for future roles.',
  },
};

export async function sendStatusChangeEmail(to: string, {
  firstName,
  jobTitle,
  status,
}: {
  firstName: string;
  jobTitle: string;
  status: string;
}) {
  const meta = STATUS_READABLE[status];
  if (!meta) return; // don't email for 'new' or unknown statuses

  const bodyText = meta.body.replace(/{jobTitle}/g, jobTitle);

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111827">
      <div style="background:#1d4ed8;padding:32px 32px 24px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">${meta.heading}</h1>
        <p style="color:#bfdbfe;margin:6px 0 0;font-size:14px">Apex Talent Group</p>
      </div>
      <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 12px 12px">
        <p style="margin:0 0 16px">Hi ${firstName},</p>
        <p style="margin:0 0 16px">${bodyText}</p>
        <p style="margin:24px 0 0;font-size:14px;color:#6b7280">If you have any questions, feel free to reply to this email.</p>
        <p style="margin:8px 0 0;font-size:14px;color:#6b7280">— The Apex Talent Group Team</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Apex Talent Group" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${meta.subject} — ${jobTitle}`,
    html,
  });
}

export async function sendNewApplicationAlertEmail(to: string, {
  recruiterName,
  candidateName,
  candidateEmail,
  jobTitle,
}: {
  recruiterName: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
}) {
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111827">
      <div style="background:#1d4ed8;padding:32px 32px 24px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">New Application</h1>
        <p style="color:#bfdbfe;margin:6px 0 0;font-size:14px">Apex Talent Group — Recruiter Alert</p>
      </div>
      <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 12px 12px">
        <p style="margin:0 0 16px">Hi ${recruiterName},</p>
        <p style="margin:0 0 16px">A new application has been submitted for a role assigned to you.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin:24px 0;font-size:14px">
          <p style="margin:0 0 6px"><span style="color:#6b7280">Position:</span> <strong>${jobTitle}</strong></p>
          <p style="margin:0 0 6px"><span style="color:#6b7280">Candidate:</span> <strong>${candidateName}</strong></p>
          <p style="margin:0"><span style="color:#6b7280">Email:</span> <a href="mailto:${candidateEmail}" style="color:#1d4ed8">${candidateEmail}</a></p>
        </div>
        <p style="margin:0 0 16px;font-size:14px;color:#374151">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/applications" style="display:inline-block;background:#1d4ed8;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
            View in Admin →
          </a>
        </p>
        <p style="margin:24px 0 0;font-size:14px;color:#6b7280">— Apex Talent Group</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Apex Talent Group" <${process.env.GMAIL_USER}>`,
    to,
    subject: `New application — ${jobTitle}`,
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
