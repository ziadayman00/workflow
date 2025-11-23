'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-[#fffbdf] mb-3">
          Dashboard Error
        </h2>
        
        <p className="text-base text-[#fffbdf]/60 mb-6">
          We couldn't load your dashboard. Please try again.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-3 bg-[#222222] border border-red-500/20 rounded-lg text-left">
            <p className="text-xs font-mono text-red-400 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#fffbdf] text-[#0a0a0a] rounded-xl font-semibold hover:bg-[#fff5b8] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#222222] border border-[#fffbdf]/20 text-[#fffbdf] rounded-xl font-medium hover:bg-[#2a2a2a] transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Home
          </Link>
        </div>
      </div>
    </div>
  );
}
