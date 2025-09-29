import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';
import { selectModalData } from '@/redux/slices/modal-slice';
import { useUpdateRecurringExpenseMutation } from '@/redux/services/recurring-expense.service';
import { useGetMonthlyFeesByBuildingQuery } from '@/redux/services/monthly-fee.service';
import { useGetActiveUserPaymentMethodsQuery } from '@/redux/services/payment-method.service';
import type { IRecurringExpenseResponse } from '@repo/interfaces';

interface RecurringExpenseFormData {
  name: string;
  monthlyAmount: number;
  userPaymentMethodId: string;
  addToMonthlyFees: boolean;
  monthlyFeeId: string;
  contractor: string;
  paymentDate: string;
  reason: string;
}

interface EditRecurringExpenseModalProps {
  onClose: () => void;
}

export function EditRecurringExpenseModal({
  onClose,
}: EditRecurringExpenseModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  // Get expense data from modal data
  const expenseData = modalData?.expenseData as IRecurringExpenseResponse | undefined;
  const buildingId = modalData?.buildingId as string;

  const [formData, setFormData] = useState<RecurringExpenseFormData>({
    name: '',
    monthlyAmount: 0,
    userPaymentMethodId: '',
    addToMonthlyFees: false,
    monthlyFeeId: '',
    contractor: '',
    paymentDate: '',
    reason: '',
  });

  const [updateRecurringExpense, { isLoading: isSubmitting }] = useUpdateRecurringExpenseMutation();

  // Fetch monthly fees for the building
  const { data: monthlyFees = [], isLoading: isLoadingMonthlyFees } = 
    useGetMonthlyFeesByBuildingQuery(buildingId, {
      skip: !buildingId,
    });

  // Fetch payment methods
  const { data: paymentMethods = [], isLoading: isLoadingPaymentMethods } = 
    useGetActiveUserPaymentMethodsQuery();

  // Initialize form with existing expense data
  useEffect(() => {
    if (expenseData) {
      setFormData({
        name: expenseData.name || '',
        monthlyAmount: expenseData.monthlyAmount || 0,
        userPaymentMethodId: expenseData.userPaymentMethodId || '',
        addToMonthlyFees: expenseData.addToMonthlyFees || false,
        monthlyFeeId: expenseData.monthlyFeeId || '',
        contractor: expenseData.contractor || '',
        paymentDate: expenseData.paymentDate ? expenseData.paymentDate.split('T')[0] : '', // Format date for input
        reason: expenseData.reason || '',
      });
    }
  }, [expenseData]);

  const handleInputChange = (
    field: keyof RecurringExpenseFormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Clear monthlyFeeId when addToMonthlyFees is enabled
      if (field === 'addToMonthlyFees' && value === true) {
        updated.monthlyFeeId = '';
      }
      
      // Auto-fill monthly amount when a monthly fee is selected
      if (field === 'monthlyFeeId' && value && typeof value === 'string') {
        const selectedFee = monthlyFees.find(fee => fee.id === value);
        if (selectedFee) {
          updated.monthlyAmount = selectedFee.baseAmount;
        }
      }
      
      // Clear monthly amount when monthlyFeeId is cleared
      if (field === 'monthlyFeeId' && !value) {
        // Only reset if not adding to monthly fees (manual entry allowed)
        if (!updated.addToMonthlyFees) {
          updated.monthlyAmount = 0;
        }
      }

      return updated;
    });
  };
  
  // Check if monthly amount should be disabled
  const isMonthlyAmountDisabled = !formData.addToMonthlyFees && Boolean(formData.monthlyFeeId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      formData.monthlyAmount <= 0 ||
      !formData.userPaymentMethodId
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

    if (!expenseData?.id) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Липсва информация за разхода.',
          duration: 5000,
        })
      );
      return;
    }

    try {
      await updateRecurringExpense({
        id: expenseData.id,
        data: {
          name: formData.name.trim(),
          monthlyAmount: formData.monthlyAmount,
          userPaymentMethodId: formData.userPaymentMethodId,
          addToMonthlyFees: formData.addToMonthlyFees,
          monthlyFeeId: formData.addToMonthlyFees ? undefined : (formData.monthlyFeeId || undefined),
          contractor: formData.contractor || undefined,
          paymentDate: formData.paymentDate || undefined,
          reason: formData.reason || undefined,
        },
      }).unwrap();

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно обновяване!',
          message: 'Периодичният разход беше обновен успешно.',
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
        'Възникна грешка при обновяването на периодичния разход. Моля опитайте отново.';

      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка при обновяване',
          message: errorMessage,
          duration: 5000,
        })
      );
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!expenseData) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <Edit className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Грешка
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Липсват данни за разхода.
        </p>
        <Button variant="outline" onClick={onClose}>
          Затвори
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-center px-6 py-4">
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <Edit className="h-6 w-6 text-red-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Редактиране на Периодичен Разход
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 mb-6">
          Редактирайте информацията за периодичния разход
        </p>
      </div>

      {/* Form Container - scrollable */}
      <div className="flex-1 overflow-y-auto px-6">
        <form id="edit-form" onSubmit={handleSubmit} className="space-y-4 text-left">
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
            <Label htmlFor="monthlyAmount">Месечна Такса Сума *</Label>
            <div className="relative">
            <Input
              id="monthlyAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.monthlyAmount || ''}
              onChange={e =>
                handleInputChange(
                  'monthlyAmount',
                  parseFloat(e.target.value) || 0
                )
              }
              placeholder="0.00"
              disabled={isSubmitting || isMonthlyAmountDisabled}
              required
              className={isMonthlyAmountDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              лв.
            </span>
          </div>
          {isMonthlyAmountDisabled && (
            <p className="text-xs text-gray-500 mt-1">
              Сумата се попълва автоматично от избраната месечна такса
            </p>
          )}
        </div>

          {/* Link with Monthly Fee Field */}
          <div>
            <Label htmlFor="monthlyFeeId">
              Свържи с месечна такса (по избор)
            </Label>
            <Select
            id="monthlyFeeId"
            value={formData.monthlyFeeId}
            onChange={e => handleInputChange('monthlyFeeId', e.target.value)}
            disabled={isSubmitting || isLoadingMonthlyFees || formData.addToMonthlyFees}
          >
            <option value="">
              {formData.addToMonthlyFees 
                ? 'Ще се създаде нова месечна такса' 
                : 'Избери месечна такса (опционално)'
              }
            </option>
            {!formData.addToMonthlyFees && monthlyFees.map(fee => (
              <option key={fee.id} value={fee.id}>
                {fee.name} ({fee.baseAmount.toFixed(2)} лв.)
              </option>
            ))}
          </Select>
        </div>

          {/* Contractor Field */}
          <div>
            <Label htmlFor="contractor">Контрагент</Label>
            <Select
            id="contractor"
            value={formData.contractor}
            onChange={e => handleInputChange('contractor', e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Избери контрагент</option>
            {/* TODO: Add contractor options later */}
          </Select>
        </div>

          {/* Payment Date Field */}
          <div>
            <Label htmlFor="paymentDate">Дата на плащане</Label>
            <Input
            id="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={e => handleInputChange('paymentDate', e.target.value)}
            disabled={isSubmitting}
          />
        </div>

          {/* Reason Field */}
          <div>
            <Label htmlFor="reason">Основание</Label>
            <Input
            id="reason"
            type="text"
            value={formData.reason}
            onChange={e => handleInputChange('reason', e.target.value)}
            placeholder="Въведете основание за разхода"
            disabled={isSubmitting}
          />
        </div>

          {/* Payment Method Field */}
          <div>
            <Label htmlFor="userPaymentMethodId">Метод на плащане *</Label>
            <Select
            id="userPaymentMethodId"
            value={formData.userPaymentMethodId}
            onChange={e => handleInputChange('userPaymentMethodId', e.target.value)}
            disabled={isSubmitting || isLoadingPaymentMethods}
            required
          >
            <option value="">Избери метод на плащане</option>
            {paymentMethods.map(method => (
              <option key={method.id} value={method.id}>
                {method.displayName}
              </option>
            ))}
          </Select>
        </div>

          {/* Add to Monthly Fees Checkbox - moved to last */}
          <div className="flex items-center space-x-2">
            <Checkbox
            id="addToMonthlyFees"
            checked={formData.addToMonthlyFees}
            onChange={e =>
              handleInputChange('addToMonthlyFees', e.target.checked)
            }
            disabled={isSubmitting}
          />
          <Label htmlFor="addToMonthlyFees" className="text-sm">
            Добави в Месечни Такси
          </Label>
        </div>

        </form>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex gap-3">
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
            form="edit-form"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Обновяване...
              </>
            ) : (
              'Обнови'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}