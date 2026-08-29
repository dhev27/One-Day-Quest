import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { generateQuestMasterSuggestions, QuestMasterResult } from '../utils/questMasterAI';
import { soundFx } from '../utils/sound';
import { Wand2, X, Sparkles, Coins, Plus, Loader2, ArrowRight } from 'lucide-react';

interface QuestMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PROMPTS = [
  'I have 2 hours free, ₹200, I\'m on campus with two friends and I\'m bored.',
  'I have an upcoming exam tomorrow, 4 hours free, feeling low energy at home.',
  'Just finished a big sprint, need a fun creative diversion outside with ₹100.',
  'At my desk feeling stuck and procrastinating on my code project.',
];

export const QuestMasterModal: React.FC<QuestMasterModalProps> = ({ isOpen, onClose }) => {
  const { addCustomQuest } = useGame();
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<QuestMasterResult | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    soundFx.playClick(600);

    setTimeout(() => {
      const generated = generateQuestMasterSuggestions(prompt);
      setResult(generated);
      setLoading(false);
      soundFx.playQuestComplete();
    }, 1000);
  };

  const handleAddQuest = (quest: any) => {
    addCustomQuest(quest);
    soundFx.playCoin();
    // remove from result list
    if (result) {
      setResult({
        ...result,
        quests: result.quests.filter((q) => q.id !== quest.id),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-b from-[#16122d] via-[#101324] to-[#0a0d18] border-2 border-indigo-500/70 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-glow-purple relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-amber-300 shadow-glow-purple">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-rpg font-extrabold text-xl sm:text-2xl text-white">
              🧙 QUEST MASTER AI
            </h2>
            <p className="text-xs text-purple-300">
              Describe your current real-world situation and summon tailored mini-adventures.
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="my-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            What is your situation right now?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I have 2 hours free, ₹200, I'm on campus with two friends and I'm bored..."
            className="w-full bg-[#090c17] border border-[#232f4b] focus:border-purple-500 rounded-2xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition resize-none h-24"
          />

          {/* Quick preset suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            <span className="text-[11px] text-slate-500">Quick ideas:</span>
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p)}
                className="text-[11px] bg-slate-900/90 hover:bg-purple-950/70 border border-slate-800 hover:border-purple-600/50 text-slate-300 hover:text-purple-200 px-2.5 py-1 rounded-lg transition truncate max-w-[200px]"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Summon Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`w-full py-3 rounded-xl font-rpg font-bold text-sm flex items-center justify-center gap-2 transition ${
            loading || !prompt.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-xp hover:scale-[1.02]'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Consulting Ancient Scrolls & Calculating XP...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>TRANSMUTE INTO QUESTS ⚔️</span>
            </>
          )}
        </button>

        {/* Results Deck */}
        {result && (
          <div className="mt-6 pt-5 border-t border-[#1d273f]">
            <div className="bg-[#0e1222] border border-purple-900/50 rounded-2xl p-3.5 mb-4">
              <p className="text-xs text-purple-200 font-medium italic">{result.aiCommentary}</p>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Tailored Quests Generated ({result.quests.length})</span>
              <span className="text-amber-400 font-mono-stat text-[11px]">Ready to Accept</span>
            </h4>

            {result.quests.length === 0 ? (
              <p className="text-xs text-emerald-400 text-center py-4">
                ✓ All generated quests added to your Quest Board!
              </p>
            ) : (
              <div className="space-y-3">
                {result.quests.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-[#0f1426] border border-[#232f4e] hover:border-purple-500/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{q.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-white">{q.title}</div>
                        <div className="text-xs text-slate-300 mt-0.5">{q.description}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-mono-stat font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> +{q.xpReward} XP
                          </span>
                          <span className="text-[10px] font-mono-stat font-bold text-amber-400 flex items-center gap-1">
                            <Coins className="w-3 h-3" /> +{q.coinReward} Coins
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddQuest(q)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shrink-0 flex items-center justify-center gap-1.5 transition hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Board</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
