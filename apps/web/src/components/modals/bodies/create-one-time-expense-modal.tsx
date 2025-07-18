import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useAppDispatch } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';

interface CreateOneTimeExpenseModalProps {
  onClose: () => void;
}

interface OneTimeExpenseFormData {
  name: string;
  amount: number;
  paymentMethod: string;
  note: string;
}

export function CreateOneTimeExpenseModal({ onClose }: CreateOneTimeExpenseModalProps) {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState<OneTimeExpenseFormData>({
    name: '',
    amount: 0,
    paymentMethod: '',
    note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment method options
  const paymentMethodOptions = [
    { value: 'cashier', label: 'Касиер' },
    { value: 'deposit', label: 'Плащане от депозит' },
    { value: 'bank-account', label: 'По сметка' },
    { value: 'e-pay', label: 'През Е-Пей' },
    { value: 'easy-pay', label: 'През Изи-Пей' },
    { value: 'expense-refund', label: 'Възстановяване от разход' },
  ];

  const handleInputChange = (field: keyof OneTimeExpenseFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Моля въведете име за разхода.',
        duration: 5000
      }));
      return;
    }

    if (formData.amount <= 0) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Моля въведете валидна сума.',
        duration: 5000
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual API call to create one-time expense
      console.log('Creating one-time expense:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(addAlert({
        type: 'success',
        title: 'Успешно създаване!',
        message: `Еднократният разход "${formData.name}" беше създаден успешно.`,
        duration: 5000
      }));
      
      onClose();
    } catch (error) {
      console.error('Error creating one-time expense:', error);
      
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка при създаване',
        message: 'Възникна грешка при създаването на разхода. Моля опитайте отново.',
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
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Създаване на Еднократен Разход
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-6">
        Добавете нов еднократен разход
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Name Field */}
        <div>
          <Label htmlFor="name">Име*</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Въведете име на разхода"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Amount Field */}
        <div>
          <Label htmlFor="amount">Сума</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              placeholder="Въведете сума"
              disabled={isSubmitting}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              лв.
            </span>
          </div>
        </div>

        {/* Payment Method Field */}
        <div>
          <Label htmlFor="paymentMethod">Метод на плащане</Label>
          <Select
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Изберете метод на плащане</option>
            {paymentMethodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Note Field */}
        <div>
          <Label htmlFor="note">Бележка</Label>
          <Input
            id="note"
            type="text"
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            placeholder="Добавете бележка (по избор)"
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
            {isSubmitting ? 'Създаване...' : 'Създай'}
          </Button>
        </div>
      </form>
    </div>
  );
}
