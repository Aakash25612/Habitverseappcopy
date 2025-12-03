import { motion } from 'motion/react';
import { useState } from 'react';
import { Flame, Target, Star } from 'lucide-react';
import { StatsModal } from './StatsModal';

const stats = [
  {
    icon: Flame,
    value: '12',
    label: 'Best Streak',
    iconColor: '#FF8A00',
    bgColor: 'rgba(139, 69, 19, 0.3)',
    borderColor: 'rgba(139, 69, 19, 0.5)',
    delay: 0.9
  },
  {
    icon: Target,
    value: '2',
    label: 'Active Habits',
    iconColor: '#A877FF',
    bgColor: 'rgba(168, 119, 255, 0.15)',
    borderColor: 'rgba(168, 119, 255, 0.3)',
    delay: 1.0
  },
  {
    icon: Star,
    value: '8',
    label: 'Level',
    iconColor: '#FFC300',
    bgColor: 'rgba(255, 195, 0, 0.15)',
    borderColor: 'rgba(255, 195, 0, 0.3)',
    delay: 1.1
  }
];

interface StatsGridProps {
  isInitialLoad?: boolean;
  loginStreak?: number;
  totalXP?: number;
  level?: number;
}

export function StatsGrid({ isInitialLoad = true, loginStreak = 5, totalXP = 1200, level = 8 }: StatsGridProps) {
  const [showStatsModal, setShowStatsModal] = useState(false);
  
  const getDelay = (originalDelay: number) => {
    return isInitialLoad ? originalDelay : 0.2 + (originalDelay - 0.9) * 0.1;
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1
            }}
            transition={{ 
              delay: getDelay(stat.delay), 
              duration: 0.4,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.15 }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
            onClick={() => setShowStatsModal(true)}
            className="relative p-4 rounded-xl text-center cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${stat.bgColor}, rgba(0, 0, 0, 0.3))`,
              border: `1px solid ${stat.borderColor}`,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Icon with specific animations */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: getDelay(stat.delay) + 0.1, 
                duration: 0.3, 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="mb-3 flex justify-center relative"
            >
              {/* Flame animation for Best Streak */}
              {stat.label === 'Best Streak' && (
                <>
                  {/* Flame flicker effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 0.98, 1.02, 1],
                      rotate: [0, -1, 1, -0.5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${stat.iconColor}40 0%, transparent 70%)`,
                      filter: 'blur(3px)'
                    }}
                  />
                  {/* Flame particles */}
                  <motion.div
                    animate={{
                      y: [0, -4, -8, -12],
                      opacity: [0, 0.6, 0.3, 0],
                      scale: [0.5, 0.8, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute -top-2 left-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: stat.iconColor, transform: 'translateX(-50%)' }}
                  />
                </>
              )}

              {/* Orbiting particles for Active Habits */}
              {stat.label === 'Active Habits' && (
                <>
                  {/* Orbiting particles */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.5
                      }}
                      className="absolute inset-0"
                      style={{
                        transformOrigin: 'center'
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.4, 1, 0.4]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.2
                        }}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: stat.iconColor,
                          top: '10%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          filter: `drop-shadow(0 0 4px ${stat.iconColor})`
                        }}
                      />
                    </motion.div>
                  ))}
                  {/* Central glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${stat.iconColor}30 0%, transparent 70%)`
                    }}
                  />
                </>
              )}

              {/* Star sparkle for Level */}
              {stat.label === 'Level' && (
                <>
                  {/* Main star glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${stat.iconColor}60 0%, transparent 70%)`,
                      filter: 'blur(2px)'
                    }}
                  />
                  {/* Sparkle points */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3
                      }}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: stat.iconColor,
                        top: i === 0 ? '-4px' : i === 1 ? '50%' : i === 2 ? 'calc(100% + 4px)' : '50%',
                        left: i === 0 ? '50%' : i === 1 ? 'calc(100% + 4px)' : i === 2 ? '50%' : '-4px',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </>
              )}

              <stat.icon 
                className="w-6 h-6 relative z-10" 
                style={{ 
                  color: stat.iconColor,
                  filter: `drop-shadow(0 0 8px ${stat.iconColor}80)`
                }}
              />
            </motion.div>
            
            {/* Value */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: getDelay(stat.delay) + 0.2, 
                duration: 0.3 
              }}
              className="mb-1"
              style={{ 
                fontSize: '24px',
                fontWeight: 'bold',
                color: stat.iconColor,
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {stat.value}
            </motion.div>
            
            {/* Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: getDelay(stat.delay) + 0.25, 
                duration: 0.3 
              }}
              className="text-gray-400"
              style={{ 
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              {stat.label}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        loginStreak={loginStreak}
        totalXP={totalXP}
        level={level}
        isInAlliance={true}
      />
    </>
  );
}
