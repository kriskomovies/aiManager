import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Edit, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';

interface IrregularityFormData {
  title: string;
  responsible: string;
  reportedBy: string;
  status: 'докладвана' | 'планувана' | 'в процес' | 'решена';
  attachedFile?: File | null;
}

interface EditApartmentIrregularityModalProps {
  onClose: () => void;
}

export function EditApartmentIrregularityModal({
  onClose,
}: EditApartmentIrregularityModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  const irregularityId = modalData?.irregularityId;
  const apartmentId = modalData?.apartmentId;

  // Mock initial data - TODO: Load real data based on irregularityId
  const [formData, setFormData] = useState<IrregularityFormData>({
    title: 'Неработещо Заглавие',
    responsible: 'Име Фамилия',
    reportedBy: 'Име Фамилия',
    status: 'докладвана',
    attachedFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof IrregularityFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      attachedFile: file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!irregularityId) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Няма избрана нередност за редактиране.',
          duration: 5000,
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual update API call
      console.log(
        'Updating irregularity:',
        irregularityId,
        'for apartment:',
        apartmentId,
        'with data:',
        formData
      );

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно обновяване!',
          message: 'Нередността беше обновена успешно.',
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error updating irregularity:', error);

      // Handle different types of errors
      let errorMessage =
        'Възникна грешка при обновяването на нередността. Моля опитайте отново.';

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
          title: 'Грешка при обновяване',
          message: errorMessage,
          duration: 5000,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const statusOptions = [
    { value: 'докладвана', label: 'Докладвана' },
    { value: 'планувана', label: 'Планувана' },
    { value: 'в процес', label: 'В Процес' },
    { value: 'решена', label: 'Решена' },
    { value: 'отказана', label: 'Отказана' },
  ];

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
        <Edit className="h-6 w-6 text-blue-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Редактиране на нередност
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-6">
        Обновете информацията за нередността
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Заглавие</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="Въведете заглавие на нередността"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label htmlFor="responsible">Отговорник</Label>
            <Input
              id="responsible"
              value={formData.responsible}
              onChange={e => handleInputChange('responsible', e.target.value)}
              placeholder="Въведете отговорник"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label htmlFor="reportedBy">Докладвана от</Label>
            <Input
              id="reportedBy"
              value={formData.reportedBy}
              onChange={e => handleInputChange('reportedBy', e.target.value)}
              placeholder="Въведете докладчик"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Статус</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={e =>
                handleInputChange(
                  'status',
                  e.target.value as IrregularityFormData['status']
                )
              }
              disabled={isSubmitting}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="attachedFile">Прикачен файл</Label>
            <Input
              id="attachedFile"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={isSubmitting}
            />
            {formData.attachedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Избран файл: {formData.attachedFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Отмени
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Запазване...
              </>
            ) : (
              'Запази промените'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
