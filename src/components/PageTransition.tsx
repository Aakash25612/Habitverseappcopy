import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
}

export function PageTransition({ children, pageKey }: PageTransitionProps) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pageKey}
          initial={{ 
            opacity: 0,
            y: 20
          }}
          animate={{ 
            opacity: 1,
            y: 0
          }}
          exit={{ 
            opacity: 0,
            y: -20
          }}
          transition={{
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}