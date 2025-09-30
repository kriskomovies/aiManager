import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';
import { selectModalData } from '@/redux/slices/modal-slice';
import { useDeleteMonthlyFeeMutation } from '@/redux/services/monthly-fee.service';
import type { IMonthlyFeeResponse } from '@repo/interfaces';

interface DeleteMonthlyFeeModalProps {
  onClose: () => void;
}

export function DeleteMonthlyFeeModal({ onClose }: DeleteMonthlyFeeModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get fee data from modal data
  const feeData = modalData?.feeData as IMonthlyFeeResponse | undefined;

  const [deleteMonthlyFee] = useDeleteMonthlyFeeMutation();

  const handleDelete = async () => {
    if (!feeData?.id) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Липсва информация за месечната такса.',
          duration: 5000,
        })
      );
      return;
    }

    setIsDeleting(true);

    try {
      await deleteMonthlyFee(feeData.id).unwrap();

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно изтриване!',
          message: 'Месечната такса беше изтрита успешно.',
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error deleting monthly fee:', error);

      const errorMessage =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as { message?: string })?.message ||
        'Възникна грешка при изтриването на месечната такса. Моля опитайте отново.';

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

  if (!feeData) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Грешка</h3>
        <p className="text-sm text-gray-600 mb-6">
          Липсват данни за месечната такса.
        </p>
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
        Изтриване на Месечна Такса
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-2">
        Сигурни ли сте, че искате да изтриете тази месечна такса?
      </p>

      {/* Fee Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-6 text-left">
        <p className="text-sm font-medium text-gray-900">{feeData.name}</p>
        <p className="text-sm text-gray-600">
          Базова сума: {feeData.baseAmount} лв.
        </p>
        {feeData.building && (
          <p className="text-sm text-gray-600">
            Сграда: {feeData.building.name}
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
