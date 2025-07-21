import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeModal, selectModalData } from '@/redux/slices/modal-slice';
import { ReferenceFeesTable } from '@/components/fees/reference-fees-table';

export function ReferenceFeesModal() {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const apartmentNumber = modalData?.apartmentNumber || '7';

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Справка Такси за Апартамент {apartmentNumber}
        </h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[calc(90vh-140px)] overflow-auto">
        <ReferenceFeesTable />
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 flex justify-end items-center bg-gray-50">
        <Button
          onClick={handleClose}
          variant="outline"
          className="px-8"
        >
          Затвори
        </Button>
      </div>
    </motion.div>
  );
}
