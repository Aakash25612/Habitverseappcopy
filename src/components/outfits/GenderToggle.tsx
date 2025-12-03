import { motion } from 'motion/react';
import { User, Users } from 'lucide-react';
import { GenderType } from './types';

interface GenderToggleProps {
  value: 'Man' | 'Woman';
  onChange: (value: 'Man' | 'Woman') => void;
}

export function GenderToggle({ value, onChange }: GenderToggleProps) {
  return (
    <div className="flex bg-[#11151A]/60 border border-[#1F2630] rounded-lg p-1">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange('Man')}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
          value === 'Man'
            ? 'bg-[#6D5EF6] text-white shadow-sm'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <User className="w-3 h-3" />
        <span>Man</span>
        {value === 'Man' && (
          <motion.div
            layoutId="gender-selection"
            className="absolute inset-0 bg-[#6D5EF6] rounded-md -z-10"
            initial={false}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
        )}
      </motion.button>
      
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange('Woman')}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
          value === 'Woman'
            ? 'bg-[#6D5EF6] text-white shadow-sm'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <Users className="w-3 h-3" />
        <span>Woman</span>
        {value === 'Woman' && (
          <motion.div
            layoutId="gender-selection"
            className="absolute inset-0 bg-[#6D5EF6] rounded-md -z-10"
            initial={false}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    </div>
  );
}