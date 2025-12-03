import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

const motivationalQuotes = [
  "90% won't stick to their goals... will you?",
  "Champions are built one habit at a time.",
  "Your only competition is who you were yesterday.",
  "Discipline is the bridge between goals and achievement.",
  "Excellence is not an act, but a habit.",
  "The pain of discipline weighs ounces, the pain of regret weighs tons.",
  "Success is the sum of small efforts repeated daily.",
  "Don't watch the clock; do what it does. Keep going.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "You don't have to be great to get started, but you have to get started to be great."
];

interface QuoteCardProps {
  isInitialLoad?: boolean;
}

export function QuoteCard({ isInitialLoad = true }: QuoteCardProps) {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    // Simulate "logging in" by changing quote on component mount
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: isInitialLoad ? 2 : 0.3, duration: isInitialLoad ? 0.6 : 0.3 }}
      className="mb-6"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 relative overflow-hidden"
      >
        <div className="flex items-start gap-3 relative z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-purple-500 mt-1"
          >
            <Heart className="w-5 h-5" />
          </motion.div>
          
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="text-gray-300 text-sm italic"
            >
              "{currentQuote}"
            </motion.p>
          </div>
        </div>

        {/* Animated purple lines */}
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        />
        
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
        />

        {/* Side accent lines */}
        <motion.div
          animate={{ 
            y: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent"
        />
        
        <motion.div
          animate={{ 
            y: ['100%', '-100%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent"
        />

        {/* Pulsing glow effect */}
        <motion.div
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.01, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/10 pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
}