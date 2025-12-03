import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { X, Flame, Zap, Trophy, Star, Crown, Target } from 'lucide-react';

interface WelcomeBackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number; // Which day of the 30-day cycle (1-30)
  completedDays: number[]; // Array of completed day numbers
  onClaimReward: () => void;
  streakXP: number; // Progressive XP amount based on streak
  currentStreak: number; // Current login streak
}

// 30 Daily motivational quotes
const dailyQuotes = [
  { day: 1, quote: "The 1st day always sucks, but it's step 1 of something BIGGER.", author: "Champion's Code", xp: 100 },
  { day: 2, quote: "Day 2 is where the magic begins. You're already ahead of 90% of people!", author: "Momentum Master", xp: 110 },
  { day: 3, quote: "3 days in a row? You're not just dreaming anymore, you're DOING!", author: "Action Taker", xp: 120 },
  { day: 4, quote: "Day 4: The resistance is real, but so is your power to push through!", author: "Warrior Spirit", xp: 130 },
  { day: 5, quote: "5 days strong! You're building the foundation of a legendary life!", author: "Foundation Builder", xp: 140 },
  { day: 6, quote: "Day 6: You're so close to a full week. Champions finish what they start!", author: "Finisher's Mindset", xp: 150 },
  { day: 7, quote: "7 DAYS COMPLETE! You just proved you can do ANYTHING! 🔥", author: "Weekly Warrior", xp: 200 },
  { day: 8, quote: "Week 2 begins! The habit is forming. You're becoming unstoppable!", author: "Habit Master", xp: 160 },
  { day: 9, quote: "Day 9: Every small win compounds into something extraordinary.", author: "Compound Effect", xp: 170 },
  { day: 10, quote: "Double digits! You're in the top 5% of people who stick to their goals!", author: "Elite Performer", xp: 180 },
  { day: 11, quote: "Day 11: Your future self is thanking you for not giving up.", author: "Future Vision", xp: 190 },
  { day: 12, quote: "12 days of dedication. You're writing your success story one day at a time.", author: "Story Writer", xp: 200 },
  { day: 13, quote: "Lucky Day 13! Your persistence is your superpower.", author: "Persistence Power", xp: 210 },
  { day: 14, quote: "2 WEEKS! You've officially broken through the resistance barrier!", author: "Barrier Breaker", xp: 250 },
  { day: 15, quote: "Halfway to 30! Every champion knows the middle is where magic happens.", author: "Middle Magic", xp: 220 },
  { day: 16, quote: "Day 16: You're not just building habits, you're building character.", author: "Character Builder", xp: 230 },
  { day: 17, quote: "17 days of showing up. Your consistency is becoming your identity.", author: "Identity Shifter", xp: 240 },
  { day: 18, quote: "Day 18: The person you're becoming is worth every hard day.", author: "Transformation", xp: 250 },
  { day: 19, quote: "19 days strong! You're proving that success isn't luck, it's discipline.", author: "Discipline Master", xp: 260 },
  { day: 20, quote: "20 DAYS! You're in the top 1% of people who follow through!", author: "Top 1% Club", xp: 270 },
  { day: 21, quote: "3 WEEKS! Neuroscience says you're officially rewiring your brain! 🧠", author: "Brain Rewirer", xp: 300 },
  { day: 22, quote: "Day 22: Your dedication is inspiring. Keep being the example!", author: "Inspiration Source", xp: 280 },
  { day: 23, quote: "23 days of excellence. You're not just succeeding, you're dominating!", author: "Excellence Dominator", xp: 290 },
  { day: 24, quote: "Day 24: One week until legendary status. Can you feel the power?", author: "Power Rising", xp: 300 },
  { day: 25, quote: "25 days! You've transformed from dreamer to achiever to LEGEND!", author: "Legend Status", xp: 310 },
  { day: 26, quote: "Day 26: Your past self is proud. Your future self is excited!", author: "Time Bridge", xp: 320 },
  { day: 27, quote: "27 days of pure determination. You're redefining what's possible!", author: "Possibility Expander", xp: 330 },
  { day: 28, quote: "Day 28: Almost there! The finish line is calling your name!", author: "Finish Line Caller", xp: 340 },
  { day: 29, quote: "29 DAYS! Tomorrow you join the 30-Day Champions Hall of Fame!", author: "Hall of Fame", xp: 350 },
  { day: 30, quote: "30 DAYS COMPLETE! You are officially a LEGENDARY CHAMPION! 👑🔥", author: "Legendary Champion", xp: 500 }
];

