# Donation Email Confirmation Setup Guide

This guide will help you configure email confirmations for donations.

## What's Been Implemented

✅ **Email Service** - Nodemailer configured to send beautiful HTML confirmation emails
✅ **API Route** - `/api/donate/confirm` handles sending confirmations
✅ **Updated Donate Page** - Automatically sends confirmation after successful PayPal payment
✅ **Email Template** - Professional, responsive email with donation details

## Local Development Setup

### 1. Update `.env` File

Replace `your_email_password_here` with your actual password in the `.env` file:

```env
SMTP_USER=communication@womenrf.org
SMTP_PASSWORD=your_actual_password
```

### 2. Determine Your SMTP Host

Your email provider determines the SMTP settings:

#### Option A: Gmail (if @womenrf.org forwards to Gmail or uses Google Workspace)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Important:** If you have 2-Factor Authentication enabled (recommended), you need to:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled
3. Go to "App passwords" (search for it in settings)
4. Generate an "App password" for "Mail"
5. Use this 16-character app password instead of your regular password

#### Option B: Microsoft/Outlook/Office365
```env
SMTP_HOST=smtp-mail.outlook.com
# or for Office365:
# SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Option C: cPanel or Custom Domain Host
Contact your hosting provider for SMTP details. Usually:
```env
SMTP_HOST=mail.womenrf.org
SMTP_PORT=587
SMTP_SECURE=false
```

### 3. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000/Donate` and complete a small test donation. Check your donor email for the confirmation.

## Production (Amplify) Setup

### 1. Add Environment Variables in AWS Amplify Console

1. Go to your Amplify app
2. Navigate to **Environment variables**
3. Add these variables:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `SMTP_HOST` | Your SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (usually 587) | `587` |
| `SMTP_SECURE` | Use SSL? (false for TLS) | `false` |
| `SMTP_USER` | Email address | `communication@womenrf.org` |
| `SMTP_PASSWORD` | Email password or app password | `your_password` |

### 2. Redeploy

After adding environment variables, trigger a new deployment for changes to take effect.

## Email Confirmation Features

### What Donors Receive

✅ Professional, branded email
✅ Donation amount and transaction ID
✅ Date of donation
✅ Impact statement (how their donation helps)
✅ Receipt for tax purposes
✅ Organization contact info

### Success Message on Site

After successful payment, donors see:
- ✅ "Thank you for your donation!"
- Order ID
- "A confirmation email has been sent to [their email]"

## Troubleshooting

### Email Not Sending

1. **Check Console Logs** - Look for errors in terminal or Amplify logs
2. **Verify SMTP Credentials** - Test with a simple email client
3. **Check Firewall** - Ensure port 587 is not blocked
4. **Gmail Users** - Make sure you're using an App Password if 2FA is enabled

### Common Issues

**Gmail "Less secure app access"**
- Google has deprecated this. Use App Passwords instead.

**"Invalid login" errors**
- Double-check username and password
- Ensure no extra spaces in `.env` values

**Emails go to spam**
- This is normal for new email configurations
- Consider setting up SPF and DKIM records with your domain registrar

## Security Notes

⚠️ **Never commit `.env` to Git** - It contains sensitive credentials
⚠️ **Use environment variables in production** - Don't hardcode credentials
⚠️ **Rotate passwords periodically** - Update SMTP_PASSWORD regularly
⚠️ **Use App Passwords** - For services that support it (Gmail, etc.)

## Next Steps

1. Update `.env` with your actual SMTP password
2. Test locally with a small donation
3. Add environment variables to Amplify
4. Deploy and test in production
5. Monitor the first few donations to ensure emails are sent

## Support

If you encounter issues:
- Check Amplify build logs for errors
- Test SMTP credentials with a standalone email client
- Verify all environment variables are set correctly
- Contact your email provider's support if connection issues persist
