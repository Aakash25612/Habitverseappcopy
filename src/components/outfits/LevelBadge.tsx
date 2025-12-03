import { motion } from 'motion/react';

interface LevelBadgeProps {
  level: number;
  className?: string;
}

export function LevelBadge({ level, className = "" }: LevelBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[#6D5EF6] to-[#8C7BFF] text-white shadow-[0_4px_12px_rgba(109,94,246,0.3)] ${className}`}
    >
      Lv. {level}
    </motion.div>
  );
}