import { DaySetup, MapNode, Quest, VibeType, EnergyLevel, PriorityLevel } from '../types/quest';

const THEME_NAMES = [
  'Operation: Get Your Life Together',
  'The Day of Small Wins',
  'The Main Character Day',
  'Campus Chaos & Glory',
  'The Productivity Rebellion',
  'The Coffee Alchemist Odyssey',
  'The Weekend Conquest',
  'The Procrastination Extinction Event',
  'Midnight Marauder Chronicles',
  'Urban Explorer: The Hidden Realm',
];

export function getRandomDayTheme(): string {
  return THEME_NAMES[Math.floor(Math.random() * THEME_NAMES.length)];
}

export function parseFreeTimeToMinutes(freeTime: DaySetup['freeTime'], customMinutes?: number): number {
  if (customMinutes && customMinutes > 0) return customMinutes;

  if (typeof freeTime === 'number') return Math.max(15, freeTime);

  const normalized = String(freeTime || '2h').toLowerCase().trim();
  const hourMatch = normalized.match(/(\d+(?:\.\d+)?)h/);
  const minuteMatch = normalized.match(/(\d+(?:\.\d+)?)m/);
  const digitMatch = normalized.match(/(\d+(?:\.\d+)?)/);

  if (hourMatch || minuteMatch || digitMatch) {
    const hours = hourMatch ? Number(hourMatch[1]) : 0;
    const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
    const parsed = Math.round(hours * 60 + minutes);
    if (parsed > 0) return parsed;
  }

  switch (normalized) {
    case '15m': return 15;
    case '30m': return 30;
    case '45m': return 45;
    case '1h': return 60;
    case '1h 30m':
    case '90m': return 90;
    case '2h': return 120;
    case '3h': return 180;
    case '4h+': return 240;
    case 'custom': return customMinutes || 60;
    default:
      if (normalized.includes('h')) {
        const hours = Number(normalized.replace(/[^\d.]/g, '')) || 1;
        return Math.round(hours * 60);
      }
      if (normalized.includes('m')) {
        const minutes = Number(normalized.replace(/[^\d.]/g, '')) || 30;
        return Math.round(minutes);
      }
      return 120;
  }
}

// Parse free-form user task input into discrete quest objects
export function parseUserTasksInput(text: string): Quest[] {
  if (!text || !text.trim()) return [];

  // Split by newlines or commas or bullets
  const lines = text
    .split(/[\n,;•]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 2);

  return lines.map((line, idx) => {
    const cleanTitle = line.replace(/^[-\d.)\s]+/, '').trim();
    let category: Quest['category'] = 'personal';
    let icon = '🎯';
    let duration = 45;
    let priority: PriorityLevel = 'important';
    let energy: EnergyLevel = 'medium';

    const lower = cleanTitle.toLowerCase();
    if (lower.includes('study') || lower.includes('assign') || lower.includes('dsa') || lower.includes('exam') || lower.includes('read') || lower.includes('code')) {
      category = 'study';
      icon = '📚';
      duration = 45;
      priority = 'important';
      energy = 'medium';
    } else if (lower.includes('volleyball') || lower.includes('workout') || lower.includes('gym') || lower.includes('run') || lower.includes('walk') || lower.includes('fitness')) {
      category = 'fitness';
      icon = '🏐';
      duration = 45;
      priority = 'normal';
      energy = 'high';
    } else if (lower.includes('mom') || lower.includes('call') || lower.includes('friend') || lower.includes('meet') || lower.includes('text')) {
      category = 'social';
      icon = '💬';
      duration = 30;
      priority = 'important';
      energy = 'low';
    } else if (lower.includes('clean') || lower.includes('desk') || lower.includes('room') || lower.includes('wash') || lower.includes('laundry')) {
      category = 'chores';
      icon = '🧹';
      duration = 30;
      priority = 'normal';
      energy = 'low';
    } else if (lower.includes('episode') || lower.includes('watch') || lower.includes('game') || lower.includes('movie') || lower.includes('anime')) {
      category = 'fun';
      icon = '🎮';
      duration = 45;
      priority = 'chill';
      energy = 'low';
    }

    const xp = Math.min(250, Math.max(50, duration * 2 + (priority === 'must_do' ? 50 : 25)));
    const coins = Math.round(xp * 0.3);

    return {
      id: `user-task-${Date.now()}-${idx}`,
      title: cleanTitle.toUpperCase(),
      subtitle: 'Your Personal Objective',
      description: `Complete your self-assigned task: "${cleanTitle}".`,
      flavorText: 'A warrior defines their own battlefield.',
      category,
      difficulty: duration >= 60 ? 'hard' : duration >= 45 ? 'medium' : 'easy',
      priority,
      energyRequired: energy,
      xpReward: xp,
      coinReward: coins,
      status: 'available',
      isUserCreated: true,
      timeEstimateMinutes: duration,
      icon,
      comboType: category === 'study' ? 'productivity' : category === 'social' ? 'social' : 'wellness',
      customReward: 'Sense of glory & free time unlocked',
    };
  });
}

