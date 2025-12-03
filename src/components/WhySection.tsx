import { motion } from 'motion/react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface WhySectionProps {
  isInitialLoad?: boolean;
}

export function WhySection({ isInitialLoad = true }: WhySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isInitialLoad ? 3 : 0.5, duration: isInitialLoad ? 0.6 : 0.3 }}
      className="mb-6"
    >
      {/* WHY am I doing this? Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-transparent border-2 border-purple-500 rounded-xl p-4 mb-4 transition-all duration-300 hover:bg-purple-500/10"
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 font-medium">WHY am I doing this?</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Your Why Card */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: isExpanded ? 0 : -20 }}
          transition={{ delay: isExpanded ? 0.2 : 0, duration: 0.3 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ delay: isExpanded ? 0.3 : 0, duration: 0.4 }}
            className="text-purple-400 text-2xl text-center mb-6"
          >
            Your Why
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isExpanded ? 1 : 0,
              y: isExpanded ? 0 : 10
            }}
            transition={{ delay: isExpanded ? 0.4 : 0, duration: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-white font-medium mb-2">Your Goal:</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Become the most disciplined, consistent, and successful version of yourself through daily habit building.
              </p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Your Struggle:</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Breaking through cycles of inconsistency and building lasting positive changes.
              </p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Why This Helps:</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Multiple small daily habits compound into massive life transformations. You're building the foundation of excellence.
              </p>
            </div>

            <motion.div
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
            >
              <p className="text-purple-300 text-sm">
                You're in the right place. Every login reminds you of your hard work. 💪
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}