// Contact form submission endpoint
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { anonymizeIp } from '@/lib/analytics-utils';
import { checkRateLimit } from '@/lib/contact-rate-limit';
import { notifyNewContactSubmission } from '@/lib/email-notifications';

// Honeypot field name (hidden from users)
const HONEYPOT_FIELD = 'website';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, message, sessionId, conversationId, [HONEYPOT_FIELD]: honeypot } = body;

    // Honeypot spam detection
    if (honeypot) {
      // Bot filled in honeypot field - mark as spam but don't reveal
      return NextResponse.json({ success: true, message: 'Thank you for your message!' });
    }

    // Validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Rate limiting (5 submissions per hour per IP)
    const ipAddress = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    
    const rateLimit = await checkRateLimit(ipAddress, 'contact');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    // Get additional metadata
    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;
    const anonymizedIp = anonymizeIp(ipAddress);

    // Check for duplicate submissions (same email in last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentDuplicate = await db.contactSubmission.findFirst({
      where: {
        email,
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    if (recentDuplicate) {
      return NextResponse.json(
        { error: 'You have already submitted a message recently. Please wait before submitting again.' },
        { status: 429 }
      );
    }

    // Create contact submission
    const submission = await db.contactSubmission.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        ipAddress: anonymizedIp,
        userAgent,
        referer,
        sessionId: sessionId || null,
        conversationId: conversationId || null,
        status: 'new',
      },
    });

    // Send email notification (async, don't wait - don't block response)
    notifyNewContactSubmission({
      id: submission.id,
      firstName: submission.firstName,
      lastName: submission.lastName,
      email: submission.email,
      message: submission.message,
    }).catch(err => {
      console.error('Failed to send email notification:', err);
      // Don't fail the request if email fails
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      id: submission.id,
    });
  } catch (error: any) {
    console.error('Error processing contact submission:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { 
        error: 'Failed to submit message. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}
