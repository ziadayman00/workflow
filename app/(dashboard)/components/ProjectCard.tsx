'use client';

import React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';

/**
'use client';

import React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';

/**
 * ProjectCard Component
 * 
 * Purpose: Display individual project information with progress
 * Features: Progress bar, team members, project details
 */

interface ProjectCardProps {
  id?: string;
  name: string;
  description?: string | null;
  tasksTotal: number;
  tasksCompleted: number;
  color: string;
  teamMembers: {
    name: string;
    image?: string | null;
  }[];
  onMenuClick?: (id?: string) => void;
}

export default function ProjectCard({ 
  id,
  name, 
  description, 
  tasksTotal, 
  tasksCompleted, 
  color, 
  teamMembers,
  onMenuClick
}: ProjectCardProps) {
  const progress = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;
  
  return (
    <Link 
      href={`/dashboard/project/${id}`}
      className="block bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6 hover:border-[#fffbdf]/30 transition-all cursor-pointer"
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
          <h3 className="text-lg font-semibold text-[#fffbdf]">{name}</h3>
        </div>
      </div>

      {/* Project Description */}
      <p className="text-[#fffbdf]/60 text-sm mb-4 line-clamp-2">
        {description || 'No description'}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#fffbdf]/60 mb-2">
          <span>Progress</span>
          <span>{tasksCompleted}/{tasksTotal} tasks</span>
        </div>
        <div className="w-full bg-[#1a1a1a] rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all"
            style={{ 
              width: `${progress}%`,
              backgroundColor: color 
            }}
          ></div>
        </div>
      </div>

      {/* Team Members */}
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-[#fffbdf]/40" />
        <div className="flex -space-x-2">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="w-7 h-7 rounded-full bg-[#fffbdf]/20 border-2 border-[#2a2a2a] flex items-center justify-center text-xs text-[#fffbdf] font-medium overflow-hidden"
              title={member.name}
            >
              {member.image ? (
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                member.name.charAt(0)
              )}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}