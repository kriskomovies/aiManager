import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/data-table';
import { IUserListItem } from '@repo/interfaces';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Smartphone, User } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { useGetUsersQuery } from '@/redux/services/users.service';

export function UsersTable() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof IUserListItem;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Real API call
  const { data, isLoading, isFetching, error } = useGetUsersQuery({
    page,
    limit: 10,
  });

  const handleDeleteUser = (user: IUserListItem) => {
    dispatch(
      openModal({
        type: 'delete-user',
        data: {
          userId: user.id,
          userName: user.fullName,
        },
      })
    );
  };

  const handleEditUser = (user: IUserListItem) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleViewUser = (user: IUserListItem) => {
    navigate(`/users/${user.id}`);
  };

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
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {roleName}
      </span>
    );
  };

  const columns: Column<IUserListItem>[] = [
    {
      header: 'Потребител',
      accessorKey: 'fullName',
      sortable: true,
      searchable: true,
      width: '200px',
      minWidth: '200px',
      cell: row => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {row.fullName}
            </div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Роля',
      accessorKey: 'roleName',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => getRoleBadge(row.roleName),
    },
    {
      header: 'Телефон',
      accessorKey: 'phone',
      width: '130px',
      minWidth: '130px',
      cell: row => (
        <span className="text-sm text-gray-900">{row.phone || '-'}</span>
      ),
    },
    {
      header: 'Статус',
      accessorKey: 'status',
      sortable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => getStatusBadge(row.status),
    },
    {
      header: 'Тип',
      accessorKey: 'isResident',
      width: '100px',
      minWidth: '100px',
      cell: row => (
        <div className="flex items-center space-x-1">
          {row.isResident && (
            <Badge variant="neutral" className="text-xs">
              Жилец
            </Badge>
          )}
          {row.isUsingMobileApp && (
            <Smartphone className="h-4 w-4 text-blue-500" />
          )}
        </div>
      ),
    },
    {
      header: 'Апартамент',
      accessorKey: 'apartmentNumber',
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <span className="text-sm text-gray-900">
          {row.isResident && row.apartmentNumber
            ? `Ап. ${row.apartmentNumber}`
            : '-'}
        </span>
      ),
    },
    {
      header: 'Последен вход',
      accessorKey: 'lastLoginAt',
      sortable: true,
      width: '130px',
      minWidth: '130px',
      cell: row => (
        <span className="text-sm text-gray-500">
          {row.lastLoginAt
            ? new Date(row.lastLoginAt).toLocaleDateString('bg-BG')
            : 'Никога'}
        </span>
      ),
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      width: '100px',
      minWidth: '100px',
      cell: row => (
        <div
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1"
        >
          <button
            onClick={() => handleEditUser(row)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            title="Редактирай"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(row)}
            className="p-2 text-gray-500 hover:text-red-700 transition-colors rounded-md hover:bg-red-50 active:bg-red-100 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            title="Изтрий"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.items || []}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      page={page}
      pageCount={data?.meta.pageCount || 1}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
      onRowClick={handleViewUser}
    />
  );
}
