import { motion } from 'motion/react';

interface FuturisticBadgeProps {
  size?: number;
  className?: string;
  animate?: boolean;
  variant?: 'champion' | 'master' | 'legend' | 'cosmic';
}

export function FuturisticBadge({ 
  size = 80, 
  className = "",
  animate = true,
  variant = 'champion'
}: FuturisticBadgeProps) {
  
  const getVariantConfig = () => {
    switch (variant) {
      case 'cosmic':
        return {
          outerRing: "#8B5CF6",
          middleRing: "#A855F7", 
          innerGlow: "#C084FC",
          coreStart: "#FFFFFF",
          coreEnd: "#E0E7FF",
          accent: "#F3E8FF",
          pulseColor: "rgba(139,92,246,0.8)",
          symbol: "⬟"
        };
      case 'legend':
        return {
          outerRing: "#FBBF24",
          middleRing: "#F59E0B",
          innerGlow: "#FCD34D", 
          coreStart: "#FFFFFF",
          coreEnd: "#FEF3C7",
          accent: "#FFFBEB",
          pulseColor: "rgba(251,191,36,0.8)",
          symbol: "⬢"
        };
      case 'master':
        return {
          outerRing: "#10B981",
          middleRing: "#059669",
          innerGlow: "#34D399",
          coreStart: "#FFFFFF", 
          coreEnd: "#D1FAE5",
          accent: "#ECFDF5",
          pulseColor: "rgba(16,185,129,0.8)",
          symbol: "⬠"
        };
      case 'champion':
      default:
        return {
          outerRing: "#8B5CF6",
          middleRing: "#7C3AED",
          innerGlow: "#A855F7",
          coreStart: "#FFFFFF",
          coreEnd: "#EDE9FE", 
          accent: "#F5F3FF",
          pulseColor: "rgba(139,92,246,0.8)",
          symbol: "⬡"
        };
    }
  };

  const config = getVariantConfig();

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className} cursor-pointer`}
      animate={animate ? {
        scale: [1, 1.02, 1],
        y: [0, -1, 0]
      } : undefined}
      whileHover={{
        scale: 1.08,
        y: -3,
        transition: { duration: 0.2 }
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ 
        width: size, 
        height: size,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-60"
        animate={animate ? {
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        } : undefined}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: `radial-gradient(circle, ${config.pulseColor} 0%, transparent 70%)`,
          filter: "blur(8px)"
        }}
      />

      {/* Main Badge */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Outer Geometric Ring */}
        <motion.path
          d="M50 5L65 15L75 35L65 55L50 65L35 55L25 35L35 15L50 5Z"
          stroke={config.outerRing}
          strokeWidth="3"
          fill="none"
          opacity="0.8"
          animate={animate ? {
            opacity: [0.6, 0.9, 0.6],
            strokeWidth: [2.5, 3.5, 2.5]
          } : undefined}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Middle Ring */}
        <circle
          cx="50"
          cy="50"
          r="25"
          stroke={config.middleRing}
          strokeWidth="2"
          fill="url(#badgeGradient)"
          opacity="0.9"
        />
        
        {/* Inner Core */}
        <circle
          cx="50"
          cy="50"
          r="18"
          fill="url(#coreGradient)"
          opacity="0.95"
        />

        {/* Energy Lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.line
            key={i}
            x1="50"
            y1="32"
            x2="50"
            y2="28"
            stroke={config.innerGlow}
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
            opacity="0.7"
            animate={animate ? {
              opacity: [0.4, 0.8, 0.4],
              strokeWidth: [1.5, 2, 1.5]
            } : undefined}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Center Symbol */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="20"
          fill={config.accent}
          fontWeight="bold"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
        >
          {config.symbol}
        </text>

        {/* Highlight */}
        <circle
          cx="42"
          cy="42"
          r="3"
          fill="rgba(255,255,255,0.8)"
          opacity="0.6"
        />

        {/* Gradients */}
        <defs>
          <radialGradient id="badgeGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor={config.coreStart} />
            <stop offset="40%" stopColor={config.innerGlow} />
            <stop offset="100%" stopColor={config.middleRing} />
          </radialGradient>
          
          <radialGradient id="coreGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor={config.coreStart} />
            <stop offset="70%" stopColor={config.coreEnd} />
            <stop offset="100%" stopColor={config.innerGlow} />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Floating Particles */}
      {animate && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: config.innerGlow,
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -20, -40]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}