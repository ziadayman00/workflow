import React from 'react';
import { CheckCircle, Clock, AlertCircle, Folder } from 'lucide-react';

/**
 * StatsCard Component
 * 
 * Purpose: Display key metrics in a card format
 * Used in: Dashboard overview section
 */

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}

const iconMap = {
  CheckCircle,
  Clock,
  AlertCircle,
  Folder,
};

export default function StatsCard({ icon: iconName, label, value, color }: StatsCardProps) {
  const Icon = iconMap[iconName as keyof typeof iconMap] || AlertCircle;
  
  return (
    <div className="bg-[#2a2a2a] border border-[#fffbdf]/10 rounded-xl p-6 hover:border-[#fffbdf]/20 transition-colors">
      {/* Icon and Value Row */}
      <div className="flex items-center justify-between mb-4">
        <div 
          className={`w-12 h-12 rounded-lg flex items-center justify-center`}
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <span className="text-3xl font-bold text-[#fffbdf]">{value}</span>
      </div>
      
      {/* Label */}
      <p className="text-[#fffbdf]/60 text-sm">{label}</p>
    </div>
  );
}