import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { addAdminAnswerToKnowledgeBase } from '@/lib/chatbot-service';
import { db } from '@/lib/db';

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
    const body = await request.json();
    const { answer, add_to_knowledge_base } = body;

    if (!answer || !answer.trim()) {
      return NextResponse.json(
        { error: 'Answer is required' },
        { status: 400 }
      );
    }

    const existing = await db.unansweredQuestion.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const trimmedAnswer = answer.trim();

    await db.unansweredQuestion.update({
      where: { id },
      data: {
        answer: trimmedAnswer,
        status: 'answered'
      }
    });

    const questionText = existing.question;
    let chunkResult: { added: number } | null = null;
    if (add_to_knowledge_base) {
      try {
        chunkResult = await addAdminAnswerToKnowledgeBase(questionText, trimmedAnswer);
      } catch (err) {
        console.error('Failed to add answer to knowledge base:', err);
      }
    }

    return NextResponse.json({
      success: true,
      chunk_added: chunkResult ? { title: questionText, added: chunkResult.added } : null
    });
  } catch (error: any) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { error: 'Failed to save answer', message: error.message },
      { status: 500 }
    );
  }
}
