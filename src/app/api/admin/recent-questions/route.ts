import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { loadQuestionLog } from '@/lib/chatbot-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const data = await loadQuestionLog();
    const questions = (data.all_questions || [])
      .sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);

    return NextResponse.json({ questions }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error('Error fetching recent questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
