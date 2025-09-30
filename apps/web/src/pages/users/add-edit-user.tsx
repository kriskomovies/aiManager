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
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { addAlert } from '@/redux/slices/alert-slice';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
  useGetUserRolesQuery,
} from '@/redux/services/users.service';
import { useGetBuildingsQuery } from '@/redux/services/building.service';
import { UserStatus } from '@repo/interfaces';
import {
  addUserSchema,
  editUserSchema,
  type AddUserFormData,
  type EditUserFormData,
} from './add-edit-user.schema';

export function AddEditUserPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // API hooks
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: loadingError,
  } = useGetUserQuery(id!, {
    skip: !isEditMode,
  });

  // Fetch roles and buildings for dropdowns
  const { data: rolesData } = useGetUserRolesQuery();
  const { data: buildingsData } = useGetBuildingsQuery({
    page: 1,
    pageSize: 100, // Get all buildings for dropdown
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormData | EditUserFormData>({
    resolver: zodResolver(isEditMode ? editUserSchema : addUserSchema),
    defaultValues: {
      ...(isEditMode && { status: UserStatus.ACTIVE }),
      isUsingMobileApp: false,
      buildingAccess: [],
    },
  });

  const watchedIsUsingMobileApp = watch('isUsingMobileApp');

  // Load user data for editing
  useEffect(() => {
    if (isEditMode && userData && !isLoadingUser) {
      const formData: Partial<EditUserFormData> = {
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        phone: userData.phone || '',
        roleId: userData.role.id,
        residentId: userData.resident?.id || '',
        status: userData.status,
        buildingAccess: userData.buildingAccess || [],
        isUsingMobileApp: userData.isUsingMobileApp,
      };

      reset(formData);
    }
  }, [userData, isLoadingUser, isEditMode, reset]);

  useEffect(() => {
    dispatch(
      setPageInfo({
        title: isEditMode ? 'Редактирай Потребител' : 'Добави Потребител',
        subtitle: isEditMode
          ? 'Редактирайте информацията за потребителя'
          : 'Създайте нов потребител в системата',
      })
    );
  }, [dispatch, isEditMode]);

  // Show loading spinner while loading user data
  if (isEditMode && isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Зареждане на данни...</span>
      </div>
    );
  }

  // Show error if failed to load user data
  if (isEditMode && loadingError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Грешка при зареждане на данните за потребителя.
        </p>
        <Button onClick={() => navigate('/users')} variant="outline">
          Назад към потребители
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

  // Prepare dropdown options
  const roleOptions =
    rolesData?.map(role => ({
      value: role.id,
      label: role.name,
    })) || [];

  const statusOptions = [
    { value: UserStatus.ACTIVE, label: 'Активен' },
    { value: UserStatus.INACTIVE, label: 'Неактивен' },
    { value: UserStatus.SUSPENDED, label: 'Спрян' },
  ];

  const buildingOptions: MultiSelectOption[] =
    buildingsData?.items?.map(building => ({
      value: building.id,
      label: building.name,
    })) || [];

  const onSubmit: SubmitHandler<
    AddUserFormData | EditUserFormData
  > = async data => {
    try {
      const userData = {
        ...data,
        phone: data.phone || undefined,
        residentId: data.residentId || undefined,
        buildingAccess: data.buildingAccess?.length
          ? data.buildingAccess
          : undefined,
      };

      if (isEditMode) {
        // Remove password from update data if empty
        const updateData = { ...userData };
        if (!updateData.password) {
          delete updateData.password;
        }

        await updateUser({ id: id!, data: updateData }).unwrap();

        dispatch(
          addAlert({
            type: 'success',
            title: 'Успешно обновяване!',
            message: `Потребителят "${data.name} ${data.surname}" беше обновен успешно.`,
            duration: 5000,
          })
        );
      } else {
        const { ...createData } = userData as EditUserFormData;

        await createUser(createData as AddUserFormData).unwrap();

        dispatch(
          addAlert({
            type: 'success',
            title: 'Успешно създаване!',
            message: `Потребителят "${data.name} ${data.surname}" беше създаден успешно.`,
            duration: 5000,
          })
        );
      }

      navigate('/users');
    } catch (error) {
      console.error('Failed to save user:', error);

      let errorMessage = isEditMode
        ? 'Възникна грешка при обновяването на потребителя. Моля опитайте отново.'
        : 'Възникна грешка при създаването на потребителя. Моля опитайте отново.';

      if (
        error &&
        typeof error === 'object' &&
        'data' in error &&
        error.data &&
        typeof error.data === 'object' &&
        'message' in error.data
      ) {
        errorMessage = String(error.data.message);
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
      navigate(`/users/${id}`);
    } else {
      navigate('/users');
    }
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
            {isEditMode && userData?.fullName
              ? `Назад към ${userData.fullName}`
              : 'Назад към потребители'}
          </span>
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Информация за потребителя</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Име *</Label>
                  <Input
                    id="name"
                    placeholder="Въведете име"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Фамилия *</Label>
                  <Input
                    id="surname"
                    placeholder="Въведете фамилия"
                    {...register('surname')}
                  />
                  {errors.surname && (
                    <p className="text-sm text-red-600">
                      {errors.surname.message}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Имейл *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Въведете имейл адрес"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    placeholder="Въведете телефонен номер"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="password">
                  {isEditMode
                    ? 'Нова парола (оставете празно за да не се променя)'
                    : 'Парола *'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={
                    isEditMode ? 'Въведете нова парола' : 'Въведете парола'
                  }
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              {/* Role and Status */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <div className="space-y-2">
                  <Label htmlFor="roleId">Роля *</Label>
                  <Select id="roleId" {...register('roleId')}>
                    <option value="">Изберете роля</option>
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.roleId && (
                    <p className="text-sm text-red-600">
                      {errors.roleId.message}
                    </p>
                  )}
                </div>
                {isEditMode && (
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус *</Label>
                    <Select
                      id="status"
                      {...register('status' as keyof EditUserFormData)}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {isEditMode &&
                      errors &&
                      'status' in errors &&
                      errors.status && (
                        <p className="text-sm text-red-600">
                          {errors.status.message}
                        </p>
                      )}
                  </div>
                )}
              </motion.div>

              {/* Building Access */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label>Достъп до сгради</Label>
                <MultiSelect
                  options={buildingOptions}
                  value={watch('buildingAccess') || []}
                  onChange={value => setValue('buildingAccess', value)}
                  placeholder="Изберете сгради до които потребителят има достъп..."
                  className="w-full"
                />
                {errors.buildingAccess && (
                  <p className="text-sm text-red-600">
                    {errors.buildingAccess.message}
                  </p>
                )}
              </motion.div>

              {/* Mobile App Toggle */}
              <motion.div variants={itemVariants}>
                <Toggle
                  id="mobileAppToggle"
                  label="Използва мобилното приложение"
                  pressed={watchedIsUsingMobileApp}
                  onPressedChange={pressed =>
                    setValue('isUsingMobileApp', pressed)
                  }
                />
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
