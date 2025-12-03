import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Award, Check, Share, Settings, Sparkles, Zap, Trophy } from 'lucide-react';
import { MasteredHabit } from './MasteredHabitCard';
import { toast } from 'sonner@2.0.3';

interface MasteryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: MasteredHabit | null;
  onStartPrestige?: (habitId: string) => void;
}

export function MasteryDetailModal({ isOpen, onClose, habit, onStartPrestige }: MasteryDetailModalProps) {
  if (!habit) return null;

  const getStateInfo = () => {
    switch (habit.state) {
      case 'gold':
        return {
          chipBg: 'bg-yellow-500/20',
          chipText: 'text-yellow-400',
          chipIcon: Crown,
          chipLabel: 'Gold',
          subtitle: `Mastered on ${habit.goldCompletedAt.toLocaleDateString()} • ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
          summaryText: '30/30 days unbroken'
        };
      case 'prestige_complete':
        return {
          chipBg: 'bg-purple-500/20',
          chipText: 'text-purple-400',
          chipIcon: Award,
          chipLabel: 'Prestige',
          subtitle: `Prestiged on ${habit.prestigeCompletedAt?.toLocaleDateString()} • ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
          summaryText: '60/60 days unbroken'
        };
      case 'prestige_in_progress':
        return {
          chipBg: 'bg-purple-500/20',
          chipText: 'text-purple-400',
          chipIcon: Award,
          chipLabel: 'Prestige',
          subtitle: `Prestige started ${habit.prestigeStartedAt?.toLocaleDateString()} • ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
          summaryText: `${habit.prestigeProgress}/30 days (Prestige Run)`
        };
    }
  };

  const stateInfo = getStateInfo();

  const handleStartPrestige = () => {
    if (onStartPrestige) {
      onStartPrestige(habit.id);
      toast.success('🏆 Prestige Run started • Day 1 begins tomorrow');
      onClose();
    }
  };

  const handleShare = () => {
    toast.success('📱 Mastery badge shared!');
  };

  const handleSettings = () => {
    toast.info('⚙️ Habit settings coming soon');
  };

  // Generate check grid for 30 days
  const generateCheckGrid = (checks: Array<{ date: Date; completed: boolean }>) => {
    return Array.from({ length: 30 }, (_, i) => {
      const check = checks[i];
      return {
        day: i + 1,
        date: check?.date || new Date(),
        completed: check?.completed || false
      };
    });
  };

  const goldGrid = generateCheckGrid(habit.goldChecks);
  const prestigeGrid = habit.prestigeChecks ? generateCheckGrid(habit.prestigeChecks) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-4 top-8 bottom-8 max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-2xl z-50 overflow-hidden flex flex-col"
            style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)' }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
                
                <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${stateInfo.chipBg} ${stateInfo.chipText}`}>
                  <div className="flex items-center gap-2">
                    <stateInfo.chipIcon className="w-4 h-4" />
                    {habit.state === 'prestige_complete' ? 'Prestige Mastered' : stateInfo.chipLabel}
                  </div>
                </div>
              </div>

              <h2 className="text-white text-xl font-bold mb-2">{habit.name}</h2>
              <p className="text-gray-400 text-sm">{stateInfo.subtitle}</p>
              
              {/* 60 Days Total Counter for Prestige */}
              {habit.state === 'prestige_complete' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mt-3 inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-full"
                >
                  <Trophy className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 text-sm font-bold">60 Days Mastered</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Prestige Complete: Show all 60 days prominently */}
                {habit.state === 'prestige_complete' && (
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-purple-300 font-bold text-base flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Complete 60-Day Journey
                      </h3>
                      <div className="text-purple-400 font-bold text-sm">60/60 ✓</div>
                    </div>
                    <p className="text-purple-200/80 text-sm">
                      You've mastered this habit through both Gold (30 days) and Prestige (30 days) phases.
                    </p>
                  </div>
                )}

                {/* 30-Day Gold Check Grid */}
                <div>
                  <h3 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    {habit.state === 'prestige_complete' ? 'Phase 1: Gold Mastery (Days 1-30)' : 'Gold Mastery (30 Days)'}
                  </h3>
                  <div className="grid grid-cols-6 gap-2">
                    {goldGrid.map((day, index) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02, duration: 0.14 }}
                        className="relative group"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200"
                          style={{
                            backgroundColor: day.completed ? '#F6C348' : '#374151',
                            borderColor: day.completed ? '#F6C348' : '#6B7280',
                            color: day.completed ? 'white' : '#9CA3AF'
                          }}
                        >
                          {day.completed ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.14, delay: index * 0.02 + 0.1 }}
                            >
                              <Check className="w-3 h-3" />
                            </motion.div>
                          ) : (
                            day.day
                          )}
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          Day {day.day} • {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Prestige Grid (if applicable) */}
                {prestigeGrid && (
                  <div>
                    <h3 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-400" />
                      {habit.state === 'prestige_complete' ? 'Phase 2: Prestige Mastery (Days 31-60)' : 'Prestige Run (30 Days)'}
                    </h3>
                    <div className="grid grid-cols-6 gap-2">
                      {prestigeGrid.map((day, index) => (
                        <motion.div
                          key={`prestige-${day.day}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02 + 0.3, duration: 0.14 }}
                          className="relative group"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200"
                            style={{
                              backgroundColor: day.completed ? '#7A3CFF' : '#374151',
                              borderColor: day.completed ? '#7A3CFF' : '#6B7280',
                              color: day.completed ? 'white' : '#9CA3AF'
                            }}
                          >
                            {day.completed ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.14, delay: index * 0.02 + 0.4 }}
                              >
                                <Check className="w-3 h-3" />
                              </motion.div>
                            ) : (
                              habit.state === 'prestige_complete' ? (day.day + 30) : day.day
                            )}
                          </div>
                          
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Day {habit.state === 'prestige_complete' ? (day.day + 30) : day.day} • {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className={`border rounded-xl p-4 ${
                  habit.state === 'prestige_complete' 
                    ? 'bg-purple-500/10 border-purple-500/30' 
                    : 'bg-gray-800/50 border-gray-700/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      habit.state === 'prestige_complete'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-400'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    }`}>
                      {habit.state === 'prestige_complete' ? (
                        <Award className="w-6 h-6 text-white" />
                      ) : (
                        <Crown className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{stateInfo.summaryText}</div>
                      <div className={`text-sm ${
                        habit.state === 'prestige_complete' 
                          ? 'text-purple-300' 
                          : 'text-gray-400'
                      }`}>
                        {habit.state === 'prestige_complete' 
                          ? 'Elite consistency mastery achieved' 
                          : 'Consistency mastery achieved'
                        }
                      </div>
                    </div>
                    <div className="ml-auto">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          boxShadow: habit.state === 'prestige_complete' ? [
                            '0 0 8px rgba(122, 60, 255, 0.3)',
                            '0 0 16px rgba(122, 60, 255, 0.5)',
                            '0 0 8px rgba(122, 60, 255, 0.3)'
                          ] : [
                            '0 0 8px rgba(255, 138, 0, 0.3)',
                            '0 0 16px rgba(255, 138, 0, 0.5)',
                            '0 0 8px rgba(255, 138, 0, 0.3)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          habit.state === 'prestige_complete'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-400'
                            : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Prestige CTA (only for Gold and not yet prestiged) */}
                {habit.state === 'gold' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <Crown className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-purple-300 font-bold text-base mb-1">Prestige to Purple</h4>
                        <p className="text-purple-200/80 text-sm leading-relaxed">
                          Add another 30 days of consistency to evolve your Gold into Prestige Purple.
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStartPrestige}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                      style={{ boxShadow: '0 4px 20px rgba(122, 60, 255, 0.3)' }}
                    >
                      <Zap className="w-4 h-4" />
                      Start Prestige Run
                    </motion.button>
                    
                    <p className="text-purple-300/60 text-xs text-center mt-2">
                      If you miss a day, your Prestige run resets. Gold remains.
                    </p>
                  </motion.div>
                )}

                {/* Prestige Progress (if in progress) */}
                {habit.state === 'prestige_in_progress' && (
                  <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-purple-300 font-medium text-sm">Prestige Progress</span>
                      <span className="text-purple-400 font-bold text-sm">{habit.prestigeProgress}/30</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((habit.prestigeProgress || 0) / 30) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                      />
                    </div>
                    <p className="text-purple-300/80 text-sm text-center">Keep going! You're building elite status.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-gray-700/50 flex-shrink-0">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSettings}
                  className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors hover:bg-purple-700"
                >
                  <Share className="w-4 h-4" />
                  Share Mastery
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}