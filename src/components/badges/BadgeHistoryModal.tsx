import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, CheckCircle2, Target, Award, Crown } from 'lucide-react';
import { Badge } from './BadgeCard';

interface BadgeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
}

interface DayRecord {
  date: Date;
  completed: boolean;
  tasks?: string[];
  streakDay: number;
}

// Mock data generator for demonstration
const generateMockHistory = (badge: Badge | null): DayRecord[] => {
  if (!badge) return [];
  
  const days: DayRecord[] = [];
  const endDate = badge.unlockedDate || new Date();
  const targetDays = badge.type === 'gold30' ? 30 : 60;
  
  // Generate history going backwards from unlock date
  for (let i = targetDays - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    
    // Most days are completed (realistic 85-95% completion rate for mastered badges)
    const completed = Math.random() > 0.08; // 92% completion rate
    
    days.push({
      date,
      completed,
      tasks: completed ? [
        `${badge.habitName} - Daily Practice`,
        'Track Progress',
        'Reflect on Growth'
      ] : undefined,
      streakDay: i + 1
    });
  }
  
  return days;
};

export function BadgeHistoryModal({ isOpen, onClose, badge }: BadgeHistoryModalProps) {
  const history = generateMockHistory(badge);
  const completedDays = history.filter(day => day.completed).length;
  const completionRate = Math.round((completedDays / history.length) * 100);

  if (!badge) return null;

  const getBadgeStyles = () => {
    switch (badge.type) {
      case 'gold30':
        return {
          gradient: 'linear-gradient(135deg, #C98F2B 0%, #F6C348 50%, #FFE08A 100%)',
          accent: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-400/20'
        };
      case 'prestige60':
        return {
          gradient: 'linear-gradient(135deg, #7A3CFF 0%, #B07CFF 50%, #E2C7FF 100%)',
          accent: 'text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-400/20'
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
          accent: 'text-gray-400',
          bg: 'bg-gray-500/10',
          border: 'border-gray-400/20'
        };
    }
  };

  const styles = getBadgeStyles();

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-2xl z-50 max-h-[80vh] overflow-hidden"
            style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)' }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
                
                <div className="flex items-center gap-2">
                  {badge.type === 'gold30' && <Crown className="w-5 h-5 text-yellow-400" />}
                  {badge.type === 'prestige60' && <Award className="w-5 h-5 text-purple-400" />}
                  <span className={`text-sm font-bold uppercase ${styles.accent}`}>
                    {badge.type === 'gold30' ? '30 DAYS' : 'PRESTIGE 60'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Badge Icon */}
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: styles.gradient }}
                >
                  {badge.habitIcon}
                </div>

                {/* Badge Info */}
                <div className="flex-1">
                  <h2 className="text-white text-xl font-bold mb-1">{badge.habitName}</h2>
                  <p className="text-gray-400 text-sm">
                    {badge.type === 'gold30' ? '30 days unbroken—mastery achieved' : '60 days unbroken—elite status'}
                  </p>
                  {badge.unlockedDate && (
                    <p className="text-gray-500 text-xs mt-1 font-mono">
                      Completed {badge.unlockedDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary Stats */}
              <div className={`mt-4 p-4 rounded-xl ${styles.bg} ${styles.border} border`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${styles.accent}`}>{completedDays}</div>
                    <div className="text-gray-400 text-xs">Days Completed</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${styles.accent}`}>{completionRate}%</div>
                    <div className="text-gray-400 text-xs">Success Rate</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${styles.accent}`}>{history.length}</div>
                    <div className="text-gray-400 text-xs">Total Days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* History Timeline */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium text-sm">Daily Progress History</span>
              </div>

              <div className="space-y-2">
                {history.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      day.completed 
                        ? `${styles.bg} ${styles.border} border hover:bg-opacity-80` 
                        : 'bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/50'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      day.completed 
                        ? `${styles.bg} border-2 ${styles.border.replace('border-', 'border-')}` 
                        : 'bg-gray-700 border-2 border-gray-600'
                    }`}>
                      {day.completed ? (
                        <CheckCircle2 className={`w-4 h-4 ${styles.accent}`} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                      )}
                    </div>

                    {/* Day Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">
                          Day {day.streakDay}
                        </span>
                        <span className="text-gray-400 text-xs font-mono">
                          {day.date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {day.completed && day.tasks ? (
                        <div className="space-y-1">
                          {day.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex items-center gap-2">
                              <div className={`w-1 h-1 rounded-full ${styles.accent.replace('text-', 'bg-')}`} />
                              <span className="text-gray-300 text-xs">{task}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">Day skipped</span>
                      )}
                    </div>

                    {/* Completion Badge */}
                    {day.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.02 + 0.1, duration: 0.2 }}
                        className={`px-2 py-1 rounded-full text-xs font-bold ${styles.bg} ${styles.accent}`}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700/50 bg-gray-800/50">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Target className="w-4 h-4" />
                <span>Consistency is the key to mastery</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}