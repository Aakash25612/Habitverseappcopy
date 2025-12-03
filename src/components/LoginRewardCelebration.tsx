import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { ConfettiEffect } from './ConfettiEffect';
import { Trophy, Zap, Target, Crown, Star, Gift, Calendar, Flame } from 'lucide-react';

interface LoginRewardCelebrationProps {
  isActive: boolean;
  loginDay: number;
  onComplete: () => void;
}

// Daily motivational messages
const dailyMessages = [
  {
    day: 1,
    title: "Welcome, Warrior!",
    message: "The 1st day always sucks, but it's step 1 of something BIGGER",
    icon: "🚀",
    xpReward: 100,
    bonusReward: "First Step Bonus"
  },
  {
    day: 2,
    title: "Momentum Builder!",
    message: "Day 2 is where the magic begins. You're already ahead of 90% of people!",
    icon: "⚡",
    xpReward: 150,
    bonusReward: "Consistency Streak"
  },
  {
    day: 3,
    title: "Pattern Creator!",
    message: "3 days in a row? You're not just dreaming anymore, you're DOING!",
    icon: "🔥",
    xpReward: 200,
    bonusReward: "Habit Forming"
  },
  {
    day: 4,
    title: "Unstoppable Force!",
    message: "Day 4: The resistance is real, but so is your power to push through!",
    icon: "💪",
    xpReward: 250,
    bonusReward: "Power Through"
  },
  {
    day: 5,
    title: "Momentum Master!",
    message: "5 days strong! You're building the foundation of a legendary life!",
    icon: "🏆",
    xpReward: 300,
    bonusReward: "Foundation Builder"
  },
  {
    day: 6,
    title: "Almost Legendary!",
    message: "Day 6: You're so close to a full week. Champions finish what they start!",
    icon: "👑",
    xpReward: 350,
    bonusReward: "Nearly Legendary"
  },
  {
    day: 7,
    title: "WEEKLY CHAMPION!",
    message: "7 DAYS COMPLETE! You just proved you can do ANYTHING!",
    icon: "🎉",
    xpReward: 500,
    bonusReward: "Weekly Warrior"
  }
];

export function LoginRewardCelebration({ isActive, loginDay, onComplete }: LoginRewardCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationPhase, setCelebrationPhase] = useState<'intro' | 'message' | 'rewards' | 'finale'>('intro');
  const [currentMessage, setCurrentMessage] = useState(dailyMessages[0]);

  useEffect(() => {
    if (isActive) {
      // Get the message for the login day
      const message = dailyMessages.find(m => m.day === loginDay) || dailyMessages[0];
      setCurrentMessage(message);

      // Celebration sequence
      const timeouts = [
        setTimeout(() => setCelebrationPhase('intro'), 100),
        setTimeout(() => {
          setCelebrationPhase('message');
          setShowConfetti(true);
        }, 800),
        setTimeout(() => setCelebrationPhase('rewards'), 2500),
        setTimeout(() => setCelebrationPhase('finale'), 4500),
      ];

      return () => timeouts.forEach(clearTimeout);
    }
  }, [isActive, loginDay]);

  const handleClose = () => {
    setShowConfetti(false);
    onComplete();
  };

  if (!isActive) return null;

  return (
    <>
      {/* Full Screen Celebration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.4) 0%, rgba(139, 92, 246, 0.3) 40%, rgba(0, 0, 0, 0.95) 100%)'
        }}
      >
        {/* Close Button */}
        <AnimatePresence>
          {celebrationPhase === 'finale' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              onClick={handleClose}
              className="absolute top-8 right-8 z-60 bg-white/10 backdrop-blur-lg rounded-full p-3 border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              ✕
            </motion.button>
          )}
        </AnimatePresence>

        <div className="relative w-full max-w-lg mx-auto px-6">
          
          {/* Intro Phase - Day Badge */}
          <AnimatePresence>
            {celebrationPhase === 'intro' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-blue-500 mb-4 relative"
                  style={{
                    boxShadow: '0 0 60px rgba(16, 185, 129, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {/* Orbiting Stars */}
                  {[0, 1, 2].map((star) => (
                    <motion.div
                      key={star}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3 + star,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0"
                    >
                      <Star 
                        className="absolute w-4 h-4 text-yellow-300" 
                        fill="currentColor"
                        style={{
                          top: '10%',
                          left: '50%',
                          transform: `translateX(-50%) rotate(${star * 120}deg) translateY(-30px)`
                        }}
                      />
                    </motion.div>
                  ))}
                  
                  <div className="text-center z-10">
                    <Calendar className="w-8 h-8 text-white mb-1 mx-auto" />
                    <div className="text-3xl font-bold text-white">
                      DAY {loginDay}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl text-white font-bold"
                >
                  Daily Login Reward!
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Phase */}
          <AnimatePresence>
            {(celebrationPhase === 'message' || celebrationPhase === 'rewards' || celebrationPhase === 'finale') && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-center space-y-6"
              >
                {/* Giant Emoji */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-8xl mb-4"
                >
                  {currentMessage.icon}
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-white tracking-wide"
                  style={{
                    background: 'linear-gradient(45deg, #10B981, #3B82F6, #8B5CF6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {currentMessage.title}
                </motion.h1>

                {/* Motivational Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30 mx-4"
                >
                  <p className="text-xl text-white leading-relaxed font-medium">
                    {currentMessage.message}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rewards Phase */}
          <AnimatePresence>
            {(celebrationPhase === 'rewards' || celebrationPhase === 'finale') && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 space-y-4"
              >
                {/* XP Reward */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-4 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-8 h-8 text-yellow-400" fill="currentColor" />
                  </motion.div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      +{currentMessage.xpReward} XP
                    </div>
                    <div className="text-yellow-200 text-sm">Experience Points</div>
                  </div>
                </motion.div>

                {/* Bonus Reward */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 15, -15, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Gift className="w-8 h-8 text-purple-400" />
                  </motion.div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">
                      {currentMessage.bonusReward}
                    </div>
                    <div className="text-purple-200 text-sm">Special Achievement</div>
                  </div>
                </motion.div>

                {/* Streak Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-900/50 to-orange-900/50 backdrop-blur-sm rounded-xl p-4 border border-red-500/30"
                >
                  <Flame className="w-6 h-6 text-orange-400" />
                  <span className="text-white font-medium">
                    {loginDay} Day Streak 
                  </span>
                  {loginDay >= 7 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Crown className="w-6 h-6 text-yellow-400" fill="currentColor" />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Finale Phase */}
          <AnimatePresence>
            {celebrationPhase === 'finale' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center space-y-4"
              >
                <div className="text-2xl text-white font-bold">
                  🎉 REWARD CLAIMED! 🎉
                </div>
                
                <div className="text-lg text-green-400 font-medium">
                  Keep building that momentum, Champion!
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-white/60 text-sm"
                >
                  Tap ✕ to continue your journey
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>

      {/* Enhanced Confetti */}
      <ConfettiEffect 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)}
      />
    </>
  );
}