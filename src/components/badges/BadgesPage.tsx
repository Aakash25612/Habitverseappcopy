import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Trophy, Star, Lock, Filter, Flame, Swords, Target, Zap, Calendar, Award, Shield, Medal } from 'lucide-react';
import { BadgeCard, Badge } from './BadgeCard';
import { SlotMeter } from './SlotMeter';
import { PrestigeConfirmationModal } from './PrestigeConfirmationModal';
import { SlotLimitModal } from './SlotLimitModal';
import { BadgeHistoryModal } from './BadgeHistoryModal';
import { MasteredHabitsTab } from './MasteredHabitsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';

interface BadgesPageProps {
  isInitialLoad?: boolean;
}

// Achievement Badge Type
interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedDate?: Date;
  progress?: { current: number; target: number };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'streaks' | 'challenges' | 'milestones' | 'special';
}

export function BadgesPage({ isInitialLoad = false }: BadgesPageProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'gold30' | 'prestige60' | 'locked'>('all');
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'streaks' | 'challenges' | 'milestones' | 'special'>('all');
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);
  const [showSlotLimitModal, setShowSlotLimitModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedBadgeForPrestige, setSelectedBadgeForPrestige] = useState<string | null>(null);
  const [selectedBadgeForHistory, setSelectedBadgeForHistory] = useState<Badge | null>(null);

  // Habit mastery badges - for Mastered tab
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 'workout-gold',
      type: 'gold30',
      habitId: 'workout',
      habitName: 'Morning Workout',
      habitIcon: '💪',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isFirstTime: true,
      canPushToPrestige: true
    },
    {
      id: 'reading-prestige',
      type: 'prestige60',
      habitId: 'reading',
      habitName: 'Daily Reading',
      habitIcon: '📚',
      isUnlocked: false,
      progress: { current: 18, target: 60 }
    },
    {
      id: 'meditation-gold',
      type: 'gold30',
      habitId: 'meditation',
      habitName: 'Meditation',
      habitIcon: '🧘',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      canPushToPrestige: true
    },
    {
      id: 'coding-prestige',
      type: 'prestige60',
      habitId: 'coding',
      habitName: 'Code Practice',
      habitIcon: '💻',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'water-locked',
      type: 'locked',
      habitId: 'water',
      habitName: 'Water Intake',
      habitIcon: '💧',
      isUnlocked: false,
      progress: { current: 12, target: 30 }
    },
    {
      id: 'journal-locked',
      type: 'locked',
      habitId: 'journal',
      habitName: 'Journaling',
      habitIcon: '📝',
      isUnlocked: false,
      progress: { current: 5, target: 30 }
    }
  ]);

  // Achievement badges - for Badges tab
  const [achievementBadges] = useState<AchievementBadge[]>([
    // Streak Badges
    {
      id: 'all-habits-once',
      name: 'Getting Started',
      description: 'Complete all habits once',
      icon: '🔥',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      rarity: 'common',
      category: 'streaks'
    },
    {
      id: 'streak-14',
      name: 'Week Warrior',
      description: 'Complete 14 days in a row',
      icon: '⚡',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      rarity: 'rare',
      category: 'streaks'
    },
    {
      id: 'streak-21',
      name: 'Three Week Titan',
      description: 'Complete 21 days in a row',
      icon: '💫',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      rarity: 'rare',
      category: 'streaks'
    },
    {
      id: 'streak-30',
      name: 'Month Master',
      description: 'Complete 30 days in a row',
      icon: '🌟',
      isUnlocked: false,
      progress: { current: 15, target: 30 },
      rarity: 'epic',
      category: 'streaks'
    },
    {
      id: 'streak-100',
      name: 'Century Legend',
      description: 'Complete 100 days in a row',
      icon: '👑',
      isUnlocked: false,
      progress: { current: 15, target: 100 },
      rarity: 'legendary',
      category: 'streaks'
    },
    // Challenge Badges
    {
      id: 'first-win',
      name: 'First Victory',
      description: 'Win your first 1v1 challenge',
      icon: '⚔️',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      rarity: 'common',
      category: 'challenges'
    },
    {
      id: 'win-5',
      name: 'Challenger',
      description: 'Win 5 1v1 challenges',
      icon: '🏆',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      rarity: 'rare',
      category: 'challenges'
    },
    {
      id: 'win-10',
      name: 'Champion',
      description: 'Win 10 1v1 challenges',
      icon: '🥇',
      isUnlocked: false,
      progress: { current: 6, target: 10 },
      rarity: 'epic',
      category: 'challenges'
    },
    {
      id: 'perfect-week',
      name: 'Flawless Week',
      description: 'Win 7 challenges in one week',
      icon: '💎',
      isUnlocked: false,
      progress: { current: 3, target: 7 },
      rarity: 'legendary',
      category: 'challenges'
    },
    // Milestone Badges
    {
      id: 'level-5',
      name: 'Rising Star',
      description: 'Reach Level 5',
      icon: '⭐',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      rarity: 'common',
      category: 'milestones'
    },
    {
      id: 'level-10',
      name: 'Double Digits',
      description: 'Reach Level 10',
      icon: '🎯',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      rarity: 'rare',
      category: 'milestones'
    },
    {
      id: 'level-20',
      name: 'Elite Status',
      description: 'Reach Level 20',
      icon: '🔱',
      isUnlocked: false,
      progress: { current: 13, target: 20 },
      rarity: 'epic',
      category: 'milestones'
    },
    {
      id: 'xp-10k',
      name: 'XP Collector',
      description: 'Earn 10,000 total XP',
      icon: '💰',
      isUnlocked: false,
      progress: { current: 5100, target: 10000 },
      rarity: 'rare',
      category: 'milestones'
    },
    {
      id: 'habit-slot-3',
      name: 'Habit Slot Unlocked',
      description: '3 days in a row - Unlock 3rd habit slot',
      icon: '🔓',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      rarity: 'rare',
      category: 'milestones'
    },
    {
      id: 'habit-slot-4',
      name: 'Master Organizer',
      description: '7 days in a row - Unlock 4th habit slot',
      icon: '🎁',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      rarity: 'epic',
      category: 'milestones'
    },
    // Special Badges
    {
      id: 'alliance-join',
      name: 'Team Player',
      description: 'Join your first alliance',
      icon: '🤝',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      rarity: 'common',
      category: 'special'
    },
    {
      id: 'beast-mode',
      name: 'Beast Unleashed',
      description: 'Activate Beast Mode for the first time',
      icon: '🦁',
      isUnlocked: true,
      unlockedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      rarity: 'rare',
      category: 'special'
    },
    {
      id: 'comeback',
      name: 'Comeback King',
      description: 'Return after missing a day and continue your journey',
      icon: '🎭',
      isUnlocked: false,
      rarity: 'rare',
      category: 'special'
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete all tasks before 8 AM',
      icon: '🌅',
      isUnlocked: false,
      progress: { current: 2, target: 5 },
      rarity: 'epic',
      category: 'special'
    }
  ]);

  const activeHabits = [
    { id: 'workout', name: 'Morning Workout', icon: '💪', streak: 45, canPause: true },
    { id: 'reading', name: 'Daily Reading', icon: '📚', streak: 18, canPause: true },
    { id: 'meditation', name: 'Meditation', icon: '🧘', streak: 67, canPause: true },
    { id: 'coding', name: 'Code Practice', icon: '💻', streak: 89, canPause: true }
  ];

  const currentActiveHabits = activeHabits.length;
  const maxActiveHabits = 4;

  // Filters for Mastered tab (habit badges)
  const masteredFilterChips = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'gold30', label: 'Gold 30', icon: Star },
    { id: 'prestige60', label: 'Prestige 60', icon: Trophy }
  ];

  // Filters for Badges tab (achievements)
  const achievementFilterChips = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'streaks', label: 'Streaks', icon: Flame },
    { id: 'challenges', label: 'Challenges', icon: Swords },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'special', label: 'Special', icon: Award }
  ];

  const filteredBadges = badges.filter(badge => {
    if (activeFilter === 'all') return true;
    return badge.type === activeFilter;
  });

  const filteredAchievements = achievementBadges.filter(badge => {
    if (achievementFilter === 'all') return true;
    return badge.category === achievementFilter;
  });

  // Sort badges: In Progress → Unlocked → Locked
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    if (a.progress && !a.isUnlocked && (!b.progress || b.isUnlocked)) return -1;
    if (b.progress && !b.isUnlocked && (!a.progress || a.isUnlocked)) return 1;
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (b.isUnlocked && !a.isUnlocked) return 1;
    return 0;
  });

  // Sort achievements: Unlocked first, then by rarity
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (!a.isUnlocked && b.isUnlocked) return 1;
    return 0;
  });

  const handlePushToPrestige = (badgeId: string) => {
    setSelectedBadgeForPrestige(badgeId);
    
    if (currentActiveHabits >= maxActiveHabits) {
      setShowSlotLimitModal(true);
    } else {
      setShowPrestigeModal(true);
    }
  };

  const handleStartPrestige = () => {
    const badge = badges.find(b => b.id === selectedBadgeForPrestige);
    if (!badge) return;

    // Create new prestige badge in progress
    const newPrestigeBadge: Badge = {
      id: `${badge.habitId}-prestige-${Date.now()}`,
      type: 'prestige60',
      habitId: badge.habitId,
      habitName: badge.habitName,
      habitIcon: badge.habitIcon,
      isUnlocked: false,
      progress: { current: 0, target: 60 }
    };

    setBadges(prev => [...prev, newPrestigeBadge]);
    toast.success('🏆 Prestige Challenge Started! 60 days to elite status.');
  };

  const handlePauseHabit = (habitId: string) => {
    // Remove from active habits
    toast.success('📱 Habit paused. You can resume anytime.');
    setShowSlotLimitModal(false);
    setTimeout(() => setShowPrestigeModal(true), 300);
  };

  const handleSetAsShowcase = (badgeId: string) => {
    toast.success('⭐ Badge set as profile showcase!');
  };

  const handleViewHistory = (badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    if (badge && badge.isUnlocked) {
      setSelectedBadgeForHistory(badge);
      setShowHistoryModal(true);
    } else {
      toast.info('📊 History only available for completed badges');
    }
  };

  const handleRemoveFromShelf = (badgeId: string) => {
    toast.success('🗑️ Badge removed from shelf');
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="px-6 pb-24">
        {/* Header */}
        <motion.div
          initial={isInitialLoad ? { opacity: 0, y: -20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8 mt-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-white font-bold text-xl">Badge Collection</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Premium achievements for your habit mastery
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="badges" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 gap-3 bg-transparent p-0">
            <TabsTrigger 
              value="badges" 
              className="h-14 data-[state=active]:bg-gradient-to-b data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_0_0_rgb(202,138,4),0_8px_16px_rgba(234,179,8,0.3)] data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-1 data-[state=inactive]:shadow-[0_2px_0_0_rgb(55,65,81)] bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400 rounded-xl transition-all duration-150 active:translate-y-1 active:shadow-[0_2px_0_0_rgb(202,138,4)]"
            >
              <Trophy className="w-5 h-5 mr-2 inline-block" />
              <span className="text-base">Badges</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mastered" 
              className="h-14 data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_0_0_rgb(107,33,168),0_8px_16px_rgba(147,51,234,0.3)] data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-1 data-[state=inactive]:shadow-[0_2px_0_0_rgb(55,65,81)] bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400 rounded-xl transition-all duration-150 active:translate-y-1 active:shadow-[0_2px_0_0_rgb(107,33,168)]"
            >
              <Star className="w-5 h-5 mr-2 inline-block" />
              <span className="text-base">Mastered</span>
            </TabsTrigger>
          </TabsList>

          {/* BADGES TAB - Achievement Badges */}
          <TabsContent value="badges" className="space-y-6 mt-6">
            {/* Description */}
            <motion.div
              initial={isInitialLoad ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">Achievement Badges</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Earn special badges for hitting streaks, winning challenges, reaching level milestones, and completing special achievements.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Achievement Filter Chips */}
            <motion.div
              initial={isInitialLoad ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-2 overflow-x-auto pb-2"
            >
              {achievementFilterChips.map((chip) => (
                <motion.button
                  key={chip.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAchievementFilter(chip.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all ${
                    achievementFilter === chip.id
                      ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <chip.icon className="w-3 h-3" />
                  {chip.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Achievement Badges Grid */}
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {sortedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    layout
                    initial={isInitialLoad ? { opacity: 0, scale: 0.9 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: isInitialLoad ? 0.3 + index * 0.05 : 0,
                      layout: { duration: 0.3 }
                    }}
                    className={`relative rounded-xl p-4 border-2 transition-all ${
                      achievement.isUnlocked
                        ? achievement.rarity === 'legendary'
                          ? 'bg-gradient-to-br from-pink-600/20 to-purple-600/20 border-pink-500/50'
                          : achievement.rarity === 'epic'
                          ? 'bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/50'
                          : achievement.rarity === 'rare'
                          ? 'bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/50'
                          : 'bg-gradient-to-br from-gray-700/40 to-gray-800/40 border-gray-600/50'
                        : 'bg-gray-800/30 border-gray-700/30'
                    }`}
                  >
                    {/* Rarity Badge */}
                    {achievement.isUnlocked && (
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                        achievement.rarity === 'legendary'
                          ? 'bg-pink-500/30 text-pink-300'
                          : achievement.rarity === 'epic'
                          ? 'bg-purple-500/30 text-purple-300'
                          : achievement.rarity === 'rare'
                          ? 'bg-blue-500/30 text-blue-300'
                          : 'bg-gray-500/30 text-gray-300'
                      }`}>
                        {achievement.rarity.toUpperCase()}
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`text-5xl mb-3 ${!achievement.isUnlocked && 'opacity-30 grayscale'}`}>
                      {achievement.icon}
                    </div>

                    {/* Name */}
                    <h4 className={`font-bold mb-1 text-sm ${
                      achievement.isUnlocked ? 'text-white' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </h4>

                    {/* Description */}
                    <p className={`text-xs mb-2 ${
                      achievement.isUnlocked ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {achievement.description}
                    </p>

                    {/* Progress or Date */}
                    {achievement.isUnlocked ? (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Trophy className="w-3 h-3" />
                        {achievement.unlockedDate?.toLocaleDateString()}
                      </div>
                    ) : achievement.progress ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{achievement.progress.current}/{achievement.progress.target}</span>
                          <span>{Math.round((achievement.progress.current / achievement.progress.target) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                          <div
                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(achievement.progress.current / achievement.progress.target) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600">Locked</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {sortedAchievements.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4">🏆</div>
                <p className="text-gray-400 text-sm">
                  No badges match your filter
                </p>
              </motion.div>
            )}
          </TabsContent>

          {/* MASTERED TAB - Habit Mastery Badges */}
          <TabsContent value="mastered" className="space-y-6 mt-6">
            {/* Description */}
            <motion.div
              initial={isInitialLoad ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">Habit Mastery</h3>
                  <p className="text-gray-300 text-xs leading-relaxed mb-2">
                    Master your habits and unlock special badges:
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-gray-300"><span className="text-yellow-400 font-bold">Gold 30:</span> Complete a habit 30 days in a row</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-gray-300"><span className="text-purple-400 font-bold">Prestige 60:</span> Complete a habit 60 days in a row</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Slot Meter */}
            <motion.div
              initial={isInitialLoad ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-[#181B22] border border-gray-700 rounded-xl p-4"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.12)' }}
            >
              <SlotMeter 
                current={currentActiveHabits} 
                max={maxActiveHabits}
              />
            </motion.div>

            {/* Filter Chips */}
            <motion.div
              initial={isInitialLoad ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-2 overflow-x-auto pb-2"
            >
              {masteredFilterChips.map((chip) => (
                <motion.button
                  key={chip.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(chip.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all ${
                    activeFilter === chip.id
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <chip.icon className="w-3 h-3" />
                  {chip.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Mastered Badges Grid */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {sortedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    layout
                    initial={isInitialLoad ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: isInitialLoad ? 0.3 + index * 0.1 : 0,
                      layout: { duration: 0.3 }
                    }}
                  >
                    <BadgeCard
                      badge={badge}
                      onPushToPrestige={handlePushToPrestige}
                      onSetAsShowcase={handleSetAsShowcase}
                      onViewHistory={handleViewHistory}
                      onRemoveFromShelf={handleRemoveFromShelf}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {sortedBadges.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-4xl mb-4">🏆</div>
                  <p className="text-gray-400 text-sm">
                    No mastered habits match your filter
                  </p>
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <PrestigeConfirmationModal
          isOpen={showPrestigeModal}
          onClose={() => setShowPrestigeModal(false)}
          onConfirm={handleStartPrestige}
          habitName={badges.find(b => b.id === selectedBadgeForPrestige)?.habitName || ''}
          currentActiveHabits={currentActiveHabits}
          maxActiveHabits={maxActiveHabits}
          canStart={currentActiveHabits < maxActiveHabits}
        />

        <SlotLimitModal
          isOpen={showSlotLimitModal}
          onClose={() => setShowSlotLimitModal(false)}
          activeHabits={activeHabits}
          onPauseHabit={handlePauseHabit}
        />

        <BadgeHistoryModal
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedBadgeForHistory(null);
          }}
          badge={selectedBadgeForHistory}
        />
      </div>
    </div>
  );
}