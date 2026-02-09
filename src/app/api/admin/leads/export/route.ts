// Export leads to CSV
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const format = searchParams.get('format') || 'csv';

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const leads = await db.lead.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (format === 'csv') {
      // Generate CSV
      const headers = ['ID', 'Name', 'Organisation', 'Email', 'Phone', 'Status', 'Score', 'Conversation ID', 'Activity Duration (ms)', 'Created At', 'Notes'];
      const rows = leads.map(lead => [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.organisation.replace(/"/g, '""')}"`,
        lead.email || '',
        lead.phone || '',
        lead.status,
        lead.score,
        lead.conversationId || '',
        lead.activityDurationMs || '',
        lead.createdAt.toISOString(),
        lead.notes ? `"${lead.notes.replace(/"/g, '""')}"` : '',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // JSON format
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}
