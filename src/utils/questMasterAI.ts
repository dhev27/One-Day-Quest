import { Quest } from '../types/quest';

export interface QuestMasterResult {
  questTitle: string;
  theme: string;
  quests: Quest[];
  aiCommentary: string;
}

export function generateQuestMasterSuggestions(prompt: string): QuestMasterResult {
  const cleanPrompt = prompt.toLowerCase();
  const timestamp = Date.now();

  // Extract variables from prompt heuristically or fallback smartly
  const hasMoney = cleanPrompt.includes('₹') || cleanPrompt.includes('rs') || cleanPrompt.includes('rupee') || cleanPrompt.includes('money') || cleanPrompt.includes('budget');
  const hasFriends = cleanPrompt.includes('friend') || cleanPrompt.includes('squad') || cleanPrompt.includes('homies') || cleanPrompt.includes('people') || cleanPrompt.includes('roommate');
  const onCampus = cleanPrompt.includes('campus') || cleanPrompt.includes('college') || cleanPrompt.includes('uni') || cleanPrompt.includes('hostel') || cleanPrompt.includes('library');
  const isBored = cleanPrompt.includes('bored') || cleanPrompt.includes('nothing') || cleanPrompt.includes('free') || cleanPrompt.includes('time') || cleanPrompt.includes('hour');
  const isStudy = cleanPrompt.includes('study') || cleanPrompt.includes('exam') || cleanPrompt.includes('code') || cleanPrompt.includes('assignment') || cleanPrompt.includes('project');

  const generatedQuests: Quest[] = [];

  if (hasFriends && (hasMoney || onCampus || isBored)) {
    generatedQuests.push({
      id: `qm-quest-1-${timestamp}`,
      title: 'THE ₹200 CAMPUS FEAST EXPEDITION',
      subtitle: 'Multiplayer Micro-Raid',
      description: 'Head to the nearest food stall with your squad, pool your funds, and buy the most legendary shared snack you can find.',
      flavorText: 'The Quest Master senses a hunger for camaraderie and deep-fried carbs.',
      category: 'social',
      difficulty: 'medium',
      xpReward: 180,
      coinReward: 50,
      status: 'available',
      timeEstimateMinutes: 40,
      location: 'Campus Food Plaza',
      icon: '🍕',
      comboType: 'social',
    });

    generatedQuests.push({
      id: `qm-quest-2-${timestamp}`,
      title: 'THE UNANIMOUS DECISION CHALLENGE',
      subtitle: 'Squad Synchrony',
      description: 'Your party must agree on one spontaneous activity without anyone saying "I don\'t know, whatever you want" more than once.',
      flavorText: 'Indecision is a level 50 curse. Break it with swift voting.',
      category: 'random',
      difficulty: 'hard',
      xpReward: 140,
      coinReward: 40,
      status: 'available',
      timeEstimateMinutes: 20,
      location: 'Squad Hangout Zone',
      icon: '⚔️',
      comboType: 'social',
    });
  } else if (isStudy) {
    generatedQuests.push({
      id: `qm-quest-study-${timestamp}`,
      title: 'HYPER-FOCUS SPELL: POMODORO BLITZ',
      subtitle: 'Arcane Academic Mastery',
      description: 'Put your phone in another room or across the desk and conquer 2 uninterrupted 25-minute study cycles.',
      flavorText: 'The Quest Master channels the ancient wisdom of undisturbed scholars.',
      category: 'main',
      difficulty: 'epic',
      xpReward: 250,
      coinReward: 70,
      status: 'available',
      timeEstimateMinutes: 50,
      location: 'Silent Sanctum',
      icon: '📖',
      comboType: 'productivity',
    });

    generatedQuests.push({
      id: `qm-quest-break-${timestamp}`,
      title: 'SYNAPSE RESET WALK',
      subtitle: 'Cognitive Recovery',
      description: 'Take a 10-minute walk without headphones to let your brain consolidate the newly learned material.',
      flavorText: 'Memory consolidation requires background GPU processing in real life.',
      category: 'recovery',
      difficulty: 'easy',
      xpReward: 80,
      coinReward: 20,
      status: 'available',
      timeEstimateMinutes: 10,
      location: 'Open Courtyard',
      icon: '🧠',
      comboType: 'wellness',
    });
  } else {
    // General creative adventure
    generatedQuests.push({
      id: `qm-quest-adventure-${timestamp}`,
      title: 'THE SPONTANEOUS ODYSSEY',
      subtitle: 'Quest Master Custom Order',
      description: `Based on your situation ("${prompt.slice(0, 60)}..."), break the loop of routine and do one thing completely out of character.`,
      flavorText: 'The dice have rolled in your favor. Step forth and claim your destiny.',
      category: 'exploration',
      difficulty: 'medium',
      xpReward: 190,
      coinReward: 55,
      status: 'available',
      timeEstimateMinutes: 30,
      location: 'Wherever Destiny Calls',
      icon: '✨',
      comboType: 'creative',
    });

    generatedQuests.push({
      id: `qm-quest-photo-${timestamp}`,
      title: 'CAPTURE THE ANOMALY',
      subtitle: 'Perception Challenge',
      description: 'Find something within 100 meters that 99% of people walk past every day without noticing.',
      flavorText: 'True adventurers see the magic hidden in everyday reality.',
      category: 'creative',
      difficulty: 'easy',
      xpReward: 110,
      coinReward: 30,
      status: 'available',
      timeEstimateMinutes: 15,
      location: 'Immediate Vicinity',
      icon: '📸',
      comboType: 'creative',
    });
  }

  return {
    questTitle: hasFriends ? 'THE SQUAD EXPEDITION' : 'THE CUSTOM HERO ODYSSEY',
    theme: 'Procedural Quest Master Dispatch',
    quests: generatedQuests,
    aiCommentary: `🧙 Quest Master: "I've analyzed your situation! Forget boring checklists — here are tailored quests crafted specifically for your energy, location, and party."`,
  };
}
