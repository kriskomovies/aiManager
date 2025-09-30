import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { InformationCard } from '@/components/information-card';
import { UsersTable } from '@/components/users/users-table';
import { UsersFilters } from '@/components/users/users-filters';
import { Plus, Users, UserCheck, UserX, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { IUserQueryParams } from '@repo/interfaces';

export function UsersListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<IUserQueryParams>({});

  // Note: Statistics will be calculated from the table data

  useEffect(() => {
    dispatch(
      setPageInfo({
        title: 'Потребители',
        subtitle: 'Управлявайте всички потребители в системата',
      })
    );
  }, [dispatch]);

  const handleAddUser = () => {
    navigate('/users/add');
  };

  // Placeholder statistics - in a real app, these would come from a separate stats API
  const stats = {
    total: 0, // Would be fetched from a stats endpoint
    active: 0,
    inactive: 0,
    residents: 0,
    mobileUsers: 0,
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
      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={itemVariants}
      >
        {/* Total Users Card */}
        <InformationCard
          title="Общо потребители"
          value={stats.total.toString()}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          valueColor="text-blue-600"
          variants={itemVariants}
        />

        {/* Active Users Card */}
        <InformationCard
          title="Активни"
          value={stats.active.toString()}
          icon={UserCheck}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          valueColor="text-green-600"
          variants={itemVariants}
        />

        {/* Inactive Users Card */}
        <InformationCard
          title="Неактивни"
          value={stats.inactive.toString()}
          icon={UserX}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          valueColor="text-red-600"
          variants={itemVariants}
        />

        {/* Residents Card */}
        <InformationCard
          title="Жилци"
          value={stats.residents.toString()}
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          valueColor="text-purple-600"
          subtitle="Потребители-жилци"
          variants={itemVariants}
        />

        {/* Mobile Users Card */}
        <InformationCard
          title="Мобилно приложение"
          value={stats.mobileUsers.toString()}
          icon={Smartphone}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
          valueColor="text-orange-600"
          subtitle="Използват мобилното приложение"
          variants={itemVariants}
        />
      </motion.div>

      {/* Filters Section */}
      <motion.div variants={itemVariants}>
        <UsersFilters 
          onFiltersChange={setFilters}
          initialFilters={filters}
        />
      </motion.div>

      {/* Users Table Section */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border"
        variants={itemVariants}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Потребители</h2>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Button
                className="gap-2 w-full sm:w-auto"
                onClick={handleAddUser}
              >
                <Plus className="h-4 w-4" />
                Добави Потребител
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="p-6">
          <UsersTable filters={filters} />
        </div>
      </motion.div>
    </motion.div>
  );
}
