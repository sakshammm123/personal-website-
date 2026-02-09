import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { loadUnansweredQuestions, loadQuestionLog } from '@/lib/chatbot-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const unansweredData = await loadUnansweredQuestions();
    const logData = await loadQuestionLog();

    const totalQuestions = logData.all_questions?.length || 0;
    const unansweredCount = unansweredData.unanswered_questions?.filter(
      (q: any) => q.status === 'pending'
    ).length || 0;
    const answeredCount = unansweredData.unanswered_questions?.filter(
      (q: any) => q.status === 'answered'
    ).length || 0;

    return NextResponse.json(
      {
        total_questions: totalQuestions,
        unanswered_count: unansweredCount,
        answered_count: answeredCount
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Error fetching question stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
