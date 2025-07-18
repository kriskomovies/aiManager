import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { Edit, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';
import { 
  useUpdateInventoryMutation
} from '@/redux/services/inventory.service';
import { IInventoryResponse, IUpdateInventoryRequest } from '@repo/interfaces';

interface EditInventoryFormData {
  name: string;
  description: string;
  visibleInApp: boolean;
  currentAmount: number;
}

interface EditInventoryModalProps {
  onClose: () => void;
}

export function EditInventoryModal({ onClose }: EditInventoryModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  
  const inventoryData = modalData?.inventoryData as IInventoryResponse;

  // API mutations
  const [updateInventory] = useUpdateInventoryMutation();

  const [formData, setFormData] = useState<EditInventoryFormData>({
    name: '',
    description: '',
    visibleInApp: false,
    currentAmount: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data when modal opens
  useEffect(() => {
    if (inventoryData) {
      setFormData({
        name: inventoryData.name,
        description: inventoryData.description || '',
        visibleInApp: inventoryData.visibleInApp,
        currentAmount: inventoryData.amount,
      });
    }
  }, [inventoryData]);

  const handleInputChange = (field: keyof EditInventoryFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Моля въведете име на касата.',
        duration: 5000
      }));
      return;
    }

    if (!inventoryData?.id) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Липсва информация за касата.',
        duration: 5000
      }));
      return;
    }



    // Check if trying to edit main inventory name
    if (inventoryData.isMain && formData.name !== inventoryData.name) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Не можете да променяте името на основната каса.',
        duration: 5000
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare update data
      const updateData: IUpdateInventoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        visibleInApp: formData.visibleInApp,
      };

      // Update inventory details
      await updateInventory({ id: inventoryData.id, updates: updateData }).unwrap();
      
      dispatch(addAlert({
        type: 'success',
        title: 'Успешно обновяване!',
        message: `Касата "${formData.name}" беше обновена успешно.`,
        duration: 5000
      }));
      
      onClose();
    } catch (error) {
      console.error('Error updating inventory:', error);
      
      const errorMessage = (error as { data?: { message?: string }; message?: string })?.data?.message || 
                          (error as { message?: string })?.message || 
                          'Възникна грешка при обновяването на касата. Моля опитайте отново.';
      
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

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
        <Edit className="h-6 w-6 text-blue-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {inventoryData?.title || 'Редактиране на Каса'}
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-6">
        {inventoryData?.description || `Редактиране на каса "${inventoryData?.name || 'Неизвестна'}"`}
        {inventoryData?.isMain && (
          <span className="block mt-1 text-amber-600 font-medium">
            Основна каса - ограничени промени
          </span>
        )}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <Label htmlFor="name">Име*</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Въведете име на касата"
            disabled={isSubmitting || inventoryData?.isMain}
            required
          />
          {inventoryData?.isMain && (
            <p className="text-xs text-amber-600 mt-1">
              Името на основната каса не може да бъде променено
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Описание на касата"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="visibleInApp"
            checked={formData.visibleInApp}
            onChange={(e) => handleInputChange('visibleInApp', e.target.checked)}
            disabled={isSubmitting}
          />
          <Label htmlFor="visibleInApp" className="text-sm">
            Видима в приложението
          </Label>
        </div>

        <div>
          <Label>Сума</Label>
          <div className="space-y-3">
            <div>
              <Label htmlFor="currentAmount">Текуща наличност</Label>
              <div className="relative">
                <Input
                  id="currentAmount"
                  type="number"
                  value={formData.currentAmount}
                  disabled={true}
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  лв.
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Наличността се управлява чрез трансфери между каси
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Информация:</strong> За добавяне или прехвърляне на суми използвайте бутона "Прехвърляне на пари" в главната страница на касите.
              </p>
            </div>
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
            Отказ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
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
  );
}
