import { NextRequest, NextResponse } from 'next/server';
import { processChatMessage } from '@/lib/chatbot-service';

export async function POST(request: NextRequest) {
  try {
    // Check API key early so we can return a clear message
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Server configuration error',
          message: 'GEMINI_API_KEY is not set',
          reply: "Chatbot isn't configured yet. Add GEMINI_API_KEY to your .env file (same folder as package.json) and restart the server (npm run dev)."
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, conversation_id } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get IP address and user agent
    const ipAddress = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Process the chat message
    const result = await processChatMessage(
      message.trim(),
      conversation_id || null,
      ipAddress,
      userAgent
    );

    return NextResponse.json({
      reply: result.reply,
      conversation_id: result.conversation_id
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    
    // Handle rate limiting
    if (error.message?.includes('Rate limited')) {
      return NextResponse.json(
        { 
          error: 'Rate limited',
          message: error.message,
          reply: error.message
        },
        { status: 429 }
      );
    }
    
    // Handle API key missing
    if (error.message?.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'Chatbot API key not configured',
          reply: "Sorry, I'm having trouble connecting. Please contact the administrator."
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Failed to process message',
        reply: "Sorry, I'm having trouble connecting. Please try again."
      },
      { status: 500 }
    );
  }
}
