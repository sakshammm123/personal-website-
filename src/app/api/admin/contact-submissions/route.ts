// Contact submissions management endpoint
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const submissions = await db.contactSubmission.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
