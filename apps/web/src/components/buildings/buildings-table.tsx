import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/data-table';
import { Building } from '@/types/building';
import { useState } from 'react';

export function BuildingsTable() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: 'id' | 'name' | 'address' | 'apartmentCount' | 'balance' | 'debt' | 'createdAt' | 'updatedAt';
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
        name: 'Сграда А',
        address: 'ул. Първа 1',
        apartmentCount: 24,
        balance: 1500.5,
        debt: 300.0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Сграда Б',
        address: 'ул. Втора 2',
        apartmentCount: 16,
        balance: -500.25,
        debt: 1200.0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        name: 'Сграда В',
        address: 'бул. Трети 3',
        apartmentCount: 32,
        balance: 2300.75,
        debt: 0.0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
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

  const columns: Column<Building>[] = [
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
    },
    {
      header: 'Адрес',
      accessorKey: 'address',
      sortable: true,
      searchable: true,
    },
    {
      header: 'Брой апартаменти',
      accessorKey: 'apartmentCount',
      sortable: true,
    },
    {
      header: 'Баланс',
      accessorKey: 'balance',
      cell: row => (
        <span className={row.balance < 0 ? 'text-red-500' : 'text-green-500'}>
          {row.balance.toFixed(2)} лв.
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Задължения',
      accessorKey: 'debt',
      cell: row => (
        <span className="text-red-500">{row.debt.toFixed(2)} лв.</span>
      ),
      sortable: true,
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
      onSearch={() => {}}
      onRowClick={row => navigate(`/buildings/${row.id}`)}
    />
  );
}
