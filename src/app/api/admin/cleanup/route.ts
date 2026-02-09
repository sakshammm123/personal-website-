// Data retention cleanup endpoint (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { runDataRetentionCleanup } from '@/lib/data-retention';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run cleanup
    await runDataRetentionCleanup();

    return NextResponse.json({
      success: true,
      message: 'Data retention cleanup completed',
    });
  } catch (error) {
    console.error('Error running cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to run cleanup' },
      { status: 500 }
    );
  }
}
