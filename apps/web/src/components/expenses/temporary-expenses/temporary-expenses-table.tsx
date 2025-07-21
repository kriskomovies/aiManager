import { useState } from 'react';
import {
  ExpandableDataTable,
  ExpandableColumn,
  ExpandableRowData,
} from '@/components/ui/expandible-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Edit, Trash2 } from 'lucide-react';

interface TemporaryExpenseData {
  id: string;
  name: string;
  linkedToMonthlyFee: boolean;
  contractor: string;
  paymentDate: string;
  paymentMethod: string;
  reason: string;
  amount: number;
}

interface TemporaryExpenseChild {
  id: string;
  date: string;
  contractor: string;
  reason: string;
  amount: number;
}

export function TemporaryExpensesTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof TemporaryExpenseData;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for temporary expenses with expandable children
  const mockExpenses: ExpandableRowData<
    TemporaryExpenseData,
    TemporaryExpenseChild
  >[] = [
    {
      id: '1',
      data: {
        id: '1',
        name: 'Асансьор',
        linkedToMonthlyFee: true,
        contractor: 'Име на фирма',
        paymentDate: '12.12.2024',
        paymentMethod: 'Офис',
        reason: 'Такса от 31.09 до 27.10',
        amount: 585.0,
      },
      children: [
        {
          id: '1-1',
          date: '15.11.2024',
          contractor: 'Банка',
          reason: 'Такса от 31.08 до 27.09',
          amount: 580.5,
        },
        {
          id: '1-2',
          date: '10.10.2024',
          contractor: 'Банка',
          reason: 'Такса от 31.07 до 27.07',
          amount: 560.0,
        },
      ],
    },
    {
      id: '2',
      data: {
        id: '2',
        name: 'Почистване',
        linkedToMonthlyFee: false,
        contractor: 'Име на фирма',
        paymentDate: '12.12.2024',
        paymentMethod: 'Офис',
        reason: 'Такса от 31.09 до 27.10',
        amount: 50.0,
      },
      children: [],
    },
    {
      id: '3',
      data: {
        id: '3',
        name: 'Такса Домоуправител',
        linkedToMonthlyFee: true,
        contractor: 'Име на фирма',
        paymentDate: '12.12.2024',
        paymentMethod: 'Банка',
        reason: 'Такса от 31.09 до 27.10',
        amount: 200.0,
      },
      children: [],
    },
  ];

  const handlePayExpense = (expense: TemporaryExpenseData) => {
    console.log('Pay expense:', expense.name);
  };

  const handleEditExpense = (expense: TemporaryExpenseData) => {
    console.log('Edit expense:', expense.name);
  };

  const handleDeleteExpense = (expense: TemporaryExpenseData) => {
    console.log('Delete expense:', expense.name);
  };

  const columns: ExpandableColumn<TemporaryExpenseData>[] = [
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '140px',
      minWidth: '140px',
      cell: row => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      header: 'Свързан с месечна такса',
      accessorKey: 'linkedToMonthlyFee',
      sortable: true,
      width: '160px',
      minWidth: '160px',
      cell: row => (
        <Badge variant={row.linkedToMonthlyFee ? 'positive' : 'neutral'}>
          {row.linkedToMonthlyFee ? 'Да' : 'Не'}
        </Badge>
      ),
    },
    {
      header: 'Контрагент',
      accessorKey: 'contractor',
      sortable: true,
      width: '120px',
      minWidth: '120px',
    },
    {
      header: 'Дата на плащане',
      accessorKey: 'paymentDate',
      sortable: true,
      width: '120px',
      minWidth: '120px',
    },
    {
      header: 'Начин на плащане',
      accessorKey: 'paymentMethod',
      sortable: true,
      width: '130px',
      minWidth: '130px',
    },
    {
      header: 'Основание',
      accessorKey: 'reason',
      sortable: true,
      width: '180px',
      minWidth: '180px',
    },
    {
      header: 'Сума',
      accessorKey: 'amount',
      sortable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => (
        <span className="font-medium text-gray-900">
          {row.amount.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePayExpense(row)}
            className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white"
            title="Плащане"
          >
            <Wallet className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditExpense(row)}
            className="h-8 w-8 p-0"
            title="Редактиране"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteExpense(row)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Изтриване"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const renderExpandedContent = (children: TemporaryExpenseChild[]) => {
    return (
      <div className="p-4">
        <div className="space-y-2">
          {children.map(child => (
            <div
              key={child.id}
              className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-100"
            >
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{child.date}</span>
                <span className="text-gray-900">{child.contractor}</span>
                <span className="text-gray-600">{child.reason}</span>
              </div>
              <span className="font-medium text-gray-900">
                {child.amount.toFixed(2)} лв.
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const transformedData = {
    items: mockExpenses as ExpandableRowData<
      TemporaryExpenseData,
      TemporaryExpenseChild
    >[],
    meta: {
      pageCount: Math.ceil(mockExpenses.length / 10),
    },
  };

  return (
    <ExpandableDataTable<TemporaryExpenseData, TemporaryExpenseChild>
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
      renderExpandedContent={(_, children) => renderExpandedContent(children)}
    />
  );
}
