import { motion } from 'motion/react';
import { useState } from 'react';
import { AuraPill } from './AuraPill';
import { ActionBar } from './ActionBar';
import { Aura } from './types';

interface AurasScreenProps {
  auras: Aura[];
  onEquipAura?: (aura: Aura) => void;
}

export function AurasScreen({ auras, onEquipAura }: AurasScreenProps) {
  const [selectedAura, setSelectedAura] = useState<Aura | null>(null);

  const handleAuraClick = (aura: Aura) => {
    if (aura.isUnlocked) {
      setSelectedAura(aura);
    }
  };

  const handleEquip = () => {
    if (selectedAura) {
      onEquipAura?.(selectedAura);
      setSelectedAura(null);
    }
  };

  const equippedAura = auras.find(a => a.isEquipped);

  return (
    <div className="space-y-6">
      {/* Aura Pills */}
      <div className="space-y-3">
        {auras.map((aura) => (
          <AuraPill
            key={aura.level}
            aura={aura}
            onClick={() => handleAuraClick(aura)}
          />
        ))}
      </div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#11151A]/80 backdrop-blur-sm border border-white/6 rounded-xl p-6"
        style={{
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="text-center space-y-4">
          <h3 className="text-white font-semibold text-lg">Aura Preview</h3>
          
          {/* Avatar Silhouette with Aura */}
          <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
            {/* Base Avatar */}
            <div className="w-24 h-24 bg-gray-700 rounded-full border-2 border-gray-600" />
            
            {/* Current Aura Effect */}
            {equippedAura && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${equippedAura.glowColor} 0%, transparent 70%)`,
                  border: `2px solid ${equippedAura.color}`
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Preview Aura Effect */}
            {selectedAura && selectedAura !== equippedAura && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${selectedAura.glowColor} 0%, transparent 70%)`,
                  border: `2px solid ${selectedAura.color}`,
                  opacity: 0.7
                }}
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </div>

          {/* Current Status */}
          <div className="space-y-2">
            {equippedAura ? (
              <p className="text-sm text-gray-300">
                Currently equipped: <span className="text-white font-medium">{equippedAura.name}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-400">No aura equipped</p>
            )}
            
            {selectedAura && selectedAura !== equippedAura && (
              <p className="text-sm text-purple-300">
                Preview: <span className="text-white font-medium">{selectedAura.name}</span>
              </p>
            )}
          </div>

          {/* Equip Button */}
          {selectedAura && selectedAura.isUnlocked && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEquip}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#6D5EF6] to-[#8C7BFF] text-white font-semibold shadow-[0_4px_12px_rgba(109,94,246,0.3)] hover:shadow-[0_6px_16px_rgba(109,94,246,0.4)] transition-all duration-200"
            >
              Equip {selectedAura.name}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Locked Aura Tooltip */}
      {selectedAura && !selectedAura.isUnlocked && (
        <ActionBar
          selectedItem={selectedAura}
          canEquip={false}
          equipText="Locked"
          infoText={`Unlock at Lv. ${selectedAura.level}`}
        />
      )}
    </div>
  );
}