import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundFx } from '../utils/sound';
import { triggerCelebration, triggerLevelUpFireworks } from '../utils/confetti';
import { Sparkles, Swords, CheckCircle2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export const GeneratingScreen: React.FC = () => {
  const { daySetup, startNewDayWithSetup } = useGame();

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dayTitle, setDayTitle] = useState<string>('The Main Character Odyssey');

  const animationSteps = [
    'Scanning your daily timeline...',
    'Calibrating boss encounter & focus dungeons...',
    'Loading side quests & XP bounties...',
    'Locking one ancient secret quest in the vault...',
    'Summoning destiny & preparing the adventure board...',
  ];

  useEffect(() => {
    const titles = [
      'The Main Character Day',
      'Operation: Get Your Life Together',
      'The Day of Small Wins',
      'Campus Chaos & Glory',
      'The Productivity Rebellion',
      'The Coffee Alchemist Odyssey',
    ];
    setDayTitle(titles[Math.floor(Math.random() * titles.length)]);

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < animationSteps.length - 1) {
          soundFx.playClick(400 + prev * 80);
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            soundFx.playLevelUp();
            triggerCelebration();
            setIsReady(true);
          }, 600);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const handleEnterRealm = () => {
    if (daySetup) {
      soundFx.playQuestAccept();
      startNewDayWithSetup({ ...daySetup, dayThemeName: dayTitle });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Magical Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-amber-900/20 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />

      <div className="max-w-lg w-full bg-[#0f1424] border-2 border-purple-500/60 rounded-3xl p-6 sm:p-8 shadow-glow-purple text-center relative z-10">
        {!isReady ? (
          <div>
            {/* Spinning Sigil */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-[2px] shadow-glow-xp mb-6 animate-pulse">
              <div className="w-full h-full bg-[#0a0d18] rounded-[22px] flex items-center justify-center text-4xl animate-bounce">
                ⚔️
              </div>
            </div>

            <h2 className="font-rpg font-extrabold text-2xl sm:text-3xl text-white mb-2 tracking-wide">
              GENERATING YOUR ADVENTURE...
            </h2>
            <p className="text-xs text-purple-300 mb-6 font-mono-stat">
              Transmuting ordinary hours into high-yield quests
            </p>

            {/* Stepper sequence */}
            <div className="space-y-3 text-left max-w-sm mx-auto mb-6">
              {animationSteps.map((step, idx) => {
                const isPassed = idx <= stepIndex;
                const isCurrent = idx === stepIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 text-xs sm:text-sm font-medium transition-all duration-300 ${
                      isCurrent
                        ? 'text-amber-300 font-bold scale-105 pl-1'
                        : isPassed
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 border ${
                        isPassed
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-600'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>

            <div className="w-full h-2 bg-[#090c18] rounded-full overflow-hidden border border-[#232f4a]">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-500"
                style={{ width: `${((stepIndex + 1) / animationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="animate-levelUp">
            {/* Ready Badge */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-[2px] shadow-glow-gold mb-4 animate-bounce">
              <div className="w-full h-full bg-[#0a0d18] rounded-[22px] flex items-center justify-center text-4xl">
                ✨
              </div>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500/60 text-amber-300 font-extrabold text-xs tracking-widest uppercase mb-2">
              ★ ADVENTURE FORGED ★
            </div>

            <h2 className="font-rpg font-black text-3xl sm:text-4xl text-white mb-2">
              YOUR QUEST IS READY
            </h2>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-amber-950/60 border border-purple-500/50 mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-0.5">
                TODAY'S CAMPAIGN TITLE
              </div>
              <div className="font-rpg font-extrabold text-xl text-amber-300">{dayTitle}</div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              The fog of war lifts. Your daily quests, focus timers, and mystery bounty await.
            </p>

            <button
              onClick={handleEnterRealm}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-black text-base shadow-glow-xp flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition"
            >
              <span>ENTER THE REALM ⚔️</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
