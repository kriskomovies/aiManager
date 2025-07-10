import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from './button';

export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function Tabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = '',
  variant = 'underline'
}: TabsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if tabs overflow and need scroll buttons
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        setShowScrollButtons(container.scrollWidth > container.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tabs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeTabConfig = tabs.find(tab => tab.id === activeTab);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsDropdownOpen(false);
  };

  const getTabClasses = (_tab: TabConfig, isActive: boolean) => {
    const baseClasses = "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200";
    
    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-full ${
          isActive 
            ? 'bg-red-500 text-white' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`;
      case 'underline':
        return `${baseClasses} rounded-none border-b-2 ${
          isActive 
            ? 'text-red-500 border-red-500' 
            : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
        }`;
      default:
        return `${baseClasses} rounded-md ${
          isActive 
            ? 'bg-red-50 text-red-600' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Desktop/Tablet View */}
      <div className="hidden sm:block">
        <div className="relative">
          {/* Scroll buttons for overflow */}
          {showScrollButtons && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:bg-gray-50"
                aria-label="Scroll left"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:bg-gray-50"
                aria-label="Scroll right"
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </button>
            </>
          )}
          
          {/* Scrollable tabs container */}
          <div
            ref={scrollContainerRef}
            className={`flex overflow-x-auto scrollbar-hide ${
              variant === 'underline' ? 'border-b border-gray-200' : 'gap-1'
            } ${showScrollButtons ? 'px-8' : ''}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  disabled={tab.disabled}
                  className={`${getTabClasses(tab, isActive)} ${
                    tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  } whitespace-nowrap`}
                  whileHover={!tab.disabled ? { scale: 1.02 } : {}}
                  whileTap={!tab.disabled ? { scale: 0.98 } : {}}
                >
                  {IconComponent && <IconComponent className="h-4 w-4 flex-shrink-0" />}
                  <span className="flex-shrink-0">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View - Dropdown */}
      <div className="sm:hidden" ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            {activeTabConfig?.icon && (
              <activeTabConfig.icon className="h-4 w-4" />
            )}
            <span>{activeTabConfig?.label}</span>
          </div>
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <div className="py-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      disabled={tab.disabled}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                        isActive 
                          ? 'bg-red-50 text-red-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      } ${
                        tab.disabled 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer'
                      }`}
                    >
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      <span>{tab.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 bg-red-500 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 