import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Plus, Minus, Loader2, Calendar } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';

interface CreateTemporaryFeeFormData {
  name: string;
  paymentBasis: string;
  startDate: string;
  monthsCount: number;
  amount: number;
  feeType: 'monthly' | 'total';
  distributeEvenly: boolean;
  apartments: Array<{
    apartmentId: string;
    apartmentNumber: string;
    coefficient: number;
    description: string;
    isSelected: boolean;
  }>;
}

interface CreateTemporaryFeeModalProps {
  onClose: () => void;
}

export function CreateTemporaryFeeModal({
  onClose,
}: CreateTemporaryFeeModalProps) {
  const dispatch = useAppDispatch();

  // Mock apartments data
  const mockApartments = [
    { apartmentId: '1', apartmentNumber: '1', coefficient: 1, description: '', isSelected: true },
    { apartmentId: '2', apartmentNumber: '2', coefficient: 1, description: '', isSelected: true },
    { apartmentId: '3', apartmentNumber: '3', coefficient: 1, description: '', isSelected: true },
    { apartmentId: '4', apartmentNumber: '4', coefficient: 1, description: '', isSelected: true },
    { apartmentId: '5', apartmentNumber: '5', coefficient: 1, description: '', isSelected: true },
    { apartmentId: '6', apartmentNumber: '6', coefficient: 1, description: '', isSelected: true },
  ];

  const [formData, setFormData] = useState<CreateTemporaryFeeFormData>({
    name: '',
    paymentBasis: '',
    startDate: '',
    monthsCount: 1,
    amount: 0,
    feeType: 'monthly',
    distributeEvenly: true,
    apartments: mockApartments,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock payment basis options
  const paymentBasisOptions = [
    { value: 'apartment', label: 'По апартамент' },
    { value: 'resident', label: 'По жител' },
    { value: 'quadrature', label: 'По квадратура' },
    { value: 'common-parts', label: 'По общи части' },
    { value: 'custom', label: 'Персонализирано' },
  ];

  const handleInputChange = (
    field: keyof CreateTemporaryFeeFormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMonthsCountChange = (increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      monthsCount: increment 
        ? prev.monthsCount + 1 
        : Math.max(1, prev.monthsCount - 1),
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
        apt.apartmentId === apartmentId
          ? { ...apt, description }
          : apt
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
        apt.apartmentId === apartmentId
          ? { ...apt, isSelected }
          : apt
      ),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.paymentBasis || !formData.startDate || formData.amount <= 0) {
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
      // TODO: Implement actual API call for creating temporary fee
      console.log('Creating temporary fee with data:', formData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно създаване!',
          message: 'Временната такса беше създадена успешно.',
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error creating temporary fee:', error);

      const errorMessage =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as { message?: string })?.message ||
        'Възникна грешка при създаването на временната такса. Моля опитайте отново.';

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
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Създаване на Временна Такса
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

      {/* Scrollable Content */}
      <div className="p-6 max-h-[calc(90vh-160px)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <Label htmlFor="name">Име</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Въведете име на таксата"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Payment Basis Field */}
        <div>
          <Label htmlFor="paymentBasis">Плащане на База</Label>
          <Select
            id="paymentBasis"
            value={formData.paymentBasis}
            onChange={e => handleInputChange('paymentBasis', e.target.value)}
            disabled={isSubmitting}
            required
          >
            <option value="">Избери</option>
            {paymentBasisOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Start Date and Months Count Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Date Field */}
          <div>
            <Label htmlFor="startDate">Начална Дата</Label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={e => handleInputChange('startDate', e.target.value)}
                disabled={isSubmitting}
                required
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

                     {/* Months Count Field */}
           <div>
             <Label htmlFor="monthsCount">Брой Месеци</Label>
             <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
               <button
                 type="button"
                 onClick={() => handleMonthsCountChange(false)}
                 disabled={isSubmitting || formData.monthsCount <= 1}
                 className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 <Minus className="h-4 w-4" />
               </button>
               <div className="flex-1 text-center py-2 font-semibold text-blue-600 bg-gray-50 border-l border-r border-gray-300 min-w-[60px]">
                 {formData.monthsCount}
               </div>
               <button
                 type="button"
                 onClick={() => handleMonthsCountChange(true)}
                 disabled={isSubmitting}
                 className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 <Plus className="h-4 w-4" />
               </button>
             </div>
           </div>
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
              placeholder="0.00"
              disabled={isSubmitting}
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              лв.
            </span>
          </div>
        </div>

        {/* Fee Type Toggle */}
        <div>
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => handleInputChange('feeType', 'monthly')}
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                formData.feeType === 'monthly'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Месечна Такса
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('feeType', 'total')}
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                formData.feeType === 'total'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Общо
            </button>
          </div>
        </div>

                 {/* Distribute Evenly Toggle */}
         <div className="flex items-center justify-between py-2">
           <Label htmlFor="distributeEvenly" className="text-sm font-medium text-gray-700">
             Разпредели равномерно между всички апартаменти
           </Label>
           <button
             type="button"
             onClick={() => handleInputChange('distributeEvenly', !formData.distributeEvenly)}
             disabled={isSubmitting}
             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
               formData.distributeEvenly
                 ? 'bg-red-600'
                 : 'bg-gray-200'
             }`}
           >
             <span
               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                 formData.distributeEvenly ? 'translate-x-6' : 'translate-x-1'
               }`}
             />
           </button>
         </div>

         {/* Apartment Distribution Table */}
         {!formData.distributeEvenly && (
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

             <div className="max-h-96 overflow-y-auto">
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
                   <div className="flex items-center justify-center">
                     <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                       <button
                         type="button"
                         onClick={() =>
                           handleApartmentCoefficientChange(
                             apartment.apartmentId,
                             apartment.coefficient - 1
                           )
                         }
                         disabled={isSubmitting || apartment.coefficient <= 1}
                         className="flex items-center justify-center w-8 h-8 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         <Minus className="h-3 w-3" />
                       </button>
                       <div className="w-12 text-center py-1 text-sm font-medium bg-gray-50 border-l border-r border-gray-300">
                         {apartment.coefficient}
                       </div>
                       <button
                         type="button"
                         onClick={() =>
                           handleApartmentCoefficientChange(
                             apartment.apartmentId,
                             apartment.coefficient + 1
                           )
                         }
                         disabled={isSubmitting}
                         className="flex items-center justify-center w-8 h-8 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         <Plus className="h-3 w-3" />
                       </button>
                     </div>
                   </div>

                   {/* Description */}
                   <div>
                     <Input
                       type="text"
                       value={apartment.description}
                       onChange={e =>
                         handleApartmentDescriptionChange(
                           apartment.apartmentId,
                           e.target.value
                         )
                       }
                       placeholder="Описание"
                       disabled={isSubmitting}
                       className="text-sm"
                     />
                   </div>

                   {/* Calculated Fee */}
                   <div className="text-center font-medium text-gray-900">
                     {formData.amount > 0
                       ? (formData.amount * apartment.coefficient).toFixed(2)
                       : '0.00'}{' '}
                     лв.
                   </div>

                   {/* Selection Checkbox */}
                   <div className="flex justify-center">
                     <input
                       type="checkbox"
                       checked={apartment.isSelected}
                       onChange={e =>
                         handleApartmentSelectionChange(
                           apartment.apartmentId,
                           e.target.checked
                         )
                       }
                       disabled={isSubmitting}
                       className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                     />
                   </div>
                 </div>
               ))}
             </div>
           </div>
                  )}
        </form>
      </div>

      {/* Footer with Action Buttons */}
      <div className="p-6 pb-8 border-t border-gray-200 flex justify-end items-center bg-gray-50">
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
                Създаване...
              </>
            ) : (
              'Създай'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
