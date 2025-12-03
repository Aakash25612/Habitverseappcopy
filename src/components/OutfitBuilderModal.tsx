import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, ChevronLeft, Sparkles, Check, Shirt } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { OutfitCard } from './outfits/OutfitCard';
import { GenderToggle } from './outfits/GenderToggle';
import { OutfitItem, SlotType, GenderType, Aura, SavedFit } from './outfits/types';
import exampleImage from 'figma:asset/bce13fc6b54b1e41a722fa2718db1afe76e419d9.png';
import { toast } from 'sonner@2.0.3';

interface OutfitBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OutfitItem[];
  auras: Aura[];
  currentLevel: number;
  onEquipOutfit?: (equippedItems: EquippedItems, equippedAura?: Aura) => void;
}

interface EquippedItems {
  headwear?: OutfitItem;
  top?: OutfitItem;
  bottom?: OutfitItem;
  footwear?: OutfitItem;
  accessory?: OutfitItem;
}

const SLOT_ICONS: Record<SlotType, string> = {
  Headwear: '🎩',
  Top: '👕',
  Bottom: '👖',
  Footwear: '👟',
  Accessory: '💍'
};

const SLOT_COLORS: Record<SlotType, string> = {
  Headwear: 'from-purple-500 to-purple-600',
  Top: 'from-blue-500 to-blue-600',
  Bottom: 'from-green-500 to-green-600',
  Footwear: 'from-orange-500 to-orange-600',
  Accessory: 'from-pink-500 to-pink-600'
};

// Predefined saved outfits
const savedOutfits: SavedFit[] = [
  {
    id: 'fit-1',
    name: 'Workout Warrior',
    items: {},
    isEquipped: false,
    createdAt: new Date()
  },
  {
    id: 'fit-2',
    name: 'Casual Cool',
    items: {},
    isEquipped: false,
    createdAt: new Date()
  },
  {
    id: 'fit-3',
    name: 'Street Style',
    items: {},
    isEquipped: false,
    createdAt: new Date()
  },
  {
    id: 'fit-4',
    name: 'Smart Casual',
    items: {},
    isEquipped: false,
    createdAt: new Date()
  },
  {
    id: 'fit-5',
    name: 'Elite Champion',
    items: {},
    isEquipped: false,
    createdAt: new Date()
  }
];

