import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeModal, selectModalData } from '@/redux/slices/modal-slice';
import { useGetMonthlyFeeByIdQuery } from '@/redux/services/monthly-fee.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FeePaymentBasis,
  FeeApplicationMode,
  IMonthlyFeeApartment,
} from '@repo/interfaces';

interface ExtendedMonthlyFeeApartment extends IMonthlyFeeApartment {
  apartment?: {
    number: string;
    floor: number;
    type: string;
  };
}

export function ViewMonthlyFeesModal() {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const monthlyFeeId = modalData?.monthlyFeeId as string;

  const {
    data: monthlyFee,
    isLoading,
    error,
  } = useGetMonthlyFeeByIdQuery(monthlyFeeId, {
    skip: !monthlyFeeId,
  });

  const handleClose = () => {
    dispatch(closeModal());
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Зареждане...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !monthlyFee) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-red-500">Грешка при зареждане на данните</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const getPaymentBasisText = (basis: FeePaymentBasis) => {
    const map: Record<FeePaymentBasis, string> = {
      [FeePaymentBasis.APARTMENT]: 'Апартамент',
      [FeePaymentBasis.RESIDENT]: 'Живущ',
      [FeePaymentBasis.PET]: 'Домашно Животно',
      [FeePaymentBasis.COMMON_PARTS]: 'Общи части',
      [FeePaymentBasis.QUADRATURE]: 'Квадратура',
    };
    return map[basis] || basis;
  };

  const getApplicationModeText = (mode: FeeApplicationMode) => {
    return mode === FeeApplicationMode.MONTHLY_FEE ? 'Месечна Такса' : 'Общо';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Месечна Такса</h2>
        <button
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        {/* Fee Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Име
          </label>
          <p className="text-lg font-medium text-gray-900">{monthlyFee.name}</p>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Плащане на База
            </label>
            <Badge variant="neutral" className="text-sm">
              {getPaymentBasisText(monthlyFee.paymentBasis)}
            </Badge>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сума
            </label>
            <p className="text-lg font-medium text-gray-900">
              {(monthlyFee.baseAmount || 0).toFixed(2)} лв{' '}
              {getApplicationModeText(monthlyFee.applicationMode)}
            </p>
          </div>
        </div>

        {/* Apartments Table */}
        {monthlyFee.apartments && monthlyFee.apartments.length > 0 && (
          <div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Ап.
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Коефициент
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Описание
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Такса
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlyFee.apartments.map(apartmentFee => (
                    <tr
                      key={apartmentFee.apartmentId}
                      className="hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {(apartmentFee as ExtendedMonthlyFeeApartment)
                          ?.apartment?.number ||
                          apartmentFee.apartmentId.slice(-2)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {apartmentFee.coefficient}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {apartmentFee.description || '-'}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {(apartmentFee.amount || 0).toFixed(2)} лв.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Total Collected Amount */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Общо събрана сума
          </label>
          <p className="text-xl font-semibold text-gray-900">
            {(
              monthlyFee.apartments?.reduce(
                (total, apt) => total + (apt.amount || 0),
                0
              ) || 0
            ).toFixed(2)}{' '}
            лв.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
        <Button variant="secondary" onClick={handleClose}>
          Затвори
        </Button>
      </div>
    </motion.div>
  );
}
