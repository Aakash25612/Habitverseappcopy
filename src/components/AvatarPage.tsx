import { motion } from 'motion/react';
import { useState } from 'react';
import { Zap, Crown, Trophy, Star, Target, ChevronRight, Award, Flame, Calendar, Sword } from 'lucide-react';
import { HeroCard } from './HeroCard';
import { RewardToast } from './RewardToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { OutfitBuilderModal } from './OutfitBuilderModal';
import { mockOutfitItems, mockAuras } from './outfits/mockData';
import { BadgesPage } from './badges/BadgesPage';
import { Button } from './ui/button';

interface AvatarPageProps {
  isInitialLoad?: boolean;
}

export function AvatarPage({ isInitialLoad = true }: AvatarPageProps) {
  const currentLevel = 13;
  const currentXP = 1650;
  const maxXP = 2050;
  
  const [showLevelUpToast, setShowLevelUpToast] = useState(false);
  const [showXPLevelsModal, setShowXPLevelsModal] = useState(false);
  const [showOutfitBuilder, setShowOutfitBuilder] = useState(false);
  const [showBadgesPage, setShowBadgesPage] = useState(false);
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);
  const [selectedHabitForPrestige, setSelectedHabitForPrestige] = useState<{ name: string; icon: string; id: string } | null>(null);

  // Outfit data
  const [outfitItems, setOutfitItems] = useState(mockOutfitItems);
  const [auras, setAuras] = useState(mockAuras);

  // XP Level System - New tier progression
  const xpLevels = [
    { level: 1, xpRequired: 0, tierName: 'Rookie', icon: Target, color: 'from-gray-500 to-gray-600' },
    { level: 2, xpRequired: 150, tierName: 'Rookie', icon: Target, color: 'from-gray-500 to-gray-600' },
    { level: 3, xpRequired: 350, tierName: 'Rookie', icon: Target, color: 'from-gray-500 to-gray-600' },
    { level: 4, xpRequired: 600, tierName: 'Rookie', icon: Target, color: 'from-gray-500 to-gray-600' },
    { level: 5, xpRequired: 900, tierName: 'Rookie', icon: Target, color: 'from-gray-500 to-gray-600' },
    { level: 6, xpRequired: 1250, tierName: 'Disciplined', icon: Star, color: 'from-blue-500 to-blue-600' },
    { level: 7, xpRequired: 1650, tierName: 'Disciplined', icon: Star, color: 'from-blue-500 to-blue-600' },
    { level: 8, xpRequired: 2100, tierName: 'Disciplined', icon: Star, color: 'from-blue-500 to-blue-600' },
    { level: 9, xpRequired: 2600, tierName: 'Disciplined', icon: Star, color: 'from-blue-500 to-blue-600' },
    { level: 10, xpRequired: 3150, tierName: 'Disciplined', icon: Star, color: 'from-blue-500 to-blue-600' },
    { level: 11, xpRequired: 3750, tierName: 'Champion', icon: Trophy, color: 'from-amber-500 to-amber-600' },
    { level: 12, xpRequired: 4400, tierName: 'Champion', icon: Trophy, color: 'from-amber-500 to-amber-600' },
    { level: 13, xpRequired: 5100, tierName: 'Champion', icon: Trophy, color: 'from-amber-500 to-amber-600' },
    { level: 14, xpRequired: 5850, tierName: 'Champion', icon: Trophy, color: 'from-amber-500 to-amber-600' },
    { level: 15, xpRequired: 6650, tierName: 'Champion', icon: Trophy, color: 'from-amber-500 to-amber-600' },
    { level: 16, xpRequired: 7500, tierName: 'Elite', icon: Zap, color: 'from-purple-500 to-purple-600' },
    { level: 17, xpRequired: 8400, tierName: 'Elite', icon: Zap, color: 'from-purple-500 to-purple-600' },
    { level: 18, xpRequired: 9350, tierName: 'Elite', icon: Zap, color: 'from-purple-500 to-purple-600' },
    { level: 19, xpRequired: 10350, tierName: 'Elite', icon: Zap, color: 'from-purple-500 to-purple-600' },
    { level: 20, xpRequired: 11400, tierName: 'Elite', icon: Zap, color: 'from-purple-500 to-purple-600' },
    { level: 21, xpRequired: 12500, tierName: 'Master', icon: Crown, color: 'from-orange-500 to-red-600' },
    { level: 22, xpRequired: 13650, tierName: 'Master', icon: Crown, color: 'from-orange-500 to-red-600' },
    { level: 23, xpRequired: 14850, tierName: 'Master', icon: Crown, color: 'from-orange-500 to-red-600' },
    { level: 24, xpRequired: 16100, tierName: 'Master', icon: Crown, color: 'from-orange-500 to-red-600' },
    { level: 25, xpRequired: 17400, tierName: 'Master', icon: Crown, color: 'from-orange-500 to-red-600' },
    { level: 26, xpRequired: 18750, tierName: 'Legend', icon: Crown, color: 'from-pink-500 to-purple-600' },
    { level: 27, xpRequired: 20150, tierName: 'Legend', icon: Crown, color: 'from-pink-500 to-purple-600' },
    { level: 28, xpRequired: 21600, tierName: 'Legend', icon: Crown, color: 'from-pink-500 to-purple-600' },
    { level: 29, xpRequired: 23100, tierName: 'Legend', icon: Crown, color: 'from-pink-500 to-purple-600' },
    { level: 30, xpRequired: 24650, tierName: 'Legend', icon: Crown, color: 'from-pink-500 to-purple-600' },
  ];

  const getCurrentTierInfo = () => {
    const currentLevelData = xpLevels.find(l => l.level === currentLevel);
    const nextLevelData = xpLevels.find(l => l.level === currentLevel + 1);
    return { currentLevelData, nextLevelData };
  };

  const getXPNeededForLevel = (targetLevel: number) => {
    const targetLevelData = xpLevels.find(l => l.level === targetLevel);
    if (!targetLevelData) return 0;
    return Math.max(0, targetLevelData.xpRequired - currentXP);
  };

  const simulateLevelUp = () => {
    setShowLevelUpToast(true);
  };

  const handleEquipOutfit = (equippedItems: any, equippedAura?: any) => {
    console.log('Outfit equipped:', equippedItems, equippedAura);
    // In a real app, this would update the user's equipped items in state/backend
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'radial-gradient(circle at center, #0B0B1D 0%, #000000 100%)'
    }}>
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-md mx-auto pb-24">
        
        <div className="px-6">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isInitialLoad ? 0.2 : 0.1, duration: 0.4 }}
            className="pt-12 mb-8"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: isInitialLoad ? 0.3 : 0.15, duration: 0.4 }}
                className="flex items-center justify-center gap-3 mb-2"
              >
                {/* Animated Trophy Icon */}
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                >
                  <Trophy className="w-8 h-8 text-amber-400" style={{
                    filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))'
                  }} />
                </motion.div>
                
                <h1 className="champion-title-glow text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent bg-[length:200%_auto] relative">
                  Level {currentLevel} {xpLevels.find(l => l.level === currentLevel)?.tierName}
                  
                  {/* Animated shine effect */}
                  <motion.div
                    animate={{
                      x: ['-200%', '200%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{
                      width: '50%',
                      filter: 'blur(8px)'
                    }}
                  />
                </h1>
                
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                    delay: 0.1
                  }}
                >
                  <Trophy className="w-8 h-8 text-amber-400" style={{
                    filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))'
                  }} />
                </motion.div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isInitialLoad ? 0.4 : 0.2, duration: 0.4 }}
                className="text-gray-400 text-sm tracking-wide leading-relaxed"
              >
                Unlock epic gear, earn legendary badges, and customize your warrior identity
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Hero Module */}
        <HeroCard 
          level={currentLevel}
          xp={currentXP}
          maxXp={maxXP}
          isInitialLoad={isInitialLoad}
          onAvatarClick={() => setShowOutfitBuilder(true)}
        />

        <div className="px-6">
          {/* Identity & Tier Section - Now Below Character */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isInitialLoad ? 0.8 : 0.4, duration: 0.4 }}
            className="mb-8"
          >
            {/* Enhanced Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isInitialLoad ? 0.9 : 0.45, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowXPLevelsModal(true)}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-purple-500/30 hover:bg-gray-800/70 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-lg font-bold">{xpLevels.find(l => l.level === currentLevel)?.tierName} Tier</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal from opening when clicking test button
                    simulateLevelUp();
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  Test Level Up
                </button>
              </div>

              {/* XP Progress Bar - Enhanced */}
              <div className="relative mb-4 pointer-events-none">
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentXP / maxXP) * 100}%` }}
                    transition={{ 
                      delay: isInitialLoad ? 1.1 : 0.55, 
                      duration: 1.2, 
                      ease: "easeOut" 
                    }}
                    className="h-full rounded-full relative"
                    style={{
                      background: 'linear-gradient(90deg, #7A3CFF, #B07CFF)',
                      boxShadow: '0 0 16px rgba(139, 92, 246, 0.4)'
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{ 
                        x: ['-100%', '100%'],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 0.9,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ width: '50%' }}
                    />
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-2">
                <div className="text-gray-300 font-mono font-medium group-hover:text-white transition-colors flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  {currentXP}/{maxXP} XP • Level {currentLevel} → Level {currentLevel + 1}
                  <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-gray-400 transition-colors" />
                </div>
              </div>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                Next Tier: 2 levels remaining
              </p>
              
              {/* Click indicator - always visible for mobile */}
              <div className="mt-3">
                <p className="text-purple-400 text-xs font-medium">Tap to view progression details</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Identity Showcase Section - Who You Are */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isInitialLoad ? 1.0 : 0.5, duration: 0.4 }}
            className="mt-8"
          >
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-bold text-xl">Your Legend</h2>
                <button 
                  onClick={() => setShowBadgesPage(true)}
                  className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
                >
                  View All →
                </button>
              </div>
              <p className="text-gray-400 text-sm">The habits you've conquered and the badges you've earned</p>
            </div>

            {/* Mastered Habits - Compact Cards */}
            <div className="mb-6">
              <h3 className="text-gray-300 font-semibold text-sm mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                Habits Conquered
              </h3>
              <div className="space-y-2">
                {/* Habit 1 - Morning Workout (Gold) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isInitialLoad ? 1.1 : 0.55, duration: 0.3 }}
                  className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-3 hover:bg-gray-800/70 hover:border-yellow-500/30 transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedHabitForPrestige({ name: 'Morning Workout', icon: '💪', id: 'workout-gold' });
                    setShowPrestigeModal(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#14161C]"
                        style={{
                          background: 'conic-gradient(from 0deg, #FBBF24, #F59E0B, transparent)',
                          padding: '2px',
                          boxShadow: '0 0 12px rgba(251, 191, 36, 0.2)'
                        }}
                      >
                        <div className="w-full h-full bg-[#14161C] rounded-full flex items-center justify-center">
                          💪
                        </div>
                      </div>
                      <motion.div
                        className="absolute -top-0.5 -right-0.5"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Crown className="w-3 h-3 text-yellow-400" />
                      </motion.div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-white font-semibold text-sm">Morning Workout</h4>
                        <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">30</span>
                      </div>
                      <p className="text-gray-500 text-xs">Mastered • 5 days ago</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </motion.div>

                {/* Habit 2 - Code Practice (Prestige) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isInitialLoad ? 1.2 : 0.6, duration: 0.3 }}
                  className="bg-gray-800/50 border border-purple-500/20 rounded-lg p-3 hover:bg-gray-800/70 hover:border-purple-500/30 transition-all cursor-pointer group"
                  onClick={() => {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#14161C]"
                        style={{
                          background: 'conic-gradient(from 0deg, #A855F7, #7A3CFF, transparent)',
                          padding: '2px',
                          boxShadow: '0 0 12px rgba(168, 85, 247, 0.2)'
                        }}
                      >
                        <div className="w-full h-full bg-[#14161C] rounded-full flex items-center justify-center">
                          💻
                        </div>
                      </div>
                      <motion.div
                        className="absolute -top-0.5 -right-0.5"
                        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Award className="w-3 h-3 text-purple-400" />
                      </motion.div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-white font-semibold text-sm">Code Practice</h4>
                        <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded">60</span>
                      </div>
                      <p className="text-gray-500 text-xs">Prestige • 2 days ago</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </motion.div>

                {/* Habit 3 - Meditation (Gold) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isInitialLoad ? 1.3 : 0.65, duration: 0.3 }}
                  className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-3 hover:bg-gray-800/70 hover:border-yellow-500/30 transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedHabitForPrestige({ name: 'Meditation', icon: '🧘', id: 'meditation-gold' });
                    setShowPrestigeModal(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#14161C]"
                        style={{
                          background: 'conic-gradient(from 0deg, #FBBF24, #F59E0B, transparent)',
                          padding: '2px',
                          boxShadow: '0 0 12px rgba(251, 191, 36, 0.2)'
                        }}
                      >
                        <div className="w-full h-full bg-[#14161C] rounded-full flex items-center justify-center">
                          🧘
                        </div>
                      </div>
                      <motion.div
                        className="absolute -top-0.5 -right-0.5"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        <Crown className="w-3 h-3 text-yellow-400" />
                      </motion.div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-white font-semibold text-sm">Meditation</h4>
                        <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">30</span>
                      </div>
                      <p className="text-gray-500 text-xs">Mastered • 12 days ago</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div>
              <h3 className="text-gray-300 font-semibold text-sm mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Achievement Badges
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Badge 1 - 7-Day Streak */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: isInitialLoad ? 1.4 : 0.7, duration: 0.3 }}
                  className="flex flex-col items-center"
                  onClick={() => setShowBadgesPage(true)}
                >
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-900/60 to-emerald-900/60 backdrop-blur-sm rounded-xl border-2 border-green-400/40 flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform">
                    <Calendar className="w-8 h-8 text-green-400" style={{
                      filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))'
                    }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  </div>
                  <p className="text-gray-400 text-xs mt-2 text-center">7-Day Streak</p>
                </motion.div>

                {/* Badge 2 - 14-Day Streak */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: isInitialLoad ? 1.5 : 0.75, duration: 0.3 }}
                  className="flex flex-col items-center"
                  onClick={() => setShowBadgesPage(true)}
                >
                  <div className="relative w-20 h-20 bg-gradient-to-br from-orange-900/60 to-red-900/60 backdrop-blur-sm rounded-xl border-2 border-orange-400/40 flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform">
                    <Flame className="w-8 h-8 text-orange-400" style={{
                      filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.6))'
                    }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  </div>
                  <p className="text-gray-400 text-xs mt-2 text-center">14-Day Streak</p>
                </motion.div>

                {/* Badge 3 - Perfect Week */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: isInitialLoad ? 1.6 : 0.8, duration: 0.3 }}
                  className="flex flex-col items-center"
                  onClick={() => setShowBadgesPage(true)}
                >
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-sm rounded-xl border-2 border-blue-400/40 flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform">
                    <Star className="w-8 h-8 text-blue-400 fill-current" style={{
                      filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))'
                    }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  </div>
                  <p className="text-gray-400 text-xs mt-2 text-center">Perfect Week</p>
                </motion.div>

                {/* Badge 4 - 30-Day Warrior */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: isInitialLoad ? 1.7 : 0.85, duration: 0.3 }}
                  className="flex flex-col items-center"
                  onClick={() => setShowBadgesPage(true)}
                >
                  <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-900/60 to-amber-900/60 backdrop-blur-sm rounded-xl border-2 border-yellow-400/40 flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform">
                    <Sword className="w-8 h-8 text-yellow-400" style={{
                      filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))'
                    }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  </div>
                  <p className="text-gray-400 text-xs mt-2 text-center">30-Day Warrior</p>
                </motion.div>

                {/* Badge 5 - Beast Mode */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: isInitialLoad ? 1.8 : 0.9, duration: 0.3 }}
                  className="flex flex-col items-center"
                  onClick={() => setShowBadgesPage(true)}
                >
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur-sm rounded-xl border-2 border-purple-400/40 flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform">
                    <Zap className="w-8 h-8 text-purple-400" style={{
                      filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))'
                    }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  </div>
                  <p className="text-gray-400 text-xs mt-2 text-center">Beast Mode</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Level Up Toast */}
      <RewardToast
        isVisible={showLevelUpToast}
        title={`Level ${currentLevel + 1} Unlocked!`}
        subtitle="You've reached a new milestone"
        onDismiss={() => setShowLevelUpToast(false)}
      />

      {/* Badges Page Modal */}
      {showBadgesPage && (
        <div className="fixed inset-0 z-50 bg-black">
          <BadgesPage isInitialLoad={false} />
          <button
            onClick={() => setShowBadgesPage(false)}
            className="fixed top-4 left-4 z-50 text-white bg-gray-800/80 hover:bg-gray-700/80 rounded-full p-2 backdrop-blur-sm border border-gray-600"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
        </div>
      )}

      {/* Prestige Confirmation Modal */}
      <Dialog open={showPrestigeModal} onOpenChange={setShowPrestigeModal}>
        <DialogContent className="max-w-md bg-gray-900 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Push to Prestige (60 Days)
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Take {selectedHabitForPrestige?.name} to the next level
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Habit Info */}
            <div className="bg-gray-800/50 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{selectedHabitForPrestige?.icon}</div>
                <div>
                  <h3 className="text-white font-bold">{selectedHabitForPrestige?.name}</h3>
                  <p className="text-gray-400 text-sm">Currently: 30-Day Master</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300">Gold Badge Earned</span>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <Target className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-yellow-300 font-semibold mb-1">Slot Warning</h4>
                  <p className="text-yellow-200/80 text-sm">
                    Pushing to Prestige will take up 1 habit slot for the next 30 days. You'll need to maintain this habit daily to earn the Prestige badge.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Prestige Rewards
              </h4>
              <ul className="space-y-2 text-sm text-purple-200/80">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Earn the exclusive Prestige (60) badge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Show your commitment to mastery</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPrestigeModal(false)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowPrestigeModal(false);
                // In real app, this would start the prestige journey
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white"
            >
              Start Prestige
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outfit Builder Modal */}
      <OutfitBuilderModal
        isOpen={showOutfitBuilder}
        onClose={() => setShowOutfitBuilder(false)}
        items={outfitItems.map(item => ({
          ...item,
          isLocked: item.levelRequired > currentLevel
        }))}
        auras={auras.map(aura => ({
          ...aura,
          isUnlocked: aura.level <= currentLevel
        }))}
        currentLevel={currentLevel}
        onEquipOutfit={handleEquipOutfit}
      />

      {/* XP Levels Modal */}
      <Dialog open={showXPLevelsModal} onOpenChange={setShowXPLevelsModal}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700 max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-400" />
              Level Progression System
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              View all levels, XP requirements, and tier progression paths
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {/* Current Level Highlight */}
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Level {currentLevel} - Current</h3>
                    <p className="text-purple-300 text-sm">{getCurrentTierInfo().currentLevelData?.tierName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono font-bold">{currentXP.toLocaleString()} XP</p>
                  <p className="text-purple-300 text-xs">You are here</p>
                </div>
              </div>
            </div>

            {/* Next Level */}
            {getCurrentTierInfo().nextLevelData && (
              <div className="bg-gradient-to-r from-amber-600/20 to-amber-700/20 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Level {currentLevel + 1} - Next</h3>
                      <p className="text-amber-300 text-sm">{getCurrentTierInfo().nextLevelData?.tierName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono font-bold">{getCurrentTierInfo().nextLevelData?.xpRequired.toLocaleString()} XP</p>
                    <p className="text-amber-300 text-xs font-bold">
                      {getXPNeededForLevel(currentLevel + 1).toLocaleString()} XP needed
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* All Levels Scrollable List */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg">
              <div className="p-3 border-b border-gray-700/50">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  All Levels & Tiers
                </h4>
              </div>
              
              <div className="max-h-64 overflow-y-auto p-3 space-y-2">
                {xpLevels.map((levelData, index) => {
                  const Icon = levelData.icon;
                  const isCurrentLevel = levelData.level === currentLevel;
                  const isCompleted = currentXP >= levelData.xpRequired;
                  const xpNeeded = getXPNeededForLevel(levelData.level);
                  
                  return (
                    <motion.div
                      key={levelData.level}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isCurrentLevel 
                          ? 'bg-purple-600/20 border border-purple-500/30' 
                          : isCompleted 
                            ? 'bg-green-600/10 border border-green-500/20' 
                            : 'bg-gray-700/30 border border-gray-600/30 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${levelData.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${
                              isCurrentLevel ? 'text-purple-300' : isCompleted ? 'text-green-300' : 'text-gray-300'
                            }`}>
                              Level {levelData.level}
                            </span>
                            {isCurrentLevel && (
                              <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                Current
                              </span>
                            )}
                            {isCompleted && !isCurrentLevel && (
                              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${
                            isCurrentLevel ? 'text-purple-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                          }`}>
                            {levelData.tierName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-mono text-sm font-bold ${
                          isCurrentLevel ? 'text-purple-300' : isCompleted ? 'text-green-300' : 'text-gray-400'
                        }`}>
                          {levelData.xpRequired.toLocaleString()} XP
                        </p>
                        {!isCompleted && (
                          <p className="text-xs text-gray-500 font-medium">
                            {xpNeeded.toLocaleString()} needed
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Tier Legend */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3">
              <h4 className="text-white font-medium mb-3 text-sm">Tier System</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                    <Target className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-gray-300">Rookie (1-5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-gray-300">Disciplined (6-10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                    <Trophy className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-gray-300">Champion (11-15)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Zap className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-gray-300">Elite (16-20)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <Crown className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-gray-300">Master (21-25)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Crown className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-gray-300">Legend (26-30)</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}