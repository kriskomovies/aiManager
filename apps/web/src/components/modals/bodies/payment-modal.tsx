import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeModal, selectModalData } from '@/redux/slices/modal-slice';

interface FeeItem {
  id: string;
  feeType: string;
  period: string;
  amount: number;
  manualAmount?: number;
}

const mockFeeData: FeeItem[] = [
  {
    id: '1',
    feeType: 'Такса 01/25',
    period: 'Януари 2025',
    amount: 70.0,
  },
  {
    id: '2',
    feeType: 'Ток Стълбище',
    period: 'Януари 2025',
    amount: 100.0,
  },
  {
    id: '3',
    feeType: 'Такса Асансьор',
    period: 'Януари 2025',
    amount: 50.0,
  },
];

export function PaymentModal() {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const apartmentNumber = modalData?.apartmentNumber || '7';

  const [paymentMode, setPaymentMode] = useState<'all' | 'manual'>('all');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const [feeItems, setFeeItems] = useState<FeeItem[]>(mockFeeData);

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleManualAmountChange = (id: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setFeeItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, manualAmount: numericValue } : item
      )
    );
  };

  const totalAmount = feeItems.reduce((sum, item) => {
    if (paymentMode === 'manual') {
      return sum + (item.manualAmount || 0);
    }
    return sum + item.amount;
  }, 0);

  const paymentMethodOptions = [
    { value: 'cashier', label: 'Касиер' },
    { value: 'deposit', label: 'Плащане от депозит' },
    { value: 'bank-account', label: 'По сметка' },
    { value: 'e-pay', label: 'През Е-Пей' },
    { value: 'easy-pay', label: 'През Изи-Пей' },
    { value: 'expense-refund', label: 'Възстановяване от разход' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Плащане</h2>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Apartment Info */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Задължения Апартамент {apartmentNumber}
          </span>
          <span className="bg-gray-100 rounded-full px-4 py-1 text-gray-600">
            Абониментен Номер: 123456
          </span>
        </div>

        {/* Total Amount */}
        <div className="text-xl font-semibold text-red-500">
          {totalAmount.toFixed(2)} лв.
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paidByUser">Платено от Потребител</Label>
            <Select
              id="paidByUser"
              value={paidByUser}
              onChange={e => setPaidByUser(e.target.value)}
            >
              <option value="">Изберете потребител</option>
              {/* Empty for now as requested */}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Метод на Плащане</Label>
            <Select
              id="paymentMethod"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <option value="">Изберете метод</option>
              {paymentMethodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Payment Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={paymentMode === 'all' ? 'default' : 'outline'}
            onClick={() => setPaymentMode('all')}
            className={
              paymentMode === 'all'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : ''
            }
          >
            Плати Всичко
          </Button>
          <Button
            variant={paymentMode === 'manual' ? 'default' : 'outline'}
            onClick={() => setPaymentMode('manual')}
            className={
              paymentMode === 'manual'
                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                : ''
            }
          >
            Въведи Ръчно
          </Button>
        </div>

        {/* Fees Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm font-medium text-gray-700">
                <th className="px-4 py-3 border-b">Такса</th>
                <th className="px-4 py-3 border-b">Период</th>
                <th className="px-4 py-3 border-b">Сума</th>
                {paymentMode === 'manual' && (
                  <th className="px-4 py-3 border-b">Сума за плащане</th>
                )}
              </tr>
            </thead>
            <tbody>
              {feeItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b text-sm">{item.feeType}</td>
                  <td className="px-4 py-3 border-b text-sm">{item.period}</td>
                  <td className="px-4 py-3 border-b text-sm">
                    {item.amount.toFixed(2)} лв.
                  </td>
                  {paymentMode === 'manual' && (
                    <td className="px-4 py-3 border-b">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={item.amount}
                        value={item.manualAmount?.toString() || ''}
                        onChange={e =>
                          handleManualAmountChange(item.id, e.target.value)
                        }
                        placeholder="0.00"
                        className="w-24"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Row */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center font-semibold text-red-500">
            <span>Обща Сума за Плащане</span>
            <span>{totalAmount.toFixed(2)} лв.</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
        <Button onClick={handleClose} variant="outline">
          Отказ
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={!paymentMethod || totalAmount === 0}
        >
          Плати
        </Button>
      </div>
    </motion.div>
  );
}
