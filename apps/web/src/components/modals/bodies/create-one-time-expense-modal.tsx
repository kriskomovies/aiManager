import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';
import { selectModalData } from '@/redux/slices/modal-slice';
import { useGetActiveUserPaymentMethodsQuery } from '@/redux/services/payment-method.service';
import { useCreateOneTimeExpenseMutation } from '@/redux/services/expense.service';
import { useGetInventoriesByBuildingQuery, inventoryService } from '@/redux/services/inventory.service';

interface CreateOneTimeExpenseModalProps {
  onClose: () => void;
}

interface OneTimeExpenseFormData {
  name: string;
  amount: number;
  paymentMethod: string;
  sourceInventory: string;
  note: string;
}

export function CreateOneTimeExpenseModal({
  onClose,
}: CreateOneTimeExpenseModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  const [formData, setFormData] = useState<OneTimeExpenseFormData>({
    name: '',
    amount: 0,
    paymentMethod: '',
    sourceInventory: '',
    note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get building ID from modal data
  const buildingId = modalData?.buildingId;

  // Fetch payment methods from database
  const { data: paymentMethods = [], isLoading: isLoadingPaymentMethods } =
    useGetActiveUserPaymentMethodsQuery();

  // Fetch inventories for the building
  const { data: inventories = [], isLoading: isLoadingInventories } =
    useGetInventoriesByBuildingQuery(buildingId!, {
      skip: !buildingId,
    });

  // API mutation for creating one-time expense
  const [createOneTimeExpense] = useCreateOneTimeExpenseMutation();

  const handleInputChange = (
    field: keyof OneTimeExpenseFormData,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Моля въведете име на разхода.',
          duration: 5000,
        })
      );
      return;
    }

    if (formData.amount <= 0) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Моля въведете валидна сума.',
          duration: 5000,
        })
      );
      return;
    }

    if (!formData.sourceInventory) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Моля изберете източник на средства.',
          duration: 5000,
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the one-time expense
      await createOneTimeExpense({
        name: formData.name,
        expenseDate: new Date().toISOString(),
        amount: formData.amount,
        inventoryId: formData.sourceInventory,
        userPaymentMethodId: formData.paymentMethod,
        note: formData.note || undefined,
      }).unwrap();

      // Manually invalidate inventory cache to update the displayed amounts
      dispatch(inventoryService.util.invalidateTags(['Inventory', 'InventoryStats']));

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно създаване!',
          message: `Еднократният разход от ${formData.amount.toFixed(2)} лв. беше създаден успешно.`,
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error creating one-time expense:', error);

      // Handle different types of errors
      let errorMessage =
        'Възникна грешка при създаването на разхода. Моля опитайте отново.';

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

  // Show error if no building context
  if (!buildingId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Липсва информация за сградата.</p>
        <Button onClick={onClose} className="mt-4">
          Затвори
        </Button>
      </div>
    );
  }

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
          <Label htmlFor="name">Име на разхода *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Въведете име на разхода"
            disabled={isSubmitting}
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
              onChange={e =>
                handleInputChange('amount', parseFloat(e.target.value) || 0)
              }
              placeholder="Въведете сума"
              disabled={isSubmitting}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              лв.
            </span>
          </div>
        </div>

        {/* Source Inventory Field */}
        <div>
          <Label htmlFor="sourceInventory">Източник на средства *</Label>
          <Select
            id="sourceInventory"
            value={formData.sourceInventory}
            onChange={e => handleInputChange('sourceInventory', e.target.value)}
            disabled={isSubmitting || isLoadingInventories}
          >
            <option value="">Изберете касова наличност</option>
            {inventories.map(inventory => (
              <option key={inventory.id} value={inventory.id}>
                {inventory.name} ({inventory.amount.toFixed(2)} лв.)
              </option>
            ))}
          </Select>
        </div>

        {/* Payment Method Field */}
        <div>
          <Label htmlFor="paymentMethod">Метод на плащане</Label>
          <Select
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={e => handleInputChange('paymentMethod', e.target.value)}
            disabled={isSubmitting || isLoadingPaymentMethods}
          >
            <option value="">Изберете метод на плащане</option>
            {paymentMethods.map(method => (
              <option key={method.id} value={method.id}>
                {method.displayName}
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
            onChange={e => handleInputChange('note', e.target.value)}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Създаване...' : 'Създай'}
          </Button>
        </div>
      </form>
    </div>
  );
}
