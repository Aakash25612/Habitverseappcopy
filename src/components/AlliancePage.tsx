import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Users, Crown, ChevronDown, Trophy, Flame, Target, Plus, MessageCircle, Zap, ArrowRight, X, Check, Coins, Send, Star, TrendingUp, Share2, Copy, Search, Timer, Shield, Award, Globe, UserPlus, Hash, Eye, EyeOff, Bot, Calendar, Clock, Swords, Medal, Edit3, LogOut, AlertTriangle, Settings, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ConfettiEffect } from './ConfettiEffect';
import { CreateAllianceModal, AllianceData } from './CreateAllianceModal';
import { CreateAllianceModal, AllianceData } from './CreateAllianceModal';

interface Member {
  id: number;
  name: string;
  level: number;
  streak: number;
  xp: number;
  isYou?: boolean;
  avatar: string;
  completionGrid: boolean[];
  habits: Array<{
    name: string;
    completed: boolean;
    completedAt?: string;
  }>;
  status: 'online' | 'offline' | 'busy';
  hideHabits?: boolean;
}

interface TopAlliance {
  id: number;
  name: string;
  members: number;
  totalXP: number;
  averageLevel: number;
  rank: number;
  badge: string;
  isRecruiting: boolean;
  description: string;
  strongestMember: {
    name: string;
    level: number;
    avatar: string;
  };
}

interface Challenge7Day {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'beast';
  wagerXP: number;
}

interface AIMessage {
  id: string;
  type: 'message' | 'question' | 'challenge-suggestion';
  content: string;
  timestamp: Date;
  challenge?: Challenge7Day;
}

interface OneOnOneRecord {
  opponentId: number;
  opponentName: string;
  opponentAvatar: string;
  wins: number;
  losses: number;
  totalChallenges: number;
  winRate: number;
  lastChallenge?: {
    date: string;
    result: 'win' | 'loss';
    challengeType: string;
  };
  currentStreak: number;
  streakType: 'win' | 'loss';
}

interface OneOnOneChallenge {
  id: string;
  opponentId: number;
  opponentName: string;
  opponentAvatar: string;
  challengeTitle: string;
  challengeDescription: string;
  wagerXP: number;
  tasks: Array<{
    day: number;
    task: string;
    description: string;
  }>;
  status: 'pending' | 'active' | 'completed';
  startDate: Date;
  endDate: Date;
  myProgress: number;
  opponentProgress: number;
  challengedBy: 'me' | 'opponent';
}

interface ChallengeNotification {
  id: string;
  challengerId: number;
  challengerName: string;
  challengerAvatar: string;
  challengeTitle: string;
  timestamp: Date;
  challenge: OneOnOneChallenge;
}

interface AllianceRequest {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  userLevel: number;
  userStreak: number;
  userXP: number;
  requestedAt: Date;
  message?: string;
}

interface AlliancePageProps {
  isInitialLoad?: boolean;
  userXP?: number;
  userLevel?: number;
}

const allianceMembers: Member[] = [
  {
    id: 1,
    name: "Dario",
    level: 13,
    streak: 12,
    xp: 1640,
    isYou: true,
    avatar: "🔥",
    completionGrid: [true, true, false, true, true, true, true],
    habits: [
      { name: "Reading & Mindfulness", completed: true, completedAt: "6:15 AM" },
      { name: "Morning Energy Boost", completed: true, completedAt: "6:45 AM" },
      { name: "Evening Reflection", completed: false }
    ],
    status: 'online',
    hideHabits: false
  },
  {
    id: 2,
    name: "Alex",
    level: 8,
    streak: 15,
    xp: 1200,
    avatar: "⚡",
    completionGrid: [true, true, true, true, true, true, false],
    habits: [
      { name: "Daily Discipline Builder", completed: true, completedAt: "5:30 AM" },
      { name: "Workout Session", completed: true, completedAt: "7:00 AM" },
      { name: "Skill Practice", completed: false }
    ],
    status: 'online',
    hideHabits: false
  },
  {
    id: 3,
    name: "Maya",
    level: 11,
    streak: 8,
    xp: 1450,
    avatar: "🌟",
    completionGrid: [true, true, true, false, true, true, true],
    habits: [
      { name: "Fitness Focus", completed: true, completedAt: "11:45 PM" },
      { name: "Creative Writing", completed: false },
      { name: "Language Learning", completed: true, completedAt: "8:30 PM" }
    ],
    status: 'offline',
    hideHabits: true
  }
];

