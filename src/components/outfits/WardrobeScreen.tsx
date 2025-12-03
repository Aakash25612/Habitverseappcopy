import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import { OutfitCard } from './OutfitCard';
import { SlotFilter } from './SlotFilter';
import { GenderToggle } from './GenderToggle';
import { LevelBadge } from './LevelBadge';
import { ActionBar } from './ActionBar';
import { OutfitItem, SlotType } from './types';

interface WardrobeScreenProps {
  items: OutfitItem[];
  currentLevel: number;
  currentXP: number;
  maxXP: number;
  nextAuraLevel?: number;
  onItemSelect?: (item: OutfitItem) => void;
  onEquip?: (item: OutfitItem) => void;
  onSaveFit?: () => void;
}

export function WardrobeScreen({
  items,
  currentLevel,
  currentXP,
  maxXP,
  nextAuraLevel,
  onItemSelect,
  onEquip,
  onSaveFit
}: WardrobeScreenProps) {
  const [selectedSlot, setSelectedSlot] = useState<SlotType | 'All'>('All');
  const [selectedGender, setSelectedGender] = useState<'Man' | 'Woman'>('Man');
  const [selectedItem, setSelectedItem] = useState<OutfitItem | null>(null);
  const [sortBy, setSortBy] = useState<'level' | 'recent'>('level');

  // Filter items
  const filteredItems = items.filter(item => {
    if (selectedSlot !== 'All' && item.slot !== selectedSlot) return false;
    if (item.gender !== 'Unisex' && item.gender !== selectedGender) return false;
    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'level') {
      // Unlocked items first, then by level
      if (a.isLocked !== b.isLocked) return a.isLocked ? 1 : -1;
      return a.levelRequired - b.levelRequired;
    }
    return 0; // Recent would need timestamps
  });

  const handleItemClick = (item: OutfitItem) => {
    if (item.isLocked) return;
    setSelectedItem(item);
    onItemSelect?.(item);
  };

  const handleEquip = () => {
    if (selectedItem) {
      onEquip?.(selectedItem);
      setSelectedItem(null);
    }
  };

  const slotFilters: (SlotType | 'All')[] = ['All', 'Headwear', 'Top', 'Bottom', 'Footwear', 'Accessory'];

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4">
        <GenderToggle value={selectedGender} onChange={setSelectedGender} />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSortBy(sortBy === 'level' ? 'recent' : 'level')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#11151A]/60 border border-[#1F2630] text-gray-400 hover:bg-[#11151A]/80 hover:border-white/12 text-xs transition-all duration-200"
        >
          <ArrowUpDown className="w-3 h-3" />
          {sortBy === 'level' ? 'Level' : 'Recent'}
        </motion.button>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#11151A]/60 border border-[#1F2630] rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <LevelBadge level={currentLevel} />
          {nextAuraLevel && (
            <div className="text-xs text-gray-400">
              Aura unlocked at Lv. {nextAuraLevel}
            </div>
          )}
        </div>
        
        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentXP / maxXP) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#6D5EF6] to-[#8C7BFF] rounded-full"
          />
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>{currentXP} XP</span>
          <span>{maxXP} XP</span>
        </div>
      </motion.div>

      {/* Slot Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slotFilters.map((slot) => (
          <SlotFilter
            key={slot}
            slot={slot}
            active={selectedSlot === slot}
            onClick={() => setSelectedSlot(slot)}
          />
        ))}
      </div>

      {/* Items Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {sortedItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.2,
                delay: index * 0.05
              }}
            >
              <OutfitCard
                item={item}
                selected={selectedItem?.id === item.id}
                onClick={() => handleItemClick(item)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {sortedItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">
            No items found for the selected filters
          </p>
        </motion.div>
      )}

      {/* Action Bar */}
      <ActionBar
        selectedItem={selectedItem}
        onEquip={handleEquip}
        onSaveFit={onSaveFit}
        canEquip={!selectedItem?.isLocked}
        infoText={selectedItem?.isLocked ? `Unlocked at Lv. ${selectedItem.levelRequired}` : undefined}
      />
    </div>
  );
}