// Chatbot Service - Core logic extracted from server.js
// This file contains the chatbot processing logic for Next.js API routes

import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import { db } from '@/lib/db';

// Paths
const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), 'data', 'chatbot', 'knowledge-base');
const FEEDBACK_DIR = path.join(process.cwd(), 'data', 'chatbot', 'feedback');
const CHUNKS_FILE = path.join(KNOWLEDGE_BASE_DIR, 'chunks.json');
const PROFILE_FILE = path.join(KNOWLEDGE_BASE_DIR, 'profile.json');
const UNANSWERED_QUESTIONS_FILE = path.join(FEEDBACK_DIR, 'unanswered-questions.json');
const QUESTION_LOG_FILE = path.join(FEEDBACK_DIR, 'question-log.json');
const VISITORS_FILE = path.join(FEEDBACK_DIR, 'visitors.json');

// Gemini config - key read at runtime so env is picked up after restart
const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
};

function getModel() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    console.error('❌ ERROR: GEMINI_API_KEY is not set in environment variables!');
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig,
  });
}

// In-memory conversation storage
const conversations = new Map<string, Array<{ role: 'user' | 'assistant'; content: string }>>();

// Cache for chunks
let chunks: any[] | null = null;
let chunksLastModified: number | null = null;

// Admin-answer chunks get priority in retrieval
const ADMIN_ANSWER_SOURCE = 'admin_answer';
const MAX_CHUNK_CONTENT_LENGTH = 500;

// Rate limiting
const IP_COOLDOWN_MS = 8000;
const lastRequestAtByIP = new Map<string, number>();

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(FEEDBACK_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create feedback directory:', error);
  }
}

// Load chunks from file
async function loadChunks() {
  try {
    const stats = await fs.stat(CHUNKS_FILE);
    const currentModified = stats.mtime.getTime();
    
    if (!chunks || !chunksLastModified || currentModified > chunksLastModified) {
      const data = await fs.readFile(CHUNKS_FILE, 'utf8');
      chunks = JSON.parse(data);
      chunksLastModified = currentModified;
      console.log(`📚 Loaded ${(chunks ?? []).length} chunks from knowledge base`);
    }
    return chunks ?? [];
  } catch (error) {
    console.error('Error loading chunks:', error);
    return [];
  }
}

// Load profile data
async function loadProfile() {
  try {
    const data = await fs.readFile(PROFILE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading profile:', error);
    return {};
  }
}

// Load unanswered questions from the database (with backward-compatible shape)
async function loadUnansweredQuestions() {
  try {
    const items = await db.unansweredQuestion.findMany({
      orderBy: { firstAsked: 'asc' }
    });

    return {
      unanswered_questions: items.map((item) => ({
        id: item.id,
        question: item.question,
        reply_given: item.replyGiven,
        first_asked: item.firstAsked.toISOString(),
        last_asked: item.lastAsked.toISOString(),
        ask_count: item.askCount,
        status: item.status,
        answer: item.answer,
        metadata: item.metadata ?? {}
      })),
      last_updated: new Date().toISOString(),
      metadata: {
        description: 'Unanswered chatbot questions stored in database',
        format: 'Each entry mirrors previous JSON structure but is backed by Prisma'
      }
    };
  } catch (error) {
    console.error('Failed to load unanswered questions from database:', error);
    return { unanswered_questions: [], last_updated: null, metadata: {} };
  }
}

// Load question log from the database (with backward-compatible shape)
async function loadQuestionLog() {
  try {
    const questions = await db.chatQuestion.findMany({
      orderBy: { askedAt: 'asc' }
    });

    return {
      all_questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        reply: q.reply,
        timestamp: q.askedAt.toISOString(),
        is_unanswered: q.isUnanswered,
        metadata: q.metadata ?? {}
      })),
      last_updated: new Date().toISOString(),
      metadata: {
        description: 'Complete log of all questions asked to the chatbot (database-backed)',
        format: 'Each entry contains question, response, timestamp, and metadata'
      }
    };
  } catch (error) {
    console.error('Failed to load question log from database:', error);
    return { all_questions: [], last_updated: null, metadata: {} };
  }
}

