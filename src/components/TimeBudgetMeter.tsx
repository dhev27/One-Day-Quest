import React from 'react';
import { useGame } from '../context/GameContext';
import { Clock, AlertTriangle, Check, Scissors, ShieldAlert } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const TimeBudgetMeter: React.FC = () => {
  const {
    totalAvailableTimeMinutes,
    quests,
    allowOvertime,
    setAllowOvertime,
    trimQuestsToFitTime,
  } = useGame();

  const totalUsedMinutes = quests
    .filter((q) => !q.isSuggestion)
    .reduce((sum, q) => sum + (q.timeEstimateMinutes || 30), 0);

  const isOvertime = totalUsedMinutes > totalAvailableTimeMinutes;
  const overtimeDiff = totalUsedMinutes - totalAvailableTimeMinutes;
  const remainingMinutes = Math.max(0, totalAvailableTimeMinutes - totalUsedMinutes);

  const percentageUsed = Math.min(
    100,
    Math.round((totalUsedMinutes / Math.max(totalAvailableTimeMinutes, 1)) * 100)
  );

  return (
    <div className="w-full bg-[#0d1222] border border-[#1f2c4a] rounded-2xl p-3.5 sm:p-4 shadow-lg mb-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isOvertime ? 'text-amber-400' : 'text-cyan-400'}`} />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            ⏱️ TODAY'S TIME BUDGET
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-stat">
          <span className="font-extrabold text-white">
            {totalUsedMinutes} min used
          </span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">
            {totalAvailableTimeMinutes} min available
          </span>
          {!isOvertime ? (
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded">
              {remainingMinutes}m remaining ✨
            </span>
          ) : (
            <span className="text-[11px] font-bold text-rose-400 bg-rose-950/80 border border-rose-700/50 px-2 py-0.5 rounded animate-pulse">
              +{overtimeDiff}m overtime ⚠️
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-[#070a14] rounded-full overflow-hidden border border-[#202b44] relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOvertime
              ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600'
              : percentageUsed > 85
              ? 'bg-gradient-to-r from-indigo-500 via-cyan-400 to-amber-400'
              : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
          }`}
          style={{ width: `${Math.min(100, percentageUsed)}%` }}
        />
      </div>

      {/* Overtime Alert Banner (Requirement 11) */}
      {isOvertime && !allowOvertime && (
        <div className="mt-3 p-3 rounded-xl bg-amber-950/60 border border-amber-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-start gap-2 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Your quest is <strong>{overtimeDiff} minutes</strong> over your scheduled free time.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                soundFx.playClick(400);
                trimQuestsToFitTime();
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Scissors className="w-3 h-3 text-amber-400" />
              <span>Trim Quest</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick(600);
                setAllowOvertime(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Keep Everything Anyway</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
