import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Star, Zap, Users, Crown, Send, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FeedbackSectionProps {
  isInitialLoad?: boolean;
}

interface FeedbackOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  xpReward: number;
  color: string;
}

export function FeedbackSection({ isInitialLoad = true }: FeedbackSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [completedFeedbackTypes, setCompletedFeedbackTypes] = useState(() => {
    // Check which feedback types have already been completed
    const completed = localStorage.getItem('completed-feedback-types');
    return completed ? JSON.parse(completed) : [];
  });

  const feedbackOptions: FeedbackOption[] = [
    {
      id: 'feature',
      title: 'Feature Ideas',
      description: 'Suggest new features or improvements',
      icon: Star,
      xpReward: 50,
      color: 'from-yellow-600 to-orange-600'
    },
    {
      id: 'bug',
      title: 'Bug Reports',
      description: 'Help us fix issues you\'ve found',
      icon: Zap,
      xpReward: 25,
      color: 'from-red-600 to-pink-600'
    },
    {
      id: 'general',
      title: 'General Feedback',
      description: 'Share your thoughts and experiences',
      icon: MessageSquare,
      xpReward: 25,
      color: 'from-blue-600 to-purple-600'
    }
  ];

  const handleSubmitFeedback = () => {
    const selectedOption = feedbackOptions.find(opt => opt.id === selectedFeedback);
    if (selectedOption && feedbackText.trim()) {
      // Only set XP if this feedback type hasn't been completed before
      const hasCompletedThisType = completedFeedbackTypes.includes(selectedFeedback);
      
      if (!hasCompletedThisType) {
        setEarnedXP(selectedOption.xpReward);
        const newCompletedTypes = [...completedFeedbackTypes, selectedFeedback];
        setCompletedFeedbackTypes(newCompletedTypes);
        localStorage.setItem('completed-feedback-types', JSON.stringify(newCompletedTypes));
      } else {
        setEarnedXP(0); // No XP for repeat submissions of same type
      }
      
      setShowThankYou(true);
      
      // Reset form after showing thank you
      setTimeout(() => {
        setSelectedFeedback(null);
        setFeedbackText('');
        setShowThankYou(false);
        setIsExpanded(false);
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isInitialLoad ? 3.2 : 0.6, duration: isInitialLoad ? 0.6 : 0.3 }}
      className="mb-6"
    >
      {/* Feedback Button */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-2 border-purple-500/50 rounded-xl p-4 mb-4 transition-all duration-300 hover:bg-purple-500/10"
      >
        <div className="flex items-center justify-center gap-3">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 font-medium">💡 Help Us Build Together</span>
          {completedFeedbackTypes.length < 3 && (
            <div className="flex items-center gap-1 bg-green-600/20 border border-green-500/30 rounded-full px-2 py-1">
              <Zap className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs font-medium">+XP</span>
            </div>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Feedback Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <AnimatePresence mode="wait">
                {showThankYou ? (
                  // Thank You Screen
                  <motion.div
                    key="thankyou"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ 
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Crown className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-white text-xl font-bold mb-2">Thank You! 🎉</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {earnedXP > 0 
                        ? "Your feedback helps us build better features for everyone!"
                        : "Your continued feedback helps us improve your experience!"
                      }
                    </p>
                    
                    {earnedXP > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2"
                      >
                        <Zap className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-bold">+{earnedXP} XP Earned!</span>
                      </motion.div>
                    )}
                    
                    {earnedXP === 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2"
                      >
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400 font-bold">Feedback Received!</span>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  // Feedback Form
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-white text-lg font-bold mb-2">Share Your Ideas</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      {completedFeedbackTypes.length < 3
                        ? "Help us improve your experience and earn XP! 🌟"
                        : "We value your continued feedback! Since you've invested in this app, we want to make sure you have the best possible experience. 🌟"
                      }
                    </p>

                    {/* Feedback Type Selection */}
                    <div className="grid gap-3 mb-6">
                      {feedbackOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedFeedback(option.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              selectedFeedback === option.id
                                ? 'bg-purple-600/20 border-purple-500'
                                : 'bg-gray-800/30 border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 text-left">
                                <h4 className="text-white font-medium text-sm">{option.title}</h4>
                                <p className="text-gray-400 text-xs">{option.description}</p>
                              </div>
                              {!completedFeedbackTypes.includes(option.id) && (
                                <div className="flex items-center gap-1 bg-green-600/20 border border-green-500/30 rounded-full px-2 py-1">
                                  <Zap className="w-3 h-3 text-green-400" />
                                  <span className="text-green-400 text-xs font-medium">+{option.xpReward}</span>
                                </div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Text Input */}
                    {selectedFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Share your thoughts... (Be specific for higher chances of being featured!)"
                          className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 transition-colors"
                          rows={4}
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-500 text-xs">{feedbackText.length}/500</span>
                          <span className="text-purple-400 text-xs">
                            💡 Your input shapes your experience!
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    {selectedFeedback && feedbackText.trim() && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmitFeedback}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                      >
                        <Send className="w-4 h-4" />
                        <span className="font-medium">Submit Feedback</span>
                        {!completedFeedbackTypes.includes(selectedFeedback!) && (
                          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                            <Zap className="w-3 h-3" />
                            <span className="text-xs">+{feedbackOptions.find(opt => opt.id === selectedFeedback)?.xpReward}</span>
                          </div>
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}