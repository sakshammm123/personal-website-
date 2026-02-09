// Conversion tracking - link page visits to lead submissions
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
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    // Get all page visits for this conversation
    const visits = await db.pageVisit.findMany({
      where: {
        conversationId,
        isBot: false,
      },
      select: {
        path: true,
        referer: true,
        refererCategory: true,
        deviceType: true,
        browser: true,
        country: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calculate conversion path
    const conversionPath = visits.map((visit) => ({
      path: visit.path,
      referer: visit.referer,
      refererCategory: visit.refererCategory,
      deviceType: visit.deviceType,
      browser: visit.browser,
      country: visit.country,
      timestamp: visit.createdAt.toISOString(),
    }));

    return NextResponse.json({
      conversationId,
      conversionPath,
      totalPages: visits.length,
    });
  } catch (error) {
    console.error('Error fetching conversion data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversion data' },
      { status: 500 }
    );
  }
}
