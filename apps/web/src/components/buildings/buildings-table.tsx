import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/data-table';
import { IBuildingListItem, BuildingType, BuildingStatus } from '@repo/interfaces/building';
import { useState } from 'react';
import { CashBadge, DebtBadge, IrregularitiesBadge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';

export function BuildingsTable() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof IBuildingListItem;
    direction: 'asc' | 'desc';
  } | null>(null);

  //   const { data, isLoading, isFetching, error } = useBuildingsQuery({
  //     page,
  //     sort: sorting ? `${String(sorting.field)}:${sorting.direction}` : undefined,
  //     search,
  //   });

  //   const columns: Column<Building>[] = [
  //     {
  //       header: 'Име',
  //       accessorKey: 'name',
  //       sortable: true,
  //       searchable: true,
  //     },
  //     {
  //       header: 'Адрес',
  //       accessorKey: 'address',
  //       sortable: true,
  //       searchable: true,
  //     },
  //     {
  //       header: 'Брой апартаменти',
  //       accessorKey: 'apartmentCount',
  //       sortable: true,
  //     },
  //     {
  //       header: 'Баланс',
  //       accessorKey: 'balance',
  //       cell: row => (
  //         <span className={row.balance < 0 ? 'text-red-500' : 'text-green-500'}>
  //           {row.balance.toFixed(2)} лв.
  //         </span>
  //       ),
  //       sortable: true,
  //     },
  //     {
  //       header: 'Задължения',
  //       accessorKey: 'debt',
  //       cell: row => (
  //         <span className="text-red-500">{row.debt.toFixed(2)} лв.</span>
  //       ),
  //       sortable: true,
  //     },
  //   ];
  const mockData = {
    items: [
      {
        id: '1',
        name: 'Андрей Сахаров 15',
        address: 'ул. Андрей Сахаров 15',
        type: BuildingType.RESIDENTIAL,
        apartmentCount: 17,
        irregularities: 3,
        balance: 38.97,
        monthlyFee: 3.00,
        debt: 0.00,
        status: BuildingStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'бул. Владислав Варненчик 615',
        address: 'бул. Владислав Варненчик 615',
        type: BuildingType.COMMERCIAL,
        apartmentCount: 8,
        irregularities: 0,
        balance: 38.97,
        monthlyFee: 3.00,
        debt: 6.00,
        status: BuildingStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        name: 'Андрей Сахаров 15',
        address: 'ул. Андрей Сахаров 15',
        type: BuildingType.MIXED,
        apartmentCount: 25,
        irregularities: 2,
        balance: -100.70,
        monthlyFee: 3.00,
        debt: 100.70,
        status: BuildingStatus.MAINTENANCE,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '4',
        name: 'бул. Владислав Варненчик 615',
        address: 'бул. Владислав Варненчик 615',
        type: BuildingType.OFFICE,
        apartmentCount: 32,
        irregularities: 0,
        balance: 38.97,
        monthlyFee: 3.00,
        debt: 6.00,
        status: BuildingStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ],
    meta: {
      pageCount: 1,
    },
  };
  const isLoading = false;
  const isFetching = false;
  const error = null;
  const data = mockData;

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
