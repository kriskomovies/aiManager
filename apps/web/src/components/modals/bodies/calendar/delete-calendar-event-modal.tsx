import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';
import { useDeleteEventMutation } from '@/redux/services/calendar-service';

interface DeleteCalendarEventModalProps {
  onClose: () => void;
}

export function DeleteCalendarEventModal({
  onClose,
}: DeleteCalendarEventModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  const eventId = modalData?.eventId as string;
  const eventTitle = String(modalData?.eventTitle || 'Събитие');

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteEvent] = useDeleteEventMutation();

  const handleDelete = async () => {
    if (!eventId) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Няма избрано събитие за изтриване.',
          duration: 5000,
        })
      );
      return;
    }

    setIsDeleting(true);

    try {
      await deleteEvent(eventId).unwrap();

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно изтриване!',
          message: 'Събитието беше изтрито успешно.',
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error deleting calendar event:', error);

      // Handle different types of errors
      let errorMessage =
        'Възникна грешка при изтриването на събитието. Моля опитайте отново.';

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
        Изтриване на Събитие
      </h3>

      {/* Confirmation Message */}
      <div className="mb-8">
        <p className="text-red-600 text-sm leading-relaxed">
          Сигурни ли сте, че искате да изтриете
          <br />
          Събитие &quot;{eventTitle}&quot;?
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isDeleting}
        >
          Отказ
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white"
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
