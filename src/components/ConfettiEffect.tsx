import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  shape: 'circle' | 'rectangle' | 'star';
  gravity: number;
  drag: number;
  lifespan: number;
  depth: 'near' | 'far';
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifespan: number;
}

interface ConfettiEffectProps {
  isActive: boolean;
  onComplete: () => void;
  buttonRef?: React.RefObject<HTMLDivElement>;
  intensity?: 'low' | 'medium' | 'high';
  triggerElement?: HTMLElement | null;
}

export function ConfettiEffect({ isActive, onComplete, buttonRef, intensity = 'medium', triggerElement }: ConfettiEffectProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [originPosition, setOriginPosition] = useState({ x: 50, y: 40 });

  // Modern, theme-safe colors
  const colors = ['#7A3CFF', '#B07CFF', '#F6C348', '#3DD2C2', '#8B5CF6', '#A855F7'];

  useEffect(() => {
    if (isActive) {
      // Get origin position from trigger element or default
      if (triggerElement) {
        const rect = triggerElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setOriginPosition({
          x: (centerX / window.innerWidth) * 100,
          y: (centerY / window.innerHeight) * 100
        });
      } else if (buttonRef?.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const topY = rect.top;
        setOriginPosition({
          x: (centerX / window.innerWidth) * 100,
          y: (topY / window.innerHeight) * 100
        });
      }

      // Generate confetti based on intensity
      const particleCount = intensity === 'low' ? 15 : intensity === 'medium' ? 50 : 200;
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < particleCount; i++) {
        const spreadDegrees = intensity === 'low' ? 30 : intensity === 'medium' ? 45 : 55;
        const spread = spreadDegrees * (Math.PI / 180);
        const angle = -Math.PI/2 + (Math.random() - 0.5) * spread;
        const baseVelocity = intensity === 'low' ? 8 : intensity === 'medium' ? 12 : 15;
        const velocityRange = intensity === 'low' ? 8 : intensity === 'medium' ? 15 : 25;
        const velocity = Math.random() * velocityRange + baseVelocity;
        const shapes = ['rectangle', 'circle', 'star'] as const;
        const shapeWeights = [0.6, 0.25, 0.15]; // 60% rectangles, 25% circles, 15% stars
        
        let shape: 'rectangle' | 'circle' | 'star';
        const rand = Math.random();
        if (rand < shapeWeights[0]) {
          shape = 'rectangle';
        } else if (rand < shapeWeights[0] + shapeWeights[1]) {
          shape = 'circle';
        } else {
          shape = 'star';
        }

        pieces.push({
          id: i,
          x: originPosition.x + (Math.random() - 0.5) * 8, // Small spread at origin
          y: originPosition.y + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * velocity * (0.8 + Math.random() * 0.4),
          vy: Math.sin(angle) * velocity * (0.8 + Math.random() * 0.4),
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          size: intensity === 'low' 
            ? (shape === 'rectangle' ? Math.random() * 1.5 + 1 : Math.random() * 1 + 1.5)
            : intensity === 'medium'
            ? (shape === 'rectangle' ? Math.random() * 2 + 1.5 : Math.random() * 1.5 + 2)
            : (shape === 'rectangle' ? Math.random() * 3 + 2 : Math.random() * 2 + 3),
          shape,
          gravity: intensity === 'low' ? 1.5 : intensity === 'medium' ? 1.2 : 0.8,
          drag: intensity === 'low' ? 0.12 : intensity === 'medium' ? 0.10 : 0.06,
          lifespan: intensity === 'low' ? Math.random() * 200 + 400 : intensity === 'medium' ? Math.random() * 300 + 600 : Math.random() * 400 + 800, // Much quicker
          depth: Math.random() > 0.6 ? 'far' : 'near' // 40% far, 60% near
        });
      }
      setConfetti(pieces);

      // Generate quick trailing bursts for more realistic effect
      let trailingCount = 0;
      const maxTrailing = intensity === 'low' ? 1 : intensity === 'medium' ? 2 : 3;
      const trailingInterval = setInterval(() => {
        if (trailingCount >= maxTrailing) {
          clearInterval(trailingInterval);
          return;
        }
        
        const trailingPieces: ConfettiPiece[] = [];
        const burstSize = intensity === 'low' ? 5 : intensity === 'medium' ? 8 : 12;
        
        for (let i = 0; i < burstSize; i++) {
          const spread = (intensity === 'low' ? 25 : intensity === 'medium' ? 35 : 45) * (Math.PI / 180);
          const angle = -Math.PI/2 + (Math.random() - 0.5) * spread;
          const velocity = intensity === 'low' ? Math.random() * 8 + 6 : intensity === 'medium' ? Math.random() * 12 + 8 : Math.random() * 16 + 10;
          
          trailingPieces.push({
            id: Date.now() + i + trailingCount * 1000,
            x: originPosition.x + (Math.random() - 0.5) * 4,
            y: originPosition.y + (Math.random() - 0.5) * 2,
            vx: Math.cos(angle) * velocity * (0.7 + Math.random() * 0.3),
            vy: Math.sin(angle) * velocity * (0.7 + Math.random() * 0.3),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            size: intensity === 'low' ? Math.random() * 1 + 1 : intensity === 'medium' ? Math.random() * 1.5 + 1.2 : Math.random() * 2 + 1.5,
            shape: 'rectangle',
            gravity: intensity === 'low' ? 1.8 : intensity === 'medium' ? 1.4 : 1.0,
            drag: intensity === 'low' ? 0.15 : intensity === 'medium' ? 0.12 : 0.08,
            lifespan: intensity === 'low' ? Math.random() * 150 + 300 : intensity === 'medium' ? Math.random() * 200 + 400 : Math.random() * 250 + 500,
            depth: 'near'
          });
        }
        setConfetti(prev => [...prev, ...trailingPieces]);
        trailingCount++;
      }, intensity === 'low' ? 100 : intensity === 'medium' ? 80 : 60);

      // Generate MORE sparkles
      const sparkleParticles: SparkleParticle[] = [];
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 15 + 8;
        sparkleParticles.push({
          id: i,
          x: originPosition.x + (Math.random() - 0.5) * 10,
          y: originPosition.y + (Math.random() - 0.5) * 5,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 10,
          lifespan: Math.random() * 400 + 800
        });
      }
      setSparkles(sparkleParticles);

      // Clear intervals and particles - much quicker
      const timeouts = [
        setTimeout(() => clearInterval(trailingInterval), 300),
        setTimeout(() => {
          setConfetti([]);
          setSparkles([]);
          onComplete();
        }, intensity === 'low' ? 800 : intensity === 'medium' ? 1200 : 1500) // Scale with intensity
      ];

      return () => {
        clearInterval(trailingInterval);
        timeouts.forEach(clearTimeout);
      };
    }
  }, [isActive, buttonRef, originPosition.x, originPosition.y, onComplete]);

  if (!isActive) return null;

  const getShapeStyle = (piece: ConfettiPiece) => {
    const baseOpacity = piece.depth === 'far' ? 0.7 : 1;
    const baseSize = piece.depth === 'far' ? piece.size * 0.8 : piece.size;
    
    switch (piece.shape) {
      case 'circle':
        return {
          width: baseSize,
          height: baseSize,
          backgroundColor: piece.color,
          borderRadius: '50%',
          opacity: baseOpacity,
          filter: piece.depth === 'far' ? 'blur(0.5px)' : 'none'
        };
      case 'star':
        return {
          width: baseSize,
          height: baseSize,
          opacity: baseOpacity,
          filter: piece.depth === 'far' ? 'blur(0.5px)' : 'none'
        };
      case 'rectangle':
      default:
        return {
          width: baseSize,
          height: baseSize * 3, // 2x6 aspect ratio
          backgroundColor: piece.color,
          borderRadius: '1px',
          opacity: baseOpacity,
          filter: piece.depth === 'far' ? 'blur(0.5px)' : 'none'
        };
    }
  };

  const StarShape = ({ size, color }: { size: number; color: string }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Main Confetti */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: `${piece.y}vh`,
            rotate: piece.rotation,
            opacity: 1,
            scale: 1
          }}
          animate={{
            x: `${piece.x + piece.vx * (1 - piece.drag * 2)}vw`,
            y: `${piece.y + piece.vy * 0.3 + piece.gravity * 25}vh`,
            rotate: piece.rotation + piece.rotationSpeed * 45,
            opacity: [1, 1, 0.8, 0],
            scale: [1, 0.9, 0.7, 0]
          }}
          transition={{
            duration: piece.lifespan / 1000,
            ease: [0.33, 1, 0.68, 1], // More natural easing
            times: [0, 0.3, 0.7, 1], // Faster fade
            opacity: {
              times: [0, 0.4, 0.8, 1],
              duration: piece.lifespan / 1000
            }
          }}
          className="absolute"
          style={piece.shape === 'star' ? {} : getShapeStyle(piece)}
        >
          {piece.shape === 'star' && (
            <StarShape size={piece.size} color={piece.color} />
          )}
        </motion.div>
      ))}

      {/* Sparkle Layer */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={`sparkle-${sparkle.id}`}
          initial={{
            x: `${sparkle.x}vw`,
            y: `${sparkle.y}vh`,
            opacity: 0.6,
            scale: 0
          }}
          animate={{
            x: `${sparkle.x + sparkle.vx * 0.3}vw`,
            y: `${sparkle.y + sparkle.vy * 0.3}vh`,
            opacity: [0.6, 1, 0.8, 0],
            scale: [0, 1, 0.8, 0]
          }}
          transition={{
            duration: sparkle.lifespan / 1000,
            ease: "easeOut",
            times: [0, 0.2, 0.7, 1]
          }}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </div>
  );
}