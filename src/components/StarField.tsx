import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface StarFieldProps {
  width?: number;
  height?: number;
  starCount?: number;
}

export function StarField({ width = 80, height = 40, starCount = 8 }: StarFieldProps) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1, // 1-3px
          delay: Math.random() * 4, // 0-4 second delay
          duration: Math.random() * 3 + 2, // 2-5 second duration
          opacity: Math.random() * 0.6 + 0.4, // 0.4-1.0 opacity
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, [width, height, starCount]);

  return (
    <div 
      className="absolute top-0 right-0 pointer-events-none overflow-hidden"
      style={{ width, height }}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.6)`,
          }}
          initial={{ 
            opacity: 0,
            scale: 0,
          }}
          animate={{ 
            opacity: [0, star.opacity, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            delay: star.delay,
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Add some larger, more prominent stars */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: width * 0.7,
          top: height * 0.3,
          width: 3,
          height: 3,
          background: 'linear-gradient(45deg, #FFC300, #FF8A00)',
          boxShadow: '0 0 8px rgba(255, 195, 0, 0.8)',
        }}
        animate={{ 
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute rounded-full"
        style={{
          left: width * 0.2,
          top: height * 0.7,
          width: 2,
          height: 2,
          background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
          boxShadow: '0 0 6px rgba(139, 92, 246, 0.6)',
        }}
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          scale: [0.7, 1.1, 0.7],
        }}
        transition={{
          delay: 1,
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Subtle sparkle effect */}
      <motion.div
        className="absolute"
        style={{
          left: width * 0.5,
          top: height * 0.1,
          width: 1,
          height: 1,
        }}
      >
        <motion.div
          className="absolute bg-white rounded-full"
          style={{ width: 1, height: 1 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 2, 0],
          }}
          transition={{
            delay: 2,
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        {/* Cross sparkle effect */}
        <motion.div
          className="absolute bg-white"
          style={{
            width: 6,
            height: 1,
            left: -2.5,
            top: 0,
          }}
          animate={{ 
            opacity: [0, 0.8, 0],
          }}
          transition={{
            delay: 2.2,
            duration: 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        <motion.div
          className="absolute bg-white"
          style={{
            width: 1,
            height: 6,
            left: 0,
            top: -2.5,
          }}
          animate={{ 
            opacity: [0, 0.8, 0],
          }}
          transition={{
            delay: 2.2,
            duration: 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </div>
  );
}