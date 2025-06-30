import { NextRequest, NextResponse } from 'next/server';
import { handleIncomingWhatsAppMessage } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;
    const language = formData.get('Language') || 'en';
    
    // Process the incoming message and generate response
    const responseMessage = await handleIncomingWhatsAppMessage(
      from, 
      body, 
      language as string
    );
    
    // Respond with TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>${responseMessage}</Message>
    </Response>`;
    
    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' }
    });
  } catch (error) {
    console.error('Error handling WhatsApp webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
