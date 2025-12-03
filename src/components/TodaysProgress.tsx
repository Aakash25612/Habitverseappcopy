import { motion } from 'motion/react';
import { ChevronRight, Brain, Dumbbell } from 'lucide-react';
import { FlameIcon } from './FlameIcon';

interface TodaysProgressProps {
  isInitialLoad?: boolean;
  onNavigateToHabits: () => void;
  showGuidanceHint?: boolean;
}

export function TodaysProgress({ isInitialLoad = true, onNavigateToHabits, showGuidanceHint = false }: TodaysProgressProps) {
  const habits = [
    {
      id: 1,
      name: "Reading & Mindfulness",
      icon: Brain,
      completed: 3,
      total: 3,
      streak: 12,
      color: "purple"
    },
    {
      id: 2,
      name: "Gym & Fitness",
      icon: Dumbbell,
      completed: 0,
      total: 3,
      streak: 8,
      color: "purple"
    }
  ];

  const totalCompleted = habits.reduce((sum, habit) => sum + habit.completed, 0);
  const totalTasks = habits.reduce((sum, habit) => sum + habit.total, 0);
  const overallProgress = (totalCompleted / totalTasks) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isInitialLoad ? 2.4 : 0.4, duration: isInitialLoad ? 0.6 : 0.3 }}
      className="mb-6"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onNavigateToHabits}
        className={`group bg-gray-800/50 border rounded-xl p-6 cursor-pointer transition-all duration-300 active:bg-gray-800/70 md:hover:scale-105 md:hover:bg-gray-800/70 ${
          showGuidanceHint 
            ? 'border-gray-700' 
            : 'border-gray-700 hover:border-purple-500/50'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white mb-1">Today's Progress</h3>
            <span className="text-purple-400 text-sm">{totalCompleted}/{totalTasks} tasks completed today</span>
          </div>
          
          <motion.div
            className={`text-gray-400 md:group-hover:translate-x-1 transition-transform duration-200 ${
              showGuidanceHint ? 'text-purple-400' : ''
            }`}
            animate={showGuidanceHint ? {
              x: [0, 4, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={showGuidanceHint ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Individual Habit Progress */}
        <div className="space-y-5 mb-4">
          {habits.map((habit, index) => {
            const HabitIcon = habit.icon;
            const progressPercent = (habit.completed / habit.total) * 100;
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: isInitialLoad ? 2.6 + (index * 0.1) : 0.6 + (index * 0.1),
                  duration: 0.4 
                }}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                    <HabitIcon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="space-y-1">
                      <span className="text-gray-300 text-sm block">{habit.name}</span>
                      {habit.completed === habit.total ? (
                        <motion.span 
                          className="bg-green-600 text-white text-xs px-2.5 py-0.5 rounded-full relative whitespace-nowrap inline-block"
                          animate={{ 
                            boxShadow: [
                              '0 0 8px rgba(34, 197, 94, 0.4)',
                              '0 0 16px rgba(34, 197, 94, 0.7)',
                              '0 0 8px rgba(34, 197, 94, 0.4)'
                            ]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {habit.completed}/{habit.total} today ✓
                          <motion.div
                            animate={{ 
                              opacity: [0, 0.5, 0],
                              scale: [0.8, 1.2, 0.8]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-green-400/30 rounded-full blur-sm -z-10"
                          />
                        </motion.span>
                      ) : (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap inline-block ${
                          habit.completed > 0
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {habit.completed}/{habit.total} today
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Fire Emoji + Streak Layout */}
                <div className="flex flex-col items-center min-w-[3rem]">
                  <div className="flex items-center gap-1 mb-0.5">
                    <FlameIcon streak={habit.streak} />
                    <span className={`text-orange-500 font-medium ${
                      habit.streak >= 30 ? 'text-base font-bold' :
                      habit.streak >= 15 ? 'text-sm font-bold' :
                      habit.streak >= 8 ? 'text-sm' : 'text-sm'
                    }`}>{habit.streak}</span>
                  </div>
                  <span className="text-gray-400 text-xs leading-none">streak</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Guidance Hint for New Users */}
        {showGuidanceHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}
            className="mt-3 pt-3 border-t border-purple-500/30"
          >
            <div className="flex items-center justify-center gap-2 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  color: ["#A855F7", "#C084FC", "#A855F7"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-purple-400 text-sm font-medium"
              >
                👆 Tap here to manage your habits!
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}