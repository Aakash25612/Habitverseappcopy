import { motion } from 'motion/react';
import { Crown, Award, Edit3, Sparkles } from 'lucide-react';
import exampleImage from 'figma:asset/bce13fc6b54b1e41a722fa2718db1afe76e419d9.png';

interface HeroCardProps {
  level: number;
  xp: number;
  maxXp: number;
  isInitialLoad?: boolean;
  onAvatarClick?: () => void;
}

export function HeroCard({ level, xp, maxXp, isInitialLoad = true, onAvatarClick }: HeroCardProps) {
  const xpProgress = (xp / maxXp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: isInitialLoad ? 0.2 : 0.1, 
        duration: isInitialLoad ? 0.6 : 0.3,
        ease: "easeOut"
      }}
      className="relative mb-8 px-6"
    >
      {/* Hero Module with gradient backdrop - Made larger */}
      <div 
        className="relative rounded-3xl overflow-hidden p-10 pt-12 pb-6"
        style={{
          background: 'radial-gradient(ellipse at center, #14091E 0%, #2B1549 40%, #2B1549 70%, transparent 100%)',
          minHeight: '320px'
        }}
      >
        {/* Avatar Container with Halo */}
        <div className="relative flex items-center justify-center mb-6">
          {/* XP Progress Halo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: isInitialLoad ? 0.4 : 0.2, 
              duration: 0.6,
              ease: "easeOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg width="280" height="280" className="transform -rotate-90">
              {/* Track */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="12"
              />
              {/* Progress */}
              <motion.circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 120}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - xpProgress / 100) }}
                transition={{ 
                  delay: isInitialLoad ? 0.8 : 0.4,
                  duration: 1.2,
                  ease: "easeOut"
                }}
                style={{
                  filter: level >= 13 ? 'drop-shadow(0 0 24px #F6C348)' : 'drop-shadow(0 0 24px #7A3CFF)'
                }}
              />
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={level >= 13 ? "#F6C348" : "#7A3CFF"} />
                  <stop offset="100%" stopColor={level >= 13 ? "#FFD879" : "#B07CFF"} />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Avatar (Original Image - Bigger) - Clickable */}
          <motion.div
            animate={{ 
              scale: [0.995, 1.0, 0.995],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.45 }}
            whileTap={{ scale: 1.35 }}
            onClick={onAvatarClick}
            className="relative z-10 cursor-pointer"
            style={{ transform: 'scale(1.4)' }}
          >
            <img
              src={exampleImage}
              alt="Avatar"
              className="w-36 h-36 rounded-full object-cover border-4 border-white/20 shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Customize Button - Gaming Style */}
        {onAvatarClick && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isInitialLoad ? 1.2 : 0.6, duration: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={onAvatarClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Glowing background */}
              <motion.div
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-xl blur-md"
                style={{
                  background: 'linear-gradient(90deg, #7A3CFF 0%, #B07CFF 100%)',
                }}
              />
              
              {/* Button content */}
              <div 
                className="relative px-6 py-3 rounded-xl border-2 bg-purple-950/80 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(122, 60, 255, 0.6)',
                  boxShadow: 'inset 0 0 20px rgba(122, 60, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Edit3 className="w-4 h-4 text-purple-300 group-hover:text-purple-200 transition-colors" />
                  <span className="font-semibold text-purple-200 tracking-wide">
                    Tap to Customize
                  </span>
                  <Sparkles className="w-4 h-4 text-purple-300 group-hover:text-purple-200 transition-colors" />
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}