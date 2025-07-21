import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Eye, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';

interface EditBuildingIrregularityFormData {
  status: 'докладвана' | 'планувана' | 'в процес' | 'оправена' | 'отказана';
}

interface EditBuildingIrregularityModalProps {
  onClose: () => void;
}

export function EditBuildingIrregularityModal({ onClose }: EditBuildingIrregularityModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  
  const irregularityId = modalData?.irregularityId;
  const buildingId = modalData?.buildingId;

  // Mock irregularity data - TODO: Load real data based on irregularityId
  const mockIrregularity = {
    id: irregularityId || '1',
    title: 'Счупена Панта',
    description: 'Описание на Нередност ала бала. Описание на Нередност ала бала. Описание на Нередност ала бала. Описание на Нередност ала бала. Описание на Нередност ала бала. Описание на Нередност ала бала.',
    buildingName: 'Име на Сграда',
    apartmentNumber: '24',
    date: '10.12.2024',
    hasAttachedFile: true,
    status: 'докладвана' as const,
  };

  const [formData, setFormData] = useState<EditBuildingIrregularityFormData>({
    status: mockIrregularity.status,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStatusChanged, setHasStatusChanged] = useState(false);

  // Load initial data when modal opens
  useEffect(() => {
    // TODO: Load real irregularity data based on irregularityId
    console.log('Loading irregularity:', irregularityId, 'for building:', buildingId);
    
    setFormData({
      status: mockIrregularity.status,
    });
  }, [irregularityId, buildingId]);

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as EditBuildingIrregularityFormData['status']
    }));
    
    // Enable save button when status changes from initial value
    setHasStatusChanged(value !== mockIrregularity.status);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!irregularityId) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Няма избрана нередност за редактиране.',
        duration: 5000
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual update API call
      console.log('Updating irregularity status:', irregularityId, 'to:', formData.status);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(addAlert({
        type: 'success',
        title: 'Успешно обновяване!',
        message: 'Статусът на нередността беше обновен успешно.',
        duration: 5000
      }));
      
      onClose();
    } catch (error) {
      console.error('Error updating irregularity status:', error);
      
      // Handle different types of errors
      let errorMessage = 'Възникна грешка при обновяването на статуса. Моля опитайте отново.';
      
      if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
        errorMessage = String(error.data.message);
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка при обновяване',
        message: errorMessage,
        duration: 5000
      }));
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
    { value: 'оправена', label: 'Оправена' },
    { value: 'отказана', label: 'Отказана' },
  ];

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-left mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Нередност
        </h3>
        <div className="text-right text-sm text-gray-500">
          {mockIrregularity.date}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-2">
            {mockIrregularity.title}
          </h4>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {mockIrregularity.description}
          </p>
        </div>

        {/* Building and Apartment Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Сграда</span>
            <div className="font-medium text-gray-900">
              {mockIrregularity.buildingName}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Апартамент</span>
            <div className="font-medium text-gray-900">
              {mockIrregularity.apartmentNumber}
            </div>
          </div>
        </div>

        {/* Attached File */}
        {mockIrregularity.hasAttachedFile && (
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-sm"
              onClick={() => {
                // TODO: Handle file viewing
                console.log('View attached file');
              }}
            >
              <Eye className="h-4 w-4" />
              Прикачен файл
            </Button>
          </div>
        )}

        {/* Status Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">Статус</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isSubmitting}
              required
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Затвори
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !hasStatusChanged}
              className={hasStatusChanged && !isSubmitting 
                ? "" 
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Запазване...
                </>
              ) : (
                'Запази'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
