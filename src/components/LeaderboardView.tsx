import React from 'react';
import { ShieldCheck, Building2, Phone } from 'lucide-react';
import { LEADERBOARD_USERS, SAFE_EXCHANGE_ZONES } from '../data/leaderboardData';

export const LeaderboardView: React.FC = () => {
  const sortedUsers = [...LEADERBOARD_USERS].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Campus Karma</h2>
        <p className="text-xs text-slate-500 mt-1">
          Recognizing people who help return lost belongings.
        </p>
      </div>

      {/* Clean Leaderboard List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span>Rank &amp; Member</span>
          <div className="flex items-center gap-8">
            <span className="w-24 text-right">Items Returned</span>
            <span className="w-24 text-right">Karma Points</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedUsers.map((user, idx) => (
            <div
              key={user.id}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
            >
              {/* Member Details */}
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-slate-400 w-6">
                  #{idx + 1}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-slate-900">{user.name}</h3>
                    <span className="text-[11px] text-slate-500 hidden md:inline">
                      • {user.role}
                    </span>
                  </div>

                  {/* Small Achievement Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {user.badges.slice(0, 2).map((badge) => (
                      <span
                        key={badge.id}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {badge.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between sm:justify-end gap-8 text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="sm:w-24 sm:text-right">
                  <span className="text-slate-400 sm:hidden">Returned: </span>
                  <span className="font-semibold text-slate-800">
                    {user.itemsReturned} items
                  </span>
                </div>
                <div className="sm:w-24 sm:text-right">
                  <span className="text-slate-400 sm:hidden">Karma: </span>
                  <span className="font-mono font-bold text-sm text-indigo-700">
                    {user.points} pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Campus Exchange Monitored Desks */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">
            Monitored Campus Exchange Desks
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Always schedule handovers at designated official university counters for privacy and accountability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {SAFE_EXCHANGE_ZONES.map((zone, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
            >
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <h4 className="font-semibold text-slate-900 leading-snug">{zone.title}</h4>
              </div>
              <p className="text-[11px] text-slate-500">{zone.location}</p>
              <div className="text-[11px] text-slate-600 pt-1">
                <strong>Hours: </strong>
                <span>{zone.hours}</span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center gap-1 pt-1 border-t border-slate-200/60">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{zone.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
