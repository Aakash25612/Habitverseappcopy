import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Trophy, Crown, Award, Lock } from 'lucide-react';
import { MasteredHabitCard, MasteredHabit } from './MasteredHabitCard';
import { MasteryDetailModal } from './MasteryDetailModal';
import { toast } from 'sonner@2.0.3';

interface MasteredHabitsTabProps {
  isInitialLoad?: boolean;
}

export function MasteredHabitsTab({ isInitialLoad = false }: MasteredHabitsTabProps) {
  const [selectedHabit, setSelectedHabit] = useState<MasteredHabit | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock data - in real app this would come from state/API
  const [masteredHabits] = useState<MasteredHabit[]>([
    {
      id: 'early-morning-reading',
      name: 'Early Morning Reading',
      icon: '📖',
      rule: 'Read 30 pages before 7 AM',
      state: 'prestige_complete',
      goldCompletedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
      prestigeStartedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      prestigeCompletedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      goldChecks: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (74 - i) * 24 * 60 * 60 * 1000),
        completed: true
      })),
      prestigeChecks: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (44 - i) * 24 * 60 * 60 * 1000),
        completed: true
      }))
    },
    {
      id: 'daily-exercise',
      name: 'Daily Exercise',
      icon: '🏃‍♂️',
      rule: 'Complete 45-minute workout daily',
      state: 'prestige_complete',
      goldCompletedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      prestigeStartedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      prestigeCompletedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      goldChecks: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000),
        completed: true
      })),
      prestigeChecks: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (59 - i) * 24 * 60 * 60 * 1000),
        completed: true
      }))
    },
    {
      id: 'meditation-gold',
      name: 'Mindfulness Meditation',
      icon: '🧘',
      rule: 'Meditate for 15 minutes daily',
      state: 'gold',
      goldCompletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      goldChecks: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (34 - i) * 24 * 60 * 60 * 1000),
        completed: true
      }))
    }
  ]);

  const handleHabitClick = (habit: MasteredHabit) => {
    setSelectedHabit(habit);
    setShowDetailModal(true);
  };

  const handleStartPrestige = (habitId: string) => {
    // In real app, this would update the habit state
    toast.success('🏆 Prestige Run started • Day 1 begins tomorrow');
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedHabit(null);
  };

  const goldCount = masteredHabits.filter(h => h.state === 'gold').length;
  const prestigeCount = masteredHabits.filter(h => h.state === 'prestige_complete' || h.state === 'prestige_in_progress').length;

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <motion.div
        initial={isInitialLoad ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-[#181B22] border border-gray-700 rounded-xl p-4"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.12)' }}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">{goldCount}</div>
            <div className="text-gray-400 text-xs flex items-center justify-center gap-1">
              <Crown className="w-3 h-3" />
              Gold
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">{prestigeCount}</div>
            <div className="text-gray-400 text-xs flex items-center justify-center gap-1">
              <Award className="w-3 h-3" />
              Prestige
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{masteredHabits.length}</div>
            <div className="text-gray-400 text-xs flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" />
              Total
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mastered Habits List */}
      {masteredHabits.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {masteredHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                layout
                initial={isInitialLoad ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: isInitialLoad ? 0.2 + index * 0.1 : 0,
                  layout: { duration: 0.3 }
                }}
              >
                <MasteredHabitCard
                  habit={habit}
                  onClick={() => handleHabitClick(habit)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No Mastered Habits Yet</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Master any habit for 30 days to unlock your first Gold badge and begin your journey to Prestige.
          </p>
        </motion.div>
      )}

      {/* Mastery Detail Modal */}
      <MasteryDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        habit={selectedHabit}
        onStartPrestige={handleStartPrestige}
      />
    </div>
  );
}