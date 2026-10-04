import React from 'react';
import { Trophy, Award, Flame, CheckCircle, Shield, Heart, Sparkles, Building2, Phone } from 'lucide-react';
import { LEADERBOARD_USERS, SAFE_EXCHANGE_ZONES } from '../data/leaderboardData';

export const LeaderboardView: React.FC = () => {
  const topUsers = [...LEADERBOARD_USERS].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 md:p-10 shadow-xl border border-indigo-700">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-4">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Campus Good Samaritan Honors</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Recognizing Everyday Campus Heroes
          </h2>
          <p className="text-indigo-200 text-sm mt-2 leading-relaxed">
            Every item safely returned preserves peace of mind and builds community trust. Earn Karma points, unlock prestigious badges, and climb the university rankings with every successful reconnection.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-xs">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span><strong>+100 pts</strong> for high-value electronics</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span><strong>+50 pts</strong> for keys, IDs & stationery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topUsers.slice(0, 3).map((user, idx) => {
          const rankColors = [
            { border: 'border-amber-400', badge: 'bg-amber-400 text-amber-950', label: '1st Place 🥇', glow: 'shadow-amber-100' },
            { border: 'border-slate-300', badge: 'bg-slate-200 text-slate-800', label: '2nd Place 🥈', glow: 'shadow-slate-100' },
            { border: 'border-amber-700/60', badge: 'bg-amber-100 text-amber-800', label: '3rd Place 🥉', glow: 'shadow-orange-100' },
          ][idx];

          return (
            <div
              key={user.id}
              className={`bg-white rounded-3xl border-2 ${rankColors.border} p-6 shadow-md ${rankColors.glow} relative flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${rankColors.badge}`}>
                    {rankColors.label}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{user.streakDays}d Streak</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-100"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{user.name}</h3>
                    <p className="text-xs text-slate-500">{user.role}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-indigo-600">{user.points}</span>
                      <span className="text-xs font-semibold text-slate-400">Karma Pts</span>
                    </div>
                  </div>
                </div>

                {/* Badges Earned */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Achievements
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.badges.map((badge) => (
                      <span
                        key={badge.id}
                        title={badge.description}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-help"
                      >
                        <span>{badge.icon}</span>
                        <span>{badge.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Items Safely Returned:</span>
                <strong className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {user.itemsReturned} items
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Full Rankings & Live Good Deeds Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Full Leaderboard Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Honor Roll Standings</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Updated live</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topUsers.map((user, idx) => (
              <div
                key={user.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-extrabold text-sm text-slate-400">
                    #{idx + 1}
                  </span>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{user.name}</h4>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-extrabold text-indigo-600">{user.points} pts</p>
                  <p className="text-[11px] text-emerald-600 font-medium">{user.itemsReturned} returned</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Recent Community Reunions</span>
            </h3>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          <div className="space-y-4">
            {topUsers.flatMap((u) => u.recentActivity).slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{act.action}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.itemTitle}</p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">{act.timeAgo}</span>
                </div>
                <span className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-100 shrink-0">
                  +{act.pointsEarned} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safe Campus Exchange Zones Information */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Designated Safe Exchange Zones</h3>
            <p className="text-xs text-slate-500">
              For your safety and protection, always exchange items at one of the university’s monitored locations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAFE_EXCHANGE_ZONES.map((zone, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{zone.title}</span>
                </h4>
                <p className="text-xs text-indigo-700 font-medium mt-1">{zone.location}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-semibold">🕒 {zone.hours}</p>

                <div className="mt-3 space-y-1">
                  {zone.features.map((feat, fIdx) => (
                    <div key={fIdx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Contact Desk:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {zone.phone}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
