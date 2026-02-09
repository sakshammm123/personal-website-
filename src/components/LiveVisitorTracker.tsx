'use client';

import { useEffect, useState } from 'react';

interface LiveData {
  activeVisitors: number;
  recentVisits: number;
  visits: Array<{
    path: string;
    deviceType: string | null;
    country: string | null;
    createdAt: Date;
  }>;
}

export default function LiveVisitorTracker() {
  const [data, setData] = useState<LiveData | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only connect if on admin dashboard
    if (typeof window === 'undefined') return;

    const eventSource = new EventSource('/api/analytics/live');

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'update' && message.data) {
          setData(message.data);
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (!data) {
    return (
      <div className="professional-card">
        <h3 className="text-sm uppercase tracking-wider text-brown-600 mb-2">Live Visitors</h3>
        <div className="text-3xl font-bold text-brown-900">
          {connected ? '...' : '0'}
        </div>
        <p className="text-xs text-brown-500 mt-1">
          {connected ? 'Connecting...' : 'Not connected'}
        </p>
      </div>
    );
  }

  return (
    <div className="professional-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm uppercase tracking-wider text-brown-600">Live Visitors</h3>
        <span
          className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
          title={connected ? 'Connected' : 'Disconnected'}
        />
      </div>
      <div className="text-3xl font-bold text-brown-900">{data.activeVisitors}</div>
      <p className="text-xs text-brown-500 mt-1">
        {data.recentVisits} page views in last 5 minutes
      </p>
      {data.visits.length > 0 && (
        <div className="mt-4 space-y-1">
          <p className="text-xs font-semibold text-brown-600 mb-2">Recent Activity:</p>
          {data.visits.slice(0, 5).map((visit, idx) => (
            <div key={idx} className="text-xs text-brown-600 flex justify-between">
              <span className="truncate">{visit.path}</span>
              <span className="ml-2 text-brown-500">
                {visit.deviceType || 'unknown'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
