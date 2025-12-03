import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles } from 'lucide-react';

interface RewardToastProps {
  isVisible: boolean;
  title: string;
  subtitle?: string;
  onDismiss: () => void;
}

export function RewardToast({ isVisible, title, subtitle, onDismiss }: RewardToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
          onAnimationComplete={() => {
            setTimeout(onDismiss, 2500);
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-900 px-6 py-4 rounded-2xl shadow-2xl border border-yellow-400/50 max-w-sm"
            style={{
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: 2
                }}
                className="flex-shrink-0"
              >
                <Trophy className="w-6 h-6 text-yellow-900" />
              </motion.div>
              
              <div className="flex-1">
                <h3 className="font-bold text-sm">{title}</h3>
                {subtitle && (
                  <p className="text-xs opacity-90 mt-1">{subtitle}</p>
                )}
              </div>
              
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-5 h-5 text-yellow-900" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}