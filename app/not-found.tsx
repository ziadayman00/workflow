'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-[#fffbdf] leading-none opacity-10">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="relative -mt-32 md:-mt-40">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#fffbdf]/10 border border-[#fffbdf]/20 mb-6">
            <Search className="w-10 h-10 text-[#fffbdf]" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-[#fffbdf] mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-[#fffbdf]/60 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="group flex items-center gap-2 px-6 py-3 bg-[#fffbdf] text-[#0a0a0a] rounded-xl font-semibold hover:bg-[#fff5b8] transition-all shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-6 py-3 bg-[#222222] border border-[#fffbdf]/20 text-[#fffbdf] rounded-xl font-medium hover:bg-[#2a2a2a] hover:border-[#fffbdf]/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-[#fffbdf]/40">
          <div className="w-12 h-px bg-[#fffbdf]/20"></div>
          <span>Error 404</span>
          <div className="w-12 h-px bg-[#fffbdf]/20"></div>
        </div>
      </div>
    </div>
  );
}
