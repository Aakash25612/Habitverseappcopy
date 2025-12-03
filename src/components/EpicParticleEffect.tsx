import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  type: 'orb' | 'streak' | 'sparkle' | 'energy';
}

interface EpicParticleEffectProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high' | 'epic';
}

export function EpicParticleEffect({ isActive, intensity = 'high' }: EpicParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const particleCounts = {
    low: 30,
    medium: 50,
    high: 80,
    epic: 120
  };

  const colors = [
    '#8B5CF6', // Purple
    '#A855F7', // Purple-500
    '#3B82F6', // Blue
    '#06B6D4', // Cyan
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
  ];

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const count = particleCounts[intensity];
    const newParticles: Particle[] = [];

    // Generate diverse particles
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = Math.random() * 8 + 3;
      const types: Array<'orb' | 'streak' | 'sparkle' | 'energy'> = ['orb', 'streak', 'sparkle', 'energy'];
      const typeWeights = [0.3, 0.25, 0.25, 0.2]; // Distribution
      
      let type: 'orb' | 'streak' | 'sparkle' | 'energy';
      const rand = Math.random();
      if (rand < typeWeights[0]) {
        type = 'orb';
      } else if (rand < typeWeights[0] + typeWeights[1]) {
        type = 'streak';
      } else if (rand < typeWeights[0] + typeWeights[1] + typeWeights[2]) {
        type = 'sparkle';
      } else {
        type = 'energy';
      }

      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20, // Start from center with some spread
        y: 50 + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: type === 'streak' ? Math.random() * 3 + 2 : Math.random() * 4 + 3,
        life: 0,
        maxLife: Math.random() * 2000 + 1500, // 1.5-3.5 seconds
        type
      });
    }

    setParticles(newParticles);

    // Animation loop
    const animate = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx * 0.02,
          y: particle.y + particle.vy * 0.02,
          vx: particle.vx * 0.98, // Slight deceleration
          vy: particle.vy * 0.98,
          life: particle.life + 16 // ~60fps
        })).filter(particle => particle.life < particle.maxLife)
      );
    };

    const interval = setInterval(animate, 16);

    // Clean up after particles expire
    const cleanup = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(cleanup);
    };
  }, [isActive, intensity]);

  if (!isActive || particles.length === 0) return null;

  const getParticleStyle = (particle: Particle) => {
    const progress = particle.life / particle.maxLife;
    const opacity = progress < 0.1 ? progress * 10 : progress > 0.8 ? (1 - progress) * 5 : 1;

    switch (particle.type) {
      case 'orb':
        return {
          width: particle.size,
          height: particle.size,
          background: `radial-gradient(circle, ${particle.color}, transparent)`,
          borderRadius: '50%',
          opacity: opacity * 0.8,
          boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
          filter: 'blur(0.5px)'
        };
      
      case 'streak':
        return {
          width: particle.size * 3,
          height: particle.size * 0.5,
          background: `linear-gradient(90deg, ${particle.color}, transparent)`,
          borderRadius: particle.size * 0.25,
          opacity: opacity * 0.7,
          transform: `rotate(${Math.atan2(particle.vy, particle.vx) * 180 / Math.PI}deg)`
        };
      
      case 'sparkle':
        return {
          width: particle.size,
          height: particle.size,
          background: particle.color,
          borderRadius: '50%',
          opacity: opacity,
          boxShadow: `0 0 ${particle.size}px ${particle.color}`,
          animation: `twinkle ${Math.random() * 0.5 + 0.5}s ease-in-out infinite alternate`
        };
      
      case 'energy':
        return {
          width: particle.size * 0.8,
          height: particle.size * 4,
          background: `linear-gradient(to bottom, ${particle.color}, transparent)`,
          borderRadius: particle.size * 0.4,
          opacity: opacity * 0.6,
          transform: `rotate(${Math.random() * 360}deg)`,
          filter: 'blur(1px)'
        };
      
      default:
        return {};
    }
  };

  return (
    <>
      {/* Add twinkle keyframe */}
      <style>{`
        @keyframes twinkle {
          0% { transform: scale(1) rotate(0deg); }
          100% { transform: scale(1.3) rotate(180deg); }
        }
      `}</style>
      
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              ...getParticleStyle(particle)
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Central energy burst */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 2,
            ease: "easeOut"
          }}
          className="absolute left-1/2 top-1/2 w-32 h-32 -ml-16 -mt-16"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.2), transparent)',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }}
        />
        
        {/* Expanding ring effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ 
            scale: [0, 3, 5],
            opacity: [0.8, 0.3, 0]
          }}
          transition={{
            duration: 2.5,
            ease: "easeOut"
          }}
          className="absolute left-1/2 top-1/2 w-4 h-4 -ml-2 -mt-2 border-2 border-purple-400 rounded-full"
        />
        
        {/* Secondary ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ 
            scale: [0, 2, 4],
            opacity: [0.6, 0.2, 0]
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
            delay: 0.3
          }}
          className="absolute left-1/2 top-1/2 w-4 h-4 -ml-2 -mt-2 border border-blue-400 rounded-full"
        />
      </div>
    </>
  );
}