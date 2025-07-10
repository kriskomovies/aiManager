import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';

interface CreateInventoryFormData {
  name: string;
  description: string;
  visibleInApp: boolean;
  amountType: 'add-new' | 'transfer-from-inventory' | 'combined';
  amount?: number;
  fromInventory?: string;
  transferAmount?: number;
  totalAmount?: number;
}

interface CreateInventoryModalProps {
  onClose: () => void;
}

export function CreateInventoryModal({ onClose }: CreateInventoryModalProps) {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState<CreateInventoryFormData>({
    name: '',
    description: '',
    visibleInApp: false,
    amountType: 'add-new',
    amount: 0,
    fromInventory: '',
    transferAmount: 0,
    totalAmount: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock inventory options for transfer
  const inventoryOptions = [
    { value: 'main-cash', label: 'Основна Каса' },
    { value: 'deposit', label: 'Депозит' },
    { value: 'maintenance', label: 'Каса Поддръжка' },
  ];

  const handleInputChange = (field: keyof CreateInventoryFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmountTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      amountType: value as CreateInventoryFormData['amountType'],
      // Reset amount fields when changing type
      amount: 0,
      fromInventory: '',
      transferAmount: 0,
      totalAmount: 0,
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

    setIsSubmitting(true);

    try {
      // TODO: Implement actual create inventory API call
      console.log('Creating inventory with data:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(addAlert({
        type: 'success',
        title: 'Успешно създаване!',
        message: `Касата "${formData.name}" беше създадена успешно.`,
        duration: 5000
      }));
      
      onClose();
    } catch (error) {
      console.error('Error creating inventory:', error);
      
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка при създаване',
        message: 'Възникна грешка при създаването на касата. Моля опитайте отново.',
        duration: 5000
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const renderAmountSection = () => {
    switch (formData.amountType) {
      case 'add-new':
        return (
          <div>
            <Label htmlFor="amount">Сума</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="Сума за внасяне в касата"
                disabled={isSubmitting}
                min="0"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                лв.
              </span>
            </div>
          </div>
        );

      case 'transfer-from-inventory':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromInventory">От Каса</Label>
                <Select
                  id="fromInventory"
                  value={formData.fromInventory || ''}
                  onChange={(e) => handleInputChange('fromInventory', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Избери каса</option>
                  {inventoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="transferAmount">Сума</Label>
                <div className="relative">
                  <Input
                    id="transferAmount"
                    type="number"
                    value={formData.transferAmount || ''}
                    onChange={(e) => handleInputChange('transferAmount', parseFloat(e.target.value) || 0)}
                    placeholder="Сума за прехвърляне"
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
          </div>
        );

      case 'combined':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Нова Сума</h4>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="Сума за внасяне в касата"
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  лв.
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Прехвърляне от Сума от Каса</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromInventory">От Каса</Label>
                    <Select
                      id="fromInventory"
                      value={formData.fromInventory || ''}
                      onChange={(e) => handleInputChange('fromInventory', e.target.value)}
                      disabled={isSubmitting}
                    >
                      <option value="">Избери каса</option>
                      {inventoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transferAmount">Сума</Label>
                    <div className="relative">
                      <Input
                        id="transferAmount"
                        type="number"
                        value={formData.transferAmount || ''}
                        onChange={(e) => handleInputChange('transferAmount', parseFloat(e.target.value) || 0)}
                        placeholder="Сума за прехвърляне"
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
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Обща Сума</h4>
              <div className="text-2xl font-bold text-blue-600">
                {((formData.amount || 0) + (formData.transferAmount || 0)).toFixed(2)} лв.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
        <Plus className="h-6 w-6 text-blue-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Нова Каса
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-6">
        Начално описание, ако има
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
            disabled={isSubmitting}
            required
          />
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
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="add-new"
                name="amountType"
                value="add-new"
                checked={formData.amountType === 'add-new'}
                onChange={(e) => handleAmountTypeChange(e.target.value)}
                disabled={isSubmitting}
                className="text-blue-600"
              />
              <Label htmlFor="add-new" className="text-sm">
                Добави нова сума
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="transfer-from-inventory"
                name="amountType"
                value="transfer-from-inventory"
                checked={formData.amountType === 'transfer-from-inventory'}
                onChange={(e) => handleAmountTypeChange(e.target.value)}
                disabled={isSubmitting}
                className="text-blue-600"
              />
              <Label htmlFor="transfer-from-inventory" className="text-sm">
                Прехвърли сума от каса
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="combined"
                name="amountType"
                value="combined"
                checked={formData.amountType === 'combined'}
                onChange={(e) => handleAmountTypeChange(e.target.value)}
                disabled={isSubmitting}
                className="text-blue-600"
              />
              <Label htmlFor="combined" className="text-sm">
                Комбинирай
              </Label>
            </div>
          </div>
        </div>

        {/* Dynamic amount section based on selected type */}
        {renderAmountSection()}

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
                Създаване...
              </>
            ) : (
              'Създай'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
