import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Toggle } from '@/components/ui/toggle';
import { Wallet, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';
import { selectModalData } from '@/redux/slices/modal-slice';
import { useGetMonthlyFeesByBuildingQuery } from '@/redux/services/monthly-fee.service';
import { useGetActiveUserPaymentMethodsQuery } from '@/redux/services/payment-method.service';
import type { IRecurringExpenseResponse } from '@repo/interfaces';

interface PaymentFormData {
  amount: number;
  paymentMethodId: string;
  connectPayment: boolean;
  monthlyFeeId: string;
  reason: string;
  paymentDate: string;
  issueDocument: boolean;
  documentType: 'invoice' | 'receipt' | null; // Фактура or Квитанция
}

interface PayRecurringExpenseModalProps {
  onClose: () => void;
}

export function PayRecurringExpenseModal({
  onClose,
}: PayRecurringExpenseModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  // Get expense data from modal data
  const expenseData = modalData?.expenseData as IRecurringExpenseResponse | undefined;
  const buildingId = modalData?.buildingId as string;

  const [formData, setFormData] = useState<PaymentFormData>({
    amount: expenseData?.monthlyAmount || 0,
    paymentMethodId: '',
    connectPayment: false,
    monthlyFeeId: '',
    reason: '',
    paymentDate: new Date().toISOString().split('T')[0], // Today's date
    issueDocument: false,
    documentType: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch monthly fees for the building
  const { data: monthlyFees = [], isLoading: isLoadingMonthlyFees } = 
    useGetMonthlyFeesByBuildingQuery(buildingId, {
      skip: !buildingId,
    });

  // Fetch payment methods
  const { data: paymentMethods = [], isLoading: isLoadingPaymentMethods } = 
    useGetActiveUserPaymentMethodsQuery();

  const handleInputChange = (
    field: keyof PaymentFormData,
    value: string | number | boolean | null
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentTypeChange = (type: 'invoice' | 'receipt') => {
    setFormData(prev => ({
      ...prev,
      documentType: prev.documentType === type ? null : type, // Toggle off if same type
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      formData.amount <= 0 ||
      !formData.paymentMethodId ||
      (formData.connectPayment && !formData.monthlyFeeId)
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

    setIsSubmitting(true);

    try {
      // TODO: Implement payment API call
      console.log('Payment data:', {
        expenseId: expenseData.id,
        ...formData,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно плащане!',
          message: `Плащането за "${expenseData.name}" беше обработено успешно.`,
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);

      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка при плащане',
          message: 'Възникна грешка при обработката на плащането. Моля опитайте отново.',
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

  if (!expenseData) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <Wallet className="h-6 w-6 text-red-600" />
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
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <Wallet className="h-6 w-6 text-red-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Плащане {expenseData.name}
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-6">
        Обработете плащането за периодичния разход
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Amount Field */}
        <div>
          <Label htmlFor="amount">Сума *</Label>
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
          <Label htmlFor="paymentMethodId">Метод на Плащане *</Label>
          <Select
            id="paymentMethodId"
            value={formData.paymentMethodId}
            onChange={e => handleInputChange('paymentMethodId', e.target.value)}
            disabled={isSubmitting || isLoadingPaymentMethods}
            required
          >
            <option value="">Избери</option>
            {paymentMethods.map(method => (
              <option key={method.id} value={method.id}>
                {method.displayName}
              </option>
            ))}
          </Select>
        </div>

        {/* Connect Payment Toggle */}
        <div>
          <Toggle
            id="connectPayment"
            pressed={formData.connectPayment}
            onPressedChange={value => handleInputChange('connectPayment', value)}
            disabled={isSubmitting}
            label="Свържи Плащането"
          />
        </div>

        {/* Monthly Fee Selection - Only shown when connectPayment is true */}
        {formData.connectPayment && (
          <div>
            <Label htmlFor="monthlyFeeId">Месечна Такса *</Label>
            <Select
              id="monthlyFeeId"
              value={formData.monthlyFeeId}
              onChange={e => handleInputChange('monthlyFeeId', e.target.value)}
              disabled={isSubmitting || isLoadingMonthlyFees}
              required={formData.connectPayment}
            >
              <option value="">Избери</option>
              {monthlyFees.map(fee => (
                <option key={fee.id} value={fee.id}>
                  {fee.name} ({fee.baseAmount.toFixed(2)} лв.)
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Reason Field */}
        <div>
          <Label htmlFor="reason">Основание</Label>
          <Input
            id="reason"
            type="text"
            value={formData.reason}
            onChange={e => handleInputChange('reason', e.target.value)}
            placeholder="Въведете основание"
            disabled={isSubmitting}
          />
        </div>

        {/* Payment Date Field */}
        <div>
          <Label htmlFor="paymentDate">Дата на Плащане *</Label>
          <Input
            id="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={e => handleInputChange('paymentDate', e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Issue Document Toggle */}
        <div>
          <Toggle
            id="issueDocument"
            pressed={formData.issueDocument}
            onPressedChange={value => {
              handleInputChange('issueDocument', value);
              // Reset document type when toggle is turned off
              if (!value) {
                handleInputChange('documentType', null);
              }
            }}
            disabled={isSubmitting}
            label="Издай Документ"
          />
        </div>

        {/* Document Type Selection - Only shown when issueDocument is true */}
        {formData.issueDocument && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Тип документ:</Label>
            
            {/* Invoice Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="invoice"
                checked={formData.documentType === 'invoice'}
                onChange={() => handleDocumentTypeChange('invoice')}
                disabled={isSubmitting}
              />
              <Label htmlFor="invoice" className="text-sm">
                Фактура
              </Label>
            </div>

            {/* Receipt Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="receipt"
                checked={formData.documentType === 'receipt'}
                onChange={() => handleDocumentTypeChange('receipt')}
                disabled={isSubmitting}
              />
              <Label htmlFor="receipt" className="text-sm">
                Квитанция
              </Label>
            </div>
          </div>
        )}

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
                Плащане...
              </>
            ) : (
              'Плати'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
