import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarIcon, MapPin, DollarSign, Building } from 'lucide-react';
import { IrregularityPriority } from '@repo/interfaces';
import { addEditIrregularitySchema, AddEditIrregularityFormData } from './add-edit-irregularity.schema';

interface AddEditIrregularityPageProps {
  mode: 'create' | 'edit';
}

export function AddEditIrregularityPage({ mode }: AddEditIrregularityPageProps) {
  const { id: irregularityId } = useParams();
  const navigate = useNavigate();
  // Mock data for dropdowns
  const mockBuildings = [
    { id: '1', name: 'Сграда А', address: 'ул. Витоша 15' },
    { id: '2', name: 'Сграда Б', address: 'ул. Раковски 22' },
    { id: '3', name: 'Сграда В', address: 'бул. Васил Левски 8' },
  ];

  const mockApartments = [
    { id: '1', number: '1А', floor: 1, buildingId: '1' },
    { id: '2', number: '2Б', floor: 2, buildingId: '1' },
    { id: '3', number: '12А', floor: 12, buildingId: '1' },
    { id: '4', number: '5А', floor: 5, buildingId: '2' },
    { id: '5', number: '8Б', floor: 8, buildingId: '2' },
  ];

  const mockUsers = [
    { id: '1', name: 'Петър Димитров', role: 'Мениджър' },
    { id: '2', name: 'Георги Стоянов', role: 'Техник' },
    { id: '3', name: 'Димитър Христов', role: 'Майстор' },
  ];

  // Mock existing irregularity data for edit mode
  const mockIrregularity = mode === 'edit' ? {
    id: irregularityId,
    title: 'Неработещ асансьор',
    description: 'Асансьорът спира между 3-ти и 4-ти етаж. Трябва спешен ремонт.',
    buildingId: '1',
    apartmentId: '',
    priority: IrregularityPriority.HIGH,
    location: 'Входно фоайе',
    expectedCompletionDate: '2024-02-15',
    estimatedCost: 500,
    assignedUserId: '2',
  } : null;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddEditIrregularityFormData>({
    resolver: zodResolver(addEditIrregularitySchema),
    defaultValues: mockIrregularity || {
      title: '',
      description: '',
      buildingId: '',
      apartmentId: '',
      priority: IrregularityPriority.MEDIUM,
      location: '',
      expectedCompletionDate: '',
      estimatedCost: undefined,
      assignedUserId: '',
    },
  });

  const selectedBuildingId = watch('buildingId');
  const selectedPriority = watch('priority');

  const filteredApartments = mockApartments.filter(
    apt => apt.buildingId === selectedBuildingId
  );

  const onSubmit = async (data: AddEditIrregularityFormData) => {
    try {
      console.log('Form data:', data);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (mode === 'create') {
        console.log('Creating new irregularity:', data);
      } else {
        console.log('Updating irregularity:', irregularityId, data);
      }
      
      // Navigate back to list or details page
      if (mode === 'create') {
        navigate('/irregularities');
      } else {
        navigate(`/irregularities/${irregularityId}`);
      }
    } catch (error) {
      console.error('Error saving irregularity:', error);
    }
  };

  const getPriorityBadge = (priority: IrregularityPriority) => {
    const priorityMap = {
      [IrregularityPriority.LOW]: { label: 'Ниска', variant: 'neutral' as const },
      [IrregularityPriority.MEDIUM]: { label: 'Средна', variant: 'warning' as const },
      [IrregularityPriority.HIGH]: { label: 'Висока', variant: 'negative' as const },
      [IrregularityPriority.URGENT]: { label: 'Спешна', variant: 'negative' as const },
    };

    const config = priorityMap[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <motion.button
              onClick={() => {
                if (mode === 'edit' && irregularityId) {
                  navigate(`/irregularities/${irregularityId}`);
                } else {
                  navigate('/irregularities');
                }
              }}
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                {mode === 'create' ? 'Нова нередност' : 'Редактиране на нередност'}
              </h1>
              <p className="text-sm text-gray-500">
                {mode === 'create' 
                  ? 'Докладвайте нова нередност в сградата'
                  : 'Актуализирайте информацията за нередността'
                }
              </p>
            </div>
          </div>

          {mode === 'edit' && selectedPriority && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-gray-600">Приоритет:</span>
              {getPriorityBadge(selectedPriority)}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Основна информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Заглавие *</Label>
                  <Input
                    id="title"
                    placeholder="Кратко описание на проблема"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Подробно описание</Label>
                  <Textarea
                    id="description"
                    placeholder="Детайлно описание на нередността..."
                    rows={4}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Локация</Label>
                  <Input
                    id="location"
                    placeholder="Точно местоположение (напр. входно фоайе, мазе)"
                    {...register('location')}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Приоритет *</Label>
                  <Select id="priority" {...register('priority')}>
                    <option value="">Изберете приоритет</option>
                    <option value={IrregularityPriority.LOW}>Ниска</option>
                    <option value={IrregularityPriority.MEDIUM}>Средна</option>
                    <option value={IrregularityPriority.HIGH}>Висока</option>
                    <option value={IrregularityPriority.URGENT}>Спешна</option>
                  </Select>
                  {errors.priority && (
                    <p className="text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location & Assignment */}
          <div className="space-y-6">
            {/* Building & Apartment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Местоположение
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Building */}
                <div className="space-y-2">
                  <Label htmlFor="buildingId">Сграда *</Label>
                  <Select 
                    id="buildingId" 
                    {...register('buildingId')}
                    onChange={(e) => {
                      setValue('buildingId', e.target.value);
                      setValue('apartmentId', ''); // Reset apartment when building changes
                    }}
                  >
                    <option value="">Изберете сграда</option>
                    {mockBuildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name} - {building.address}
                      </option>
                    ))}
                  </Select>
                  {errors.buildingId && (
                    <p className="text-sm text-red-600">{errors.buildingId.message}</p>
                  )}
                </div>

                {/* Apartment */}
                <div className="space-y-2">
                  <Label htmlFor="apartmentId">Апартамент</Label>
                  <Select
                    id="apartmentId"
                    {...register('apartmentId')}
                    disabled={!selectedBuildingId}
                  >
                    <option value="">
                      {selectedBuildingId 
                        ? "Цяла сграда (по избор)" 
                        : "Първо изберете сграда"
                      }
                    </option>
                    {filteredApartments.map((apartment) => (
                      <option key={apartment.id} value={apartment.id}>
                        Ап. {apartment.number} (ет. {apartment.floor})
                      </option>
                    ))}
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Planning & Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Планиране
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Expected Completion Date */}
                <div className="space-y-2">
                  <Label htmlFor="expectedCompletionDate">Очаквана дата за завършване</Label>
                  <Input
                    id="expectedCompletionDate"
                    type="date"
                    {...register('expectedCompletionDate')}
                  />
                  {errors.expectedCompletionDate && (
                    <p className="text-sm text-red-600">{errors.expectedCompletionDate.message}</p>
                  )}
                </div>

                {/* Estimated Cost */}
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Очаквана цена (лв.)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="estimatedCost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-10"
                      {...register('estimatedCost', { 
                        valueAsNumber: true,
                        setValueAs: (value) => value === '' ? undefined : parseFloat(value)
                      })}
                    />
                  </div>
                  {errors.estimatedCost && (
                    <p className="text-sm text-red-600">{errors.estimatedCost.message}</p>
                  )}
                </div>

                {/* Assigned User */}
                <div className="space-y-2">
                  <Label htmlFor="assignedUserId">Отговорник</Label>
                  <Select id="assignedUserId" {...register('assignedUserId')}>
                    <option value="">Без отговорник (по избор)</option>
                    {mockUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.role}
                      </option>
                    ))}
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              if (mode === 'edit' && irregularityId) {
                navigate(`/irregularities/${irregularityId}`);
              } else {
                navigate('/irregularities');
              }
            }}
          >
            Отказ
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? (mode === 'create' ? 'Създаване...' : 'Запазване...')
              : (mode === 'create' ? 'Създай нередност' : 'Запази промените')
            }
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
