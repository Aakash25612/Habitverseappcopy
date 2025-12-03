import { motion } from 'motion/react';
import { Crown, Shirt, Users, Footprints, Glasses } from 'lucide-react';
import { SlotType } from './types';

interface SlotFilterProps {
  slot: SlotType | 'All';
  active: boolean;
  onClick: () => void;
}

const getSlotIcon = (slot: SlotType | 'All') => {
  switch (slot) {
    case 'All': return null;
    case 'Headwear': return Crown;
    case 'Top': return Shirt;
    case 'Bottom': return Users;
    case 'Footwear': return Footprints;
    case 'Accessory': return Glasses;
  }
};

const getSlotColor = (slot: SlotType | 'All') => {
  switch (slot) {
    case 'All': return 'text-purple-400';
    case 'Headwear': return 'text-yellow-400';
    case 'Top': return 'text-blue-400';
    case 'Bottom': return 'text-green-400';
    case 'Footwear': return 'text-orange-400';
    case 'Accessory': return 'text-purple-400';
  }
};

export function SlotFilter({ slot, active, onClick }: SlotFilterProps) {
  const SlotIcon = getSlotIcon(slot);
  const slotColor = getSlotColor(slot);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-[#6D5EF6] to-[#8C7BFF] text-white shadow-[0_4px_12px_rgba(109,94,246,0.3)]'
          : 'bg-[#11151A]/60 border border-[#1F2630] text-gray-400 hover:bg-[#11151A]/80 hover:border-white/12'
      }`}
    >
      {SlotIcon && <SlotIcon className={`w-3 h-3 ${active ? 'text-white' : slotColor}`} />}
      <span>{slot}</span>
    </motion.button>
  );
}