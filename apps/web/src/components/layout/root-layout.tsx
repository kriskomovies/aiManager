import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Search } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentPageTitle, selectCurrentPageSubtitle } from '@/redux/slices/app-state';
import { AlertContainer } from '@/components/ui/alert';
import { ModalContainer } from '@/components/modals/modal';
import { motion } from 'framer-motion';

export function RootLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pageTitle = useAppSelector(selectCurrentPageTitle);
  const pageSubtitle = useAppSelector(selectCurrentPageSubtitle);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed h-full z-20">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
      </div>

      {/* Main content */}
      <motion.div 
        className="flex-1 min-h-screen flex flex-col"
        animate={{ 
          marginLeft: sidebarCollapsed ? '64px' : '256px' 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex h-14 items-center justify-between bg-red-500 text-white px-8 sticky top-0 z-10">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
            {pageSubtitle && (
              <p className="text-sm text-red-100">{pageSubtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-red-400" />
              <input
                type="search"
                placeholder="Търси..."
                className="h-9 w-64 rounded-full border-0 pl-8 pr-3 text-sm bg-red-100 placeholder:text-red-300 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-300 focus:bg-red-200"
              />
            </div>
          </div>
        </div>
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </motion.div>
      
      {/* Alert Container */}
      <AlertContainer />
      
      {/* Modal Container */}
      <ModalContainer />
    </div>
  );
}
