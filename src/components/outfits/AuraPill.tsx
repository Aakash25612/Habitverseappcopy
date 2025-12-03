import { motion } from 'motion/react';
import { Lock, Sparkles } from 'lucide-react';
import { Aura } from './types';

interface AuraPillProps {
  aura: Aura;
  onClick?: () => void;
}

const getAuraStyles = (level: number) => {
  switch (level) {
    case 5:
      return {
        bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
        border: 'border-blue-400/30',
        glow: '0 0 12px rgba(59, 130, 246, 0.3)',
        text: 'text-blue-300'
      };
    case 10:
      return {
        bg: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20',
        border: 'border-pink-400/30',
        glow: '0 0 16px rgba(236, 72, 153, 0.4)',
        text: 'text-pink-300'
      };
    case 15:
      return {
        bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
        border: 'border-yellow-400/30',
        glow: '0 0 18px rgba(251, 191, 36, 0.4)',
        text: 'text-yellow-300'
      };
    case 20:
      return {
        bg: 'bg-gradient-to-r from-[#F7C948]/20 to-[#F2B300]/20',
        border: 'border-[#F7C948]/30',
        glow: '0 0 20px rgba(247, 201, 72, 0.5)',
        text: 'text-[#F7C948]'
      };
    case 25:
      return {
        bg: 'bg-gradient-to-r from-gray-900/40 to-purple-900/40',
        border: 'border-purple-500/30',
        glow: '0 0 22px rgba(139, 92, 246, 0.4)',
        text: 'text-purple-300'
      };
    case 30:
      return {
        bg: 'bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20',
        border: 'border-purple-400/40',
        glow: '0 0 24px rgba(147, 51, 234, 0.6)',
        text: 'text-purple-200'
      };
    default:
      return {
        bg: 'bg-gray-700/20',
        border: 'border-gray-600/30',
        glow: 'none',
        text: 'text-gray-400'
      };
  }
};

export function AuraPill({ aura, onClick }: AuraPillProps) {
  const styles = getAuraStyles(aura.level);
  const canInteract = aura.isUnlocked && onClick;

  return (
    <motion.div
      whileHover={canInteract ? { scale: 1.02 } : {}}
      whileTap={canInteract ? { scale: 0.98 } : {}}
      onClick={canInteract ? onClick : undefined}
      className={`relative px-4 py-3 rounded-xl border transition-all duration-200 ${
        styles.bg
      } ${styles.border} ${
        canInteract ? 'cursor-pointer' : aura.isUnlocked ? 'cursor-default' : 'cursor-not-allowed'
      }`}
      style={{
        boxShadow: aura.isUnlocked && aura.isEquipped ? styles.glow : 'none'
      }}
    >
      {/* Glow Effect for Equipped */}
      {aura.isEquipped && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2"
          style={{
            borderColor: aura.color,
            boxShadow: `0 0 20px ${aura.glowColor}`
          }}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      <div className="relative flex items-center gap-3">
        {/* Level Badge */}
        <div className={`flex items-center gap-1.5 ${styles.text}`}>
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold text-sm">Lv. {aura.level}</span>
        </div>

        {/* Aura Name */}
        <div className="flex-1">
          <span className={`font-medium text-sm ${
            aura.isUnlocked ? 'text-white' : 'text-gray-500'
          }`}>
            {aura.name}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {!aura.isUnlocked && (
            <Lock className="w-4 h-4 text-gray-500" />
          )}
          {aura.isEquipped && (
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: aura.color }}
              animate={{
                boxShadow: [
                  `0 0 4px ${aura.glowColor}`,
                  `0 0 8px ${aura.glowColor}`,
                  `0 0 4px ${aura.glowColor}`
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      </div>

      {/* Lock Overlay */}
      {!aura.isUnlocked && (
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] rounded-xl" />
      )}
    </motion.div>
  );
}