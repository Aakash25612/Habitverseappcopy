import { motion, AnimatePresence } from 'motion/react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Lightbulb, ChevronDown, Book, Check, Plus, Zap, Heart, Brain, Target, Dumbbell, Settings, Clock, Trash2, Minus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ChatModal } from './ChatModal';
import { ConfettiEffect } from './ConfettiEffect';
import { FlameIcon } from './FlameIcon';
import { HabitScienceSection } from './HabitScienceSection';
import { AddHabitModal } from './AddHabitModal';

interface HabitsPageProps {
  isInitialLoad?: boolean;
  loginStreak?: number;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
  xpValue: number;
}

interface XPBubbleAnimation {
  id: string;
  x: number;
  y: number;
  value: number;
}

interface RibbonToast {
  id: string;
  message: string;
  xp: number;
}

export function HabitsPage({ isInitialLoad = true, loginStreak = 1 }: HabitsPageProps) {
  const [showProTips, setShowProTips] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [expandedHabit, setExpandedHabit] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBigConfetti, setShowBigConfetti] = useState(false);
  const [clickedTaskRef, setClickedTaskRef] = useState<HTMLElement | null>(null);
  const [xpBubbles, setXpBubbles] = useState<XPBubbleAnimation[]>([]);
  const [ribbonToasts, setRibbonToasts] = useState<RibbonToast[]>([]);
  const [streakBump, setStreakBump] = useState<number | null>(null);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [customHabits, setCustomHabits] = useState<any[]>([
    {
      name: "Morning Workout",
      icon: "dumbbell",
      color: "blue",
      tasks: [
        { id: 1, text: "15-minute cardio session", completed: false, xpValue: 10 },
        { id: 2, text: "Strength training routine", completed: false, xpValue: 10 },
        { id: 3, text: "Cool down and stretch", completed: false, xpValue: 10 }
      ],
      streak: 0,
      daysLeft: 30,
      description: "Start your day with energy and strength"
    }
  ]);
  const [scienceLabExpanded, setScienceLabExpanded] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<{type: 'custom' | 'default', index: number} | null>(null);

  const taskRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [readingHabitTasks, setReadingHabitTasks] = useState<Task[]>([
    { id: 1, text: "Read 10 pages of a book", completed: true, xpValue: 10 },
    { id: 2, text: "Write in journal for 5 minutes", completed: true, xpValue: 10 },
    { id: 3, text: "Meditate for 10 minutes", completed: true, xpValue: 10 }
  ]);

  const [gymHabitTasks, setGymHabitTasks] = useState<Task[]>([
    { id: 1, text: "Do 20 push-ups", completed: false, xpValue: 10 },
    { id: 2, text: "30-minute workout", completed: false, xpValue: 10 },
    { id: 3, text: "Drink 8 glasses of water", completed: false, xpValue: 10 }
  ]);

  const createXPBubble = (x: number, y: number, value: number) => {
    const bubbleId = Date.now().toString() + Math.random();
    setXpBubbles(prev => [...prev, { id: bubbleId, x, y, value }]);
    setTimeout(() => {
      setXpBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
    }, 1200); // Match the enhanced animation duration
  };

  const createRibbonToast = (habitType: string, xp: number) => {
    const toastId = Date.now().toString() + Math.random();
    setRibbonToasts(prev => [...prev, { 
      id: toastId, 
      message: `${habitType} Day Won`, 
      xp 
    }]);
    setTimeout(() => {
      setRibbonToasts(prev => prev.filter(toast => toast.id !== toastId));
    }, 1600);
  };

  const toggleTaskCompletion = (taskId: number, habitType: 'reading' | 'gym') => {
    const currentTasks = habitType === 'reading' ? readingHabitTasks : gymHabitTasks;
    const setTasks = habitType === 'reading' ? setReadingHabitTasks : setGymHabitTasks;
    
    const task = currentTasks.find(t => t.id === taskId);
    const taskBeingCompleted = task && !task.completed;

    if (taskBeingCompleted) {
      // Get button position for XP bubble
      const taskKey = `${habitType}-${taskId}`;
      const buttonElement = taskRefs.current.get(taskKey);
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        // Center the bubble on the button with some adjustments for mobile
        const bubbleX = rect.left + (rect.width / 2);
        const bubbleY = rect.top + (rect.height / 2);
        createXPBubble(bubbleX, bubbleY, task.xpValue);
        setClickedTaskRef(buttonElement);
      }
      setShowConfetti(true);
      // Reset small confetti after a short time
      setTimeout(() => setShowConfetti(false), 600);
    }

    setTasks(prev => {
      const updatedTasks = prev.map(t => 
        t.id === taskId 
          ? { ...t, completed: !t.completed }
          : t
      );
      
      // Check if all tasks are now completed
      const completedCount = updatedTasks.filter(t => t.completed).length;
      if (taskBeingCompleted && completedCount === updatedTasks.length) {
        const completionBonus = 50; // Completion bonus is always 50 XP
        setTimeout(() => {
          createRibbonToast(habitType === 'reading' ? 'Reading' : 'Fitness', completionBonus);
          setShowBigConfetti(true);
          setStreakBump(habitType === 'reading' ? 1 : 2);
          setTimeout(() => setStreakBump(null), 180);
          // Reset big confetti after the enhanced duration
          setTimeout(() => setShowBigConfetti(false), 1500);
        }, 600);
        
        // Check if ALL habits are now completed (daily bonus check)
        setTimeout(() => {
          const otherHabitTasks = habitType === 'reading' ? gymHabitTasks : readingHabitTasks;
          const otherHabitCompleted = otherHabitTasks.length === 0 || otherHabitTasks.every(t => t.completed);
          const customHabitsCompleted = customHabits.every(habit => 
            habit.tasks.every((t: any) => t.completed)
          );
          
          const allActiveHabitsCompleted = otherHabitCompleted && 
            (customHabits.length === 0 || customHabitsCompleted);
          
          // Only show daily bonus if there are actually habits to complete
          const hasActiveHabits = updatedTasks.length > 0 || otherHabitTasks.length > 0 || customHabits.length > 0;
          
          if (allActiveHabitsCompleted && hasActiveHabits) {
            setTimeout(() => {
              createRibbonToast('Daily Bonus', 50);
              setShowBigConfetti(true);
              setTimeout(() => setShowBigConfetti(false), 1500);
            }, 800);
          }
        }, 100);
      }
      
      return updatedTasks;
    });
  };

  const toggleCustomTaskCompletion = (habitIndex: number, taskId: number) => {
    const habit = customHabits[habitIndex];
    const task = habit.tasks.find((t: any) => t.id === taskId);
    const taskBeingCompleted = task && !task.completed;

    if (taskBeingCompleted) {
      // Get button position for XP bubble
      const taskKey = `custom-${habit.name}-${taskId}`;
      const buttonElement = taskRefs.current.get(taskKey);
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        const bubbleX = rect.left + (rect.width / 2);
        const bubbleY = rect.top + (rect.height / 2);
        createXPBubble(bubbleX, bubbleY, task.xpValue);
        setClickedTaskRef(buttonElement);
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 600);
    }

    setCustomHabits(prev => {
      const updatedHabits = prev.map((habit, idx) => {
        if (idx === habitIndex) {
          const updatedTasks = habit.tasks.map((t: any) => 
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
          
          // Check if all tasks in this habit are completed
          const completedCount = updatedTasks.filter((t: any) => t.completed).length;
          if (taskBeingCompleted && completedCount === updatedTasks.length) {
            const completionBonus = 50;
            setTimeout(() => {
              createRibbonToast(habit.name, completionBonus);
              setShowBigConfetti(true);
              setTimeout(() => setShowBigConfetti(false), 1500);
            }, 600);
          }
          
          return { ...habit, tasks: updatedTasks };
        }
        return habit;
      });
      
      // Check if ALL habits are now completed (daily bonus check)
      setTimeout(() => {
        const readingFullyCompleted = readingHabitTasks.length > 0 && readingHabitTasks.every(t => t.completed);
        const gymFullyCompleted = gymHabitTasks.length > 0 && gymHabitTasks.every(t => t.completed);
        const customHabitsCompleted = updatedHabits.every(habit => 
          habit.tasks.every((t: any) => t.completed)
        );
        
        const allActiveHabitsCompleted = (
          (readingHabitTasks.length === 0 || readingFullyCompleted) &&
          (gymHabitTasks.length === 0 || gymFullyCompleted) &&
          (updatedHabits.length === 0 || customHabitsCompleted)
        );
        
        // Only show daily bonus if there are actually habits to complete
        const hasActiveHabits = readingHabitTasks.length > 0 || gymHabitTasks.length > 0 || updatedHabits.length > 0;
        
        if (taskBeingCompleted && allActiveHabitsCompleted && hasActiveHabits) {
          setTimeout(() => {
            createRibbonToast('Daily Bonus', 50);
            setShowBigConfetti(true);
            setTimeout(() => setShowBigConfetti(false), 1500);
          }, 800);
        }
      }, 100);
      
      return updatedHabits;
    });
  };

  const getCompletedCount = (tasks: Task[]) => tasks.filter(t => t.completed).length;
  const getTotalXP = (tasks: Task[]) => tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xpValue, 0);

  const readingCompleted = getCompletedCount(readingHabitTasks);
  const gymCompleted = getCompletedCount(gymHabitTasks);
  const readingXP = getTotalXP(readingHabitTasks);
  const gymXP = getTotalXP(gymHabitTasks);

  // Calculate available slots (start with 2, unlock more with 7+ day streaks)
  const baseSlots = 2; // Reading and Gym habits (always available)
  const streakBonusSlots = loginStreak >= 7 ? 2 : 0; // Unlock 2 additional slots at 7+ day streak
  const maxSlots = 4; // Maximum possible habits
  const availableSlots = Math.min(maxSlots, baseSlots + streakBonusSlots);
  
  // Count currently used slots (active default habits + custom habits)
  const activeDefaultHabits = (readingHabitTasks.length > 0 ? 1 : 0) + (gymHabitTasks.length > 0 ? 1 : 0);
  const usedSlots = activeDefaultHabits + customHabits.length;

  const handleAddHabit = (newHabit: any) => {
    const habitWithTasks = {
      ...newHabit,
      tasks: newHabit.tasks.map((task: any) => ({
        ...task,
        completed: false
      })),
      streak: 0,
      daysLeft: 30
    };
    setCustomHabits(prev => [...prev, habitWithTasks]);
  };

  const handleAIHabitAccepted = (habitSuggestion: any) => {
    // Convert AI habit suggestion to the format expected by our system
    const newHabit = {
      name: habitSuggestion.title,
      icon: 'target', // Default icon for AI habits
      color: 'purple', // Default color for AI habits
      tasks: habitSuggestion.tasks.map((taskText: string, index: number) => ({
        id: index + 1,
        text: taskText,
        completed: false,
        xpValue: habitSuggestion.xpPerTask
      })),
      streak: 0,
      daysLeft: 30,
      description: habitSuggestion.description
    };
    
    setCustomHabits(prev => [...prev, newHabit]);
    
    // Show success toast
    toast.success(`🎯 ${newHabit.name} locked in for 30 days! Your journey begins now.`);
  };

  const handleDeleteHabit = (type: 'custom' | 'default', index: number) => {
    setHabitToDelete({ type, index });
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteHabit = () => {
    if (habitToDelete) {
      if (habitToDelete.type === 'custom') {
        const deletedHabit = customHabits[habitToDelete.index];
        setCustomHabits(prev => prev.filter((_, i) => i !== habitToDelete.index));
        toast.success(`🗑️ ${deletedHabit.name} habit deleted`);
      } else if (habitToDelete.type === 'default') {
        const habitNames = ['📚 Reading & Mindfulness', '💪 Gym & Fitness'];
        const habitName = habitNames[habitToDelete.index];
        
        if (habitToDelete.index === 0) {
          // Delete Reading habit - reset its tasks
          setReadingHabitTasks([]);
          setExpandedHabit(null);
        } else if (habitToDelete.index === 1) {
          // Delete Gym habit - reset its tasks  
          setGymHabitTasks([]);
          setExpandedHabit(null);
        }
        
        toast.success(`🗑️ ${habitName} habit deleted`);
      }
    }
    setShowDeleteConfirmation(false);
    setHabitToDelete(null);
    setDeleteMode(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setHabitToDelete(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'radial-gradient(circle at center, #0B0B1D 0%, #000000 100%)'
    }}>
      <div className="relative z-10 max-w-md mx-auto px-6 pt-12 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isInitialLoad ? 0.2 : 0.1, duration: isInitialLoad ? 0.6 : 0.3 }}
          className="text-center mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isInitialLoad ? 0.1 : 0.05, duration: isInitialLoad ? 0.8 : 0.4 }}
            className="text-white mb-4 leading-tight font-bold"
            style={{ fontSize: '28px', lineHeight: '1.3' }}
          >
            Are you ready to become the best version of you?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-400 mb-6"
            style={{ fontSize: '15px', lineHeight: '1.4' }}
          >
            Build habits that transform your life, one day at a time
          </motion.p>

          {/* AI Coach Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isInitialLoad ? 0.4 : 0.1, duration: isInitialLoad ? 0.6 : 0.3 }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setChatModalOpen(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl mb-6 flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 btn-press"
          >
            <MessageCircle className="w-5 h-5" />
            <span style={{ fontSize: '15px', fontWeight: '600' }}>AI Coach: Design My Daily Habits</span>
          </motion.button>
        </motion.div>

        {/* Pro Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isInitialLoad ? 0.5 : 0.2, duration: isInitialLoad ? 0.6 : 0.3 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.01, boxShadow: '0 0 12px rgba(139, 92, 246, 0.2)' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowProTips(!showProTips)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 transition-all duration-300 hover:bg-gray-800/70 btn-press"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400" style={{ fontSize: '14px', fontWeight: '500' }}>Pro Tips & How It Works</span>
              </div>
              <motion.div
                animate={{ rotate: showProTips ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-purple-400" />
              </motion.div>
            </div>
          </motion.button>

          <AnimatePresence>
            {showProTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-gray-800/30 border border-gray-700/50 rounded-xl p-4"
              >
                <div className="space-y-6 text-gray-300" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  {/* Success Tips */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span>💡</span>
                      Success Tips
                    </h4>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Start small and build momentum gradually</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Focus on consistency over perfection</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Stack new habits onto existing routines</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Celebrate small wins to build positive momentum</span>
                      </li>
                    </ul>
                  </div>

                  {/* XP System */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span>⚡</span>
                      XP System
                    </h4>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Complete habits to gain XP <span className="text-green-400 font-semibold">(+50)</span></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Skip habits to lose XP <span className="text-red-400 font-semibold">(-30)</span></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Protect your XP and momentum.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Unlock System */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span>🔓</span>
                      Unlock System
                    </h4>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Start with <span className="text-white font-semibold">2 habit slots</span></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span><span className="font-semibold">3-day streak</span> of ALL habits = 3rd slot unlocked</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span><span className="font-semibold">7-day streak</span> of ALL habits = 4th slot unlocked</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Must complete <span className="font-semibold">every habit every day</span> to maintain streak</span>
                      </li>
                    </ul>
                  </div>

                  {/* Mastery & Prestige System */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span>🏆</span>
                      Mastery & Prestige System
                    </h4>
                    <ul className="space-y-2 pl-1">
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span><span className="font-semibold">30 days</span> = Habit Mastered! (Gold Badge)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Option to continue to <span className="font-semibold">60 days for Prestige</span> (Purple Badge)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>After 30 days, choose to prestige or learn something new</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Mastered habits move to <span className="font-semibold">"Avatar" trophy case</span></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>Unlocks cosmetics, badges & <span className="font-semibold">massive XP bonus</span></span>
                      </li>
                    </ul>
                  </div>

                  {/* Pro Tip */}
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">💡</span>
                      <div>
                        <h5 className="text-white font-semibold mb-2">Pro Tip:</h5>
                        <p className="text-gray-300">
                          Consistency beats perfection. Focus on completing all your habits daily rather than adding too many at once!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Your Habits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isInitialLoad ? 0.6 : 0.25, duration: isInitialLoad ? 0.6 : 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold" style={{ fontSize: '20px' }}>Your Habits</h2>
            <div className="flex items-center gap-3">
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full font-tabular" style={{ fontSize: '13px', fontWeight: '500' }}>{usedSlots}/{availableSlots} slots</span>
              {(
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteMode(!deleteMode)}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    deleteMode 
                      ? 'bg-red-600/20 border-red-500/50 text-red-400' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-500/50'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Individual Habit Cards - Separated */}
          <div className="space-y-6">
            {/* Reading & Mindfulness Habit Card */}
            {readingHabitTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: isInitialLoad ? 0.8 : 0.4,
                duration: 0.4 
              }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setExpandedHabit(expandedHabit === 1 ? null : 1)}
              className="relative bg-gradient-to-br from-purple-950/40 via-indigo-950/40 to-gray-900/80 border border-purple-500/30 rounded-2xl p-5 transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer overflow-hidden"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-indigo-600/5 animate-pulse" />
              
              <div className="relative z-10">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📚</span>
                      <span className="text-white font-semibold">Reading & Mindfulness</span>
                    </div>
                    
                    {/* Status Badge */}
                    {readingCompleted === 3 ? (
                      <motion.span 
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-3 py-1 rounded-full relative whitespace-nowrap inline-flex items-center gap-1.5"
                        animate={{ 
                          boxShadow: [
                            '0 0 12px rgba(34, 197, 94, 0.5)',
                            '0 0 20px rgba(34, 197, 94, 0.8)',
                            '0 0 12px rgba(34, 197, 94, 0.5)'
                          ]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Check className="w-3 h-3" />
                        Completed Today
                      </motion.span>
                    ) : (
                      <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap inline-block ${
                        readingCompleted > 0
                          ? 'bg-yellow-600/80 text-white'
                          : 'bg-gray-600/50 text-gray-300'
                      }`}>
                        {readingCompleted}/3 tasks done
                      </span>
                    )}
                  </div>

                  {/* Streak Display */}
                  <div className="relative flex-shrink-0">
                    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-3 backdrop-blur-sm">
                      <motion.div
                        key={streakBump === 1 ? 'bump-1' : 'normal-1'}
                        initial={streakBump === 1 ? { scale: 1.3 } : {}}
                        animate={streakBump === 1 ? { scale: 1 } : {}}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center"
                      >
                        <FlameIcon streak={12} />
                        <span className="text-orange-500 font-bold text-xl leading-none mt-1">12</span>
                        <span className="text-gray-400 text-[10px] leading-none mt-1">day streak</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Mastery Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-xs font-medium">Journey to Mastery</span>
                    <span className="text-purple-400 text-xs font-bold">12/30 days</span>
                  </div>
                  
                  <div className="relative w-full bg-gray-800/60 rounded-full h-2.5 shadow-inner border border-gray-700/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "40%" }}
                      transition={{ delay: isInitialLoad ? 0.9 : 0.45, duration: 0.8, ease: "easeOut" }}
                      className="relative h-2.5 rounded-full overflow-hidden"
                      style={{
                        background: 'linear-gradient(90deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%)',
                        boxShadow: '0 0 12px rgba(168, 85, 247, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        animate={{
                          x: ['-100%', '200%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-0 w-1/3"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
                        }}
                      />
                    </motion.div>
                    
                    {/* Milestone markers */}
                    {[25, 50, 75].map((position) => (
                      <div
                        key={position}
                        className="absolute top-0 bottom-0 w-0.5 bg-gray-600/60"
                        style={{ left: `${position}%` }}
                      />
                    ))}
                  </div>
                  
                  {/* Milestone labels */}
                  <div className="flex justify-between mt-1 px-0.5">
                    {[7, 14, 21, 30].map((day) => (
                      <span
                        key={day}
                        className={`text-[9px] ${
                          12 >= day ? 'text-purple-400 font-semibold' : 'text-gray-500'
                        }`}
                      >
                        {day}d
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: expandedHabit === 1 ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full bg-gray-800/50 border border-gray-600/50 flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </div>
                
                {/* Delete Button (when in delete mode) */}
                {deleteMode && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHabit('default', 0);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 hover:border-red-500 flex items-center justify-center transition-colors z-20"
                  >
                    <Minus className="w-4 h-4 text-red-400" />
                  </motion.button>
                )}
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedHabit === 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-700/30"
                  >
                    {/* Today's Tasks */}
                    <div className="mb-5">
                      <h4 className="text-white mb-3 flex items-center gap-2 font-bold" style={{ fontSize: '14px' }}>
                        <span>✅</span>
                        Today's Tasks
                      </h4>
                      <div className="space-y-0">
                        {readingHabitTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="flex items-center gap-3 group py-3 border-b border-white/[0.06] last:border-b-0"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{
                                  backgroundColor: task.completed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                  boxShadow: task.completed ? '0 0 8px rgba(34, 197, 94, 0.3)' : 'none'
                                }}
                              >
                                <Check className={`w-5 h-5 ${task.completed ? 'text-green-400' : 'text-gray-500'}`} />
                              </div>
                              <span 
                                className={`transition-all duration-200 ${
                                  task.completed 
                                    ? 'text-gray-400 line-through opacity-70' 
                                    : 'text-gray-300'
                                }`}
                                style={{ fontSize: '14px', lineHeight: '1.4' }}
                              >
                                {task.text}
                              </span>
                            </div>
                            
                            <motion.button
                              ref={(el) => {
                                if (el) {
                                  taskRefs.current.set(`reading-${task.id}`, el);
                                }
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleTaskCompletion(task.id, 'reading')}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 btn-press ${
                                task.completed
                                  ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/30'
                                  : 'border-gray-500 hover:border-gray-400'
                              }`}
                              style={{ minHeight: '44px', minWidth: '44px' }}
                            >
                              {task.completed && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 200, duration: 0.55 }}
                                  className="text-white"
                                >
                                  <Check className="w-4 h-4" />
                                </motion.div>
                              )}
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Science Section - Benefits and Consequences */}
                    <div className="mb-6">
                      <HabitScienceSection habitType="reading" />
                    </div>

                    {/* XP Information */}
                    <div className="pt-2 border-t border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-tabular">+50 XP</span>
                          <span className="text-gray-500">complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-tabular">-30 XP</span>
                          <span className="text-gray-500">skip</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            )}

            {/* Gym & Fitness Habit Card */}
            {gymHabitTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: isInitialLoad ? 0.9 : 0.5,
                duration: 0.4 
              }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setExpandedHabit(expandedHabit === 2 ? null : 2)}
              className="relative bg-gradient-to-br from-purple-950/40 via-indigo-950/40 to-gray-900/80 border border-purple-500/30 rounded-2xl p-5 transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer overflow-hidden"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-indigo-600/5 animate-pulse" />
              
              <div className="relative z-10">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💪</span>
                      <span className="text-white font-semibold">Gym & Fitness</span>
                    </div>
                    
                    {/* Status Badge */}
                    {gymCompleted === 3 ? (
                      <motion.span 
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-3 py-1 rounded-full relative whitespace-nowrap inline-flex items-center gap-1.5"
                        animate={{ 
                          boxShadow: [
                            '0 0 12px rgba(34, 197, 94, 0.5)',
                            '0 0 20px rgba(34, 197, 94, 0.8)',
                            '0 0 12px rgba(34, 197, 94, 0.5)'
                          ]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Check className="w-3 h-3" />
                        Completed Today
                      </motion.span>
                    ) : (
                      <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap inline-block ${
                        gymCompleted > 0
                          ? 'bg-yellow-600/80 text-white'
                          : 'bg-gray-600/50 text-gray-300'
                      }`}>
                        {gymCompleted}/3 tasks done
                      </span>
                    )}
                  </div>

                  {/* Streak Display */}
                  <div className="relative flex-shrink-0">
                    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-3 backdrop-blur-sm">
                      <motion.div
                        key={streakBump === 2 ? 'bump-2' : 'normal-2'}
                        initial={streakBump === 2 ? { scale: 1.3 } : {}}
                        animate={streakBump === 2 ? { scale: 1 } : {}}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center"
                      >
                        <FlameIcon streak={8} />
                        <span className="text-orange-500 font-bold text-xl leading-none mt-1">8</span>
                        <span className="text-gray-400 text-[10px] leading-none mt-1">day streak</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Mastery Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-xs font-medium">Journey to Mastery</span>
                    <span className="text-purple-400 text-xs font-bold">8/30 days</span>
                  </div>
                  
                  <div className="relative w-full bg-gray-800/60 rounded-full h-2.5 shadow-inner border border-gray-700/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "27%" }}
                      transition={{ delay: isInitialLoad ? 1.0 : 0.55, duration: 0.8, ease: "easeOut" }}
                      className="relative h-2.5 rounded-full overflow-hidden"
                      style={{
                        background: 'linear-gradient(90deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%)',
                        boxShadow: '0 0 12px rgba(168, 85, 247, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        animate={{
                          x: ['-100%', '200%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-0 w-1/3"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
                        }}
                      />
                    </motion.div>
                    
                    {/* Milestone markers */}
                    {[25, 50, 75].map((position) => (
                      <div
                        key={position}
                        className="absolute top-0 bottom-0 w-0.5 bg-gray-600/60"
                        style={{ left: `${position}%` }}
                      />
                    ))}
                  </div>
                  
                  {/* Milestone labels */}
                  <div className="flex justify-between mt-1 px-0.5">
                    {[7, 14, 21, 30].map((day) => (
                      <span
                        key={day}
                        className={`text-[9px] ${
                          8 >= day ? 'text-purple-400 font-semibold' : 'text-gray-500'
                        }`}
                      >
                        {day}d
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: expandedHabit === 2 ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full bg-gray-800/50 border border-gray-600/50 flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </div>
                
                {/* Delete Button (when in delete mode) */}
                {deleteMode && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHabit('default', 1);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 hover:border-red-500 flex items-center justify-center transition-colors z-20"
                  >
                    <Minus className="w-4 h-4 text-red-400" />
                  </motion.button>
                )}
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedHabit === 2 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-700/30"
                  >
                    {/* Today's Tasks */}
                    <div className="mb-6">
                      <h4 className="text-white mb-4 flex items-center gap-2 font-bold" style={{ fontSize: '16px' }}>
                        <span>✅</span>
                        Today's Tasks
                      </h4>
                      <div className="space-y-0">
                        {gymHabitTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="flex items-center gap-3 group py-3 border-b border-white/[0.06] last:border-b-0"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{
                                  backgroundColor: task.completed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                  boxShadow: task.completed ? '0 0 8px rgba(34, 197, 94, 0.3)' : 'none'
                                }}
                              >
                                <Check className={`w-5 h-5 ${task.completed ? 'text-green-400' : 'text-gray-500'}`} />
                              </div>
                              <span 
                                className={`transition-all duration-200 ${
                                  task.completed 
                                    ? 'text-gray-400 line-through opacity-70' 
                                    : 'text-gray-300'
                                }`}
                                style={{ fontSize: '14px', lineHeight: '1.4' }}
                              >
                                {task.text}
                              </span>
                            </div>
                            
                            <motion.button
                              ref={(el) => {
                                if (el) {
                                  taskRefs.current.set(`gym-${task.id}`, el);
                                }
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleTaskCompletion(task.id, 'gym')}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 btn-press ${
                                task.completed
                                  ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/30'
                                  : 'border-gray-500 hover:border-gray-400'
                              }`}
                              style={{ minHeight: '44px', minWidth: '44px' }}
                            >
                              {task.completed && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 200, duration: 0.55 }}
                                  className="text-white"
                                >
                                  <Check className="w-4 h-4" />
                                </motion.div>
                              )}
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Science Section - Benefits and Consequences */}
                    <div className="mb-6">
                      <HabitScienceSection habitType="gym" />
                    </div>

                    {/* XP Information */}
                    <div className="pt-2 border-t border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-tabular">+50 XP</span>
                          <span className="text-gray-500">complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-tabular">-30 XP</span>
                          <span className="text-gray-500">skip</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            )}

            {/* Custom Habits from AI Coach */}
            {customHabits.map((habit, index) => {
              const completedTasks = habit.tasks.filter((t: any) => t.completed).length;
              const totalTasks = habit.tasks.length;
              const streak = habit.streak || 0;
              const daysLeft = habit.daysLeft || 30;
              const currentDay = 30 - daysLeft;
              
              return (
              <motion.div
                key={habit.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: isInitialLoad ? 1.2 + (index * 0.2) : 0.6 + (index * 0.1),
                  duration: 0.4 
                }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setExpandedHabit(expandedHabit === (100 + index) ? null : (100 + index))}
                className="relative bg-gradient-to-br from-purple-950/40 via-gray-900/60 to-gray-900/80 border border-purple-500/30 rounded-2xl p-5 transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer overflow-hidden"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5 animate-pulse" />
                
                <div className="relative z-10">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🎯</span>
                        <span className="text-white font-semibold">{habit.name}</span>
                      </div>
                      
                      {/* Status Badge */}
                      {completedTasks === totalTasks ? (
                        <motion.span 
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-3 py-1 rounded-full relative whitespace-nowrap inline-flex items-center gap-1.5"
                          animate={{ 
                            boxShadow: [
                              '0 0 12px rgba(34, 197, 94, 0.5)',
                              '0 0 20px rgba(34, 197, 94, 0.8)',
                              '0 0 12px rgba(34, 197, 94, 0.5)'
                            ]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Check className="w-3 h-3" />
                          Completed Today
                        </motion.span>
                      ) : (
                        <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap inline-block ${
                          completedTasks > 0
                            ? 'bg-yellow-600/80 text-white'
                            : 'bg-gray-600/50 text-gray-300'
                        }`}>
                          {completedTasks}/{totalTasks} tasks done
                        </span>
                      )}
                    </div>

                    {/* Streak Display */}
                    <div className="relative flex-shrink-0">
                      <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-3 backdrop-blur-sm">
                        <div className="flex flex-col items-center">
                          <FlameIcon streak={streak} />
                          <span className={`${streak > 0 ? 'text-orange-500' : 'text-gray-500'} font-bold text-xl leading-none mt-1`}>{streak}</span>
                          <span className="text-gray-400 text-[10px] leading-none mt-1">day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mastery Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300 text-xs font-medium">Journey to Mastery</span>
                      <span className="text-purple-400 text-xs font-bold">{currentDay}/30 days</span>
                    </div>
                    
                    <div className="relative w-full bg-gray-800/60 rounded-full h-2.5 shadow-inner border border-gray-700/30 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentDay / 30) * 100}%` }}
                        transition={{ delay: isInitialLoad ? 1.4 + (index * 0.2) : 0.75 + (index * 0.1), duration: 0.8, ease: "easeOut" }}
                        className="relative h-2.5 rounded-full overflow-hidden"
                        style={{
                          background: 'linear-gradient(90deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)',
                          boxShadow: '0 0 12px rgba(168, 85, 247, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          animate={{
                            x: ['-100%', '200%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute inset-0 w-1/3"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
                          }}
                        />
                      </motion.div>
                      
                      {/* Milestone markers */}
                      {[25, 50, 75].map((position) => (
                        <div
                          key={position}
                          className="absolute top-0 bottom-0 w-0.5 bg-gray-600/60"
                          style={{ left: `${position}%` }}
                        />
                      ))}
                    </div>
                    
                    {/* Milestone labels */}
                    <div className="flex justify-between mt-1 px-0.5">
                      {[7, 14, 21, 30].map((day) => (
                        <span
                          key={day}
                          className={`text-[9px] ${
                            currentDay >= day ? 'text-purple-400 font-semibold' : 'text-gray-500'
                          }`}
                        >
                          {day}d
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: expandedHabit === (100 + index) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 rounded-full bg-gray-800/50 border border-gray-600/50 flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </div>
                  
                  {/* Delete Button (when in delete mode) */}
                  {deleteMode && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHabit('custom', index);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 hover:border-red-500 flex items-center justify-center transition-colors z-20"
                    >
                      <Minus className="w-4 h-4 text-red-400" />
                    </motion.button>
                  )}
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedHabit === (100 + index) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-700/30"
                    >
                      {/* Description */}
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {habit.description}
                        </p>
                      </div>

                      {/* Today's Tasks */}
                      <div className="mb-5">
                        <h4 className="text-white mb-3 flex items-center gap-2 font-bold" style={{ fontSize: '14px' }}>
                          <span>✅</span>
                          Today's Tasks
                        </h4>
                        <div className="space-y-0">
                          {habit.tasks.map((task: any, taskIndex: number) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: taskIndex * 0.1, duration: 0.4 }}
                              className="flex items-center gap-3 group py-3 border-b border-white/[0.06] last:border-b-0"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{
                                    backgroundColor: task.completed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                    boxShadow: task.completed ? '0 0 8px rgba(34, 197, 94, 0.3)' : 'none'
                                  }}
                                >
                                  <Check className={`w-5 h-5 ${task.completed ? 'text-green-400' : 'text-gray-500'}`} />
                                </div>
                                <span 
                                  className={`transition-all duration-200 ${
                                    task.completed 
                                      ? 'text-gray-400 line-through opacity-70' 
                                      : 'text-gray-300'
                                  }`}
                                  style={{ fontSize: '14px', lineHeight: '1.4' }}
                                >
                                  {task.text}
                                </span>
                              </div>
                              
                              <motion.button
                                ref={(el) => {
                                  if (el) {
                                    taskRefs.current.set(`custom-${habit.name}-${task.id}`, el);
                                  }
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleCustomTaskCompletion(index, task.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 btn-press ${
                                  task.completed
                                    ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/30'
                                    : 'border-gray-500 hover:border-gray-400'
                                }`}
                                style={{ minHeight: '44px', minWidth: '44px' }}
                              >
                                {task.completed && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, duration: 0.55 }}
                                    className="text-white"
                                  >
                                    <Check className="w-4 h-4" />
                                  </motion.div>
                                )}
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* XP Information */}
                      <div className="pt-2 border-t border-gray-700/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400 font-tabular">+{habit.tasks.reduce((sum: number, task: any) => sum + task.xpValue, 0) + 50} XP</span>
                            <span className="text-gray-500">complete</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-red-400 font-tabular">-30 XP</span>
                            <span className="text-gray-500">skip</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              );
            })}

            {/* Habit Science Lab Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isInitialLoad ? 1.0 : 0.6, duration: 0.4 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl backdrop-blur-sm relative overflow-hidden"
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2 w-16 h-16 border border-blue-400/20 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-12 h-12 border border-purple-400/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-blue-300/10 rounded-full"></div>
              </div>

              <div className="relative z-10">
                {/* Clickable Header */}
                <motion.button
                  onClick={() => setScienceLabExpanded(!scienceLabExpanded)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full p-5 text-left flex items-center justify-between group transition-all duration-300 hover:bg-blue-500/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-400/40"
                    >
                      <Brain className="w-4 h-4 text-blue-300" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">Habit Science Lab</h3>
                      <p className="text-gray-400 text-xs">Neural pathways & behavior insights</p>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ 
                      rotate: scienceLabExpanded ? 180 : 0,
                      scale: scienceLabExpanded ? 1.1 : 1
                    }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeOut" 
                    }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-blue-300 group-hover:text-blue-200 transition-colors duration-200" />
                  </motion.div>
                </motion.button>

                {/* Expandable Content */}
                <AnimatePresence>
                  {scienceLabExpanded && (
                    <motion.div
                      initial={{ 
                        opacity: 0, 
                        height: 0,
                        y: -10
                      }}
                      animate={{ 
                        opacity: 1, 
                        height: "auto",
                        y: 0
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        y: -10
                      }}
                      transition={{ 
                        duration: 0.4, 
                        ease: "easeOut",
                        opacity: { duration: 0.3 }
                      }}
                      className="px-5 pb-5 overflow-hidden"
                    >
                      {/* Science Facts Carousel */}
                      <div className="space-y-4">
                        {/* Fact 1: The 2-Minute Rule */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-400/20 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Clock className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-green-300 font-medium text-sm mb-1">⚡ The 2-Minute Rule</h4>
                              <p className="text-gray-300 text-xs leading-relaxed">
                                Start with just 2 minutes. Your brain forms neural pathways faster when the barrier to entry is ultra-low. "Read for 2 minutes" becomes "Read for 20 minutes" naturally.
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Fact 2: Dopamine & Rewards */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-r from-purple-500/10 to-pink-500/5 border border-purple-400/20 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Zap className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-purple-300 font-medium text-sm mb-1">🧠 Dopamine Cycles</h4>
                              <p className="text-gray-300 text-xs leading-relaxed">
                                Your brain releases dopamine BEFORE completing a habit, not after. This anticipation is what creates the craving. Celebrate small wins to reinforce the cycle.
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Fact 3: Identity Formation */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-r from-orange-500/10 to-yellow-500/5 border border-orange-400/20 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Target className="w-4 h-4 text-orange-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-orange-300 font-medium text-sm mb-1">🎯 Identity-Based Change</h4>
                              <p className="text-gray-300 text-xs leading-relaxed">
                                Don't focus on outcomes. Focus on identity: "I am someone who reads daily" creates stronger neural pathways than "I want to read more books."
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Quick Tip */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 p-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-300 text-xs font-medium">Today's Insight</span>
                        </div>
                        <p className="text-gray-300 text-xs leading-relaxed">
                          <span className="text-blue-300 font-medium">Pro Tip:</span> Stack your habits! Attach new habits to existing ones. "After I pour my coffee, I will meditate for 2 minutes." Your brain loves predictable sequences.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Effects and Modals */}
      <ConfettiEffect 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)}
        triggerElement={clickedTaskRef}
        intensity="low"
      />

      <ConfettiEffect 
        isActive={showBigConfetti} 
        onComplete={() => setShowBigConfetti(false)}
        intensity="high"
      />

      {/* Enhanced XP Bubbles */}
      <AnimatePresence>
        {xpBubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            initial={{ 
              opacity: 0, 
              scale: 0.3,
              y: 0
            }}
            animate={{ 
              y: -80, 
              opacity: [0, 1, 1, 0], 
              scale: [0.3, 1.2, 1.1, 0.8]
            }}
            exit={{
              opacity: 0,
              scale: 0.5
            }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              times: [0, 0.2, 0.8, 1]
            }}
            className="fixed pointer-events-none"
            style={{
              left: bubble.x - 40,
              top: bubble.y - 10,
              zIndex: 9999
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-lg opacity-40 scale-150"></div>
              
              {/* Main XP bubble */}
              <div className="relative bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1.5 rounded-full font-bold shadow-2xl border-2 border-yellow-200 flex items-center gap-1.5">
                <span className="text-sm">⚡</span>
                <span className="text-sm font-bold">+{bubble.value} XP</span>
              </div>
              
              {/* Sparkle particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, (i - 1) * 15],
                    y: [0, -10 - i * 8]
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.15 + i * 0.08,
                    ease: "easeOut"
                  }}
                  className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-yellow-200 rounded-full"
                  style={{ transform: 'translateX(-50%)' }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Epic Victory Celebration Toasts */}
      <AnimatePresence>
        {ribbonToasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ 
              opacity: 0, 
              y: -100,
              scale: 0.3,
              rotateX: -90
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1,
              rotateX: 0
            }}
            exit={{ 
              opacity: 0, 
              y: -50,
              scale: 0.8,
              rotateX: 90
            }}
            transition={{ 
              duration: 0.8, 
              ease: "backOut",
              type: "spring",
              damping: 15
            }}
            className="fixed top-16 left-1/2 transform -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 99999 }}
          >
            {/* Epic Container with Multiple Layers */}
            <div className="relative">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 scale-150 opacity-30">
                <div className="w-full h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-2xl blur-xl"></div>
              </div>
              
              {/* Secondary Glow */}
              <div className="absolute inset-0 scale-125 opacity-50">
                <div className="w-full h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl blur-lg"></div>
              </div>
              
              {/* Main Victory Banner */}
              <div className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black px-8 py-4 rounded-2xl shadow-2xl border-2 border-yellow-200 overflow-hidden">
                {/* Inner shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60"></div>
                
                {/* Animated shine sweep */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ transform: 'skewX(-15deg)' }}
                />
                
                <div className="relative z-10 text-center">
                  {/* Victory Message */}
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 1] }}
                    transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                    className="flex items-center justify-center gap-2 mb-1"
                  >
                    <span className="text-2xl">🏆</span>
                    <span className="font-black text-xl tracking-wide">{toast.message}!</span>
                    <span className="text-2xl">🏆</span>
                  </motion.div>
                  
                  {/* XP Reward with Lightning */}
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">⚡</span>
                    <span className="font-bold text-lg">+{toast.xp} XP BONUS</span>
                    <span className="text-lg">⚡</span>
                  </motion.div>
                  
                  {/* Epic Subtitle */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="text-amber-800 font-semibold text-sm mt-1 tracking-wider"
                  >
                    LEGENDARY STREAK!
                  </motion.div>
                </div>
                
                {/* Corner Decorations */}
                <div className="absolute top-1 left-1 w-3 h-3 bg-yellow-200 rounded-full"></div>
                <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-200 rounded-full"></div>
                <div className="absolute bottom-1 left-1 w-3 h-3 bg-yellow-200 rounded-full"></div>
                <div className="absolute bottom-1 right-1 w-3 h-3 bg-yellow-200 rounded-full"></div>
              </div>
              
              {/* Floating Victory Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [-10, -40 - i * 15],
                    x: [(i - 2.5) * 20, (i - 2.5) * 30]
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: 0.6 + i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute top-0 left-1/2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                  style={{ transform: 'translateX(-50%)' }}
                />
              ))}
              
              {/* Victory Stars */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: 0.8 + i * 0.2,
                    ease: "easeOut"
                  }}
                  className="absolute w-4 h-4 text-yellow-300"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: i % 2 === 0 ? '-20px' : 'calc(100% + 20px)'
                  }}
                >
                  ⭐
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <ChatModal 
        isOpen={chatModalOpen} 
        onClose={() => setChatModalOpen(false)}
        usedSlots={usedSlots}
        availableSlots={availableSlots}
        loginStreak={loginStreak}
        onHabitAccepted={handleAIHabitAccepted}
      />

      <AddHabitModal
        isOpen={showAddHabitModal}
        onClose={() => setShowAddHabitModal(false)}
        onSave={handleAddHabit}
        availableSlots={availableSlots}
        usedSlots={usedSlots}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirmation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={cancelDelete}
            />
            
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-400" />
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-2">Delete Habit?</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {habitToDelete && habitToDelete.type === 'custom' && 
                      `This will permanently delete "${customHabits[habitToDelete.index]?.name}" and all its progress. This action cannot be undone.`
                    }
                    {habitToDelete && habitToDelete.type === 'default' && 
                      `This will permanently delete "${['📚 Reading & Mindfulness', '💪 Gym & Fitness'][habitToDelete.index]}" and all its progress. This action cannot be undone.`
                    }
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={cancelDelete}
                      className="w-24 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors text-center"
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmDeleteHabit}
                      className="w-24 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors text-center"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}