import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface RealisticFlameIconProps {
  streak: number;
  className?: string;
  onStreakIncrease?: () => void;
}

export function RealisticFlameIcon({ streak, className = "", onStreakIncrease }: RealisticFlameIconProps) {
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
        size: 'w-6 h-6',
        colors: {
          primary: '#FF6B00',
          secondary: '#FF8F00', 
          accent: '#A877FF',
          inner: '#FFB347'
        },
        intensity: 'high',
        particles: true,
        aura: true,
        glowSize: 'large'
      };
    } else if (streakDays >= 4) {
      return {
        size: 'w-5 h-5',
        colors: {
          primary: '#FF6B00',
          secondary: '#FF8F00',
          accent: '#FFC300',
          inner: '#FFD700'
        },
        intensity: 'medium',
        particles: false,
        aura: false,
        glowSize: 'medium'
      };
    } else {
      return {
        size: 'w-4 h-4',
        colors: {
          primary: '#FF8A00',
          secondary: '#FFB347',
          accent: '#FF8A00',
          inner: '#FFA500'
        },
        intensity: 'low',
        particles: false,
        aura: false,
        glowSize: 'small'
      };
    }
  };

  const config = getFlameConfig(streak);

  // Realistic flame path that matches the reference image
  const flameMainPath = "M12 21C12 21 6 18 6 12C6 8 8 6 10 4C11 3 12 2 12 2C12 2 13 3 14 4C16 6 18 8 18 12C18 18 12 21 12 21Z";
  const flameLeftTongue = "M10 4C10 4 8 6 8 9C8 12 10 14 11 15C10.5 13 10 10 10 8C10 6.5 10 4 10 4Z";
  const flameRightTongue = "M14 4C14 4 16 6 16 9C16 12 14 14 13 15C13.5 13 14 10 14 8C14 6.5 14 4 14 4Z";
  const flameCenterTongue = "M12 2C12 2 11 4 11 7C11 10 12 12 12 14C12 12 13 10 13 7C13 4 12 2 12 2Z";

  // Organic flicker animation variations
  const getFlickerAnimation = (intensity: string) => {
    const baseFlicker = {
      scale: [1, 1.03, 0.97, 1.01, 1],
      rotateZ: [-0.5, 0.5, -0.3, 0.3, 0],
    };

    if (intensity === 'high') {
      return {
        ...baseFlicker,
        scale: [1, 1.05, 0.95, 1.02, 1],
        rotateZ: [-1, 1, -0.5, 0.7, 0]
      };
    } else if (intensity === 'medium') {
      return {
        ...baseFlicker,
        scale: [1, 1.04, 0.96, 1.01, 1]
      };
    }
    return baseFlicker;
  };

  const flickerAnimation = getFlickerAnimation(config.intensity);

  const flickerTransition = {
    duration: config.intensity === 'high' ? 1.5 : config.intensity === 'medium' ? 2 : 2.5,
    repeat: Infinity,
    ease: "easeInOut",
    times: [0, 0.25, 0.5, 0.75, 1]
  };

  // Particle count for high-intensity flames
  const particleCount = config.particles ? 8 : 0;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Main Flame Container */}
      <motion.div
        animate={flickerAnimation}
        transition={flickerTransition}
        className={`relative ${config.size} flex items-center justify-center`}
      >
        {/* Purple Aura for 11+ streaks */}
        {config.aura && (
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${config.colors.accent}30 0%, ${config.colors.accent}15 40%, transparent 70%)`,
              filter: 'blur(12px)',
              width: '250%',
              height: '250%',
              left: '-75%',
              top: '-75%'
            }}
          />
        )}

        {/* Realistic Flame SVG */}
        <motion.div
          animate={showStreakBump ? {
            scale: [1, 1.4, 1],
            filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
          } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <svg
            viewBox="0 0 24 24"
            className={`${config.size}`}
            style={{ 
              filter: `drop-shadow(0 2px 8px ${config.colors.primary}66) drop-shadow(0 0 4px ${config.colors.secondary}44)` 
            }}
          >
            <defs>
              {/* Main flame gradient */}
              <linearGradient id={`flameGradient-${streak}`} x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={config.colors.primary} />
                <stop offset="40%" stopColor={config.colors.secondary} />
                <stop offset="70%" stopColor={config.colors.accent} />
                <stop offset="100%" stopColor={config.colors.inner} />
              </linearGradient>
              
              {/* Inner highlight gradient */}
              <radialGradient id={`flameInner-${streak}`} cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor={config.colors.inner} stopOpacity="0.9" />
                <stop offset="100%" stopColor={config.colors.primary} stopOpacity="0.7" />
              </radialGradient>

              {/* Core hotspot */}
              <radialGradient id={`flameCore-${streak}`} cx="50%" cy="75%" r="30%">
                <stop offset="0%" stopColor="#FFFF99" stopOpacity="0.8" />
                <stop offset="100%" stopColor={config.colors.accent} stopOpacity="0.4" />
              </radialGradient>
            </defs>
            
            {/* Main flame body with realistic shape */}
            <motion.path
              d={flameMainPath}
              fill={`url(#flameGradient-${streak})`}
              animate={{
                d: [
                  "M12 21C12 21 6 18 6 12C6 8 8 6 10 4C11 3 12 2 12 2C12 2 13 3 14 4C16 6 18 8 18 12C18 18 12 21 12 21Z",
                  "M12 21C12 21 5.8 17.8 5.8 12C5.8 8.2 8.2 5.8 10.2 3.8C11.2 2.8 12 2 12 2C12 2 12.8 2.8 13.8 3.8C15.8 5.8 18.2 8.2 18.2 12C18.2 17.8 12 21 12 21Z",
                  "M12 21C12 21 6.2 18.2 6.2 12C6.2 7.8 7.8 6.2 9.8 4.2C10.8 3.2 12 2 12 2C12 2 13.2 3.2 14.2 4.2C16.2 6.2 17.8 7.8 17.8 12C17.8 18.2 12 21 12 21Z",
                  "M12 21C12 21 6 18 6 12C6 8 8 6 10 4C11 3 12 2 12 2C12 2 13 3 14 4C16 6 18 8 18 12C18 18 12 21 12 21Z"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Left flame tongue */}
            <motion.path
              d={flameLeftTongue}
              fill={`url(#flameInner-${streak})`}
              opacity="0.8"
              animate={{
                d: [
                  "M10 4C10 4 8 6 8 9C8 12 10 14 11 15C10.5 13 10 10 10 8C10 6.5 10 4 10 4Z",
                  "M10 4C10 4 7.8 6.2 7.8 9.2C7.8 12.2 10.2 14.2 11.2 15.2C10.3 13.2 9.8 10.2 9.8 8.2C9.8 6.3 10 4 10 4Z",
                  "M10 4C10 4 8.2 5.8 8.2 8.8C8.2 11.8 9.8 13.8 10.8 14.8C10.7 12.8 10.2 9.8 10.2 7.8C10.2 6.7 10 4 10 4Z",
                  "M10 4C10 4 8 6 8 9C8 12 10 14 11 15C10.5 13 10 10 10 8C10 6.5 10 4 10 4Z"
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            {/* Right flame tongue */}
            <motion.path
              d={flameRightTongue}
              fill={`url(#flameInner-${streak})`}
              opacity="0.8"
              animate={{
                d: [
                  "M14 4C14 4 16 6 16 9C16 12 14 14 13 15C13.5 13 14 10 14 8C14 6.5 14 4 14 4Z",
                  "M14 4C14 4 16.2 6.2 16.2 9.2C16.2 12.2 13.8 14.2 12.8 15.2C13.7 13.2 14.2 10.2 14.2 8.2C14.2 6.3 14 4 14 4Z",
                  "M14 4C14 4 15.8 5.8 15.8 8.8C15.8 11.8 14.2 13.8 13.2 14.8C13.3 12.8 13.8 9.8 13.8 7.8C13.8 6.7 14 4 14 4Z",
                  "M14 4C14 4 16 6 16 9C16 12 14 14 13 15C13.5 13 14 10 14 8C14 6.5 14 4 14 4Z"
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8
              }}
            />
            
            {/* Center flame tongue */}
            <motion.path
              d={flameCenterTongue}
              fill={`url(#flameCore-${streak})`}
              opacity="0.9"
              animate={{
                d: [
                  "M12 2C12 2 11 4 11 7C11 10 12 12 12 14C12 12 13 10 13 7C13 4 12 2 12 2Z",
                  "M12 2C12 2 10.8 4.2 10.8 7.2C10.8 10.2 12 12.2 12 14.2C12 12.2 13.2 10.2 13.2 7.2C13.2 4.2 12 2 12 2Z",
                  "M12 2C12 2 11.2 3.8 11.2 6.8C11.2 9.8 11.8 11.8 11.8 13.8C11.8 11.8 12.2 9.8 12.2 6.8C12.2 3.8 12 2 12 2Z",
                  "M12 2C12 2 11 4 11 7C11 10 12 12 12 14C12 12 13 10 13 7C13 4 12 2 12 2Z"
                ]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
          </svg>
        </motion.div>

        {/* Floating Particles for high-intensity flames */}
        {config.particles && Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full"
            style={{
              background: i % 3 === 0 ? config.colors.accent : i % 3 === 1 ? config.colors.inner : config.colors.secondary,
              left: `${50 + (Math.random() - 0.5) * 60}%`,
              top: `${60 + (Math.random() - 0.5) * 40}%`,
            }}
            animate={{
              y: [-15, -35, -15],
              x: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8],
              opacity: [0, 0.8, 0],
              scale: [0.3, 1, 0.2]
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.8,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Streak Number with Enhanced Styling */}
      <motion.div
        animate={showStreakBump ? {
          scale: [1, 1.15, 1],
          textShadow: [
            '0 0 0px rgba(255, 255, 255, 0)',
            '0 0 8px rgba(255, 255, 255, 0.9)',
            '0 0 0px rgba(255, 255, 255, 0)'
          ]
        } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="ml-2 font-bold text-sm relative"
        style={{ 
          color: '#FFFFFF',
          textShadow: `0 1px 2px ${config.colors.primary}88`
        }}
      >
        {streak}
        
        {/* Shimmer overlay on streak increase */}
        {showStreakBump && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{ transform: 'skewX(-20deg)' }}
          />
        )}
      </motion.div>
    </div>
  );
}