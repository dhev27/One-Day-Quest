import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MapNode } from '../types/quest';
import { soundFx } from '../utils/sound';
import {
  Map as MapIcon,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Shield,
  Compass,
  Flame,
  ChevronRight,
} from 'lucide-react';

export const AdventureMapScreen: React.FC = () => {
  const { mapNodes, setCurrentScreen } = useGame();
  const [selectedNode, setSelectedNode] = useState<MapNode>(mapNodes[0] || null);

  const handleSelectNode = (node: MapNode) => {
    soundFx.playClick(node.status === 'completed' ? 600 : node.status === 'current' ? 500 : 350);
    setSelectedNode(node);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              EXPEDITION REALM
            </span>
          </div>
          <h1 className="font-rpg font-black text-2xl sm:text-3xl md:text-4xl text-white">
            ADVENTURE MAP 🗺️
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your progression through the physical & mental realms of your day.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="px-4 py-2 rounded-xl bg-[#12172a] hover:bg-[#1a233f] border border-[#232f4e] text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5 self-center sm:self-auto"
        >
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Back to Quest Board</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas / Nodes Stream (2 cols) */}
        <div className="lg:col-span-2 bg-[#0c101c] border border-[#1e283f] rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          {/* Ambient Map Grid lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {mapNodes.map((node, index) => {
              const isCompleted = node.status === 'completed';
              const isCurrent = node.status === 'current';
              const isLocked = node.status === 'locked';
              const isSelected = selectedNode?.id === node.id;

              return (
                <div key={node.id} className="relative">
                  {/* Connecting Trail Line */}
                  {index < mapNodes.length - 1 && (
                    <div
                      className={`absolute left-7 top-14 bottom-0 w-0.5 -mb-6 z-0 ${
                        isCompleted
                          ? 'bg-gradient-to-b from-emerald-500 to-cyan-500'
                          : 'bg-slate-800'
                      }`}
                    />
                  )}

                  <div
                    onClick={() => handleSelectNode(node)}
                    className={`relative z-10 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-cyan-400 bg-[#162038] shadow-glow-cyan'
                        : isCurrent
                        ? 'border-purple-500 bg-[#13172c] shadow-glow-xp'
                        : isCompleted
                        ? 'border-emerald-800/60 bg-[#0d161a] hover:border-emerald-600/70'
                        : 'border-slate-800/80 bg-[#0a0d16]/70 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Node Icon Avatar */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform ${
                          isCompleted
                            ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                            : isCurrent
                            ? 'bg-purple-950 border border-purple-400 text-purple-200 animate-pulse'
                            : 'bg-slate-900 border border-slate-800 text-slate-600'
                        }`}
                      >
                        {isLocked ? '🔒' : node.icon}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                              isCompleted
                                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                                : isCurrent
                                ? 'bg-purple-950/80 border-purple-600 text-purple-300 animate-bounce'
                                : 'bg-slate-900 border-slate-800 text-slate-500'
                            }`}
                          >
                            {isCompleted ? 'CLEARED' : isCurrent ? 'CURRENT LOCATION' : 'FOG OF WAR'}
                          </span>
                          <span className="text-xs font-mono-stat text-purple-400 font-bold">
                            +{node.xpReward} XP
                          </span>
                        </div>

                        <h3 className="font-rpg font-bold text-base sm:text-lg text-white mt-1">
                          {node.name}
                        </h3>
                        <p className="text-xs text-slate-400">{node.subtitle}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-400 text-purple-300 flex items-center justify-center animate-ping">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Lore Inspector Panel (1 col) */}
        <div className="bg-[#0f1424] border border-[#212d47] rounded-3xl p-6 shadow-2xl h-fit sticky top-20">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
            LOCATION LORE
          </div>

          {selectedNode ? (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-900 to-cyan-900 border border-purple-500/50 flex items-center justify-center text-3xl mb-4 shadow-glow-xp">
                {selectedNode.status === 'locked' ? '🔒' : selectedNode.icon}
              </div>

              <h2 className="font-rpg font-bold text-xl sm:text-2xl text-white mb-1">
                {selectedNode.name}
              </h2>
              <p className="text-xs text-purple-300 font-medium mb-4">{selectedNode.subtitle}</p>

              <div className="p-4 rounded-2xl bg-[#090c17] border border-[#1b253d] mb-5">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{selectedNode.lore}"
                </p>
              </div>

              <div className="space-y-2 mb-6 text-xs text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-[#1b253d]">
                  <span className="text-slate-500">Status:</span>
                  <span
                    className={`font-bold capitalize ${
                      selectedNode.status === 'completed'
                        ? 'text-emerald-400'
                        : selectedNode.status === 'current'
                        ? 'text-purple-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1b253d]">
                  <span className="text-slate-500">Bounty Yield:</span>
                  <span className="font-bold font-mono-stat text-amber-400">
                    +{selectedNode.xpReward} XP
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-rpg font-bold text-xs shadow-glow-xp flex items-center justify-center gap-2 transition"
              >
                <span>OPEN QUEST DASHBOARD</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Click a node on the map to inspect its lore.</p>
          )}
        </div>
      </div>
    </div>
  );
};
