import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/data-table';
import { IBuildingListItem } from '@repo/interfaces';
import { useState } from 'react';
import { CashBadge, DebtBadge, IrregularitiesBadge } from '@/components/ui/badge';
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
    dispatch(openModal({
      type: 'delete-building',
      data: {
        buildingId: building.id,
        buildingName: building.name,
      }
    }));
  };

  const columns: Column<IBuildingListItem>[] = [
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      cell: row => (
        <div className="font-medium text-red-600 hover:text-red-800 cursor-pointer">
          {row.name}
        </div>
      ),
    },
    {
      header: 'Апартаменти',
      accessorKey: 'apartmentCount',
      sortable: true,
    },
    {
      header: 'Нередности',
      accessorKey: 'irregularities',
      cell: row => (
        <IrregularitiesBadge count={row.irregularities} />
      ),
      sortable: true,
    },
    {
      header: 'Каса',
      accessorKey: 'balance',
      cell: row => (
        <CashBadge value={row.balance} />
      ),
      sortable: true,
    },
    {
      header: 'Месечна Такса',
      accessorKey: 'monthlyFee',
      cell: row => (
        <span className="text-gray-700">{row.monthlyFee.toFixed(2)} лв.</span>
      ),
      sortable: true,
    },
    {
      header: 'Задължения',
      accessorKey: 'debt',
      cell: row => (
        <DebtBadge value={row.debt} />
      ),
      sortable: true,
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      cell: row => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/buildings/${row.id}/edit`);
            }}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Редактирай"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteBuilding(row);
            }}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
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
