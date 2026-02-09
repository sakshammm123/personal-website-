// Answer feedback endpoint (thumbs up/down)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { anonymizeIp } from '@/lib/analytics-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, question, answer, helpful, sessionId } = body;

    if (!question || !answer || typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'question, answer, and helpful are required' },
        { status: 400 }
      );
    }

    const ipAddress = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const anonymizedIp = anonymizeIp(ipAddress);

    // Create feedback record
    const feedback = await db.answerFeedback.create({
      data: {
        conversationId: conversationId || null,
        question: question.trim(),
        answer: answer.trim(),
        helpful,
        ipAddress: anonymizedIp,
        sessionId: sessionId || null,
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
