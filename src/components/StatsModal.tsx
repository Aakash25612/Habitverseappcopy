import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Flame, Trophy, Users, Target, Star, TrendingUp, Award, Zap, Crown, Shield, Swords, Calendar, CheckCircle2, Lock, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginStreak: number;
  totalXP: number;
  level: number;
  isInAlliance?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  total: number;
  unlocked: boolean;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievements: Achievement[] = [
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Complete a 7-day login streak',
    icon: Flame,
    progress: 5,
    total: 7,
    unlocked: false,
    xpReward: 100,
    rarity: 'common'
  },
  {
    id: 'streak-30',
    title: 'Month Master',
    description: 'Complete a 30-day login streak',
    icon: Trophy,
    progress: 5,
    total: 30,
    unlocked: false,
    xpReward: 500,
    rarity: 'epic'
  },
  {
    id: 'level-10',
    title: 'Rising Star',
    description: 'Reach level 10',
    icon: Star,
    progress: 8,
    total: 10,
    unlocked: false,
    xpReward: 200,
    rarity: 'rare'
  },
  {
    id: 'level-25',
    title: 'Elite Grinder',
    description: 'Reach level 25',
    icon: Crown,
    progress: 8,
    total: 25,
    unlocked: false,
    xpReward: 1000,
    rarity: 'legendary'
  },
  {
    id: 'xp-5000',
    title: 'XP Hunter',
    description: 'Earn 5,000 total XP',
    icon: Zap,
    progress: 1200,
    total: 5000,
    unlocked: false,
    xpReward: 250,
    rarity: 'rare'
  },
  {
    id: 'habits-completed-50',
    title: 'Habit Hero',
    description: 'Complete 50 daily habits',
    icon: CheckCircle2,
    progress: 34,
    total: 50,
    unlocked: false,
    xpReward: 300,
    rarity: 'rare'
  },
  {
    id: 'alliance-joined',
    title: 'Team Player',
    description: 'Join an alliance',
    icon: Users,
    progress: 1,
    total: 1,
    unlocked: true,
    xpReward: 150,
    rarity: 'common'
  },
  {
    id: 'challenge-won-5',
    title: 'Challenge Champion',
    description: 'Win 5 alliance challenges',
    icon: Swords,
    progress: 2,
    total: 5,
    unlocked: false,
    xpReward: 400,
    rarity: 'epic'
  },
  {
    id: 'beast-mode-10',
    title: 'Beast Mode Activated',
    description: 'Activate Beast Mode 10 times',
    icon: Target,
    progress: 6,
    total: 10,
    unlocked: false,
    xpReward: 350,
    rarity: 'rare'
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all habits for 7 days straight',
    icon: Award,
    progress: 4,
    total: 7,
    unlocked: false,
    xpReward: 500,
    rarity: 'epic'
  }
];

const rarityColors = {
  common: {
    bg: 'from-gray-600/20 to-gray-700/20',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/20'
  },
  rare: {
    bg: 'from-blue-600/20 to-blue-700/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20'
  },
  epic: {
    bg: 'from-purple-600/20 to-purple-700/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20'
  },
  legendary: {
    bg: 'from-yellow-600/20 to-orange-600/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/20'
  }
};

