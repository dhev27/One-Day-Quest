# ONE DAY QUEST 🎮⚔️
### *Turn an ordinary day into an adventure.*

> **Hackathon Theme: “The Perfect Day”**  
> An RPG mini-adventure game for real life that turns mundane tasks into quests, focus dungeons, XP, streaks, level-ups, secret mysteries, and cosmetic loot.

---

## 🌟 Key Features

* **🛡️ Character Creation & Build Selector**: Configure your day by Energy (Low, Normal, High, Chaotic), Multi-select Focus Goals (Study, Project, Fitness, Social, Creative, Life Admin), Free Time, Budget, Location, and Solo/Party modes.
* **⚔️ RPG Quest Board**: Procedurally generated Boss Battles (*"Defeat The Final Boss"*), Side Quests (*"Knowledge Dungeon Sprint"*), Exploration Quests (*"Campus Fog of War"*), and Social/Recovery Quests.
* **🔒 Secret Vault**: Mystery quests locked beneath ancient seals that unlock dynamically when you conquer your day's momentum.
* **😈 Chaos Mode**: Optional spontaneous mode generating unhinged, safe challenges (trying strange snacks, taking bizarre photos, asking weird questions).
* **🗺️ Interactive Adventure Map**: Node-based journey tracker spanning from *Morning Threshold* through the *Knowledge Tower*, *Explorer's Grove*, *Citadel Climax*, to the *Night of Glory* with fog of war and lore inspector.
* **🧙 Quest Master AI**: Natural language prompt processor that transforms free-form situations (*e.g. "I have 2 hours free, ₹200, on campus with friends"*) into structured, playable RPG quest cards.
* **🪙 Bazaar Rewards Shop**: Spend Quest Coins on equippable cosmetic hats, neon shades, crowns, pet companions (*Pixel Cyber Cat, Flame Dragon*), elemental auras, and prestige titles.
* **🏆 Hall of Achievements**: 8+ achievement medals tracking milestones with live progress bars and bounties.
* **👤 Hero Character Sheet**: Level HUD, animated XP progress bar, attribute radar metrics, active cosmetic loadout, and customizable title selector.
* **🌙 End-of-Day Chronicle**: Final **Day Score (0–100)**, 5-dimension radar breakdown, spoils tally, conferred title (*“MAIN CHARACTER ENERGY”*), and share card.
* **🎬 Instant 1-Click Demo Mode**: Pre-loaded Level 6 profile with active quests and achievements for instant judge evaluation.
* **🔊 Web Audio Synthesizer**: Zero-delay procedural 8-bit sound engine for fanfares, level-up chimes, and coin dings.

---

## 🚀 Tech Stack

* **Frontend**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS, Custom RPG Typography (`Cinzel`, `Outfit`, `Space Grotesk`)
* **Icons & FX**: Lucide React, Canvas Confetti
* **Audio**: Native Web Audio API procedural synthesizer
* **Persistence**: LocalStorage with state serialization

---

## 🛠️ Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhev27/One-Day-Quest.git
   cd One-Day-Quest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🎮 How to Play

1. **Plan Your Build**: Click **START MY QUEST ⚔️** or launch **🎬 DEMO MODE**.
2. **Accept Quests**: Pick a quest card and begin your task.
3. **Use the Focus Chrono**: Open any quest detail to start the focus timer and tick off directive checklists.
4. **Gain XP & Coins**: Level up to ascend your hero class and buy gear in the shop.
5. **Conclude Nightfall**: Hit **Finish Day** to review your final score and claim your legendary title.
