import React from 'react';
import { useGame } from '../context/GameContext';
import { soundFx } from '../utils/sound';
import { triggerCelebration, triggerLevelUpFireworks } from '../utils/confetti';
import {
  Moon,
  Trophy,
  Sparkles,
  Coins,
  Flame,
  CheckCircle2,
  ArrowRight,
  Share2,
  Star,
  Shield,
  Heart,
} from 'lucide-react';

export const EndOfDayScreen: React.FC = () => {
  const { daySummary, setCurrentScreen, loadDemoMode } = useGame();

  const handlePlayAgain = () => {
    soundFx.playQuestAccept();
    setCurrentScreen('setup');
  };

  const score = daySummary?.score || 88;
  const completed = daySummary?.questsCompleted || 5;
  const total = daySummary?.totalQuests || 6;
  const xp = daySummary?.xpEarned || 840;
  const coins = daySummary?.coinsEarned || 120;
  const streak = daySummary?.streak || 5;
  const title = daySummary?.titleEarned || 'MAIN CHARACTER ENERGY';

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-10 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center items-center pb-24">
      {/* Background ambient moonlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-950/30 via-purple-950/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10 animate-fadeIn">
        {/* Main Recap Card */}
        <div className="bg-[#0f1424] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-9 shadow-glow-gold text-center relative overflow-hidden">
          {/* Top Emblem */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-[2px] shadow-glow-xp mb-4">
            <div className="w-full h-full bg-[#0a0d18] rounded-[22px] flex items-center justify-center text-4xl animate-bounce">
              🌙
            </div>
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 font-extrabold text-xs tracking-widest uppercase mb-2">
            CHAPTER CONCLUDED
          </div>

          <h1 className="font-rpg font-black text-3xl sm:text-4xl text-white mb-2">
            ADVENTURE COMPLETE
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mb-6">
            The night sky settles over the realm. Here is your daily chronicle:
          </p>

          {/* Big Day Score Meter */}
          <div className="bg-gradient-to-b from-[#161b30] to-[#0c101c] border border-[#263554] rounded-3xl p-6 mb-6 shadow-inner">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              PERFECT DAY SCORE
            </div>
            <div className="font-mono-stat font-black text-5xl sm:text-6xl bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent mb-2">
              {score} <span className="text-2xl text-slate-500 font-normal">/ 100</span>
            </div>
            <div className="w-full max-w-sm mx-auto h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-amber-400 rounded-full transition-all duration-1000"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Breakdown by Core Dimensions */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 text-left">
            {[
              { label: '🎯 Goals', val: daySummary?.categoryScores?.goals || 90 },
              { label: '❤️ Well-being', val: daySummary?.categoryScores?.wellbeing || 85 },
              { label: '👥 Social', val: daySummary?.categoryScores?.social || 75 },
              { label: '🗺️ Exploration', val: daySummary?.categoryScores?.exploration || 80 },
              { label: '🎨 Creativity', val: daySummary?.categoryScores?.creativity || 90 },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#090d18] border border-[#1b253b] text-center"
              >
                <div className="text-[11px] font-bold text-slate-400 truncate">{cat.label}</div>
                <div className="font-mono-stat font-extrabold text-sm text-purple-300 mt-1">
                  {cat.val}%
                </div>
              </div>
            ))}
          </div>

          {/* Core Spoils Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-[#0a0e1a] border border-[#1d273f]">
              <div className="text-[10px] font-bold uppercase text-slate-500">Quests Complete</div>
              <div className="font-mono-stat font-extrabold text-base text-emerald-400 mt-0.5">
                {completed} / {total}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0a0e1a] border border-[#1d273f]">
              <div className="text-[10px] font-bold uppercase text-slate-500">XP Harvested</div>
              <div className="font-mono-stat font-extrabold text-base text-purple-300 mt-0.5">
                +{xp} XP
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0a0e1a] border border-[#1d273f]">
              <div className="text-[10px] font-bold uppercase text-slate-500">Coins Earned</div>
              <div className="font-mono-stat font-extrabold text-base text-amber-400 mt-0.5">
                +{coins} 🪙
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0a0e1a] border border-[#1d273f]">
              <div className="text-[10px] font-bold uppercase text-slate-500">Active Streak</div>
              <div className="font-mono-stat font-extrabold text-base text-orange-400 mt-0.5 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                {streak} Days
              </div>
            </div>
          </div>

          {/* Generated Title Award */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-amber-950/60 border border-purple-500/60 mb-6">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>TODAY'S CONFERRED TITLE</span>
            </div>
            <h3 className="font-rpg font-black text-2xl text-yellow-300 tracking-wide">{title}</h3>
            <p className="text-xs text-slate-300 mt-2 italic max-w-md mx-auto">
              "{daySummary?.summaryText ||
                'You conquered your main quest, explored uncharted grounds, and emerged victorious.'}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                soundFx.playCoin();
                triggerCelebration();
                alert('🏆 Day summary card copied to clipboard! Ready to share with your party.');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#141a2c] hover:bg-[#1d253e] border border-[#243354] text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Share Daily Chronicle</span>
            </button>

            <button
              onClick={handlePlayAgain}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-extrabold text-sm shadow-glow-xp flex items-center justify-center gap-2 hover:scale-105 transition"
            >
              <span>PLAY AGAIN TOMORROW →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