export function extractGoalsFromText(text: string): string[] {
  if (!text || !text.trim()) return [];

  const lines = text
    .split(/[\n,;•]+/)
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter((line) => line.length > 2);

  return lines.slice(0, 6);
}

// Pool of smart suggestions categorized by vibe and duration
export interface SuggestionTemplate {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  flavorText: string;
  category: Quest['category'];
  duration: number; // in minutes
  energy: EnergyLevel;
  vibe: VibeType[];
  icon: string;
  priority: PriorityLevel;
  reason: string;
}

const SUGGESTION_POOL: SuggestionTemplate[] = [
  {
    id: 'sug-walk-20',
    title: 'THE 20-MINUTE UNPLUGGED EXPEDITION',
    subtitle: 'Outdoor Vitality',
    description: 'Go for a 20-minute walk outside without checking phone notifications.',
    flavorText: 'Natural sunlight restores 40% of baseline mental mana.',
    category: 'fitness',
    duration: 20,
    energy: 'low',
    vibe: ['chill', 'low_energy', 'surprise', 'productive'],
    icon: '🚶',
    priority: 'normal',
    reason: 'You have a small remaining window and your energy is light, so this keeps momentum without draining you.',
  },
  {
    id: 'sug-focus-sprint',
    title: 'KNOWLEDGE DUNGEON FOCUS SPRINT',
    subtitle: 'High Velocity Deep Work',
    description: 'Conquer 45 minutes of pure uninterrupted deep focus on your hardest study/work item.',
    flavorText: 'The distraction monster is powerless against a ticking chrono.',
    category: 'study',
    duration: 45,
    energy: 'high',
    vibe: ['productive', 'energetic'],
    icon: '📚',
    priority: 'important',
    reason: 'You have enough time for a focused block and your current vibe leans productive.',
  },
  {
    id: 'sug-room-reset',
    title: 'THE 15-MINUTE SANCTUARY RESET',
    subtitle: 'Environment Clarity',
    description: 'Clear desk clutter, make the bed, and organize your work arena.',
    flavorText: 'An orderly chamber grants +20% focus aura.',
    category: 'chores',
    duration: 15,
    energy: 'low',
    vibe: ['chill', 'low_energy', 'productive', 'surprise'],
    icon: '🧹',
    priority: 'normal',
    reason: 'This is a light win that fits your remaining time without forcing a bigger task.',
  },
  {
    id: 'sug-stretch-meditate',
    title: 'HP POTION & 15-MIN MINDFUL REST',
    subtitle: 'Stamina Reboot',
    description: 'Drink a tall glass of cold water and do full-body stretches or breathing.',
    flavorText: 'Cooldown phases prevent hero burnouts.',
    category: 'recovery',
    duration: 15,
    energy: 'low',
    vibe: ['chill', 'low_energy', 'surprise'],
    icon: '🧘',
    priority: 'chill',
    reason: 'You have low energy and only a short window left, so this is a realistic recovery action.',
  },
  {
    id: 'sug-social-npc',
    title: 'NPC ENCOUNTER: SEND A WHOLESOME MEME',
    subtitle: 'Squad Synchrony',
    description: 'Text a friend or family member a meme or quick check-in.',
    flavorText: 'Party morale directly boosts daily luck stats.',
    category: 'social',
    duration: 10,
    energy: 'low',
    vibe: ['chill', 'energetic', 'surprise'],
    icon: '💬',
    priority: 'chill',
    reason: 'There is a brief pocket of time left and a quick social reset fits your current pace.',
  },
  {
    id: 'sug-creative-doodle',
    title: 'THE 20-MINUTE CREATIVE SPARK',
    subtitle: 'Artistic Alchemy',
    description: 'Sketch, write, record, or create something original for 20 minutes without judging the result.',
    flavorText: 'Creation is magic cast into the physical realm.',
    category: 'creative',
    duration: 20,
    energy: 'medium',
    vibe: ['productive', 'energetic', 'surprise'],
    icon: '🎨',
    priority: 'normal',
    reason: 'You still have a creative window and this fits a moderate energy level without overloading the plan.',
  },
  {
    id: 'sug-campus-explore',
    title: 'CAMPUS FOG OF WAR: UNCHARTED ROUTE',
    subtitle: 'Exploration Discovery',
    description: 'Take a completely different path or enter a building you never visited.',
    flavorText: '80% of your surroundings remain undocumented in your memory.',
    category: 'exploration',
    duration: 30,
    energy: 'medium',
    vibe: ['energetic', 'surprise'],
    icon: '🧭',
    priority: 'normal',
  },
  {
    id: 'sug-power-workout',
    title: 'TITAN STRENGTH CHALLENGE',
    subtitle: 'Physical Ascendance',
    description: 'Hit a solid workout or 3 sets of pushups, squats & core.',
    flavorText: 'Physical training forges unbreakable resolve.',
    category: 'fitness',
    duration: 45,
    energy: 'high',
    vibe: ['energetic', 'productive'],
    icon: '⚡',
    priority: 'important',
  },
];

