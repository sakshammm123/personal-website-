import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { loadUnansweredQuestions, saveUnansweredQuestions } from '@/lib/chatbot-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await loadUnansweredQuestions();
    const questionIndex = data.unanswered_questions.findIndex(
      (q: any) => q.id === id
    );

    if (questionIndex === -1) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    data.unanswered_questions[questionIndex].status = 'ignored';
    await saveUnansweredQuestions(data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error ignoring question:', error);
    return NextResponse.json(
      { error: 'Failed to ignore question', message: error.message },
      { status: 500 }
    );
  }
}
