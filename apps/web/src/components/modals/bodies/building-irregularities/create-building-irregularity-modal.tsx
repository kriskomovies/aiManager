import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Plus, Loader2, Upload } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';
import { useGetBuildingsQuery } from '@/redux/services/building.service';

interface BuildingIrregularityFormData {
  buildingId: string;
  apartmentId?: string;
  title: string;
  description: string;
  status: 'докладвана' | 'планувана' | 'в процес' | 'оправена' | 'отказана';
  attachedFile?: File | null;
  date: string;
}

interface CreateBuildingIrregularityModalProps {
  onClose: () => void;
}

export function CreateBuildingIrregularityModal({ onClose }: CreateBuildingIrregularityModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  
  // Get the building ID from modal data (passed from the irregularities tab)
  const preselectedBuildingId = modalData?.buildingId;

  // Fetch buildings for dropdown
  const { data: buildingsResponse } = useGetBuildingsQuery({
    page: 1,
    pageSize: 100, // Get enough buildings for dropdown
  });



  const [formData, setFormData] = useState<BuildingIrregularityFormData>({
    buildingId: preselectedBuildingId || '',
    apartmentId: '',
    title: '',
    description: '',
    status: 'докладвана',
    attachedFile: null,
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update buildingId when preselected building changes
  useEffect(() => {
    if (preselectedBuildingId) {
      setFormData(prev => ({
        ...prev,
        buildingId: preselectedBuildingId
      }));
    }
  }, [preselectedBuildingId]);

  const handleInputChange = (field: keyof BuildingIrregularityFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      attachedFile: file
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.buildingId || !formData.title.trim() || !formData.description.trim()) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Моля попълнете всички задължителни полета.',
        duration: 5000
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual create API call
      console.log('Creating building irregularity with data:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(addAlert({
        type: 'success',
        title: 'Успешно създаване!',
        message: 'Нередността беше създадена успешно.',
        duration: 5000
      }));
      
      onClose();
    } catch (error) {
      console.error('Error creating building irregularity:', error);
      
      // Handle different types of errors
      let errorMessage = 'Възникна грешка при създаването на нередността. Моля опитайте отново.';
      
      if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
        errorMessage = String(error.data.message);
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка при създаване',
        message: errorMessage,
        duration: 5000
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const statusOptions = [
    { value: 'докладвана', label: 'Докладвана' },
    { value: 'планувана', label: 'Планувана' },
    { value: 'в процес', label: 'В Процес' },
    { value: 'оправена', label: 'Оправена' },
    { value: 'отказана', label: 'Отказана' },
  ];

  const buildingOptions = buildingsResponse?.items?.map(building => ({
    value: building.id,
    label: building.name
  })) || [];

  // Mock apartment options for the selected building
  const apartmentOptions = formData.buildingId ? [
    { value: '', label: 'Избери' },
    { value: 'apt1', label: 'Апартамент 1' },
    { value: 'apt2', label: 'Апартамент 2' },
    { value: 'apt3', label: 'Апартамент 3' },
    { value: 'apt4', label: 'Апартамент 4' },
    { value: 'apt5', label: 'Апартамент 5' },
  ] : [{ value: '', label: 'Избери' }];

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
        <Plus className="h-6 w-6 text-green-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Нова Нередност
      </h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Building Selection */}
          <div>
            <Label htmlFor="building">Сграда</Label>
            <Select
              id="building"
              value={formData.buildingId}
              onChange={(e) => handleInputChange('buildingId', e.target.value)}
              disabled={isSubmitting || !!preselectedBuildingId} // Disable if preselected
              required
            >
              <option value="">Избери</option>
              {buildingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Apartment Selection */}
          <div>
            <Label htmlFor="apartment">Апартамент</Label>
            <Select
              id="apartment"
              value={formData.apartmentId || ''}
              onChange={(e) => handleInputChange('apartmentId', e.target.value)}
              disabled={isSubmitting || !formData.buildingId}
            >
              {apartmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Статус</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as BuildingIrregularityFormData['status'])}
              disabled={isSubmitting}
              required
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Дата</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title">Заглавие</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Въведете заглавие на нередността"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Описание</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Въведете описание на нередността"
            disabled={isSubmitting}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <Label htmlFor="attachedFile">Файл</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('attachedFile')?.click()}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Добави Файл
            </Button>
            <input
              id="attachedFile"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={isSubmitting}
              className="hidden"
            />
            {formData.attachedFile && (
              <span className="text-sm text-gray-600">
                {formData.attachedFile.name}
              </span>
            )}
          </div>
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
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Добавяне...
              </>
            ) : (
              'Добави'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
