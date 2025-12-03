import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface EnhancedFlameIconProps {
  streak: number;
  className?: string;
  onStreakIncrease?: () => void;
}

export function EnhancedFlameIcon({ streak, className = "", onStreakIncrease }: EnhancedFlameIconProps) {
  const [previousStreak, setPreviousStreak] = useState(streak);
  const [showStreakBump, setShowStreakBump] = useState(false);

  // Detect streak increase
  useEffect(() => {
    if (streak > previousStreak) {
      setShowStreakBump(true);
      onStreakIncrease?.();
      setTimeout(() => setShowStreakBump(false), 1000);
    }
    setPreviousStreak(streak);
  }, [streak, previousStreak, onStreakIncrease]);

  // Get flame characteristics based on streak
  const getFlameConfig = (streakDays: number) => {
    if (streakDays >= 11) {
      return {
        size: 'w-7 h-7',
        colors: {
          primary: '#A877FF',
          secondary: '#FF8A00',
          accent: '#FFC300'
        },
        intensity: 'high',
        particles: true,
        aura: true
      };
    } else if (streakDays >= 4) {
      return {
        size: 'w-6 h-6',
        colors: {
          primary: '#FFC300',
          secondary: '#FF8A00',
          accent: '#FFD700'
        },
        intensity: 'medium',
        particles: false,
        aura: false
      };
    } else {
      return {
        size: 'w-5 h-5',
        colors: {
          primary: '#FF8A00',
          secondary: '#FFB347',
          accent: '#FF8A00'
        },
        intensity: 'low',
        particles: false,
        aura: false
      };
    }
  };

  const config = getFlameConfig(streak);

  // Organic flicker animation
  const flickerAnimation = {
    scale: [1, 1.05, 0.98, 1.02, 1],
    rotateZ: [-1, 1, -0.5, 0.5, 0],
    opacity: [0.85, 1, 0.9, 1, 0.95]
  };

  const flickerTransition = {
    duration: config.intensity === 'high' ? 1.2 : config.intensity === 'medium' ? 1.5 : 1.8,
    repeat: Infinity,
    ease: "easeInOut",
    times: [0, 0.25, 0.5, 0.75, 1]
  };

  // Particle animation for high-intensity flames
  const particleCount = config.particles ? 6 : 0;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Main Flame Container */}
      <motion.div
        animate={flickerAnimation}
        transition={flickerTransition}
        className={`relative ${config.size} flex items-center justify-center`}
      >
        {/* Aura Glow for 11+ streaks */}
        {config.aura && (
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${config.colors.primary}40 0%, ${config.colors.secondary}20 50%, transparent 70%)`,
              filter: 'blur(8px)',
              width: '200%',
              height: '200%',
              left: '-50%',
              top: '-50%'
            }}
          />
        )}

        {/* Core Flame SVG */}
        <motion.div
          animate={showStreakBump ? {
            scale: [1, 1.3, 1],
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
          } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <svg
            viewBox="0 0 24 24"
            className={`${config.size}`}
            style={{ filter: 'drop-shadow(0 2px 8px rgba(255, 138, 0, 0.4))' }}
          >
            {/* Flame Path with Gradient */}
            <defs>
              <linearGradient id={`flameGradient-${streak}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={config.colors.primary} />
                <stop offset="50%" stopColor={config.colors.secondary} />
                <stop offset="100%" stopColor={config.colors.accent} />
              </linearGradient>
              
              {/* Inner glow gradient */}
              <radialGradient id={`flameInner-${streak}`} cx="50%" cy="70%" r="60%">
                <stop offset="0%" stopColor={config.colors.accent} stopOpacity="0.8" />
                <stop offset="100%" stopColor={config.colors.primary} stopOpacity="0.9" />
              </radialGradient>
            </defs>
            
            {/* Main flame shape */}
            <motion.path
              d="M12 2C8.5 6 7 10 8.5 13.5C10 17 12 18 12 18C12 18 14 17 15.5 13.5C17 10 15.5 6 12 2Z"
              fill={`url(#flameGradient-${streak})`}
              animate={{
                d: [
                  "M12 2C8.5 6 7 10 8.5 13.5C10 17 12 18 12 18C12 18 14 17 15.5 13.5C17 10 15.5 6 12 2Z",
                  "M12 2C8.2 6.2 6.8 10.2 8.7 13.7C10.3 17.2 12 18 12 18C12 18 13.7 17.2 15.3 13.7C17.2 10.2 15.8 6.2 12 2Z",
                  "M12 2C8.8 5.8 7.2 9.8 8.3 13.3C9.7 16.8 12 18 12 18C12 18 14.3 16.8 15.7 13.3C16.8 9.8 15.2 5.8 12 2Z",
                  "M12 2C8.5 6 7 10 8.5 13.5C10 17 12 18 12 18C12 18 14 17 15.5 13.5C17 10 15.5 6 12 2Z"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Inner flame highlight */}
            <motion.path
              d="M12 5C10 8 9.5 11 11 13.5C12.5 16 12 16.5 12 16.5C12 16.5 11.5 16 13 13.5C14.5 11 14 8 12 5Z"
              fill={`url(#flameInner-${streak})`}
              opacity="0.7"
              animate={{
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>

        {/* Floating Particles for high-intensity flames */}
        {config.particles && Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? config.colors.accent : config.colors.secondary,
              left: `${50 + (Math.random() - 0.5) * 100}%`,
              top: `${50 + (Math.random() - 0.5) * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.3]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Streak Number with Shimmer Effect */}
      <motion.div
        animate={showStreakBump ? {
          scale: [1, 1.2, 1],
          textShadow: [
            '0 0 0px rgba(255, 255, 255, 0)',
            '0 0 10px rgba(255, 255, 255, 0.8)',
            '0 0 0px rgba(255, 255, 255, 0)'
          ]
        } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="ml-2 text-white font-bold text-sm relative"
      >
        {streak}
        
        {/* Shimmer overlay on streak increase */}
        {showStreakBump && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ transform: 'skewX(-20deg)' }}
          />
        )}
      </motion.div>
    </div>
  );
}