import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { HowItWorksModal } from '../components/HowItWorksModal';
import { soundFx } from '../utils/sound';
import {
  Swords,
  Sparkles,
  Zap,
  Play,
  Flame,
  Shield,
  Dices,
  Trophy,
  ArrowRight,
  Compass,
  Star,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { setCurrentScreen, loadDemoMode } = useGame();
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  const handleStart = () => {
    soundFx.playQuestAccept();
    setCurrentScreen('setup');
  };

  const handleDemo = () => {
    soundFx.playLevelUp();
    loadDemoMode();
  };

  const journeySteps = [
    { title: 'Morning Gate', subtitle: 'Awaken & Prepare', icon: '☀️', color: 'from-amber-400 to-yellow-600' },
    { title: 'Knowledge Dungeon', subtitle: 'Deep Focus Sprint', icon: '⚔️', color: 'from-purple-500 to-indigo-600' },
    { title: 'Mystery Quest', subtitle: 'Secret Locked Scroll', icon: '🎲', color: 'from-pink-500 to-rose-600' },
    { title: "Explorer's Path", subtitle: 'Touch Grass & Uncover', icon: '🌳', color: 'from-emerald-400 to-teal-600' },
    { title: 'Final Boss Challenge', subtitle: 'The Climax Milestone', icon: '🏆', color: 'from-red-500 to-orange-600' },
    { title: 'Night Sanctuary', subtitle: 'Day Complete & Loot', icon: '🌙', color: 'from-indigo-400 to-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 relative overflow-hidden pb-20">
      {/* Background Decorative Mesh & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 text-center relative z-10">
        {/* Hackathon Theme Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 font-extrabold text-xs tracking-wider uppercase mb-6 shadow-glow-purple">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>HACKATHON THEME: THE PERFECT DAY</span>
        </div>

        {/* Main Title */}
        <h1 className="font-rpg font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white mb-4 leading-none">
          ONE DAY{' '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent text-glow-gold">
            QUEST
          </span>{' '}
          🎮⚔️
        </h1>

        {/* Subtitle */}
        <h2 className="font-rpg font-bold text-xl sm:text-2xl md:text-3xl text-purple-200/90 max-w-3xl mx-auto mb-3">
          Your day. Your quests. Your adventure.
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Turn ordinary moments into challenges, discoveries, XP, level ups, and rewards. Play
          through real life without boring checklists.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-10">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-extrabold text-base tracking-wider shadow-glow-xp hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            <span>START MY QUEST ⚔️</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick(500);
              setShowHowItWorks(true);
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#131929] hover:bg-[#1c243a] border border-[#263554] text-slate-200 font-rpg font-bold text-sm hover:border-purple-500/60 transition flex items-center justify-center gap-2"
          >
            <span>HOW IT WORKS</span>
          </button>
        </div>

        {/* Demo Mode Quick Launch Banner */}
        <div className="max-w-xl mx-auto mb-16 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900/80 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 font-mono text-xl">
              🎬
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                HACKATHON JUDGES & QUICK TESTERS
              </div>
              <div className="text-xs text-slate-300">
                Jump into pre-loaded Level 6 demo with quests, streak & shop!
              </div>
            </div>
          </div>

          <button
            onClick={handleDemo}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition shrink-0 flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>DEMO MODE</span>
          </button>
        </div>

        {/* Visual Day Journey Flow Preview */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
              THE DAILY EXPEDITION
            </div>
            <h3 className="font-rpg font-extrabold text-2xl text-white">
              Every Day Follows A Heroic Arc
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {journeySteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#101524] border border-[#1f2a42] hover:border-purple-500/60 transition group text-center flex flex-col items-center justify-between"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} p-[1px] mb-3 shadow-md group-hover:scale-110 transition`}
                >
                  <div className="w-full h-full bg-[#0a0d18] rounded-[15px] flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                </div>
                <div className="font-rpg font-bold text-xs sm:text-sm text-slate-200 mb-1">
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">{step.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Philosophy: PLAN → QUEST → PLAY → LEVEL UP → REPEAT */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0f1424] border border-[#212c47] max-w-4xl mx-auto text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="font-rpg font-black text-xl sm:text-3xl text-white mb-6">
            PLAN <span className="text-purple-400">→</span> QUEST{' '}
            <span className="text-purple-400">→</span> PLAY{' '}
            <span className="text-purple-400">→</span> LEVEL UP{' '}
            <span className="text-purple-400">→</span> REPEAT
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-2xl bg-[#0a0d18] border border-[#1a2339]">
              <div className="text-2xl mb-2">🐉</div>
              <h4 className="font-rpg font-bold text-sm text-amber-300 mb-1">Boss Battles, Not Checklists</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Turn your presentation into Defeating the Final Boss and your study sprint into Surviving the Knowledge Dungeon.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0d18] border border-[#1a2339]">
              <div className="text-2xl mb-2">🎲</div>
              <h4 className="font-rpg font-bold text-sm text-purple-300 mb-1">Chaos & Secret Quests</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Locked mystery scrolls reveal themselves when you build momentum. Random surprise events test your spontaneity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0d18] border border-[#1a2339]">
              <div className="text-2xl mb-2">🪙</div>
              <h4 className="font-rpg font-bold text-sm text-cyan-300 mb-1">XP, Coins & Cosmetic Loot</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Level up your character, maintain streak multipliers, and spend earned Quest Coins on hats, pet familiars, and titles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works modal */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        onStart={handleStart}
      />
    </div>
  );
};
