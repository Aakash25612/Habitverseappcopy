import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { MoreVertical, Crown, Award, Lock, Calendar, Target } from 'lucide-react';
import { BadgeEllipsisMenu } from './BadgeEllipsisMenu';

export interface Badge {
  id: string;
  type: 'gold30' | 'prestige60' | 'locked';
  habitId: string;
  habitName: string;
  habitIcon: string;
  isUnlocked: boolean;
  progress?: {
    current: number;
    target: number;
  };
  unlockedDate?: Date;
  isFirstTime?: boolean;
  canPushToPrestige?: boolean;
}

interface BadgeCardProps {
  badge: Badge;
  onPushToPrestige?: (badgeId: string) => void;
  onSetAsShowcase?: (badgeId: string) => void;
  onViewHistory?: (badgeId: string) => void;
  onRemoveFromShelf?: (badgeId: string) => void;
}

export function BadgeCard({ 
  badge, 
  onPushToPrestige,
  onSetAsShowcase,
  onViewHistory,
  onRemoveFromShelf 
}: BadgeCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  // Shimmer animation cycle
  useEffect(() => {
    if (badge.isUnlocked && badge.type !== 'locked') {
      const interval = setInterval(() => {
        setIsShimmering(true);
        setTimeout(() => setIsShimmering(false), 1000);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [badge.isUnlocked, badge.type]);

  // Handle unlock animation
  useEffect(() => {
    if (badge.isUnlocked && badge.unlockedDate) {
      const timeSinceUnlock = Date.now() - badge.unlockedDate.getTime();
      if (timeSinceUnlock < 2000) {
        setJustUnlocked(true);
        setTimeout(() => setJustUnlocked(false), 2000);
      }
    }
  }, [badge.isUnlocked, badge.unlockedDate]);

  const getBadgeStyles = () => {
    switch (badge.type) {
      case 'gold30':
        return {
          gradient: 'linear-gradient(135deg, #C98F2B 0%, #F6C348 50%, #FFE08A 100%)',
          ringInner: '#8A5A14',
          ringOuter: '#FFEEB5',
          glow: '0 0 28px rgba(246, 195, 72, 0.2)',
          sparkleColor: '#FFE08A'
        };
      case 'prestige60':
        return {
          gradient: 'linear-gradient(135deg, #7A3CFF 0%, #B07CFF 50%, #E2C7FF 100%)',
          ringInner: '#3F2A90',
          ringOuter: '#DCC8FF',
          glow: '0 0 36px rgba(176, 124, 255, 0.23)',
          sparkleColor: '#E2C7FF'
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 50%, #D1D5DB 100%)',
          ringInner: '#374151',
          ringOuter: '#D1D5DB',
          glow: 'none',
          sparkleColor: '#D1D5DB'
        };
    }
  };

  const styles = getBadgeStyles();
  const isLocked = badge.type === 'locked' || !badge.isUnlocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <motion.div
        className="bg-[#14161C] border border-white/10 rounded-2xl p-4 h-[96px] flex items-center gap-4 relative overflow-hidden"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)' }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.12 }}
      >
        {/* Badge Medallion */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: isLocked ? 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)' : styles.gradient,
              boxShadow: isLocked ? 'none' : `
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                0 0 0 1px ${styles.ringInner},
                0 0 0 2px ${styles.ringOuter},
                ${styles.glow}
              `,
              filter: isLocked ? 'grayscale(1) opacity(0.6)' : 'none'
            }}
            animate={justUnlocked ? {
              scale: [0.9, 1.06, 1],
              transition: { duration: 0.45, ease: "easeOut" }
            } : {}}
          >
            {/* Shimmer Effect */}
            {!isLocked && (
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
                animate={isShimmering ? {
                  background: [
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'
                  ]
                } : {}}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            )}

            {/* Habit Icon */}
            <div className="relative z-10 text-2xl" style={{
              filter: isLocked ? 'none' : 'brightness(0.8) contrast(1.2)',
              mixBlendMode: isLocked ? 'normal' : 'multiply'
            }}>
              {badge.habitIcon}
            </div>

            {/* Sparkle Accents */}
            {!isLocked && (
              <>
                <motion.div
                  className="absolute top-2 right-2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: styles.sparkleColor }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: 0
                  }}
                />
                <motion.div
                  className="absolute bottom-3 left-2 w-0.5 h-0.5 rounded-full"
                  style={{ backgroundColor: styles.sparkleColor }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.7
                  }}
                />
              </>
            )}

            {/* Locked State */}
            {isLocked && (
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/8 flex items-center justify-center">
                <Lock className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </motion.div>

          {/* Unlock Sparkle Burst */}
          <AnimatePresence>
            {justUnlocked && (
              <motion.div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ 
                      backgroundColor: styles.sparkleColor,
                      left: '50%',
                      top: '50%'
                    }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos(i * 30 * Math.PI / 180) * 40,
                      y: Math.sin(i * 30 * Math.PI / 180) * 40
                    }}
                    transition={{
                      duration: 0.7,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Badge Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-white font-bold text-base truncate">
              {badge.habitName}
            </h3>
            {badge.progress && (
              <div className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs font-bold font-tabular">
                {badge.progress.current}/{badge.progress.target} days
              </div>
            )}
          </div>

          <p className="text-gray-400 text-xs mb-2 opacity-70">
            {badge.type === 'gold30' && badge.isUnlocked && '30 days unbroken—mastery achieved.'}
            {badge.type === 'prestige60' && badge.isUnlocked && '60 days unbroken—elite status.'}
            {badge.type === 'locked' && 'Finish 30 days to unlock'}
            {badge.progress && !badge.isUnlocked && `${badge.progress.target - badge.progress.current} days remaining`}
          </p>

          <div className="flex items-center justify-between">
            {badge.unlockedDate && (
              <span className="text-gray-500 text-xs">
                {badge.unlockedDate.toLocaleDateString()}
              </span>
            )}
            <div className="flex items-center gap-2">
              {/* Badge Label */}
              <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${
                badge.type === 'gold30' ? 'bg-yellow-500/20 text-yellow-400' :
                badge.type === 'prestige60' ? 'bg-purple-500/20 text-purple-400' :
                'bg-gray-500/20 text-gray-500'
              }`}>
                {badge.type === 'gold30' && (
                  <>
                    {badge.isFirstTime && <Crown className="w-3 h-3" />}
                    30 DAYS
                  </>
                )}
                {badge.type === 'prestige60' && (
                  <>
                    <Award className="w-3 h-3" />
                    PRESTIGE 60
                  </>
                )}
                {badge.type === 'locked' && 'LOCKED'}
              </div>
            </div>
          </div>
        </div>

        {/* Options Menu */}
        {badge.isUnlocked && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </motion.button>

            <BadgeEllipsisMenu
              isOpen={showMenu}
              onClose={() => setShowMenu(false)}
              badge={badge}
              onPushToPrestige={onPushToPrestige}
              onSetAsShowcase={onSetAsShowcase}
              onViewHistory={onViewHistory}
              onRemoveFromShelf={onRemoveFromShelf}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}