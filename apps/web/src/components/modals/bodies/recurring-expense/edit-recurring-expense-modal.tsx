import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';

interface EditRecurringExpenseFormData {
  name: string;
  monthlyAmount: number;
  paymentMethod: string;
  addToMonthlyFees: boolean;
}

interface EditRecurringExpenseModalProps {
  onClose: () => void;
}

export function EditRecurringExpenseModal({
  onClose,
}: EditRecurringExpenseModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  const [formData, setFormData] = useState<EditRecurringExpenseFormData>({
    name: '',
    monthlyAmount: 0,
    paymentMethod: '',
    addToMonthlyFees: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock payment methods data - these should match monthly fee options
  const paymentMethodOptions = [
    { value: 'elevator-fee', label: 'Асансьорна такса' },
    { value: 'cleaning-fee', label: 'Такса почистване' },
    { value: 'maintenance-fee', label: 'Такса поддръжка' },
    { value: 'security-fee', label: 'Такса охрана' },
    { value: 'common-areas-fee', label: 'Такса общи части' },
  ];

  // Pre-populate form with existing expense data from modal
  useEffect(() => {
    if (modalData?.expenseData) {
      const expense = modalData.expenseData as {
        name?: string;
        amount?: number;
        paymentMethod?: string;
        linkedToMonthlyFee?: boolean;
      };
      setFormData({
        name: expense.name || '',
        monthlyAmount: expense.amount || 0,
        paymentMethod: expense.paymentMethod || '',
        addToMonthlyFees: expense.linkedToMonthlyFee || false,
      });
    }
  }, [modalData]);

  const handleInputChange = (
    field: keyof EditRecurringExpenseFormData,
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
      // TODO: Implement actual API call for updating recurring expense
      console.log('Updating recurring expense with data:', formData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешна актуализация!',
          message: 'Периодичният разход беше актуализиран успешно.',
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error updating recurring expense:', error);

      const errorMessage =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as { message?: string })?.message ||
        'Възникна грешка при актуализацията на периодичния разход. Моля опитайте отново.';

      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка при актуализация',
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
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Редактиране на Периодичен Разход
        </h2>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Име
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Въведете име на разхода"
              className="mt-1"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Monthly Amount Field */}
          <div>
            <Label htmlFor="monthlyAmount" className="text-sm font-medium text-gray-700">
              Месечна Такса Сума
            </Label>
            <div className="relative mt-1">
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
            <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
              Свържи с Месечна Такса
              <span className="ml-1 text-red-500">
                <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M10 6v4M10 14h.01"/>
                </svg>
              </span>
            </Label>
            <Select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={e => handleInputChange('paymentMethod', e.target.value)}
              className="mt-1"
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
            <Label htmlFor="addToMonthlyFees" className="text-sm font-medium text-gray-700">
              Добави в Месечни Такси
            </Label>
          </div>
        </form>
      </div>

      {/* Footer with Action Buttons */}
      <div className="p-6 border-t border-gray-200 flex justify-end items-center bg-gray-50">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-8"
          >
            Отказ
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Запази...
              </>
            ) : (
              'Запази'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
