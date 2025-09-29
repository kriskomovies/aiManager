import { useState } from 'react';
import {
  ExpandableDataTable,
  ExpandableColumn,
  ExpandableRowData,
} from '@/components/ui/expandible-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Edit, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { selectModalData } from '@/redux/slices/modal-slice';
import { useGetRecurringExpensesByBuildingQuery } from '@/redux/services/recurring-expense.service';
import { useGetPaymentsByRecurringExpensesQuery } from '@/redux/services/recurring-expense-payment.service';

interface RecurringExpenseData {
  id: string;
  name: string;
  linkedToMonthlyFee: boolean;
  contractor: string;
  paymentDate: string;
  paymentMethod: string;
  reason: string;
  amount: number;
  originalExpense?: unknown; // Store original API response
}

interface RecurringExpenseChild {
  id: string;
  date: string;
  paymentMethod: string;
  reason: string;
  amount: number;
  documentType?: string;
}

interface RecurringExpensesTableProps {
  buildingId?: string;
}

export function RecurringExpensesTable({ buildingId }: RecurringExpensesTableProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  
  // Get building ID from props or modal context
  const effectiveBuildingId = buildingId || (modalData?.buildingId as string) || '';
  
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof RecurringExpenseData;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Fetch real recurring expenses data
  const { data: recurringExpenses = [], isLoading, error } = useGetRecurringExpensesByBuildingQuery(
    effectiveBuildingId,
    {
      skip: !effectiveBuildingId,
    }
  );

  // Get expense IDs for payments query
  const recurringExpenseIds = recurringExpenses.map(expense => expense.id);

  // Fetch payments for all expenses
  const { data: payments = [], isLoading: isLoadingPayments } = useGetPaymentsByRecurringExpensesQuery(
    recurringExpenseIds,
    {
      skip: recurringExpenseIds.length === 0,
    }
  );

  // Transform API data to table format
  const transformedData: ExpandableRowData<RecurringExpenseData, RecurringExpenseChild>[] = 
    recurringExpenses.map(expense => {
      // Get payments for this specific expense
      const expensePayments = payments.filter(payment => payment.recurringExpenseId === expense.id);
      
      // Transform payments to children format
      const children: RecurringExpenseChild[] = expensePayments.map(payment => ({
        id: payment.id,
        date: new Date(payment.paymentDate).toLocaleDateString('bg-BG'),
        paymentMethod: payment.userPaymentMethod?.displayName || 'N/A',
        reason: payment.reason || (payment.connectPayment && payment.monthlyFee ? 
          `Свързано с ${payment.monthlyFee.name}` : 'Плащане'),
        amount: payment.amount,
        documentType: payment.issueDocument ? 
          (payment.documentType === 'invoice' ? 'Фактура' : 
           payment.documentType === 'receipt' ? 'Квитанция' : 'Документ') : undefined,
      }));

      return {
        id: expense.id,
        data: {
          id: expense.id,
          name: expense.name,
          linkedToMonthlyFee: Boolean(expense.monthlyFeeId),
          contractor: '-', // Hardcoded for now, will be implemented later
          paymentDate: expense.paymentDate 
            ? new Date(expense.paymentDate).toLocaleDateString('bg-BG')
            : new Date(expense.createdAt).toLocaleDateString('bg-BG'),
          paymentMethod: expense.userPaymentMethod?.displayName || 'N/A',
          reason: expense.reason || 
            (expense.addToMonthlyFees 
              ? 'Добавен като месечна такса' 
              : expense.monthlyFee?.name || 'Няма свързана месечна такса'),
          amount: expense.monthlyAmount,
          // Store original expense data for edit modal
          originalExpense: expense,
        },
        children,
      };
    });


  const handlePayExpense = (expense: RecurringExpenseData) => {
    dispatch(
      openModal({
        type: 'pay-recurring-expense',
        data: {
          expenseData: expense.originalExpense || expense,
          buildingId: effectiveBuildingId,
        },
      })
    );
  };

  const handleEditExpense = (expense: RecurringExpenseData) => {
    dispatch(
      openModal({
        type: 'edit-recurring-expense',
        data: {
          expenseData: expense.originalExpense || expense,
          buildingId: effectiveBuildingId,
        },
      })
    );
  };

  const handleDeleteExpense = (expense: RecurringExpenseData) => {
    dispatch(
      openModal({
        type: 'delete-recurring-expense',
        data: {
          expenseData: expense.originalExpense || expense,
          buildingId: effectiveBuildingId,
        },
      })
    );
  };

  const columns: ExpandableColumn<RecurringExpenseData>[] = [
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
      cell: row => (
        <Badge variant="neutral">
          {row.paymentMethod}
        </Badge>
      ),
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
            className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white hover:text-white"
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

  const renderExpandedContent = (children: RecurringExpenseChild[]) => {
    if (children.length === 0) {
      return (
        <div className="p-4">
          <p className="text-sm text-gray-500 text-center">Няма извършени плащания</p>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 mb-3">История на плащанията</h4>
          {children.map(child => (
            <div
              key={child.id}
              className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-100"
            >
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{child.date}</span>
                <Badge variant="neutral" className="text-xs">
                  {child.paymentMethod}
                </Badge>
                <span className="text-gray-600">{child.reason}</span>
                {child.documentType && (
                  <Badge variant="positive" className="text-xs">
                    {child.documentType}
                  </Badge>
                )}
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

  const transformedFinalData = {
    items: transformedData,
    meta: {
      pageCount: Math.ceil(transformedData.length / 10),
    },
  };

  return (
    <ExpandableDataTable<RecurringExpenseData, RecurringExpenseChild>
      columns={columns}
      data={transformedFinalData.items}
      isLoading={isLoading || isLoadingPayments}
      isFetching={false}
      error={error}
      page={page}
      pageCount={transformedFinalData.meta.pageCount}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
      renderExpandedContent={(_, children) => renderExpandedContent(children)}
    />
  );
}
