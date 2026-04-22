import { NextRequest, NextResponse } from 'next/server';
import { sendDonationConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donorName, donorEmail, amount, transactionId, currency } = body;

    if (!donorName || !donorEmail || !amount || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    await sendDonationConfirmation({
      donorName,
      donorEmail,
      amount: parseFloat(amount),
      transactionId,
      currency: currency || 'USD',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send donation confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
