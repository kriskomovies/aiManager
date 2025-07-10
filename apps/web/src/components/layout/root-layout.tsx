import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Search, Menu, X } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentPageTitle, selectCurrentPageSubtitle } from '@/redux/slices/app-state';
import { AlertContainer } from '@/components/ui/alert';
import { ModalContainer } from '@/components/modals/modal';
import { motion, AnimatePresence } from 'framer-motion';

export function RootLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pageTitle = useAppSelector(selectCurrentPageTitle);
  const pageSubtitle = useAppSelector(selectCurrentPageSubtitle);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when screen becomes desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  const handleSidebarMouseEnter = () => {
    if (!isMobile) {
      setSidebarCollapsed(false);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (!isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div 
          className="fixed h-full z-20"
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
        >
          <Sidebar 
            isCollapsed={sidebarCollapsed}
            isMobile={false}
            onNavigate={closeMobileMenu}
          />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              className="fixed left-0 top-0 h-full z-50 md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <Sidebar 
                isCollapsed={false}
                isMobile={true}
                onNavigate={closeMobileMenu}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div 
        className="flex-1 min-h-screen flex flex-col max-w-full overflow-x-hidden"
        animate={{ 
          marginLeft: isMobile ? '0px' : (sidebarCollapsed ? '64px' : '256px')
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          width: isMobile ? '100vw' : `calc(100vw - ${sidebarCollapsed ? '64px' : '256px'})`,
          maxWidth: isMobile ? '100vw' : `calc(100vw - ${sidebarCollapsed ? '64px' : '256px'})`
        }}
      >
        <div className="flex h-14 items-center justify-between bg-red-500 text-white px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile burger menu button */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="p-1 hover:bg-red-600 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
            
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">{pageTitle}</h1>
              {pageSubtitle && (
                <p className="text-sm text-red-100 hidden sm:block">{pageSubtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-red-400" />
              <input
                type="search"
                placeholder="Търси..."
                className="h-9 w-32 sm:w-48 md:w-64 rounded-full border-0 pl-8 pr-3 text-sm bg-red-100 placeholder:text-red-300 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-300 focus:bg-red-200"
              />
            </div>
          </div>
        </div>
        <main className="flex-1 p-4 md:p-8 bg-gray-50 w-full max-w-full overflow-x-hidden">
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
