// Restore knowledge base version
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { restoreVersion } from '@/lib/knowledge-base-versioning';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { error: 'versionId is required' },
        { status: 400 }
      );
    }

    await restoreVersion(versionId);

    return NextResponse.json({ 
      success: true, 
      message: `Knowledge base restored to version ${versionId}` 
    });
  } catch (error: any) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to restore version' },
      { status: 500 }
    );
  }
}
