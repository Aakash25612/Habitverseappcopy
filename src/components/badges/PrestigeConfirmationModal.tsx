import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Trophy, AlertTriangle } from 'lucide-react';
import { SlotMeter } from './SlotMeter';

interface PrestigeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  habitName: string;
  currentActiveHabits: number;
  maxActiveHabits: number;
  canStart: boolean;
}

export function PrestigeConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  habitName,
  currentActiveHabits,
  maxActiveHabits,
  canStart
}: PrestigeConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-400">
            <Trophy className="w-5 h-5" />
            Go for Prestige?
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Level up your mastered habit to prestige and unlock new challenges.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Challenge Description */}
          <div className="text-center">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(147, 51, 234, 0.3)',
                  '0 0 30px rgba(147, 51, 234, 0.5)',
                  '0 0 20px rgba(147, 51, 234, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-white font-bold text-lg mb-2">
              {habitName} - Prestige Challenge
            </h3>
            <p className="text-gray-400 text-sm line-height-comfortable">
              Commit to 60 days in a row for the Purple Prestige badge.
            </p>
          </div>

          {/* Slot Status */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <SlotMeter 
              current={currentActiveHabits} 
              max={maxActiveHabits}
              className="justify-center"
            />
            
            {!canStart && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <p className="text-yellow-400 text-xs">
                  Max 4 active habits keeps you focused. Free a slot to begin Prestige.
                </p>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm">Prestige Benefits:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Elite Purple Badge with shimmer effects
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Exclusive "Prestige 60" status
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Permanent achievement showcase
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              disabled={!canStart}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canStart ? 'Start 60-Day Run' : 'Slot Full'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}