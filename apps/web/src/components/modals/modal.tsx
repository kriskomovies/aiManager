import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectModal, closeModal } from '@/redux/slices/modal-slice';
import { DeleteBuildingModal } from './bodies/delete-building-modal';
import { DeleteApartmentModal } from './bodies/delete-apartment-modal';
import { ReferenceFeesModal } from './bodies/reference-fees-modal';
import { ReferencePaymentsModal } from './bodies/reference-payments-modal';
import { PaymentModal } from './bodies/payment-modal';
import { EditApartmentIrregularityModal } from './bodies/edit-apartment-irregularity';
import { DeleteApartmentIrregularityModal } from './bodies/delete-apartment-irregularity';
import { CreateBuildingIrregularityModal } from './bodies/building-irregularities/create-building-irregularity-modal';
import { EditBuildingIrregularityModal } from './bodies/building-irregularities/edit-building-irregularity-modal';
import { CreateNewMessageModal } from './bodies/messages/create-new-message-modal';
import { ViewMessageModal } from './bodies/messages/view-message-modal';
import { EditMessageModal } from './bodies/messages/edit-message-modal';
import { DeleteMessageModal } from './bodies/messages/delete-message-modal';
import { CreateInventoryModal } from './bodies/create-inventory-modal';
import { EditInventoryModal } from './bodies/edit-inventory-modal';
import { DeleteInventoryModal } from './bodies/delete-inventory-modal';
import { TransferInventoryMoneyModal } from './bodies/transfer-inventory-money-modal';
import { InventoryTransfersModal } from './bodies/inventory-transfers-modal';
import { CreateOneTimeExpenseModal } from './bodies/create-one-time-expense-modal';
import { CreateMonthlyFeeModal } from './bodies/monthly-fees/create-monthly-fee';

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

      case 'delete-apartment':
        return <DeleteApartmentModal onClose={handleClose} />;

      case 'reference-fees':
        return <ReferenceFeesModal />;

      case 'reference-payments':
        return <ReferencePaymentsModal />;

      case 'payment':
        return <PaymentModal />;

      case 'edit-apartment-irregularity':
        return <EditApartmentIrregularityModal onClose={handleClose} />;

      case 'delete-apartment-irregularity':
        return <DeleteApartmentIrregularityModal onClose={handleClose} />;

      case 'create-building-irregularity':
        return <CreateBuildingIrregularityModal onClose={handleClose} />;

      case 'edit-building-irregularity':
        return <EditBuildingIrregularityModal onClose={handleClose} />;

      case 'create-new-message':
        return <CreateNewMessageModal onClose={handleClose} />;

      case 'view-message':
        return <ViewMessageModal onClose={handleClose} />;

      case 'edit-message':
        return <EditMessageModal onClose={handleClose} />;

      case 'delete-message':
        return <DeleteMessageModal onClose={handleClose} />;

      case 'create-inventory':
        return <CreateInventoryModal onClose={handleClose} />;

      case 'edit-inventory':
        return <EditInventoryModal onClose={handleClose} />;

      case 'delete-inventory':
        return <DeleteInventoryModal onClose={handleClose} />;

      case 'transfer-inventory-money':
        return <TransferInventoryMoneyModal onClose={handleClose} />;

      case 'inventory-transfers':
        return <InventoryTransfersModal onClose={handleClose} />;

      case 'create-one-time-expense':
        return <CreateOneTimeExpenseModal onClose={handleClose} />;

      case 'create-monthly-fee':
        return <CreateMonthlyFeeModal />;

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
            className={`relative z-10 ${
              modal.type === 'reference-fees' ||
              modal.type === 'reference-payments'
                ? 'w-full max-w-6xl'
                : modal.type === 'payment'
                  ? 'w-full max-w-2xl'
                  : modal.type === 'create-inventory'
                    ? 'bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
                    : modal.type === 'create-monthly-fee'
                      ? 'bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto'
                      : 'bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden'
            }`}
          >
            {/* Conditional rendering based on modal type */}
            {modal.type === 'reference-fees' ||
            modal.type === 'reference-payments' ||
            modal.type === 'payment' ||
            modal.type === 'inventory-transfers' ||
            modal.type === 'create-monthly-fee' ? (
              renderModalBody()
            ) : (
              <>
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-20 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Modal Body */}
                <div className="p-6">{renderModalBody()}</div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
