import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';
import { 
  useTransferMoneyMutation,
  useGetInventoriesByBuildingQuery 
} from '@/redux/services/inventory.service';
import { IInventoryTransferRequest } from '@repo/interfaces';

interface TransferInventoryFormData {
  fromInventory: string;
  toInventory: string;
  amount: number;
  description: string;
}

interface TransferInventoryMoneyModalProps {
  onClose: () => void;
}

export function TransferInventoryMoneyModal({ onClose }: TransferInventoryMoneyModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  
  // Get building ID from modal data or current context
  const buildingId = modalData?.buildingId;
  
  // Get inventories for the building
  const { data: inventories = [], isLoading } = useGetInventoriesByBuildingQuery(buildingId!, {
    skip: !buildingId
  });
  
  // API mutation
  const [transferMoney] = useTransferMoneyMutation();
  
  const [formData, setFormData] = useState<TransferInventoryFormData>({
    fromInventory: '',
    toInventory: '',
    amount: 0,
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof TransferInventoryFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper functions
  const getSelectedFromInventory = () => {
    return inventories.find(inv => inv.id === formData.fromInventory);
  };

  const getSelectedToInventory = () => {
    return inventories.find(inv => inv.id === formData.toInventory);
  };

  // Validation function
  const isTransferAmountValid = () => {
    if (!formData.fromInventory || !formData.amount) return true;
    const sourceInventory = getSelectedFromInventory();
    return !sourceInventory || formData.amount <= sourceInventory.amount;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!buildingId) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Липсва информация за сградата.',
        duration: 5000
      }));
      return;
    }
    
    if (!formData.fromInventory) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Моля изберете каса от която да се прехвърли сумата.',
        duration: 5000
      }));
      return;
    }

    if (!formData.toInventory) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Моля изберете каса към която да се прехвърли сумата.',
        duration: 5000
      }));
      return;
    }

    if (formData.fromInventory === formData.toInventory) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Не можете да прехвърлите пари към същата каса.',
        duration: 5000
      }));
      return;
    }

    if (formData.amount <= 0) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Сумата за прехвърляне трябва да бъде по-голяма от 0.',
        duration: 5000
      }));
      return;
    }

    const fromInventory = getSelectedFromInventory();
    if (fromInventory && formData.amount > fromInventory.amount) {
      dispatch(addAlert({
        type: 'error',
        title: 'Недостатъчна наличност',
        message: `Касата "${fromInventory.name}" има само ${fromInventory.amount.toFixed(2)} лв. Не можете да прехвърлите ${formData.amount.toFixed(2)} лв.`,
        duration: 5000
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const transferData: IInventoryTransferRequest = {
        fromInventoryId: formData.fromInventory,
        toInventoryId: formData.toInventory,
        amount: formData.amount,
        description: formData.description.trim() || undefined
      };

      await transferMoney(transferData).unwrap();
      
      const fromInventoryName = getSelectedFromInventory()?.name;
      const toInventoryName = getSelectedToInventory()?.name;
      
      dispatch(addAlert({
        type: 'success',
        title: 'Успешно прехвърляне!',
        message: `Сумата от ${formData.amount.toFixed(2)} лв. беше прехвърлена от "${fromInventoryName}" към "${toInventoryName}".`,
        duration: 5000
      }));
      
      onClose();
    } catch (error) {
      console.error('Error transferring money:', error);
      
      const errorMessage = (error as { data?: { message?: string }; message?: string })?.data?.message || 
                          (error as { message?: string })?.message || 
                          'Възникна грешка при прехвърлянето на парите. Моля опитайте отново.';
      
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка при прехвърляне',
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

  const getAvailableToInventories = () => {
    return inventories.filter(inv => inv.id !== formData.fromInventory);
  };

  const getAvailableFromInventories = () => {
    return inventories.filter(inv => inv.id !== formData.toInventory);
  };

  // Show loading state if inventories are still loading
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Зареждане на касите...</p>
      </div>
    );
  }

  // Show error if no building context
  if (!buildingId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Липсва информация за сградата.</p>
        <Button onClick={onClose} className="mt-4">Затвори</Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
        <ArrowRightLeft className="h-6 w-6 text-blue-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Прехвърляне на Пари
      </h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* From Inventory Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fromInventory">От Каса</Label>
            <Select
              id="fromInventory"
              value={formData.fromInventory}
              onChange={(e) => handleInputChange('fromInventory', e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Избери каса</option>
              {getAvailableFromInventories().map((inventory) => (
                <option key={inventory.id} value={inventory.id}>
                  {inventory.name} ({inventory.amount.toFixed(2)} лв.)
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Сума</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                disabled={isSubmitting}
                min="0"
                step="0.01"
                className={!isTransferAmountValid() ? 'border-red-500 focus:border-red-500' : ''}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                лв.
              </span>
            </div>
            {!isTransferAmountValid() && (
              <p className="text-xs text-red-600 mt-1">
                Недостатъчна наличност! Максимум: {getSelectedFromInventory()?.amount.toFixed(2)} лв.
              </p>
            )}
          </div>
        </div>

        {/* To Inventory Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="toInventory">В Каса</Label>
            <Select
              id="toInventory"
              value={formData.toInventory}
              onChange={(e) => handleInputChange('toInventory', e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Избери каса</option>
              {getAvailableToInventories().map((inventory) => (
                <option key={inventory.id} value={inventory.id}>
                  {inventory.name} ({inventory.amount.toFixed(2)} лв.)
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="resultAmount">Резултат</Label>
            <div className="relative">
              <Input
                id="resultAmount"
                type="text"
                value={getSelectedToInventory() ? `${(getSelectedToInventory()!.amount + (formData.amount || 0)).toFixed(2)}` : ''}
                placeholder="Резултат след прехвърляне"
                disabled={true}
                className="bg-gray-50"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                лв.
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Описание</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Описание на прехвърлянето"
            disabled={isSubmitting}
          />
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
            disabled={isSubmitting || !isTransferAmountValid()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Прехвърляне...
              </>
            ) : (
              'Прехвърли'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
