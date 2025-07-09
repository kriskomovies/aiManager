import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { addAlert } from '@/redux/slices/alert-slice';
import { 
  useCreateApartmentMutation, 
  useUpdateApartmentMutation,
  useGetApartmentByIdQuery 
} from '@/redux/services/apartment.service';
import { useGetBuildingQuery } from '@/redux/services/building.service';
import { addApartmentSchema, AddApartmentFormData } from './add-apartment.schema';
import { ApartmentType, ResidentRole } from '@repo/interfaces';

export function AddApartmentPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { buildingId, id } = useParams<{ buildingId?: string; id?: string }>();
  const isEditMode = Boolean(id);
  
  // API hooks
  const { data: building, isLoading: isBuildingLoading } = useGetBuildingQuery(buildingId!, {
    skip: !buildingId,
  });
  const { 
    data: apartmentData, 
    isLoading: isLoadingApartment, 
    error: loadingError 
  } = useGetApartmentByIdQuery(id!, { 
    skip: !isEditMode 
  });
  

  const [createApartment, { isLoading: isCreating }] = useCreateApartmentMutation();
  const [updateApartment, { isLoading: isUpdating }] = useUpdateApartmentMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddApartmentFormData>({
    resolver: zodResolver(addApartmentSchema),
    defaultValues: {
      type: '' as ApartmentType,
      number: '',
      floor: 0,
      quadrature: 0,
      commonParts: 0,
      idealParts: 0,
      residentsCount: 0,
      pets: 0,
      invoiceEnabled: false,
      blockForPayment: false,
      cashierNote: '',
      monthlyRent: 0,
      maintenanceFee: 0,
      residents: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'residents',
  });

  const watchedResidents = watch('residents');
  const watchedResidentsCount = watch('residentsCount');

  // Update residents count when residents array changes
  useEffect(() => {
    setValue('residentsCount', watchedResidents.length);
  }, [watchedResidents.length, setValue]);

  // Load apartment data for editing
  useEffect(() => {
    if (isEditMode && apartmentData && !isLoadingApartment) {
      // Convert apartment data to form format
      const formData: Partial<AddApartmentFormData> = {
        type: apartmentData.type,
        number: apartmentData.number,
        floor: apartmentData.floor,
        quadrature: apartmentData.quadrature,
        commonParts: apartmentData.commonParts || 0,
        idealParts: apartmentData.idealParts || 0,
        residentsCount: apartmentData.residentsCount,
        pets: apartmentData.pets,
        invoiceEnabled: apartmentData.invoiceEnabled,
        blockForPayment: apartmentData.blockForPayment,
        cashierNote: apartmentData.cashierNote || '',
        monthlyRent: apartmentData.monthlyRent || 0,
        maintenanceFee: apartmentData.maintenanceFee || 0,
        residents: apartmentData.residents ? apartmentData.residents.map(resident => ({
          name: resident.name,
          surname: resident.surname,
          phone: resident.phone,
          email: resident.email,
          role: resident.role,
          isMainContact: resident.isMainContact,
        })) : [],
      };
      
      // Reset form with loaded data
      reset(formData);
      
      // Set buildingId if not provided in URL
      if (!buildingId && apartmentData.buildingId) {
        // We need to navigate to include buildingId in the URL
        navigate(`/buildings/${apartmentData.buildingId}/apartments/${id}/edit`, { replace: true });
      }
    }
  }, [apartmentData, isLoadingApartment, isEditMode, reset, buildingId, id, navigate]);

  // Set page info
  useEffect(() => {
    if (building) {
      dispatch(setPageInfo({
        title: isEditMode ? 'Редактирай Апартамент' : 'Нов Апартамент',
        subtitle: isEditMode 
          ? `Редактирайте апартамент в ${building.name} - ${building.address}`
          : `Създайте нов апартамент в ${building.name} - ${building.address}`
      }));
    } else {
      dispatch(setPageInfo({
        title: isEditMode ? 'Редактирай Апартамент' : 'Нов Апартамент',
        subtitle: isEditMode ? 'Редактирайте апартамента' : 'Създайте нов апартамент в системата'
      }));
    }
  }, [dispatch, building, isEditMode]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const formSectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05
      }
    }
  };

  // Type options
  const typeOptions = [
    { value: ApartmentType.APARTMENT, label: 'Апартамент' },
    { value: ApartmentType.ATELIER, label: 'Ателие' },
    { value: ApartmentType.OFFICE, label: 'Офис' },
    { value: ApartmentType.GARAGE, label: 'Гараж' },
    { value: ApartmentType.SHOP, label: 'Магазин' },
    { value: ApartmentType.OTHER, label: 'Друго' },
  ];

  const handleAddResident = () => {
    append({
      name: '',
      surname: '',
      phone: '',
      email: '',
      role: ResidentRole.OWNER,
      isMainContact: false,
    });
  };

  const handleRemoveResident = (index: number) => {
    remove(index);
  };

  const onSubmit: SubmitHandler<AddApartmentFormData> = async (data) => {
    const effectiveBuildingId = buildingId || apartmentData?.buildingId;
    
    if (!effectiveBuildingId) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Не е избрана сграда',
      }));
      return;
    }

    try {
      if (isEditMode) {
        // For updates, don't include buildingId
        const updatePayload = {
          ...data,
          // Convert empty strings to undefined for optional fields
          commonParts: data.commonParts || undefined,
          idealParts: data.idealParts || undefined,
          monthlyRent: data.monthlyRent || undefined,
          maintenanceFee: data.maintenanceFee || undefined,
          cashierNote: data.cashierNote || undefined,
        };
        
        // Update existing apartment
        await updateApartment({ id: id!, updates: updatePayload }).unwrap();
        
        dispatch(addAlert({
          type: 'success',
          title: 'Успешно обновяване!',
          message: `Апартамент "${data.number}" беше обновен успешно.`,
        }));
      } else {
        // For creates, include buildingId
        const createPayload = {
          ...data,
          buildingId: effectiveBuildingId,
          // Convert empty strings to undefined for optional fields
          commonParts: data.commonParts || undefined,
          idealParts: data.idealParts || undefined,
          monthlyRent: data.monthlyRent || undefined,
          maintenanceFee: data.maintenanceFee || undefined,
          cashierNote: data.cashierNote || undefined,
        };
        
        // Create new apartment
        await createApartment(createPayload).unwrap();
        
        dispatch(addAlert({
          type: 'success',
          title: 'Успех',
          message: 'Апартаментът беше създаден успешно',
        }));
      }
      
      navigate(`/buildings/${effectiveBuildingId}`);
    } catch (error) {
      console.error('Error saving apartment:', error);
      
      let errorMessage = isEditMode 
        ? 'Грешка при обновяване на апартамента'
        : 'Грешка при създаване на апартамента';
      
      if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
        errorMessage = String(error.data.message);
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: errorMessage,
      }));
    }
  };

  const handleBack = () => {
    const effectiveBuildingId = buildingId || apartmentData?.buildingId;
    if (effectiveBuildingId) {
      navigate(`/buildings/${effectiveBuildingId}`);
    } else {
      navigate('/buildings');
    }
  };

  // Show loading spinner while loading data
  if (isBuildingLoading || (isEditMode && isLoadingApartment)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Зареждане...</span>
      </div>
    );
  }

  // Show error if failed to load apartment data
  if (isEditMode && loadingError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Грешка при зареждане на данните за апартамента.</p>
        <Button onClick={() => navigate('/buildings')} variant="outline">
          Назад към сгради
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.div className="flex items-center" variants={itemVariants}>
        <motion.button
          onClick={handleBack}
          className="flex items-center gap-2 py-2 px-4 hover:bg-gray-100 rounded-3xl text-gray-600 hover:text-gray-900 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">
            {building ? `Назад към ${building.name}` : 'Назад към сгради'}
          </span>
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Основна Информация</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="type">Тип</Label>
                  <Select
                    id="type"
                    {...register('type')}
                    className={errors.type ? 'border-red-500' : ''}
                  >
                    <option value="">Изберете тип</option>
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="number">Номер</Label>
                  <Input
                    id="number"
                    placeholder="Въведете номер на апартамента"
                    {...register('number')}
                    className={errors.number ? 'border-red-500' : ''}
                  />
                  {errors.number && (
                    <p className="text-sm text-red-500">{errors.number.message}</p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="floor">Етаж</Label>
                  <Input
                    id="floor"
                    placeholder="Въведете етаж"
                    type="number"
                    {...register('floor')}
                    className={errors.floor ? 'border-red-500' : ''}
                  />
                  {errors.floor && (
                    <p className="text-sm text-red-500">{errors.floor.message}</p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="residentsCount">Брой Живущи</Label>
                  <Input
                    id="residentsCount"
                    placeholder="Брой живущи"
                    type="number"
                    min="0"
                    value={watchedResidentsCount}
                    readOnly
                    className="bg-gray-50"
                  />
                  {errors.residentsCount && (
                    <p className="text-sm text-red-500">{errors.residentsCount.message}</p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="pets">Домашни Любимци</Label>
                  <Input
                    id="pets"
                    placeholder="Брой домашни любимци"
                    type="number"
                    min="0"
                    {...register('pets')}
                    className={errors.pets ? 'border-red-500' : ''}
                  />
                  {errors.pets && (
                    <p className="text-sm text-red-500">{errors.pets.message}</p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="quadrature">Квадратура</Label>
                  <div className="relative">
                    <Input
                      id="quadrature"
                      placeholder="Въведете квадратура"
                      type="number"
                      step="0.01"
                      {...register('quadrature')}
                      className={`pr-12 ${errors.quadrature ? 'border-red-500' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                      кв.м.
                    </span>
                  </div>
                  {errors.quadrature && (
                    <p className="text-sm text-red-500">{errors.quadrature.message}</p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="commonParts">Общи Части</Label>
                  <div className="relative">
                    <Input
                      id="commonParts"
                      placeholder="Въведете общи части"
                      type="number"
                      step="0.01"
                      {...register('commonParts')}
                      className={`pr-12 ${errors.commonParts ? 'border-red-500' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                      кв.м.
                    </span>
                  </div>
                  {errors.commonParts && (
                    <p className="text-sm text-red-500">{errors.commonParts.message}</p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="idealParts">Идеални Части</Label>
                  <div className="relative">
                    <Input
                      id="idealParts"
                      placeholder="Въведете идеални части"
                      type="number"
                      step="0.01"
                      {...register('idealParts')}
                      className={`pr-12 ${errors.idealParts ? 'border-red-500' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                      кв.м.
                    </span>
                  </div>
                  {errors.idealParts && (
                    <p className="text-sm text-red-500">{errors.idealParts.message}</p>
                  )}
                </motion.div>
              </motion.div>

              {/* Residents Section */}
              <motion.div className="pt-4 border-t" variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium">Живущи</h3>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddResident}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Добави Живущ
                    </Button>
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border rounded-lg bg-gray-50 relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-red-500">Собственик</span>
                        <motion.button
                          type="button"
                          onClick={() => handleRemoveResident(index)}
                          className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </motion.button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`residents.${index}.name`}>Име</Label>
                          <Input
                            id={`residents.${index}.name`}
                            placeholder="Име"
                            {...register(`residents.${index}.name`)}
                            className={errors.residents?.[index]?.name ? 'border-red-500' : ''}
                          />
                          {errors.residents?.[index]?.name && (
                            <p className="text-sm text-red-500">{errors.residents[index]?.name?.message}</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`residents.${index}.surname`}>Фамилия</Label>
                          <Input
                            id={`residents.${index}.surname`}
                            placeholder="Фамилия"
                            {...register(`residents.${index}.surname`)}
                            className={errors.residents?.[index]?.surname ? 'border-red-500' : ''}
                          />
                          {errors.residents?.[index]?.surname && (
                            <p className="text-sm text-red-500">{errors.residents[index]?.surname?.message}</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`residents.${index}.phone`}>Телефон</Label>
                          <Input
                            id={`residents.${index}.phone`}
                            placeholder="Телефон"
                            type="tel"
                            {...register(`residents.${index}.phone`)}
                            className={errors.residents?.[index]?.phone ? 'border-red-500' : ''}
                          />
                          {errors.residents?.[index]?.phone && (
                            <p className="text-sm text-red-500">{errors.residents[index]?.phone?.message}</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`residents.${index}.email`}>Имейл</Label>
                          <Input
                            id={`residents.${index}.email`}
                            placeholder="Имейл"
                            type="email"
                            {...register(`residents.${index}.email`)}
                            className={errors.residents?.[index]?.email ? 'border-red-500' : ''}
                          />
                          {errors.residents?.[index]?.email && (
                            <p className="text-sm text-red-500">{errors.residents[index]?.email?.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`residents.${index}.isMainContact`}
                            {...register(`residents.${index}.isMainContact`)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <Label htmlFor={`residents.${index}.isMainContact`} className="text-sm">
                            Основен контакт
                          </Label>
                        </div>
                        <input
                          type="hidden"
                          {...register(`residents.${index}.role`)}
                          value={ResidentRole.OWNER}
                        />
                      </div>
                    </motion.div>
                  ))}
                  
                  {fields.length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center py-4">
                      Няма добавени живущи. Натиснете "Добави Живущ" за да добавите.
                    </p>
                  )}
                </div>
                
                {errors.residents && (
                  <p className="text-sm text-red-500 mt-2">{errors.residents.message}</p>
                )}
              </motion.div>

              {/* Invoice Section */}
              <motion.div className="pt-4 border-t" variants={itemVariants}>
                <div className="mb-4">
                  <Toggle
                    id="invoiceToggle"
                    label="Добави Данни за Фактура"
                    pressed={watch('invoiceEnabled')}
                    onPressedChange={(pressed) => setValue('invoiceEnabled', pressed)}
                  />
                </div>
                {watch('invoiceEnabled') && (
                  <motion.div 
                    className="pl-4 border-l-2 border-gray-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthlyRent">Месечна Наемна Цена</Label>
                        <div className="relative">
                          <Input
                            id="monthlyRent"
                            placeholder="Въведете месечна наемна цена"
                            type="number"
                            step="0.01"
                            {...register('monthlyRent')}
                            className={`pr-12 ${errors.monthlyRent ? 'border-red-500' : ''}`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                            лв.
                          </span>
                        </div>
                        {errors.monthlyRent && (
                          <p className="text-sm text-red-500">{errors.monthlyRent.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceFee">Такса Поддръжка</Label>
                        <div className="relative">
                          <Input
                            id="maintenanceFee"
                            placeholder="Въведете такса поддръжка"
                            type="number"
                            step="0.01"
                            {...register('maintenanceFee')}
                            className={`pr-12 ${errors.maintenanceFee ? 'border-red-500' : ''}`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                            лв.
                          </span>
                        </div>
                        {errors.maintenanceFee && (
                          <p className="text-sm text-red-500">{errors.maintenanceFee.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Other Section */}
              <motion.div className="pt-4 border-t" variants={itemVariants}>
                <h3 className="text-md font-medium mb-4">Други</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cashierNote">Бележка Видима за Касиера</Label>
                    <Input
                      id="cashierNote"
                      placeholder="Въведете бележка за касиера..."
                      {...register('cashierNote')}
                      className={errors.cashierNote ? 'border-red-500' : ''}
                    />
                    {errors.cashierNote && (
                      <p className="text-sm text-red-500">{errors.cashierNote.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Toggle
                      id="blockForPayment"
                      label="Блокирай за Изипей"
                      pressed={watch('blockForPayment')}
                      onPressedChange={(pressed) => setValue('blockForPayment', pressed)}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex justify-end space-x-3 pt-6" 
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting || isCreating || isUpdating}
                  >
                    Отказ
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={isSubmitting || isCreating || isUpdating}
                  >
                    {isSubmitting || isCreating || isUpdating 
                      ? (isEditMode ? 'Обновяване...' : 'Създаване...') 
                      : (isEditMode ? 'Обнови' : 'Създай')
                    }
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
