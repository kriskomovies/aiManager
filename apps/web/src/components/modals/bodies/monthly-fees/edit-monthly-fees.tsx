import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Minus, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';
import { selectModalData, closeModal } from '@/redux/slices/modal-slice';
import { useGetApartmentsByBuildingQuery } from '@/redux/services/apartment.service';
import {
  useGetMonthlyFeeByIdQuery,
  useUpdateMonthlyFeeMutation,
} from '@/redux/services/monthly-fee.service';
import {
  FeePaymentBasis,
  FeeApplicationMode,
  ICreateMonthlyFeeRequest,
} from '@repo/interfaces';

interface MonthlyFeeFormData {
  name: string;
  paymentBasis: FeePaymentBasis | '';
  amount: number;
  applicationMode: FeeApplicationMode;
  isDistributedEvenly: boolean;
  apartments: Array<{
    apartmentId: string;
    apartmentNumber: string;
    coefficient: number;
    description: string;
    isSelected: boolean;
  }>;
}

export function EditMonthlyFeesModal() {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const monthlyFeeId = modalData?.monthlyFeeId as string;

  // Fetch existing monthly fee data
  const {
    data: monthlyFee,
    isLoading: isLoadingFee,
    error: feeError,
  } = useGetMonthlyFeeByIdQuery(monthlyFeeId, {
    skip: !monthlyFeeId,
  });

  // Fetch apartments for the building
  const { data: apartments = [], isLoading: isLoadingApartments } =
    useGetApartmentsByBuildingQuery(monthlyFee?.buildingId || '', {
      skip: !monthlyFee?.buildingId,
    });

  // Update monthly fee mutation
  const [updateMonthlyFee, { isLoading: isUpdating }] =
    useUpdateMonthlyFeeMutation();

  const [formData, setFormData] = useState<MonthlyFeeFormData>({
    name: '',
    paymentBasis: '',
    amount: 0,
    applicationMode: FeeApplicationMode.MONTHLY_FEE,
    isDistributedEvenly: true,
    apartments: [],
  });

  // Initialize form with existing data
  useEffect(() => {
    if (monthlyFee && apartments.length > 0) {
      setFormData({
        name: monthlyFee.name,
        paymentBasis: monthlyFee.paymentBasis,
        amount: monthlyFee.baseAmount,
        applicationMode: monthlyFee.applicationMode,
        isDistributedEvenly: monthlyFee.isDistributedEvenly,
        apartments: apartments.map(apt => {
          const existingFee = monthlyFee.apartments?.find(
            fee => fee.apartmentId === apt.id
          );
          return {
            apartmentId: apt.id,
            apartmentNumber: apt.number,
            coefficient: existingFee?.coefficient || 1,
            description: existingFee?.description || '',
            isSelected: !!existingFee,
          };
        }),
      });
    }
  }, [monthlyFee, apartments]);

  const handleInputChange = (
    field: keyof MonthlyFeeFormData,
    value: string | number | boolean | FeePaymentBasis | FeeApplicationMode
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApartmentCoefficientChange = (
    apartmentId: string,
    coefficient: number
  ) => {
    setFormData(prev => ({
      ...prev,
      apartments: prev.apartments.map(apt =>
        apt.apartmentId === apartmentId
          ? { ...apt, coefficient: Math.max(1, coefficient) }
          : apt
      ),
    }));
  };

  const handleApartmentDescriptionChange = (
    apartmentId: string,
    description: string
  ) => {
    setFormData(prev => ({
      ...prev,
      apartments: prev.apartments.map(apt =>
        apt.apartmentId === apartmentId ? { ...apt, description } : apt
      ),
    }));
  };

  const handleApartmentSelectionChange = (
    apartmentId: string,
    isSelected: boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      apartments: prev.apartments.map(apt =>
        apt.apartmentId === apartmentId ? { ...apt, isSelected } : apt
      ),
    }));
  };

  const calculateApartmentFee = (
    apartment: MonthlyFeeFormData['apartments'][0]
  ) => {
    // If apartment is not selected, fee is 0
    if (!apartment.isSelected) {
      return 0;
    }

    if (formData.isDistributedEvenly) {
      return formData.amount;
    }

    const selectedApartments = formData.apartments.filter(
      apt => apt.isSelected
    );

    if (formData.applicationMode === FeeApplicationMode.MONTHLY_FEE) {
      return formData.amount * apartment.coefficient;
    } else {
      // Total mode - divide amount by total coefficients of selected apartments only
      const totalCoefficients = selectedApartments.reduce(
        (sum, apt) => sum + apt.coefficient,
        0
      );
      return totalCoefficients > 0
        ? (formData.amount * apartment.coefficient) / totalCoefficients
        : 0;
    }
  };

  // Calculate total amount that will be collected
  const calculateTotalCollectedAmount = () => {
    if (formData.isDistributedEvenly) {
      if (formData.applicationMode === FeeApplicationMode.TOTAL) {
        // For "Общо" mode with even distribution, total is just the input amount
        return formData.amount;
      } else {
        // For "Месечна Такса" mode with even distribution, multiply by selected count
        const selectedCount = formData.apartments.filter(
          apt => apt.isSelected
        ).length;
        return formData.amount * selectedCount;
      }
    }

    // When distribution is not even, sum up all calculated fees
    return formData.apartments.reduce((total, apartment) => {
      return total + calculateApartmentFee(apartment);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.paymentBasis ||
      formData.amount <= 0
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

    const selectedApartments = formData.apartments.filter(
      apt => apt.isSelected
    );

    if (selectedApartments.length === 0) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Моля изберете поне един апартамент.',
          duration: 5000,
        })
      );
      return;
    }

    try {
      const updateData: Partial<ICreateMonthlyFeeRequest> = {
        name: formData.name.trim(),
        paymentBasis: formData.paymentBasis as FeePaymentBasis,
        applicationMode: formData.applicationMode,
        baseAmount: formData.amount,
        isDistributedEvenly: formData.isDistributedEvenly,
        apartments: selectedApartments.map(apt => ({
          apartmentId: apt.apartmentId,
          coefficient: apt.coefficient,
          description: apt.description.trim() || undefined,
          isSelected: apt.isSelected,
        })),
      };

      await updateMonthlyFee({ id: monthlyFeeId, ...updateData }).unwrap();

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно редактиране!',
          message: `Месечната такса "${formData.name}" беше редактирана успешно.`,
          duration: 5000,
        })
      );

      dispatch(closeModal());
    } catch {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка при редактиране',
          message:
            'Възникна грешка при редактирането на месечната такса. Моля опитайте отново.',
          duration: 5000,
        })
      );
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const paymentBasisOptions = [
    { value: FeePaymentBasis.APARTMENT, label: 'Апартамент' },
    { value: FeePaymentBasis.RESIDENT, label: 'Живущ' },
    { value: FeePaymentBasis.PET, label: 'Домашно Животно' },
    { value: FeePaymentBasis.COMMON_PARTS, label: 'Общи части' },
    { value: FeePaymentBasis.QUADRATURE, label: 'Квадратура' },
  ];

  if (isLoadingFee || isLoadingApartments) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Зареждане на данни...</p>
        </div>
      </div>
    );
  }

  if (feeError || !monthlyFee) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500">Грешка при зареждане на данните</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col max-h-[80vh]">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-900">
          Редактиране на Месечна Такса
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

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
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
              placeholder="Въведете име на таксата"
              className="mt-1"
              required
            />
          </div>

          {/* Payment Basis */}
          <div>
            <Label
              htmlFor="paymentBasis"
              className="text-sm font-medium text-gray-700"
            >
              Плащане на База
            </Label>
            <Select
              id="paymentBasis"
              value={formData.paymentBasis}
              onChange={e => handleInputChange('paymentBasis', e.target.value)}
              className="mt-1"
              required
            >
              <option value="" disabled>
                Избери
              </option>
              {paymentBasisOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Amount Field */}
          <div>
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700"
            >
              Сума
            </Label>
            <div className="mt-1 relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={e =>
                  handleInputChange('amount', parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
                className="pr-12"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                лв.
              </span>
            </div>

            {/* Application Mode Tabs */}
            <div className="mt-3 grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() =>
                  handleInputChange(
                    'applicationMode',
                    FeeApplicationMode.MONTHLY_FEE
                  )
                }
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  formData.applicationMode === FeeApplicationMode.MONTHLY_FEE
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Месечна Такса
              </button>
              <button
                type="button"
                onClick={() =>
                  handleInputChange('applicationMode', FeeApplicationMode.TOTAL)
                }
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  formData.applicationMode === FeeApplicationMode.TOTAL
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Общо
              </button>
            </div>
          </div>

          {/* Total Collected Amount - Always visible */}
          <div>
            <Label
              htmlFor="totalAmount"
              className="text-sm font-medium text-gray-700"
            >
              Общо събрана сума
            </Label>
            <div className="mt-1 relative">
              <Input
                id="totalAmount"
                type="text"
                value={`${calculateTotalCollectedAmount().toFixed(2)} лв.`}
                disabled
                className="pr-12 bg-gray-50 text-gray-600"
                readOnly
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                от избрани апартаменти
              </span>
            </div>
          </div>

          {/* Distribution Toggle */}
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDistributedEvenly}
                onChange={e =>
                  handleInputChange('isDistributedEvenly', e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
            <span className="text-sm font-medium text-gray-700">
              Разпредели равномерно между всички апартаменти
            </span>
          </div>

          {/* Apartment List - Only show when distribution is not even */}
          {!formData.isDistributedEvenly && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-5 gap-6 text-sm font-medium text-gray-700">
                  <div className="text-center">Ап.</div>
                  <div className="text-center">Коефициент</div>
                  <div className="text-center">Описание</div>
                  <div className="text-center">Такса</div>
                  <div className="text-center">Избрани</div>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {formData.apartments.map(apartment => (
                  <div
                    key={apartment.apartmentId}
                    className="grid grid-cols-5 gap-6 items-center px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Apartment Number */}
                    <div className="text-center font-medium text-gray-900">
                      {apartment.apartmentNumber}
                    </div>

                    {/* Coefficient Controls */}
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleApartmentCoefficientChange(
                            apartment.apartmentId,
                            apartment.coefficient - 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          apartment.coefficient <= 1 || !apartment.isSelected
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span
                        className={`w-12 text-center font-medium text-lg ${
                          apartment.isSelected
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {apartment.coefficient}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleApartmentCoefficientChange(
                            apartment.apartmentId,
                            apartment.coefficient + 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!apartment.isSelected}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Description */}
                    <div className="px-2">
                      <Input
                        type="text"
                        value={apartment.description}
                        onChange={e =>
                          handleApartmentDescriptionChange(
                            apartment.apartmentId,
                            e.target.value
                          )
                        }
                        placeholder="Въведи..."
                        className={`text-sm text-center ${
                          !apartment.isSelected
                            ? 'bg-gray-50 text-gray-400'
                            : ''
                        }`}
                        disabled={!apartment.isSelected}
                      />
                    </div>

                    {/* Calculated Fee */}
                    <div
                      className={`text-center font-medium ${
                        apartment.isSelected ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {calculateApartmentFee(apartment).toFixed(2)} лв.
                    </div>

                    {/* Selection Checkbox */}
                    <div className="flex justify-center">
                      <Checkbox
                        checked={apartment.isSelected}
                        onChange={e =>
                          handleApartmentSelectionChange(
                            apartment.apartmentId,
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Fixed Footer with Action Buttons */}
      <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 flex-shrink-0 bg-white">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isUpdating}
          className="px-6"
        >
          Отказ
        </Button>
        <Button
          type="submit"
          disabled={isUpdating}
          onClick={handleSubmit}
          className="bg-red-500 hover:bg-red-600 px-6"
        >
          {isUpdating ? 'Запазване...' : 'Запази'}
        </Button>
      </div>
    </div>
  );
}
