"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LiveVisitorTracker from "@/components/LiveVisitorTracker";

interface TrafficData {
  date: string;
  visits: number;
  pageViews: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (status === "authenticated") {
      fetchTrafficData();
    }
  }, [status, router]);

  const fetchTrafficData = async () => {
    try {
      const res = await fetch('/api/analytics/stats?days=7');
      if (res.ok) {
        const result = await res.json();
        setTrafficData(result.data || []);
        setTotalVisits(result.totalVisits || 0);
        setTotalPageViews(result.totalPageViews || 0);
      } else {
        // Fallback to empty data if API fails
        setTrafficData([]);
        setTotalVisits(0);
        setTotalPageViews(0);
      }
    } catch (error) {
      console.error("Error fetching traffic data:", error);
      setTrafficData([]);
      setTotalVisits(0);
      setTotalPageViews(0);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-brown-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const maxVisits = Math.max(...trafficData.map(d => d.visits), 1);
  const maxPageViews = Math.max(...trafficData.map(d => d.pageViews), 1);

  return (
    <div className="min-h-screen bg-cream-50 text-brown-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brown-900">Admin Dashboard</h1>
            <p className="text-brown-600 mt-1 text-sm sm:text-base">Welcome back, {session.user?.name}</p>
          </div>
          <Link
            href="/admin/logout"
            className="px-4 py-2.5 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 transition-colors font-medium text-sm sm:text-base min-h-[44px] flex items-center justify-center w-full sm:w-auto"
          >
            Logout
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="professional-card">
            <h3 className="text-xs sm:text-sm uppercase tracking-wider text-brown-600 mb-2">Total Visits</h3>
            <p className="text-3xl sm:text-4xl font-bold text-brown-900">{totalVisits.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-brown-600 mt-2">Last 7 days</p>
          </div>
          <div className="professional-card">
            <h3 className="text-xs sm:text-sm uppercase tracking-wider text-brown-600 mb-2">Total Page Views</h3>
            <p className="text-3xl sm:text-4xl font-bold text-brown-900">{totalPageViews.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-brown-600 mt-2">Last 7 days</p>
          </div>
          <LiveVisitorTracker />
        </div>

        {/* Traffic Graph */}
        <div className="professional-card mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-brown-900 mb-4 sm:mb-6">Website Traffic</h2>
          <div className="space-y-4 sm:space-y-6">
            {/* Visits Graph */}
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-brown-700 mb-2 sm:mb-3">Visits</h3>
              <div className="flex items-end gap-1 sm:gap-2 h-40 sm:h-48 overflow-x-auto pb-2">
                {trafficData.map((data, idx) => {
                  const height = (data.visits / maxVisits) * 100;
                  const date = new Date(data.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full h-full flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-brown-600 to-brown-400 rounded-t-md transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                          title={`${data.visits} visits`}
                        />
                      </div>
                      <div className="text-xs text-brown-600 font-medium">{dayName}</div>
                      <div className="text-xs text-brown-500">{data.visits}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Page Views Graph */}
            <div className="pt-4 sm:pt-6 border-t border-brown-200">
              <h3 className="text-xs sm:text-sm font-medium text-brown-700 mb-2 sm:mb-3">Page Views</h3>
              <div className="flex items-end gap-1 sm:gap-2 h-40 sm:h-48 overflow-x-auto pb-2">
                {trafficData.map((data, idx) => {
                  const height = (data.pageViews / maxPageViews) * 100;
                  const date = new Date(data.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full h-full flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                          title={`${data.pageViews} page views`}
                        />
                      </div>
                      <div className="text-xs text-brown-600 font-medium">{dayName}</div>
                      <div className="text-xs text-brown-500">{data.pageViews}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Management Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Chatbot Management */}
          <Link
            href="/admin/chatbot"
            className="professional-card hover:shadow-lg transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-brown-900 mb-2 group-hover:text-brown-700">
                  Chatbot Management
                </h3>
                <p className="text-brown-600 text-sm">
                  Manage unanswered questions, view conversations, and improve chatbot responses.
                </p>
              </div>
              <div className="text-4xl text-brown-400 group-hover:text-brown-600 transition-colors">
                →
              </div>
            </div>
          </Link>

          {/* Knowledge Base Management */}
          <Link
            href="/admin/knowledge-base"
            className="professional-card hover:shadow-lg transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-brown-900 mb-2 group-hover:text-brown-700">
                  Knowledge Base
                </h3>
                <p className="text-brown-600 text-sm">
                  Search, edit, and version your chatbot knowledge base.
                </p>
              </div>
              <div className="text-4xl text-brown-400 group-hover:text-brown-600 transition-colors">
                →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
