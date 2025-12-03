import { motion } from 'motion/react';
import { Zap, Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';

interface BeastModeCardProps {
  isInitialLoad?: boolean;
}

type TimerState = 'idle' | 'active' | 'paused' | 'completed';

const motivationalQuotes = [
  "You've got this! Every second counts towards your greatness.",
  "Focus is your superpower. Channel it and watch magic happen.",
  "Champions are made in moments like this. Stay strong.",
  "Your future self is counting on this moment of focus.",
  "Discipline is the bridge between goals and accomplishment.",
  "The pain of discipline weighs ounces, but regret weighs tons.",
  "You're building the habit of excellence right now.",
  "Every moment of focus is an investment in your dreams.",
  "Success is built one focused minute at a time.",
  "You're proving to yourself what you're capable of.",
  "This is where legends are forged. Keep going.",
  "Your focus today shapes your tomorrow.",
  "Concentration is the secret of strength.",
  "You're not just focusing - you're evolving.",
  "The world needs your focused energy right now."
];

export function BeastModeCard({ isInitialLoad = true }: BeastModeCardProps) {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [currentQuote, setCurrentQuote] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Get random quote
  const getRandomQuote = useCallback(() => {
    const availableQuotes = motivationalQuotes.filter((_, index) => index !== quoteIndex);
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const selectedQuote = availableQuotes[randomIndex];
    setQuoteIndex(motivationalQuotes.indexOf(selectedQuote));
    return selectedQuote;
  }, [quoteIndex]);

  // Start timer
  const startTimer = () => {
    setTimerState('active');
    setCurrentQuote(getRandomQuote());
    
    // Show start toast
    toast.success("🔥 Laser Focus activated! You've got this!", {
      duration: 3000,
    });
  };

  // Pause timer
  const pauseTimer = () => {
    setTimerState('paused');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Resume timer
  const resumeTimer = () => {
    setTimerState('active');
  };

  // Reset timer
  const resetTimer = () => {
    setTimerState('idle');
    setTimeRemaining(25 * 60);
    setCurrentQuote('');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Complete timer
  const completeTimer = () => {
    setTimerState('completed');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Show completion celebration
    toast.success("🏆 Laser Focus completed! +100 XP earned!", {
      duration: 5000,
    });
  };

  // Timer countdown effect
  useEffect(() => {
    if (timerState === 'active') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Change quote every 2 minutes
      const quoteInterval = setInterval(() => {
        if (timerState === 'active') {
          setCurrentQuote(getRandomQuote());
        }
      }, 120000); // 2 minutes

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        clearInterval(quoteInterval);
      };
    }
  }, [timerState, getRandomQuote]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = ((25 * 60 - timeRemaining) / (25 * 60)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isInitialLoad ? 0.7 : 0.2, duration: isInitialLoad ? 0.6 : 0.3 }}
      className="mb-6"
    >
      <motion.div
        ref={buttonRef}
        layout
        whileHover={timerState === 'idle' ? { scale: 1.01 } : {}}
        whileTap={timerState === 'idle' ? { 
          scale: 0.98,
          transition: { duration: 0.06 }
        } : {}}
        className="relative p-6 rounded-2xl transition-all duration-300"
        style={{
          border: timerState === 'active' 
            ? '1px solid rgba(168, 119, 255, 0.6)' 
            : timerState === 'completed'
            ? '1px solid rgba(34, 197, 94, 0.6)'
            : '1px solid rgba(168, 119, 255, 0.3)',
          boxShadow: timerState === 'active' 
            ? '0 8px 32px rgba(168, 119, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
            : timerState === 'completed'
            ? '0 8px 32px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          background: timerState === 'active' 
            ? 'linear-gradient(135deg, rgba(168, 119, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' 
            : timerState === 'completed'
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)'
            : 'rgba(17, 24, 39, 0.4)'
        }}
      >
        {/* Idle State */}
        {timerState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={startTimer}
            className="flex flex-col items-center text-center cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mb-4"
            >
              <Zap 
                className="w-12 h-12"
                style={{
                  color: '#A877FF',
                  filter: 'drop-shadow(0 0 8px rgba(168, 119, 255, 0.6))'
                }}
              />
            </motion.div>
            
            <h3 className="text-white mb-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
              ⚡ Laser Focus
            </h3>
            
            <p className="text-gray-400" style={{ fontSize: '14px', fontWeight: '500' }}>
              Tap to start 25-minute focus session
            </p>
          </motion.div>
        )}

        {/* Active/Paused Timer State */}
        {(timerState === 'active' || timerState === 'paused') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            {/* Timer Display */}
            <motion.div
              animate={timerState === 'active' ? {
                scale: [1, 1.02, 1],
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4"
            >
              <div 
                className="text-6xl font-mono text-white mb-2"
                style={{ 
                  textShadow: '0 0 20px rgba(168, 119, 255, 0.6)',
                  fontWeight: 'bold'
                }}
              >
                {formatTime(timeRemaining)}
              </div>
              
              {/* Progress Bar */}
              <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Motivational Quote */}
            {currentQuote && (
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 px-4"
              >
                <p 
                  className="text-purple-200 italic text-center"
                  style={{ fontSize: '15px', lineHeight: '1.4' }}
                >
                  "{currentQuote}"
                </p>
              </motion.div>
            )}

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              {timerState === 'active' ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={pauseTimer}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-orange-700 transition-all duration-200"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resumeTimer}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-green-700 transition-all duration-200"
                >
                  <Play className="w-4 h-4" />
                  Resume
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-red-700 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </motion.button>
            </div>

            {timerState === 'paused' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-orange-300 mt-3"
                style={{ fontSize: '14px' }}
              >
                Session paused - take your time!
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Completed State */}
        {timerState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4"
            >
              <Trophy 
                className="w-16 h-16"
                style={{
                  color: '#22C55E',
                  filter: 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.8))'
                }}
              />
            </motion.div>

            <motion.h3 
              className="text-green-400 mb-2"
              style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                textShadow: '0 0 15px rgba(34, 197, 94, 0.6)'
              }}
            >
              🏆 Focus Mastered!
            </motion.h3>

            <p className="text-green-300 mb-4" style={{ fontSize: '15px' }}>
              25 minutes of pure focus completed!
            </p>

            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
              <p className="text-green-200" style={{ fontSize: '14px', fontWeight: '500' }}>
                ⚡ +100 XP earned for completing your focus session!
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetTimer}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              Start Another Session
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}