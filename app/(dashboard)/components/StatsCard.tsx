import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * StatsCard Component
 * 
 * Purpose: Display key metrics in a card format
 * Used in: Dashboard overview section
 */

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

export default function StatsCard({ icon: Icon, label, value, color }: StatsCardProps) {
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