import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { loadQuestionLog } from '@/lib/chatbot-service';
import { promises as fs } from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'chatbot', 'feedback', 'leads.json');

async function loadLeads() {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.leads || [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logData = await loadQuestionLog();
    const questions = logData.all_questions || [];
    const leads = await loadLeads();
    const leadsByConvId = new Map<string, any>();
    leads.forEach((lead: any) => {
      if (lead.conversation_id) {
        leadsByConvId.set(lead.conversation_id, lead);
      }
    });

    // Group questions by conversation_id; include IP and recruiter info from leads
    const sessionsMap = new Map<string, any>();

    questions.forEach((q: any) => {
      const convId = q.metadata?.conversation_id || 'unknown';
      if (!sessionsMap.has(convId)) {
        const lead = leadsByConvId.get(convId);
        sessionsMap.set(convId, {
          conversation_id: convId,
          questions: [],
          question_count: 0,
          first_question_at: q.timestamp,
          last_question_at: q.timestamp,
          ip: q.metadata?.ip || lead?.ip || null,
          recruiter: lead
            ? {
                name: lead.name,
                organisation: lead.organisation,
                email: lead.email,
                phone: lead.phone,
                submitted_at: lead.submitted_at
              }
            : null
        });
      }

      const sess = sessionsMap.get(convId);
      sess.questions.push(q);
      sess.question_count++;

      const qTime = new Date(q.timestamp).getTime();
      const firstTime = new Date(sess.first_question_at).getTime();
      const lastTime = new Date(sess.last_question_at).getTime();

      if (qTime < firstTime) {
        sess.first_question_at = q.timestamp;
      }
      if (qTime > lastTime) {
        sess.last_question_at = q.timestamp;
      }
    });

    const sessions = Array.from(sessionsMap.values()).sort(
      (a, b) => new Date(b.last_question_at).getTime() - new Date(a.last_question_at).getTime()
    );

    return NextResponse.json({ sessions }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error('Error fetching conversation sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
