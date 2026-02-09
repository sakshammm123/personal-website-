import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { loadUnansweredQuestions } from '@/lib/chatbot-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const data = await loadUnansweredQuestions();
    let questions = data.unanswered_questions || [];

    if (!all) {
      questions = questions.filter((q: any) => q.status === 'pending');
    }

    return NextResponse.json({ questions }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error('Error fetching unanswered questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
