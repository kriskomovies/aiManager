import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface PaymentRecord {
  month: string;
  residentsCount: number;
  elevatorElectricity: number;
  elevatorFee: number;
  cleaning: number;
  totalMonthlyFees: number;
  paid: number;
}

const mockPaymentData: PaymentRecord[] = [
  {
    month: '12.2024',
    residentsCount: 3,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    paid: 585.00,
  },
  {
    month: '11.2024',
    residentsCount: 3,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    paid: 585.00,
  },
  {
    month: '10.2024',
    residentsCount: 3,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    paid: 585.00,
  },
  {
    month: '09.2024',
    residentsCount: 3,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    paid: 574.00,
  },
  {
    month: '08.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    paid: 585.00,
  },
  {
    month: '07.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    paid: 574.00,
  },
  {
    month: '06.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    paid: 574.00,
  },
  {
    month: '05.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    paid: 585.00,
  },
  {
    month: '04.2024',
    residentsCount: 2,
    elevatorElectricity: 12.99,
    elevatorFee: 12.99,
    cleaning: 12.99,
    totalMonthlyFees: 38.97,
    paid: 585.00,
  },
];

export function ReferencePaymentsTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof PaymentRecord;
    direction: 'asc' | 'desc';
  } | null>(null);

  const data = {
    items: mockPaymentData,
    meta: {
      pageCount: 1,
    },
  };

  const isLoading = false;
  const isFetching = false;
  const error = null;

  const columns: Column<PaymentRecord>[] = [
    {
      header: 'Месец',
      accessorKey: 'month',
      sortable: true,
    },
    {
      header: 'Брой Живущи',
      accessorKey: 'residentsCount',
      sortable: true,
      cell: row => (
        <div className="text-center">{row.residentsCount}</div>
      ),
    },
    {
      header: 'Ток Асансьор',
      accessorKey: 'elevatorElectricity',
      sortable: true,
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.elevatorElectricity.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Такса Асансьор',
      accessorKey: 'elevatorFee',
      sortable: true,
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.elevatorFee.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Почистване',
      accessorKey: 'cleaning',
      sortable: true,
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.cleaning.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Общо Такси за Месеца',
      accessorKey: 'totalMonthlyFees',
      sortable: true,
      cell: row => (
        <span className="text-gray-900 font-bold whitespace-nowrap">
          {row.totalMonthlyFees.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Платено',
      accessorKey: 'paid',
      sortable: true,
      cell: row => (
        <Badge variant="positive" value={row.paid} suffix=" лв." />
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
    />
  );
}
