import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';

interface TransferInventoryFormData {
  fromInventory: string;
  toInventory: string;
  fromAmount: number;
  toAmount: number;
  description: string;
}

interface TransferInventoryMoneyModalProps {
  onClose: () => void;
}

export function TransferInventoryMoneyModal({ onClose }: TransferInventoryMoneyModalProps) {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState<TransferInventoryFormData>({
    fromInventory: '',
    toInventory: '',
    fromAmount: 0,
    toAmount: 0,
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for inventories
  const mockInventories = [
    { id: '1', name: 'Основна Каса', amount: 585.00 },
    { id: '2', name: 'Депозит', amount: 200.00 },
    { id: '3', name: 'Резервна Каса', amount: 150.00 },
    { id: '4', name: 'Каса за Ремонти', amount: 320.50 },
    { id: '5', name: 'Каса за Такси', amount: 450.75 },
  ];

  const handleInputChange = (field: keyof TransferInventoryFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
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

    if (formData.fromAmount <= 0) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Сумата за прехвърляне трябва да бъде по-голяма от 0.',
        duration: 5000
      }));
      return;
    }

    const fromInventory = mockInventories.find(inv => inv.id === formData.fromInventory);
    if (fromInventory && formData.fromAmount > fromInventory.amount) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Недостатъчна наличност в касата.',
        duration: 5000
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual transfer money API call
      console.log('Transferring money:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fromInventoryName = mockInventories.find(inv => inv.id === formData.fromInventory)?.name;
      const toInventoryName = mockInventories.find(inv => inv.id === formData.toInventory)?.name;
      
      dispatch(addAlert({
        type: 'success',
        title: 'Успешно прехвърляне!',
        message: `Сумата от ${formData.fromAmount.toFixed(2)} лв. беше прехвърлена от "${fromInventoryName}" към "${toInventoryName}".`,
        duration: 5000
      }));
      
      onClose();
    } catch (error) {
      console.error('Error transferring money:', error);
      
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка при прехвърляне',
        message: 'Възникна грешка при прехвърлянето на парите. Моля опитайте отново.',
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
    return mockInventories.filter(inv => inv.id !== formData.fromInventory);
  };

  const getAvailableFromInventories = () => {
    return mockInventories.filter(inv => inv.id !== formData.toInventory);
  };

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
                  {inventory.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="fromAmount">Сума</Label>
            <div className="relative">
              <Input
                id="fromAmount"
                type="number"
                value={formData.fromAmount}
                onChange={(e) => handleInputChange('fromAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                disabled={isSubmitting}
                min="0"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                лв.
              </span>
            </div>
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
                  {inventory.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="toAmount">Сума</Label>
            <div className="relative">
              <Input
                id="toAmount"
                type="number"
                value={formData.toAmount || formData.fromAmount}
                onChange={(e) => handleInputChange('toAmount', parseFloat(e.target.value) || 0)}
                placeholder="+0.00"
                disabled={isSubmitting}
                min="0"
                step="0.01"
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
            disabled={isSubmitting}
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
