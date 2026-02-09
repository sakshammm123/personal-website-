// Real-time visitor tracking endpoint (Server-Sent Events)
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send({ type: 'connected', message: 'Connected to live analytics' });

      // Function to get current active visitors (last 5 minutes)
      const getActiveVisitors = async () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        const activeVisits = await db.pageVisit.findMany({
          where: {
            createdAt: { gte: fiveMinutesAgo },
            isBot: false,
          },
          select: {
            path: true,
            deviceType: true,
            country: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        });

        // Group by session for unique visitors
        const uniqueSessions = new Set(
          activeVisits.map(v => v.createdAt.toISOString().split('T')[0])
        );

        return {
          activeVisitors: uniqueSessions.size,
          recentVisits: activeVisits.length,
          visits: activeVisits,
        };
      };

      // Send initial data
      const initialData = await getActiveVisitors();
      send({ type: 'update', data: initialData });

      // Set up interval to send updates every 5 seconds
      const interval = setInterval(async () => {
        try {
          const data = await getActiveVisitors();
          send({ type: 'update', data });
        } catch (error) {
          console.error('Error fetching live data:', error);
          send({ type: 'error', message: 'Failed to fetch data' });
        }
      }, 5000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
