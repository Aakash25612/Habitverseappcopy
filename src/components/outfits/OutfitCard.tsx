import { motion } from 'motion/react';
import { Lock, Crown, Shirt, Footprints, Glasses, Users } from 'lucide-react';
import { OutfitItem, SlotType } from './types';

interface OutfitCardProps {
  item: OutfitItem;
  selected?: boolean;
  onClick?: () => void;
}

const getSlotIcon = (slot: SlotType) => {
  switch (slot) {
    case 'Headwear': return Crown;
    case 'Top': return Shirt;
    case 'Bottom': return Users;
    case 'Footwear': return Footprints;
    case 'Accessory': return Glasses;
  }
};

const getSlotColor = (slot: SlotType) => {
  switch (slot) {
    case 'Headwear': return 'text-yellow-400';
    case 'Top': return 'text-blue-400';
    case 'Bottom': return 'text-green-400';
    case 'Footwear': return 'text-orange-400';
    case 'Accessory': return 'text-purple-400';
  }
};

export function OutfitCard({ item, selected = false, onClick }: OutfitCardProps) {
  const SlotIcon = getSlotIcon(item.slot);
  const slotColor = getSlotColor(item.slot);

  return (
    <motion.div
      whileHover={{ scale: item.isLocked ? 1 : 0.98 }}
      whileTap={{ scale: item.isLocked ? 1 : 0.96 }}
      onClick={item.isLocked ? undefined : onClick}
      className={`relative bg-[#11151A]/80 backdrop-blur-sm border rounded-xl p-3 cursor-pointer transition-all duration-200 ${
        selected 
          ? 'border-[#6D5EF6] shadow-[0_0_16px_rgba(109,94,246,0.3)] bg-[#6D5EF6]/10' 
          : item.isLocked 
            ? 'border-[#1F2630] cursor-not-allowed' 
            : 'border-white/6 hover:border-white/12 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]'
      }`}
      style={{
        boxShadow: selected ? '0 0 16px rgba(109, 94, 246, 0.3)' : '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-square mb-3 bg-gray-800/50 rounded-lg overflow-hidden">
        {item.thumbnail ? (
          <img 
            src={item.thumbnail} 
            alt={item.name}
            className={`w-full h-full object-cover ${item.isLocked ? 'grayscale opacity-40' : ''}`}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${item.isLocked ? 'opacity-40' : ''}`}>
            <SlotIcon className={`w-8 h-8 ${slotColor}`} />
          </div>
        )}
        
        {/* Slot Icon */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-gray-900/80 rounded-full flex items-center justify-center">
          <SlotIcon className={`w-3 h-3 ${slotColor}`} />
        </div>

        {/* Lock Overlay */}
        {item.isLocked && (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-gray-800/90 rounded-full p-2">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="space-y-2">
        <h3 className={`text-sm font-semibold truncate ${item.isLocked ? 'text-gray-500' : 'text-white'}`}>
          {item.name}
        </h3>
        
        {/* Level Requirement */}
        <div className="flex items-center justify-between">
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${
            item.isLocked 
              ? 'bg-gray-700/50 text-gray-500' 
              : 'bg-[#F7C948]/20 text-[#F7C948]'
          }`}>
            Lv. {item.levelRequired}
          </div>
          
          {item.gender !== 'Unisex' && (
            <div className="text-xs text-gray-400">
              {item.gender === 'Man' ? '♂' : '♀'}
            </div>
          )}
        </div>
      </div>

      {/* Selection Ring */}
      {selected && (
        <motion.div
          layoutId="outfit-selection"
          className="absolute inset-0 border-2 border-[#6D5EF6] rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}