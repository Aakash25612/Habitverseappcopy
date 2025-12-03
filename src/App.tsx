import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { XPProgressBar } from './components/XPProgressBar';
import { BeastModeCard } from './components/BeastModeCard';
import { StatsGrid } from './components/StatsGrid';
import { QuoteCard } from './components/QuoteCard';
import { TodaysProgress } from './components/TodaysProgress';
import { WhySection } from './components/WhySection';
import { FeedbackSection } from './components/FeedbackSection';
import { HabitsPage } from './components/HabitsPage';
import { AlliancePage } from './components/AlliancePage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { AvatarPage } from './components/AvatarPage';
import { BottomNavigation } from './components/BottomNavigation';
import { PageTransition } from './components/PageTransition';
import { LevelUpCelebration } from './components/LevelUpCelebration';
import { LoginModal } from './components/LoginModal';
import { LoginRewardCelebration } from './components/LoginRewardCelebration';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { WelcomeBackRewardCelebration } from './components/WelcomeBackRewardCelebration';
import { Toaster } from './components/ui/sonner';


export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'habits' | 'alliance' | 'avatar' | 'analytics'>('home');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(8);
  
  // Login System States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLoginReward, setShowLoginReward] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [showWelcomeBackReward, setShowWelcomeBackReward] = useState(false);
  const [welcomeBackXPGained, setWelcomeBackXPGained] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(true); // Start as returning user for demo
  const [loginDay, setLoginDay] = useState(1);
  const [userXP, setUserXP] = useState(1200); // Starting XP
  const [justCompletedWelcomeBack, setJustCompletedWelcomeBack] = useState(false);
  const [loginStreak, setLoginStreak] = useState(5); // Current consecutive login streak for demo
  
  // 30-day progress tracking
  const [currentJourneyDay, setCurrentJourneyDay] = useState(5); // Day 5 for demo
  const [completedDays, setCompletedDays] = useState([1, 2, 3, 4]); // Days 1-4 already completed

  // Calculate progressive XP based on login streak (10 XP day 1, 200 XP day 30)
  const calculateStreakXP = (streak: number) => {
    const clampedStreak = Math.max(1, Math.min(30, streak)); // Clamp between 1-30
    return Math.floor(10 + (clampedStreak - 1) * (190 / 29));
  };

  // Show appropriate modal when app loads
  useEffect(() => {
    // Small delay to let the app render first
    const timer = setTimeout(() => {
      if (isReturningUser) {
        // Returning user - show welcome back with calendar
        setShowWelcomeBack(true);
        setIsLoggedIn(true);
      } else {
        // New user - show login modal
        setShowLoginModal(true);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []); // Remove dependency to prevent infinite loops

  const handlePageChange = (page: 'home' | 'habits' | 'alliance' | 'avatar' | 'analytics') => {
    setCurrentPage(page);
    setIsInitialLoad(false);
  };

  const handleLevelUpDemo = () => {
    setCurrentLevel(prev => prev + 1);
    setShowLevelUp(true);
  };

  const handleLevelUpComplete = () => {
    setShowLevelUp(false);
  };

  // Login Flow Handlers
  const handleLoginSuccess = (day: number) => {
    setLoginDay(day);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    
    // Small delay before showing reward celebration
    setTimeout(() => {
      setShowLoginReward(true);
    }, 500);
  };

  const handleLoginRewardComplete = () => {
    setShowLoginReward(false);
    
    // Add XP based on login day
    const dailyXPRewards = [100, 150, 200, 250, 300, 350, 500];
    const xpGain = dailyXPRewards[loginDay - 1] || 100;
    
    setUserXP(prev => {
      const newXP = prev + xpGain;
      const newLevel = Math.floor(newXP / 1500) + 1; // Level up every 1500 XP
      
      if (newLevel > currentLevel) {
        setCurrentLevel(newLevel);
        setTimeout(() => {
          setShowLevelUp(true);
        }, 1000);
      }
      
      return newXP;
    });
  };

  // Welcome Back Modal Handlers
  const handleWelcomeBackClose = () => {
    setShowWelcomeBack(false);
  };

  const handleWelcomeBackReward = () => {
    // Progressive XP based on login streak
    const loginBonus = calculateStreakXP(loginStreak);
    setWelcomeBackXPGained(loginBonus);
    
    // Increment streak for consecutive login
    setLoginStreak(prev => prev + 1);
    
    // Close welcome back modal and show celebration
    setShowWelcomeBack(false);
    setTimeout(() => {
      setShowWelcomeBackReward(true);
    }, 300);
  };

  const handleWelcomeBackRewardComplete = () => {
    setShowWelcomeBackReward(false);
    setJustCompletedWelcomeBack(true); // Set flag for guidance
    
    // Mark current day as completed
    setCompletedDays(prev => [...prev, currentJourneyDay]);
    
    // Add XP and check for level up
    setUserXP(prev => {
      const newXP = prev + welcomeBackXPGained;
      const newLevel = Math.floor(newXP / 1500) + 1;
      
      if (newLevel > currentLevel) {
        setCurrentLevel(newLevel);
        setTimeout(() => {
          setShowLevelUp(true);
        }, 1000);
      }
      
      return newXP;
    });
    
    // Clear the flag after a few seconds
    setTimeout(() => {
      setJustCompletedWelcomeBack(false);
    }, 8000);
  };

  // Toggle between new user and returning user for demo
  const toggleUserType = () => {
    const newUserType = !isReturningUser;
    setIsReturningUser(newUserType);
    setIsLoggedIn(false);
    setShowWelcomeBack(false);
    setShowWelcomeBackReward(false);
    setShowLoginModal(false);
    
    // Reset and trigger appropriate modal
    setTimeout(() => {
      if (newUserType) {
        // Now a returning user
        setShowWelcomeBack(true);
        setIsLoggedIn(true);
      } else {
        // Now a new user
        setShowLoginModal(true);
      }
    }, 500);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'habits':
        return (
          <PageTransition pageKey="habits">
            <HabitsPage isInitialLoad={isInitialLoad} loginStreak={loginStreak} />
          </PageTransition>
        );
      case 'alliance':
        return (
          <PageTransition pageKey="alliance">
            <AlliancePage isInitialLoad={isInitialLoad} userXP={userXP} userLevel={currentLevel} />
          </PageTransition>
        );
      case 'analytics':
        return (
          <PageTransition pageKey="analytics">
            <AnalyticsPage 
              isInitialLoad={isInitialLoad}
              loginStreak={loginStreak}
              totalXP={userXP}
              level={currentLevel}
              isInAlliance={true}
            />
          </PageTransition>
        );
      case 'avatar':
        return (
          <PageTransition pageKey="avatar">
            <AvatarPage isInitialLoad={isInitialLoad} />
          </PageTransition>
        );
      case 'home':
      default:
        return (
          <PageTransition pageKey="home">
            <div className="min-h-screen relative overflow-hidden" style={{
              background: 'radial-gradient(circle at center, #0B0B1D 0%, #000000 100%)'
            }}>
              {/* Main content */}
              <div className="relative z-10 max-w-md mx-auto px-6 pt-12 pb-24">
                <Header 
                  isInitialLoad={isInitialLoad} 
                  onLevelUpDemo={handleLevelUpDemo}
                  level={currentLevel}
                  currentXP={userXP}
                />
                <XPProgressBar 
                  isInitialLoad={isInitialLoad}
                  onLevelUp={() => setShowLevelUp(true)}
                  currentXP={userXP}
                  level={currentLevel}
                />
                <BeastModeCard isInitialLoad={isInitialLoad} />
                <StatsGrid 
                  isInitialLoad={isInitialLoad} 
                  loginStreak={loginStreak}
                  totalXP={userXP}
                  level={currentLevel}
                />
                <QuoteCard isInitialLoad={isInitialLoad} />
                <TodaysProgress 
                  isInitialLoad={isInitialLoad} 
                  onNavigateToHabits={() => handlePageChange('habits')}
                  showGuidanceHint={justCompletedWelcomeBack}
                />
                <WhySection isInitialLoad={isInitialLoad} />
                <FeedbackSection isInitialLoad={isInitialLoad} />
              </div>

              {/* Level Up Celebration */}
              <LevelUpCelebration
                isActive={showLevelUp}
                level={currentLevel}
                onComplete={handleLevelUpComplete}
              />
            </div>
          </PageTransition>
        );
    }
  };

  return (
    <div className="relative min-h-screen" style={{backgroundColor: '#000000'}}>

      {renderCurrentPage()}

      <BottomNavigation currentPage={currentPage as any} onPageChange={handlePageChange as any} />

      {/* Login System */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <LoginRewardCelebration
        isActive={showLoginReward}
        loginDay={loginDay}
        onComplete={handleLoginRewardComplete}
      />

      {/* Welcome Back Modal for Returning Users */}
      <WelcomeBackModal
        isOpen={showWelcomeBack}
        onClose={handleWelcomeBackClose}
        currentDay={currentJourneyDay}
        completedDays={completedDays}
        onClaimReward={handleWelcomeBackReward}
        streakXP={calculateStreakXP(loginStreak)}
        currentStreak={loginStreak}
      />

      {/* Welcome Back Reward Celebration */}
      <WelcomeBackRewardCelebration
        isActive={showWelcomeBackReward}
        currentDay={currentJourneyDay}
        xpGained={welcomeBackXPGained}
        streak={completedDays.length + 1}
        completionPercentage={Math.round(((completedDays.length + 1) / 30) * 100)}
        onComplete={handleWelcomeBackRewardComplete}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}