import React from 'react';
import { X, ArrowRight, Shield, Zap, Sparkles, Trophy, Dices, Coins } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, onStart }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'PLAN YOUR BUILD',
      desc: 'Set your daily energy (Low, High, Chaotic), choose main goals, budget & location. No rigid calendar slots.',
      icon: '🛡️',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      step: '02',
      title: 'RECEIVE YOUR QUEST DECK',
      desc: 'The game generates 1 Main Epic Boss Quest, balanced Side Quests, an Uncharted Exploration Quest, and a Locked Mystery Scroll.',
      icon: '⚔️',
      color: 'from-purple-600 to-indigo-600',
    },
    {
      step: '03',
      title: 'PLAY & SURVIVE CHAOS',
      desc: 'Activate quests, conquer focus sprints with the built-in focus chrono, trigger surprise random events, and stack combo multipliers.',
      icon: '🎲',
      color: 'from-pink-600 to-rose-600',
    },
    {
      step: '04',
      title: 'EARN XP & LEVEL UP',
      desc: 'Collect XP to ascend hero levels, earn Quest Coins to buy awesome cosmetics & familiars in the rewards shop, and unlock achievements.',
      icon: '⚡',
      color: 'from-amber-500 to-yellow-600',
    },
    {
      step: '05',
      title: 'CONCLUDE & CLAIM YOUR TITLE',
      desc: 'At nightfall, review your final Day Score (0-100), claim your legendary daily title (e.g. "Main Character Energy"), and repeat tomorrow.',
      icon: '🌙',
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-b from-[#14182b] via-[#0e1222] to-[#080b15] border-2 border-[#263554] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-950/80 border border-purple-600/50 text-purple-300 font-extrabold text-xs tracking-widest uppercase mb-2">
            THE ADVENTURE ENGINE
          </div>
          <h2 className="font-rpg font-black text-2xl sm:text-3xl text-white">
            HOW ONE DAY QUEST WORKS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            We replaced boring to-do lists with the adrenaline and reward loop of an RPG.
          </p>
        </div>

        {/* Step-by-Step Walkthrough */}
        <div className="space-y-3.5 mb-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0b0f1d] border border-[#1e2a44] flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-900 to-indigo-900 border border-purple-500/40 flex items-center justify-center text-xl shrink-0 shadow-sm">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-mono-stat font-extrabold text-amber-400 bg-amber-950/70 px-1.5 py-0.2 rounded border border-amber-800/40">
                    STEP {item.step}
                  </span>
                  <h4 className="font-rpg font-bold text-sm text-slate-100">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2a44]">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              soundFx.playClick(600);
              onClose();
              onStart();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-bold text-sm shadow-glow-xp flex items-center gap-2 transition hover:scale-105"
          >
            <span>START ADVENTURE ⚔️</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
