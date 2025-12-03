import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { X, User, RefreshCw, Edit3, CheckCircle, Bot } from 'lucide-react';
import { HabitLockInModal } from './HabitLockInModal';
import { HabitJourneyStartModal } from './HabitJourneyStartModal';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface HabitSuggestion {
  title: string;
  description: string;
  tasks: string[];
  xpPerTask: number;
  totalXP: number;
  visible: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  usedSlots?: number;
  availableSlots?: number;
  onHabitAccepted?: (habit: HabitSuggestion) => void;
}

export function ChatModal({ isOpen, onClose, usedSlots = 0, availableSlots = 2, onHabitAccepted }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now() + Math.random(),
      type: 'ai',
      content: "Hey! 👋 I'm here to help you design the perfect daily habit. What area of your life would you like to focus on improving?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [habitSuggestion, setHabitSuggestion] = useState<HabitSuggestion | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [showLockInModal, setShowLockInModal] = useState(false);
  const [showJourneyStartModal, setShowJourneyStartModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, habitSuggestion]);

  // Reset chat when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: Date.now() + Math.random(),
          type: 'ai',
          content: "Hey! 👋 I'm here to help you design the perfect daily habit. What area of your life would you like to focus on improving?",
          timestamp: new Date()
        }
      ]);
      setInputValue('');
      setHabitSuggestion(null);
      setIsTyping(false);
      setConversationStep(0);
      setUserResponses([]);
      setShowLockInModal(false);
      setShowJourneyStartModal(false);
    }
  }, [isOpen]);

  const getQuickPrompts = () => {
    switch (conversationStep) {
      case 0:
        return ["Health & Fitness", "Productivity", "Learning & Skills", "Mental Wellbeing"];
      case 1:
        return ["Complete beginner", "Some experience", "Pretty consistent", "Advanced level"];
      case 2:
        return ["5-10 minutes daily", "15-30 minutes daily", "30-60 minutes daily", "1+ hours daily"];
      default:
        return ["Start new habit", "Get another suggestion", "Modify this idea", "I'm ready!"];
    }
  };

  const handleAIResponse = (userInput: string) => {
    const newUserResponses = [...userResponses, userInput];
    setUserResponses(newUserResponses);

    // Add user message
    const userMessage: Message = {
      id: Date.now() + Math.random(), // Make ID unique
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Generate AI response based on conversation step
    setTimeout(() => {
      let aiResponse: Message;
      const nextStep = conversationStep + 1;
      const uniqueId = Date.now() + Math.random();

      switch (conversationStep) {
        case 0: // Area selection
          aiResponse = {
            id: uniqueId,
            type: 'ai',
            content: `Awesome! ${userInput} is such an important area to focus on. What's your current experience level with building habits in this area?`,
            timestamp: new Date()
          };
          break;
        
        case 1: // Experience level
          aiResponse = {
            id: uniqueId,
            type: 'ai',
            content: `Got it! As someone with ${userInput.toLowerCase()} experience, I can tailor this perfectly for you. How much time can you realistically commit each day?`,
            timestamp: new Date()
          };
          break;
        
        case 2: // Time commitment - Final step
          const suggestion = generatePersonalizedHabit(newUserResponses);
          setHabitSuggestion(suggestion);
          aiResponse = {
            id: uniqueId,
            type: 'ai',
            content: `Perfect! ${userInput} is a great time commitment. Based on everything you've told me, I've designed a personalized habit that's perfect for you:`,
            timestamp: new Date()
          };
          break;
        
        default:
          aiResponse = {
            id: uniqueId,
            type: 'ai',
            content: "Let's start fresh! What area would you like to focus on improving?",
            timestamp: new Date()
          };
          setConversationStep(0);
          setUserResponses([]);
          setHabitSuggestion(null);
          break;
      }

      setMessages(prev => [...prev, aiResponse]);
      setConversationStep(nextStep);
      setIsTyping(false);
    }, 1500);
  };

  const generatePersonalizedHabit = (responses: string[]): HabitSuggestion => {
    const [area, experience, timeCommitment] = responses;
    
    const isHealthFitness = area.toLowerCase().includes('health') || area.toLowerCase().includes('fitness');
    const isProductivity = area.toLowerCase().includes('productivity');
    const isLearning = area.toLowerCase().includes('learning') || area.toLowerCase().includes('skills');
    const isMentalWellbeing = area.toLowerCase().includes('mental') || area.toLowerCase().includes('wellbeing');
    
    const isBeginner = experience.toLowerCase().includes('beginner');
    const isAdvanced = experience.toLowerCase().includes('advanced');
    
    const isShortTime = timeCommitment.includes('5-10') || timeCommitment.includes('15-30');
    const isLongTime = timeCommitment.includes('1+');

    if (isHealthFitness && isBeginner && isShortTime) {
      return {
        title: "Gentle Fitness Foundation",
        description: "Perfect for beginners! This habit builds a sustainable fitness routine without overwhelming you.",
        tasks: [
          "5-minute morning stretch",
          "Drink a glass of water",
          "Take a 10-minute walk"
        ],
        xpPerTask: 10,
        totalXP: 80,
        visible: true
      };
    } else if (isHealthFitness && isAdvanced) {
      return {
        title: "Peak Performance Protocol",
        description: "Advanced habit designed to push your limits and optimize your physical performance.",
        tasks: [
          "30-minute intense workout",
          "Track macros and nutrition",
          "10-minute recovery/mobility work"
        ],
        xpPerTask: 10,
        totalXP: 80,
        visible: true
      };
    } else if (isProductivity && isShortTime) {
      return {
        title: "Productivity Power-Up",
        description: "Maximize your output with this focused productivity habit that fits into any schedule.",
        tasks: [
          "Set 3 daily priorities",
          "Complete 1 deep work session (25 min)",
          "Clear inbox and workspace"
        ],
        xpPerTask: 10,
        totalXP: 80,
        visible: true
      };
    } else if (isLearning) {
      return {
        title: "Learning Accelerator",
        description: "Build consistent learning habits that compound over time for massive growth.",
        tasks: [
          "Study chosen topic for 20 minutes",
          "Practice what you learned",
          "Write down key insights"
        ],
        xpPerTask: 10,
        totalXP: 80,
        visible: true
      };
    } else if (isMentalWellbeing) {
      return {
        title: "Mental Clarity Routine",
        description: "Build emotional resilience and mental clarity with this science-backed wellness habit.",
        tasks: [
          "10-minute meditation or breathing",
          "Write 3 things you're grateful for",
          "Take 5 minutes for self-reflection"
        ],
        xpPerTask: 10,
        totalXP: 80,
        visible: true
      };
    } else if (isHealthFitness && isLongTime) {
      return {
        title: "Fitness Powerhouse",
        description: "Comprehensive fitness habit for those ready to commit serious time to their health.",
        tasks: [
          "45-minute workout session",
          "Plan and prep healthy meals",
          "Track progress and metrics"
        ],
        xpPerTask: 10,
        totalXP: 80,
        visible: true
      };
    } else if (isProductivity && isLongTime) {
      return {
        title: "Deep Work Mastery",
        description: "Extended productivity sessions for maximum focus and output.",
        tasks: [
          "2-hour deep work block",
          "Review and plan next day",
          "Optimize workspace and systems"
        ],
        xpPerTask: 10,
        totalXP: 80,
        visible: true
      };
    } else {
      return {
        title: "Personalized Growth Habit",
        description: `A custom ${area.toLowerCase()} habit designed for your ${experience.toLowerCase()} level and ${timeCommitment} commitment.`,
        tasks: [
          "Focused practice session",
          "Track and measure progress",
          "Reflect and plan improvements"
        ],
        xpPerTask: 10,
        totalXP: 80,
        visible: true
      };
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleAIResponse(prompt);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    handleAIResponse(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleAcceptHabit = () => {
    if (!habitSuggestion) return;
    
    // Check if user has available slots
    if (usedSlots >= availableSlots) {
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now() + Math.random(),
        type: 'ai',
        content: `I'd love to help you add this habit, but you're currently using all ${availableSlots} of your habit slots! 🚫\n\nTo unlock more slots:\n• Complete a 3-day streak of ALL habits = 3rd slot unlocked\n• Complete a 7-day streak of ALL habits = 4th slot unlocked\n\nConsistency is key! Focus on mastering your current habits first. 💪`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    // Show lock-in warning modal
    setShowLockInModal(true);
  };

  const handleConfirmLockIn = () => {
    if (!habitSuggestion) return;
    
    // Close lock-in modal and show journey start modal
    setShowLockInModal(false);
    setShowJourneyStartModal(true);
  };

  const handleStartJourney = () => {
    if (!habitSuggestion) return;
    
    // Close all modals and accept the habit
    setShowJourneyStartModal(false);
    onClose();
    
    // Call the callback to add habit to the main page
    onHabitAccepted?.(habitSuggestion);
  };

  const handleEditHabit = () => {
    setHabitSuggestion(null);
    setInputValue('');
    setConversationStep(0);
    setUserResponses([]);
    setShowLockInModal(false);
    setShowJourneyStartModal(false);
    const editMessage: Message = {
      id: Date.now() + Math.random(),
      type: 'ai',
      content: "Let's design something even better! What area would you like to focus on this time?",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, editMessage]);
  };

  const handleAskAgain = () => {
    setHabitSuggestion(null);
    setConversationStep(0);
    setUserResponses([]);
    setShowLockInModal(false);
    setShowJourneyStartModal(false);
    const againMessage: Message = {
      id: Date.now() + Math.random(),
      type: 'ai',
      content: "Absolutely! Let's create another habit. What different area of your life would you like to improve?",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, againMessage]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.9, 
                y: 20,
                filter: 'blur(10px)'
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                filter: 'blur(0px)'
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.9, 
                y: 20,
                filter: 'blur(10px)'
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md h-[80vh] flex flex-col relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center"
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-white font-semibold">AI Habit Coach</h1>
                    <p className="text-gray-400 text-sm">Let's create the perfect habit</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-purple-600' 
                          : 'bg-gray-700'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message bubble */}
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 border border-gray-700 text-gray-200'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: 0
                            }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: 0.2
                            }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: 0.4
                            }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Habit Suggestion */}
                {habitSuggestion && habitSuggestion.visible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-2xl p-6 space-y-4"
                  >
                    <div className="text-center">
                      <h3 className="text-white font-bold text-lg mb-2">{habitSuggestion.title}</h3>
                      <p className="text-purple-200 text-sm">{habitSuggestion.description}</p>
                    </div>

                    {/* XP Display */}
                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-yellow-400 text-lg">⚡</span>
                        <span className="text-white font-bold text-lg">{habitSuggestion.totalXP} XP</span>
                        <span className="text-yellow-400 text-lg">⚡</span>
                      </div>
                      <p className="text-yellow-200 text-xs">
                        {habitSuggestion.xpPerTask} XP per task + 50 XP completion bonus
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-white font-medium">Daily Tasks:</p>
                      <div className="space-y-2">
                        {habitSuggestion.tasks.map((task, index) => (
                          <div key={index} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-200 text-sm">{task}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-yellow-400 text-xs">⚡</span>
                                <span className="text-yellow-300 text-xs font-medium">{habitSuggestion.xpPerTask} XP</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAcceptHabit}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Accept & Start
                      </motion.button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleEditHabit}
                          className="bg-gray-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-gray-600 hover:bg-gray-600 transition-all duration-300"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAskAgain}
                          className="bg-gray-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-gray-600 hover:bg-gray-600 transition-all duration-300"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Ask Again
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              {!habitSuggestion && (
                <div className="p-6 border-t border-gray-700/50 flex-shrink-0">
                  {/* Quick Prompts */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getQuickPrompts().map((prompt, index) => (
                      <motion.button
                        key={`${prompt}-${index}-${conversationStep}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-full hover:bg-gray-700 transition-colors text-sm"
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Input field */}
                  <div className="flex gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Or type your own response..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                    >
                      Send
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Floating background elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.sin(0) * 15, 0],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: 0,
                    ease: "easeInOut"
                  }}
                  className="absolute w-2 h-2 bg-purple-500/20 rounded-full blur-sm"
                  style={{
                    left: '20%',
                    top: '30%',
                  }}
                />
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.sin(1) * 15, 0],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute w-2 h-2 bg-purple-500/20 rounded-full blur-sm"
                  style={{
                    left: '45%',
                    top: '50%',
                  }}
                />
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.sin(2) * 15, 0],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    delay: 4,
                    ease: "easeInOut"
                  }}
                  className="absolute w-2 h-2 bg-purple-500/20 rounded-full blur-sm"
                  style={{
                    left: '70%',
                    top: '70%',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
      
      {/* Habit Lock-In Warning Modal */}
      <HabitLockInModal
        isOpen={showLockInModal}
        onClose={() => setShowLockInModal(false)}
        onConfirm={handleConfirmLockIn}
        habitName={habitSuggestion?.title || ''}
      />

      {/* Habit Journey Start Celebration Modal */}
      <HabitJourneyStartModal
        isOpen={showJourneyStartModal}
        onClose={() => setShowJourneyStartModal(false)}
        onStartJourney={handleStartJourney}
        habitName={habitSuggestion?.title || ''}
      />
    </AnimatePresence>
  );
}