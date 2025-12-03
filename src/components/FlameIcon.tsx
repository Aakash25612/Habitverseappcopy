import { motion } from 'motion/react';
import { Flame } from 'lucide-react';

interface FlameIconProps {
  streak: number;
  className?: string;
}

export function FlameIcon({ streak, className = "" }: FlameIconProps) {
  // Get flame characteristics based on streak - progressive upgrades!
  const getFlameConfig = (streakDays: number) => {
    if (streakDays >= 30) {
      // LEGENDARY - Ultra rainbow fire
      return {
        size: '2rem',
        gradient: 'linear-gradient(135deg, #FFD700, #FF6B00, #FF1493, #8B00FF, #00FFFF)',
        shadowColor: 'rgba(255, 215, 0, 0.9)',
        glowSize: '20px',
        glowIntensity: 'legendary',
        particles: 8,
        ringColor: '#FFD700',
        ringGlow: 'rgba(255, 215, 0, 0.8)'
      };
    } else if (streakDays >= 21) {
      // EPIC - Rainbow fire
      return {
        size: '1.85rem',
        gradient: 'linear-gradient(135deg, #FF00FF, #FF1493, #FF6B00, #FFD700)',
        shadowColor: 'rgba(255, 0, 255, 0.8)',
        glowSize: '18px',
        glowIntensity: 'epic',
        particles: 6,
        ringColor: '#FF00FF',
        ringGlow: 'rgba(255, 0, 255, 0.7)'
      };
    } else if (streakDays >= 14) {
      // RARE - Purple/Pink fire
      return {
        size: '1.7rem',
        gradient: 'linear-gradient(135deg, #8B00FF, #FF00FF, #FF6B00)',
        shadowColor: 'rgba(139, 0, 255, 0.7)',
        glowSize: '16px',
        glowIntensity: 'rare',
        particles: 5,
        ringColor: '#8B00FF',
        ringGlow: 'rgba(139, 0, 255, 0.6)'
      };
    } else if (streakDays >= 7) {
      // UNCOMMON - Blue/Orange fire
      return {
        size: '1.5rem',
        gradient: 'linear-gradient(135deg, #00BFFF, #FF6B00, #FFD700)',
        shadowColor: 'rgba(0, 191, 255, 0.6)',
        glowSize: '14px',
        glowIntensity: 'uncommon',
        particles: 4,
        ringColor: '#00BFFF',
        ringGlow: 'rgba(0, 191, 255, 0.5)'
      };
    } else if (streakDays >= 3) {
      // COMMON - Orange fire with glow
      return {
        size: '1.35rem',
        gradient: 'linear-gradient(135deg, #FF8A00, #FF6B00)',
        shadowColor: 'rgba(255, 107, 0, 0.5)',
        glowSize: '12px',
        glowIntensity: 'common',
        particles: 3,
        ringColor: '#FF8A00',
        ringGlow: 'rgba(255, 138, 0, 0.4)'
      };
    } else if (streakDays > 0) {
      // STARTER - Small fire
      return {
        size: '1.2rem',
        gradient: 'linear-gradient(135deg, #FF8A00, #FF4500)',
        shadowColor: 'rgba(255, 69, 0, 0.3)',
        glowSize: '8px',
        glowIntensity: 'starter',
        particles: 2,
        ringColor: '#FF4500',
        ringGlow: 'rgba(255, 69, 0, 0.3)'
      };
    } else {
      // NO STREAK - Gray/inactive
      return {
        size: '1.2rem',
        gradient: 'linear-gradient(135deg, #6B7280, #4B5563)',
        shadowColor: 'rgba(75, 85, 99, 0.2)',
        glowSize: '0px',
        glowIntensity: 'none',
        particles: 0,
        ringColor: '#6B7280',
        ringGlow: 'rgba(107, 114, 128, 0)'
      };
    }
  };

  const config = getFlameConfig(streak);

  // Dynamic flicker based on intensity
  const flickerAnimation = {
    scale: config.glowIntensity === 'legendary' ? [1, 1.15, 1.05, 1.1, 1] :
           config.glowIntensity === 'epic' ? [1, 1.12, 1.04, 1.08, 1] :
           config.glowIntensity === 'rare' ? [1, 1.1, 1.03, 1.06, 1] :
           [1, 1.05, 1.02, 1.03, 1],
    rotateZ: [-2, 2, -1.5, 1.5, 0]
  };

  const flickerTransition = {
    duration: config.glowIntensity === 'legendary' ? 1.5 : 
              config.glowIntensity === 'epic' ? 1.8 : 
              config.glowIntensity === 'rare' ? 2 : 2.5,
    repeat: Infinity,
    ease: "easeInOut",
    times: [0, 0.25, 0.5, 0.75, 1]
  };

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: '48px', height: '48px' }}
    >
      {/* Outer glow ring for high streaks */}
      {streak >= 7 && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${config.ringGlow} 0%, transparent 70%)`,
            filter: `blur(${config.glowSize})`
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Rotating ring for legendary/epic streaks */}
      {streak >= 21 && (
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div 
            className="absolute w-1 h-1 rounded-full top-0 left-1/2 -translate-x-1/2"
            style={{
              background: config.ringColor,
              boxShadow: `0 0 8px ${config.ringColor}`
            }}
          />
          <div 
            className="absolute w-1 h-1 rounded-full bottom-0 left-1/2 -translate-x-1/2"
            style={{
              background: config.ringColor,
              boxShadow: `0 0 8px ${config.ringColor}`
            }}
          />
          <div 
            className="absolute w-1 h-1 rounded-full left-0 top-1/2 -translate-y-1/2"
            style={{
              background: config.ringColor,
              boxShadow: `0 0 8px ${config.ringColor}`
            }}
          />
          <div 
            className="absolute w-1 h-1 rounded-full right-0 top-1/2 -translate-y-1/2"
            style={{
              background: config.ringColor,
              boxShadow: `0 0 8px ${config.ringColor}`
            }}
          />
        </motion.div>
      )}

      {/* Main Flame Icon with gradient overlay */}
      <motion.div
        animate={flickerAnimation}
        transition={flickerTransition}
        className="relative z-10"
        style={{
          filter: `drop-shadow(0 2px ${config.glowSize} ${config.shadowColor})`,
        }}
      >
        {/* Gradient overlay effect */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: config.gradient,
            mixBlendMode: 'screen',
            opacity: streak > 0 ? 0.6 : 0.3,
            filter: 'blur(4px)',
            transform: 'scale(1.2)'
          }}
        />
        
        {/* Lucide Flame Icon */}
        <div 
          className="relative z-10"
          style={{ 
            fill: streak === 0 ? '#6B7280' : 'currentColor',
            color: streak === 0 ? '#4B5563' : '#FF6B00',
            filter: streak === 0 ? 'grayscale(100%) brightness(0.7)' : 'none'
          }}
        >
          <Flame size={config.size} fill="currentColor" />
        </div>
      </motion.div>

      {/* Rising particles/embers */}
      {config.particles > 0 && Array.from({ length: config.particles }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FF6B00' : '#FF00FF',
            left: `${50 + (Math.sin((i * Math.PI * 2) / config.particles) * 25)}%`,
            boxShadow: `0 0 4px ${i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FF6B00' : '#FF00FF'}`
          }}
          animate={{
            y: [0, -25, -30],
            x: [0, (i % 2 === 0 ? 5 : -5), (i % 2 === 0 ? 8 : -8)],
            opacity: [0, 0.8, 0],
            scale: [0.3, 1.2, 0.2]
          }}
          transition={{
            duration: 2 + (i * 0.3),
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Sparkles for 14+ day streaks */}
      {streak >= 14 && Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${50 + (Math.cos((i * Math.PI * 2) / 4) * 30)}%`,
            top: `${50 + (Math.sin((i * Math.PI * 2) / 4) * 30)}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        >
          <div 
            className="w-1 h-1"
            style={{
              background: config.ringColor,
              boxShadow: `0 0 6px ${config.ringColor}`,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}