import React from 'react';
import { useGame } from '../context/GameContext';
import { soundFx } from '../utils/sound';
import { Sparkles, Coins, Dices, X, ArrowRight } from 'lucide-react';

export const RandomEventModal: React.FC = () => {
  const { currentRandomEvent, resolveRandomEventChoice, closeRandomEvent } = useGame();

  if (!currentRandomEvent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-b from-[#161329] via-[#0f1222] to-[#0a0d17] border-2 border-purple-500/80 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-glow-purple relative">
        {/* Close Button */}
        <button
          onClick={closeRandomEvent}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Badge */}
        <div className="flex items-center gap-2 mb-2">
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 via-purple-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <Dices className="w-4 h-4 animate-spin" />
            <span>RANDOM EVENT ENCOUNTER</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 my-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/70 border border-purple-400/50 flex items-center justify-center text-3xl shrink-0 shadow-glow-xp">
            {currentRandomEvent.icon}
          </div>
          <div>
            <h2 className="font-rpg font-extrabold text-xl text-white leading-tight">
              {currentRandomEvent.title}
            </h2>
          </div>
        </div>

        {/* Description & Lore */}
        <div className="bg-[#0b0e1a]/80 border border-purple-900/40 rounded-2xl p-3.5 mb-4">
          <p className="text-sm text-slate-200 leading-relaxed mb-1.5">
            {currentRandomEvent.description}
          </p>
          <p className="text-xs text-purple-300/80 italic">"{currentRandomEvent.flavorText}"</p>
        </div>

        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Choose Your Path:
        </h4>

        {/* Choices */}
        <div className="space-y-2.5">
          {currentRandomEvent.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => resolveRandomEventChoice(choice.id)}
              className="w-full text-left p-3.5 rounded-2xl bg-[#12172a] hover:bg-[#1a233f] border border-[#232f4e] hover:border-purple-500/70 transition-all duration-200 group flex items-center justify-between gap-3 shadow-sm hover:shadow-glow-xp"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{choice.icon}</span>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                    {choice.label}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">{choice.description}</div>
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <span className="text-xs font-mono-stat font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  +{choice.xpBonus} XP
                </span>
                <span className="text-[11px] font-mono-stat font-bold text-amber-400 flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  +{choice.coinBonus}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
