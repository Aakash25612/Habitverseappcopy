import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Zap, Target, MessageCircle, Brain, Calendar, CheckCircle, XCircle, Timer, Flame, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ChallengeDetailsPageProps {
  onBack: () => void;
  challenge: {
    id: number;
    title: string;
    xpWager: number;
    participant1: {
      name: string;
      level: number;
      streak: number;
      avatar: string;
      progress: boolean[];
      completionTimes?: string[];
    };
    participant2: {
      name: string;
      level: number;
      streak: number;
      avatar: string;
      progress: boolean[];
      completionTimes?: string[];
    };
    currentDay: number;
    totalDays: number;
    status: 'active' | 'pending' | 'completed';
    tasks: string[];
    challengeCard?: {
      id: string;
      type: string;
      title: string;
      rule: string;
      bonusXP: number;
      deadline: Date;
      isAccepted?: boolean;
      isCompleted?: boolean;
      isExpired?: boolean;
    };
  };
}

export function ChallengeDetailsPage({ onBack, challenge }: ChallengeDetailsPageProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('details');
  const [todayTaskCompleted, setTodayTaskCompleted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 minutes

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      const timer = setTimeout(() => setTimerSeconds(timerSeconds - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      // Timer completed logic
    }
  }, [timerActive, timerSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatChallengeCardCountdown = (deadline: Date) => {
    const now = currentTime.getTime();
    const deadlineTime = deadline.getTime();
    const diff = deadlineTime - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTodayDueTime = () => {
    const today = new Date();
    today.setHours(23, 59, 59); // Default to end of day
    return today;
  };

  const getTimeUntilDue = () => {
    const dueTime = getTodayDueTime();
    const now = currentTime.getTime();
    const diff = dueTime.getTime() - now;
    
    if (diff <= 0) return 'Overdue';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusPill = (isCompleted: boolean, completionTime?: string, isMissed: boolean = false) => {
    if (isMissed) {
      return (
        <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Missed
        </div>
      );
    }
    
    if (isCompleted) {
      return (
        <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {completionTime || 'Completed'}
        </div>
      );
    }
    
    return (
      <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Pending
      </div>
    );
  };

  const getDayChip = (day: number, isToday: boolean) => {
    return (
      <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
        isToday 
          ? 'bg-purple-600 text-white ring-2 ring-purple-400' 
          : 'bg-gray-700 text-gray-300'
      }`}>
        Day {day}
      </div>
    );
  };

  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + (challenge.totalDays - challenge.currentDay));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </motion.button>
            <h1 className="text-white font-bold text-lg">
              1-on-1 vs {challenge.participant2.name}
            </h1>
          </div>

          {/* Header Chips */}
          <div className="flex flex-wrap gap-2 mb-2">
            {getDayChip(challenge.currentDay, true)}
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {challenge.xpWager} XP in Escrow
            </div>
            <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">
              Timezone: {currentTimeZone.split('/')[1]}
            </div>
          </div>

          {/* Subtext */}
          <p className="text-gray-400 text-xs">
            Ends {endDate.toLocaleDateString()} • Local time {currentTimeZone.split('/')[1]}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 pb-24">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1 rounded-xl">
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 rounded-lg text-sm"
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 rounded-lg text-sm"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="ai-tips" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 rounded-lg text-sm"
            >
              AI Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Today Section - Sticky Mini Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-[140px] z-30 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 0 1px rgba(122, 60, 255, 0.2), 0 0 16px rgba(176, 124, 255, 0.15)'
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium text-sm">Today's Challenge</span>
              </div>

              <h3 className="text-white font-bold mb-2">{challenge.tasks[0]}</h3>
              
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-300">
                  Due by: <span className="text-white font-tabular">11:59 PM</span>
                </div>
                <div className="bg-gray-800/50 px-2 py-1 rounded text-yellow-400 font-bold font-tabular text-sm">
                  {getTimeUntilDue()}
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">You:</span>
                  {getStatusPill(todayTaskCompleted, todayTaskCompleted ? '8:41 PM' : undefined)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{challenge.participant2.name}:</span>
                  {getStatusPill(challenge.participant2.progress[challenge.currentDay - 1], '7:23 PM')}
                </div>
              </div>

              {/* Challenge Card Boost */}
              {challenge.challengeCard && challenge.challengeCard.isAccepted && (
                <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-sm font-medium">
                      {challenge.challengeCard.rule} • +{challenge.challengeCard.bonusXP} XP
                    </span>
                    <div className="bg-yellow-500/20 px-2 py-1 rounded text-yellow-400 font-bold font-tabular text-xs">
                      {formatChallengeCardCountdown(challenge.challengeCard.deadline)}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setTodayTaskCompleted(!todayTaskCompleted)}
                  disabled={todayTaskCompleted}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 text-sm"
                >
                  {todayTaskCompleted ? 'Completed ✓' : 'Mark Complete'}
                </Button>
                <Button
                  onClick={() => {
                    setTimerActive(!timerActive);
                    if (!timerActive) setTimerSeconds(25 * 60);
                  }}
                  variant="outline"
                  className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500/10 text-sm"
                >
                  <Play className="w-3 h-3 mr-1" />
                  {timerActive ? formatTime(timerSeconds) : 'Start 25:00 Sprint'}
                </Button>
              </div>
            </motion.div>

            {/* 7-Day Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#181B22] border border-gray-700 rounded-xl p-6"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.12)' }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-white font-bold text-lg">7-Day Timeline</h2>
              </div>

              <div className="space-y-4">
                {Array.from({ length: challenge.totalDays }, (_, i) => {
                  const dayNum = i + 1;
                  const isToday = dayNum === challenge.currentDay;
                  const isPast = dayNum < challenge.currentDay;
                  const yourCompleted = challenge.participant1.progress[i];
                  const opponentCompleted = challenge.participant2.progress[i];
                  
                  return (
                    <motion.div
                      key={dayNum}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`border rounded-lg p-4 transition-all cursor-pointer hover:border-gray-600 ${
                        isToday 
                          ? 'border-purple-500 bg-purple-500/5' 
                          : 'border-gray-700 bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getDayChip(dayNum, isToday)}
                          <div>
                            <h4 className="text-white font-medium text-sm">{challenge.tasks[0]}</h4>
                            <p className="text-gray-400 text-xs">Due 11:59 PM</p>
                          </div>
                        </div>
                        {isToday && (
                          <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                            Active
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-8">You:</span>
                          {getStatusPill(yourCompleted, challenge.participant1.completionTimes?.[i] || undefined, isPast && !yourCompleted)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-12">{challenge.participant2.name}:</span>
                          {getStatusPill(opponentCompleted, challenge.participant2.completionTimes?.[i] || undefined, isPast && !opponentCompleted)}
                        </div>
                      </div>

                      {/* Cumulative Speed Tiebreaker */}
                      {(yourCompleted || opponentCompleted) && (
                        <div className="mt-2 pt-2 border-t border-gray-700">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>You: {yourCompleted ? challenge.participant1.completionTimes?.[i] : '-'}</span>
                            <span>{challenge.participant2.name}: {opponentCompleted ? challenge.participant2.completionTimes?.[i] : '-'}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <div className="bg-[#181B22] border border-gray-700 rounded-xl p-6 text-center">
              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Challenge Chat</h3>
              <p className="text-gray-400 text-sm mb-4">
                Communicate with {challenge.participant2.name} during your challenge
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Start Conversation
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ai-tips" className="mt-6">
            <div className="bg-[#181B22] border border-gray-700 rounded-xl p-6 text-center">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">AI Strategy Tips</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get personalized advice to win your challenge
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Tips
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}