import { motion } from 'motion/react';
import { Crown, Shirt, Users, Footprints, Glasses, Sparkles, MoreVertical } from 'lucide-react';
import { SavedFit, SlotType } from './types';

interface FitCardProps {
  fit: SavedFit;
  onClick?: () => void;
  onMenuClick?: () => void;
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

export function FitCard({ fit, onClick, onMenuClick }: FitCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative bg-[#11151A]/80 backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
        fit.isEquipped
          ? 'border-[#6D5EF6] shadow-[0_0_16px_rgba(109,94,246,0.3)] bg-[#6D5EF6]/10'
          : 'border-white/6 hover:border-white/12 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold text-sm">{fit.name}</h3>
          {fit.isEquipped && (
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-[#6D5EF6]" />
            </motion.div>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.();
          }}
          className="p-1 rounded-md hover:bg-gray-700/50 transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </motion.button>
      </div>

      {/* Mini Avatar Placeholder */}
      <div className="w-12 h-12 bg-gray-800/50 rounded-lg mb-3 mx-auto flex items-center justify-center">
        <div className={`w-6 h-6 rounded-full ${
          fit.aura ? `bg-gradient-to-r ${fit.aura.color}` : 'bg-gray-700'
        }`} />
      </div>

      {/* Slot Thumbnails */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {(['headwear', 'top', 'bottom', 'footwear', 'accessory'] as const).map((slotKey) => {
          const item = fit.items[slotKey];
          const SlotIcon = getSlotIcon(slotKey.charAt(0).toUpperCase() + slotKey.slice(1) as SlotType);
          const slotColor = getSlotColor(slotKey.charAt(0).toUpperCase() + slotKey.slice(1) as SlotType);
          
          return (
            <div
              key={slotKey}
              className="aspect-square bg-gray-800/30 rounded-md flex items-center justify-center border border-gray-700/50"
            >
              {item ? (
                item.thumbnail ? (
                  <img 
                    src={item.thumbnail} 
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <SlotIcon className={`w-3 h-3 ${slotColor}`} />
                )
              ) : (
                <SlotIcon className="w-3 h-3 text-gray-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Aura Badge */}
      {fit.aura && (
        <div className="flex items-center justify-center">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            fit.aura.isUnlocked 
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
              : 'bg-gray-700/50 text-gray-500'
          }`}>
            Lv. {fit.aura.level} Aura
          </div>
        </div>
      )}

      {/* Equipped Indicator */}
      {fit.isEquipped && (
        <motion.div
          layoutId="fit-selection"
          className="absolute inset-0 border-2 border-[#6D5EF6] rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}