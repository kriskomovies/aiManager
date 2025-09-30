import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  User,
  Smartphone,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { openModal } from '@/redux/slices/modal-slice';
import { useGetUserQuery } from '@/redux/services/users.service';

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    data: user,
    isLoading,
    error,
  } = useGetUserQuery(id!, {
    skip: !id,
  });

  useEffect(() => {
    if (user) {
      dispatch(
        setPageInfo({
          title: user.fullName,
          subtitle: `${user.role.name} • ${user.email}`,
        })
      );
    }
  }, [dispatch, user]);

  const handleEdit = () => {
    navigate(`/users/${id}/edit`);
  };

  const handleDelete = () => {
    if (user) {
      dispatch(
        openModal({
          type: 'delete-user',
          data: {
            userId: user.id,
            userName: user.fullName,
          },
        })
      );
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Зареждане на данни...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Грешка при зареждане на данните за потребителя.
        </p>
        <Button onClick={handleBack} variant="outline">
          Назад към потребители
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Активен', variant: 'positive' as const },
      inactive: { label: 'Неактивен', variant: 'neutral' as const },
      suspended: { label: 'Спрян', variant: 'negative' as const },
    };

    const config = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: 'neutral' as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleBadge = (roleName: string) => {
    const roleColors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      accountant: 'bg-green-100 text-green-800',
      cashier: 'bg-yellow-100 text-yellow-800',
      resident: 'bg-purple-100 text-purple-800',
      maintenance: 'bg-gray-100 text-gray-800',
    };

    const colorClass =
      roleColors[roleName as keyof typeof roleColors] ||
      'bg-gray-100 text-gray-800';

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
      >
        <Shield className="h-4 w-4 mr-1" />
        {roleName}
      </span>
    );
  };

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

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with Back Button and Actions */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <motion.button
          onClick={handleBack}
          className="flex items-center gap-2 py-2 px-4 hover:bg-gray-100 rounded-3xl text-gray-600 hover:text-gray-900 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Назад към потребители</span>
        </motion.button>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Редактирай
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Изтрий
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* User Profile Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                <div className="flex items-center gap-3 mt-2">
                  {getRoleBadge(user.role.name)}
                  {getStatusBadge(user.status)}
                  {user.isResident && (
                    <Badge variant="neutral" className="text-xs">
                      Жилец
                    </Badge>
                  )}
                  {user.isUsingMobileApp && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Smartphone className="h-4 w-4" />
                      <span className="text-sm">Мобилно приложение</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Контактна информация
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Имейл</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Телефон</p>
                        <p className="text-sm font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* System Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Системна информация
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Създаден</p>
                      <p className="text-sm font-medium">
                        {new Date(user.createdAt).toLocaleDateString('bg-BG')}
                      </p>
                    </div>
                  </div>
                  {user.lastLoginAt && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Последен вход</p>
                        <p className="text-sm font-medium">
                          {new Date(user.lastLoginAt).toLocaleDateString(
                            'bg-BG'
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resident Information (if applicable) */}
      {user.isResident && user.resident && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Информация за жилеца</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Апартамент</p>
                    <p className="text-sm font-medium">
                      Ап. {user.resident.apartmentId}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Building Access */}
      {user.buildingAccess && user.buildingAccess.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Достъп до сгради</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.buildingAccess.map(buildingId => (
                  <Badge key={buildingId} variant="neutral">
                    {buildingId}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Permissions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Права на достъп</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.role.permissions.map(permission => (
                <Badge key={permission} variant="neutral" className="text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
