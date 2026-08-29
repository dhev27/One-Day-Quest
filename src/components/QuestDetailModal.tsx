import React, { useState, useEffect } from 'react';
import { Quest } from '../types/quest';
import { useGame } from '../context/GameContext';
import { soundFx } from '../utils/sound';
import {
  X,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Coins,
  ShieldAlert,
  Flame,
  Swords,
} from 'lucide-react';

interface QuestDetailModalProps {
  quest: Quest | null;
  onClose: () => void;
}

export const QuestDetailModal: React.FC<QuestDetailModalProps> = ({ quest, onClose }) => {
  const { acceptQuest, completeQuest, abandonQuest } = useGame();

  // Focus Timer state
  const initialSeconds = (quest?.timeEstimateMinutes || 25) * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (quest) {
      setTimeLeft((quest.timeEstimateMinutes || 25) * 60);
      setTimerRunning(false);
      setCompletedSteps({});
    }
  }, [quest]);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      soundFx.playLevelUp();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  if (!quest) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const toggleStep = (idx: number) => {
    soundFx.playClick(500);
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAccept = () => {
    acceptQuest(quest.id);
  };

  const handleComplete = () => {
    completeQuest(quest.id);
    onClose();
  };

  const handleAbandon = () => {
    abandonQuest(quest.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#111726] border border-[#232f48] rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-950/70 border border-purple-600/50 text-purple-300">
            {quest.category.toUpperCase()}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-950/70 border border-amber-600/50 text-amber-300">
            {quest.difficulty.toUpperCase()} DIFFICULTY
          </span>
          {quest.location && (
            <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              📍 {quest.location}
            </span>
          )}
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/50 flex items-center justify-center text-3xl shadow-glow-xp shrink-0">
            {quest.icon}
          </div>
          <div>
            <h2 className="font-rpg font-bold text-xl sm:text-2xl text-slate-100 leading-tight">
              {quest.title}
            </h2>
            {quest.subtitle && (
              <p className="text-sm text-purple-300 font-medium mt-0.5">{quest.subtitle}</p>
            )}
          </div>
        </div>

        {/* Main Lore Description */}
        <div className="bg-[#0b0f1a] border border-[#1d273d] rounded-2xl p-4 mb-4">
          <p className="text-sm text-slate-200 leading-relaxed mb-2">{quest.description}</p>
          {quest.flavorText && (
            <p className="text-xs text-purple-300/80 italic">"{quest.flavorText}"</p>
          )}
        </div>

        {/* Sub-steps Checklist (if available or generated) */}
        <div className="mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Mission Directives</span>
          </h4>
          <div className="space-y-2">
            {(quest.steps || [
              'Initiate the focus state & eliminate distractions',
              'Execute the primary task objective',
              'Verify completion & claim the XP reward',
            ]).map((step, idx) => (
              <button
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-3 transition ${
                  completedSteps[idx]
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                    : 'bg-[#0d1220] border-[#1d263b] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                    completedSteps[idx]
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'border-slate-600 bg-slate-800'
                  }`}
                >
                  {completedSteps[idx] && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    completedSteps[idx] ? 'line-through opacity-80' : ''
                  }`}
                >
                  {step}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Focus Timer / Stopwatch Widget */}
        <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950/40 border border-purple-800/40 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-900/60 text-purple-300">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                Focus Chrono
              </div>
              <div className="font-mono-stat text-2xl sm:text-3xl font-black text-white tracking-widest">
                {formattedTime}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick(timerRunning ? 400 : 600);
                setTimerRunning(!timerRunning);
              }}
              className={`p-2.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition ${
                timerRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {timerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">Start Timer</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundFx.playClick(300);
                setTimerRunning(false);
                setTimeLeft((quest.timeEstimateMinutes || 25) * 60);
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bounty Rewards */}
        <div className="flex items-center justify-between bg-[#0b0e18] p-3 rounded-xl border border-[#1b253b] mb-5">
          <div className="text-xs font-bold text-slate-400">QUEST REWARDS</div>
          <div className="flex items-center gap-3">
            <span className="font-mono-stat font-bold text-sm text-purple-300 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              +{quest.xpReward} XP
            </span>
            <span className="font-mono-stat font-bold text-sm text-amber-300 flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-400" />
              +{quest.coinReward} Coins
            </span>
          </div>
        </div>

        {/* Action Bottom Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {quest.status === 'in_progress' ? (
            <>
              <button
                onClick={handleAbandon}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-xs font-semibold transition"
              >
                Surrender / Pause
              </button>

              <button
                onClick={handleComplete}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-rpg font-bold text-sm shadow-glow-emerald flex items-center justify-center gap-2 transition hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>COMPLETE QUEST & CLAIM XP ✓</span>
              </button>
            </>
          ) : quest.status === 'completed' ? (
            <div className="w-full py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 font-bold text-center text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>QUEST ALREADY CONQUERED!</span>
            </div>
          ) : (
            <button
              onClick={() => {
                handleAccept();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-bold text-sm shadow-glow-xp flex items-center justify-center gap-2 transition hover:scale-105"
            >
              <Swords className="w-4 h-4" />
              <span>ACCEPT QUEST ⚔️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
