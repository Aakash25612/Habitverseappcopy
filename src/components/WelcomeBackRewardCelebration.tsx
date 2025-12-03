import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Trophy, Flame, Star, Target, ChevronRight, ArrowRight } from 'lucide-react';
import { EpicParticleEffect } from './EpicParticleEffect';
import { FuturisticXPIcon } from './FuturisticXPIcon';
import { IntegratedBadgeShowcase } from './IntegratedBadgeShowcase';

interface WelcomeBackRewardCelebrationProps {
  isActive: boolean;
  currentDay: number;
  xpGained: number;
  streak: number;
  completionPercentage: number;
  onComplete: () => void;
}

export function WelcomeBackRewardCelebration({
  isActive,
  currentDay,
  xpGained,
  streak,
  completionPercentage,
  onComplete
}: WelcomeBackRewardCelebrationProps) {
  const [showParticles, setShowParticles] = useState(false);
  const [animatedXP, setAnimatedXP] = useState(0);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setAnimatedXP(0);
      setShowParticles(false);
      setShowStreakCelebration(false);
      setShowCompletionCelebration(false);
      return;
    }

    // Epic celebration sequence
    const sequence = [
      // Start particles immediately
      () => setShowParticles(true),
      
      // Start XP counter animation after 300ms
      () => {
        const duration = 1500;
        const steps = 60;
        const increment = xpGained / steps;
        let current = 0;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= xpGained) {
            setAnimatedXP(xpGained);
            clearInterval(counter);
          } else {
            setAnimatedXP(Math.floor(current));
          }
        }, duration / steps);
      },
      
      // Show streak celebration after 800ms
      () => setShowStreakCelebration(true),
      
      // Show completion celebration after 1200ms (if milestone reached)
      () => {
        if (completionPercentage >= 25 && completionPercentage % 25 === 0) {
          setShowCompletionCelebration(true);
        }
      }
    ];

    // Execute the sequence
    sequence.forEach((action, index) => {
      setTimeout(action, index * 400);
    });

  }, [isActive, xpGained, streak, completionPercentage, onComplete]);

  const getDayMessage = (day: number) => {
    if (day <= 3) return "Building Neural Pathways";
    if (day <= 7) return "Momentum Protocol Activated";
    if (day <= 14) return "Unstoppable Force Engaged";
    if (day <= 21) return "Mastery Mode Unlocked";
    return "LEGENDARY STATUS ACHIEVED";
  };

  const getStreakMessage = (streak: number) => {
    if (streak <= 3) return "System Initializing";
    if (streak <= 7) return "Neural Networks Forming";
    if (streak <= 14) return "Beast Mode Protocol";
    if (streak <= 21) return "Unstoppable Algorithm";
    return "LEGENDARY SEQUENCE";
  };

  const getMilestoneMessage = (percentage: number) => {
    if (percentage >= 100) return "TRANSFORMATION COMPLETE";
    if (percentage >= 75) return "Final Phase Loading";
    if (percentage >= 50) return "Core Systems Online";
    if (percentage >= 25) return "Foundation Established";
    return "";
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          {/* Epic Particle Effect */}
          {showParticles && (
            <EpicParticleEffect 
              isActive={true}
              intensity={completionPercentage >= 25 && completionPercentage % 25 === 0 ? 'epic' : 'high'}
            />
          )}

          {/* Main Celebration Card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full max-w-sm mx-4 bg-gradient-to-b from-purple-900/95 to-black/98 backdrop-blur-lg rounded-3xl border border-purple-500/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Glow */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-xl"
            />

            {/* Content */}
            <div className="relative z-10 p-6 text-center">
              {/* Integrated Badge Showcase */}
              <motion.div
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="mb-4 relative"
              >
                <IntegratedBadgeShowcase 
                  size={100}
                  day={currentDay}
                  animate={true}
                />
                
                {/* Enhanced Parallax Sparkle Effects */}
                <motion.div
                  animate={{
                    scale: [0, 1.6, 0],
                    opacity: [0, 1, 0],
                    y: [0, -5, -10]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                  className="absolute -top-4 -right-4"
                  style={{ zIndex: 10 }}
                >
                  <Star className="w-6 h-6 text-yellow-300" style={{
                    filter: "drop-shadow(0 0 12px rgba(251,191,36,0.8))"
                  }} />
                </motion.div>
                
                <motion.div
                  animate={{
                    scale: [0, 1.4, 0],
                    opacity: [0, 0.9, 0],
                    x: [0, -3, -6]
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay: 1.2
                  }}
                  className="absolute -bottom-3 -left-4"
                  style={{ zIndex: 10 }}
                >
                  <Star className="w-4 h-4 text-cyan-300" style={{
                    filter: "drop-shadow(0 0 8px rgba(34,211,238,0.7))"
                  }} />
                </motion.div>
                
                <motion.div
                  animate={{
                    scale: [0, 1.2, 0],
                    opacity: [0, 0.8, 0],
                    x: [0, 2, 4],
                    y: [0, -2, -4]
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    delay: 0.8
                  }}
                  className="absolute top-2 -left-3"
                  style={{ zIndex: 10 }}
                >
                  <Star className="w-3 h-3 text-purple-300" style={{
                    filter: "drop-shadow(0 0 6px rgba(139,92,246,0.6))"
                  }} />
                </motion.div>
              </motion.div>

              {/* Day Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 mb-6"
              >
                Day {currentDay} - {getDayMessage(currentDay)}
              </motion.p>

              {/* XP Gain Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/40 mb-4 relative overflow-hidden"
              >
                {/* Background Energy Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl"
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <FuturisticXPIcon 
                      size={28}
                      intensity={currentDay >= 21 ? 'epic' : currentDay >= 14 ? 'high' : 'medium'}
                      animate={true}
                    />
                    <div className="text-white font-semibold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                      XP Gained!
                    </div>
                    <FuturisticXPIcon 
                      size={28}
                      intensity={currentDay >= 21 ? 'epic' : currentDay >= 14 ? 'high' : 'medium'}
                      animate={true}
                    />
                  </div>
                  
                  <motion.div
                    key={animatedXP}
                    initial={{ scale: 1.5, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent"
                    style={{
                      textShadow: "0 0 20px rgba(139,92,246,0.5)"
                    }}
                  >
                    +{animatedXP} XP
                  </motion.div>
                </div>
                
                {/* Energy Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        y: [0, -15, -30]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Streak Celebration */}
              <AnimatePresence>
                {showStreakCelebration && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-gradient-to-r from-orange-900/50 to-red-900/50 backdrop-blur-sm rounded-2xl p-3 border border-orange-400/30 mb-4"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          filter: [
                            "drop-shadow(0 0 10px rgba(255,138,0,0.5))",
                            "drop-shadow(0 0 20px rgba(255,138,0,0.8))",
                            "drop-shadow(0 0 10px rgba(255,138,0,0.5))"
                          ]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Flame className="w-5 h-5 text-orange-400" />
                      </motion.div>
                      <div className="text-orange-400 font-semibold">
                        {streak} Day Streak - {getStreakMessage(streak)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Milestone Celebration */}
              <AnimatePresence>
                {showCompletionCelebration && completionPercentage >= 25 && completionPercentage % 25 === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-3 border border-purple-400/30 mb-4"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Trophy className="w-5 h-5 text-purple-400" />
                      </motion.div>
                      <div className="text-purple-400 font-semibold">
                        {completionPercentage}% - {getMilestoneMessage(completionPercentage)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue Journey Button with Arrow */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span>Continue Your Journey!</span>
                  <motion.div
                    animate={{
                      x: [0, 4, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.button>



              {/* Progress Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="mt-3 text-xs text-gray-400"
              >
                Day {currentDay} of 30 • {completionPercentage}% Complete
              </motion.div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 300,
                    y: Math.random() * 400 + 200
                  }}
                  animate={{ 
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                    y: Math.random() * 400 + 50
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}