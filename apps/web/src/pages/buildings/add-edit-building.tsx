import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/ui/multi-select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { addAlert } from '@/redux/slices/alert-slice';
import {
  useCreateBuildingMutation,
  useUpdateBuildingMutation,
  useGetBuildingQuery,
} from '@/redux/services/building.service';
import { BuildingType, TaxGenerationPeriod } from '@repo/interfaces';
import {
  addBuildingSchema,
  type AddBuildingFormData,
} from './add-edit-building.schema';

export function AddEditBuildingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // API hooks
  const [createBuilding, { isLoading: isCreating }] =
    useCreateBuildingMutation();
  const [updateBuilding, { isLoading: isUpdating }] =
    useUpdateBuildingMutation();
  const {
    data: buildingData,
    isLoading: isLoadingBuilding,
    error: loadingError,
  } = useGetBuildingQuery(id!, {
    skip: !isEditMode,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddBuildingFormData>({
    resolver: zodResolver(addBuildingSchema),
    defaultValues: {
      type: BuildingType.RESIDENTIAL,
      taxGenerationPeriod: TaxGenerationPeriod.MONTHLY,
      taxGenerationDay: 1,
      invoiceEnabled: false,
    },
  });

  const watchedInvoiceEnabled = watch('invoiceEnabled');

  // Load building data for editing
  useEffect(() => {
    if (isEditMode && buildingData && !isLoadingBuilding) {
      // Convert building data to form format
      const formData: Partial<AddBuildingFormData> = {
        name: buildingData.name,
        type: buildingData.type,
        city: buildingData.city,
        district: buildingData.district,
        street: buildingData.street,
        number: buildingData.number,
        entrance: buildingData.entrance || '',
        postalCode: buildingData.postalCode,
        commonPartsArea: buildingData.commonPartsArea || 0,
        quadrature: buildingData.quadrature || 0,
        parkingSlots: buildingData.parkingSlots || 0,
        basements: buildingData.basements || 0,
        taxGenerationPeriod: buildingData.taxGenerationPeriod,
        taxGenerationDay: buildingData.taxGenerationDay,
        homebookStartDate: buildingData.homebookStartDate
          ? new Date(buildingData.homebookStartDate).toISOString().split('T')[0]
          : '',
        description: buildingData.description || '',
        invoiceEnabled: buildingData.invoiceEnabled || false,
        peopleWithAccess: Array.isArray(buildingData.peopleWithAccess)
          ? buildingData.peopleWithAccess.map(person =>
              typeof person === 'string' ? person : person.id || String(person)
            )
          : [],
      };

      // Reset form with loaded data
      reset(formData);
    }
  }, [buildingData, isLoadingBuilding, isEditMode, reset]);

  useEffect(() => {
    dispatch(
      setPageInfo({
        title: isEditMode ? 'Редактирай Сграда' : 'Добави Сграда',
        subtitle: isEditMode
          ? 'Редактирайте информацията за сградата'
          : 'Създайте нова сграда в системата',
      })
    );
  }, [dispatch, isEditMode]);

  // Show loading spinner while loading building data
  if (isEditMode && isLoadingBuilding) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Зареждане на данни...</span>
      </div>
    );
  }

  // Show error if failed to load building data
  if (isEditMode && loadingError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Грешка при зареждане на данните за сградата.
        </p>
        <Button onClick={() => navigate('/buildings')} variant="outline">
          Назад към сгради
        </Button>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const formSectionVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  // Mock data for dropdowns
  const typeOptions = [
    { value: BuildingType.RESIDENTIAL, label: 'Жилищна' },
    { value: BuildingType.COMMERCIAL, label: 'Търговска' },
    { value: BuildingType.OFFICE, label: 'Офис сграда' },
    { value: BuildingType.MIXED, label: 'Смесена' },
  ];

  const cityOptions = [
    { value: 'София', label: 'София' },
    { value: 'Пловдив', label: 'Пловдив' },
    { value: 'Варна', label: 'Варна' },
    { value: 'Бургас', label: 'Бургас' },
  ];

  const districtOptions = [
    { value: 'Център', label: 'Център' },
    { value: 'Лозенец', label: 'Лозенец' },
    { value: 'Витоша', label: 'Витоша' },
    { value: 'Младост', label: 'Младост' },
  ];

  const taxPeriodOptions = [
    { value: TaxGenerationPeriod.MONTHLY, label: 'Месечно' },
    { value: TaxGenerationPeriod.QUARTERLY, label: 'Тримесечно' },
    { value: TaxGenerationPeriod.YEARLY, label: 'Годишно' },
  ];

  const peopleOptions: MultiSelectOption[] = [
    { value: 'admin1', label: 'Иван Петров - Администратор' },
    { value: 'manager1', label: 'Мария Георгиева - Управител' },
    { value: 'accountant1', label: 'Петър Стоянов - Счетоводител' },
    { value: 'resident1', label: 'Елена Димитрова - Жилец' },
    { value: 'resident2', label: 'Георги Николов - Жилец' },
  ];

  const onSubmit: SubmitHandler<AddBuildingFormData> = async data => {
    try {
      // Data is already properly typed and converted by Zod schema
      const buildingData = {
        ...data,
      };

      if (isEditMode) {
        // Update existing building
        await updateBuilding({ id: id!, data: buildingData }).unwrap();

        dispatch(
          addAlert({
            type: 'success',
            title: 'Успешно обновяване!',
            message: `Сградата "${data.name}" беше обновена успешно.`,
            duration: 5000,
          })
        );
      } else {
        // Create new building
        await createBuilding(buildingData).unwrap();

        dispatch(
          addAlert({
            type: 'success',
            title: 'Успешно създаване!',
            message: `Сградата "${data.name}" беше създадена успешно.`,
            duration: 5000,
          })
        );
      }

      navigate('/buildings');
    } catch (error) {
      console.error('Failed to save building:', error);

      let errorMessage = isEditMode
        ? 'Възникна грешка при обновяването на сградата. Моля опитайте отново.'
        : 'Възникна грешка при създаването на сградата. Моля опитайте отново.';

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
          title: isEditMode ? 'Грешка при обновяване' : 'Грешка при създаване',
          message: errorMessage,
          duration: 5000,
        })
      );
    }
  };

  const handleBack = () => {
    if (isEditMode && id) {
      navigate(`/buildings/${id}`);
    } else {
      navigate('/buildings');
    }
  };

  const handleAddCompany = () => {
    console.log('Add company clicked');
    // TODO: Implement add company functionality
  };

  const isLoading = isSubmitting || isCreating || isUpdating;

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
            {isEditMode && buildingData?.name
              ? `Назад към ${buildingData.name}`
              : 'Назад към сгради'}
          </span>
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Обща Информация</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* General Information Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="name">Име *</Label>
                  <Input
                    id="name"
                    placeholder="Въведете име на сградата"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="type">Тип *</Label>
                  <Select id="type" {...register('type')}>
                    <option value="">Изберете тип</option>
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600">
                      {errors.type.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="city">Град *</Label>
                  <Select id="city" {...register('city')}>
                    <option value="">Изберете град</option>
                    {cityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.city && (
                    <p className="text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="district">Район *</Label>
                  <Select id="district" {...register('district')}>
                    <option value="">Изберете район</option>
                    {districtOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.district && (
                    <p className="text-sm text-red-600">
                      {errors.district.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="street">Улица *</Label>
                  <Input
                    id="street"
                    placeholder="Въведете улица"
                    {...register('street')}
                  />
                  {errors.street && (
                    <p className="text-sm text-red-600">
                      {errors.street.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="number">Номер *</Label>
                  <Input
                    id="number"
                    placeholder="Въведете номер"
                    {...register('number')}
                  />
                  {errors.number && (
                    <p className="text-sm text-red-600">
                      {errors.number.message}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="entrance">Вход *</Label>
                  <Input
                    id="entrance"
                    placeholder="Въведете вход (напр. А, Б, 1, 2)"
                    {...register('entrance')}
                  />
                  {errors.entrance && (
                    <p className="text-sm text-red-600">
                      {errors.entrance.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="postalCode">Пощенски код *</Label>
                  <Input
                    id="postalCode"
                    placeholder="Въведете пощенски код"
                    {...register('postalCode')}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-600">
                      {errors.postalCode.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="commonPartsArea">Общи части площ *</Label>
                  <Input
                    id="commonPartsArea"
                    placeholder="Въведете площ в кв.м. (напр. 150.5)"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('commonPartsArea')}
                  />
                  {errors.commonPartsArea && (
                    <p className="text-sm text-red-600">
                      {errors.commonPartsArea.message}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="quadrature">Квадратура *</Label>
                  <Input
                    id="quadrature"
                    placeholder="Въведете общата площ в кв.м. (напр. 2500)"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('quadrature')}
                  />
                  {errors.quadrature && (
                    <p className="text-sm text-red-600">
                      {errors.quadrature.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="parkingSlots">Паркоместа *</Label>
                  <Input
                    id="parkingSlots"
                    placeholder="Въведете брой паркоместа (напр. 24)"
                    type="number"
                    min="0"
                    {...register('parkingSlots')}
                  />
                  {errors.parkingSlots && (
                    <p className="text-sm text-red-600">
                      {errors.parkingSlots.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="basements">Мазета *</Label>
                  <Input
                    id="basements"
                    placeholder="Въведете брой мазета (напр. 12)"
                    type="number"
                    min="0"
                    {...register('basements')}
                  />
                  {errors.basements && (
                    <p className="text-sm text-red-600">
                      {errors.basements.message}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="taxGenerationPeriod">
                    Период за генериране на такси *
                  </Label>
                  <Select
                    id="taxGenerationPeriod"
                    {...register('taxGenerationPeriod')}
                  >
                    <option value="">Изберете период</option>
                    {taxPeriodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.taxGenerationPeriod && (
                    <p className="text-sm text-red-600">
                      {errors.taxGenerationPeriod.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="taxGenerationDay">Ден за генериране *</Label>
                  <Input
                    id="taxGenerationDay"
                    placeholder="Ден от месеца"
                    type="number"
                    min="1"
                    max="31"
                    {...register('taxGenerationDay')}
                  />
                  {errors.taxGenerationDay && (
                    <p className="text-sm text-red-600">
                      {errors.taxGenerationDay.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="homebookStartDate">
                    Начална дата на домовата книга *
                  </Label>
                  <Input
                    id="homebookStartDate"
                    type="date"
                    {...register('homebookStartDate')}
                  />
                  {errors.homebookStartDate && (
                    <p className="text-sm text-red-600">
                      {errors.homebookStartDate.message}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              {/* Description Section */}
              <motion.div
                className="grid grid-cols-1 gap-4 pt-4 border-t"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="description">Описание *</Label>
                  <textarea
                    id="description"
                    placeholder="Въведете описание на сградата (поне 10 символа)"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              {/* Invoice Section */}
              <motion.div className="pt-4 border-t" variants={itemVariants}>
                <div className="mb-4">
                  <Toggle
                    id="invoiceToggle"
                    label="Фактура"
                    pressed={watchedInvoiceEnabled}
                    onPressedChange={pressed =>
                      setValue('invoiceEnabled', pressed)
                    }
                  />
                </div>
                {watchedInvoiceEnabled && (
                  <motion.div
                    className="pl-4 border-l-2 border-gray-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-500 italic">
                      Допълнителни полета за фактуриране ще бъдат добавени
                      тук...
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* People with Access */}
              <motion.div className="pt-4 border-t" variants={itemVariants}>
                <h3 className="text-md font-medium mb-4">Хора с достъп *</h3>
                <div className="space-y-2">
                  <MultiSelect
                    options={peopleOptions}
                    value={watch('peopleWithAccess') || []}
                    onChange={value => setValue('peopleWithAccess', value)}
                    placeholder="Изберете поне един човек с достъп до сградата..."
                    className="w-full"
                  />
                  {errors.peopleWithAccess && (
                    <p className="text-sm text-red-600">
                      {errors.peopleWithAccess.message}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Partnering Companies */}
              <motion.div className="pt-4 border-t" variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium">Партньорски компании</h3>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCompany}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Добави компания
                    </Button>
                  </motion.div>
                </div>
                <p className="text-sm text-gray-500 italic">
                  Списък с партньорски компании ще бъде показан тук...
                </p>
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600 text-white gap-2"
                  >
                    {isEditMode ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {isLoading
                      ? isEditMode
                        ? 'Обновяване...'
                        : 'Създаване...'
                      : isEditMode
                        ? 'Обнови'
                        : 'Създай'}
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
