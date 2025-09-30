import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Users, Building2, Smartphone, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetUserRolesQuery } from '@/redux/services/users.service';
import { useGetBuildingsQuery } from '@/redux/services/building.service';
import { UserStatus, IUserQueryParams } from '@repo/interfaces';

interface UsersFiltersProps {
  onFiltersChange: (filters: IUserQueryParams) => void;
  initialFilters?: IUserQueryParams;
}

export function UsersFilters({ onFiltersChange, initialFilters = {} }: UsersFiltersProps) {
  const [filters, setFilters] = useState<IUserQueryParams>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch data for filter options
  const { data: rolesData } = useGetUserRolesQuery();
  const { data: buildingsData } = useGetBuildingsQuery({
    page: 1,
    pageSize: 100, // Get all buildings for filter
  });

  // Update filters when they change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof IUserQueryParams, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined, // Convert empty strings to undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const expandedVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1 },
  };

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Филтри</h3>
            </div>
            {hasActiveFilters && (
              <Badge variant="positive" className="text-xs">
                {getActiveFiltersCount()} активни
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Изчисти
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? 'Скрий' : 'Покажи'} филтри
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Търсене по име, фамилия или имейл..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Expanded Filters */}
      <motion.div
        variants={expandedVariants}
        initial="hidden"
        animate={isExpanded ? "visible" : "hidden"}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 space-y-4">
          {/* First Row - Role and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Роля
              </label>
              <Select
                value={filters.roleId || ''}
                onChange={(e) => handleFilterChange('roleId', e.target.value)}
              >
                <option value="">Всички роли</option>
                {rolesData?.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Статус
              </label>
              <Select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Всички статуси</option>
                <option value={UserStatus.ACTIVE}>Активен</option>
                <option value={UserStatus.INACTIVE}>Неактивен</option>
                <option value={UserStatus.SUSPENDED}>Спрян</option>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Сграда
              </label>
              <Select
                value={filters.buildingId || ''}
                onChange={(e) => handleFilterChange('buildingId', e.target.value)}
              >
                <option value="">Всички сгради</option>
                {buildingsData?.items?.map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Мобилно приложение
              </label>
              <Select
                value={filters.isUsingMobileApp?.toString() || ''}
                onChange={(e) => handleFilterChange('isUsingMobileApp', 
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )}
              >
                <option value="">Всички</option>
                <option value="true">Използват</option>
                <option value="false">Не използват</option>
              </Select>
            </div>
          </div>

          {/* Second Row - Resident Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Тип потребител
              </label>
              <Select
                value={filters.isResident?.toString() || ''}
                onChange={(e) => handleFilterChange('isResident', 
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )}
              >
                <option value="">Всички</option>
                <option value="true">Жилци</option>
                <option value="false">Персонал</option>
              </Select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Активни филтри:</span>
                {filters.search && (
                  <Badge variant="neutral" className="text-xs">
                    Търсене: "{filters.search}"
                  </Badge>
                )}
                {filters.roleId && rolesData && (
                  <Badge variant="neutral" className="text-xs">
                    Роля: {rolesData.find(r => r.id === filters.roleId)?.name}
                  </Badge>
                )}
                {filters.status && (
                  <Badge variant="neutral" className="text-xs">
                    Статус: {filters.status === UserStatus.ACTIVE ? 'Активен' : 
                             filters.status === UserStatus.INACTIVE ? 'Неактивен' : 'Спрян'}
                  </Badge>
                )}
                {filters.buildingId && buildingsData && (
                  <Badge variant="neutral" className="text-xs">
                    Сграда: {buildingsData.items?.find(b => b.id === filters.buildingId)?.name}
                  </Badge>
                )}
                {filters.isResident !== undefined && (
                  <Badge variant="neutral" className="text-xs">
                    {filters.isResident ? 'Жилци' : 'Персонал'}
                  </Badge>
                )}
                {filters.isUsingMobileApp !== undefined && (
                  <Badge variant="neutral" className="text-xs">
                    Мобилно: {filters.isUsingMobileApp ? 'Да' : 'Не'}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
