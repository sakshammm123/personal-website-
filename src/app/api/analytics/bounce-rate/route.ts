// Bounce rate calculation - single page visits
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get all sessions in the period
    const visits = await db.pageVisit.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        isBot: false,
        sessionId: {
          not: null,
        },
      },
      select: {
        sessionId: true,
        path: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group visits by session
    const sessions = new Map<string, Array<{ path: string; createdAt: Date }>>();
    
    visits.forEach((visit) => {
      if (!visit.sessionId) return;
      
      if (!sessions.has(visit.sessionId)) {
        sessions.set(visit.sessionId, []);
      }
      sessions.get(visit.sessionId)!.push({
        path: visit.path,
        createdAt: visit.createdAt,
      });
    });

    // Calculate bounce rate
    let totalSessions = 0;
    let bouncedSessions = 0;

    sessions.forEach((sessionVisits) => {
      totalSessions++;
      
      // A bounce is a session with only one page view
      if (sessionVisits.length === 1) {
        bouncedSessions++;
      }
    });

    const bounceRate = totalSessions > 0 
      ? (bouncedSessions / totalSessions) * 100 
      : 0;

    // Calculate average session duration (for non-bounced sessions)
    let totalDuration = 0;
    let sessionsWithDuration = 0;

    sessions.forEach((sessionVisits) => {
      if (sessionVisits.length > 1) {
        const firstVisit = sessionVisits[0];
        const lastVisit = sessionVisits[sessionVisits.length - 1];
        const duration = lastVisit.createdAt.getTime() - firstVisit.createdAt.getTime();
        totalDuration += duration;
        sessionsWithDuration++;
      }
    });

    const avgSessionDuration = sessionsWithDuration > 0
      ? Math.round(totalDuration / sessionsWithDuration / 1000) // Convert to seconds
      : 0;

    return NextResponse.json({
      totalSessions,
      bouncedSessions,
      bounceRate: Math.round(bounceRate * 100) / 100, // Round to 2 decimal places
      avgSessionDuration, // in seconds
      nonBouncedSessions: totalSessions - bouncedSessions,
    });
  } catch (error) {
    console.error('Error calculating bounce rate:', error);
    return NextResponse.json(
      { error: 'Failed to calculate bounce rate' },
      { status: 500 }
    );
  }
}
