import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

/**
 * DashboardHeader Component
 * 
 * Purpose: Top navigation bar for the dashboard
 * Features: Back to home link and create new project button
 */

interface DashboardHeaderProps {
  onCreateProject?: () => void;
}

export default function DashboardHeader({ onCreateProject }: DashboardHeaderProps) {
  return (
    <div className="flex items-center p-6 justify-between border-b border-[#fffbdf]/10">
      <Link 
        href="/" 
        className="text-sm font-light hover:text-[#fffbdf] transition-colors"
      >
        ← Back to <span className="font-bold">Home</span>
      </Link>
      
      <button 
        onClick={onCreateProject}
        className="px-5 py-2.5 bg-[#fffbdf] rounded-xl text-black font-medium hover:bg-[#fff5b8] transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create New Project
      </button>
    </div>
  );
}