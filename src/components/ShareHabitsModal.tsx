import { motion } from 'motion/react';
import { X, Share2, Copy, Check, Download, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from './ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface HabitStats {
  streak: number;
  weekRate: string;
  totalCompleted: number;
  level: number;
}

interface ShareHabitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHabitName: string;
  availableHabits: string[];
  getStatsForHabit: (habitName: string) => HabitStats;
}

export function ShareHabitsModal({ isOpen, onClose, initialHabitName, availableHabits, getStatsForHabit }: ShareHabitsModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(initialHabitName);

  const stats = getStatsForHabit(selectedHabit);

  const shareText = `🔥 My ${selectedHabit} Progress

📊 Current Streak: ${stats.streak} days
📈 7-Day Rate: ${stats.weekRate}
✅ Total Completed: ${stats.totalCompleted}
⭐ Level: ${stats.level}

Keep grinding! 💪`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API or when permissions are denied
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('Failed to copy. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${selectedHabit} Progress`,
          text: shareText
        });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          handleCopyToClipboard();
        }
      }
    } else {
      handleCopyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <DialogContent className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border-purple-500/30 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Share2 className="w-5 h-5" />
              Share Your Progress
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Share your habit achievements with friends and stay motivated!
            </DialogDescription>
          </DialogHeader>

          {/* Habit Selector */}
          <div className="relative mb-4">
            <label className="text-gray-400 text-sm mb-2 block">Select Habit</label>
            <select
              value={selectedHabit}
              onChange={(e) => {
                setSelectedHabit(e.target.value);
                setCopied(false);
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            >
              {availableHabits.map((habit) => (
                <option key={habit} value={habit} className="bg-gray-800 text-white">
                  {habit}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-[38px] w-4 h-4 text-purple-400 pointer-events-none" />
          </div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6 mb-6"
        >
          <div className="text-center mb-4">
            <div className="text-2xl mb-2">🔥</div>
            <h3 className="text-white font-bold mb-1">My {selectedHabit} Progress</h3>
            <div className="text-gray-400 text-xs">Sharing my journey!</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.streak}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.weekRate}</div>
              <div className="text-xs text-gray-400">7-Day Rate</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.totalCompleted}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.level}</div>
              <div className="text-xs text-gray-400">Level</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-gray-300 text-sm">Keep grinding! 💪</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Progress
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyToClipboard}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </>
            )}
          </motion.button>
        </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
