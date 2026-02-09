import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { promises as fs } from 'fs';
import path from 'path';

const VISITORS_FILE = path.join(process.cwd(), 'data', 'chatbot', 'feedback', 'visitors.json');

async function loadVisitors() {
  try {
    const data = await fs.readFile(VISITORS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { visitors: [], last_updated: null };
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await loadVisitors();
    return NextResponse.json({ visitors: data.visitors || [] });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitors' },
      { status: 500 }
    );
  }
}
