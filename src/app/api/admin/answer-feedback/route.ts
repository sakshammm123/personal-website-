// Answer feedback analytics endpoint
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { db } from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get feedback stats
    const [totalFeedback, helpfulFeedback, notHelpfulFeedback] = await Promise.all([
      db.answerFeedback.count({
        where: { createdAt: { gte: startDate } },
      }),
      db.answerFeedback.count({
        where: { helpful: true, createdAt: { gte: startDate } },
      }),
      db.answerFeedback.count({
        where: { helpful: false, createdAt: { gte: startDate } },
      }),
    ]);

    // Get recent feedback
    const recentFeedback = await db.answerFeedback.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        question: true,
        answer: true,
        helpful: true,
        createdAt: true,
      },
    });

    const helpfulRate = totalFeedback > 0 
      ? Math.round((helpfulFeedback / totalFeedback) * 100) 
      : 0;

    return NextResponse.json({
      totalFeedback,
      helpfulFeedback,
      notHelpfulFeedback,
      helpfulRate,
      recentFeedback,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
