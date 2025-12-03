import { motion } from 'motion/react';
import { useState } from 'react';
import { Shirt } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { WardrobeScreen } from './WardrobeScreen';
import { AurasScreen } from './AurasScreen';
import { MyFitsScreen } from './MyFitsScreen';
import { mockOutfitItems, mockAuras, mockSavedFits } from './mockData';
import { OutfitItem, Aura, SavedFit } from './types';
import { toast } from 'sonner@2.0.3';

interface OutfitsPageProps {
  isInitialLoad?: boolean;
}

export function OutfitsPage({ isInitialLoad = false }: OutfitsPageProps) {
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>(mockOutfitItems);
  const [auras, setAuras] = useState<Aura[]>(mockAuras);
  const [savedFits, setSavedFits] = useState<SavedFit[]>(mockSavedFits);
  
  // Mock current level - in real app this would come from props/context
  const currentLevel = 13;
  const currentXP = 1650;
  const maxXP = 2050;
  const nextAuraLevel = 15;

  // Update item lock status based on current level
  const updatedItems = outfitItems.map(item => ({
    ...item,
    isLocked: item.levelRequired > currentLevel
  }));

  // Update aura unlock status based on current level
  const updatedAuras = auras.map(aura => ({
    ...aura,
    isUnlocked: aura.level <= currentLevel
  }));

  const handleItemSelect = (item: OutfitItem) => {
    console.log('Selected item:', item);
  };

  const handleEquipItem = (item: OutfitItem) => {
    toast.success(`Equipped ${item.name} to ${item.slot}!`);
  };

  const handleEquipAura = (aura: Aura) => {
    // Update auras - unequip current, equip new
    const updatedAuras = auras.map(a => ({
      ...a,
      isEquipped: a.level === aura.level
    }));
    setAuras(updatedAuras);
    toast.success(`Equipped ${aura.name} aura!`);
  };

  const handleSaveCurrentFit = () => {
    if (savedFits.length >= 5) {
      toast.error('Maximum 5 fits allowed. Delete one to save new.');
      return;
    }

    const newFit: SavedFit = {
      id: `fit-${Date.now()}`,
      name: `Fit ${savedFits.length + 1}`,
      items: {
        // In real app, this would be current equipped items
        headwear: updatedItems.find(i => i.slot === 'Headwear' && !i.isLocked),
        top: updatedItems.find(i => i.slot === 'Top' && !i.isLocked),
        bottom: updatedItems.find(i => i.slot === 'Bottom' && !i.isLocked),
        footwear: updatedItems.find(i => i.slot === 'Footwear' && !i.isLocked),
        accessory: updatedItems.find(i => i.slot === 'Accessory' && !i.isLocked)
      },
      aura: updatedAuras.find(a => a.isEquipped),
      isEquipped: false,
      createdAt: new Date()
    };

    setSavedFits(prev => [...prev, newFit]);
    toast.success('Current fit saved!');
  };

  const handleEquipFit = (fit: SavedFit) => {
    // Update fits - unequip current, equip selected
    const updatedFits = savedFits.map(f => ({
      ...f,
      isEquipped: f.id === fit.id
    }));
    setSavedFits(updatedFits);
    toast.success(`Equipped ${fit.name}!`);
  };

  const handleDeleteFit = (fitId: string) => {
    setSavedFits(prev => prev.filter(f => f.id !== fitId));
    toast.success('Fit deleted');
  };

  const handleSetAsDefault = (fitId: string) => {
    // In real app, this would set as default fit
    toast.success('Set as default fit');
  };

  return (
    <div className="w-full">
      <div className="px-6">
        {/* Header */}
        <motion.div
          initial={isInitialLoad ? { opacity: 0, y: -20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shirt className="w-6 h-6 text-blue-400" />
            <h2 className="text-white font-bold text-xl">Outfits</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Mix and match gear to create your perfect look
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="wardrobe" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1 rounded-xl mb-6">
            <TabsTrigger 
              value="wardrobe" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 rounded-lg text-sm"
            >
              Wardrobe
            </TabsTrigger>
            <TabsTrigger 
              value="auras" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 rounded-lg text-sm"
            >
              Auras
            </TabsTrigger>
            <TabsTrigger 
              value="fits" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-400 rounded-lg text-sm"
            >
              My Fits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wardrobe" className="space-y-6 mt-6">
            <WardrobeScreen
              items={updatedItems}
              currentLevel={currentLevel}
              currentXP={currentXP}
              maxXP={maxXP}
              nextAuraLevel={nextAuraLevel}
              onItemSelect={handleItemSelect}
              onEquip={handleEquipItem}
              onSaveFit={handleSaveCurrentFit}
            />
          </TabsContent>

          <TabsContent value="auras" className="space-y-6 mt-6">
            <AurasScreen
              auras={updatedAuras}
              onEquipAura={handleEquipAura}
            />
          </TabsContent>

          <TabsContent value="fits" className="space-y-6 mt-6">
            <MyFitsScreen
              fits={savedFits}
              onEquipFit={handleEquipFit}
              onSaveCurrentFit={handleSaveCurrentFit}
              onDeleteFit={handleDeleteFit}
              onSetAsDefault={handleSetAsDefault}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}