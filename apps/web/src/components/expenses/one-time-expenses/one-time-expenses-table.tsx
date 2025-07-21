import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { useGetOneTimeExpensesQuery } from '@/redux/services/expense.service';

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

  // Fetch real data from backend
  const {
    data: apiData,
    isLoading,
    isFetching,
    error,
  } = useGetOneTimeExpensesQuery();

  // Transform API data to table data
  const expenses: OneTimeExpenseData[] = (apiData || []).map(item => ({
    id: item.id,
    name: item.name,
    contractor: item.contragentId || '',
    paymentDate: item.expenseDate
      ? new Date(item.expenseDate).toLocaleDateString('bg-BG')
      : '',
    amount:
      typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount,
  }));

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

  const pageCount = 1; // TODO: update if backend supports pagination

  return (
    <DataTable
      columns={columns}
      data={expenses}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      page={page}
      pageCount={pageCount}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
    />
  );
}
