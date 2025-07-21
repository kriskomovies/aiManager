import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface TemporaryFeeData {
  id: string;
  name: string;
  progress: number;
  remainingObligations: number;
  includedApartments: string;
  paymentBase: string;
  startDate: string;
  months: number;
}

export function TemporaryFeesTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof TemporaryFeeData;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for temporary fees
  const mockTemporaryFees: TemporaryFeeData[] = [
    {
      id: '1',
      name: 'Ремонт Покрив',
      progress: 75,
      remainingObligations: 1250.0,
      includedApartments: '10/12',
      paymentBase: 'Квадратура',
      startDate: '01.01.2024',
      months: 12,
    },
    {
      id: '2',
      name: 'Обновяване Фасада',
      progress: 45,
      remainingObligations: 3200.5,
      includedApartments: '12/12',
      paymentBase: 'Апартамент',
      startDate: '15.03.2024',
      months: 18,
    },
    {
      id: '3',
      name: 'Смяна Асансьор',
      progress: 20,
      remainingObligations: 8500.0,
      includedApartments: '8/12',
      paymentBase: 'Живещ',
      startDate: '10.06.2024',
      months: 24,
    },
  ];

  const handleViewFee = (fee: TemporaryFeeData) => {
    console.log('View temporary fee:', fee.name);
  };

  const handleEditFee = (fee: TemporaryFeeData) => {
    console.log('Edit temporary fee:', fee.name);
  };

  const handleDeleteFee = (fee: TemporaryFeeData) => {
    console.log('Delete temporary fee:', fee.name);
  };

  const getProgressBadge = (progress: number) => {
    let variant: 'positive' | 'warning' | 'negative' = 'negative';
    if (progress >= 75) variant = 'positive';
    else if (progress >= 50) variant = 'warning';

    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              variant === 'positive'
                ? 'bg-green-500'
                : variant === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
    );
  };

  const getPaymentBaseBadge = (paymentBase: string) => {
    const colorMap: Record<
      string,
      'positive' | 'neutral' | 'warning' | 'negative'
    > = {
      Квадратура: 'warning',
      Апартамент: 'neutral',
      Живещ: 'positive',
      'Общи Части': 'positive',
    };

    return (
      <Badge variant={colorMap[paymentBase] || 'neutral'}>{paymentBase}</Badge>
    );
  };

  const columns: Column<TemporaryFeeData>[] = [
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '180px',
      minWidth: '180px',
      cell: row => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      header: 'Прогрес',
      accessorKey: 'progress',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => getProgressBadge(row.progress),
    },
    {
      header: 'Оставащи Задължения',
      accessorKey: 'remainingObligations',
      sortable: true,
      width: '160px',
      minWidth: '160px',
      cell: row => (
        <span className="font-medium text-red-600">
          {row.remainingObligations.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Включени Апартаменти',
      accessorKey: 'includedApartments',
      sortable: true,
      width: '140px',
      minWidth: '140px',
      cell: row => (
        <span className="text-gray-700">{row.includedApartments}</span>
      ),
    },
    {
      header: 'Плащане на База',
      accessorKey: 'paymentBase',
      sortable: true,
      width: '130px',
      minWidth: '130px',
      cell: row => getPaymentBaseBadge(row.paymentBase),
    },
    {
      header: 'Начална Дата',
      accessorKey: 'startDate',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => <span className="text-gray-700">{row.startDate}</span>,
    },
    {
      header: 'Месеци',
      accessorKey: 'months',
      sortable: true,
      width: '80px',
      minWidth: '80px',
      cell: row => <span className="text-gray-700">{row.months}</span>,
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
    items: mockTemporaryFees,
    meta: {
      pageCount: Math.ceil(mockTemporaryFees.length / 10),
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
