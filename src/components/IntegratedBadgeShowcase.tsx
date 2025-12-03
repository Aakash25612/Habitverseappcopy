import { motion } from 'motion/react';
import { Crown, Award, Target, Zap, Flame, Star } from 'lucide-react';

interface IntegratedBadgeShowcaseProps {
  size?: number;
  className?: string;
  variant?: 'achievement' | 'milestone' | 'streak' | 'master' | 'legend';
  day?: number;
  animate?: boolean;
}

export function IntegratedBadgeShowcase({ 
  size = 90, 
  className = "",
  variant = 'achievement',
  day = 1,
  animate = true
}: IntegratedBadgeShowcaseProps) {
  
  const getBadgeConfig = () => {
    if (day >= 30) {
      return {
        type: 'legend',
        icon: Crown,
        gradient: 'from-yellow-400 via-orange-400 to-red-400',
        glowColor: 'rgba(251, 191, 36, 0.8)',
        bgGradient: 'from-yellow-900/80 to-orange-900/80',
        borderColor: 'border-yellow-400/60',
        title: 'LEGEND',
        symbol: '👑'
      };
    } else if (day >= 21) {
      return {
        type: 'master',
        icon: Award,
        gradient: 'from-purple-400 via-pink-400 to-purple-600',
        glowColor: 'rgba(139, 92, 246, 0.8)',
        bgGradient: 'from-purple-900/80 to-pink-900/80',
        borderColor: 'border-purple-400/60',
        title: 'MASTER',
        symbol: '🏆'
      };
    } else if (day >= 14) {
      return {
        type: 'streak',
        icon: Flame,
        gradient: 'from-orange-400 via-red-400 to-pink-400',
        glowColor: 'rgba(251, 146, 60, 0.8)',
        bgGradient: 'from-orange-900/80 to-red-900/80',
        borderColor: 'border-orange-400/60',
        title: 'STREAK',
        symbol: '🔥'
      };
    } else if (day >= 7) {
      return {
        type: 'milestone',
        icon: Target,
        gradient: 'from-green-400 via-emerald-400 to-teal-400',
        glowColor: 'rgba(34, 197, 94, 0.8)',
        bgGradient: 'from-green-900/80 to-emerald-900/80',
        borderColor: 'border-green-400/60',
        title: 'RISING',
        symbol: '⭐'
      };
    } else {
      return {
        type: 'achievement',
        icon: Zap,
        gradient: 'from-blue-400 via-cyan-400 to-blue-600',
        glowColor: 'rgba(59, 130, 246, 0.8)',
        bgGradient: 'from-blue-900/80 to-cyan-900/80',
        borderColor: 'border-blue-400/60',
        title: 'CHAMPION',
        symbol: '⚡'
      };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      animate={animate ? {
        scale: [1, 1.02, 1],
        y: [0, -2, 0]
      } : undefined}
      whileHover={{
        scale: 1.05,
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ 
        width: size, 
        height: size,
        perspective: '1000px'
      }}
    >
      {/* Outer Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={animate ? {
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1]
        } : undefined}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
          filter: "blur(12px)"
        }}
      />

      {/* Main Badge Container */}
      <motion.div
        className={`relative w-full h-full bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm rounded-2xl border-2 ${config.borderColor} overflow-hidden`}
        whileHover={{
          rotateY: 5,
          rotateX: 5,
          transition: { duration: 0.3 }
        }}
        style={{
          transformStyle: "preserve-3d"
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-2 left-2 w-4 h-4 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 border border-white/20 rounded-full"></div>
          <div className="absolute top-4 right-4 w-1 h-1 bg-white/30 rounded-full"></div>
        </div>

        {/* Main Icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={animate ? {
              scale: [1, 1.1, 1],
              filter: [
                `drop-shadow(0 4px 8px ${config.glowColor})`,
                `drop-shadow(0 6px 16px ${config.glowColor})`,
                `drop-shadow(0 4px 8px ${config.glowColor})`
              ]
            } : undefined}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-1"
          >
            <IconComponent className={`w-8 h-8 text-white`} />
          </motion.div>
          
          {/* Badge Title */}
          <motion.div
            className="text-xs font-bold text-white/90 tracking-wider"
            animate={animate ? {
              opacity: [0.8, 1, 0.8]
            } : undefined}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {config.title}
          </motion.div>
        </div>

        {/* Floating Particles */}
        {animate && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -20, -40]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Corner Accents */}
        <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-white/30 rounded-tl"></div>
        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-white/30 rounded-br"></div>

        {/* Shimmer Effect */}
        <motion.div
          animate={animate ? {
            x: ['-100%', '100%'],
            opacity: [0, 0.3, 0]
          } : undefined}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </motion.div>

      {/* Achievement Stars */}
      {day >= 7 && (
        <motion.div
          className="absolute -top-2 -right-2"
          animate={animate ? {
            scale: [0.8, 1.2, 0.8],
            opacity: [0.6, 1, 0.6]
          } : undefined}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
        </motion.div>
      )}

      {day >= 14 && (
        <motion.div
          className="absolute -top-2 -left-2"
          animate={animate ? {
            scale: [0.8, 1.1, 0.8],
            opacity: [0.7, 1, 0.7]
          } : undefined}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Star className="w-3 h-3 text-blue-400 fill-current" />
        </motion.div>
      )}

      {day >= 21 && (
        <motion.div
          className="absolute -bottom-2 -right-2"
          animate={animate ? {
            scale: [0.9, 1.3, 0.9],
            opacity: [0.8, 1, 0.8]
          } : undefined}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Star className="w-3 h-3 text-purple-400 fill-current" />
        </motion.div>
      )}
    </motion.div>
  );
}