export function WelcomeBackModal({ isOpen, onClose, currentDay, completedDays, onClaimReward, streakXP, currentStreak }: WelcomeBackModalProps) {
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  
  const currentQuote = dailyQuotes.find(q => q.day === currentDay) || dailyQuotes[0];
  const streak = completedDays.length;
  const isCurrentDayCompleted = completedDays.includes(currentDay);

  // Calculate which week we're in (1-5) and the day range for that week
  const currentWeek = Math.ceil(currentDay / 7);
  const weekStartDay = (currentWeek - 1) * 7 + 1;
  const weekEndDay = Math.min(currentWeek * 7, 30); // Don't go beyond day 30
  const daysInCurrentWeek = weekEndDay - weekStartDay + 1;

  useEffect(() => {
    if (isOpen) {
      // Reset local state when modal opens
      setHasClaimedToday(false);
      setShowRewardAnimation(false);
      
      if (!isCurrentDayCompleted) {
        // Auto-show reward animation for new day
        const timer = setTimeout(() => {
          setShowRewardAnimation(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      // Reset state when modal closes
      setHasClaimedToday(false);
      setShowRewardAnimation(false);
    }
  }, [isOpen, isCurrentDayCompleted]);

  const handleClaimReward = () => {
    setHasClaimedToday(true);
    setShowRewardAnimation(false);
    onClaimReward();
    // Note: Modal will be closed by parent component after reward celebration
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(88, 28, 135, 0.25) 0%, rgba(0, 0, 0, 0.95) 100%)'
          }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-indigo-950/98 to-black/98 backdrop-blur-lg rounded-3xl border border-indigo-900/40 overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-4">
            {/* Header */}
            <div className="text-center mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 mb-2 relative"
              >
                <Crown className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-white mb-1"
              >
                Welcome Back, Champion!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-indigo-200"
              >
                Day {currentDay} of your 30-day journey
              </motion.p>
            </div>

            {/* Week-by-Week Calendar Grid - Minimal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-3"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold text-sm">Week {currentWeek} Progress</h3>
                <div className="text-indigo-300 text-xs">Days {weekStartDay}-{weekEndDay}</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: daysInCurrentWeek }, (_, i) => {
                  const day = weekStartDay + i;
                  const isCompleted = completedDays.includes(day);
                  const isCurrent = day === currentDay;
                  const isUpcoming = day > currentDay;
                  
                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + (i * 0.05) }}
                      className={`
                        relative w-full aspect-square rounded-xl flex flex-col items-center justify-center font-medium transition-all duration-200
                        ${isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                          : isCurrent 
                            ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white animate-pulse' 
                            : isUpcoming
                              ? 'bg-gray-700/50 text-gray-400'
                              : 'bg-gray-600/30 text-gray-500'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + (i * 0.05) }}
                          className="text-base"
                        >
                          ✓
                        </motion.div>
                      ) : (
                        <div className="text-base font-bold">{day}</div>
                      )}
                      
                      {/* Special milestone indicators */}
                      {(day === 7 || day === 14 || day === 21 || day === 30) && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute -top-1 -right-1"
                        >
                          <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
                {/* Fill empty slots for incomplete weeks (like week 5 with only 2 days) */}
                {daysInCurrentWeek < 7 && Array.from({ length: 7 - daysInCurrentWeek }, (_, i) => (
                  <div key={`empty-${i}`} className="w-full aspect-square rounded-xl bg-gray-800/30" />
                ))}
              </div>
              
              {/* Compact Legend */}
              <div className="flex justify-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <span className="text-gray-300">Done</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-600 to-violet-600"></div>
                  <span className="text-gray-300">Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-700/50"></div>
                  <span className="text-gray-300">Next</span>
                </div>
              </div>
            </motion.div>

            {/* Today's Quote - Streamlined */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-purple-950/60 to-violet-950/60 backdrop-blur-sm rounded-xl p-2.5 border border-purple-700/30 mb-3"
            >
              <div className="text-center">
                <blockquote className="text-white text-sm leading-relaxed mb-2 italic">
                  "{currentQuote.quote}"
                </blockquote>
                <div className="text-purple-300 text-xs">
                  — {currentQuote.author.replace('Foundation Builder', 'Foundation Master')}
                </div>
              </div>
            </motion.div>

            {/* Streak Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-1.5 mb-3"
            >
              <div className="text-center bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-lg p-1.5 border border-orange-500/30">
                <Flame className="w-4 h-4 text-orange-400 mx-auto mb-0.5" />
                <div className="text-sm font-bold text-orange-400">{streak}</div>
                <div className="text-xs text-orange-200">Streak</div>
              </div>
              
              <div className="text-center bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-1.5 border border-green-500/30">
                <Target className="w-4 h-4 text-green-400 mx-auto mb-0.5" />
                <div className="text-sm font-bold text-green-400">{Math.round((completedDays.length / 30) * 100)}%</div>
                <div className="text-xs text-green-200">Done</div>
              </div>
              
              <div className="text-center bg-gradient-to-r from-indigo-950/60 to-violet-950/60 rounded-lg p-1.5 border border-indigo-700/30">
                <Trophy className="w-4 h-4 text-indigo-400 mx-auto mb-0.5" />
                <div className="text-sm font-bold text-indigo-400">{30 - currentDay + 1}</div>
                <div className="text-xs text-indigo-200">Left</div>
              </div>
            </motion.div>

            {/* Login Bonus Explanation */}
            {!isCurrentDayCompleted && !hasClaimedToday && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-2 mb-3 border border-green-500/20"
              >
                <div className="text-center">
                  <div className="text-xs text-green-300 mb-1">
                    🔥 {currentStreak}-Day Login Streak
                  </div>
                  <div className="text-xs text-gray-300">
                    Stay consistent to earn more XP each day! ({streakXP} XP today)
                  </div>
                </div>
              </motion.div>
            )}

            {/* XP Reward Section */}
            <AnimatePresence>
              {!isCurrentDayCompleted && !hasClaimedToday && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClaimReward}
                    className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 relative overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Claim +{streakXP} XP
                      <Zap className="w-5 h-5" />
                    </div>
                    
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.button>
                  
                  <p className="text-indigo-200 text-xs mt-1.5">
                    Check in daily to maintain your streak!
                  </p>
                </motion.div>
              )}
              
              {(isCurrentDayCompleted || hasClaimedToday) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-green-400 font-medium mb-2">
                    <Trophy className="w-5 h-5" />
                    Daily Reward Claimed!
                    <Trophy className="w-5 h-5" />
                  </div>
                  <p className="text-green-200 text-xs">
                    See you tomorrow for day {currentDay + 1}! 🔥
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Special Milestone Celebrations - Compact */}
            {[7, 14, 21, 30].includes(currentDay) && !isCurrentDayCompleted && !hasClaimedToday && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="mt-2 text-center bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-lg p-2 border border-yellow-500/30"
              >
                <Crown className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <div className="text-yellow-400 font-bold text-xs">
                  🎉 MILESTONE DAY! 🎉
                </div>
                <div className="text-yellow-200 text-xs">
                  Extra XP reward waiting!
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}