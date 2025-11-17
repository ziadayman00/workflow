import React from 'react';
import { Users, MoreVertical } from 'lucide-react';

/**
 * ProjectCard Component
 * 
 * Purpose: Display individual project information with progress
 * Features: Progress bar, team members, project details
 */

interface ProjectCardProps {
  id?: string;
  name: string;
  description: string;
  tasksTotal: number;
  tasksCompleted: number;
  color: string;
  teamMembers: string[];
  onClick?: (id?: string) => void;
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
  onClick,
  onMenuClick
}: ProjectCardProps) {
  const progress = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;
  
  return (
    <div 
      className="bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6 hover:border-[#fffbdf]/30 transition-all cursor-pointer"
      onClick={() => onClick?.(id)}
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
        <button 
          className="text-[#fffbdf]/40 hover:text-[#fffbdf] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(id);
          }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Project Description */}
      <p className="text-[#fffbdf]/60 text-sm mb-4 line-clamp-2">
        {description}
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
              className="w-7 h-7 rounded-full bg-[#fffbdf]/20 border-2 border-[#2a2a2a] flex items-center justify-center text-xs text-[#fffbdf] font-medium"
              title={member}
            >
              {member}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}