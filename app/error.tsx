'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#fffbdf] mb-4">
            Something Went Wrong
          </h2>
          
          <p className="text-lg text-[#fffbdf]/60 mb-8 max-w-md mx-auto">
            We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-8 p-4 bg-[#222222] border border-red-500/20 rounded-lg text-left max-w-xl mx-auto">
              <p className="text-sm font-mono text-red-400 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-[#fffbdf]/40 mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={reset}
              className="group flex items-center gap-2 px-6 py-3 bg-[#fffbdf] text-[#0a0a0a] rounded-xl font-semibold hover:bg-[#fff5b8] transition-all shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>

            <Link
              href="/"
              className="group flex items-center gap-2 px-6 py-3 bg-[#222222] border border-[#fffbdf]/20 text-[#fffbdf] rounded-xl font-medium hover:bg-[#2a2a2a] hover:border-[#fffbdf]/30 transition-all"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-[#fffbdf]/40">
          <div className="w-12 h-px bg-[#fffbdf]/20"></div>
          <span>Error Boundary</span>
          <div className="w-12 h-px bg-[#fffbdf]/20"></div>
        </div>
      </div>
    </div>
  );
}
