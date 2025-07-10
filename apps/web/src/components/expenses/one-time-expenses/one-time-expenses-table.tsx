import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';

interface OneTimeExpenseData {
  id: string;
  name: string;
  contractor: string;
  paymentDate: string;
  amount: number;
}

export function OneTimeExpensesTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof OneTimeExpenseData;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for one-time expenses
  const mockExpenses: OneTimeExpenseData[] = [
    {
      id: '1',
      name: 'Никакъв Еднократен',
      contractor: 'Име на фирма',
      paymentDate: '12.12.2024',
      amount: 585.00,
    },
    {
      id: '2',
      name: 'Никакъв Еднократен',
      contractor: 'Име на фирма',
      paymentDate: '12.12.2024',
      amount: 50.00,
    },
  ];

  const columns: Column<OneTimeExpenseData>[] = [
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '200px',
      minWidth: '200px',
      cell: row => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      header: 'Контрагент',
      accessorKey: 'contractor',
      sortable: true,
      width: '180px',
      minWidth: '180px',
    },
    {
      header: 'Дата на плащане',
      accessorKey: 'paymentDate',
      sortable: true,
      width: '150px',
      minWidth: '150px',
    },
    {
      header: 'Сума',
      accessorKey: 'amount',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <span className="font-medium text-gray-900">
          {row.amount.toFixed(2)} лв.
        </span>
      ),
    },
  ];

  const transformedData = {
    items: mockExpenses,
    meta: {
      pageCount: Math.ceil(mockExpenses.length / 10),
    },
  };

  return (
    <DataTable
      columns={columns}
      data={transformedData.items}
      isLoading={false}
      isFetching={false}
      error={null}
      page={page}
      pageCount={transformedData.meta.pageCount}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
    />
  );
}