export function generateSmartSuggestions(
  remainingMinutes: number,
  vibe: VibeType = 'productive',
  rejectedIds: string[] = [],
  energy: 'low' | 'normal' | 'high' | 'chaotic' = 'normal',
  existingTasks: Quest[] = []
): Quest[] {
  let pool = SUGGESTION_POOL.filter((item) => !rejectedIds.includes(item.id));
  if (pool.length === 0) pool = SUGGESTION_POOL;

  const usedMinutes = existingTasks.reduce((sum, item) => sum + (item.timeEstimateMinutes || 0), 0);
  const effectiveRemaining = Math.max(10, Math.min(remainingMinutes, Math.max(15, 180 - usedMinutes)));

  let candidates = pool.filter((item) => {
    if (item.duration > effectiveRemaining + 20) return false;
    if (vibe === 'low_energy' && item.energy === 'high') return false;
    if (vibe === 'energetic' && item.energy === 'low') return false;
    if (energy === 'low' && item.energy === 'high') return false;
    if (energy === 'high' && item.energy === 'low') return false;
    return true;
  });

  if (candidates.length < 2) {
    candidates = pool.filter((item) => item.duration <= Math.max(effectiveRemaining + 30, 30));
  }

  const shuffled = [...candidates].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(3, shuffled.length));

  return selected.map((sug) => {
    const xp = sug.duration >= 45 ? 120 : sug.duration >= 20 ? 80 : 55;
    const coins = Math.round(xp * 0.3);

    return {
      id: `sug-${sug.id}-${Date.now()}`,
      title: sug.title,
      subtitle: sug.subtitle,
      description: sug.description,
      flavorText: sug.flavorText,
      category: sug.category,
      difficulty: sug.duration >= 45 ? 'medium' : 'easy',
      priority: sug.priority,
      energyRequired: sug.energy,
      xpReward: xp,
      coinReward: coins,
      status: 'available',
      isSuggestion: true,
      timeEstimateMinutes: sug.duration,
      icon: sug.icon,
      comboType: sug.category === 'fitness' ? 'wellness' : 'productivity',
      reason: sug.reason,
    };
  });
}

export function generateQuestsForDay(setup: DaySetup): {
  userQuests: Quest[];
  suggestedQuests: Quest[];
  mapNodes: MapNode[];
  theme: string;
} {
  const theme = setup.dayThemeName || getRandomDayTheme();
  const totalMinutes = setup.totalAvailableMinutes || parseFreeTimeToMinutes(setup.freeTime, setup.customMinutes);

  // 1. Parse User's own tasks first
  const userQuests = parseUserTasksInput(setup.userCustomTasksInput);

  // Calculate used time by user quests
  const userMinutesUsed = userQuests.reduce((sum, q) => sum + (q.timeEstimateMinutes || 45), 0);
  const remainingMinutes = Math.max(0, totalMinutes - userMinutesUsed);

  // 2. Generate smart suggestions fitting the remaining time & vibe
  const suggestedQuests = generateSmartSuggestions(remainingMinutes, setup.vibe);

  // 3. Map Nodes
  const mapNodes: MapNode[] = [
    {
      id: 'node-1',
      name: 'MORNING THRESHOLD',
      subtitle: 'Rise & Prepare',
      icon: '🌅',
      type: 'gate',
      status: 'completed',
      xpReward: 40,
      lore: 'The gate to today has opened. Step into the arena.',
    },
    {
      id: 'node-2',
      name: 'HERO’S FOCUS TOWER',
      subtitle: 'Primary Task Chamber',
      icon: '📚',
      type: 'dungeon',
      status: 'current',
      xpReward: 100,
      lore: 'High towers of concentration where excuses are slain.',
    },
    {
      id: 'node-3',
      name: 'REST OASIS',
      subtitle: 'HP & Stamina Refill',
      icon: '💧',
      type: 'camp',
      status: 'locked',
      xpReward: 60,
      lore: 'Cool spring water and moment of recovery.',
    },
    {
      id: 'node-4',
      name: 'CITADEL CLIMAX',
      subtitle: 'Day Conquest',
      icon: '🏰',
      type: 'boss',
      status: 'locked',
      xpReward: 250,
      lore: 'The climax of your day. Victory and XP await.',
    },
    {
      id: 'node-5',
      name: 'NIGHT OF GLORY',
      subtitle: 'Tavern Celebration & Score',
      icon: '🌙',
      type: 'kingdom',
      status: 'locked',
      xpReward: 100,
      lore: 'Tally your coins, review your score, and rest well.',
    },
  ];

  return { userQuests, suggestedQuests, mapNodes, theme };
}