export function StatsModal({ isOpen, onClose, loginStreak, totalXP, level, isInAlliance = true }: StatsModalProps) {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const longestStreak = 12; // Mock data
  const habitCompletionRate = 85; // Mock percentage
  const totalHabitsCompleted = 34;
  const beastModeActivations = 6;
  
  // Alliance stats
  const allianceRank = 3;
  const allianceChallengesWon = 2;
  const allianceChallengesTotal = 4;
  const allianceXPContributed = 850;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border-purple-500/30 text-white max-w-md mx-auto max-h-[85vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-purple-400">
            <Trophy className="w-6 h-6" />
            Your Stats
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="streaks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 mx-6 mb-4">
            <TabsTrigger value="streaks" className="data-[state=active]:bg-purple-600">
              <Flame className="w-4 h-4 mr-1" />
              Streaks
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              <Award className="w-4 h-4 mr-1" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="alliance" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-1" />
              Alliance
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-6 pb-6">
            {/* Streaks Tab */}
            <TabsContent value="streaks" className="mt-0 space-y-4">
              {/* Current Login Streak */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Current Streak</div>
                      <div className="text-orange-300 text-xs">Keep it going!</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{loginStreak}</div>
                    <div className="text-orange-300 text-xs">days</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-orange-200">
                  <TrendingUp className="w-3 h-3" />
                  <span>Next milestone: {loginStreak < 7 ? '7 days' : loginStreak < 30 ? '30 days' : '50 days'}</span>
                </div>
              </motion.div>

              {/* Longest Streak */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="text-white font-bold">Longest Streak</div>
                      <div className="text-purple-300 text-xs">Personal record</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-400">{longestStreak}</div>
                </div>
              </motion.div>

              {/* Habit Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-3"
              >
                <div className="text-white font-bold mb-3">Habit Performance</div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Completion Rate</span>
                    <span className="text-green-400 font-bold">{habitCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${habitCompletionRate}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{totalHabitsCompleted}</div>
                    <div className="text-xs text-gray-400">Total Completed</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">{beastModeActivations}</div>
                    <div className="text-xs text-gray-400">Beast Modes</div>
                  </div>
                </div>
              </motion.div>

              {/* Streak Milestones */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
              >
                <div className="text-white font-bold mb-3">Streak Milestones</div>
                <div className="space-y-2">
                  {[
                    { days: 7, reward: '100 XP', achieved: loginStreak >= 7 },
                    { days: 14, reward: '250 XP', achieved: longestStreak >= 14 },
                    { days: 30, reward: '500 XP', achieved: longestStreak >= 30 },
                    { days: 50, reward: '1000 XP', achieved: false },
                    { days: 100, reward: '2500 XP', achieved: false }
                  ].map((milestone, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        milestone.achieved ? 'bg-green-600/20 border border-green-500/30' : 'bg-gray-700/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {milestone.achieved ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={milestone.achieved ? 'text-white' : 'text-gray-400'}>
                          {milestone.days} Days
                        </span>
                      </div>
                      <span className={`text-sm ${milestone.achieved ? 'text-green-400' : 'text-gray-500'}`}>
                        {milestone.reward}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="mt-0 space-y-4">
              {/* Achievement Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-bold">Achievements Unlocked</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {unlockedAchievements.length}/{achievements.length}
                  </div>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Unlocked Achievements */}
              {unlockedAchievements.length > 0 && (
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm font-bold">Unlocked</div>
                  {unlockedAchievements.map((achievement, idx) => {
                    const colors = rarityColors[achievement.rarity];
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-3`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-lg flex items-center justify-center flex-shrink-0 ${colors.glow} shadow-lg`}>
                            <Icon className={`w-6 h-6 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm">{achievement.title}</span>
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="text-gray-300 text-xs">{achievement.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs ${colors.text} uppercase font-bold`}>{achievement.rarity}</span>
                              <span className="text-yellow-400 text-xs">+{achievement.xpReward} XP</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Locked Achievements */}
              <div className="space-y-2">
                <div className="text-gray-400 text-sm font-bold">In Progress</div>
                {lockedAchievements.map((achievement, idx) => {
                  const colors = rarityColors[achievement.rarity];
                  const Icon = achievement.icon;
                  const progress = (achievement.progress / achievement.total) * 100;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-bold text-sm">{achievement.title}</div>
                          <div className="text-gray-400 text-xs">{achievement.description}</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">
                            {achievement.progress}/{achievement.total}
                          </span>
                          <span className={colors.text}>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className={`bg-gradient-to-r ${colors.bg.replace('/20', '')} h-1.5 rounded-full`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Alliance Tab */}
            <TabsContent value="alliance" className="mt-0 space-y-4">
              {isInAlliance ? (
                <>
                  {/* Alliance Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
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
                  </motion.div>

                  {/* Challenge Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
                  >
                    <div className="text-white font-bold mb-3">Challenge Performance</div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Swords className="w-5 h-5 text-purple-400" />
                          <span className="text-gray-300">Challenges Won</span>
                        </div>
                        <span className="text-white font-bold">{allianceChallengesWon}/{allianceChallengesTotal}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Win Rate</span>
                          <span className="text-green-400">
                            {Math.round((allianceChallengesWon / allianceChallengesTotal) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(allianceChallengesWon / allianceChallengesTotal) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Alliance Achievements */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
                  >
                    <div className="text-white font-bold mb-3">Alliance Milestones</div>
                    <div className="space-y-2">
                      {[
                        { title: 'First Alliance', desc: 'Join an alliance', completed: true, icon: Users },
                        { title: 'Team Victory', desc: 'Win first challenge', completed: true, icon: Trophy },
                        { title: 'Challenge Streak', desc: 'Win 5 challenges in a row', completed: false, icon: Flame },
                        { title: 'Top Contributor', desc: 'Earn most XP in a week', completed: false, icon: Star }
                      ].map((milestone, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            milestone.completed ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-gray-700/20'
                          }`}
                        >
                          <milestone.icon className={`w-5 h-5 ${milestone.completed ? 'text-purple-400' : 'text-gray-500'}`} />
                          <div className="flex-1">
                            <div className={`text-sm ${milestone.completed ? 'text-white' : 'text-gray-400'}`}>
                              {milestone.title}
                            </div>
                            <div className="text-xs text-gray-500">{milestone.desc}</div>
                          </div>
                          {milestone.completed && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Contribution Leaderboard */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
                  >
                    <div className="text-white font-bold mb-3">Top Contributors (This Week)</div>
                    <div className="space-y-2">
                      {[
                        { name: 'Dario', avatar: '🔥', xp: 850, isYou: true },
                        { name: 'Maya', avatar: '🌟', xp: 720, isYou: false },
                        { name: 'Alex', avatar: '⚡', xp: 650, isYou: false }
                      ].map((member, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            member.isYou ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-gray-700/20'
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-lg">{member.avatar}</span>
                            <span className="text-white text-sm font-bold">
                              {member.name}
                              {member.isYou && ' (You)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-bold">{member.xp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-bold mb-2">Not in an Alliance</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Join an alliance to unlock team challenges and compete together!
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600"
                  >
                    Browse Alliances
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="px-6 pb-6 pt-2 border-t border-gray-700/50">
          <Button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
