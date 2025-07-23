import { useState } from 'react';
import { X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectModalData, closeModal } from '@/redux/slices/modal-slice';
import { useGetActiveUserPaymentMethodsQuery } from '@/redux/services/payment-method.service';
import { useGetBuildingApartmentFeesQuery } from '@/redux/services/monthly-fee.service';
import { useGetApartmentByIdQuery } from '@/redux/services/apartment.service';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { IBuildingApartmentFeesResponse } from '@repo/interfaces';

interface FeePaymentAmount {
  [feeId: string]: number;
}

export function CashierPaymentModal() {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const [paymentMode, setPaymentMode] = useState<'pay-all' | 'manual'>('pay-all');
  const [selectedResident, setSelectedResident] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [feePaymentAmounts, setFeePaymentAmounts] = useState<FeePaymentAmount>({});

  // Extract data from modal
  const apartmentId = (modalData?.apartmentId as string) || '';
  const apartmentNumber = (modalData?.apartmentNumber as string) || '';
  const subscriptionNumber = (modalData?.subscriptionNumber as string) || '123456';
  const buildingId = (modalData?.buildingId as string) || '';
  const totalAmount = (modalData?.totalAmount as number) || 0;

  // Fetch payment methods
  const { data: paymentMethods = [] } = useGetActiveUserPaymentMethodsQuery();

  // Fetch apartment data to get residents
  const { data: apartmentDetails } = useGetApartmentByIdQuery(apartmentId, {
    skip: !apartmentId,
  });
  
  // Fetch apartment fees data
  const { data: apartmentFeesData = [] } = useGetBuildingApartmentFeesQuery(buildingId);
  
  // Find the specific apartment fees data
  const apartmentData = apartmentFeesData.find(
    (data: IBuildingApartmentFeesResponse) => data.apartment.id === apartmentId
  );

  const residents = apartmentDetails?.residents || [];
  const fees = apartmentData?.fees || [];

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handlePayment = () => {
    // TODO: Implement payment functionality
    const paymentData = {
      apartmentId,
      selectedResident,
      selectedPaymentMethod,
      paymentMode,
      amount: paymentMode === 'pay-all' ? totalAmount : calculateTotalManualAmount(),
      feeBreakdown: paymentMode === 'manual' ? feePaymentAmounts : undefined,
    };
    console.log('Processing payment:', paymentData);
    handleClose();
  };

  const handleFeeAmountChange = (feeId: string, amount: string) => {
    const numericAmount = parseFloat(amount) || 0;
    setFeePaymentAmounts(prev => ({
      ...prev,
      [feeId]: numericAmount,
    }));
  };

  const calculateTotalManualAmount = () => {
    return Object.values(feePaymentAmounts).reduce((sum, amount) => sum + amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} лв.`;
  };

  // Loading state
  if (!apartmentData) {
    return (
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 text-center">
          <p>Зареждане...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Плащане</h2>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span>
              Задължения:{' '}
              <span className="font-bold text-gray-900">Апартмент {apartmentNumber}</span>
            </span>
            <div className="flex items-center gap-2">
              <span>Абонаментен Номер:</span>
              <Badge variant="neutral" className="font-mono text-xs">
                {subscriptionNumber}
              </Badge>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                 {/* Total Amount */}
         <div className="text-center">
           <div className="text-3xl font-bold text-red-600">
             {formatCurrency(totalAmount as number)}
           </div>
         </div>

        {/* Paid by User Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Платено от Потребител
          </label>
          <Select
            value={selectedResident}
            onChange={(e) => setSelectedResident(e.target.value)}
            className="w-full"
          >
            <option value="">Избери</option>
                         {residents.map((resident: { id: string; name: string; surname: string }) => (
               <option key={resident.id} value={resident.id}>
                 {resident.name} {resident.surname}
               </option>
             ))}
          </Select>
        </div>

        {/* Payment Method Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Метод на Плащане
          </label>
          <Select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-full"
          >
            <option value="">Избери</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.displayName}
              </option>
            ))}
          </Select>
        </div>

        {/* Payment Amount Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Сума
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMode('pay-all')}
              className={`flex-1 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                paymentMode === 'pay-all'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Плати Всичко
            </button>
            <button
              onClick={() => setPaymentMode('manual')}
              className={`flex-1 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                paymentMode === 'manual'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Въведи Ръчно
            </button>
          </div>

          {/* Manual Amount Display for Manual Mode */}
          {paymentMode === 'manual' && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Обща сума за плащане:</span>
                <span className="text-lg font-bold text-red-600">
                  {formatCurrency(calculateTotalManualAmount())}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Fees Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              {paymentMode === 'pay-all' ? 'Такса 01/25' : 'Частично Плащане'}
            </h4>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Такса
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Период
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    Сума
                  </th>
                  {paymentMode === 'manual' && (
                    <th className="text-right py-3 px-4 font-medium text-gray-700 w-32">
                      Сума за Плащане
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.id} className="border-t border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {fee.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      Януари 2025
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {formatCurrency(fee.amount)}
                    </td>
                    {paymentMode === 'manual' && (
                      <td className="py-3 px-4 text-right">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={feePaymentAmounts[fee.id] || ''}
                          onChange={(e) => handleFeeAmountChange(fee.id, e.target.value)}
                          className="w-full text-right text-sm h-8"
                          step="0.01"
                          min="0"
                          max={fee.amount}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {fees.length === 0 && (
            <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
              Няма такси за този апартамент
            </div>
          )}
        </div>

        {/* Total Payment Summary */}
        {paymentMode === 'pay-all' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-600">Обща Сума за Плащане</span>
                             <span className="text-xl font-bold text-red-600">
                 {formatCurrency(totalAmount as number)}
               </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50">
        <Button
          variant="ghost"
          onClick={handleClose}
          className="px-8"
        >
          Отказ
        </Button>
        <Button
          onClick={handlePayment}
          disabled={
            !selectedResident || 
            !selectedPaymentMethod || 
            (paymentMode === 'manual' && calculateTotalManualAmount() === 0)
          }
          className="px-8 bg-red-600 hover:bg-red-700 text-white"
        >
          Плати
        </Button>
      </div>
    </div>
  );
}
