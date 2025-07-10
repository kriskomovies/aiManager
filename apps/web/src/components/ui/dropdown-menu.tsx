import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: (DropdownMenuItem | 'separator')[];
  className?: string;
  align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, items, className, align = 'right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ 
    top: 0, 
    left: 0, 
    right: 0, 
    openUpward: false 
  });
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Add both mouse and touch events for mobile support
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleToggle = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Calculate dropdown dimensions
      const dropdownHeight = items.length * 44 + 8; // 44px per item + padding
      const dropdownWidth = 280; // Increased width for Bulgarian text
      
      // Determine optimal positioning
      let top: number;
      let left: number;
      let right: number;
      let openUpward = false;
      
      // Vertical positioning logic
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;
      const isMobile = windowWidth < 768;
      
      if (spaceBelow >= dropdownHeight) {
        // Enough space below - position below trigger (closer)
        top = rect.bottom + scrollY - 4;
        openUpward = false;
      } else if (spaceAbove >= dropdownHeight) {
        // Not enough space below but enough above - position above trigger (closer)
        if (isMobile) {
          // On mobile, position higher to ensure trigger visibility
          top = rect.top + scrollY - dropdownHeight + 20;
        } else {
          top = rect.top + scrollY - dropdownHeight + 50;
        }
        openUpward = true;
      } else {
        // Not enough space in either direction - position where there's more space
        if (spaceBelow > spaceAbove) {
          // More space below
          top = rect.bottom + scrollY - 4;
          openUpward = false;
        } else {
          // More space above
          if (isMobile) {
            // On mobile, position higher to ensure trigger visibility
            top = rect.top + scrollY - dropdownHeight + 20;
          } else {
            top = rect.top + scrollY - dropdownHeight + 4;
          }
          openUpward = true;
        }
      }
      
      // Horizontal positioning logic
      if (align === 'right') {
        // Right align - dropdown's right edge aligns with trigger's right edge
        const idealLeft = rect.right + scrollX - dropdownWidth;
        const minLeft = 8; // Minimum margin from left edge
        const maxLeft = windowWidth - dropdownWidth - 8; // Maximum position
        
        left = Math.max(minLeft, Math.min(idealLeft, maxLeft));
        right = 0;
      } else {
        // Left align - dropdown's left edge aligns with trigger's left edge
        const idealLeft = rect.left + scrollX;
        const minLeft = 8;
        const maxLeft = windowWidth - dropdownWidth - 8;
        
        left = Math.max(minLeft, Math.min(idealLeft, maxLeft));
        right = 0;
      }
      
      // Final boundary check to ensure dropdown is fully visible
      const topMargin = isMobile ? 16 : 8;
      const bottomMargin = isMobile ? 190 : 8;
      
      if (top < scrollY + topMargin) {
        top = scrollY + topMargin;
      } else if (top + dropdownHeight > scrollY + windowHeight - bottomMargin) {
        top = scrollY + windowHeight - dropdownHeight - bottomMargin;
        // On mobile, if dropdown is still too low, position it higher
        if (isMobile && top + dropdownHeight > scrollY + windowHeight - 20) {
          top = scrollY + windowHeight - dropdownHeight - 20;
        }
      }
      
      setPosition({
        top,
        left,
        right,
        openUpward
      });
    }
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'fixed z-[9999] w-50 rounded-md border border-gray-200 bg-white py-1 shadow-lg',
            'max-h-none overflow-visible' // Ensure full content is visible
          )}
          style={{
            top: position.top,
            left: position.left,
            width: '280px', // Increased width for Bulgarian text
          }}
        >
          {items.map((item, index) => {
            if (item === 'separator') {
              return (
                <div
                  key={`separator-${index}`}
                  className="my-1 h-px bg-gray-200"
                />
              );
            }

            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors',
                  'min-h-[44px]', // Ensure consistent height, allow text wrapping if needed
                  item.disabled
                    ? 'cursor-not-allowed text-gray-400'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        onTouchStart={handleToggle}
        className="cursor-pointer touch-manipulation"
      >
        {trigger}
      </div>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
} 