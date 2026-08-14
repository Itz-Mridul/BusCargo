import React from 'react';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  BOOKED: { label: 'Booked', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  IN_TRANSIT: { label: 'In Transit', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  ARRIVED: { label: 'Arrived', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  DELIVERED: { label: 'Delivered', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

const DOTS: Record<string, string> = {
  BOOKED: 'bg-blue-400',
  IN_TRANSIT: 'bg-amber-400 animate-pulse',
  ARRIVED: 'bg-orange-400',
  DELIVERED: 'bg-emerald-400',
};

interface Props { status: string; }

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, className: 'bg-slate-700 text-slate-400 border-slate-600' };
  const dot = DOTS[status] || 'bg-slate-400';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {config.label}
    </span>
  );
};
