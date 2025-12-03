import { motion } from 'motion/react';

interface FuturisticXPIconProps {
  size?: number;
  className?: string;
  animate?: boolean;
  intensity?: 'low' | 'medium' | 'high' | 'epic';
}

export function FuturisticXPIcon({ 
  size = 24, 
  className = "",
  animate = true,
  intensity = 'medium'
}: FuturisticXPIconProps) {
  const getAnimationProps = () => {
    switch (intensity) {
      case 'epic':
        return {
          scale: [1, 1.05, 1],
          filter: [
            "drop-shadow(0 0 10px rgba(139,92,246,0.6)) drop-shadow(0 0 20px rgba(168,85,247,0.4))",
            "drop-shadow(0 0 25px rgba(139,92,246,1)) drop-shadow(0 0 50px rgba(168,85,247,0.8))",
            "drop-shadow(0 0 10px rgba(139,92,246,0.6)) drop-shadow(0 0 20px rgba(168,85,247,0.4))"
          ],
          duration: 2
        };
      case 'high':
        return {
          scale: [1, 1.03, 1],
          filter: [
            "drop-shadow(0 0 8px rgba(139,92,246,0.5))",
            "drop-shadow(0 0 20px rgba(139,92,246,0.8))",
            "drop-shadow(0 0 8px rgba(139,92,246,0.5))"
          ],
          duration: 2.5
        };
      case 'medium':
        return {
          scale: [1, 1.02, 1],
          filter: [
            "drop-shadow(0 0 6px rgba(139,92,246,0.4))",
            "drop-shadow(0 0 15px rgba(139,92,246,0.6))",
            "drop-shadow(0 0 6px rgba(139,92,246,0.4))"
          ],
          duration: 3
        };
      case 'low':
        return {
          scale: [1, 1.01, 1],
          duration: 4
        };
      default:
        return { scale: [1, 1.01, 1], duration: 3 };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className} cursor-pointer`}
      animate={animate ? animationProps : undefined}
      whileHover={{
        scale: 1.1,
        filter: "drop-shadow(0 0 20px rgba(139,92,246,0.8))",
        y: -2
      }}
      transition={{
        duration: animationProps.duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ring */}
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        
        {/* Inner Hexagon */}
        <path
          d="M16 4L24 9V23L16 28L8 23V9L16 4Z"
          fill="url(#gradient2)"
          stroke="url(#gradient3)"
          strokeWidth="1.5"
          opacity="0.9"
        />
        
        {/* Center Crystal */}
        <path
          d="M16 8L20 12V20L16 24L12 20V12L16 8Z"
          fill="url(#gradient4)"
          opacity="0.8"
        />
        
        {/* Energy Core */}
        <circle
          cx="16"
          cy="16"
          r="3"
          fill="url(#gradient5)"
          opacity="0.9"
        />
        
        {/* Highlight */}
        <circle
          cx="14"
          cy="13"
          r="1.5"
          fill="rgba(255,255,255,0.6)"
          opacity="0.8"
        />
        
        {/* XP Text */}
        <text
          x="16"
          y="30"
          textAnchor="middle"
          fontSize="4"
          fill="url(#gradient6)"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          XP
        </text>

        {/* Gradients */}
        <defs>
          {/* Outer ring gradient */}
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          
          {/* Hexagon gradient */}
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          
          {/* Hexagon stroke */}
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          
          {/* Crystal gradient */}
          <radialGradient id="gradient4" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="50%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </radialGradient>
          
          {/* Core gradient */}
          <radialGradient id="gradient5" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E0E7FF" />
            <stop offset="100%" stopColor="#A855F7" />
          </radialGradient>
          
          {/* Text gradient */}
          <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}