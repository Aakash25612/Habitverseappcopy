import { motion, AnimatePresence } from 'motion/react';
import { Star, Zap, Calendar, Target, ArrowRight, Sparkles } from 'lucide-react';

interface HabitJourneyStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartJourney: () => void;
  habitName: string;
}

export function HabitJourneyStartModal({ isOpen, onClose, onStartJourney, habitName }: HabitJourneyStartModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md mx-auto overflow-hidden relative"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Epic header with gradient */}
          <div className="relative bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-purple-800/30 border-b border-purple-500/30 p-6">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.sin(i) * 10, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full blur-sm"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + i * 10}%`,
                  }}
                />
              ))}
            </div>

            <div className="relative text-center">
              {/* Epic journey icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4 relative"
              >
                <Sparkles className="w-10 h-10 text-white" />
                
                {/* Orbiting stars */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute w-6 h-6"
                    style={{
                      transformOrigin: '50% 40px'
                    }}
                  >
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white font-bold text-xl mb-2"
              >
                🎉 Journey Begins!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-purple-200 font-medium"
              >
                Your 30-day transformation starts now
              </motion.p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Habit display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/40 rounded-xl p-4 text-center relative overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 animate-[shimmer_3s_ease-in-out_infinite]" />
              
              <p className="text-purple-300 text-xs uppercase tracking-wide mb-2">✨ YOUR NEW HABIT ✨</p>
              <p className="text-white font-bold text-lg mb-3">{habitName}</p>
              
              <div className="flex items-center justify-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">30 Days</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center gap-1 text-green-400">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Epic Results</span>
                </div>
              </div>
            </motion.div>

            {/* Achievement preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-bold text-lg">80 XP Daily</span>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-yellow-200 text-sm mb-3">
                  Complete all tasks + bonus every day
                </p>
                
                {/* Progress preview */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Total Potential</span>
                    <span className="text-yellow-400 font-bold">2,400 XP</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1, duration: 2, ease: "easeOut" }}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-400">30 days of consistency = Legendary status</p>
                </div>
              </div>
            </motion.div>

            {/* Motivational message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center space-y-3"
            >
              <div className="text-2xl">🚀</div>
              <p className="text-gray-300 text-sm leading-relaxed">
                You're about to embark on a <span className="text-purple-400 font-semibold">life-changing journey</span>. 
                Small daily wins lead to massive transformations!
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>Ready to become unstoppable?</span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💪
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Action buttons */}
          <div className="p-6 border-t border-gray-700 bg-gray-900/50">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
              >
                Not Yet
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartJourney}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Begin Journey</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Epic glow effect */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-xl opacity-50" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Add shimmer animation to globals.css if not already present
const shimmerStyle = `
@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
}
`;