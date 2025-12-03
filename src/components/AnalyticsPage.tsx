import { motion } from 'motion/react';
import { useState } from 'react';
import { BarChart3, ChevronDown, Flame, Star, Zap, TrendingUp, Users, Crown, Swords, Share2 } from 'lucide-react';
import { ShareHabitsModal } from './ShareHabitsModal';

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface CompletionRate {
  period: string;
  percentage: number;
}

interface AnalyticsPageProps {
  isInitialLoad?: boolean;
  loginStreak?: number;
  totalXP?: number;
  level?: number;
  isInAlliance?: boolean;
}

export function AnalyticsPage({ 
  isInitialLoad = true,
  loginStreak = 5,
  totalXP = 1200,
  level = 8,
  isInAlliance = true
}: AnalyticsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState("All Habits");
  const [activeTab, setActiveTab] = useState<'progress' | 'streaks' | 'alliance'>('progress');
  const [showShareModal, setShowShareModal] = useState(false);

  const filters = ["All Habits", "Reading & Mindfulness", "Morning Energy Boost", "Daily Discipline Builder"];

  // Habit-specific data
  const habitData: Record<string, { streak: number; rate: string; level: number; xp: number }> = {
    "All Habits": {
      streak: loginStreak,
      rate: "85%",
      level: level,
      xp: totalXP
    },
    "Reading & Mindfulness": {
      streak: 8,
      rate: "92%",
      level: 5,
      xp: 420
    },
    "Morning Energy Boost": {
      streak: 3,
      rate: "78%",
      level: 3,
      xp: 280
    },
    "Daily Discipline Builder": {
      streak: 6,
      rate: "88%",
      level: 4,
      xp: 536
    }
  };

  const currentHabitData = habitData[selectedFilter] || habitData["All Habits"];

  const metricCards: MetricCard[] = [
    {
      id: 'streak',
      title: 'Current Streak',
      value: currentHabitData.streak,
      subtitle: selectedFilter,
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      id: 'rate',
      title: '7-day Rate',
      value: currentHabitData.rate,
      subtitle: selectedFilter,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      id: 'level',
      title: 'Level',
      value: currentHabitData.level,
      subtitle: selectedFilter,
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      id: 'xp',
      title: 'Total XP',
      value: currentHabitData.xp.toLocaleString(),
      subtitle: selectedFilter,
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  const completionRates: CompletionRate[] = [
    { period: 'Last 7 Days', percentage: 85 },
    { period: 'Last 30 Days', percentage: 72 }
  ];

  // Mock data for the last 7 days chart
  const chartData = [
    { day: 'Mon', completion: 75 },
    { day: 'Tue', completion: 85 },
    { day: 'Wed', completion: 90 },
    { day: 'Thu', completion: 95 },
    { day: 'Fri', completion: 80 },
    { day: 'Sat', completion: 75 },
    { day: 'Sun', completion: 100 }
  ];

  // Streak data
  const longestStreak = 12;
  const totalHabitsCompleted = 34;
  const beastModeActivations = 6;
  const masteredHabitsCount = 3; // Total mastered habits (prestige + gold)
  const streakHistory = [
    { week: 'Week 1', streak: 7 },
    { week: 'Week 2', streak: 12 },
    { week: 'Week 3', streak: 8 },
    { week: 'Week 4', streak: loginStreak }
  ];

  // Alliance data
  const allianceRank = 3;
  const allianceXPContributed = 850;
  const allianceMembers = [
    { name: 'You', xp: 850, avatar: '🔥', rank: 1 },
    { name: 'Maya', xp: 720, avatar: '🌟', rank: 2 },
    { name: 'Alex', xp: 650, avatar: '⚡', rank: 3 }
  ];

  // 1-on-1 challenge records
  const oneOnOneRecords = [
    { opponent: 'Maya', wins: 3, losses: 1, avatar: '🌟' },
    { opponent: 'Alex', wins: 2, losses: 2, avatar: '⚡' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'radial-gradient(circle at center, #0B0B1D 0%, #000000 100%)'
    }}>
      {/* Background animations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-10 right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-xl"
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 left-10 w-40 h-40 bg-blue-600/10 rounded-full blur-xl"
      />

      <div className="relative z-10 max-w-md mx-auto px-6 pt-12 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h1 className="text-white text-2xl">Analytics</h1>
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
              >
                {filters.map((filter) => (
                  <option key={filter} value={filter} className="bg-gray-800 text-white">
                    {filter}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Tracking for <span className="text-purple-400">{selectedFilter}</span>
            </p>
            
            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareModal(true)}
              className="bg-purple-600 border border-purple-500 rounded-lg px-3 py-1.5 text-white text-sm hover:bg-purple-700 transition-all duration-300 flex items-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </motion.button>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isInitialLoad ? 0.2 : 0.1, duration: isInitialLoad ? 0.6 : 0.3 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {metricCards.map((card, index) => {
            // Map card colors to gradient backgrounds matching emoji colors
            const getCardStyles = () => {
              switch(card.id) {
                case 'streak': // 🔥 Flame - Orange
                  return {
                    bg: 'bg-gradient-to-br from-orange-600/20 to-red-600/20',
                    border: 'border-orange-500/30',
                    iconBg: 'bg-gradient-to-br from-orange-500 to-red-600',
                    valueColor: 'text-white'
                  };
                case 'rate': // 📈 TrendingUp - Green
                  return {
                    bg: 'bg-gradient-to-br from-green-600/20 to-emerald-600/20',
                    border: 'border-green-500/30',
                    iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
                    valueColor: 'text-white'
                  };
                case 'level': // ⭐ Star - Purple
                  return {
                    bg: 'bg-gradient-to-br from-purple-600/20 to-blue-600/20',
                    border: 'border-purple-500/30',
                    iconBg: 'bg-gradient-to-br from-purple-500 to-blue-600',
                    valueColor: 'text-white'
                  };
                case 'xp': // ⚡ Zap - Yellow
                  return {
                    bg: 'bg-gradient-to-br from-yellow-600/20 to-amber-600/20',
                    border: 'border-yellow-500/30',
                    iconBg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
                    valueColor: 'text-white'
                  };
                default:
                  return {
                    bg: 'bg-gray-800/50',
                    border: 'border-gray-700',
                    iconBg: card.bgColor,
                    valueColor: 'text-white'
                  };
              }
            };
            
            const styles = getCardStyles();
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: isInitialLoad ? 0.3 + index * 0.1 : 0.1 + index * 0.05, duration: isInitialLoad ? 0.6 : 0.3 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`${styles.bg} border ${styles.border} rounded-xl p-4 relative overflow-hidden backdrop-blur-sm`}
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Floating particles background */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full opacity-30"
                    style={{
                      background: card.color.replace('text-', ''),
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                
                {/* Tech grid pattern */}
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                
                {/* Glossy overlay effect */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
                  }}
                />
                
                {/* Shine effect */}
                <motion.div
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    width: '50%',
                  }}
                />
                
                <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
                  <motion.div 
                    className={`w-12 h-12 ${styles.iconBg} rounded-lg flex items-center justify-center relative overflow-hidden mb-3`}
                    animate={{
                      y: [0, -3, 0],
                      rotate: [0, 2, 0, -2, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {/* Icon gloss */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 60%)',
                      }}
                    />
                    
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      style={{
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                      }}
                    />
                    
                    <card.icon className="w-6 h-6 text-white relative z-10" />
                  </motion.div>
                  
                  <div className="space-y-1">
                    <motion.div 
                      className={`${styles.valueColor} text-2xl font-bold`} 
                      style={{
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {card.value}
                    </motion.div>
                    <div className="text-gray-300 text-xs font-medium">{card.title}</div>
                    <div className="text-gray-400 text-xs">{card.subtitle}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isInitialLoad ? 0.6 : 0.2, duration: isInitialLoad ? 0.6 : 0.3 }}
          className="flex bg-gray-800/30 rounded-xl p-1 mb-8 overflow-x-auto"
        >
          {[
            { id: 'progress', label: 'Progress' },
            { id: 'streaks', label: 'Streaks' },
            { id: 'alliance', label: 'Alliance' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-lg transition-all duration-300 text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content Based on Active Tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {activeTab === 'progress' && (
            <>
              {/* Completion Rates */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <h3 className="text-white">Completion Rates</h3>
                  <span className="text-gray-400 text-sm">• {selectedFilter}</span>
                </div>

                <div className="space-y-4">
                  {completionRates.map((rate, index) => (
                    <motion.div
                      key={rate.period}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{rate.period}</span>
                        <span className="text-white">{rate.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${rate.percentage}%` }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Last 7 Days Chart */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <h3 className="text-white">Last 7 Days</h3>
                  <span className="text-gray-400 text-sm">• {selectedFilter}</span>
                </div>

                {/* Simple Bar Chart */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-32 px-2">
                    {chartData.map((data, index) => (
                      <motion.div
                        key={data.day}
                        initial={{ height: 0 }}
                        animate={{ height: `${data.completion}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center gap-2 flex-1"
                      >
                        <div 
                          className="w-8 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm relative"
                          style={{ height: `${data.completion}%` }}
                        ></div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Chart Labels */}
                  <div className="flex justify-between px-2 mt-2">
                    {chartData.map((data) => (
                      <div key={data.day} className="text-gray-400 text-xs text-center flex-1">
                        {data.day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between absolute left-2 h-32 text-gray-500 text-xs -ml-8 -mt-36">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'streaks' && (
            <>
              {/* Current Streak */}
              <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Current Streak</div>
                      <div className="text-orange-300 text-xs">Keep it going!</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-white">{loginStreak}</div>
                    <div className="text-orange-300 text-xs">days</div>
                  </div>
                </div>
              </div>

              {/* Longest Streak */}
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-10 h-10 text-purple-400" />
                    <div>
                      <div className="text-white font-bold">Longest Streak</div>
                      <div className="text-purple-300 text-xs">Personal record</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-400">{longestStreak}</div>
                    <div className="text-purple-300 text-xs">days</div>
                  </div>
                </div>
              </div>

              {/* Streak Stats */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <div className="text-white font-bold mb-4">Habit Performance</div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{totalHabitsCompleted}</div>
                    <div className="text-xs text-gray-400">Total Completed</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-600/20 to-purple-600/20 border border-yellow-500/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{masteredHabitsCount}</div>
                    <div className="text-xs text-yellow-300/80">Mastered Habits</div>
                  </div>
                </div>
              </div>

              {/* Streak History */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <div className="text-white font-bold mb-4">Streak History</div>
                <div className="space-y-3">
                  {streakHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{item.week}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.streak / longestStreak) * 100}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                          />
                        </div>
                        <span className="text-white text-sm font-bold w-8 text-right">{item.streak}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'alliance' && (
            <>
              {isInAlliance ? (
                <>
                  {/* Alliance Overview */}
                  <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-2xl">
                        👑
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold">The Grind Squad</div>
                        <div className="text-cyan-300 text-xs">3 Members • Rank #{allianceRank}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <div className="text-xl font-bold text-white">{allianceXPContributed}</div>
                        <div className="text-xs text-gray-400">XP Contributed</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <div className="text-xl font-bold text-cyan-400">#{allianceRank}</div>
                        <div className="text-xs text-gray-400">Alliance Rank</div>
                      </div>
                    </div>
                  </div>

                  {/* 1-on-1 Challenge Records */}
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Swords className="w-5 h-5 text-purple-400" />
                      <div className="text-white font-bold">1-on-1 Records</div>
                    </div>
                    
                    <div className="space-y-3">
                      {oneOnOneRecords.map((record, idx) => {
                        const totalGames = record.wins + record.losses;
                        const winRate = totalGames > 0 ? (record.wins / totalGames) * 100 : 0;
                        
                        return (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{record.avatar}</span>
                                <span className="text-gray-300 text-sm">{record.opponent}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 font-bold text-sm">{record.wins}W</span>
                                <span className="text-gray-500">-</span>
                                <span className="text-red-400 font-bold text-sm">{record.losses}L</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${winRate}%` }}
                                transition={{ duration: 0.8, delay: 0.1 + idx * 0.1 }}
                                className={`h-2 rounded-full ${
                                  winRate >= 50 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                    : 'bg-gradient-to-r from-orange-500 to-red-500'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Contributors */}
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                    <div className="text-white font-bold mb-4">Top Contributors (This Week)</div>
                    <div className="space-y-2">
                      {allianceMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            member.name === 'You' ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-gray-700/20'
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-lg">{member.avatar}</span>
                            <span className="text-white text-sm font-bold">
                              {member.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-bold">{member.xp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-white mb-2">Not in an Alliance</h3>
                    <p className="text-gray-400 text-sm">Join an alliance to see team analytics and compete together!</p>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Share Habits Modal */}
        <ShareHabitsModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          initialHabitName={selectedFilter}
          availableHabits={filters}
          getStatsForHabit={(habitName) => ({
            streak: habitName === 'All Habits' ? loginStreak : loginStreak,
            weekRate: habitName === 'All Habits' ? '85%' : '78%',
            totalCompleted: habitName === 'All Habits' ? totalHabitsCompleted : Math.floor(totalHabitsCompleted / 3),
            level: level
          })}
        />
      </div>
    </div>
  );
}