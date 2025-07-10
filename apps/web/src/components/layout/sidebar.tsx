import * as React from 'react';
import { cn } from '@/lib/utils';
import { Home, Users, Calendar, Brain, LucideIcon } from 'lucide-react';
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
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ className, isCollapsed, isMobile = false, onNavigate }: SidebarProps) {
  const handleNavClick = () => {
    if (isMobile && onNavigate) {
      onNavigate();
    }
  };

  return (
    <motion.div 
      className={cn(
        'flex h-full min-h-screen flex-col border-r bg-white relative',
        isMobile ? 'w-64' : '', // Fixed width for mobile
        className
      )}
      animate={{ 
        width: isMobile ? '256px' : (isCollapsed ? '64px' : '256px')
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4 relative">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-6 w-6 rounded bg-red-500 flex-shrink-0" />
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.span 
                className="font-semibold whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ 
                  duration: 0.2, 
                  delay: (isCollapsed && !isMobile) ? 0 : 0.1 
                }}
              >
                Organization
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 space-y-1 p-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-3xl text-sm font-medium relative group h-10',
                  'hover:bg-red-50 transition-colors duration-200',
                  isActive
                    ? 'bg-red-50 text-red-500'
                    : 'text-gray-600',
                  (isCollapsed && !isMobile) ? 'px-3 justify-center' : 'px-3'
                )
              }
            >
              {/* Icon container with fixed positioning */}
              <div className={cn(
                "w-4 h-4 flex items-center justify-center flex-shrink-0",
                (isCollapsed && !isMobile) ? "mx-auto" : ""
              )}>
                <IconComponent className="h-4 w-4" />
              </div>
              
              {/* Label with consistent spacing */}
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: (isCollapsed && !isMobile) ? 0 : 0.1 
                    }}
                    className="whitespace-nowrap overflow-hidden ml-2"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Tooltip for collapsed state (desktop only) */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
      
      {/* Mobile-specific footer or additional content can go here */}
      {isMobile && (
        <div className="border-t p-4">
          <div className="text-xs text-gray-500 text-center">
            Home Manager v1.0
          </div>
        </div>
      )}
    </motion.div>
  );
}
