import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { FitCard } from './FitCard';
import { SavedFit } from './types';

interface MyFitsScreenProps {
  fits: SavedFit[];
  onEquipFit?: (fit: SavedFit) => void;
  onSaveCurrentFit?: () => void;
  onRenameFit?: (fitId: string, newName: string) => void;
  onDeleteFit?: (fitId: string) => void;
  onSetAsDefault?: (fitId: string) => void;
}

export function MyFitsScreen({
  fits,
  onEquipFit,
  onSaveCurrentFit,
  onRenameFit,
  onDeleteFit,
  onSetAsDefault
}: MyFitsScreenProps) {
  const [selectedFitMenu, setSelectedFitMenu] = useState<string | null>(null);

  const handleFitClick = (fit: SavedFit) => {
    if (!fit.isEquipped) {
      onEquipFit?.(fit);
    }
  };

  const handleMenuClick = (fitId: string) => {
    setSelectedFitMenu(selectedFitMenu === fitId ? null : fitId);
  };

  return (
    <div className="space-y-6">
      {/* Save Current Fit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSaveCurrentFit}
        className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-gradient-to-r from-[#6D5EF6] to-[#8C7BFF] text-white font-semibold shadow-[0_4px_12px_rgba(109,94,246,0.3)] hover:shadow-[0_6px_16px_rgba(109,94,246,0.4)] transition-all duration-200"
      >
        <Plus className="w-5 h-5" />
        Save Current Fit
      </motion.button>

      {/* Saved Fits */}
      {fits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {fits.map((fit, index) => (
              <motion.div
                key={fit.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.2,
                  delay: index * 0.05
                }}
                className="relative"
              >
                <FitCard
                  fit={fit}
                  onClick={() => handleFitClick(fit)}
                  onMenuClick={() => handleMenuClick(fit.id)}
                />
                
                {/* Menu Dropdown */}
                <AnimatePresence>
                  {selectedFitMenu === fit.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-[#11151A]/90 backdrop-blur-sm border border-white/10 rounded-xl p-2 z-50 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    >
                      <button
                        onClick={() => {
                          // onRenameFit?.(fit.id, prompt('New name:') || fit.name);
                          setSelectedFitMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-white hover:bg-gray-700/50 text-sm transition-colors"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => {
                          onSetAsDefault?.(fit.id);
                          setSelectedFitMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-white hover:bg-gray-700/50 text-sm transition-colors"
                      >
                        Set as Default
                      </button>
                      <button
                        onClick={() => {
                          onDeleteFit?.(fit.id);
                          setSelectedFitMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No Saved Fits</h3>
          <p className="text-gray-400 text-sm mb-6">
            Create your first outfit combination and save it for quick access
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSaveCurrentFit}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-[#6D5EF6] text-white font-medium hover:bg-[#5D4EE6] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Save Current Fit
          </motion.button>
        </motion.div>
      )}

      {/* Fit Limit Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#11151A]/60 border border-[#1F2630] rounded-xl p-4"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Saved Fits</span>
          <span className="text-white font-medium">
            {fits.length}/5
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(fits.length / 5) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#6D5EF6] to-[#8C7BFF] rounded-full"
          />
        </div>
      </motion.div>

      {/* Click outside to close menu */}
      {selectedFitMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedFitMenu(null)}
          className="fixed inset-0 bg-black/20 z-30"
        />
      )}
    </div>
  );
}