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
  const [position, setPosition] = React.useState({ top: 0, left: 0, right: 0 });
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        right: window.innerWidth - rect.right - window.scrollX,
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
            'fixed z-[9999] mt-1 min-w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg',
          )}
          style={{
            top: position.top,
            [align === 'right' ? 'right' : 'left']: align === 'right' ? position.right : position.left,
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
                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
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
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
} 