import React from 'react';
import { useGame } from '../context/GameContext';
import { AVATAR_OPTIONS } from '../utils/demoData';
import { soundFx } from '../utils/sound';
import {
  Flame,
  Coins,
  Volume2,
  VolumeX,
  Sparkles,
  Map as MapIcon,
  Shield,
  ShoppingBag,
  Trophy,
  User,
  Moon,
  Wand2,
  Dices,
  PlaySquare,
} from 'lucide-react';

interface NavbarProps {
  onOpenQuestMaster: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuestMaster }) => {
  const {
    currentScreen,
    setCurrentScreen,
    player,
    toggleSound,
    toggleChaosMode,
    triggerRandomEvent,
    loadDemoMode,
    finishDay,
  } = useGame();

  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === player.avatar) || AVATAR_OPTIONS[0];

  const handleNav = (screen: any) => {
    soundFx.playClick(440);
    setCurrentScreen(screen);
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[#0a0e1a]/90 backdrop-blur-md border-b border-[#1f293d] shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('landing')}
              className="flex items-center gap-2 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-[2px] shadow-glow-purple group-hover:scale-105 transition">
                <div className="w-full h-full bg-[#0c101c] rounded-[10px] flex items-center justify-center text-xl">
                  ⚔️
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-rpg font-extrabold tracking-wider text-base sm:text-lg bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    ONE DAY QUEST
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">
                    BETA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Turn Your Day Into An Adventure</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121829]/80 p-1 rounded-xl border border-[#222d46]">
            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentScreen === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Quests</span>
            </button>

            <button
              onClick={() => handleNav('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentScreen === 'map'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Day Journey</span>
            </button>

            <button
              onClick={() => handleNav('shop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentScreen === 'shop'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rewards Shop</span>
            </button>

            <button
              onClick={() => handleNav('achievements')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentScreen === 'achievements'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Achievements</span>
            </button>

            <button
              onClick={() => handleNav('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentScreen === 'profile'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Hero Sheet</span>
            </button>
          </nav>

          {/* Right Status Badges & Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quest Master AI Button */}
            <button
              onClick={() => {
                soundFx.playClick(560);
                onOpenQuestMaster();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-900/80 to-purple-900/80 hover:from-indigo-800 hover:to-purple-800 border border-purple-500/40 text-purple-200 text-xs font-bold shadow-glow-purple hover:scale-105 transition"
              title="Summon Quest Master AI"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Quest Master</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded font-mono">AI</span>
            </button>

            {/* Surprise Event trigger */}
            <button
              onClick={() => triggerRandomEvent()}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-700/50 text-red-300 text-xs font-semibold flex items-center gap-1 transition group"
              title="Trigger Surprise Event"
            >
              <Dices className="w-4 h-4 text-red-400 group-hover:rotate-45 transition transform" />
              <span className="hidden lg:inline text-[11px]">Surprise!</span>
            </button>

            {/* Streak Counter */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-950/40 border border-orange-700/50 text-orange-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-400 animate-bounce" />
              <span>{player.streak}d</span>
            </div>

            {/* Quest Coins */}
            <button
              onClick={() => handleNav('shop')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-600/50 text-amber-300 text-xs font-bold hover:bg-amber-900/40 transition"
              title="Your Quest Coins"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono-stat">{player.coins}</span>
            </button>

            {/* Chaos Mode Toggle */}
            <button
              onClick={toggleChaosMode}
              className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                player.chaosMode
                  ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-glow-ruby'
                  : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={player.chaosMode ? 'Chaos Mode Active 😈' : 'Normal Adventure Mode'}
            >
              <span className="text-sm">😈</span>
              <span className="hidden xl:inline text-[10px]">{player.chaosMode ? 'CHAOS' : 'NORMAL'}</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
              title={player.soundEnabled ? 'Sound On' : 'Sound Muted'}
            >
              {player.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Quick Hero Avatar preview */}
            <button
              onClick={() => handleNav('profile')}
              className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-[#141b2d] hover:bg-[#1c263d] border border-indigo-700/40 transition"
              title="Open Hero Profile"
            >
              <span className="text-base">{currentAvatar.emoji}</span>
              <div className="hidden sm:block text-left leading-none">
                <div className="text-[10px] font-bold text-amber-400">LVL {player.level}</div>
                <div className="text-[11px] font-semibold text-slate-200 truncate max-w-[70px]">
                  {player.name.split(' ')[0]}
                </div>
              </div>
            </button>

            {/* End Day Button */}
            <button
              onClick={finishDay}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600/90 to-yellow-600/90 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-md transition"
              title="Conclude Today's Adventure & Get Final Score"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Finish Day</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d18]/95 backdrop-blur-lg border-t border-[#1e273d] px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => handleNav('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentScreen === 'dashboard' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <Shield className="w-5 h-5 mb-0.5" />
          <span>Quests</span>
        </button>

        <button
          onClick={() => handleNav('map')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentScreen === 'map' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <MapIcon className="w-5 h-5 mb-0.5" />
          <span>Journey</span>
        </button>

        <button
          onClick={() => handleNav('shop')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentScreen === 'shop' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => handleNav('achievements')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentScreen === 'achievements' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span>Badges</span>
        </button>

        <button
          onClick={() => handleNav('profile')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentScreen === 'profile' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Hero</span>
        </button>

        <button
          onClick={finishDay}
          className="flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold text-amber-400"
        >
          <Moon className="w-5 h-5 mb-0.5" />
          <span>Finish</span>
        </button>
      </nav>
    </>
  );
};
