import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';
import { selectModalData } from '@/redux/slices/modal-slice';
import { useDeleteRecurringExpenseMutation } from '@/redux/services/recurring-expense.service';
import type { IRecurringExpenseResponse } from '@repo/interfaces';

interface DeleteRecurringExpenseModalProps {
  onClose: () => void;
}

export function DeleteRecurringExpenseModal({
  onClose,
}: DeleteRecurringExpenseModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get expense data from modal data
  const expenseData = modalData?.expenseData as
    | IRecurringExpenseResponse
    | undefined;

  const [deleteRecurringExpense] = useDeleteRecurringExpenseMutation();

  const handleDelete = async () => {
    if (!expenseData?.id) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Липсва информация за разхода.',
          duration: 5000,
        })
      );
      return;
    }

    setIsDeleting(true);

    try {
      await deleteRecurringExpense(expenseData.id).unwrap();

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно изтриване!',
          message: 'Периодичният разход беше изтрит успешно.',
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

  if (!expenseData) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Грешка</h3>
        <p className="text-sm text-gray-600 mb-6">Липсват данни за разхода.</p>
        <Button variant="outline" onClick={onClose}>
          Затвори
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Изтриване на Периодичен Разход
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-2">
        Сигурни ли сте, че искате да изтриете този периодичен разход?
      </p>

      {/* Expense Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-6 text-left">
        <p className="text-sm font-medium text-gray-900">{expenseData.name}</p>
        <p className="text-sm text-gray-600">
          Сума: {expenseData.monthlyAmount} лв.
        </p>
        {expenseData.contractor && (
          <p className="text-sm text-gray-600">
            Контрагент: {expenseData.contractor}
          </p>
        )}
      </div>

      <p className="text-xs text-red-600 mb-6">
        Това действие не може да бъде отменено.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isDeleting}
          className="flex-1"
        >
          Отказ
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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
