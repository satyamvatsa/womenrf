import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const WRF_NOTIFICATION_EMAIL = process.env.WRF_NOTIFICATION_EMAIL || 'communication@womenrf.org';

export interface JobApplicationEmailParams {
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  coverLetter: string;
  resumeUrl?: string;
}

export async function sendJobApplicationNotification(params: JobApplicationEmailParams) {
  const fromEmail = process.env.FROM_EMAIL || 'communication@womenrf.org';
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding:30px 40px 20px;text-align:center;background:linear-gradient(135deg,#6B5B95 0%,#5a4a84 100%);border-radius:8px 8px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">New Job Application</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${params.position}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 40px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:20px;background-color:#f9fafb;border-radius:6px;">
                <tr>
                  <td style="padding:15px 20px;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#6b7280;width:35%;">Name:</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1a1a1a;">${params.fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#6b7280;">Email:</td>
                        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;"><a href="mailto:${params.email}" style="color:#6B5B95;text-decoration:none;">${params.email}</a></td>
                      </tr>
                      ${params.phone ? `<tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Phone:</td><td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${params.phone}</td></tr>` : ''}
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#6b7280;">Position:</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#6B5B95;">${params.position}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#6b7280;">Date:</td>
                        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${date}</td>
                      </tr>
                      ${params.resumeUrl ? `<tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Resume:</td><td style="padding:6px 0;font-size:14px;"><a href="${params.resumeUrl}" style="color:#6B5B95;text-decoration:none;">View Resume</a></td></tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Cover Letter</p>
              <div style="padding:15px;background-color:#f9fafb;border-radius:6px;font-size:14px;line-height:1.7;color:#333333;white-space:pre-wrap;">${params.coverLetter}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background-color:#f9fafb;border-radius:0 0 8px 8px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">\u00a9 ${new Date().getFullYear()} Women's Rights First. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `New Job Application

Position: ${params.position}
Name: ${params.fullName}
Email: ${params.email}
${params.phone ? `Phone: ${params.phone}` : ''}
Date: ${date}
${params.resumeUrl ? `Resume: ${params.resumeUrl}` : ''}

Cover Letter:
${params.coverLetter}`;

  await transporter.sendMail({
    from: `"Women's Rights First" <${fromEmail}>`,
    to: WRF_NOTIFICATION_EMAIL,
    replyTo: params.email,
    subject: `New Application: ${params.position} - ${params.fullName}`,
    text,
    html,
  });
}

export async function sendJobApplicationConfirmation(params: JobApplicationEmailParams) {
  const fromEmail = process.env.FROM_EMAIL || 'communication@womenrf.org';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding:30px 40px 20px;text-align:center;background:linear-gradient(135deg,#6B5B95 0%,#5a4a84 100%);border-radius:8px 8px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Application Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 40px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#333333;">
                Dear <strong>${params.fullName}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#333333;">
                Thank you for your interest in joining <strong>Women's Rights First</strong>. We have successfully received your application for the position of <strong>${params.position}</strong>.
              </p>
              <table role="presentation" style="width:100%;border-collapse:collapse;margin:24px 0;background-color:#f9fafb;border-radius:6px;">
                <tr>
                  <td style="padding:15px 20px;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#6b7280;width:35%;">Position:</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#6B5B95;">${params.position}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#6b7280;">Date Applied:</td>
                        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#333333;">
                Our team will carefully review your application and get back to you as soon as possible. If your profile matches our requirements, we will reach out to schedule the next steps.
              </p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#333333;">
                In the meantime, feel free to learn more about our work at <a href="https://womenrf.org" style="color:#6B5B95;text-decoration:none;font-weight:600;">womenrf.org</a>.
              </p>
              <p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:#333333;">
                Best regards,<br>
                <strong>The Women's Rights First Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background-color:#f9fafb;border-radius:0 0 8px 8px;text-align:center;">
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">
                Women's Rights First<br>
                <a href="mailto:communication@womenrf.org" style="color:#6B5B95;text-decoration:none;">communication@womenrf.org</a>
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">\u00a9 ${new Date().getFullYear()} Women's Rights First. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Dear ${params.fullName},

Thank you for your interest in joining Women's Rights First. We have successfully received your application for the position of ${params.position}.

Our team will carefully review your application and get back to you as soon as possible. If your profile matches our requirements, we will reach out to schedule the next steps.

In the meantime, feel free to learn more about our work at https://womenrf.org.

Best regards,
The Women's Rights First Team

---
Women's Rights First
communication@womenrf.org`;

  await transporter.sendMail({
    from: `"Women's Rights First" <${fromEmail}>`,
    to: params.email,
    subject: `Application Received: ${params.position} - Women's Rights First`,
    text,
    html,
  });
}

export interface DonationEmailParams {
  donorName: string;
  donorEmail: string;
  amount: number;
  transactionId: string;
  currency?: string;
}

export async function sendDonationConfirmation({
  donorName,
  donorEmail,
  amount,
  transactionId,
  currency = 'USD',
}: DonationEmailParams) {
  const subject = `Thank You for Your Donation - Women's Rights First`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Thank You!</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Dear <strong>${donorName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for your generous donation to Women's Rights First. Your support helps us empower women and advocate for their rights across Afghanistan.
              </p>
              
              <!-- Donation Details -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f9fafb; border-radius: 6px; padding: 20px;">
                <tr>
                  <td style="padding: 10px 20px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; width: 50%;">Donation Amount:</td>
                        <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #8B5CF6; text-align: right;">${currency} $${amount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Transaction ID:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #333333; text-align: right; font-family: monospace;">${transactionId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Date:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #333333; text-align: right;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Your contribution will directly support our programs in:
              </p>
              
              <ul style="margin: 0 0 20px; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                <li>Peace building and social cohesion</li>
                <li>Legal empowerment and advocacy</li>
                <li>Digital transformation initiatives</li>
                <li>Women's representation in leadership</li>
              </ul>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                This email serves as your receipt for tax purposes. Please keep it for your records.
              </p>
              
              <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                With gratitude,<br>
                <strong>The Women's Rights First Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                Women's Rights First<br>
                <a href="mailto:communication@womenrf.org" style="color: #8B5CF6; text-decoration: none;">communication@womenrf.org</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} Women's Rights First. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Dear ${donorName},

Thank you for your generous donation to Women's Rights First!

Donation Details:
- Amount: ${currency} $${amount.toFixed(2)}
- Transaction ID: ${transactionId}
- Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Your contribution helps us empower women and advocate for their rights across Afghanistan.

This email serves as your receipt for tax purposes.

With gratitude,
The Women's Rights First Team

---
Women's Rights First
communication@womenrf.org
  `.trim();

  const fromEmail = process.env.FROM_EMAIL || 'communication@womenrf.org';
  
  await transporter.sendMail({
    from: `"Women's Rights First" <${fromEmail}>`,
    to: donorEmail,
    subject,
    text,
    html,
  });
}