export function OutfitBuilderModal({
  isOpen,
  onClose,
  items,
  auras,
  currentLevel,
  onEquipOutfit
}: OutfitBuilderModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<SlotType | 'Aura' | 'SavedFits' | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderType>('Man');
  const [equippedItems, setEquippedItems] = useState<EquippedItems>({});
  const [equippedAura, setEquippedAura] = useState<Aura | undefined>(
    auras.find(a => a.isEquipped)
  );

  // Initialize saved fits with actual items
  const [fits, setFits] = useState<SavedFit[]>(() => {
    return savedOutfits.map((fit, index) => {
      const unlockedItems = items.filter(i => !i.isLocked);
      const menItems = unlockedItems.filter(i => i.gender === 'Man' || i.gender === 'Unisex');
      const womenItems = unlockedItems.filter(i => i.gender === 'Woman' || i.gender === 'Unisex');
      
      // Create different outfit combinations
      const getItemsForFit = (fitIndex: number) => {
        const itemsToUse = selectedGender === 'Man' ? menItems : womenItems;
        
        return {
          headwear: itemsToUse.find(i => i.slot === 'Headwear' && i.levelRequired <= (fitIndex + 1) * 5),
          top: itemsToUse.find(i => i.slot === 'Top' && i.levelRequired <= (fitIndex + 1) * 5),
          bottom: itemsToUse.find(i => i.slot === 'Bottom' && i.levelRequired <= (fitIndex + 1) * 5),
          footwear: itemsToUse.find(i => i.slot === 'Footwear' && i.levelRequired <= (fitIndex + 1) * 5),
          accessory: itemsToUse.find(i => i.slot === 'Accessory' && i.levelRequired <= (fitIndex + 1) * 5)
        };
      };

      return {
        ...fit,
        items: getItemsForFit(index),
        aura: auras.find(a => a.isUnlocked && a.level <= (index + 1) * 5)
      };
    });
  });

  const handleSelectItem = (item: OutfitItem) => {
    if (item.isLocked) return;
    
    setEquippedItems(prev => ({
      ...prev,
      [item.slot.toLowerCase()]: item
    }));
    toast.success(`Equipped ${item.name}`);
  };

  const handleSelectAura = (aura: Aura) => {
    if (!aura.isUnlocked) return;
    
    setEquippedAura(aura);
    toast.success(`Equipped ${aura.name} aura`);
  };

  const handleSaveOutfit = () => {
    onEquipOutfit?.(equippedItems, equippedAura);
    toast.success('Outfit saved!');
    onClose();
  };

  const handleEquipSavedFit = (fit: SavedFit) => {
    setEquippedItems(fit.items);
    setEquippedAura(fit.aura);
    toast.success(`Equipped ${fit.name}!`);
    setSelectedSlot(null);
  };

  const handleBack = () => {
    setSelectedSlot(null);
  };

  // Filter items by selected slot and gender
  const filteredItems = selectedSlot && selectedSlot !== 'Aura' && selectedSlot !== 'SavedFits'
    ? items.filter(item => {
        if (item.slot !== selectedSlot) return false;
        if (item.gender !== 'Unisex' && item.gender !== selectedGender) return false;
        return true;
      }).sort((a, b) => {
        // Unlocked first, then by level
        if (a.isLocked !== b.isLocked) return a.isLocked ? 1 : -1;
        return a.levelRequired - b.levelRequired;
      })
    : [];

  const filteredAuras = selectedSlot === 'Aura'
    ? auras.sort((a, b) => a.level - b.level)
    : [];

  const slots: (SlotType | 'Aura')[] = ['Headwear', 'Top', 'Bottom', 'Footwear', 'Accessory', 'Aura'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gray-900 border-gray-700 p-0 h-[90vh] overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {!selectedSlot ? (
            // Main View - Character + Slot Selection
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 min-h-0"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="text-white">Outfit Builder</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-h-0 overflow-y-auto p-6">
                {/* Character Preview */}
                <div className="mb-6">
                  <div 
                    className="relative rounded-2xl overflow-hidden p-8 flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(ellipse at center, #14091E 0%, #2B1549 40%, #2B1549 70%, transparent 100%)',
                      minHeight: '200px'
                    }}
                  >
                    {/* Aura Effect */}
                    {equippedAura && (
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [0.95, 1.05, 0.95]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-2xl blur-2xl"
                        style={{ background: equippedAura.glowColor }}
                      />
                    )}

                    {/* Avatar */}
                    <div className="relative z-10">
                      <motion.img
                        src={exampleImage}
                        alt="Character"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                        animate={{
                          scale: [0.995, 1.0, 0.995]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </div>

                  {/* Currently Equipped Summary */}
                  <div className="mt-4 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="text-gray-400 text-xs mb-2">Currently Equipped</div>
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map(slot => {
                        const item = slot === 'Aura' 
                          ? equippedAura
                          : equippedItems[slot.toLowerCase() as keyof EquippedItems];
                        
                        return (
                          <div key={slot} className="text-xs">
                            <div className="text-gray-500">{slot}</div>
                            <div className="text-white truncate">
                              {item ? (slot === 'Aura' ? (item as Aura).name : (item as OutfitItem).name) : 'None'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Gender Toggle */}
                <div className="mb-4">
                  <GenderToggle value={selectedGender} onChange={setSelectedGender} />
                </div>

                {/* Saved Outfits Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white">Quick Equip</div>
                    <div className="text-gray-400 text-xs">5 Saved Outfits</div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {fits.map((fit, index) => (
                      <motion.button
                        key={fit.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEquipSavedFit(fit)}
                        className="relative aspect-square rounded-lg border transition-all duration-200 bg-gray-800/50 border-gray-700 hover:border-purple-500/50 flex flex-col items-center justify-center p-2"
                      >
                        <Shirt className="w-5 h-5 text-gray-400 mb-1" />
                        <div className="text-xs text-gray-400 text-center leading-tight">
                          Fit {index + 1}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Slot Selection Grid */}
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm mb-3">Or customize by slot</div>
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map((slot) => {
                      const isAura = slot === 'Aura';
                      const currentItem = isAura
                        ? equippedAura
                        : equippedItems[slot.toLowerCase() as keyof EquippedItems];
                      
                      return (
                        <motion.button
                          key={slot}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedSlot(slot)}
                          className={`relative p-4 rounded-xl border transition-all duration-200 ${
                            currentItem
                              ? 'bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/30'
                              : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                              isAura 
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                : `bg-gradient-to-br ${SLOT_COLORS[slot as SlotType]}`
                            }`}>
                              {isAura ? '✨' : SLOT_ICONS[slot as SlotType]}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-white text-sm">{slot}</div>
                              {currentItem && (
                                <div className="text-xs text-gray-400 truncate">
                                  {isAura ? (currentItem as Aura).name : (currentItem as OutfitItem).name}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {currentItem && (
                            <div className="absolute top-2 right-2">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer - Save Button */}
              <div className="p-4 border-t border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveOutfit}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-center"
                >
                  Save & Equip Outfit
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Item Selection View
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 min-h-0"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <h2 className="text-white">
                  {selectedSlot === 'Aura' ? 'Select Aura' : `Select ${selectedSlot}`}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items Grid */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4">
                {selectedSlot === 'SavedFits' ? (
                  <div className="space-y-3">
                    {fits.map((fit) => (
                      <motion.button
                        key={fit.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleEquipSavedFit(fit)}
                        className="w-full p-4 rounded-xl border transition-all duration-200 bg-gray-800/50 border-gray-700 hover:border-purple-500/50 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium mb-1">{fit.name}</div>
                            <div className="text-xs text-gray-400">
                              {Object.keys(fit.items).filter(k => fit.items[k as keyof typeof fit.items]).length} items
                              {fit.aura && ' + aura'}
                            </div>
                          </div>
                          <Shirt className="w-6 h-6 text-purple-400" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : selectedSlot === 'Aura' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredAuras.map((aura) => (
                      <motion.button
                        key={aura.level}
                        whileHover={{ scale: aura.isUnlocked ? 1.02 : 1 }}
                        whileTap={{ scale: aura.isUnlocked ? 0.98 : 1 }}
                        onClick={() => handleSelectAura(aura)}
                        disabled={!aura.isUnlocked}
                        className={`relative p-4 rounded-xl border transition-all duration-200 ${
                          equippedAura?.level === aura.level
                            ? 'bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/50'
                            : !aura.isUnlocked
                            ? 'bg-gray-800/30 border-gray-700/50 opacity-50 cursor-not-allowed'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="w-16 h-16 rounded-full"
                            style={{
                              background: aura.isUnlocked 
                                ? `radial-gradient(circle, ${aura.color}, ${aura.glowColor})`
                                : 'radial-gradient(circle, #374151, #1f2937)',
                              boxShadow: aura.isUnlocked && equippedAura?.level === aura.level
                                ? `0 0 20px ${aura.glowColor}`
                                : 'none'
                            }}
                          />
                          <div className="text-center">
                            <div className="text-white text-sm">{aura.name}</div>
                            <div className={`text-xs ${aura.isUnlocked ? 'text-gray-400' : 'text-gray-500'}`}>
                              Level {aura.level}
                            </div>
                          </div>
                          {!aura.isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                              <div className="text-white text-xs">🔒</div>
                            </div>
                          )}
                          {equippedAura?.level === aura.level && (
                            <div className="absolute top-2 right-2">
                              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredItems.map((item) => (
                      <OutfitCard
                        key={item.id}
                        item={item}
                        onClick={() => handleSelectItem(item)}
                        isSelected={
                          equippedItems[item.slot.toLowerCase() as keyof EquippedItems]?.id === item.id
                        }
                      />
                    ))}
                    {filteredItems.length === 0 && (
                      <div className="col-span-2 text-center text-gray-400 py-8">
                        No items available for this slot
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
