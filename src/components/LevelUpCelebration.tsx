import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { ConfettiEffect } from './ConfettiEffect';
import { Crown, Zap, Trophy, Star, X } from 'lucide-react';

interface LevelUpCelebrationProps {
  isActive: boolean;
  level: number;
  onComplete: () => void;
}

export function LevelUpCelebration({ isActive, level, onComplete }: LevelUpCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationPhase, setCelebrationPhase] = useState<'idle' | 'charge' | 'burst' | 'text' | 'rewards' | 'finale' | 'complete'>('idle');
  const [screenShake, setScreenShake] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Epic multi-phase celebration sequence
      const timeouts = [
        setTimeout(() => setCelebrationPhase('charge'), 100),
        setTimeout(() => {
          setCelebrationPhase('burst');
          setScreenShake(true);
          setShowConfetti(true);
        }, 800),
        setTimeout(() => {
          setCelebrationPhase('text');
          setScreenShake(false);
        }, 1200),
        setTimeout(() => setCelebrationPhase('rewards'), 2000),
        setTimeout(() => setCelebrationPhase('finale'), 3500)
      ];

      return () => timeouts.forEach(clearTimeout);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const handleClose = () => {
    setShowConfetti(false);
    onComplete();
  };

  return (
    <>
      {/* Full Screen Overlay with Epic Effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center ${screenShake ? 'animate-pulse' : ''}`}
        style={{
          background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.9) 0%, rgba(79, 70, 229, 0.8) 40%, rgba(0, 0, 0, 0.95) 100%)'
        }}
      >
        {/* Close Button - appears after finale starts */}
        <AnimatePresence>
          {celebrationPhase === 'finale' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              onClick={handleClose}
              className="absolute top-8 right-8 z-60 bg-white/10 backdrop-blur-lg rounded-full p-3 border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
        {/* Screen Shake Effect */}
        <motion.div
          animate={screenShake ? {
            x: [0, -2, 2, -2, 2, 0],
            y: [0, 2, -2, 2, -2, 0]
          } : {}}
          transition={{ duration: 0.4, repeat: screenShake ? 2 : 0 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Energy Charge Phase */}
          <AnimatePresence>
            {celebrationPhase === 'charge' && (
              <motion.div className="relative">
                {/* Central Energy Orb */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 0.3, 0.8, 1.2, 0.9, 1],
                    opacity: [0, 0.6, 0.8, 1, 1, 1]
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="w-32 h-32 rounded-full relative"
                  style={{
                    background: 'radial-gradient(circle, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                    boxShadow: '0 0 60px rgba(139, 92, 246, 0.8), inset 0 0 40px rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {/* Rotating Energy Rings */}
                  {[0, 1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      animate={{ rotate: 360 }}
                      transition={{ 
                        duration: 1 + ring * 0.3, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      className="absolute inset-0 rounded-full border-2 border-purple-300"
                      style={{
                        transform: `scale(${1 + ring * 0.3})`,
                        borderColor: `rgba(196, 181, 253, ${0.6 - ring * 0.15})`
                      }}
                    />
                  ))}
                  
                  {/* Lightning Bolts */}
                  {[0, 1, 2, 3].map((bolt) => (
                    <motion.div
                      key={bolt}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 0.4,
                        repeat: Infinity,
                        delay: bolt * 0.1,
                        ease: "easeInOut"
                      }}
                      className="absolute"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${bolt * 90}deg) translateY(-60px)`
                      }}
                    >
                      <Zap className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Charging Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-full mt-8 left-1/2 transform -translate-x-1/2 text-center"
                >
                  <div className="text-white/80 text-lg tracking-wide">
                    POWER BUILDING...
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Burst Phase */}
          <AnimatePresence>
            {celebrationPhase === 'burst' && (
              <motion.div className="relative">
                {/* Massive Explosion Effect */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 3, 2] }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-96 h-96 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(139, 92, 246, 0.7) 30%, rgba(79, 70, 229, 0.5) 60%, transparent 100%)',
                    filter: 'blur(2px)'
                  }}
                />

                {/* Shockwave Rings */}
                {[0, 1, 2, 3, 4].map((wave) => (
                  <motion.div
                    key={wave}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ 
                      scale: [0, 4, 6],
                      opacity: [0.8, 0.3, 0]
                    }}
                    transition={{ 
                      duration: 1.2,
                      delay: wave * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 rounded-full border-4 border-purple-300"
                    style={{
                      transform: 'translate(-50%, -50%)',
                      top: '50%',
                      left: '50%'
                    }}
                  />
                ))}

                {/* Star Explosion Particles */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0.5],
                      opacity: [0, 1, 0],
                      x: [0, Math.cos(i * 30 * Math.PI / 180) * 200],
                      y: [0, Math.sin(i * 30 * Math.PI / 180) * 200]
                    }}
                    transition={{ 
                      duration: 1,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2"
                    style={{ transform: 'translate(-50%, -50%)' }}
                  >
                    <Star className="w-8 h-8 text-yellow-300" fill="currentColor" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Organized Layout from Top to Bottom */}
          <div className="absolute inset-0 flex flex-col justify-between py-16 px-8">
            
            {/* TOP SECTION: Level Up + Legendary Warrior */}
            <AnimatePresence>
              {(celebrationPhase === 'text' || celebrationPhase === 'rewards' || celebrationPhase === 'finale') && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: 0.6
                  }}
                  className="text-center"
                >
                  {/* LEVEL UP Text */}
                  <motion.h1
                    animate={{ 
                      textShadow: [
                        '0 0 20px rgba(139, 92, 246, 0.8)',
                        '0 0 40px rgba(139, 92, 246, 1)',
                        '0 0 20px rgba(139, 92, 246, 0.8)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl md:text-6xl font-bold text-white tracking-wider mb-4"
                    style={{
                      background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    LEVEL UP!
                  </motion.h1>
                  
                  {/* Level Number with Crown */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                    className="flex items-center justify-center gap-4 mb-6"
                  >
                    <Crown className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" fill="currentColor" />
                    <span className="text-6xl md:text-7xl font-bold text-white">{level}</span>
                    <Crown className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" fill="currentColor" />
                  </motion.div>

                  {/* Legendary Warrior */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl md:text-2xl text-purple-200 tracking-wide"
                  >
                    🔥 LEGENDARY WARRIOR 🔥
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MIDDLE SECTION: Rewards Unlocked */}
            <AnimatePresence>
              {(celebrationPhase === 'rewards' || celebrationPhase === 'finale') && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center space-y-6"
                >
                  {/* Rewards Section */}
                  <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-lg rounded-2xl px-6 py-6 md:px-8 border border-purple-400/30 max-w-sm mx-auto">
                    <div className="text-yellow-400 mb-4 flex items-center justify-center gap-2">
                      <Trophy className="w-6 h-6" />
                      <span className="font-bold text-lg">REWARDS UNLOCKED</span>
                      <Trophy className="w-6 h-6" />
                    </div>
                    
                    <div className="text-white space-y-2 text-sm md:text-base">
                      <div>✨ +50 XP Bonus</div>
                      <div>🎯 New Challenges Available</div>
                      <div>👑 Elite Status Unlocked</div>
                    </div>
                  </div>

                  {/* Keep Crushing It Message - Right after rewards */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="space-y-3"
                  >
                    <div className="text-white text-lg md:text-xl font-bold tracking-wide">
                      KEEP CRUSHING IT, CHAMPION! 🚀
                    </div>
                    
                    <div className="text-purple-200 text-base md:text-lg">
                      👑 Elite Status Unlocked
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BOTTOM SECTION: Close Instructions Only */}
            <AnimatePresence>
              {celebrationPhase === 'finale' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-center"
                >
                  <div className="text-white/60 text-sm md:text-base">
                    Tap the X to close
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Golden Sparkles Rain (background effect) */}
            <AnimatePresence>
              {celebrationPhase === 'finale' && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        y: -50,
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                        opacity: 0,
                        scale: 0
                      }}
                      animate={{ 
                        y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1, 1, 0],
                        rotate: [0, 360]
                      }}
                      transition={{ 
                        duration: 3,
                        delay: i * 0.1,
                        ease: "linear"
                      }}
                      className="absolute"
                    >
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Confetti */}
      <ConfettiEffect 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)}
      />
    </>
  );
}