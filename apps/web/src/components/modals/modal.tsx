import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectModal, closeModal } from '@/redux/slices/modal-slice';
import { DeleteBuildingModal } from './bodies/delete-building-modal';

export function ModalContainer() {
  const modal = useAppSelector(selectModal);
  const dispatch = useAppDispatch();

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.isOpen) {
        dispatch(closeModal());
      }
    };

    if (modal.isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modal.isOpen, dispatch]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(closeModal());
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  const renderModalBody = () => {
    switch (modal.type) {
      case 'delete-building':
        return <DeleteBuildingModal onClose={handleClose} />;
      
      // Add more modal types here as needed
      // case 'add-building':
      //   return <AddBuildingModal onClose={handleClose} />;
      // case 'edit-building':
      //   return <EditBuildingModal onClose={handleClose} />;
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {modal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Modal Body */}
            <div className="p-6">
              {renderModalBody()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
