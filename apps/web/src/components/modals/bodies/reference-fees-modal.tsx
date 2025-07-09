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
      className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          Справка Такси за Апартамент {apartmentNumber}
        </h2>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Table Container */}
      <div className="p-4">
        <ReferenceFeesTable />
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 flex justify-end items-center">
        <Button
          onClick={handleClose}
          variant="outline"
        >
          Затвори
        </Button>
      </div>
    </motion.div>
  );
}
