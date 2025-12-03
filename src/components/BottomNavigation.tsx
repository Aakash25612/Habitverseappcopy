import { motion } from 'motion/react';
import { Home, Target, Users, User, BarChart3 } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: 'home' | 'habits' | 'alliance' | 'avatar' | 'analytics';
  onPageChange: (page: 'home' | 'habits' | 'alliance' | 'avatar' | 'analytics') => void;
}

const navItems = [
  { icon: Home, label: 'Home', id: 'home' as const },
  { icon: Target, label: 'Habits', id: 'habits' as const },
  { icon: Users, label: 'Alliance', id: 'alliance' as const },
  { icon: User, label: 'Avatar', id: 'avatar' as const },
  { icon: BarChart3, label: 'Analytics', id: 'analytics' as const }
];

export function BottomNavigation({ currentPage, onPageChange }: BottomNavigationProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 z-50"
    >
      <div className="flex justify-around items-center py-3 px-4 max-w-md mx-auto">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              console.log('Clicking navigation item:', item.id);
              onPageChange(item.id);
            }}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-800/50 ${
              currentPage === item.id 
                ? 'text-purple-400 bg-purple-900/20' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <motion.div
              animate={{ 
                scale: currentPage === item.id ? 1.2 : 1 
              }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className={`${currentPage === item.id ? 'w-6 h-6' : 'w-5 h-5'}`} />
            </motion.div>
            <span className="text-xs">{item.label}</span>
            
            {currentPage === item.id && (
              <>
                {/* Enhanced glow effect around icon with breathing */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'radial-gradient(circle, rgba(122, 60, 255, 0.15) 0%, transparent 70%)',
                    filter: 'blur(6px)'
                  }}
                />
              </>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}