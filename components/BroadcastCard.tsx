
import React from 'react';
import { BroadcastEvent, SportType } from '../types';

interface BroadcastCardProps {
  event: BroadcastEvent;
}

const getSportBadgeColor = (sport: SportType) => {
  switch (sport) {
    case SportType.FOOTBALL: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case SportType.BASKETBALL: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case SportType.TENNIS: return 'bg-lime-500/10 text-lime-400 border-lime-500/20';
    case SportType.MOTORSPORT: return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }
};

export const BroadcastCard: React.FC<BroadcastCardProps> = ({ event }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getSportBadgeColor(event.sport)}`}>
              {event.sport}
            </span>
            <span className="text-slate-400 text-xs font-medium">• {event.competition}</span>
          </div>
          <h3 className="text-slate-100 font-semibold text-lg leading-snug group-hover:text-white transition-colors">
            {event.match}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span className="font-bold">{event.time}</span>
            </div>
            <div className="bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-700">
               <span className="text-slate-200 text-sm font-semibold">{event.channel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
