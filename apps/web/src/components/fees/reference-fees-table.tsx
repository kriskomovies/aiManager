import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface FeeRecord {
  month: string;
  residentsCount: number;
  elevatorElectricity: number;
  elevatorFee: number;
  cleaning: number;
  totalMonthlyFees: number;
  oldDebts: number;
  paid: number;
}

const mockFeeData: FeeRecord[] = [
  {
    month: '12.2024',
    residentsCount: 3,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    oldDebts: 0,
    paid: 585.00,
  },
  {
    month: '11.2024',
    residentsCount: 3,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    oldDebts: 0,
    paid: 585.00,
  },
  {
    month: '10.2024',
    residentsCount: 3,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    oldDebts: 0,
    paid: 585.00,
  },
  {
    month: '09.2024',
    residentsCount: 3,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    oldDebts: 11.00,
    paid: 585.00,
  },
  {
    month: '08.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    oldDebts: 0,
    paid: 585.00,
  },
  {
    month: '07.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    oldDebts: 11.00,
    paid: 585.00,
  },
  {
    month: '06.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    oldDebts: 11.00,
    paid: 585.00,
  },
  {
    month: '05.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    oldDebts: 0,
    paid: 585.00,
  },
  {
    month: '04.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    oldDebts: 0,
    paid: 585.00,
  },
];

export function ReferenceFeesTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof FeeRecord;
    direction: 'asc' | 'desc';
  } | null>(null);

  const data = {
    items: mockFeeData,
    meta: {
      pageCount: 1,
    },
  };

  const isLoading = false;
  const isFetching = false;
  const error = null;

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2)} лв.`;
  };

  const columns: Column<FeeRecord>[] = [
    {
      header: 'Месец',
      accessorKey: 'month',
      sortable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => (
        <span className="font-medium text-gray-900">{row.month}</span>
      ),
    },
    {
      header: 'Брой Живущи',
      accessorKey: 'residentsCount',
      sortable: true,
      width: '110px',
      minWidth: '110px',
      cell: row => (
        <div className="text-center">
          <span className="text-gray-700">{row.residentsCount}</span>
        </div>
      ),
    },
    {
      header: 'Ток Асансьор',
      accessorKey: 'elevatorElectricity',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <span className="text-gray-700 font-medium">
          {formatCurrency(row.elevatorElectricity)}
        </span>
      ),
    },
    {
      header: 'Такса Асансьор',
      accessorKey: 'elevatorFee',
      sortable: true,
      width: '130px',
      minWidth: '130px',
      cell: row => (
        <span className="text-gray-700 font-medium">
          {formatCurrency(row.elevatorFee)}
        </span>
      ),
    },
    {
      header: 'Почистване',
      accessorKey: 'cleaning',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <span className="text-gray-700 font-medium">
          {formatCurrency(row.cleaning)}
        </span>
      ),
    },
    {
      header: 'Общо Такси за Месеца',
      accessorKey: 'totalMonthlyFees',
      sortable: true,
      width: '160px',
      minWidth: '160px',
      cell: row => (
        <span className="text-gray-900 font-semibold">
          {formatCurrency(row.totalMonthlyFees)}
        </span>
      ),
    },
    {
      header: 'Стари Задължения',
      accessorKey: 'oldDebts',
      sortable: true,
      width: '140px',
      minWidth: '140px',
      cell: row => (
        <div className="flex justify-center">
          {row.oldDebts > 0 ? (
            <span className="text-red-600 font-medium">
              {formatCurrency(row.oldDebts)}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      header: 'Платено',
      accessorKey: 'paid',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <Badge 
          variant="positive" 
          className="font-medium"
        >
          {formatCurrency(row.paid)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="w-full">
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
      />
    </div>
  );
}
