import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/data-table';
import { IBuildingListItem } from '@repo/interfaces';
import { useState } from 'react';
import {
  CashBadge,
  DebtBadge,
  IrregularitiesBadge,
} from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { useGetBuildingsQuery } from '@/redux/services/building.service';

export function BuildingsTable() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof IBuildingListItem;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Real API call instead of mock data
  const { data, isLoading, isFetching, error } = useGetBuildingsQuery({
    page,
    pageSize: 10,
    sort: sorting ? `${String(sorting.field)}:${sorting.direction}` : undefined,
  });

  const handleDeleteBuilding = (building: IBuildingListItem) => {
    dispatch(
      openModal({
        type: 'delete-building',
        data: {
          buildingId: building.id,
          buildingName: building.name,
        },
      })
    );
  };

  const columns: Column<IBuildingListItem>[] = [
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '25%',
      minWidth: '180px',
      cell: row => (
        <div className="font-medium text-red-600 hover:text-red-800 cursor-pointer truncate">
          {row.name}
        </div>
      ),
    },
    {
      header: window.innerWidth < 640 ? 'Апарт.' : 'Апартаменти',
      accessorKey: 'apartmentCount',
      sortable: true,
      width: '12%',
      minWidth: '80px',
    },
    {
      header: window.innerWidth < 640 ? 'Неред.' : 'Нередности',
      accessorKey: 'irregularities',
      sortable: true,
      width: '12%',
      minWidth: '80px',
      cell: row => <IrregularitiesBadge count={row.irregularities} />,
    },
    {
      header: 'Каса',
      accessorKey: 'balance',
      sortable: true,
      width: '15%',
      minWidth: '100px',
      cell: row => <CashBadge value={row.balance} />,
    },
    {
      header: window.innerWidth < 640 ? 'Мес. Такса' : 'Месечна Такса',
      accessorKey: 'monthlyFee',
      sortable: true,
      width: '15%',
      minWidth: '100px',
      cell: row => (
        <span className="text-gray-700 text-xs sm:text-sm">
          {row.monthlyFee.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: window.innerWidth < 640 ? 'Дълговe' : 'Дълговe',
      accessorKey: 'debt',
      sortable: true,
      width: '15%',
      minWidth: '100px',
      cell: row => <DebtBadge value={row.debt} />,
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      minWidth: '100px',
      width: '100px',
      cell: row => (
        <div className="flex items-center gap-1">
          <button
            onClick={e => {
              e.stopPropagation();
              navigate(`/buildings/${row.id}/edit`);
            }}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Редактирай"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              handleDeleteBuilding(row);
            }}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            title="Изтрий"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.items}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      page={page}
      pageCount={data?.meta.pageCount}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
      onRowClick={row => navigate(`/buildings/${row.id}`)}
    />
  );
}
