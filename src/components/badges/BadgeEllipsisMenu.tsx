import { motion, AnimatePresence } from 'motion/react';
import { Star, History, Trophy, Trash2, Zap } from 'lucide-react';
import { Badge } from './BadgeCard';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface BadgeEllipsisMenuProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  onPushToPrestige?: (badgeId: string) => void;
  onSetAsShowcase?: (badgeId: string) => void;
  onViewHistory?: (badgeId: string) => void;
  onRemoveFromShelf?: (badgeId: string) => void;
}

export function BadgeEllipsisMenu({
  isOpen,
  onClose,
  badge,
  buttonRef,
  onPushToPrestige,
  onSetAsShowcase,
  onViewHistory,
  onRemoveFromShelf
}: BadgeEllipsisMenuProps) {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef?.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const menuWidth = 224; // w-56 = 14rem = 224px
      const menuHeight = 200; // approximate height
      
      let top = buttonRect.bottom + 8; // mt-2 = 8px
      let left = buttonRect.right - menuWidth; // right-aligned
      
      // Adjust if menu would go off-screen
      if (top + menuHeight > viewportHeight) {
        top = buttonRect.top - menuHeight - 8;
      }
      
      if (left < 16) {
        left = 16; // minimum margin from screen edge
      }
      
      if (left + menuWidth > viewportWidth - 16) {
        left = viewportWidth - menuWidth - 16;
      }
      
      setMenuPosition({ top, left });
    }
  }, [isOpen, buttonRef]);
  const menuItems = [
    ...(badge.canPushToPrestige && badge.type === 'gold30' ? [{
      icon: Zap,
      label: 'Push to 60-Day Prestige',
      action: () => onPushToPrestige?.(badge.id),
      gradient: true
    }] : []),
    {
      icon: Star,
      label: 'Set as Profile Showcase',
      action: () => onSetAsShowcase?.(badge.id)
    },
    {
      icon: History,
      label: 'View Progress History',
      action: () => onViewHistory?.(badge.id)
    },
    {
      icon: Trash2,
      label: 'Remove from Shelf',
      action: () => onRemoveFromShelf?.(badge.id),
      destructive: true
    }
  ];

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed w-56 bg-gray-800 border border-gray-700 rounded-xl p-2 z-50 shadow-xl"
            style={{ 
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleItemClick(item.action)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors min-h-[44px] ${
                  item.destructive ? 'text-red-400 hover:text-red-300' : 'text-white hover:text-gray-100'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  item.gradient ? 'bg-gradient-to-r from-purple-600 to-blue-600' :
                  item.destructive ? 'bg-red-500/20' :
                  'bg-gray-700'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Render menu in a portal to avoid z-index and overflow issues
  return typeof document !== 'undefined' ? 
    createPortal(menuContent, document.body) : 
    null;
}