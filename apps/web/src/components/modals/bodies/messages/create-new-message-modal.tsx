import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Plus, Loader2, Upload } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';
import { useGetApartmentsByBuildingQuery } from '@/redux/services/apartment.service';

interface CreateNewMessageFormData {
  title: string;
  description: string;
  deliveryMethod: 'SMS' | 'EMAIL' | 'PUSH' | 'IN_APP' | '';
  recipients: string[];
  attachedFile?: File | null;
}

interface CreateNewMessageModalProps {
  onClose: () => void;
}

export function CreateNewMessageModal({ onClose }: CreateNewMessageModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  // Get the building ID from modal data
  const buildingId = modalData?.buildingId;

  // Fetch apartments with residents for the building to populate recipients
  const { data: apartments = [] } = useGetApartmentsByBuildingQuery(
    buildingId || '',
    {
      skip: !buildingId,
    }
  );

  const [formData, setFormData] = useState<CreateNewMessageFormData>({
    title: '',
    description: '',
    deliveryMethod: '',
    recipients: [],
    attachedFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof CreateNewMessageFormData,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRecipientsChange = (value: string[]) => {
    // If "all" is selected, only keep "all" and remove other selections
    if (value.includes('all')) {
      setFormData(prev => ({
        ...prev,
        recipients: ['all'],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        recipients: value,
      }));
    }
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

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.deliveryMethod ||
      formData.recipients.length === 0
    ) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Моля попълнете всички задължителни полета.',
          duration: 5000,
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual create API call
      console.log('Creating new message with data:', formData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно създаване!',
          message: 'Съобщението беше създадено успешно.',
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error creating message:', error);

      // Handle different types of errors
      let errorMessage =
        'Възникна грешка при създаването на съобщението. Моля опитайте отново.';

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
          title: 'Грешка при създаване',
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

  // Delivery method options
  const deliveryMethodOptions = [
    { value: 'SMS', label: 'SMS' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'PUSH', label: 'Push нотификация' },
    { value: 'IN_APP', label: 'В приложението' },
  ];

  // Create recipient options from apartments only
  const recipientOptions: MultiSelectOption[] = [];

  // Add "All apartments" option
  const apartmentsWithResidents = apartments.filter(
    apt => (apt.residents?.length || 0) > 0
  );
  if (apartmentsWithResidents.length > 0) {
    recipientOptions.push({
      value: 'all',
      label: `Всички (${apartmentsWithResidents.length} апартамента)`,
    });
  }

  // Add individual apartment options
  apartmentsWithResidents.forEach(apartment => {
    recipientOptions.push({
      value: `apartment_${apartment.id}`,
      label: `Апартамент ${apartment.number} (${apartment.residents?.length || 0} жители)`,
    });
  });

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
        <Plus className="h-6 w-6 text-blue-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Ново Съобщение
      </h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Title */}
        <div>
          <Label htmlFor="title">Заглавие</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={e => handleInputChange('title', e.target.value)}
            placeholder="Въведете заглавие на съобщението"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Описание</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            placeholder="Въведете съдържанието на съобщението"
            disabled={isSubmitting}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery Method */}
          <div>
            <Label htmlFor="deliveryMethod">Метод на Доставка</Label>
            <Select
              id="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={e =>
                handleInputChange('deliveryMethod', e.target.value)
              }
              disabled={isSubmitting}
              required
            >
              <option value="">Избери</option>
              {deliveryMethodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Recipients */}
          <div>
            <Label htmlFor="recipients">Получатели</Label>
            <MultiSelect
              options={recipientOptions}
              value={formData.recipients}
              onChange={handleRecipientsChange}
              placeholder="Избери"
              className="w-full"
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <Label htmlFor="attachedFile">Файл</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('attachedFile')?.click()}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Добави Файл
            </Button>
            <input
              id="attachedFile"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={isSubmitting}
              className="hidden"
            />
            {formData.attachedFile && (
              <span className="text-sm text-gray-600">
                {formData.attachedFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Отказ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Добавяне...
              </>
            ) : (
              'Добави'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
