import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { anonymizeIp } from '@/lib/analytics-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, organisation, email, phone, conversation_id, activity_duration_ms, sessionId } = body;

    if (!name || !organisation) {
      return NextResponse.json(
        { error: 'Name and Organisation are required' },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'At least one of Email or Phone is required' },
        { status: 400 }
      );
    }

    const ipAddress = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const anonymizedIp = anonymizeIp(ipAddress);

    // Check for duplicates (same email or phone)
    // Handle email-based duplicates
    if (email) {
      const existingByEmail = await db.lead.findFirst({
        where: {
          email: email.trim().toLowerCase(),
        },
      });

      if (existingByEmail) {
        // Update existing lead instead of creating duplicate
        const updatedLead = await db.lead.update({
          where: { id: existingByEmail.id },
          data: {
            name: name.trim(),
            organisation: organisation.trim(),
            email: email.trim().toLowerCase(),
            phone: phone?.trim() || existingByEmail.phone,
            conversationId: conversation_id || existingByEmail.conversationId,
            activityDurationMs: activity_duration_ms || existingByEmail.activityDurationMs,
            updatedAt: new Date(),
          },
        });

        return NextResponse.json({ 
          success: true, 
          lead: updatedLead,
          duplicate: true 
        });
      }
    }

    // Handle phone-based duplicates (only if no email was provided)
    if (phone && !email) {
      const existingByPhone = await db.lead.findFirst({
        where: {
          phone: phone.trim(),
        },
      });

      if (existingByPhone) {
        // Update existing lead instead of creating duplicate
        const updatedLead = await db.lead.update({
          where: { id: existingByPhone.id },
          data: {
            name: name.trim(),
            organisation: organisation.trim(),
            email: existingByPhone.email,
            phone: phone.trim(),
            conversationId: conversation_id || existingByPhone.conversationId,
            activityDurationMs: activity_duration_ms || existingByPhone.activityDurationMs,
            updatedAt: new Date(),
          },
        });

        return NextResponse.json({ 
          success: true, 
          lead: updatedLead,
          duplicate: true 
        });
      }
    }

    // Calculate lead score based on activity
    let score = 0;
    if (activity_duration_ms) {
      // More time = higher score (up to 50 points)
      score += Math.min(50, Math.floor(activity_duration_ms / 10000));
    }
    if (conversation_id) {
      score += 20; // Bonus for chatbot engagement
    }
    if (email && phone) {
      score += 10; // Bonus for providing both contact methods
    }

    // Create new lead
    let lead;
    try {
      lead = await db.lead.create({
        data: {
          name: name.trim(),
          organisation: organisation.trim(),
          email: email?.trim().toLowerCase() || null,
          phone: phone?.trim() || null,
          conversationId: conversation_id || null,
          activityDurationMs: activity_duration_ms || null,
          ipAddress: anonymizedIp,
          sessionId: sessionId || null,
          status: 'new',
          score,
        },
      });
    } catch (dbError: any) {
      console.error('Database error creating lead:', dbError);
      console.error('Database error details:', {
        code: dbError?.code,
        meta: dbError?.meta,
        message: dbError?.message,
      });
      throw dbError; // Re-throw to be caught by outer catch
    }

    // Send email notification (async, don't wait - don't block response)
    // Use dynamic import to avoid breaking the route if email module has issues
    console.log('📧 Attempting to send email notification for lead:', lead.id);
    import('@/lib/email-notifications')
      .then(({ notifyNewLead }) => {
        console.log('✅ Email notifications module loaded, calling notifyNewLead');
        return notifyNewLead({
          id: lead.id,
          name: lead.name,
          organisation: lead.organisation,
          email: lead.email,
          phone: lead.phone,
          score: lead.score,
        });
      })
      .then(() => {
        console.log('✅ Email notification sent successfully for lead:', lead.id);
      })
      .catch(err => {
        console.error('❌ Failed to send email notification:', err);
        console.error('Email error details:', {
          message: err?.message,
          stack: err?.stack,
        });
      });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error('Error saving lead:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
      meta: error?.meta,
    });
    
    // Handle Prisma unique constraint violation
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { 
          error: 'A lead with this email or phone already exists',
          message: 'Duplicate entry detected'
        },
        { status: 409 }
      );
    }
    
    // In development, include full error details
    const errorResponse: any = {
      error: 'Failed to save lead',
    };
    
    if (process.env.NODE_ENV === 'development') {
      errorResponse.message = error?.message;
      errorResponse.code = error?.code;
      errorResponse.name = error?.name;
      if (error?.meta) {
        errorResponse.meta = error?.meta;
      }
    }
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
