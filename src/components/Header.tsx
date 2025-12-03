import { motion } from 'motion/react';
import { Award } from 'lucide-react';
import { useState } from 'react';
import { StarField } from './StarField';

interface HeaderProps {
  isInitialLoad?: boolean;
  onLevelUpDemo?: () => void;
  level?: number;
  currentXP?: number;
}

export function Header({ isInitialLoad = true, onLevelUpDemo, level = 8, currentXP = 1247 }: HeaderProps) {
  const maxXP = 1500;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isInitialLoad ? 0.6 : 0.2 }}
      className="mb-4"
    >
      {/* Main Header with Level Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: isInitialLoad ? 0.2 : 0, duration: isInitialLoad ? 0.8 : 0.3 }}
            className="text-white"
            style={{ 
              fontSize: '24px',
              fontWeight: 'bold',
              lineHeight: '1.2'
            }}
          >
            Welcome back, Champion
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: isInitialLoad ? 0.3 : 0.1, duration: isInitialLoad ? 0.8 : 0.3 }}
            className="text-gray-400 mt-1"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Day 12 of greatness
          </motion.p>
        </div>
        
        {/* Level Badge with Star Field */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: isInitialLoad ? 0.4 : 0.1, duration: isInitialLoad ? 0.5 : 0.3 }}
          className="relative"
        >
          {/* Star Field Animation - positioned below the badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: isInitialLoad ? 1.2 : 0.6, duration: 1 }}
            className="absolute -bottom-2 -right-2 z-0"
          >
            <StarField width={90} height={50} starCount={6} />
          </motion.div>
          {/* Pulsing Aura Background */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'radial-gradient(circle, rgba(255, 195, 0, 0.2) 0%, rgba(255, 138, 0, 0.1) 50%, transparent 70%)',
              width: '110px',
              height: '50px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative z-10 text-right">
            <div className="flex items-center gap-1 justify-end mb-1">
              <Award className="w-4 h-4" style={{ color: '#FFC300' }} />
              <span 
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #FFC300 0%, #FF8A00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 8px rgba(255, 195, 0, 0.4))',
                }}
              >
                Level {level}
              </span>
            </div>
            <div 
              className="text-gray-400"
              style={{ 
                fontSize: '12px', 
                fontWeight: '500',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {currentXP}/{maxXP} XP
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}