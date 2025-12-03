import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle, Pause } from 'lucide-react';

interface ActiveHabit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  canPause: boolean;
}

interface SlotLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeHabits: ActiveHabit[];
  onPauseHabit: (habitId: string) => void;
}

export function SlotLimitModal({
  isOpen,
  onClose,
  activeHabits,
  onPauseHabit
}: SlotLimitModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-5 h-5" />
            Habit Limit Reached
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You've reached the maximum number of active habits. Choose an action to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Warning Message */}
          <div className="text-center">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 text-sm line-height-comfortable">
                You're at the 4 habit limit. Pause or finish one to start Prestige.
              </p>
            </div>
            
            <p className="text-gray-400 text-sm">
              Max 4 active habits keeps you focused. Free a slot to begin your new challenge.
            </p>
          </div>

          {/* Active Habits List */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm">Your Active Habits:</h4>
            
            <div className="space-y-2">
              {activeHabits.map((habit) => (
                <motion.div
                  key={habit.id}
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{habit.icon}</span>
                    <div>
                      <h5 className="text-white font-medium text-sm">{habit.name}</h5>
                      <p className="text-gray-400 text-xs font-tabular">
                        {habit.streak} day streak
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPauseHabit(habit.id)}
                    disabled={!habit.canPause}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    <Pause className="w-3 h-3 mr-1" />
                    Pause
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400 text-xs text-center">
              Paused habits can be resumed later without losing progress.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}