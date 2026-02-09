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

    // Get visits grouped by date (exclude bots)
    const visits = await db.pageVisit.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        isBot: false, // Exclude bots from analytics
      },
      select: {
        createdAt: true,
        path: true,
        sessionId: true,
        ipAddress: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group visits by date
    const visitsByDate: Record<string, { visits: number; pageViews: number }> = {};
    
    visits.forEach((visit) => {
      const date = visit.createdAt.toISOString().split('T')[0];
      if (!visitsByDate[date]) {
        visitsByDate[date] = { visits: 0, pageViews: 0 };
      }
      visitsByDate[date].pageViews++;
    });

    // Count unique visits (by sessionId + IP combination for better accuracy)
    const uniqueVisits = new Map<string, Set<string>>();
    
    visits.forEach((visit) => {
      const date = visit.createdAt.toISOString().split('T')[0];
      // Use sessionId if available, otherwise fall back to IP
      const identifier = visit.sessionId || visit.ipAddress || 'unknown';
      if (!uniqueVisits.has(date)) {
        uniqueVisits.set(date, new Set());
      }
      uniqueVisits.get(date)!.add(identifier);
    });

    // Combine data
    const result = Object.keys(visitsByDate).map((date) => ({
      date,
      visits: uniqueVisits.get(date)?.size || 0,
      pageViews: visitsByDate[date].pageViews,
    }));

    // Fill in missing dates with zeros
    const filledResult = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const existing = result.find((r) => r.date === dateStr);
      filledResult.push(
        existing || {
          date: dateStr,
          visits: 0,
          pageViews: 0,
        }
      );
    }

    // Get total stats (using sessionId + IP for unique counting)
    const totalVisits = new Set(
      visits.map((v) => {
        const identifier = v.sessionId || v.ipAddress || 'unknown';
        return `${v.createdAt.toISOString().split('T')[0]}-${identifier}`;
      })
    ).size;
    const totalPageViews = visits.length;

    return NextResponse.json({
      data: filledResult,
      totalVisits,
      totalPageViews,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
