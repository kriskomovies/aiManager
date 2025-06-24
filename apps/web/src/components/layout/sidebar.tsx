import * as React from 'react';
import { cn } from '@/lib/utils';
import { Home, Users, Calendar, Brain, LucideIcon, PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  path: string;
  label: string;
  icon: LucideIcon;
  isSpecial?: boolean; // For special styling like buildings
}

const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'AI',
    icon: Brain,
  },
  {
    path: '/buildings',
    label: 'Сгради',
    icon: Home,
    isSpecial: true, // Special red styling
  },
  {
    path: '/users',
    label: 'Юзъри',
    icon: Users,
  },
  {
    path: '/calendar',
    label: 'Календар',
    icon: Calendar,
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ className, isCollapsed, onToggle }: SidebarProps) {
  return (
    <motion.div 
      className={cn('flex h-full min-h-screen flex-col border-r bg-white relative', className)}
      animate={{ width: isCollapsed ? '64px' : '256px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4 relative">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-6 w-6 rounded bg-red-500 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                className="font-semibold whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
              >
                Organization
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        {/* Toggle Button */}
        <motion.button
          onClick={onToggle}
          className="absolute -translate-y-1/3 right-1 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4 text-gray-600" />
            ) : (
              <PanelRightOpen className="h-4 w-4 text-gray-600" />
            )}
          </motion.div>
        </motion.button>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 space-y-1 p-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-3xl px-3 py-2 text-sm font-medium relative group',
                  'hover:bg-red-50 transition-colors duration-200',
                  isActive
                    ? 'bg-red-50 text-red-500'
                    : 'text-gray-600',
                  isCollapsed && 'justify-center'
                )
              }
            >
              <IconComponent className="h-4 w-4 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </motion.div>
  );
}
