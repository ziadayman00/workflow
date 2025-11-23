import React from 'react';
import { CheckCircle, Plus, Clock, AlertCircle } from 'lucide-react';

/**
 * ActivityItem Component
 * 
 * Purpose: Display a single activity/update in the activity feed
 * Features: Dynamic icon based on activity type, user info, timestamp
 */

type ActivityType = 'completed' | 'created' | 'updated' | 'assigned' | 'commented';

interface ActivityItemProps {
  user: string;
  action: string;
  target: string;
  time: string;
  type: ActivityType;
}

export default function ActivityItem({ user, action, target, time, type }: ActivityItemProps) {
  // Get icon based on activity type
  const getIcon = () => {
    switch(type) {
      case 'completed': 
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'created': 
        return <Plus className="w-5 h-5 text-blue-400" />;
      case 'updated': 
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'assigned':
        return <AlertCircle className="w-5 h-5 text-purple-400" />;
      case 'commented':
        return <AlertCircle className="w-5 h-5 text-[#fffbdf]" />;
      default: 
        return <AlertCircle className="w-5 h-5 text-[#fffbdf]" />;
    }
  };

  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#fffbdf]/5 last:border-0">
      {/* Activity Icon */}
      <div className="w-8 h-8 rounded-full bg-[#fffbdf]/10 flex items-center justify-center flex-shrink-0">
        {getIcon()}
      </div>
      
      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#fffbdf]">
          <span className="font-medium">{user}</span>
          <span className="text-[#fffbdf]/60"> {action} </span>
          <span className="font-medium">{target}</span>
        </p>
        <p className="text-xs text-[#fffbdf]/40 mt-1">{time}</p>
      </div>
    </div>
  );
}