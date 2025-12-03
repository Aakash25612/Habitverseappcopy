import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface EditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitName: string;
  streakDays: number;
  masteryDays: number;
  onConfirmEdit: () => void;
}

export function EditHabitModal({ 
  isOpen, 
  onClose, 
  habitName, 
  streakDays, 
  masteryDays, 
  onConfirmEdit 
}: EditHabitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.9, 
                y: 20,
                filter: 'blur(10px)'
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                filter: 'blur(0px)'
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.9, 
                y: 20,
                filter: 'blur(10px)'
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Warning icon and title */}
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex-shrink-0"
                >
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </motion.div>
                <h3 className="text-white text-lg font-semibold">Reset Warning</h3>
              </div>

              {/* Warning message */}
              <div className="mb-6">
                <p className="text-gray-300 text-center leading-relaxed">
                  Editing this habit will reset your {streakDays}-day streak and {masteryDays}-day mastery progress to 0.
                </p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                >
                  <p className="text-yellow-200 text-sm text-center">
                    Are you sure you want to continue?
                  </p>
                </motion.div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onConfirmEdit();
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  Yes, Edit & Reset
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full bg-gray-700 text-white py-3 rounded-xl font-medium border border-gray-600 hover:bg-gray-600 transition-all duration-300"
                >
                  Keep Current
                </motion.button>
              </div>

              {/* Floating particles for visual appeal */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.sin(i) * 10, 0],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 6 + i * 2,
                      repeat: Infinity,
                      delay: i * 2,
                      ease: "easeInOut"
                    }}
                    className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
                    style={{
                      left: `${30 + i * 20}%`,
                      top: `${20 + i * 25}%`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}