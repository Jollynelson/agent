
import React from 'react';
import { Icons } from './Icons';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Icons;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color = 'blue' }) => {
  const Icon = Icons[icon];
  
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-3 transition-transform hover:scale-[1.02]">
      <div className={`p-2.5 rounded-xl ${colors[color] || colors.blue}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};
