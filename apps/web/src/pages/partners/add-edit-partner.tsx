import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
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
  PartnerType,
  PartnerStatus,
  addPartnerSchemaWithValidation,
  type AddPartnerFormData,
} from './add-edit-partner.schema';

export function AddEditPartnerPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddPartnerFormData>({
    resolver: zodResolver(addPartnerSchemaWithValidation),
    defaultValues: {
      type: PartnerType.SERVICE_PROVIDER,
      status: PartnerStatus.ACTIVE,
      country: 'България',
      servicesProvided: [],
      buildingsAccess: [],
    },
  });

  // Mock data loading for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      // Simulate loading partner data
      const mockPartnerData: Partial<AddPartnerFormData> = {
        name: 'Строй-Инвест ЕООД',
        type: PartnerType.CONTRACTOR,
        status: PartnerStatus.ACTIVE,
        email: 'office@stroy-invest.bg',
        phone: '+359 88 123 4567',
        address: 'ул. Витоша 15, ет. 3',
        city: 'София',
        postalCode: '1000',
        country: 'България',
        taxNumber: 'BG123456789',
        registrationNumber: 'СОФ123456',
        creditLimit: 50000,
        paymentTerms: 30,
        website: 'https://stroy-invest.bg',
        description: 'Строителна компания специализирана в жилищно строителство и ремонти.',
        contactPersonName: 'Иван Петров',
        contactPersonEmail: 'ivan.petrov@stroy-invest.bg',
        contactPersonPhone: '+359 88 123 4568',
        contractStartDate: '2024-01-01',
        contractEndDate: '2024-12-31',
        servicesProvided: ['construction', 'renovation', 'maintenance'],
        buildingsAccess: ['building1', 'building2'],
      };

      reset(mockPartnerData);
    }
  }, [isEditMode, id, reset]);

  useEffect(() => {
    dispatch(
      setPageInfo({
        title: isEditMode ? 'Редактирай Контрагент' : 'Добави Контрагент',
        subtitle: isEditMode
          ? 'Редактирайте информацията за контрагента'
          : 'Създайте нов бизнес партньор в системата',
      })
    );
  }, [dispatch, isEditMode]);

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
  const partnerTypeOptions = [
    { value: PartnerType.SUPPLIER, label: 'Доставчик' },
    { value: PartnerType.SERVICE_PROVIDER, label: 'Услугодател' },
    { value: PartnerType.CONTRACTOR, label: 'Изпълнител' },
    { value: PartnerType.VENDOR, label: 'Продавач' },
    { value: PartnerType.CONSULTANT, label: 'Консултант' },
    { value: PartnerType.OTHER, label: 'Друго' },
  ];

  const statusOptions = [
    { value: PartnerStatus.ACTIVE, label: 'Активен' },
    { value: PartnerStatus.INACTIVE, label: 'Неактивен' },
    { value: PartnerStatus.PENDING, label: 'Чакащ одобрение' },
    { value: PartnerStatus.SUSPENDED, label: 'Спрян' },
  ];

  const cityOptions = [
    { value: 'София', label: 'София' },
    { value: 'Пловдив', label: 'Пловдив' },
    { value: 'Варна', label: 'Варна' },
    { value: 'Бургас', label: 'Бургас' },
    { value: 'Русе', label: 'Русе' },
    { value: 'Стара Загора', label: 'Стара Загора' },
  ];

  const countryOptions = [
    { value: 'България', label: 'България' },
    { value: 'Румъния', label: 'Румъния' },
    { value: 'Гърция', label: 'Гърция' },
    { value: 'Сърбия', label: 'Сърбия' },
  ];

  const servicesOptions: MultiSelectOption[] = [
    { value: 'construction', label: 'Строителство' },
    { value: 'renovation', label: 'Ремонт' },
    { value: 'maintenance', label: 'Поддръжка' },
    { value: 'cleaning', label: 'Почистване' },
    { value: 'security', label: 'Охрана' },
    { value: 'gardening', label: 'Озеленяване' },
    { value: 'electrical', label: 'Електрически услуги' },
    { value: 'plumbing', label: 'ВиК услуги' },
    { value: 'hvac', label: 'Климатични системи' },
    { value: 'consulting', label: 'Консултантски услуги' },
    { value: 'legal', label: 'Правни услуги' },
    { value: 'accounting', label: 'Счетоводни услуги' },
  ];

  const buildingsOptions: MultiSelectOption[] = [
    { value: 'building1', label: 'Сграда Витоша - ул. Витоша 123' },
    { value: 'building2', label: 'Сграда Лозенец - ул. Фритьоф Нансен 45' },
    { value: 'building3', label: 'Сграда Центр - ул. Граф Игнатиев 78' },
    { value: 'building4', label: 'Сграда Младост - ул. Йерусалим 12' },
    { value: 'building5', label: 'Сграда Студентски град - бул. Св. Климент Охридски 34' },
  ];

  const onSubmit: SubmitHandler<AddPartnerFormData> = async data => {
    try {
      console.log('Partner data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(
        addAlert({
          type: 'success',
          title: isEditMode ? 'Успешно обновяване!' : 'Успешно създаване!',
          message: `Контрагентът "${data.name}" беше ${
            isEditMode ? 'обновен' : 'създаден'
          } успешно.`,
          duration: 5000,
        })
      );

      navigate('/partners');
    } catch (error) {
      console.error('Failed to save partner:', error);

      dispatch(
        addAlert({
          type: 'error',
          title: isEditMode ? 'Грешка при обновяване' : 'Грешка при създаване',
          message: `Възникна грешка при ${
            isEditMode ? 'обновяването' : 'създаването'
          } на контрагента. Моля опитайте отново.`,
          duration: 5000,
        })
      );
    }
  };

  const handleBack = () => {
    if (isEditMode && id) {
      navigate(`/partners/${id}`);
    } else {
      navigate('/partners');
    }
  };

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
            {isEditMode ? 'Назад към контрагент' : 'Назад към контрагенти'}
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
              {/* Basic Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="name">Име *</Label>
                  <Input
                    id="name"
                    placeholder="Въведете име на контрагента"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="type">Тип *</Label>
                  <Select id="type" {...register('type')}>
                    <option value="">Изберете тип</option>
                    {partnerTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600">{errors.type.message}</p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="status">Статус *</Label>
                  <Select id="status" {...register('status')}>
                    <option value="">Изберете статус</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-600">{errors.status.message}</p>
                  )}
                </motion.div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="email">Имейл *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="office@company.bg"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    placeholder="+359 88 123 4567"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </motion.div>
              </motion.div>

              {/* Address Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="address">Адрес *</Label>
                  <Input
                    id="address"
                    placeholder="ул. Витоша 15, ет. 3"
                    {...register('address')}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address.message}</p>
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
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="postalCode">Пощенски код *</Label>
                  <Input
                    id="postalCode"
                    placeholder="1000"
                    {...register('postalCode')}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-600">
                      {errors.postalCode.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="country">Държава *</Label>
                  <Select id="country" {...register('country')}>
                    <option value="">Изберете държава</option>
                    {countryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-600">{errors.country.message}</p>
                  )}
                </motion.div>
              </motion.div>

              {/* Business Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="taxNumber">ДДС номер *</Label>
                  <Input
                    id="taxNumber"
                    placeholder="BG123456789"
                    {...register('taxNumber')}
                  />
                  {errors.taxNumber && (
                    <p className="text-sm text-red-600">
                      {errors.taxNumber.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="registrationNumber">Регистрационен номер *</Label>
                  <Input
                    id="registrationNumber"
                    placeholder="СОФ123456"
                    {...register('registrationNumber')}
                  />
                  {errors.registrationNumber && (
                    <p className="text-sm text-red-600">
                      {errors.registrationNumber.message}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              {/* Financial Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="creditLimit">Кредитен лимит (лв.)</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    placeholder="50000"
                    min="0"
                    step="0.01"
                    {...register('creditLimit')}
                  />
                  {errors.creditLimit && (
                    <p className="text-sm text-red-600">
                      {errors.creditLimit.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="paymentTerms">Условия за плащане (дни)</Label>
                  <Input
                    id="paymentTerms"
                    type="number"
                    placeholder="30"
                    min="1"
                    max="365"
                    {...register('paymentTerms')}
                  />
                  {errors.paymentTerms && (
                    <p className="text-sm text-red-600">
                      {errors.paymentTerms.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="website">Уебсайт</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://company.bg"
                    {...register('website')}
                  />
                  {errors.website && (
                    <p className="text-sm text-red-600">{errors.website.message}</p>
                  )}
                </motion.div>
              </motion.div>

              {/* Contract Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="contractStartDate">Начало на договор</Label>
                  <Input
                    id="contractStartDate"
                    type="date"
                    {...register('contractStartDate')}
                  />
                  {errors.contractStartDate && (
                    <p className="text-sm text-red-600">
                      {errors.contractStartDate.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="contractEndDate">Край на договор</Label>
                  <Input
                    id="contractEndDate"
                    type="date"
                    {...register('contractEndDate')}
                  />
                  {errors.contractEndDate && (
                    <p className="text-sm text-red-600">
                      {errors.contractEndDate.message}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              {/* Contact Person Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="contactPersonName">Контактно лице</Label>
                  <Input
                    id="contactPersonName"
                    placeholder="Иван Петров"
                    {...register('contactPersonName')}
                  />
                  {errors.contactPersonName && (
                    <p className="text-sm text-red-600">
                      {errors.contactPersonName.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="contactPersonEmail">Имейл на контактното лице</Label>
                  <Input
                    id="contactPersonEmail"
                    type="email"
                    placeholder="ivan.petrov@company.bg"
                    {...register('contactPersonEmail')}
                  />
                  {errors.contactPersonEmail && (
                    <p className="text-sm text-red-600">
                      {errors.contactPersonEmail.message}
                    </p>
                  )}
                </motion.div>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="contactPersonPhone">Телефон на контактното лице</Label>
                  <Input
                    id="contactPersonPhone"
                    placeholder="+359 88 123 4568"
                    {...register('contactPersonPhone')}
                  />
                  {errors.contactPersonPhone && (
                    <p className="text-sm text-red-600">
                      {errors.contactPersonPhone.message}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.div
                className="grid grid-cols-1 gap-4 pt-4 border-t"
                variants={formSectionVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="description">Описание</Label>
                  <textarea
                    id="description"
                    placeholder="Описание на контрагента и предоставяните услуги..."
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

              {/* Services Provided */}
              <motion.div className="pt-4 border-t" variants={itemVariants}>
                <h3 className="text-md font-medium mb-4">Предоставяни услуги *</h3>
                <div className="space-y-2">
                  <MultiSelect
                    options={servicesOptions}
                    value={watch('servicesProvided') || []}
                    onChange={value => setValue('servicesProvided', value)}
                    placeholder="Изберете поне една услуга или продукт..."
                    className="w-full"
                  />
                  {errors.servicesProvided && (
                    <p className="text-sm text-red-600">
                      {errors.servicesProvided.message}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Buildings Access */}
              <motion.div className="pt-4 border-t" variants={itemVariants}>
                <h3 className="text-md font-medium mb-4">Достъп до сгради</h3>
                <div className="space-y-2">
                  <MultiSelect
                    options={buildingsOptions}
                    value={watch('buildingsAccess') || []}
                    onChange={value => setValue('buildingsAccess', value)}
                    placeholder="Изберете сгради за достъп (незадължително)..."
                    className="w-full"
                  />
                  {errors.buildingsAccess && (
                    <p className="text-sm text-red-600">
                      {errors.buildingsAccess.message}
                    </p>
                  )}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="bg-red-500 hover:bg-red-600 text-white gap-2"
                  >
                    {isEditMode ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {isSubmitting
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
