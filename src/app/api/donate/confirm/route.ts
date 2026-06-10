import { NextRequest, NextResponse } from 'next/server';
import { sendDonationConfirmation } from '@/lib/email';
import { getDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donorName, donorEmail, amount, transactionId, currency, phone, organization } = body;

    if (!donorName || !donorEmail || !amount || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(amount);
    const donationRecord = {
      donorName,
      donorEmail,
      phone: phone || '',
      organization: organization || '',
      amount: parsedAmount,
      currency: currency || 'USD',
      transactionId,
      createdAt: new Date(),
    };

    try {
      const db = await getDb();
      if (db) {
        await db.collection('donations').insertOne(donationRecord);
      }
    } catch (dbError) {
      console.error('Failed to save donation to database:', dbError);
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
      amount: parsedAmount,
      transactionId,
      currency: currency || 'USD',
      phone: phone || '',
      organization: organization || '',
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
