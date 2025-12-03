import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Lock, Calendar, Target, X } from 'lucide-react';

interface HabitLockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  habitName: string;
}

export function HabitLockInModal({ isOpen, onClose, onConfirm, habitName }: HabitLockInModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm mx-auto overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30 p-6">
            {/* Warning glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 blur-xl"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Animated warning icon */}
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
                >
                  <Lock className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-white font-bold text-lg">Habit Lock-In</h2>
                  <p className="text-orange-300 text-sm font-medium">30-Day Journey</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Warning Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="mb-4">
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-3"
                >
                  <AlertTriangle className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  ⚠️ Once you accept this habit, your <span className="text-orange-400 font-semibold">30-day journey</span> begins.
                </p>
              </div>
            </motion.div>

            {/* Warning Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <Calendar className="w-3 h-3 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      Editing or changing this habit will <span className="text-red-400 font-medium">reset your progress back to Day 0</span>.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <Target className="w-3 h-3 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      The point is to repeat the same actions for <span className="text-orange-400 font-medium">30 days</span> so it becomes a real habit.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Habit Name Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center"
            >
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Your New Habit</p>
              <p className="text-white font-bold text-lg">{habitName}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-orange-400 text-sm font-medium">30-Day Challenge</p>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-700 bg-gray-900/50">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Accept & Start
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}