// Alliance Join Requests
const allianceRequests: AllianceRequest[] = [
  {
    id: 'req-1',
    userId: 4,
    userName: "Jordan",
    userAvatar: "💪",
    userLevel: 9,
    userStreak: 6,
    userXP: 1350,
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    message: "Looking for a dedicated team to push each other to the next level!"
  },
  {
    id: 'req-2',
    userId: 5,
    userName: "Sam",
    userAvatar: "🎯",
    userLevel: 7,
    userStreak: 10,
    userXP: 980,
    requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    message: "Love the alliance motto! Excited to join the grind."
  },
  {
    id: 'req-3',
    userId: 6,
    userName: "Riley",
    userAvatar: "🚀",
    userLevel: 12,
    userStreak: 20,
    userXP: 1820,
    requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
];

// Active 1-on-1 challenges
const activeOneOnOneChallenges: OneOnOneChallenge[] = [];

// Pending challenge requests (incoming)
const pendingChallengeRequests: OneOnOneChallenge[] = [
  {
    id: 'pending-1',
    opponentId: 3,
    opponentName: "Maya",
    opponentAvatar: "🌟",
    challengeTitle: "Morning Warriors Duel",
    challengeDescription: "See who can master the perfect morning routine",
    wagerXP: 75,
    tasks: [
      { day: 1, task: "Wake up by 6:00 AM", description: "Start your day early" },
      { day: 2, task: "20-minute workout", description: "Get your blood pumping" },
      { day: 3, task: "Meditation + journaling", description: "Clear your mind" },
      { day: 4, task: "Healthy breakfast prep", description: "Fuel your body right" },
      { day: 5, task: "Morning walk + podcasts", description: "Learn while moving" },
      { day: 6, task: "Skill practice session", description: "Grow your talents" },
      { day: 7, task: "Week reflection", description: "Plan for continued growth" }
    ],
    status: 'pending',
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    myProgress: 0,
    opponentProgress: 0,
    challengedBy: 'opponent'
  },
  {
    id: 'pending-2',
    opponentId: 2,
    opponentName: "Alex",
    opponentAvatar: "⚡",
    challengeTitle: "Evening Productivity Showdown",
    challengeDescription: "Who can dominate the evening hours for maximum productivity",
    wagerXP: 100,
    tasks: [
      { day: 1, task: "Complete evening planning", description: "Set tomorrow's priorities" },
      { day: 2, task: "2-hour deep work session", description: "Focus time after dinner" },
      { day: 3, task: "Learn something new", description: "30 min skill building" },
      { day: 4, task: "Evening workout", description: "Get those endorphins flowing" },
      { day: 5, task: "Creative project time", description: "Work on passion project" },
      { day: 6, task: "Read for 30 minutes", description: "Expand your mind" },
      { day: 7, task: "Week review + planning", description: "Reflect and strategize" }
    ],
    status: 'pending',
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    myProgress: 0,
    opponentProgress: 0,
    challengedBy: 'opponent'
  }
];

const oneOnOneRecords: OneOnOneRecord[] = [
  {
    opponentId: 2,
    opponentName: "Alex",
    opponentAvatar: "⚡",
    wins: 3,
    losses: 2,
    totalChallenges: 5,
    winRate: 60,
    lastChallenge: {
      date: "2 days ago",
      result: "win",
      challengeType: "Morning Warrior"
    },
    currentStreak: 2,
    streakType: "win"
  }
];

const topAlliances: TopAlliance[] = [
  {
    id: 1,
    name: "Elite Grinders",
    members: 4,
    totalXP: 89500,
    averageLevel: 22,
    rank: 1,
    badge: "👑",
    isRecruiting: false,
    description: "Legendary alliance dominating all challenges",
    strongestMember: { name: "DragonSlayer", level: 35, avatar: "🐉" }
  },
  {
    id: 2,
    name: "Beast Mode Collective",
    members: 4,
    totalXP: 84200,
    averageLevel: 21,
    rank: 2,
    badge: "⚡",
    isRecruiting: true,
    description: "Unstoppable force of daily habit masters",
    strongestMember: { name: "ThunderStrike", level: 33, avatar: "⚡" }
  },
  {
    id: 3,
    name: "Velocity Squad",
    members: 4,
    totalXP: 79800,
    averageLevel: 19,
    rank: 3,
    badge: "🚀",
    isRecruiting: false,
    description: "Speed demons crushing every goal",
    strongestMember: { name: "LightSpeed", level: 29, avatar: "🌟" }
  },
  {
    id: 4,
    name: "Phoenix Rising",
    members: 3,
    totalXP: 76300,
    averageLevel: 25,
    rank: 4,
    badge: "🔥",
    isRecruiting: true,
    description: "Rising from challenges stronger than ever",
    strongestMember: { name: "FlameKeeper", level: 31, avatar: "🔥" }
  },
  {
    id: 5,
    name: "The Grind Squad",
    members: 3,
    totalXP: 4290,
    averageLevel: 11,
    rank: 47,
    badge: "💪",
    isRecruiting: true,
    description: "Your current alliance - climbing the ranks!",
    strongestMember: { name: "Dario", level: 13, avatar: "🔥" }
  }
];

// Counter for unique message IDs
let messageIdCounter = 0;
const generateUniqueMessageId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${messageIdCounter++}`;
};

// Generate dynamic achievements based on member data and battle records
const generateRecentAchievements = () => {
  const achievements = [];
  
  // Check for members with perfect habit completion today
  const membersWithPerfectDay = allianceMembers.filter(m => 
    m.habits.every(h => h.completed)
  );
  if (membersWithPerfectDay.length > 0 && membersWithPerfectDay[0].name !== "Dario") {
    achievements.push({
      icon: <Check className="w-4 h-4 text-green-400" />,
      text: `${membersWithPerfectDay[0].name} completed all ${membersWithPerfectDay[0].habits.length} habits today!`
    });
  }
  
  // Check for streak milestones (multiples of 5 or 7)
  const streakMembers = allianceMembers.filter(m => 
    !m.isYou && (m.streak % 7 === 0 || (m.streak % 5 === 0 && m.streak >= 10))
  );
  if (streakMembers.length > 0) {
    const member = streakMembers[0];
    achievements.push({
      icon: <Flame className="w-4 h-4 text-orange-400" />,
      text: `${member.name} hit a ${member.streak}-day streak!`
    });
  }
  
  // Check for level milestones (10+)
  const highLevelMembers = allianceMembers.filter(m => !m.isYou && m.level >= 10);
  if (highLevelMembers.length > 0) {
    const member = highLevelMembers[0];
    achievements.push({
      icon: <Star className="w-4 h-4 text-yellow-400" />,
      text: `${member.name} reached Level ${member.level}!`
    });
  }
  
  // Check for early completions (before 8 AM)
  const earlyBirds = allianceMembers.filter(m => 
    !m.isYou && m.habits.some(h => h.completedAt && h.completedAt.includes("AM") && 
    parseInt(h.completedAt.split(':')[0]) <= 7)
  );
  if (earlyBirds.length > 0) {
    const member = earlyBirds[0];
    const habit = member.habits.find(h => h.completedAt && h.completedAt.includes("AM"));
    achievements.push({
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      text: `${member.name} crushed "${habit?.name}" at ${habit?.completedAt}!`
    });
  }
  
  // Check for perfect weeks (all 7 days completed)
  const perfectWeekMembers = allianceMembers.filter(m => 
    m.completionGrid.every(day => day)
  );
  if (perfectWeekMembers.length > 0 && perfectWeekMembers[0].name !== "Dario") {
    achievements.push({
      icon: <Trophy className="w-4 h-4 text-yellow-400" />,
      text: `${perfectWeekMembers[0].name} completed a perfect 7-day week!`
    });
  }
  
  // Check for battle wins
  const recentBattleWins = oneOnOneRecords.filter(r => 
    r.lastChallenge?.result === 'win' && r.lastChallenge.date.includes('days ago')
  );
  if (recentBattleWins.length > 0) {
    const record = recentBattleWins[0];
    achievements.push({
      icon: <Swords className="w-4 h-4 text-purple-400" />,
      text: `You won "${record.lastChallenge?.challengeType}" vs ${record.opponentName}!`
    });
  }
  
  // Check for win streaks in battles
  const winStreaks = oneOnOneRecords.filter(r => 
    r.streakType === 'win' && r.currentStreak >= 2
  );
  if (winStreaks.length > 0) {
    const record = winStreaks[0];
    achievements.push({
      icon: <Medal className="w-4 h-4 text-purple-400" />,
      text: `${record.currentStreak}-battle win streak vs ${record.opponentName}!`
    });
  }
  
  // If we have fewer than 3 achievements, add some generic ones
  if (achievements.length < 3) {
    achievements.push({
      icon: <Target className="w-4 h-4 text-purple-400" />,
      text: `Alliance completed ${activeOneOnOneChallenges.length + 10} total challenges`
    });
  }
  
  // Return only top 3 achievements
  return achievements.slice(0, 3);
};

export function AlliancePage({ isInitialLoad = true, userXP = 1200, userLevel = 8 }: AlliancePageProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'members' | 'rankings' | 'settings'>('overview');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<AllianceRequest[]>(allianceRequests);
  const [showAllianceChat, setShowAllianceChat] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [show1on1Modal, setShow1on1Modal] = useState(false);
  const [showAllianceSettings, setShowAllianceSettings] = useState(false);
  const [showAllianceFeaturesInfo, setShowAllianceFeaturesInfo] = useState(false);
  const [showChallengeDetails, setShowChallengeDetails] = useState(false);
  const [showChallengeNotification, setShowChallengeNotification] = useState(false);
  const [showChallengeConfirmation, setShowChallengeConfirmation] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [selectedWager, setSelectedWager] = useState(50);
  const [selectedOpponent, setSelectedOpponent] = useState<Member | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<OneOnOneChallenge | null>(null);
  const [pendingNotification, setPendingNotification] = useState<ChallengeNotification | null>(null);
  const [allianceMotto, setAllianceMotto] = useState("Consistency beats perfection. Small daily wins create massive transformations.");
  const [editingMotto, setEditingMotto] = useState(false);
  const [mottoInput, setMottoInput] = useState(allianceMotto);
  const [isInAlliance, setIsInAlliance] = useState(true); // Set to false to test join flow
  const [chatMessage, setChatMessage] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [memberHabitVisibility, setMemberHabitVisibility] = useState<{[key: number]: boolean}>({});
  const [showBattleHistoryModal, setShowBattleHistoryModal] = useState(false);
  const [selectedBattleRecord, setSelectedBattleRecord] = useState<OneOnOneRecord | null>(null);
  const [show1on1InfoModal, setShow1on1InfoModal] = useState(false);
  const [challengeBreakdownExpanded, setChallengeBreakdownExpanded] = useState(false);
  const [showTodayTaskModal, setShowTodayTaskModal] = useState(false);
  const [pendingChallenges, setPendingChallenges] = useState<OneOnOneChallenge[]>(pendingChallengeRequests);
  const [activeChallenges, setActiveChallenges] = useState<OneOnOneChallenge[]>(activeOneOnOneChallenges);
  
  // Daily task check-off states
  const [todayTaskCompleted, setTodayTaskCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 12, minutes: 14 }); // Demo starting time
  const [dayMissed, setDayMissed] = useState(false);
  const [showTaskSuccess, setShowTaskSuccess] = useState(false);
  
  // AI Coach states (for 1-on-1 challenges)
  const [aiMessages, setAIMessages] = useState<AIMessage[]>([
    {
      id: generateUniqueMessageId('initial'),
      type: 'message',
      content: "👥 Who do you want to challenge to an epic 1-on-1 duel? Choose your opponent and I'll help you create the perfect challenge!",
      timestamp: new Date()
    }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);

  // Demo challenge notification (Maya challenging you)
  const demoNotification: ChallengeNotification = {
    id: 'demo-challenge-1',
    challengerId: 3,
    challengerName: "Maya",
    challengerAvatar: "🌟",
    challengeTitle: "Morning Warrior Duel",
    timestamp: new Date(),
    challenge: {
      id: 'challenge-maya-1',
      opponentId: 3,
      opponentName: "Maya",
      opponentAvatar: "🌟",
      challengeTitle: "Morning Warrior Duel",
      challengeDescription: "Transform your mornings with a powerful routine that energizes your entire day. Let's see who can master the art of winning the morning!",
      wagerXP: 75,
      tasks: [
        { day: 1, task: "Wake up by 6:00 AM", description: "Start your day early and seize control of your morning" },
        { day: 2, task: "20-minute workout + meditation", description: "Combine physical and mental strength training" },
        { day: 3, task: "Healthy breakfast + journaling", description: "Fuel your body and clear your mind with intention" },
        { day: 4, task: "Morning walk + goal setting", description: "Move your body while planning your day for maximum impact" },
        { day: 5, task: "Skill practice + energy tracking", description: "Develop your talents while monitoring your energy levels" },
        { day: 6, task: "Social connection + gratitude", description: "Reach out to someone meaningful and practice appreciation" },
        { day: 7, task: "Reflection + next week planning", description: "Review your progress and set intentions for continued growth" }
      ],
      status: 'pending',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      myProgress: 0,
      opponentProgress: 0,
      challengedBy: 'opponent'
    }
  };

  // Generate unique invite link and code for current alliance
  const inviteLink = "https://grindapp.com/join/gho123-elite-squad";
  const currentAllianceCode = "GHO123";

  // Countdown timer for daily task (24-hour cycle)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        // Calculate new time
        let { hours, minutes } = prev;
        
        if (minutes > 0) {
          minutes -= 1;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
        } else {
          // Time expired
          setDayMissed(true);
          clearInterval(timer);
          return { hours: 0, minutes: 0 };
        }
        
        return { hours, minutes };
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleTaskComplete = () => {
    if (!dayMissed && !todayTaskCompleted) {
      setTodayTaskCompleted(true);
      setShowTaskSuccess(true);
      setShowConfetti(true);
      
      // Hide success animation after 2 seconds
      setTimeout(() => {
        setShowTaskSuccess(false);
        setShowConfetti(false);
      }, 2000);
    }
  };

  const handleCopyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleJoinWithCode = () => {
    if (joinCode.trim()) {
      setIsInAlliance(true);
      setShowJoinModal(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage("");
      // Add message logic here
    }
  };

  const toggleMemberHabitVisibility = (memberId: number) => {
    setMemberHabitVisibility(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  // AI Coach conversation logic for 1-on-1 challenges
  const getQuickPrompts = () => {
    switch (conversationStep) {
      case 0:
        return allianceMembers.slice(1).map(member => member.name); // Exclude yourself (first member)
      case 1:
        return ["Morning routines", "Productivity habits", "Fitness goals", "Creative projects"];
      case 2:
        return ["Daily consistency", "Skill building", "Mindset work", "Performance tracking"];
      case 3:
        return ["Beginner friendly", "Moderate intensity", "High challenge", "Epic difficulty"];
      default:
        return ["Send this challenge", "Adjust the plan", "Start over", "Try different focus"];
    }
  };

  const handleAIResponse = (userInput: string) => {
    const newUserResponses = [...userResponses, userInput];
    setUserResponses(newUserResponses);

    // Add user message with unique ID
    const userMessage: AIMessage = {
      id: generateUniqueMessageId('user'),
      type: 'message',
      content: userInput,
      timestamp: new Date()
    };

    // Generate AI response based on conversation step
    let aiResponse: AIMessage;
    const nextStep = conversationStep + 1;

    switch (conversationStep) {
      case 0: // Opponent selection
        // Find the selected opponent
        const opponent = allianceMembers.find(m => m.name === userInput);
        if (opponent) {
          setSelectedOpponent(opponent);
        }
        aiResponse = {
          id: generateUniqueMessageId('ai'),
          type: 'question',
          content: `Excellent choice! ${userInput} is ready for battle. What do you want to challenge them on? Choose an area where you both can grow and compete.`,
          timestamp: new Date()
        };
        break;
      
      case 1: // Challenge area
        aiResponse = {
          id: generateUniqueMessageId('ai'),
          type: 'question',
          content: `${userInput} - great choice! What specific focus should this challenge have? Think about what would create the most growth and friendly competition.`,
          timestamp: new Date()
        };
        break;
      
      case 2: // Specific focus
        aiResponse = {
          id: generateUniqueMessageId('ai'),
          type: 'question',
          content: `Perfect! ${userInput} will make this challenge epic. How intense should this 7-day duel be? Remember, both of you will be wagering XP!`,
          timestamp: new Date()
        };
        break;
      
      case 3: // Difficulty level
        const challenge = generatePersonalized1on1Challenge(newUserResponses);
        aiResponse = {
          id: generateUniqueMessageId('ai'),
          type: 'challenge-suggestion',
          content: `⚔️ Challenge ready! "${challenge.title}" - a ${challenge.difficulty} level duel between you and ${selectedOpponent?.name}. Ready to send it?`,
          timestamp: new Date(),
          challenge
        };
        break;
      
      default:
        aiResponse = {
          id: generateUniqueMessageId('ai'),
          type: 'message',
          content: "🚀 Ready for another challenge? What area would you like to focus on this time?",
          timestamp: new Date()
        };
        setConversationStep(0);
        setUserResponses([]);
        break;
    }

    setAIMessages(prev => [...prev, userMessage, aiResponse]);
    setConversationStep(nextStep);
    setAiInput("");
  };

  const generatePersonalized1on1Challenge = (responses: string[]): Challenge7Day => {
    const [area, focus, difficulty, type] = responses;
    
    const difficultyMap = {
      'Easy start': 'easy' as const,
      'Moderate challenge': 'medium' as const,
      'Push my limits': 'hard' as const,
      'Beast mode': 'beast' as const
    };

    const wagerMap = {
      'easy': 50,
      'medium': 75,
      'hard': 100,
      'beast': 150
    };

    const difficultyLevel = difficultyMap[difficulty as keyof typeof difficultyMap] || 'medium';
    
    if (area.toLowerCase().includes('morning') && focus.toLowerCase().includes('consistency')) {
      return {
        id: generateUniqueMessageId('challenge'),
        title: "Dawn Warriors Duel",
        description: `An epic morning routine showdown between you and ${selectedOpponent?.name}. Transform your mornings and energize your entire day.`,
        tasks: [
          "Wake up by 6:00 AM",
          "20-minute workout + meditation",
          "Healthy breakfast + journaling",
          "Morning walk + goal setting",
          "Skill practice + energy tracking",
          "Social connection + gratitude",
          "Reflection + next week planning"
        ],
        duration: 7,
        difficulty: difficultyLevel,
        wagerXP: wagerMap[difficultyLevel]
      };
    } else if (area.toLowerCase().includes('productivity')) {
      return {
        id: generateUniqueMessageId('challenge'),
        title: "Focus Mastery Showdown",
        description: `A productivity battle royal! See who can achieve deeper focus and eliminate more distractions.`,
        tasks: [
          "2-hour deep work block",
          "Phone-free focus sessions",
          "Complete top 3 priorities",
          "Time-block entire day",
          "End-of-day review + planning",
          "Weekly goal assessment",
          "Productivity system optimization"
        ],
        duration: 7,
        difficulty: difficultyLevel,
        wagerXP: wagerMap[difficultyLevel]
      };
    } else if (area.toLowerCase().includes('fitness')) {
      return {
        id: generateUniqueMessageId('challenge'),
        title: "Beast Mode Body Transformation",
        description: `The ultimate fitness throwdown! Push your physical limits and see who can build more strength and stamina.`,
        tasks: [
          "Full body workout",
          "Cardio + core session",
          "Strength training focus",
          "Flexibility & recovery",
          "High-intensity intervals",
          "Active rest + stretching",
          "Final assessment & celebration"
        ],
        duration: 7,
        difficulty: difficultyLevel,
        wagerXP: wagerMap[difficultyLevel]
      };
    } else {
      return {
        id: generateUniqueMessageId('challenge'),
        title: "Growth Mindset Challenge",
        description: `A battle for personal development excellence. Who can push themselves further?`,
        tasks: [
          "Daily learning session",
          "Skill practice block",
          "Reflection + journaling",
          "Creative exploration",
          "Mentorship + feedback",
          "Goal setting + tracking",
          "Week review + planning"
        ],
        duration: 7,
        difficulty: difficultyLevel,
        wagerXP: wagerMap[difficultyLevel]
      };
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleAIResponse(prompt);
  };

  const handleSendChallenge = () => {
    setShow1on1Modal(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    // Reset AI conversation
    resetAIConversation();
    // Here you would typically save the challenge and send it to the opponent
  };

  const resetAIConversation = () => {
    setAIMessages([
      {
        id: generateUniqueMessageId('initial'),
        type: 'message',
        content: "👥 Who do you want to challenge to an epic 1-on-1 duel? Choose your opponent and I'll help you create the perfect challenge!",
        timestamp: new Date()
      }
    ]);
    setAiInput("");
    setConversationStep(0);
    setUserResponses([]);
    setSelectedOpponent(null);
  };

  const handleShowChallengeNotification = () => {
    setPendingNotification(demoNotification);
    setShowChallengeNotification(true);
  };

  const handleAcceptChallenge = () => {
    setShowChallengeNotification(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setPendingNotification(null);
  };

  const handleViewChallengeDetails = () => {
    if (pendingNotification) {
      setSelectedChallenge(pendingNotification.challenge);
      setShowChallengeDetails(true);
    }
  };

  const handleAllianceNameClick = () => {
    setShowAllianceSettings(true);
  };

  const handleSaveMotto = () => {
    setAllianceMotto(mottoInput);
    setEditingMotto(false);
  };

  const handleLeaveAlliance = () => {
    setIsInAlliance(false);
    setShowAllianceSettings(false);
  };

  const handleCreateAlliance = (allianceData: AllianceData) => {
    // Set alliance data
    setAllianceMotto(allianceData.motto);
    // In a real app, you would save icon and privacy settings to state
    
    // Join the alliance and show celebration
    setIsInAlliance(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const wagerOptions = [25, 50, 75, 100, 150, 200];

  if (!isInAlliance && !demoMode) {
    // NOT IN ALLIANCE STATE
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'radial-gradient(circle at center, #0B0B1D 0%, #000000 100%)'
      }}>
        <div className="relative z-10 max-w-md mx-auto px-6 pt-12 pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-8 h-8 text-purple-400" />
              <h1 className="text-white font-bold" style={{ fontSize: '28px' }}>Join an Alliance</h1>
            </div>
            <p className="text-gray-400" style={{ fontSize: '16px' }}>
              Team up with other grinders to challenge each other and climb the leaderboards together.
            </p>
          </motion.div>

          {/* Demo Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDemoMode(true)}
              className="w-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 py-3 rounded-xl font-medium hover:bg-green-600/30 transition-all duration-300 flex items-center justify-center gap-2"
              style={{ fontSize: '14px' }}
            >
              <Eye className="w-4 h-4" />
              Preview Alliance Experience
            </motion.button>
          </motion.div>

          {/* Join Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowJoinModal(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              style={{ fontSize: '16px' }}
            >
              <div className="flex items-center justify-center gap-2">
                <Hash className="w-5 h-5" />
                Join with Code
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/30 text-blue-400 py-4 rounded-xl font-medium hover:bg-blue-600/30 transition-all duration-300 flex items-center justify-center"
              style={{ fontSize: '16px' }}
            >
              <Crown className="w-5 h-5 mr-2" />
              Create New Alliance
            </motion.button>
          </motion.div>

          {/* Featured Alliances */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <h2 className="text-white font-bold mb-4" style={{ fontSize: '20px' }}>Featured Alliances</h2>
            <div className="space-y-3">
              {topAlliances.filter(a => a.isRecruiting && a.rank <= 4).map((alliance) => (
                <motion.div
                  key={alliance.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-xl cursor-pointer hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{alliance.badge}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold" style={{ fontSize: '16px' }}>{alliance.name}</span>
                        {alliance.rank <= 3 && (
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                            TOP {alliance.rank}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{alliance.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {alliance.members}/4
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Lvl {alliance.averageLevel}
                      </span>
                    </div>
                    <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors">
                      Request to Join
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What You Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 p-6 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-purple-600/10 border border-purple-500/30 rounded-xl"
          >
            <h3 className="text-white font-bold mb-4" style={{ fontSize: '18px' }}>Alliance Benefits</h3>
            <div className="space-y-3">
              {[
                { icon: <MessageCircle className="w-5 h-5" />, text: "Alliance chat & accountability" },
                { icon: <Swords className="w-5 h-5" />, text: "1-on-1 duels with custom challenges" },
                { icon: <Trophy className="w-5 h-5" />, text: "Compete in global rankings" },
                { icon: <Target className="w-5 h-5" />, text: "Weekly group challenges" }
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="text-purple-400">
                    {benefit.icon}
                  </div>
                  <span style={{ fontSize: '14px' }}>{benefit.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <ConfettiEffect
          isActive={showConfetti}
          onComplete={() => setShowConfetti(false)}
        />
      </div>
    );
  }

  // IN ALLIANCE STATE
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'radial-gradient(circle at center, #0B0B1D 0%, #000000 100%)'
    }}>
      <div className="relative z-10 max-w-md mx-auto px-6 pt-12 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <motion.div 
            className="flex items-center justify-center gap-2 mb-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Crown className="w-6 h-6 text-purple-400" />
            <motion.button
              onClick={handleAllianceNameClick}
              className="text-white font-bold hover:text-purple-300 transition-colors"
              style={{ fontSize: '26px' }}
            >
              The Grind Squad
            </motion.button>
            {demoMode && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                DEMO
              </span>
            )}
          </motion.div>
          <p className="text-gray-400 mb-4" style={{ fontSize: '14px' }}>
            3/4 members • Rank #47 • Code: <span className="text-purple-400 font-tabular">{currentAllianceCode}</span>
            {demoMode && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDemoMode(false)}
                className="ml-3 bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs hover:bg-red-500/30 transition-colors"
              >
                Exit Demo
              </motion.button>
            )}
          </p>
          
          {/* Primary CTAs */}
          <div className="flex gap-3 mb-4">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('settings')}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
              style={{ fontSize: '14px', fontWeight: '600' }}
            >
              <Settings className="w-4 h-4" />
              Alliance Settings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRequestsModal(true)}
              className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 relative"
              style={{ fontSize: '14px', fontWeight: '600' }}
            >
              <UserPlus className="w-4 h-4" />
              Requests
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs defaultValue="overview" value={activeSection} onValueChange={(value: any) => setActiveSection(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-2 bg-transparent p-0 mb-6">
              <TabsTrigger 
                value="overview" 
                className="h-12 data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-[0_3px_0_0_rgb(107,33,168),0_6px_12px_rgba(147,51,234,0.3)] data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-0.5 data-[state=inactive]:shadow-[0_2px_0_0_rgb(55,65,81)] bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400 rounded-lg transition-all duration-150 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgb(107,33,168)]"
              >
                <span className="text-xs font-bold">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="h-12 data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-[0_3px_0_0_rgb(107,33,168),0_6px_12px_rgba(147,51,234,0.3)] data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-0.5 data-[state=inactive]:shadow-[0_2px_0_0_rgb(55,65,81)] bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400 rounded-lg transition-all duration-150 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgb(107,33,168)]"
              >
                <span className="text-xs font-bold">Members</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rankings" 
                className="h-12 data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-[0_3px_0_0_rgb(107,33,168),0_6px_12px_rgba(147,51,234,0.3)] data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-0.5 data-[state=inactive]:shadow-[0_2px_0_0_rgb(55,65,81)] bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400 rounded-lg transition-all duration-150 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgb(107,33,168)]"
              >
                <span className="text-xs font-bold">Rankings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="h-12 data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-[0_3px_0_0_rgb(107,33,168),0_6px_12px_rgba(147,51,234,0.3)] data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-0.5 data-[state=inactive]:shadow-[0_2px_0_0_rgb(55,65,81)] bg-gradient-to-b from-gray-700 to-gray-800 text-gray-400 rounded-lg transition-all duration-150 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgb(107,33,168)]"
              >
                <span className="text-xs font-bold">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Alliance Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-xl p-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-bold font-tabular" style={{ fontSize: '18px' }}>
                        4,290
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">Total XP</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Trophy className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-bold font-tabular" style={{ fontSize: '18px' }}>
                        #47
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">Global Rank</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllianceChat(true)}
                  className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/30 text-blue-400 py-4 rounded-xl font-medium hover:bg-blue-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ fontSize: '14px' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Alliance Chat
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    resetAIConversation();
                    setShow1on1Modal(true);
                  }}
                  className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 text-purple-400 py-4 rounded-xl font-medium hover:bg-purple-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ fontSize: '14px' }}
                >
                  <Swords className="w-4 h-4" />
                  Challenge 1-on-1
                </motion.button>
              </div>

              {/* 1-on-1 Challenges Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                {/* Section Header with Info Button */}
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold flex items-center gap-2" style={{ fontSize: '18px' }}>
                    <Swords className="w-5 h-5 text-purple-400" />
                    1-on-1 Battles
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShow1on1InfoModal(true)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    <Info className="w-4 h-4 text-white" />
                  </motion.button>
                </div>

                {/* Active Challenges */}
                {activeChallenges.length > 0 && (
                  <div className="relative bg-gradient-to-br from-purple-900/30 via-gray-900/60 to-gray-900/80 border border-purple-500/40 rounded-xl p-6 overflow-hidden">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 animate-pulse" />
                    
                    <div className="relative z-10 space-y-4">
                      {activeChallenges.map((challenge, index) => (
                        <motion.div 
                          key={challenge.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="relative bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-gray-800/80 border border-purple-500/30 rounded-xl p-5 overflow-hidden"
                        >
                          {/* Corner accent decorations */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full" />
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-tr-full" />
                          
                          {/* VS Badge */}
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                            VS
                          </div>

                          <div className="relative z-10">
                            {/* Battle Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <motion.div 
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-lg shadow-lg ring-2 ring-purple-400/50"
                                >
                                  {challenge.opponentAvatar}
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                    <Swords className="w-3 h-3 text-white" />
                                  </div>
                                </motion.div>
                                <div>
                                  <div className="text-white font-bold" style={{ fontSize: '16px' }}>
                                    {challenge.opponentName}
                                  </div>
                                  <div className="text-gray-300 text-sm font-medium">{challenge.challengeTitle}</div>
                                </div>
                              </div>
                            </div>

                            {/* Challenge Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="w-4 h-4 text-purple-400" />
                                  <span className="text-xs text-gray-400">Time</span>
                                </div>
                                <div className="text-purple-300 font-bold">Day 3/7</div>
                              </div>
                              <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <Coins className="w-4 h-4 text-yellow-400" />
                                  <span className="text-xs text-gray-400">Wager</span>
                                </div>
                                <div className="text-yellow-300 font-bold">{challenge.wagerXP} XP</div>
                              </div>
                            </div>

                            {/* Progress Battle Section */}
                            <div className="space-y-3 mb-4">
                              {/* Your Progress */}
                              <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-400" />
                                    <span className="text-white font-medium text-sm">You</span>
                                  </div>
                                  <motion.span 
                                    key={challenge.myProgress}
                                    initial={{ scale: 1.3 }}
                                    animate={{ scale: 1 }}
                                    className="text-green-400 font-bold text-sm"
                                  >
                                    {challenge.myProgress}/7
                                  </motion.span>
                                </div>
                                <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/50">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(challenge.myProgress / 7) * 100}%` }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 shadow-lg"
                                    style={{
                                      boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                                    }}
                                  />
                                  {/* Shine effect */}
                                  <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  />
                                </div>
                              </div>

                              {/* Opponent Progress */}
                              <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Swords className="w-4 h-4 text-orange-400" />
                                    <span className="text-white font-medium text-sm">{challenge.opponentName}</span>
                                  </div>
                                  <motion.span 
                                    key={challenge.opponentProgress}
                                    initial={{ scale: 1.3 }}
                                    animate={{ scale: 1 }}
                                    className="text-orange-400 font-bold text-sm"
                                  >
                                    {challenge.opponentProgress}/7
                                  </motion.span>
                                </div>
                                <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/50">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(challenge.opponentProgress / 7) * 100}%` }}
                                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 shadow-lg"
                                    style={{
                                      boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)'
                                    }}
                                  />
                                  {/* Shine effect */}
                                  <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  />
                                </div>
                              </div>

                              {/* Lead indicator */}
                              {challenge.myProgress !== challenge.opponentProgress && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex items-center gap-2 text-xs ${
                                    challenge.myProgress > challenge.opponentProgress 
                                      ? 'text-green-400' 
                                      : 'text-orange-400'
                                  }`}
                                >
                                  <TrendingUp className="w-3 h-3" />
                                  <span>
                                    {challenge.myProgress > challenge.opponentProgress 
                                      ? `You're ahead by ${challenge.myProgress - challenge.opponentProgress} day${challenge.myProgress - challenge.opponentProgress > 1 ? 's' : ''}!` 
                                      : `${challenge.opponentName} is ahead by ${challenge.opponentProgress - challenge.myProgress} day${challenge.opponentProgress - challenge.myProgress > 1 ? 's' : ''}!`
                                    }
                                  </span>
                                </motion.div>
                              )}
                            </div>

                            {/* 7-Day Challenge Breakdown - Collapsible */}
                            <div className="space-y-3 mt-6">
                              <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setChallengeBreakdownExpanded(!challengeBreakdownExpanded)}
                                className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/40 rounded-lg p-4 hover:border-purple-500/60 transition-all duration-300"
                              >
                                <div className="flex items-center gap-2">
                                  <Timer className="w-5 h-5 text-purple-400" />
                                  <h4 className="text-white font-bold" style={{ fontSize: '16px' }}>
                                    7-Day Challenge Breakdown
                                  </h4>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 text-xs text-purple-300">
                                    <span>{challenge.myProgress}/7 Complete</span>
                                  </div>
                                  <motion.div
                                    animate={{ rotate: challengeBreakdownExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <ChevronDown className="w-5 h-5 text-purple-400" />
                                  </motion.div>
                                </div>
                              </motion.button>
                              
                              <AnimatePresence>
                                {challengeBreakdownExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="space-y-2 pt-2">
                                {challenge.tasks.map((task, taskIndex) => {
                                  const isCompleted = taskIndex < challenge.myProgress;
                                  const isToday = taskIndex === challenge.myProgress;
                                  const isFuture = taskIndex > challenge.myProgress;
                                  
                                  return (
                                    <motion.div 
                                      key={taskIndex} 
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: taskIndex * 0.05 }}
                                      className={`border rounded-lg p-3 transition-all duration-300 ${
                                        isCompleted 
                                          ? 'bg-green-500/10 border-green-500/30' 
                                          : isToday 
                                          ? 'bg-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                                          : 'bg-gray-800/20 border-gray-700/30'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                          isCompleted 
                                            ? 'bg-green-500 text-white' 
                                            : isToday 
                                            ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                            : 'bg-gray-700 text-gray-400'
                                        }`}>
                                          {isCompleted ? <Check className="w-4 h-4" /> : task.day}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className={`font-medium text-sm ${
                                              isCompleted 
                                                ? 'text-green-400 line-through' 
                                                : isToday 
                                                ? 'text-white'
                                                : 'text-gray-400'
                                            }`}>
                                              {task.task}
                                            </span>
                                            {isToday && (
                                              <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-bold"
                                              >
                                                TODAY
                                              </motion.div>
                                            )}
                                          </div>
                                          <p className={`text-xs mt-1 ${
                                            isCompleted || isToday ? 'text-gray-400' : 'text-gray-500'
                                          }`}>
                                            {task.description}
                                          </p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                                    </div>

                                    {/* How to Complete Callout */}
                                    <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-lg p-3 mt-4">
                                      <div className="flex items-start gap-2">
                                        <Target className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                                        <div className="text-xs">
                                          <div className="text-cyan-300 font-bold mb-1">How to Win This Battle</div>
                                          <p className="text-gray-300 leading-relaxed">
                                            Complete each day's task before midnight. Click the button below to check off today's task. 
                                            Complete more tasks than {challenge.opponentName} to win <span className="text-yellow-400 font-bold">{challenge.wagerXP} XP</span>!
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              {/* Open Details Button */}
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setSelectedChallenge(challenge);
                                  setShowTodayTaskModal(true);
                                }}
                                className="w-full bg-gradient-to-b from-purple-600 to-purple-700 text-white shadow-[0_3px_0_0_rgb(107,33,168),0_6px_12px_rgba(147,51,234,0.3)] translate-y-0 rounded-lg transition-all duration-150 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgb(107,33,168)] py-3 font-bold flex items-center justify-center gap-2"
                                style={{ fontSize: '14px' }}
                              >
                                <Calendar className="w-4 h-4" />
                                Check Off Today's Task
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenge Requests - Only show when no active challenges */}
                {activeChallenges.length === 0 && pendingChallenges.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-bold flex items-center gap-2" style={{ fontSize: '16px' }}>
                        <MessageCircle className="w-4 h-4 text-cyan-400" />
                        Challenge Requests
                      </h4>
                      <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-full px-2 py-0.5">
                        <span className="text-cyan-300 text-xs font-bold">{pendingChallenges.length}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {pendingChallenges.map((challenge) => (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-4 hover:border-purple-500/30 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-sm">
                              {challenge.opponentAvatar}
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium">{challenge.opponentName}</div>
                              <div className="text-gray-400 text-xs">challenged you</div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-700/30 rounded-lg p-3 mb-3">
                            <div className="text-purple-300 font-medium text-sm mb-1">{challenge.challengeTitle}</div>
                            <div className="text-gray-400 text-xs mb-2">{challenge.challengeDescription}</div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                7 days
                              </span>
                              <span className="flex items-center gap-1">
                                <Coins className="w-3 h-3 text-yellow-400" />
                                <span className="text-yellow-400 font-medium">{challenge.wagerXP} XP</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setSelectedChallenge(challenge);
                                setShowChallengeDetails(true);
                              }}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white"
                            >
                              View Details
                            </Button>
                            <Button
                              onClick={() => {
                                // Accept challenge - move from pending to active
                                const acceptedChallenge = { ...challenge, status: 'active' as const };
                                setActiveChallenges(prev => [...prev, acceptedChallenge]);
                                setPendingChallenges(prev => prev.filter(c => c.id !== challenge.id));
                                setShowConfetti(true);
                                setTimeout(() => setShowConfetti(false), 3000);
                              }}
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                            >
                              Accept
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Battle Records */}
                <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold" style={{ fontSize: '18px' }}>Battle History</h3>
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  
                  <div className="space-y-3">
                    {oneOnOneRecords.map((record) => (
                      <motion.div
                        key={record.opponentId}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedBattleRecord(record);
                          setShowBattleHistoryModal(true);
                        }}
                        className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-4 cursor-pointer hover:border-purple-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-sm">
                              {record.opponentAvatar}
                            </div>
                            <div>
                              <div className="text-white font-medium" style={{ fontSize: '16px' }}>
                                vs {record.opponentName}
                              </div>
                              <div className="text-gray-400 text-xs">
                                {record.totalChallenges} battles • {record.winRate}% win rate
                              </div>
                            </div>
                          </div>
                          <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg py-2">
                            <div className="text-green-400 font-bold">{record.wins}</div>
                            <div className="text-gray-400 text-xs">Wins</div>
                          </div>
                          <div className="bg-red-500/10 border border-red-500/30 rounded-lg py-2">
                            <div className="text-red-400 font-bold">{record.losses}</div>
                            <div className="text-gray-400 text-xs">Losses</div>
                          </div>
                          <div className={`border rounded-lg py-2 ${
                            record.streakType === 'win' 
                              ? 'bg-orange-500/10 border-orange-500/30' 
                              : 'bg-gray-500/10 border-gray-500/30'
                          }`}>
                            <div className={`font-bold ${record.streakType === 'win' ? 'text-orange-400' : 'text-gray-400'}`}>
                              {record.currentStreak}
                            </div>
                            <div className="text-gray-400 text-xs">Streak</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Alliance Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold" style={{ fontSize: '18px' }}>Alliance Details</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDetailsModal(true)}
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    View More
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/30 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">4,290</div>
                    <div className="text-sm text-gray-400">Total XP</div>
                  </div>
                  <div className="bg-gray-800/30 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">#47</div>
                    <div className="text-sm text-gray-400">Global Rank</div>
                  </div>
                  <div className="bg-gray-800/30 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">3/4</div>
                    <div className="text-sm text-gray-400">Members</div>
                  </div>
                  <div className="bg-gray-800/30 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">11</div>
                    <div className="text-sm text-gray-400">Avg Level</div>
                  </div>
                </div>

                <div className="bg-gray-800/30 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Recent Achievements</h4>
                  <div className="space-y-2">
                    {generateRecentAchievements().map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        {achievement.icon}
                        {achievement.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="mt-6 space-y-4">
              {allianceMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border rounded-xl p-6 ${
                    member.isYou ? 'border-purple-500/50' : 'border-gray-700/50'
                  }`}
                >
                  {/* Member Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-lg relative ${
                        member.status === 'online' ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900' : ''
                      }`}>
                        {member.avatar}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                          member.status === 'online' ? 'bg-green-400' :
                          member.status === 'busy' ? 'bg-yellow-400' :
                          'bg-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold" style={{ fontSize: '16px' }}>
                            {member.name}
                          </span>
                          {member.isYou && (
                            <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>Level {member.level}</span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-400" />
                            {member.streak} day streak
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold font-tabular">{member.xp} XP</div>
                      <div className="text-gray-400 text-xs">Total</div>
                    </div>
                  </div>

                  {/* 7-Day Grid */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-xs">Last 7 Days</span>
                      <span className="text-purple-400 text-xs font-medium">
                        {member.completionGrid.filter(Boolean).length}/7 complete
                      </span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {member.completionGrid.map((completed, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-lg flex items-center justify-center ${
                            completed 
                              ? 'bg-green-500/30 border border-green-500/50' 
                              : 'bg-gray-700/30 border border-gray-600/30'
                          }`}
                        >
                          {completed && <Check className="w-3 h-3 text-green-400" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Today's Habits */}
                  {!member.hideHabits && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-xs">Today's Habits</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleMemberHabitVisibility(member.id)}
                          className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                          {memberHabitVisibility[member.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                      </div>
                      {!memberHabitVisibility[member.id] && member.habits.map((habit, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            habit.completed 
                              ? 'bg-green-500/10 border border-green-500/30' 
                              : 'bg-gray-700/30 border border-gray-600/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              habit.completed ? 'bg-green-500' : 'bg-gray-600'
                            }`}>
                              {habit.completed && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${
                              habit.completed ? 'text-white' : 'text-gray-400'
                            }`}>
                              {habit.name}
                            </span>
                          </div>
                          {habit.completedAt && (
                            <span className="text-xs text-gray-400">{habit.completedAt}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {member.hideHabits && (
                    <div className="text-center py-4">
                      <EyeOff className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Habits hidden by member</p>
                    </div>
                  )}

                  {/* Actions */}
                  {!member.isYou && (
                    <div className="flex gap-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedOpponent(member);
                          resetAIConversation();
                          setShow1on1Modal(true);
                        }}
                        className="flex-1 bg-purple-600/20 border border-purple-500/30 text-purple-400 py-2 rounded-lg font-medium hover:bg-purple-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ fontSize: '14px' }}
                      >
                        <Swords className="w-4 h-4" />
                        Challenge
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 py-2 rounded-lg font-medium hover:bg-blue-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ fontSize: '14px' }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Add Member Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: allianceMembers.length * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInviteModal(true)}
                className="w-full bg-gradient-to-r from-gray-800/60 to-gray-800/40 border border-gray-700/50 text-gray-300 py-4 rounded-xl font-medium hover:border-purple-500/30 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                style={{ fontSize: '14px' }}
              >
                <Plus className="w-4 h-4" />
                Invite More Members (1 spot left)
              </motion.button>
            </TabsContent>

            {/* Rankings Tab */}
            <TabsContent value="rankings" className="mt-6 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold" style={{ fontSize: '18px' }}>Global Rankings</h3>
                  <Globe className="w-5 h-5 text-purple-400" />
                </div>

                <div className="space-y-3">
                  {topAlliances.map((alliance) => (
                    <motion.div
                      key={alliance.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: alliance.rank * 0.05 }}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        alliance.name === "The Grind Squad" 
                          ? 'bg-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/10' 
                          : 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          alliance.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                          alliance.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                          alliance.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
                          alliance.name === "The Grind Squad" ? 'bg-purple-600 text-white' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          #{alliance.rank}
                        </div>
                        
                        {/* Alliance Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{alliance.badge}</span>
                            <span className={`font-bold ${
                              alliance.name === "The Grind Squad" ? 'text-purple-300' : 'text-white'
                            }`} style={{ fontSize: '16px' }}>
                              {alliance.name}
                            </span>
                            {alliance.name === "The Grind Squad" && (
                              <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                                YOUR ALLIANCE
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{alliance.members}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              <span>{alliance.totalXP.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              <span>Lvl {alliance.averageLevel}</span>
                            </div>
                          </div>
                        </div>
                        
                        {alliance.name !== "The Grind Squad" && (
                          <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6 space-y-6">
              {/* Alliance Creation Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-blue-400" />
                  <h3 className="text-white font-bold" style={{ fontSize: '18px' }}>Create Alliance</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      userLevel >= 5 ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      {userLevel >= 5 ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <X className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Level 5 Required</div>
                      <div className="text-gray-400 text-sm">
                        {userLevel >= 5 
                          ? `You're Level ${userLevel} - Ready to create!` 
                          : `You're Level ${userLevel} - Need ${5 - userLevel} more levels`
                        }
                      </div>
                    </div>
                  </div>

                  {userLevel >= 5 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-center"
                      style={{ fontSize: '14px' }}
                    >
                      Create Your Alliance
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Alliance Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-xl p-6"
              >
                <h3 className="text-white font-bold mb-4" style={{ fontSize: '18px' }}>Alliance Management</h3>
                
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAllianceSettings(true)}
                    className="w-full bg-purple-600/20 border border-purple-500/30 text-purple-400 py-3 rounded-lg font-medium hover:bg-purple-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                    style={{ fontSize: '14px' }}
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Alliance Motto
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInviteModal(true)}
                    className="w-full bg-green-600/20 border border-green-500/30 text-green-400 py-3 rounded-lg font-medium hover:bg-green-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                    style={{ fontSize: '14px' }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Invite Members
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAllianceFeaturesInfo(true)}
                    className="w-full bg-blue-600/20 border border-blue-500/30 text-blue-400 py-3 rounded-lg font-medium hover:bg-blue-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                    style={{ fontSize: '14px' }}
                  >
                    <Info className="w-4 h-4" />
                    View Alliance Features
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLeaveAlliance}
                    className="w-full bg-red-600/20 border border-red-500/30 text-red-400 py-3 rounded-lg font-medium hover:bg-red-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                    style={{ fontSize: '14px' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Leave Alliance
                  </motion.button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <UserPlus className="w-5 h-5" />
              Invite Members
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Share your alliance code or link to invite new members
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Alliance Code */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Alliance Code</label>
              <div className="flex gap-2">
                <Input
                  value={currentAllianceCode}
                  readOnly
                  className="flex-1 bg-gray-800/50 border-gray-600 text-white font-mono text-center tracking-widest"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopyToClipboard(currentAllianceCode, 'code')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {copiedItem === 'code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            {/* Invite Link */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Invite Link</label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-gray-800/50 border-gray-600 text-white text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopyToClipboard(inviteLink, 'link')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {copiedItem === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleCopyToClipboard(inviteLink, 'link');
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alliance Requests Modal */}
      <Dialog open={showRequestsModal} onOpenChange={setShowRequestsModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <UserPlus className="w-5 h-5" />
              Alliance Requests ({pendingRequests.length})
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Review and manage join requests to your alliance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No pending requests</p>
                <p className="text-gray-500 text-sm mt-1">New join requests will appear here</p>
              </div>
            ) : (
              pendingRequests.map((request) => {
                const timeAgo = () => {
                  const now = new Date();
                  const diff = now.getTime() - request.requestedAt.getTime();
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const days = Math.floor(hours / 24);
                  
                  if (days > 0) return `${days}d ago`;
                  if (hours > 0) return `${hours}h ago`;
                  return 'Just now';
                };

                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-xl p-4"
                  >
                    {/* User Info */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                        {request.userAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold">{request.userName}</span>
                          <span className="text-gray-500 text-xs">{timeAgo()}</span>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1 text-purple-400">
                            <Star className="w-3 h-3" />
                            <span>Lvl {request.userLevel}</span>
                          </div>
                          <div className="flex items-center gap-1 text-orange-400">
                            <Flame className="w-3 h-3" />
                            <span>{request.userStreak} day streak</span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Zap className="w-3 h-3" />
                            <span>{request.userXP} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    {request.message && (
                      <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-3 mb-3">
                        <p className="text-gray-300 text-sm italic">&ldquo;{request.message}&rdquo;</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setPendingRequests(prev => prev.filter(r => r.id !== request.id));
                          setShowConfetti(true);
                          setTimeout(() => setShowConfetti(false), 3000);
                        }}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg font-medium hover:from-green-500 hover:to-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setPendingRequests(prev => prev.filter(r => r.id !== request.id));
                        }}
                        className="flex-1 bg-gray-800/50 border border-gray-600 text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <Button
              onClick={() => setShowRequestsModal(false)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alliance Chat Modal */}
      <Dialog open={showAllianceChat} onOpenChange={setShowAllianceChat}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Alliance Chat
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Chat with The Grind Squad members
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 h-64 overflow-y-auto space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-sm">
                  ��
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">Alex</span>
                    <span className="text-gray-500 text-xs">10:23 AM</span>
                  </div>
                  <p className="text-gray-300 text-sm">Just crushed my morning workout! Who's joining me tomorrow?</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-sm">
                  🌟
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">Maya</span>
                    <span className="text-gray-500 text-xs">10:45 AM</span>
                  </div>
                  <p className="text-gray-300 text-sm">Count me in! Let's make it a challenge 💪</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-sm">
                  🔥
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">You</span>
                    <span className="text-gray-500 text-xs">11:02 AM</span>
                  </div>
                  <p className="text-gray-300 text-sm">I'm in! What time are we thinking?</p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-lg text-sm focus:border-purple-500/50 focus:outline-none transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 1-on-1 Challenge AI Modal */}
      <Dialog open={show1on1Modal} onOpenChange={setShow1on1Modal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Swords className="w-5 h-5" />
              Create 1-on-1 Challenge
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              AI-powered custom challenge generator
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* AI Chat Messages */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
              {aiMessages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${
                  message.id.startsWith('user-') ? 'flex-row-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    message.id.startsWith('user-') 
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    {message.id.startsWith('user-') ? '🔥' : '🤖'}
                  </div>
                  <div className={`flex-1 ${message.id.startsWith('user-') ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg text-sm ${
                      message.id.startsWith('user-')
                        ? 'bg-orange-600/20 text-orange-100 ml-8'
                        : 'bg-purple-600/20 text-purple-100 mr-8'
                    }`}>
                      {message.content}
                    </div>
                    
                    {/* Challenge Suggestion */}
                    {message.type === 'challenge-suggestion' && message.challenge && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg mr-8"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 font-medium">{message.challenge.title}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            message.challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                            message.challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            message.challenge.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {message.challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{message.challenge.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="text-xs text-purple-400 font-medium">Daily Tasks:</div>
                          {message.challenge.tasks.map((task, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-gray-300">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                              {task}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>7 days</span>
                            <div className="flex items-center gap-1">
                              <Coins className="w-3 h-3 text-yellow-400" />
                              <span className="text-yellow-400">{message.challenge.wagerXP} XP</span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSendChallenge}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                          >
                            Send Challenge
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400">Quick responses:</div>
              <div className="flex flex-wrap gap-2">
                {getQuickPrompts().map((prompt, index) => (
                  <motion.button
                    key={`quick-prompt-${conversationStep}-${prompt}-${index}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="bg-gray-700/50 hover:bg-purple-600/20 text-gray-300 hover:text-purple-300 px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-gray-600/50 hover:border-purple-500/30"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-lg text-sm focus:border-purple-500/50 focus:outline-none transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && aiInput.trim() && handleAIResponse(aiInput.trim())}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => aiInput.trim() && handleAIResponse(aiInput.trim())}
                disabled={!aiInput.trim()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Modal */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Hash className="w-5 h-5" />
              Join Alliance
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter an alliance invitation code to request membership
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Alliance Code</label>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter alliance code (e.g. GHO123)"
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 text-center font-mono tracking-widest"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowJoinModal(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinWithCode}
                disabled={!joinCode.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                Request to Join
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Alliance Modal */}
      <CreateAllianceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateAlliance={handleCreateAlliance}
      />

      {/* Alliance Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Crown className="w-5 h-5" />
              The Grind Squad Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/30 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-white">4,290</div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>
              <div className="bg-gray-800/30 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-white">#47</div>
                <div className="text-sm text-gray-400">Global Rank</div>
              </div>
              <div className="bg-gray-800/30 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-white">3/4</div>
                <div className="text-sm text-gray-400">Members</div>
              </div>
              <div className="bg-gray-800/30 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-white">11</div>
                <div className="text-sm text-gray-400">Avg Level</div>
              </div>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Alliance Motto</h4>
              <p className="text-gray-300 italic text-sm">
                "{allianceMotto}"
              </p>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Recent Achievements</h4>
              <div className="space-y-2">
                {generateRecentAchievements().map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    {achievement.icon}
                    {achievement.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alliance Settings Modal */}
      <Dialog open={showAllianceSettings} onOpenChange={setShowAllianceSettings}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Settings className="w-5 h-5" />
              Alliance Settings
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage your alliance preferences and settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Alliance Motto */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm text-gray-400">Alliance Motto</label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingMotto(!editingMotto)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </motion.button>
              </div>
              
              {editingMotto ? (
                <div className="space-y-2">
                  <textarea
                    value={mottoInput}
                    onChange={(e) => setMottoInput(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-lg text-sm resize-none"
                    rows={3}
                    placeholder="Enter your alliance motto..."
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveMotto}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      style={{ fontSize: '14px' }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingMotto(false);
                        setMottoInput(allianceMotto);
                      }}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                      style={{ fontSize: '14px' }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-300 text-sm italic">"{allianceMotto}"</p>
                </div>
              )}
            </div>

            {/* Alliance Actions */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Alliance Actions</h4>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLeaveAlliance}
                className="w-full bg-red-600/20 border border-red-500/30 text-red-400 py-3 rounded-lg font-medium hover:bg-red-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                style={{ fontSize: '14px' }}
              >
                <LogOut className="w-4 h-4" />
                Leave Alliance
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-orange-600/20 border border-orange-500/30 text-orange-400 py-3 rounded-lg font-medium hover:bg-orange-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                style={{ fontSize: '14px' }}
              >
                <AlertTriangle className="w-4 h-4" />
                Disband Alliance
              </motion.button>
            </div>

            <Button
              onClick={() => setShowAllianceSettings(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Challenge Notification Modal */}
      <Dialog open={showChallengeNotification} onOpenChange={setShowChallengeNotification}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Swords className="w-5 h-5" />
              Challenge Received!
            </DialogTitle>
          </DialogHeader>
          
          {pendingNotification && (
            <div className="space-y-6">
              {/* Challenger Info */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto shadow-lg shadow-purple-500/30">
                  {pendingNotification.challengerAvatar}
                </div>
                <h3 className="text-white font-bold text-lg">{pendingNotification.challengerName} challenged you!</h3>
                <p className="text-gray-400 text-sm mt-1">{pendingNotification.challengeTitle}</p>
              </div>

              {/* Challenge Preview */}
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Swords className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 font-medium">{pendingNotification.challenge.challengeTitle}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{pendingNotification.challenge.challengeDescription}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>7-day challenge</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400">{pendingNotification.challenge.wagerXP} XP at stake</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleViewChallengeDetails}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  View Details
                </Button>
                <Button
                  onClick={() => {
                    setShowChallengeNotification(false);
                    setShowChallengeConfirmation(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                >
                  Accept
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Challenge Details Modal */}
      <Dialog open={showChallengeDetails} onOpenChange={setShowChallengeDetails}>
        <DialogContent className="bg-gray-900 border-purple-500/40 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Calendar className="w-5 h-5" />
              Challenge Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedChallenge?.challengeTitle}
            </DialogDescription>
          </DialogHeader>
          
          {selectedChallenge && (
            <div className="space-y-4">
              {/* Challenge Overview */}
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-purple-500/30 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-3">{selectedChallenge.challengeDescription}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Duration: 7 days</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400">{selectedChallenge.wagerXP} XP wager</span>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              {selectedChallenge.status === 'pending' && (
                <div className="bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-gray-900/40 border border-amber-500/40 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-amber-300 font-bold text-sm mb-1">Important Notice</h4>
                      <p className="text-amber-200/90 text-xs leading-relaxed">
                        Once you start this 7-day challenge, you cannot stop until it's over. Missing a day will cost you the XP wager!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 7-Day Breakdown */}
              <div className="space-y-3">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Timer className="w-4 h-4 text-purple-400" />
                  7-Day Challenge Breakdown
                </h4>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {selectedChallenge.tasks.map((task, index) => (
                    <div key={index} className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {task.day}
                        </div>
                        <span className="text-white font-medium text-sm">{task.task}</span>
                      </div>
                      <p className="text-gray-400 text-xs ml-9">{task.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowChallengeDetails(false)}
                  className="flex-1 border border-gray-700 text-gray-400 hover:bg-gray-800/50 hover:text-gray-300"
                >
                  Close
                </Button>
                {selectedChallenge.status === 'pending' && (
                  <Button
                    onClick={() => {
                      setShowChallengeDetails(false);
                      setShowChallengeConfirmation(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                  >
                    Accept
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Challenge Confirmation Modal */}
      <Dialog open={showChallengeConfirmation} onOpenChange={setShowChallengeConfirmation}>
        <DialogContent className="bg-gray-900 border-amber-500/40 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              Are you sure?
            </DialogTitle>
            <DialogDescription className="text-amber-200/90">
              Please review the challenge details before confirming.
            </DialogDescription>
          </DialogHeader>
          
          {selectedChallenge && (
            <div className="space-y-4">
              {/* Warning Message */}
              <div className="bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-gray-900/40 border border-amber-500/40 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-amber-300 font-bold text-sm mb-1">Important Notice</h4>
                    <p className="text-amber-200/90 text-xs leading-relaxed">
                      Once you start this 7-day challenge, you cannot stop until it's over. Missing a day will cost you the XP wager!
                    </p>
                  </div>
                </div>
              </div>

              {/* Challenge Info */}
              <div className="bg-gray-800/60 border border-gray-700/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">{selectedChallenge.challengeTitle}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Duration: 7 days</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400">{selectedChallenge.wagerXP} XP wager</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowChallengeConfirmation(false)}
                  className="flex-1 border border-gray-700 text-gray-400 hover:bg-gray-800/50 hover:text-gray-300"
                >
                  No
                </Button>
                <Button
                  onClick={() => {
                    handleAcceptChallenge();
                    setShowChallengeConfirmation(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                >
                  Yes, Start Challenge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Today's Task Modal (Simplified) */}
      <Dialog open={showTodayTaskModal} onOpenChange={setShowTodayTaskModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Calendar className="w-5 h-5" />
              Today's Task
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedChallenge?.challengeDescription}
            </DialogDescription>
          </DialogHeader>
          
          {selectedChallenge && (
            <div className="space-y-4">
              {/* Challenge Info */}
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Duration: 7 days</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">{selectedChallenge.wagerXP} XP wager</span>
                  </div>
                </div>
              </div>

              {/* Today's Task Section */}
              <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/60 to-gray-900/80 border border-purple-500/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center"
                    >
                      <Clock className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Today's Task</h4>
                      <p className="text-xs text-gray-400">Day 3 Challenge</p>
                    </div>
                  </div>
                  
                  {/* Countdown Timer */}
                  <div className="text-right">
                    <div className={`text-xs font-medium ${dayMissed ? 'text-red-400' : 'text-purple-300'}`}>
                      {dayMissed ? 'Time expired' : 'Time left:'}
                    </div>
                    <div className={`font-bold ${dayMissed ? 'text-red-500' : 'text-white'}`}>
                      {dayMissed ? '0h 0m' : `${timeRemaining.hours}h ${timeRemaining.minutes}m`}
                    </div>
                  </div>
                </div>

                {/* Task with Check-off Button */}
                <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={!dayMissed && !todayTaskCompleted ? { scale: 1.1 } : {}}
                      whileTap={!dayMissed && !todayTaskCompleted ? { scale: 0.9 } : {}}
                      onClick={handleTaskComplete}
                      disabled={dayMissed || todayTaskCompleted}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        todayTaskCompleted
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-green-400 shadow-lg shadow-green-500/50'
                          : dayMissed
                          ? 'bg-gray-700/50 border-2 border-gray-600 cursor-not-allowed'
                          : 'bg-gray-700/50 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-600/20 cursor-pointer'
                      }`}
                    >
                      <AnimatePresence>
                        {todayTaskCompleted ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          >
                            <Check className="w-6 h-6 text-white" />
                          </motion.div>
                        ) : dayMissed ? (
                          <X className="w-5 h-5 text-gray-500" />
                        ) : null}
                      </AnimatePresence>
                    </motion.button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${todayTaskCompleted ? 'text-green-400' : 'text-white'}`}>
                          {selectedChallenge.tasks[2]?.task || "Complete today's challenge"}
                        </span>
                        {showTaskSuccess && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            className="text-green-400"
                          >
                            ✨
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {selectedChallenge.tasks[2]?.description || "Click the checkbox to mark complete"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Messages */}
                <AnimatePresence>
                  {dayMissed && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-300 font-medium">Day missed - Task no longer available</span>
                    </motion.div>
                  )}
                  
                  {todayTaskCompleted && !dayMissed && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-500/20 border border-green-500/30 rounded-lg p-2 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-300 font-medium">Task completed! Great work! 🎉</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 1-on-1 Battle Info Modal */}
      <Dialog open={show1on1InfoModal} onOpenChange={setShow1on1InfoModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Swords className="w-5 h-5" />
              How 1-on-1 Battles Work
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Challenge your alliance members to epic 7-day duels
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {/* Battle Overview */}
            <div className="bg-gradient-to-br from-purple-900/30 to-gray-800/40 border border-purple-500/30 rounded-lg p-3">
              <h4 className="text-white font-bold mb-2 flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-purple-400" />
                The Challenge
              </h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                1-on-1 battles are 7-day challenges between you and an alliance member. Each day has a specific task 
                to complete. Complete more tasks than your opponent to win the XP wager!
              </p>
            </div>

            {/* How It Works Steps */}
            <div className="space-y-2">
              <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-cyan-400" />
                How It Works
              </h4>
              
              <div className="space-y-2">
                {[
                  {
                    step: 1,
                    title: "Create Challenge",
                    description: "Use the AI coach to create a custom 7-day challenge or choose from templates",
                    icon: <Bot className="w-4 h-4 text-purple-400" />
                  },
                  {
                    step: 2,
                    title: "Set the Wager",
                    description: "Both players wager XP - winner takes all, loser loses their wager",
                    icon: <Coins className="w-4 h-4 text-yellow-400" />
                  },
                  {
                    step: 3,
                    title: "Complete Daily Tasks",
                    description: "Each day for 7 days, complete that day's task before midnight",
                    icon: <Calendar className="w-4 h-4 text-blue-400" />
                  },
                  {
                    step: 4,
                    title: "Win the Battle",
                    description: "Complete more tasks than your opponent to win the wager and earn bragging rights",
                    icon: <Trophy className="w-4 h-4 text-green-400" />
                  }
                ].map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-2.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {step.icon}
                          <span className="text-white font-medium text-xs">{step.title}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-lg p-2.5">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <div className="text-cyan-300 font-bold mb-1">Pro Tip</div>
                  <p className="text-gray-300 leading-relaxed">
                    Check off your task as soon as you complete it each day! Missing a day means you lose that point, 
                    so consistency is key to winning battles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-3">
            <Button
              onClick={() => setShow1on1InfoModal(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium"
            >
              Got It!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alliance Features Info Modal */}
      <Dialog open={showAllianceFeaturesInfo} onOpenChange={setShowAllianceFeaturesInfo}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Crown className="w-5 h-5" />
              Alliance Features
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Everything you get with alliance membership
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {[
              {
                icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
                title: "Alliance Chat",
                description: "Real-time communication with your alliance members",
                unlocked: true
              },
              {
                icon: <Swords className="w-5 h-5 text-purple-400" />,
                title: "1-on-1 Challenges",
                description: "Epic duels with AI-generated custom challenges",
                unlocked: true
              },
              {
                icon: <Users className="w-5 h-5 text-green-400" />,
                title: "Group Accountability",
                description: "Share progress and motivate each other daily",
                unlocked: true
              },
              {
                icon: <Trophy className="w-5 h-5 text-yellow-400" />,
                title: "Alliance Rankings",
                description: "Compete against other alliances globally",
                unlocked: true
              },
              {
                icon: <Target className="w-5 h-5 text-orange-400" />,
                title: "Group Challenges",
                description: "Weekly alliance-wide competitions",
                unlocked: true
              },
              {
                icon: <Share2 className="w-5 h-5 text-cyan-400" />,
                title: "Habit Sharing",
                description: "View and get inspired by member habits",
                unlocked: true
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                  feature.unlocked 
                    ? 'bg-gray-800/40 border-gray-700/30' 
                    : 'bg-gray-800/20 border-gray-700/20 opacity-60'
                }`}
              >
                <div className={`${feature.unlocked ? '' : 'grayscale'}`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${feature.unlocked ? 'text-white' : 'text-gray-400'}`}>
                      {feature.title}
                    </span>
                    {!feature.unlocked && (
                      <span className="bg-gray-600/30 text-gray-400 px-2 py-1 rounded text-xs">
                        Level {feature.title.includes('XP') ? '10' : '15'}+
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${feature.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                    {feature.description}
                  </p>
                </div>
                {feature.unlocked && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={() => setShowAllianceFeaturesInfo(false)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Got it!
          </Button>
        </DialogContent>
      </Dialog>

      {/* Battle History Modal */}
      <Dialog open={showBattleHistoryModal} onOpenChange={setShowBattleHistoryModal}>
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              <Swords className="w-6 h-6 text-purple-400" />
              Battle History vs {selectedBattleRecord?.opponentName}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Complete history of all 1-on-1 battles between you and {selectedBattleRecord?.opponentName}
            </DialogDescription>
          </DialogHeader>

          {selectedBattleRecord && (
            <div className="space-y-6">
              {/* Overall Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{selectedBattleRecord.wins}</div>
                  <div className="text-xs text-gray-400">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{selectedBattleRecord.losses}</div>
                  <div className="text-xs text-gray-400">Losses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{selectedBattleRecord.winRate}%</div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
              </div>

              {/* Current Streak */}
              <div className={`p-4 rounded-lg border ${ 
                selectedBattleRecord.streakType === 'win' 
                  ? 'bg-green-500/20 border-green-500/30' 
                  : 'bg-red-500/20 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className={`w-5 h-5 ${selectedBattleRecord.streakType === 'win' ? 'text-green-400' : 'text-red-400'}`} />
                  <span className="text-white font-bold">Current Streak</span>
                </div>
                <div className={`text-lg font-bold ${selectedBattleRecord.streakType === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedBattleRecord.currentStreak} {selectedBattleRecord.streakType} streak
                </div>
              </div>

              {/* Recent Battle */}
              <div className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-bold">Most Recent Battle</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Challenge:</span>
                    <span className="text-white">{selectedBattleRecord.lastChallenge?.challengeType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Result:</span>
                    <span className={`font-medium ${
                      selectedBattleRecord.lastChallenge?.result === 'win' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedBattleRecord.lastChallenge?.result === 'win' ? 'Victory' : 'Defeat'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{selectedBattleRecord.lastChallenge?.date}</span>
                  </div>
                </div>
              </div>

              {/* Battle Tips */}
              <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-bold">Battle Insights</span>
                </div>
                <div className="text-sm text-gray-300">
                  {selectedBattleRecord.winRate >= 70 ? (
                    "You're dominating this matchup! Keep up the excellent performance."
                  ) : selectedBattleRecord.winRate >= 50 ? (
                    "This is a close rivalry. Every battle counts!"
                  ) : (
                    "Time to step up your game. Study their patterns and come back stronger!"
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => setShowBattleHistoryModal(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Demo Challenge Notification Button */}
      {isInAlliance && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          onClick={handleShowChallengeNotification}
          className="fixed bottom-32 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 z-50"
        >
          📢 Demo: Maya Challenge
        </motion.button>
      )}

      {/* Confetti */}
      <ConfettiEffect
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  );
}