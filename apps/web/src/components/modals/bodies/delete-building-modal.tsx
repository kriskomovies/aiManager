import { AlertTriangle, Loader2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';
import { Button } from '@/components/ui/button';
import { useDeleteBuildingMutation } from '@/redux/services/building.service';

interface DeleteBuildingModalProps {
  onClose: () => void;
}

export function DeleteBuildingModal({ onClose }: DeleteBuildingModalProps) {
  const modalData = useAppSelector(selectModalData);
  const dispatch = useAppDispatch();
  const [deleteBuildingMutation, { isLoading: isDeleting }] =
    useDeleteBuildingMutation();

  const buildingName = modalData?.buildingName || 'Неизвестна сграда';
  const buildingId = modalData?.buildingId;

  const handleDelete = async () => {
    if (!buildingId) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Няма избрана сграда за изтриване.',
          duration: 5000,
        })
      );
      return;
    }

    try {
      await deleteBuildingMutation(buildingId).unwrap();

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно изтриване!',
          message: `Сградата "${buildingName}" беше изтрита успешно.`,
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error deleting building:', error);

      // Handle different types of errors
      let errorMessage =
        'Възникна грешка при изтриването на сградата. Моля опитайте отново.';

      if (
        error &&
        typeof error === 'object' &&
        'data' in error &&
        error.data &&
        typeof error.data === 'object' &&
        'message' in error.data
      ) {
        errorMessage = String(error.data.message);
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }

      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка при изтриване',
          message: errorMessage,
          duration: 5000,
        })
      );
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="text-center">
      {/* Warning Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Изтриване на сграда
      </h3>

      {/* Message */}
      <p className="text-sm text-gray-600 mb-6">
        Сигурни ли сте, че искате да изтриете сградата{' '}
        <span className="font-medium text-gray-900">"{buildingName}"</span>?
        <br />
        Това действие не може да бъде отменено.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={handleCancel}
          variant="outline"
          size="default"
          disabled={isDeleting}
        >
          Отмени
        </Button>
        <Button
          onClick={handleDelete}
          variant="destructive"
          size="default"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Изтриване...
            </>
          ) : (
            'Изтрий сградата'
          )}
        </Button>
      </div>
    </div>
  );
}
