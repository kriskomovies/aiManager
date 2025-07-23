import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';

interface DeleteRecurringExpenseModalProps {
  onClose: () => void;
}

export function DeleteRecurringExpenseModal({
  onClose,
}: DeleteRecurringExpenseModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  const [isDeleting, setIsDeleting] = useState(false);

  // Get expense name from modal data
  const expenseName = modalData?.expenseData ? 
    (modalData.expenseData as { name?: string }).name : 
    'този разход';

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // TODO: Implement actual API call for deleting recurring expense
      console.log('Deleting recurring expense:', expenseName);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно изтриване!',
          message: `Периодичният разход "${expenseName}" беше изтрит успешно.`,
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error deleting recurring expense:', error);

      const errorMessage =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as { message?: string })?.message ||
        'Възникна грешка при изтриването на периодичния разход. Моля опитайте отново.';

      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка при изтриване',
          message: errorMessage,
          duration: 5000,
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="text-center">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Изтриване на Периодичен Разход
      </h3>

      {/* Confirmation Message */}
      <p className="text-base text-red-600 mb-8 leading-relaxed">
        Сигурни ли сте, че искате да изтриете<br />
        Периодичен Разход "{expenseName}"?
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isDeleting}
          className="px-8 py-2"
        >
          Отказ
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Изтриване...
            </>
          ) : (
            'Изтрий'
          )}
        </Button>
      </div>
    </div>
  );
}
