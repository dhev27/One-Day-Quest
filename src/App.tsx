import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { LevelUpModal } from './components/LevelUpModal';
import { RandomEventModal } from './components/RandomEventModal';
import { SecretUnlockedModal } from './components/SecretUnlockedModal';
import { QuestCompleteCelebration } from './components/QuestCompleteCelebration';
import { QuestMasterModal } from './components/QuestMasterModal';

// Screens
import { LandingScreen } from './screens/LandingScreen';
import { PlayerSetupScreen } from './screens/PlayerSetupScreen';
import { GeneratingScreen } from './screens/GeneratingScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { AdventureMapScreen } from './screens/AdventureMapScreen';
import { ShopScreen } from './screens/ShopScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { EndOfDayScreen } from './screens/EndOfDayScreen';

const MainAppContent: React.FC = () => {
  const { currentScreen } = useGame();
  const [questMasterOpen, setQuestMasterOpen] = useState<boolean>(false);

  const showNavbar = !['landing', 'setup', 'generating', 'end_day'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-['Outfit',sans-serif]">
      {showNavbar && <Navbar onOpenQuestMaster={() => setQuestMasterOpen(true)} />}

      <main className="flex-1">
        {currentScreen === 'landing' && <LandingScreen />}
        {currentScreen === 'setup' && <PlayerSetupScreen />}
        {currentScreen === 'generating' && <GeneratingScreen />}
        {currentScreen === 'dashboard' && (
          <DashboardScreen onOpenQuestMaster={() => setQuestMasterOpen(true)} />
        )}
        {currentScreen === 'map' && <AdventureMapScreen />}
        {currentScreen === 'shop' && <ShopScreen />}
        {currentScreen === 'achievements' && <AchievementsScreen />}
        {currentScreen === 'profile' && <ProfileScreen />}
        {currentScreen === 'end_day' && <EndOfDayScreen />}
      </main>

      {/* Global Modals & Notifications */}
      <LevelUpModal />
      <RandomEventModal />
      <SecretUnlockedModal />
      <QuestCompleteCelebration />
      <QuestMasterModal
        isOpen={questMasterOpen}
        onClose={() => setQuestMasterOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}

export default App;
