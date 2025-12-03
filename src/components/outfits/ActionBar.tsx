import { motion } from 'motion/react';
import { Shirt, Save, Info } from 'lucide-react';

interface ActionBarProps {
  selectedItem?: any;
  onEquip?: () => void;
  onSaveFit?: () => void;
  canEquip?: boolean;
  equipText?: string;
  infoText?: string;
}

export function ActionBar({ 
  selectedItem, 
  onEquip, 
  onSaveFit, 
  canEquip = true,
  equipText = "Equip",
  infoText
}: ActionBarProps) {
  if (!selectedItem) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-0 right-0 z-40 px-6"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-[#11151A]/90 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          {/* Info Text */}
          {infoText && (
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
              <Info className="w-3 h-3" />
              <span>{infoText}</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: canEquip ? 1.02 : 1 }}
              whileTap={{ scale: canEquip ? 0.98 : 1 }}
              onClick={canEquip ? onEquip : undefined}
              disabled={!canEquip}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                canEquip
                  ? 'bg-gradient-to-r from-[#6D5EF6] to-[#8C7BFF] text-white shadow-[0_4px_12px_rgba(109,94,246,0.3)] hover:shadow-[0_6px_16px_rgba(109,94,246,0.4)]'
                  : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Shirt className="w-4 h-4" />
              {equipText}
            </motion.button>
            
            {onSaveFit && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSaveFit}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold bg-[#11151A]/60 border border-[#1F2630] text-gray-300 hover:bg-[#11151A]/80 hover:border-white/12 transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                Save Fit
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}