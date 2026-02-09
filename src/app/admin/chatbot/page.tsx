'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CHATBOT_API_BASE = ''; // Use same origin (Next.js API routes)

interface Question {
  id: string;
  question: string;
  reply_given: string;
  first_asked: string;
  last_asked: string;
  ask_count: number;
  status?: string;
  answer?: string;
}

interface RecentQuestion {
  id: string;
  question: string;
  reply: string;
  timestamp: string;
  is_unanswered?: boolean;
  metadata?: { conversation_id?: string; ip?: string };
}

interface Session {
  conversation_id: string;
  question_count: number;
  first_question_at: string;
  last_question_at: string;
  ip: string | null;
  recruiter: { name: string; organisation: string; email?: string | null; phone?: string | null; submitted_at: string } | null;
  questions?: Array<{
    question: string;
    reply: string;
    timestamp: string;
    metadata?: { conversation_id?: string; ip?: string };
  }>;
}

interface CallbackLead {
  id: string;
  name: string;
  organisation: string;
  email: string | null;
  phone: string | null;
  conversation_id: string | null;
  activity_duration_ms: number | null;
  ip?: string;
  submitted_at: string;
}

interface Stats {
  total_questions: number;
  unanswered_count: number;
  answered_count: number;
}

export default function ChatbotAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'recent' | 'sessions' | 'callbacks'>('pending');
  const [stats, setStats] = useState<Stats>({ total_questions: 0, unanswered_count: 0, answered_count: 0 });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    if (status === 'authenticated') {
      fetchStats();
      if (activeTab === 'pending' || activeTab === 'all') {
        loadQuestions();
      } else if (activeTab === 'recent') {
        loadRecentQuestions();
      } else if (activeTab === 'sessions') {
        loadSessions();
      } else if (activeTab === 'callbacks') {
        loadCallbacks();
      }
    }
  }, [status, router, activeTab]);

  // Refetch stats when window gains focus so counts stay up to date
  useEffect(() => {
    if (status !== 'authenticated') return;
    const onFocus = () => fetchStats();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [status]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${CHATBOT_API_BASE}/api/admin/question-stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const all = activeTab === 'all';
      const res = await fetch(`${CHATBOT_API_BASE}/api/admin/unanswered-questions?all=${all}`);
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CHATBOT_API_BASE}/api/admin/recent-questions?limit=100`);
      const data = await res.json();
      setRecentQuestions(data.questions || []);
    } catch (err) {
      console.error('Failed to load recent questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CHATBOT_API_BASE}/api/admin/conversation-sessions`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCallbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CHATBOT_API_BASE}/api/admin/leads`);
      const data = await res.json();
      setCallbacks(data.leads || []);
    } catch (err) {
      console.error('Failed to load callbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAnswer = async (questionId: string, answer: string, addToKB: boolean) => {
    try {
      const res = await fetch(`${CHATBOT_API_BASE}/api/admin/unanswered-questions/${questionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer, add_to_knowledge_base: addToKB })
      });
      if (res.ok) {
        await loadQuestions();
        await fetchStats();
        alert('Answer saved successfully!');
      }
    } catch (err) {
      alert('Failed to save answer');
    }
  };

  const ignoreQuestion = async (questionId: string) => {
    if (!confirm('Ignore this question? It will be hidden from Pending.')) return;
    try {
      const res = await fetch(`${CHATBOT_API_BASE}/api/admin/unanswered-questions/${questionId}/ignore`, {
        method: 'POST'
      });
      if (res.ok) {
        await loadQuestions();
        await fetchStats();
        alert('Question ignored.');
      } else {
        alert('Failed to ignore question');
      }
    } catch (err) {
      alert('Failed to ignore question');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-brown-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50 text-brown-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <Link
              href="/admin/dashboard"
              className="text-brown-600 hover:text-brown-900 text-sm mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-semibold text-brown-900 mb-2">📊 Chatbot Admin Dashboard</h1>
            <p className="text-brown-600 text-sm sm:text-base">Track and manage unanswered questions to improve the chatbot</p>
          </div>
          <Link
            href="/admin/logout"
            className="px-4 py-2.5 bg-brown-500 text-cream-50 rounded-md hover:bg-brown-600 transition-colors font-medium text-sm sm:text-base min-h-[44px] flex items-center justify-center w-full sm:w-auto"
          >
            Logout
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="professional-card">
            <h3 className="text-sm uppercase tracking-wider text-brown-600 mb-2">Total Questions</h3>
            <div className="text-3xl font-bold text-brown-900">{stats.total_questions}</div>
          </div>
          <div className="professional-card">
            <h3 className="text-sm uppercase tracking-wider text-brown-600 mb-2">Unanswered</h3>
            <div className="text-3xl font-bold text-brown-900">{stats.unanswered_count}</div>
          </div>
          <div className="professional-card">
            <h3 className="text-sm uppercase tracking-wider text-brown-600 mb-2">Answered</h3>
            <div className="text-3xl font-bold text-brown-900">{stats.answered_count}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-brown-200 overflow-x-auto">
          <nav className="flex gap-2 sm:gap-4 min-w-max">
            {(['pending', 'all', 'recent', 'sessions', 'callbacks'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-h-[44px] ${
                  activeTab === tab
                    ? 'text-brown-900 border-b-2 border-brown-600'
                    : 'text-brown-600 hover:text-brown-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'recent' ? (
            loading ? (
              <div className="text-center py-12 text-brown-600">Loading...</div>
            ) : recentQuestions.length === 0 ? (
              <div className="text-center py-12 text-brown-600">No questions yet</div>
            ) : (
              recentQuestions.map((q) => (
                <RecentQuestionCard key={q.id} item={q} />
              ))
            )
          ) : activeTab === 'sessions' ? (
            loading ? (
              <div className="text-center py-12 text-brown-600">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12 text-brown-600">No sessions yet</div>
            ) : (
              sessions.map((s) => (
                <SessionCard key={s.conversation_id} session={s} />
              ))
            )
          ) : activeTab === 'callbacks' ? (
            loading ? (
              <div className="text-center py-12 text-brown-600">Loading...</div>
            ) : callbacks.length === 0 ? (
              <div className="text-center py-12 text-brown-600">No inquiries yet</div>
            ) : (
              callbacks.map((c) => (
                <CallbackCard key={c.id} lead={c} />
              ))
            )
          ) : loading ? (
            <div className="text-center py-12 text-brown-600">Loading...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-brown-600">No questions found</div>
          ) : (
            questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onSaveAnswer={saveAnswer}
                onIgnore={ignoreQuestion}
                showIgnore={activeTab === 'pending' || activeTab === 'all'}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  onSaveAnswer,
  onIgnore,
  showIgnore
}: {
  question: Question;
  onSaveAnswer: (id: string, answer: string, addToKB: boolean) => void;
  onIgnore: (id: string) => void;
  showIgnore: boolean;
}) {
  const [answer, setAnswer] = useState('');
  const [addToKB, setAddToKB] = useState(false);
  const isPending = question.status === 'pending';
  const isIgnored = question.status === 'ignored';

  return (
    <div className="professional-card">
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-semibold text-brown-900 mb-2">{question.question}</h4>
            <div className="text-sm text-brown-600 space-y-1">
              <p>First asked: {new Date(question.first_asked).toLocaleString()}</p>
              <p>Last asked: {new Date(question.last_asked).toLocaleString()}</p>
              {question.ask_count > 1 && <p>Asked {question.ask_count} times</p>}
              {isIgnored && <span className="text-brown-500 font-medium">Ignored</span>}
            </div>
          </div>
          {showIgnore && isPending && !question.answer && (
            <button
              type="button"
              onClick={() => onIgnore(question.id)}
              className="shrink-0 px-3 py-1.5 text-sm border border-brown-400 text-brown-700 rounded-md hover:bg-brown-100 transition-colors"
            >
              Ignore
            </button>
          )}
        </div>
        <div className="bg-cream-100 p-3 rounded-md border border-brown-200">
          <strong className="text-brown-900 text-sm">Bot&apos;s Reply:</strong>
          <p className="text-brown-700 text-sm mt-1">{question.reply_given}</p>
        </div>
        {!question.answer ? (
          <div className="space-y-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer to this question..."
              className="w-full px-4 py-2 border border-brown-300 rounded-md bg-cream-50 text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-400"
              rows={4}
            />
            <label className="flex items-center gap-2 text-sm text-brown-700">
              <input
                type="checkbox"
                checked={addToKB}
                onChange={(e) => setAddToKB(e.target.checked)}
                className="w-4 h-4 text-brown-600 border-brown-300 rounded"
              />
              Add to knowledge base
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onSaveAnswer(question.id, answer, addToKB)}
                disabled={!answer.trim()}
                className="px-4 py-2 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Save Answer
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 p-3 rounded-md border border-green-200">
            <strong className="text-green-900 text-sm">Your Answer:</strong>
            <p className="text-green-800 text-sm mt-1">{question.answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RecentQuestionCard({ item }: { item: RecentQuestion }) {
  return (
    <div className="professional-card">
      <div className="space-y-2">
        <p className="text-sm text-brown-600">
          {new Date(item.timestamp).toLocaleString()}
          {item.is_unanswered && <span className="ml-2 text-amber-700 font-medium">(unanswered)</span>}
        </p>
        <h4 className="font-semibold text-brown-900">{item.question}</h4>
        <div className="bg-cream-100 p-3 rounded-md border border-brown-200 text-sm text-brown-700">
          {item.reply}
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="professional-card">
      <div className="space-y-2">
        <p className="text-sm text-brown-600 font-mono">{session.conversation_id}</p>
        <p className="text-sm text-brown-700">
          <strong>IP:</strong> {session.ip ?? '—'} · <strong>Questions:</strong> {session.question_count}
        </p>
        <p className="text-sm text-brown-600">
          First: {new Date(session.first_question_at).toLocaleString()} · Last: {new Date(session.last_question_at).toLocaleString()}
        </p>
        
        {/* Questions Dropdown */}
        {session.questions && session.questions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-brown-200">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-sm font-medium text-brown-900 hover:text-brown-700 transition-colors"
            >
              <span>View Questions ({session.questions.length})</span>
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isExpanded && (
              <div className="mt-3 space-y-3 max-h-96 overflow-y-auto">
                {session.questions.map((q, idx) => (
                  <div key={idx} className="bg-cream-100 p-3 rounded-md border border-brown-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs text-brown-500">
                        {new Date(q.timestamp).toLocaleString()}
                      </p>
                      <span className="text-xs text-brown-600 bg-brown-200 px-2 py-0.5 rounded">
                        Q{idx + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-brown-900 mb-2">
                      {q.question}
                    </p>
                    <div className="bg-white p-2 rounded border border-brown-200">
                      <p className="text-xs text-brown-600 font-medium mb-1">Bot Reply:</p>
                      <p className="text-sm text-brown-700">{q.reply}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {session.recruiter && (
          <div className="mt-3 pt-3 border-t border-brown-200">
            <p className="text-sm font-medium text-brown-900">Recruiter info (from contact)</p>
            <p className="text-sm text-brown-700">
              {session.recruiter.name}, {session.recruiter.organisation}
              {session.recruiter.email && ` · ${session.recruiter.email}`}
              {session.recruiter.phone && ` · ${session.recruiter.phone}`}
            </p>
            <p className="text-xs text-brown-500">Submitted: {new Date(session.recruiter.submitted_at).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CallbackCard({ lead }: { lead: CallbackLead }) {
  return (
    <div className="professional-card">
      <div className="space-y-2">
        <h4 className="font-semibold text-brown-900">{lead.name}</h4>
        <p className="text-sm text-brown-700">{lead.organisation}</p>
        <p className="text-sm text-brown-600">
          {lead.email && <span>{lead.email}</span>}
          {lead.email && lead.phone && ' · '}
          {lead.phone && <span>{lead.phone}</span>}
        </p>
        <p className="text-xs text-brown-500">
          Submitted: {new Date(lead.submitted_at).toLocaleString()}
          {lead.ip && ` · IP: ${lead.ip}`}
          {lead.conversation_id && ` · Conv: ${lead.conversation_id}`}
        </p>
        {lead.activity_duration_ms != null && (
          <p className="text-xs text-brown-500">Activity: {Math.round(lead.activity_duration_ms / 60000)} min</p>
        )}
      </div>
    </div>
  );
}
