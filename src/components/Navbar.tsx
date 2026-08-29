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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('landing')}
              className="group flex items-center gap-2 text-left transition-transform hover:scale-[1.01]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-amber-400 text-xl shadow-sm">
                ⚡
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-semibold tracking-[0.18em] text-slate-900 text-[0.72rem] uppercase">
                    One Day Quest
                  </span>
                  <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-violet-700">
                    beta
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Your day, gently leveled up.</p>
              </div>
            </button>
          </div>

          <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 md:flex">
            <button
              onClick={() => handleNav('dashboard')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currentScreen === 'dashboard' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Quests
              </span>
            </button>

            <button
              onClick={() => handleNav('map')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currentScreen === 'map' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <MapIcon className="h-3.5 w-3.5" />
                Journey
              </span>
            </button>

            <button
              onClick={() => handleNav('shop')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currentScreen === 'shop' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" />
                Rewards
              </span>
            </button>

            <button
              onClick={() => handleNav('achievements')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currentScreen === 'achievements' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                Wins
              </span>
            </button>

            <button
              onClick={() => handleNav('profile')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currentScreen === 'profile' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Profile
              </span>
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                soundFx.playClick(560);
                onOpenQuestMaster();
              }}
              className="hidden items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 transition hover:scale-[1.02] sm:flex"
              title="Summon Quest Master AI"
            >
              <Wand2 className="h-3.5 w-3.5" />
              AI
            </button>

            <button
              onClick={() => triggerRandomEvent()}
              className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-600 transition hover:scale-[1.02]"
              title="Trigger Surprise Event"
            >
              <span className="flex items-center gap-1">
                <Dices className="h-3.5 w-3.5" />
                surprise
              </span>
            </button>

            <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{player.streak}d</span>
            </div>

            <button
              onClick={() => handleNav('shop')}
              className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700"
              title="Your Quest Coins"
            >
              <Coins className="h-3.5 w-3.5" />
              <span>{player.coins}</span>
            </button>

            <button
              onClick={toggleChaosMode}
              className={`rounded-full border px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition ${
                player.chaosMode
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
              title={player.chaosMode ? 'Chaos Mode Active' : 'Normal Adventure Mode'}
            >
              {player.chaosMode ? 'chaos' : 'calm'}
            </button>

            <button
              onClick={toggleSound}
              className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:text-slate-900"
              title={player.soundEnabled ? 'Sound On' : 'Sound Muted'}
            >
              {player.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              onClick={() => handleNav('profile')}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-1.5 py-1 text-left shadow-sm"
              title="Open Hero Profile"
            >
              <span className="text-base">{currentAvatar.emoji}</span>
              <div className="hidden sm:block leading-none">
                <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-violet-600">Lvl {player.level}</div>
                <div className="text-[10px] font-semibold text-slate-700">{player.name.split(' ')[0]}</div>
              </div>
            </button>

            <button
              onClick={finishDay}
              className="hidden items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700 lg:flex"
              title="Conclude Today's Adventure & Get Final Score"
            >
              <Moon className="h-3.5 w-3.5" />
              <span>Finish</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
