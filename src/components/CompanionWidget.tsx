import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { MessageSquareText, Sparkles } from 'lucide-react';

type CompanionMood = 'idle' | 'happy' | 'excited' | 'roast' | 'proud';

type PokemonBuddy = {
  name: string;
  emoji: string;
  gradient: string;
  glow: string;
};

const pokemonPool: PokemonBuddy[] = [
  { name: 'Pikachu', emoji: '⚡', gradient: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 45%, #f59e0b 100%)', glow: 'rgba(251, 191, 36, 0.42)' },
  { name: 'Bulbasaur', emoji: '🌿', gradient: 'linear-gradient(135deg, #bbf7d0 0%, #4ade80 45%, #16a34a 100%)', glow: 'rgba(74, 222, 128, 0.42)' },
  { name: 'Charmander', emoji: '🔥', gradient: 'linear-gradient(135deg, #fdba74 0%, #fb923c 45%, #f97316 100%)', glow: 'rgba(251, 146, 60, 0.42)' },
  { name: 'Squirtle', emoji: '💧', gradient: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 42%, #2563eb 100%)', glow: 'rgba(96, 165, 250, 0.42)' },
  { name: 'Eevee', emoji: '✨', gradient: 'linear-gradient(135deg, #f5d0fe 0%, #c084fc 42%, #8b5cf6 100%)', glow: 'rgba(192, 132, 252, 0.42)' },
  { name: 'Jigglypuff', emoji: '🎵', gradient: 'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 42%, #ec4899 100%)', glow: 'rgba(244, 114, 182, 0.42)' },
  { name: 'Meowth', emoji: '💸', gradient: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 40%, #eab308 100%)', glow: 'rgba(250, 204, 21, 0.42)' },
  { name: 'Psyduck', emoji: '🧠', gradient: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 40%, #3b82f6 100%)', glow: 'rgba(147, 197, 253, 0.42)' },
  { name: 'Snorlax', emoji: '😴', gradient: 'linear-gradient(135deg, #e2e8f0 0%, #a5b4fc 48%, #6366f1 100%)', glow: 'rgba(99, 102, 241, 0.42)' },
  { name: 'Lucario', emoji: '🥋', gradient: 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 35%, #1d4ed8 100%)', glow: 'rgba(96, 165, 250, 0.42)' },
];

const messagePools: Record<CompanionMood, string[]> = {
  idle: [
    '👀 You still there?',
    'The quest is not going to complete itself, unfortunately.',
    'Bestie... the quest is getting concerned.',
    'You have a whole to-do list and a dramatic stare. Pick one.',
  ],
  happy: [
    'Okay. We are moving. Good stuff.',
    'This is the energy I like to see.',
    'Tiny win, big vibes.',
    'You are doing the thing. Respectfully.',
  ],
  excited: [
    'Alright hero. No dramatic speeches. Let’s go.',
    '20 minutes. You can absolutely survive this.',
    'Okay. Quest accepted. Let’s cook.',
    'Future you is already thanking you.',
  ],
  roast: [
    'Why are you looking at Skip?',
    'Don’t.',
    'That quest had ONE job 😭',
    'Interesting strategy.',
    'Do nothing → accomplish nothing. Revolutionary.',
  ],
  proud: [
    'YOOOOO.',
    'Look at you actually doing things.',
    'Quest defeated. 🫡',
    'Okayyyy, we’re cooking.',
    'That was suspiciously productive. I respect it.',
  ],
};

const moodStyles: Record<CompanionMood, string> = {
  idle: 'border-slate-200 bg-white/90 text-slate-800',
  happy: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  excited: 'border-violet-200 bg-violet-50 text-violet-900',
  roast: 'border-amber-200 bg-amber-50 text-amber-900',
  proud: 'border-pink-200 bg-pink-50 text-pink-900',
};

const pickRandomPokemon = (exclude?: string): PokemonBuddy => {
  const choices = !exclude ? pokemonPool : pokemonPool.filter((buddy) => buddy.name !== exclude);
  return choices[Math.floor(Math.random() * choices.length)];
};

export const CompanionWidget: React.FC = () => {
  const { player } = useGame();
  const [mood, setMood] = useState<CompanionMood>('idle');
  const [message, setMessage] = useState<string>('You’re one small win away from a very decent day.');
  const [lastTrigger, setLastTrigger] = useState<number>(Date.now());
  const [currentPokemon, setCurrentPokemon] = useState<PokemonBuddy>(() => pickRandomPokemon());

  const companionLevel = Math.min(5, Math.max(1, Math.floor(player.level / 2) + 1));

  useEffect(() => {
    const rotatePokemon = window.setInterval(() => {
      setCurrentPokemon((previous) => pickRandomPokemon(previous.name));
    }, 4200);

    return () => window.clearInterval(rotatePokemon);
  }, []);

  useEffect(() => {
    const handleCompanionEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ type?: string }>).detail;
      const type = detail?.type;
      if (!type) return;

      const cooldownMs = 1800;
      const now = Date.now();
      if (now - lastTrigger < cooldownMs) return;

      const nextMoodMap: Record<string, CompanionMood> = {
        'quest-start': 'excited',
        'quest-complete': 'proud',
        'quest-skip-hover': 'roast',
        'quest-skip': 'roast',
        'reward-open': 'happy',
      };

      const nextMood = nextMoodMap[type] || 'happy';
      const pool = messagePools[nextMood];
      setMood(nextMood);
      setMessage(pool[Math.floor(Math.random() * pool.length)]);
      setCurrentPokemon((previous) => pickRandomPokemon(previous.name));
      setLastTrigger(now);
    };

    const idleTimer = window.setInterval(() => {
      const now = Date.now();
      if (now - lastTrigger > 12000) {
        const pool = messagePools.idle;
        setMood('idle');
        setMessage(pool[Math.floor(Math.random() * pool.length)]);
        setCurrentPokemon((previous) => pickRandomPokemon(previous.name));
        setLastTrigger(now);
      }
    }, 7000);

    window.addEventListener('companion-event', handleCompanionEvent);
    return () => {
      window.removeEventListener('companion-event', handleCompanionEvent);
      window.clearInterval(idleTimer);
    };
  }, [lastTrigger]);

  return (
    <aside className="companion-widget fixed bottom-4 right-4 z-40 w-[min(320px,calc(100vw-1.5rem))] pointer-events-none">
      <div className={`companion-card pointer-events-auto rounded-[28px] border shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300 ${moodStyles[mood]}`}>
        <div className="flex items-start gap-3 p-3 sm:p-4">
          <div
            className={`companion-avatar ${mood}`}
            aria-label={`${currentPokemon.name} companion`}
            title={currentPokemon.name}
            style={{
              background: currentPokemon.gradient,
              boxShadow: `0 16px 32px ${currentPokemon.glow}, inset 0 1px 0 rgba(255,255,255,0.7)`,
            }}
          >
            <span>{currentPokemon.emoji}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Quest Buddy</p>
                <h3 className="text-sm font-bold text-slate-900">{currentPokemon.name} is here to hype you.</h3>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-black text-violet-700">
                <span className="text-[10px]">⚡</span>
                Lv {companionLevel}
              </div>
            </div>

            <div className="mt-2 flex items-start gap-2 rounded-2xl bg-white/60 p-2.5">
              <MessageSquareText className="mt-0.5 h-4 w-4 text-violet-600" />
              <p className="text-sm leading-relaxed text-slate-700">{message}</p>
            </div>

            <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-slate-500">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>{currentPokemon.name} energy • supportive, dramatic, and mildly chaotic</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
