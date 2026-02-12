// Knowledge base management endpoints
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { promises as fs } from 'fs';
import path from 'path';
import { createVersion, listVersions, restoreVersion } from '@/lib/knowledge-base-versioning';
import { validateKnowledgeBase, checkDuplicateQuestion } from '@/lib/knowledge-base-validation';

const CHUNKS_FILE = path.join(process.cwd(), 'data', 'chatbot', 'knowledge-base', 'chunks.json');

// GET - List chunks or search
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const action = searchParams.get('action');

    if (action === 'versions') {
      const versions = await listVersions();
      return NextResponse.json({ versions });
    }

    if (action === 'validate') {
      const validation = await validateKnowledgeBase();
      return NextResponse.json(validation);
    }

    // Load chunks
    const chunksData = await fs.readFile(CHUNKS_FILE, 'utf8');
    let chunks = JSON.parse(chunksData);

    // Search if query provided
    if (search) {
      const searchLower = search.toLowerCase();
      chunks = chunks.filter((chunk: any) =>
        chunk.title?.toLowerCase().includes(searchLower) ||
        chunk.content?.toLowerCase().includes(searchLower) ||
        chunk.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({ chunks });
  } catch (error: any) {
    console.error('Error fetching knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base' },
      { status: 500 }
    );
  }
}

// POST - Create version, check duplicate, or create chunk
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, description, question, chunk } = body;

    if (action === 'create-version') {
      const version = await createVersion(description, session.user.name || 'admin');
      return NextResponse.json({ success: true, version });
    }

    if (action === 'check-duplicate' && question) {
      const duplicate = await checkDuplicateQuestion(question);
      return NextResponse.json({ duplicate });
    }

    if (action === 'create-chunk' && chunk) {
      // Create version before adding
      await createVersion(`Create chunk: ${chunk.title || chunk.id}`, session.user.name || 'admin');

      // Load existing chunks
      const chunksData = await fs.readFile(CHUNKS_FILE, 'utf8');
      const chunks = JSON.parse(chunksData);

      // Generate ID if not provided
      const chunkId = chunk.id || `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create new chunk
      const newChunk = {
        id: chunkId,
        title: chunk.title || 'Untitled',
        content: chunk.content || '',
        tags: chunk.tags || [],
        source: chunk.source || 'manual',
        competencies: chunk.competencies || [],
      };

      chunks.push(newChunk);
      await fs.writeFile(CHUNKS_FILE, JSON.stringify(chunks, null, 2), 'utf8');

      return NextResponse.json({ success: true, chunk: newChunk });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in knowledge base action:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to perform action' },
      { status: 500 }
    );
  }
}

// PATCH - Update chunk
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { chunkId, updates } = body;

    if (!chunkId || !updates) {
      return NextResponse.json(
        { error: 'chunkId and updates are required' },
        { status: 400 }
      );
    }

    // Create version before updating
    await createVersion(`Update chunk ${chunkId}`, session.user.name || 'admin');

    // Load and update chunks
    const chunksData = await fs.readFile(CHUNKS_FILE, 'utf8');
    const chunks = JSON.parse(chunksData);
    
    const index = chunks.findIndex((c: any) => c.id === chunkId);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Chunk not found' },
        { status: 404 }
      );
    }

    chunks[index] = { ...chunks[index], ...updates };
    await fs.writeFile(CHUNKS_FILE, JSON.stringify(chunks, null, 2), 'utf8');

    return NextResponse.json({ success: true, chunk: chunks[index] });
  } catch (error: any) {
    console.error('Error updating chunk:', error);
    return NextResponse.json(
      { error: 'Failed to update chunk' },
      { status: 500 }
    );
  }
}

// DELETE - Delete chunk
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chunkId = searchParams.get('id');

    if (!chunkId) {
      return NextResponse.json(
        { error: 'chunkId is required' },
        { status: 400 }
      );
    }

    // Create version before deleting
    await createVersion(`Delete chunk ${chunkId}`, session.user.name || 'admin');

    // Load and delete chunk
    const chunksData = await fs.readFile(CHUNKS_FILE, 'utf8');
    const chunks = JSON.parse(chunksData);
    
    const filtered = chunks.filter((c: any) => c.id !== chunkId);
    if (filtered.length === chunks.length) {
      return NextResponse.json(
        { error: 'Chunk not found' },
        { status: 404 }
      );
    }

    await fs.writeFile(CHUNKS_FILE, JSON.stringify(filtered, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting chunk:', error);
    return NextResponse.json(
      { error: 'Failed to delete chunk' },
      { status: 500 }
    );
  }
}
