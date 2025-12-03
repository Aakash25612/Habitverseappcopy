import { motion } from 'motion/react';

interface SegmentedControlProps {
  options: { id: string; label: string; color?: string }[];
  activeOption: string;
  onChange: (option: string) => void;
  isInitialLoad?: boolean;
}

export function SegmentedControl({ options, activeOption, onChange, isInitialLoad = true }: SegmentedControlProps) {
  const activeIndex = options.findIndex(option => option.id === activeOption);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isInitialLoad ? 0.8 : 0.4, duration: 0.4 }}
      className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-1 mb-6"
    >
      {/* Active pill background */}
      <motion.div
        layoutId="segmented-control-active"
        className="absolute top-1 h-8 rounded-2xl bg-purple-600/30 border border-purple-500/50"
        style={{
          left: `${(activeIndex * (100 / options.length)) + 0.25}%`,
          width: `${(100 / options.length) - 0.5}%`
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <div className="relative flex">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.id)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-2xl transition-colors duration-200 relative z-10 ${
              activeOption === option.id
                ? 'text-purple-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            style={{ minHeight: '44px' }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}