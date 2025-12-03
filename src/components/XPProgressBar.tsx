import { motion } from 'motion/react';
import { useState } from 'react';

interface XPProgressBarProps {
  isInitialLoad?: boolean;
  onLevelUp?: () => void;
  currentXP?: number;
  level?: number;
}

export function XPProgressBar({ isInitialLoad = true, onLevelUp, currentXP = 1247, level = 8 }: XPProgressBarProps) {
  const maxXP = 1500; // XP required per level
  const levelXP = currentXP % maxXP; // XP within current level
  const progress = (levelXP / maxXP) * 100;
  const xpToNext = maxXP - levelXP;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isInitialLoad ? 0.5 : 0.1, duration: isInitialLoad ? 0.6 : 0.3 }}
      className="mb-6"
    >
      {/* XP Progress Bar */}
      <motion.div 
        className="relative w-full bg-gray-800/60 rounded-full h-3 overflow-hidden mb-3"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 24px rgba(168, 119, 255, 0.3)'
        }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: isInitialLoad ? 0.6 : 0.15, duration: 0.4 }}
      >
        {/* Progress Fill */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            delay: isInitialLoad ? 0.8 : 0.2, 
            duration: isInitialLoad ? 1.2 : 0.6, 
            ease: "easeOut"
          }}
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #8B5FFF 0%, #A877FF 50%, #B485FF 100%)',
            boxShadow: '0 0 20px rgba(168, 119, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Constant shining effect */}
          <motion.div
            animate={{
              x: ['-150%', '250%'],
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.2
            }}
            className="absolute inset-0 w-1/2"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.6) 70%, transparent 100%)',
              filter: 'blur(0.5px)'
            }}
          />
          
          {/* Additional purple glow effect */}
          <motion.div
            animate={{ 
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(139, 95, 255, 0.3) 0%, rgba(168, 119, 255, 0.4) 50%, rgba(180, 133, 255, 0.3) 100%)',
              boxShadow: 'inset 0 0 8px rgba(168, 119, 255, 0.4)'
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Labels */}
      <div className="flex justify-between items-center">
        <span 
          className="text-gray-400"
          style={{ 
            fontSize: '12px', 
            fontWeight: '500',
            textShadow: '0 0 8px rgba(168, 119, 255, 0.4), 0 0 16px rgba(168, 119, 255, 0.2)',
            filter: 'drop-shadow(0 0 4px rgba(168, 119, 255, 0.3))'
          }}
        >
          XP Progress
        </span>
        <span 
          className="font-medium"
          style={{ 
            fontSize: '12px',
            background: 'linear-gradient(135deg, #A877FF 0%, #6DD5FA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 12px rgba(168, 119, 255, 0.6), 0 0 24px rgba(168, 119, 255, 0.3)',
            filter: 'drop-shadow(0 0 6px rgba(168, 119, 255, 0.5))'
          }}
        >
          {xpToNext} XP to next level
        </span>
      </div>
    </motion.div>
  );
}