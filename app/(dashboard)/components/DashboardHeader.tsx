"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, LogOut, User, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

/**
 * DashboardHeader Component
 * 
 * Purpose: Top navigation bar for the dashboard with authentication
 * Features: Back to home link, create new project button, and user menu with sign out
 */

interface DashboardHeaderProps {
  onCreateProject?: () => void;
}

export default function DashboardHeader({ onCreateProject }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex items-center p-6 justify-between border-b border-[#fffbdf]/10 bg-[#2a2a2a]/50 backdrop-blur-sm sticky top-0 z-50">
      {/* Left Side - Back to Home */}
      <Link 
        href="/" 
        className="text-sm font-light hover:text-[#fffbdf] transition-colors"
      >
        ← Back to <span className="font-bold">Home</span>
      </Link>

      {/* Right Side - Actions & User Menu */}
      <div className="flex items-center gap-4">
        {/* Create Project Button */}
        <button 
          onClick={onCreateProject}
          className="px-5 py-2.5 bg-[#fffbdf] rounded-xl text-black font-medium hover:bg-[#fff5b8] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create New Project</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1a1a1a]/50 transition-colors border border-[#fffbdf]/10"
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#fffbdf]/20 flex items-center justify-center">
                <User size={16} className="text-[#fffbdf]" />
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-[#fffbdf]">
                {session?.user?.name || "User"}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-lg shadow-xl z-20">
                <div className="p-3 border-b border-[#fffbdf]/10">
                  <p className="text-sm font-medium text-[#fffbdf]">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-[#fffbdf]/60 truncate">
                    {session?.user?.email}
                  </p>
                </div>
                
                <div className="py-2">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#fffbdf] hover:bg-[#1a1a1a]/50 transition-colors text-left"
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile
                    }}
                  >
                    <User size={16} />
                    Profile
                  </button>
                  
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#fffbdf] hover:bg-[#1a1a1a]/50 transition-colors text-left"
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to settings
                    }}
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                </div>
                
                <div className="border-t border-[#fffbdf]/10 py-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-[#1a1a1a]/50 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}