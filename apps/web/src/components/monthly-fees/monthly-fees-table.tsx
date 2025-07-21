import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface MonthlyFeeData {
  id: string;
  name: string;
  apartments: string;
  paymentBase: string;
  monthlyFee: number;
}

export function MonthlyFeesTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof MonthlyFeeData;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for monthly fees
  const mockMonthlyFees: MonthlyFeeData[] = [
    {
      id: '1',
      name: 'Поддръжка Асансьор',
      apartments: '10/12',
      paymentBase: 'Общи Части',
      monthlyFee: 25.0,
    },
    {
      id: '2',
      name: 'Почистване Вход',
      apartments: '12/12',
      paymentBase: 'Апартамент',
      monthlyFee: 50.0,
    },
    {
      id: '3',
      name: 'Такса Домоуправител',
      apartments: '12/12',
      paymentBase: 'Квадратура',
      monthlyFee: 31.54,
    },
    {
      id: '4',
      name: 'Поддръжка Асансьор',
      apartments: '10/12',
      paymentBase: 'Живещ',
      monthlyFee: 50.0,
    },
    {
      id: '5',
      name: 'Почистване Вход',
      apartments: '12/12',
      paymentBase: 'Домашно Животно',
      monthlyFee: 31.54,
    },
  ];

  const handleViewFee = (fee: MonthlyFeeData) => {
    console.log('View monthly fee:', fee.name);
  };

  const handleEditFee = (fee: MonthlyFeeData) => {
    console.log('Edit monthly fee:', fee.name);
  };

  const handleDeleteFee = (fee: MonthlyFeeData) => {
    console.log('Delete monthly fee:', fee.name);
  };

  const getPaymentBaseBadge = (paymentBase: string) => {
    const colorMap: Record<
      string,
      'positive' | 'neutral' | 'warning' | 'negative'
    > = {
      'Общи Части': 'positive',
      Апартамент: 'neutral',
      Квадратура: 'warning',
      Живещ: 'positive',
      'Домашно Животно': 'negative',
    };

    return (
      <Badge variant={colorMap[paymentBase] || 'neutral'}>{paymentBase}</Badge>
    );
  };

  const columns: Column<MonthlyFeeData>[] = [
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
      header: 'Апартаменти',
      accessorKey: 'apartments',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => <span className="text-gray-700">{row.apartments}</span>,
    },
    {
      header: 'Плащане на База',
      accessorKey: 'paymentBase',
      sortable: true,
      width: '150px',
      minWidth: '150px',
      cell: row => getPaymentBaseBadge(row.paymentBase),
    },
    {
      header: 'Месечна Такса',
      accessorKey: 'monthlyFee',
      sortable: true,
      width: '130px',
      minWidth: '130px',
      cell: row => (
        <span className="font-medium text-gray-900">
          {row.monthlyFee.toFixed(2)} лв.
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
            onClick={() => handleViewFee(row)}
            className="h-8 w-8 p-0"
            title="Преглед"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditFee(row)}
            className="h-8 w-8 p-0"
            title="Редактиране"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteFee(row)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Изтриване"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const transformedData = {
    items: mockMonthlyFees,
    meta: {
      pageCount: Math.ceil(mockMonthlyFees.length / 10),
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
