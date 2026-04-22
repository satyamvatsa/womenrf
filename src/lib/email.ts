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