// Get conversation history
function getConversationHistory(conversationId: string) {
  if (!conversationId || !conversations.has(conversationId)) {
    return [];
  }
  return conversations.get(conversationId) || [];
}

// Save conversation history
function saveConversationHistory(conversationId: string, history: Array<{ role: 'user' | 'assistant'; content: string }>) {
  if (history.length > 20) {
    history = history.slice(-20);
  }
  conversations.set(conversationId, history);
}

// Check if reply indicates unanswered (broad patterns so we catch "I don't have that" style replies)
function isUnansweredReply(reply: string, userQuery: string): boolean {
  if (!reply || typeof reply !== 'string') return false;

  const replyLower = reply.toLowerCase();
  const unansweredPatterns = [
    /sorry.*(unable|don't|can't|do not|cannot).*(access|have|provide|find).*information/i,
    /please contact.*@.*for/i,
    /don't have (that|this|any).*information/i,
    /can't provide.*information/i,
    /(don't|do not) have (that|this) (in my|in the) (context|knowledge)/i,
    /(outside|beyond) (my|the) (context|knowledge)/i,
    /(limited|no).*information (on|about)/i,
    /reach out.*contact/i,
    /not (in|within) (my|the) (context|knowledge base)/i,
    /i (don't|do not) have.*(that|this|specific)/i,
    /(don't|do not) have (enough|that) (info|context)/i,
  ];

  if (unansweredPatterns.some((p) => p.test(replyLower))) return true;

  // Short reply that suggests contact and no real answer
  if (reply.trim().length < 120 && /\bcontact\b.*@|@.*\bcontact\b/i.test(replyLower)) return true;

  return false;
}

// Log question to the database
async function logQuestion(question: string, reply: string, metadata: any = {}) {
  try {
    const isUnanswered = isUnansweredReply(reply, question);

    const entry = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      reply,
      timestamp: new Date().toISOString(),
      is_unanswered: isUnanswered,
      metadata: {
        conversation_id: metadata.conversation_id || null,
        ip: metadata.ip || null,
        chunks_used: metadata.chunks_used || 0,
        ...metadata
      }
    };

    // Persist to database
    await db.chatQuestion.create({
      data: {
        id: entry.id,
        question: entry.question,
        reply: entry.reply,
        askedAt: new Date(entry.timestamp),
        isUnanswered: entry.is_unanswered,
        conversationId: entry.metadata.conversation_id || null,
        metadata: entry.metadata
      }
    });

    if (isUnanswered) {
      await logUnansweredQuestion(question, reply, metadata);
    }

    return entry;
  } catch (error) {
    console.error('Failed to log question to database:', error);
  }
}

// Log unanswered question to the database
async function logUnansweredQuestion(question: string, reply: string, metadata: any = {}) {
  try {
    const existing = await db.unansweredQuestion.findFirst({
      where: {
        question: {
          equals: question,
          mode: 'insensitive'
        }
      }
    });

    const now = new Date();

    if (existing) {
      const updated = await db.unansweredQuestion.update({
        where: { id: existing.id },
        data: {
          replyGiven: reply,
          lastAsked: now,
          askCount: existing.askCount + 1,
          metadata: {
            ...(existing.metadata as any),
            conversation_id: metadata.conversation_id || null,
            chunks_used: metadata.chunks_used || 0,
            ...metadata
          }
        }
      });

      return {
        id: updated.id,
        question: updated.question,
        reply_given: updated.replyGiven,
        first_asked: updated.firstAsked.toISOString(),
        last_asked: updated.lastAsked.toISOString(),
        ask_count: updated.askCount,
        status: updated.status,
        answer: updated.answer,
        metadata: updated.metadata ?? {}
      };
    }

    const created = await db.unansweredQuestion.create({
      data: {
        id: `uq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question,
        replyGiven: reply,
        firstAsked: now,
        lastAsked: now,
        askCount: 1,
        status: 'pending',
        answer: null,
        metadata: {
          conversation_id: metadata.conversation_id || null,
          chunks_used: metadata.chunks_used || 0,
          ...metadata
        }
      }
    });

    return {
      id: created.id,
      question: created.question,
      reply_given: created.replyGiven,
      first_asked: created.firstAsked.toISOString(),
      last_asked: created.lastAsked.toISOString(),
      ask_count: created.askCount,
      status: created.status,
      answer: created.answer,
      metadata: created.metadata ?? {}
    };
  } catch (error) {
    console.error('Failed to log unanswered question to database:', error);
  }
}

// Split answer text into chunks (by paragraph, then by size) for storage
function splitAnswerIntoChunks(answer: string): string[] {
  const trimmed = answer.trim();
  if (!trimmed) return [];

  const paragraphs = trimmed.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const result: string[] = [];

  for (const para of paragraphs) {
    if (para.length <= MAX_CHUNK_CONTENT_LENGTH) {
      result.push(para);
    } else {
      // Split long paragraph by sentence, then rejoin into ~MAX_CHUNK_CONTENT_LENGTH chunks
      const sentences = para.split(/(?<=[.!?])\s+/).filter(Boolean);
      let current = '';
      for (const sent of sentences) {
        if (current.length + sent.length + 1 <= MAX_CHUNK_CONTENT_LENGTH) {
          current = current ? current + ' ' + sent : sent;
        } else {
          if (current) result.push(current);
          current = sent;
        }
      }
      if (current) result.push(current);
    }
  }

  return result.length > 0 ? result : [trimmed];
}

// Derive tags from question text (words length > 2, lowercased, no punctuation)
function deriveTagsFromQuestion(question: string): string[] {
  const words = question
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  const unique = [...new Set(words)];
  return unique.slice(0, 10);
}

// Add admin-provided Q&A to knowledge base as chunk(s); they get priority in retrieval
export async function addAdminAnswerToKnowledgeBase(question: string, answer: string): Promise<{ added: number }> {
  await ensureDirectories();
  const contentChunks = splitAnswerIntoChunks(answer);
  if (contentChunks.length === 0) return { added: 0 };

  const tags = deriveTagsFromQuestion(question);
  const baseId = `chunk_admin_${Date.now()}`;
  const newChunks: any[] = contentChunks.map((content, idx) => ({
    id: contentChunks.length === 1 ? baseId : `${baseId}_${idx + 1}`,
    title: contentChunks.length === 1 ? question : `${question} (part ${idx + 1})`,
    content,
    tags: [...tags, 'admin_answer', 'direct_answer'],
    source: ADMIN_ANSWER_SOURCE,
    competencies: [],
  }));

  let chunksArray: any[];
  try {
    const data = await fs.readFile(CHUNKS_FILE, 'utf8');
    chunksArray = JSON.parse(data);
  } catch {
    chunksArray = [];
  }

  chunksArray = [...chunksArray, ...newChunks];
  await fs.writeFile(CHUNKS_FILE, JSON.stringify(chunksArray, null, 2), 'utf8');

  // Invalidate cache so next retrieval sees new chunks
  chunks = null;
  chunksLastModified = null;

  console.log(`📚 Added ${newChunks.length} chunk(s) from admin answer to knowledge base`);
  return { added: newChunks.length };
}

// Common words to exclude from keyword scoring so "like"/"what" don't over-match
const RETRIEVAL_STOPWORDS = new Set([
  'like', 'what', 'does', 'his', 'her', 'their', 'the', 'and', 'for', 'are', 'how', 'when',
  'where', 'which', 'who', 'about', 'with', 'have', 'has', 'that', 'this', 'from', 'into',
  'more', 'some', 'would', 'could', 'should', 'did', 'can', 'will', 'want', 'know', 'tell',
  'get', 'than', 'them', 'they', 'been', 'being', 'were', 'said', 'each', 'other', 'these',
  'those', 'then', 'than', 'just', 'only', 'very', 'also', 'into', 'over', 'such', 'here',
]);

// Simplified retrieve relevant chunks (basic keyword matching)
async function retrieveRelevantChunks(query: string, topN: number = 5) {
  const chunksArray = await loadChunks();
  if (!chunksArray || chunksArray.length === 0) return [];

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(
    (w) => w.length > 3 && !RETRIEVAL_STOPWORDS.has(w)
  );
  const hasMeaningfulQuery = queryWords.length > 0;

  const scored = chunksArray.map((chunk: any) => {
    let score = 0;
    const title = (chunk.title || '').toLowerCase();
    const content = (chunk.content || '').toLowerCase();
    const tags = (chunk.tags || []).join(' ').toLowerCase();

    // Admin answers: strong priority so your direct answers override other content
    if (chunk.source === ADMIN_ANSWER_SOURCE) {
      score += 25;
    }

    // Full query in title/content (high signal)
    if (title.includes(queryLower)) score += 10;
    if (queryLower.length >= 8 && queryLower.includes(title)) score += 5;
    if (content.includes(queryLower)) score += 3;
    if (tags.includes(queryLower)) score += 5;

    // Keyword matching: only score meaningful words (not "like", "what", etc.)
    queryWords.forEach((word) => {
      if (title.includes(word)) score += 2;
      if (content.includes(word)) score += 1;
      if (tags.includes(word)) score += 2;
    });

    // Require at least one meaningful word match for generic queries (reduces "like"-only match)
    if (hasMeaningfulQuery && queryWords.length >= 1) {
      const matchCount = queryWords.filter(
        (w) => title.includes(w) || content.includes(w) || tags.includes(w)
      ).length;
      if (matchCount === 0) score -= 15;
    }

    return { chunk, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((item) => item.chunk);
}

// Use Gemini to select the most relevant passages for the user's question (improves answer accuracy)
const MAX_PASSAGES_FOR_SELECTION = 12;
const MAX_PASSAGES_AFTER_SELECTION = 6;

async function selectRelevantChunksWithGemini(
  model: Awaited<ReturnType<typeof getModel>>,
  userQuestion: string,
  chunks: any[]
): Promise<any[]> {
  if (!model || chunks.length === 0) return chunks;
  if (chunks.length <= MAX_PASSAGES_AFTER_SELECTION) return chunks;

  const numberedPassages = chunks
    .slice(0, MAX_PASSAGES_FOR_SELECTION)
    .map((chunk, idx) => `[${idx + 1}] Title: ${chunk.title || 'Untitled'}\nContent: ${(chunk.content || '').slice(0, 400)}`)
    .join('\n\n');

  const selectionPrompt = `You are a relevance filter. Given a user question and numbered passages from a knowledge base, output ONLY the passage numbers that are most relevant to answering the question, in order of relevance (most relevant first).

User question: ${userQuestion}

Passages (numbered 1 to ${Math.min(chunks.length, MAX_PASSAGES_FOR_SELECTION)}):
${numberedPassages}

Output only the relevant passage numbers, comma-separated (e.g. 2,5,1,7). Include only passages that directly help answer the question. If none are relevant, output "0".`;

  try {
    const result = await model.generateContent(selectionPrompt);
    const text = result.response.text().trim();
    const numbers: number[] = [];
    const matches = text.match(/\d+/g);
    if (matches) {
      for (const m of matches) {
        const n = parseInt(m, 10);
        if (n >= 1 && n <= chunks.length && !numbers.includes(n)) numbers.push(n);
      }
    }
    if (numbers.length === 0) return chunks.slice(0, MAX_PASSAGES_AFTER_SELECTION);
    return numbers.slice(0, MAX_PASSAGES_AFTER_SELECTION).map((n) => chunks[n - 1]);
  } catch (err) {
    console.error('Gemini passage selection failed, using keyword order:', err);
    return chunks.slice(0, MAX_PASSAGES_AFTER_SELECTION);
  }
}

// Get system prompt with structured context for accurate, well-structured answers
async function getSystemPrompt(relevantChunks: any[] = [], originalQuery: string = '') {
  const profileData = await loadProfile();
  const profileContext = `[PROFILE DATA]\n${JSON.stringify(profileData, null, 2)}`;

  let chunksContext = '';
  if (relevantChunks.length > 0) {
    chunksContext = relevantChunks
      .map(
        (chunk, idx) =>
          `[PASSAGE ${idx + 1}]\nTitle: ${chunk.title || 'Untitled'}\nContent: ${chunk.content || ''}`
      )
      .join('\n\n---\n\n');
    chunksContext = `${chunksContext}\n\n---\n\n${profileContext}`;
  } else {
    chunksContext = profileContext;
  }

  return `You are Saksham.AI, a professional recruiting concierge chatbot representing Saksham Mahajan. Your role is to help recruiters learn about Saksham's background, experience, skills, and availability.

ANSWER ACCURACY AND STRUCTURE:
1. Use ONLY the SELECTED PASSAGES and PROFILE DATA below to answer. Base your answer directly on this context—prefer specific details (names, roles, outcomes, dates) over vague statements.
2. If the question is about a specific topic (e.g. a company, a project, education), use only passages that relate to that topic. Do not mix in unrelated passages.
3. Structure your answer: be direct, concise, and factual. Lead with the most relevant point, then add supporting detail if needed.
4. Do not use markdown (no **, *, _, #, bullets, or code blocks). Write in plain, conversational sentences.
5. If no passage or profile data is relevant to the question, say so briefly and do not invent information.

RULES:
- NEVER share: salary, personal contact info, family details, government IDs.
- Review conversation history for short replies like "yes", "tell me more"—understand what they refer to.
- Share contact email (contact@sakshammahajan.com) ONLY when the user explicitly asks how to contact Saksham.
- DO NOT REPEAT content you have already said in this conversation. If you already answered something (e.g. work experience, education), do not say it again word-for-word. Either refer back briefly ("As I mentioned, ...") or add only new details. Keep replies fresh and non-repetitive.
- NEVER say that "the provided documents do not contain", "I am sorry but the provided documents", "the documents do not contain information", or similar. If a topic is not in the context, do NOT expose that. Instead give a brief helpful response: suggest exploring the Work or Education pages for more on Saksham, or invite them to ask something else. Keep the tone positive and helpful.

SELECTED RELEVANT PASSAGES AND PROFILE (use these to answer accurately):
${chunksContext}`;
}

// Phrases that must never appear in replies (inappropriate / expose lack of context)
const FORBIDDEN_REPLY_PATTERNS = [
  /provided documents do not contain/i,
  /the provided documents (do not|don't) contain/i,
  /documents do not contain (information about|any)/i,
  /I am sorry,?\s*but the provided documents/i,
  /I'm sorry,?\s*but the provided documents/i,
  /(sorry|unfortunately),?\s*the (provided )?documents (do not|don't)/i,
  /(do not|don't) contain information (about|regarding)/i,
  /no information (about|regarding|on) .* (in|in the) (provided )?(documents|context)/i,
  /(provided )?(documents|context) (do not|don't) (contain|include)/i,
];

function isInappropriateReply(reply: string): boolean {
  if (!reply || typeof reply !== 'string') return false;
  const r = reply.trim();
  if (r.length < 20) return false;
  return FORBIDDEN_REPLY_PATTERNS.some((p) => p.test(r));
}

// Safe fallback when the model gives an inappropriate reply even after retry
function getSafeFallbackReply(userQuery: string): string {
  const q = userQuery.toLowerCase();
  if (/\b(work|job|experience|career|company)\b/.test(q)) {
    return "Saksham's work experience and roles are covered in detail on the Work page. I'd suggest exploring that for the full picture. Is there something specific you'd like to know?";
  }
  if (/\b(education|degree|school|study)\b/.test(q)) {
    return "Saksham's education and qualifications are on the Education page. Take a look there for the full picture. Anything else I can help with?";
  }
  return "I'd be happy to help. You might find more on Saksham's experience on the Work and Education pages. Is there something specific you'd like to know?";
}

// Clean reply (remove markdown, noise characters, and unwanted formatting)
function cleanReply(reply: string, userQuery: string = ''): string {
  if (!reply) return reply;

  // Remove markdown bold/italic (content preserved)
  reply = reply.replace(/\*\*(.*?)\*\*/g, '$1');
  reply = reply.replace(/\*(.*?)\*/g, '$1');
  reply = reply.replace(/__(.*?)__/g, '$1');
  reply = reply.replace(/_(.*?)_/g, '$1');

  // Remove code blocks and inline code
  reply = reply.replace(/```[\s\S]*?```/g, '');
  reply = reply.replace(/`([^`]+)`/g, '$1');

  // Remove markdown headers (# ## ### etc.)
  reply = reply.replace(/^#{1,6}\s*/gm, '');

  // Remove bullet/list markers at line start ( -, *, •, # )
  reply = reply.replace(/^[\s]*[-*•#]\s+/gm, '');
  reply = reply.replace(/^[\s]*\d+\.\s+/gm, '');

  // Remove separator lines (only dashes, asterisks, underscores)
  reply = reply.replace(/^\s*[-*_]{2,}\s*$/gm, '');

  // Remove stray standalone formatting chars (e.g. leftover * or _ not part of words)
  reply = reply.replace(/\s+[\*_]\s+/g, ' ');
  reply = reply.replace(/\s+[\*_]$/g, '');
  reply = reply.replace(/^[\*_]\s+/g, '');

  // Collapse multiple newlines to at most two (one blank line)
  reply = reply.replace(/\n{3,}/g, '\n\n');
  // Collapse multiple spaces to one
  reply = reply.replace(/[ \t]+/g, ' ');

  return reply.trim();
}

// Check if general conversation
function isGeneralConversation(message: string): boolean {
  const msg = message.trim();
  const greetingPatterns = [
    /^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i,
    /^(how are you|how's it going|what's up)/i,
  ];
  return greetingPatterns.some(pattern => pattern.test(msg));
}

// Handle general conversation
function handleGeneralConversation(message: string): string {
  const msg = message.trim().toLowerCase();
  
  if (/^(hi|hello|hey|greetings)/i.test(msg)) {
    return "Hello! I'm Saksham.AI, here to help you learn about Saksham's professional background, experience, and career interests. What would you like to know?";
  }
  
  if (/^(how are you|how's it going)/i.test(msg)) {
    return "I'm doing well, thank you! I'm here to help you learn about Saksham's experience, skills, education, and career goals. What would you like to know?";
  }
  
  if (/^(thanks|thank you)/i.test(msg)) {
    return "You're welcome! Feel free to ask me anything about Saksham's background, experience, skills, or career interests.";
  }
  
  if (/^(bye|goodbye)/i.test(msg)) {
    return "Goodbye! If you have any more questions about Saksham's professional background, feel free to reach out anytime.";
  }
  
  return "Hello! I'm here to help you learn about Saksham's professional background, experience at Pita Pit, skills, education, and career interests. What would you like to know?";
}

// Append link to Work or Education page when the question is about work or education (for full profile)
function appendPageLinkIfRelevant(reply: string, userQuery: string): string {
  if (!reply || !userQuery) return reply;
  const q = userQuery.toLowerCase().trim();
  const aboutWork =
    /\b(work|job|role|experience|career|company|companies|pita pit|beam suntory|employment)\b/.test(q);
  const aboutEducation =
    /\b(education|degree|school|university|college|isb|essec|christ|study|studies|qualification)\b/.test(q);

  const lines: string[] = [];
  if (aboutWork && !reply.includes('/work')) {
    lines.push('For the full profile, see the Work page: /work');
  }
  if (aboutEducation && !reply.includes('/education')) {
    lines.push('For the full profile, see the Education page: /education');
  }
  if (lines.length === 0) return reply;
  return reply.trimEnd() + '\n\n' + lines.join('\n');
}

// Expand short responses
function expandShortResponse(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>): string {
  if (!message || !history || history.length === 0) return message;
  
  const msgLower = message.toLowerCase().trim();
  const shortResponses = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'no', 'nope'];
  const continuationPhrases = ['tell me more', 'more', 'continue', 'go on'];
  
  if (shortResponses.includes(msgLower) || continuationPhrases.includes(msgLower)) {
    const lastBotMessage = history.slice().reverse().find(h => h.role === 'assistant');
    if (lastBotMessage && lastBotMessage.content.includes('?')) {
      const match = lastBotMessage.content.match(/interested in (?:his |their )?([^?]+)/i);
      if (match && (msgLower === 'yes' || msgLower === 'yeah' || msgLower === 'yep' || msgLower === 'sure')) {
        return `tell me about ${match[1].trim()}`;
      }
    }
    if (msgLower === 'tell me more' || msgLower === 'more') {
      const lastBotMessage = history.slice().reverse().find(h => h.role === 'assistant');
      if (lastBotMessage) {
        const keywords = ['leadership', 'experience', 'skills', 'education', 'projects'];
        for (const keyword of keywords) {
          if (lastBotMessage.content.toLowerCase().includes(keyword)) {
            return `tell me more about ${keyword}`;
          }
        }
      }
    }
  }
  
  return message;
}

// Main chat function
export async function processChatMessage(
  message: string,
  conversationId: string | null,
  ipAddress: string,
  userAgent: string
): Promise<{ reply: string; conversation_id: string }> {
  const model = getModel();
  if (!model) {
    throw new Error('Gemini API not configured. Please set GEMINI_API_KEY in environment variables.');
  }

  await ensureDirectories();
  
  // Rate limiting
  const lastAt = lastRequestAtByIP.get(ipAddress) || 0;
  const now = Date.now();
  if (now - lastAt < IP_COOLDOWN_MS) {
    const waitSec = Math.ceil((IP_COOLDOWN_MS - (now - lastAt)) / 1000);
    throw new Error(`Rate limited. Please wait ${waitSec}s before sending another message.`);
  }
  lastRequestAtByIP.set(ipAddress, now);

  // Generate or use conversation ID
  const convId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Get conversation history
  let history = getConversationHistory(convId);
  
  // Expand short responses
  let trimmedMessage = message.trim();
  trimmedMessage = expandShortResponse(trimmedMessage, history);
  
  // Handle general conversation
  if (isGeneralConversation(trimmedMessage)) {
    const friendlyReply = handleGeneralConversation(trimmedMessage);
    history.push(
      { role: 'user', content: trimmedMessage },
      { role: 'assistant', content: friendlyReply }
    );
    saveConversationHistory(convId, history);
    
    await logQuestion(trimmedMessage, friendlyReply, {
      conversation_id: convId,
      ip: ipAddress,
      chunks_used: 0,
      is_general_conversation: true
    });
    
    return {
      reply: friendlyReply,
      conversation_id: convId
    };
  }
  
  // Retrieve more candidates, then use Gemini to select the most relevant passages
  let relevantChunks = await retrieveRelevantChunks(trimmedMessage, MAX_PASSAGES_FOR_SELECTION);

  if (relevantChunks.length === 0) {
    const chunksArray = await loadChunks();
    relevantChunks = chunksArray.slice(0, MAX_PASSAGES_AFTER_SELECTION);
  } else {
    relevantChunks = await selectRelevantChunksWithGemini(model, trimmedMessage, relevantChunks);
  }

  // Build system prompt with selected passages for accurate, structured answers
  const systemPrompt = await getSystemPrompt(relevantChunks, trimmedMessage);
  
  // Format history for Gemini
  const chatHistory = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  }));
  
  // Start chat session
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I will use information from the provided context to answer questions about Saksham\'s professional background. How can I assist?' }]
      },
      ...chatHistory
    ],
  });
  
  // Send message
  let result = await chat.sendMessage(trimmedMessage);
  let response = result.response;
  let reply = response.text();

  // Clean reply
  reply = cleanReply(reply, trimmedMessage);

  // Appropriateness filter: never expose "documents do not contain" or similar
  if (isInappropriateReply(reply)) {
    const retryInstruction =
      'Your previous response was not appropriate. Do NOT say that documents or context do not contain information. Give a brief helpful answer: if the topic is not in the context, suggest they explore the Work or Education pages for more on Saksham, or ask them to rephrase. Keep the tone positive. Reply now with only the new response.';
    try {
      const retryResult = await chat.sendMessage(retryInstruction);
      const retryResponse = retryResult.response;
      let retryReply = retryResponse.text();
      retryReply = cleanReply(retryReply, trimmedMessage);
      if (!isInappropriateReply(retryReply)) {
        reply = retryReply;
      } else {
        reply = getSafeFallbackReply(trimmedMessage);
      }
    } catch {
      reply = getSafeFallbackReply(trimmedMessage);
    }
  }

  // Append Work/Education page link when the question is about work or education
  reply = appendPageLinkIfRelevant(reply, trimmedMessage);

  // Update history
  history.push(
    { role: 'user', content: trimmedMessage },
    { role: 'assistant', content: reply }
  );
  saveConversationHistory(convId, history);
  
  // Log question
  await logQuestion(trimmedMessage, reply, {
    conversation_id: convId,
    ip: ipAddress,
    chunks_used: relevantChunks.length
  });
  
  return {
    reply,
    conversation_id: convId
  };
}

// Export other functions needed by admin routes
export {
  loadUnansweredQuestions,
  loadQuestionLog,
  logUnansweredQuestion,
  ensureDirectories
};
