import { motion } from 'motion/react';
import { ChevronRight, Crown, Award, Sparkles } from 'lucide-react';

export interface MasteredHabit {
  id: string;
  name: string;
  icon: string;
  rule: string;
  state: 'gold' | 'prestige_complete' | 'prestige_in_progress';
  goldCompletedAt: Date;
  prestigeStartedAt?: Date;
  prestigeCompletedAt?: Date;
  prestigeProgress?: number; // 0-30 for in-progress prestige
  goldChecks: Array<{ date: Date; completed: boolean }>;
  prestigeChecks?: Array<{ date: Date; completed: boolean }>;
}

interface MasteredHabitCardProps {
  habit: MasteredHabit;
  onClick: () => void;
}

export function MasteredHabitCard({ habit, onClick }: MasteredHabitCardProps) {
  const getStateStyles = () => {
    switch (habit.state) {
      case 'gold':
        return {
          ringColor: 'from-yellow-400 to-yellow-600',
          ringGlow: '0 0 18px rgba(246, 195, 72, 0.2)',
          chipBg: 'bg-yellow-500/20',
          chipText: 'text-yellow-400',
          chipLabel: 'Mastered (30)',
          dateLabel: `Completed on ${habit.goldCompletedAt.toLocaleDateString()}`
        };
      case 'prestige_complete':
        return {
          ringColor: 'from-purple-400 to-purple-600',
          ringGlow: '0 0 18px rgba(122, 60, 255, 0.2)',
          chipBg: 'bg-purple-500/20',
          chipText: 'text-purple-400',
          chipLabel: 'Prestige (60)',
          dateLabel: `Prestiged on ${habit.prestigeCompletedAt?.toLocaleDateString()}`
        };
      case 'prestige_in_progress':
        return {
          ringColor: 'from-purple-400 to-purple-600',
          ringGlow: '0 0 18px rgba(122, 60, 255, 0.2)',
          chipBg: 'bg-purple-500/20',
          chipText: 'text-purple-400',
          chipLabel: `Prestige ${habit.prestigeProgress}/30`,
          dateLabel: `Started on ${habit.prestigeStartedAt?.toLocaleDateString()}`
        };
    }
  };

  const styles = getStateStyles();
  const showSparkles = habit.state === 'gold' || habit.state === 'prestige_complete';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      className="w-full bg-[#14161C] border border-white/10 rounded-2xl p-4 text-left transition-all duration-200"
      style={{ 
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        filter: 'brightness(1.02)'
      }}
    >
      <div className="flex items-center gap-4">
        {/* Habit Icon with State Ring */}
        <div className="relative">
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl relative"
            style={{
              background: `conic-gradient(${styles.ringColor}, transparent)`,
              padding: '2px'
            }}
            animate={{
              boxShadow: [
                styles.ringGlow,
                styles.ringGlow.replace('0.2', '0.3'),
                styles.ringGlow
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-full h-full bg-[#14161C] rounded-full flex items-center justify-center">
              {habit.icon}
            </div>
          </motion.div>

          {/* Sparkles for mastered habits */}
          {showSparkles && (
            <>
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2"
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0
                }}
              >
                <Sparkles className="w-2 h-2 text-yellow-400" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-1 w-1.5 h-1.5"
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [360, 180, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.7
                }}
              >
                <Sparkles className="w-1.5 h-1.5 text-purple-400" />
              </motion.div>
            </>
          )}
        </div>

        {/* Habit Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-bold text-base truncate">
              {habit.name}
            </h3>
            <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${styles.chipBg} ${styles.chipText}`}>
              <div className="flex items-center gap-1">
                {habit.state === 'gold' && <Crown className="w-3 h-3" />}
                {(habit.state === 'prestige_complete' || habit.state === 'prestige_in_progress') && <Award className="w-3 h-3" />}
                {styles.chipLabel}
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-1 opacity-80">
            {habit.rule}
          </p>

          <p className="text-gray-500 text-xs">
            {styles.dateLabel}
          </p>
        </div>

        {/* Chevron with sparkles */}
        <div className="flex items-center">
          {showSparkles && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mr-2"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </motion.div>
          )}
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </motion.button>
  );
}