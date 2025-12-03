import { motion } from 'motion/react';

interface SlotMeterProps {
  current: number;
  max: number;
  className?: string;
}

export function SlotMeter({ current, max, className = '' }: SlotMeterProps) {
  const isAtLimit = current >= max;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-gray-400 text-sm">Active Habits:</span>
      
      <div className="flex items-center gap-2">
        <span className="text-white font-bold font-tabular">
          {current}/{max}
        </span>
        
        <div className="flex gap-1">
          {Array.from({ length: max }, (_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < current 
                  ? 'bg-purple-500' 
                  : 'bg-gray-700'
              }`}
              animate={isAtLimit ? {
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 0 rgba(147, 51, 234, 0)',
                  '0 0 8px rgba(147, 51, 234, 0.6)',
                  '0 0 0 rgba(147, 51, 234, 0)'
                ]
              } : {}}
              transition={{
                duration: 1.5,
                repeat: isAtLimit ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
      
      {isAtLimit && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium"
        >
          At limit
        </motion.div>
      )}
    </div>
  );
}