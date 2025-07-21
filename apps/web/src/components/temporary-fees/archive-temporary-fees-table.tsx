import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface ArchiveTemporaryFeeData {
  id: string;
  name: string;
  includedApartments: string;
  paymentBase: string;
  startDate: string;
  endDate: string;
  months: number;
}

export function ArchiveTemporaryFeesTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof ArchiveTemporaryFeeData;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for archived temporary fees
  const mockArchivedFees: ArchiveTemporaryFeeData[] = [
    {
      id: '1',
      name: 'Ремонт Входна Врата',
      includedApartments: '12/12',
      paymentBase: 'Апартамент',
      startDate: '01.01.2023',
      endDate: '31.12.2023',
      months: 12,
    },
    {
      id: '2',
      name: 'Боядисване Стълбище',
      includedApartments: '10/12',
      paymentBase: 'Квадратура',
      startDate: '15.06.2023',
      endDate: '15.12.2023',
      months: 6,
    },
    {
      id: '3',
      name: 'Почистване Двор',
      includedApartments: '8/12',
      paymentBase: 'Живещ',
      startDate: '01.03.2023',
      endDate: '01.09.2023',
      months: 6,
    },
    {
      id: '4',
      name: 'Смяна Осветление',
      includedApartments: '12/12',
      paymentBase: 'Общи Части',
      startDate: '01.10.2022',
      endDate: '31.03.2023',
      months: 6,
    },
  ];

  const handleViewFee = (fee: ArchiveTemporaryFeeData) => {
    console.log('View archived temporary fee:', fee.name);
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

  const columns: Column<ArchiveTemporaryFeeData>[] = [
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
      header: 'Крайна Дата',
      accessorKey: 'endDate',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => <span className="text-gray-700">{row.endDate}</span>,
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
      width: '80px',
      minWidth: '80px',
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
        </div>
      ),
    },
  ];

  const transformedData = {
    items: mockArchivedFees,
    meta: {
      pageCount: Math.ceil(mockArchivedFees.length / 10),
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
