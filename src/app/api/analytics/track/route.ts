import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  isBot,
  anonymizeIp,
  getDeviceType,
  getBrowserInfo,
  getOS,
  categorizeReferrer,
} from '@/lib/analytics-utils';
import { getLocationFromIp } from '@/lib/geolocation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      path,
      referer,
      sessionId,
      isBot: clientIsBot,
      loadTime,
      firstContentfulPaint,
      largestContentfulPaint,
      cumulativeLayoutShift,
      firstInputDelay,
      conversationId,
    } = body;

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    // Get IP address and user agent from request
    const rawIpAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const userAgent = request.headers.get('user-agent') || null;

    // Check if it's a bot
    const botCheck = isBot(userAgent) || clientIsBot === true;

    // Skip tracking bots unless explicitly allowed
    if (botCheck && process.env.TRACK_BOTS !== 'true') {
      return NextResponse.json({ success: true, skipped: 'bot' });
    }

    // Anonymize IP address
    const ipAddress = anonymizeIp(rawIpAddress);

    // Extract device and browser info
    const deviceType = getDeviceType(userAgent);
    const browserInfo = getBrowserInfo(userAgent);
    const os = getOS(userAgent);

    // Categorize referrer
    const refererCategory = categorizeReferrer(referer);

    // Get location (async, but we'll store null if not available)
    const location = await getLocationFromIp(rawIpAddress);

    // Record the page visit with all analytics data
    await db.pageVisit.create({
      data: {
        path,
        referer: referer || null,
        refererCategory,
        ipAddress,
        userAgent,
        deviceType,
        browser: browserInfo.name,
        browserVersion: browserInfo.version,
        os,
        country: location.country,
        city: location.city,
        sessionId: sessionId || null,
        isBot: botCheck,
        loadTime: loadTime || null,
        firstContentfulPaint: firstContentfulPaint || null,
        largestContentfulPaint: largestContentfulPaint || null,
        cumulativeLayoutShift: cumulativeLayoutShift || null,
        firstInputDelay: firstInputDelay || null,
        conversationId: conversationId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page visit:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}
