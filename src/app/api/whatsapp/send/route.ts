import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    const { to, body, language } = await request.json();
    
    const result = await sendWhatsAppMessage({
      to,
      body,
      language
    });
    
    return NextResponse.json({ success: true, messageId: result.sid });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
