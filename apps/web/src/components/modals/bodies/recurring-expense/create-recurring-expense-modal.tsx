import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';

interface RecurringExpenseFormData {
  name: string;
  monthlyAmount: number;
  paymentMethod: string;
  addToMonthlyFees: boolean;
}

interface CreateRecurringExpenseModalProps {
  onClose: () => void;
}

export function CreateRecurringExpenseModal({
  onClose,
}: CreateRecurringExpenseModalProps) {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<RecurringExpenseFormData>({
    name: '',
    monthlyAmount: 0,
    paymentMethod: '',
    addToMonthlyFees: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock payment methods data
  const paymentMethodOptions = [
    { value: 'cash', label: 'В брой' },
    { value: 'bank-transfer', label: 'Банков превод' },
    { value: 'card', label: 'Карта' },
    { value: 'online', label: 'Онлайн' },
  ];

  const handleInputChange = (
    field: keyof RecurringExpenseFormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.monthlyAmount <= 0 || !formData.paymentMethod) {
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
      // TODO: Implement actual API call for creating recurring expense
      console.log('Creating recurring expense with data:', formData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно създаване!',
          message: 'Периодичният разход беше създаден успешно.',
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error creating recurring expense:', error);

      const errorMessage =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as { message?: string })?.message ||
        'Възникна грешка при създаването на периодичния разход. Моля опитайте отново.';

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

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <Plus className="h-6 w-6 text-red-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Създаване на Периодичен Разход
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-6">
        Добавете нов периодичен разход
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Name Field */}
        <div>
          <Label htmlFor="name">Име *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Въведете име на разхода"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Monthly Amount Field */}
        <div>
          <Label htmlFor="monthlyAmount">Месечна Такса Сума</Label>
          <div className="relative">
            <Input
              id="monthlyAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.monthlyAmount || ''}
              onChange={e =>
                handleInputChange('monthlyAmount', parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
              disabled={isSubmitting}
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              лв.
            </span>
          </div>
        </div>

        {/* Payment Method Field */}
        <div>
          <Label htmlFor="paymentMethod">Свържи с Месечна Такса</Label>
          <Select
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={e => handleInputChange('paymentMethod', e.target.value)}
            disabled={isSubmitting}
            required
          >
            <option value="">Избери</option>
            {paymentMethodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Add to Monthly Fees Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="addToMonthlyFees"
            checked={formData.addToMonthlyFees}
            onChange={e => handleInputChange('addToMonthlyFees', e.target.checked)}
            disabled={isSubmitting}
          />
          <Label htmlFor="addToMonthlyFees" className="text-sm">
            Добави в Месечни Такси
          </Label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Отказ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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
