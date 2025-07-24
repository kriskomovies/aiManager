import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/ui/data-table';

interface FeeData {
  month: string;
  residentsCount: number;
  tokAsansor: number;
  taksaAsansor: number;
  pochistvane: number;
  obshoTaksiZaMeseca: number;
  stariZadolzheniya: number;
  plateno: number;
}

interface FeeDataWithStyle extends FeeData {
  className?: string;
}

// Mock data based on the screenshot
const mockFeeData: FeeData[] = [
  {
    month: '12.2024',
    residentsCount: 3,
    tokAsansor: 12.99,
    taksaAsansor: 12.99,
    pochistvane: 12.99,
    obshoTaksiZaMeseca: 38.97,
    stariZadolzheniya: 0,
    plateno: 585.0,
  },
  {
    month: '11.2024',
    residentsCount: 3,
    tokAsansor: 12.99,
    taksaAsansor: 12.99,
    pochistvane: 12.99,
    obshoTaksiZaMeseca: 38.97,
    stariZadolzheniya: 0,
    plateno: 585.0,
  },
  {
    month: '10.2024',
    residentsCount: 3,
    tokAsansor: 12.99,
    taksaAsansor: 12.99,
    pochistvane: 12.99,
    obshoTaksiZaMeseca: 38.97,
    stariZadolzheniya: 0,
    plateno: 585.0,
  },
  {
    month: '09.2024',
    residentsCount: 3,
    tokAsansor: 12.99,
    taksaAsansor: 12.99,
    pochistvane: 12.99,
    obshoTaksiZaMeseca: 38.97,
    stariZadolzheniya: 11.0,
    plateno: 585.0,
  },
  {
    month: '08.2024',
    residentsCount: 2,
    tokAsansor: 12.99,
    taksaAsansor: 12.99,
    pochistvane: 12.99,
    obshoTaksiZaMeseca: 38.97,
    stariZadolzheniya: 0,
    plateno: 585.0,
  },
  {
    month: '07.2024',
    residentsCount: 2,
    tokAsansor: 12.99,
    taksaAsansor: 12.99,
    pochistvane: 12.99,
    obshoTaksiZaMeseca: 38.97,
    stariZadolzheniya: 11.0,
    plateno: 585.0,
  },
  {
    month: '06.2024',
    residentsCount: 2,
    tokAsansor: 12.99,
    taksaAsansor: 12.99,
    pochistvane: 12.99,
    obshoTaksiZaMeseca: 38.97,
    stariZadolzheniya: 11.0,
    plateno: 585.0,
  },
  {
    month: '05.2024',
    residentsCount: 2,
    tokAsansor: 12.99,
    taksaAsansor: 12.99,
    pochistvane: 12.99,
    obshoTaksiZaMeseca: 38.97,
    stariZadolzheniya: 0,
    plateno: 585.0,
  },
  {
    month: '04.2024',
    residentsCount: 2,
    tokAsansor: 12.99,
    taksaAsansor: 12.99,
    pochistvane: 12.99,
    obshoTaksiZaMeseca: 38.97,
    stariZadolzheniya: 0,
    plateno: 585.0,
  },
];

interface ApartmentFeesReferenceTableProps {
  hideOldDebtsColumn?: boolean;
}

export function ApartmentFeesReferenceTable({
  hideOldDebtsColumn = false,
}: ApartmentFeesReferenceTableProps = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof FeeDataWithStyle;
    direction: 'asc' | 'desc';
  } | null>(null);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(mockFeeData.length / itemsPerPage);

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} лв.`;
  };

  const getDebtBadge = (amount: number) => {
    if (amount > 0) {
      return (
        <Badge variant="negative" className="text-xs">
          {formatCurrency(amount)}
        </Badge>
      );
    }
    return <span className="text-gray-400">-</span>;
  };

  const getPaidBadge = (amount: number) => {
    return (
      <Badge variant="positive" className="text-xs">
        {formatCurrency(amount)}
      </Badge>
    );
  };

  const baseColumns: Column<FeeDataWithStyle>[] = [
    {
      header: 'Месец',
      accessorKey: 'month',
      sortable: true,
      width: hideOldDebtsColumn ? '14%' : '12%',
      minWidth: '100px',
      cell: row => (
        <span className="font-medium text-gray-900">{row.month}</span>
      ),
    },
    {
      header: 'Брой\nЖивущи',
      accessorKey: 'residentsCount',
      sortable: true,
      width: hideOldDebtsColumn ? '12%' : '10%',
      minWidth: '80px',
      cell: row => (
        <div className="text-center text-gray-700">{row.residentsCount}</div>
      ),
    },
    {
      header: 'Ток Асансьор',
      accessorKey: 'tokAsansor',
      sortable: true,
      width: hideOldDebtsColumn ? '14%' : '12%',
      minWidth: '100px',
      cell: row => (
        <div className="text-right text-gray-700">
          {formatCurrency(row.tokAsansor)}
        </div>
      ),
    },
    {
      header: 'Такса Асансьор',
      accessorKey: 'taksaAsansor',
      sortable: true,
      width: hideOldDebtsColumn ? '14%' : '12%',
      minWidth: '110px',
      cell: row => (
        <div className="text-right text-gray-700">
          {formatCurrency(row.taksaAsansor)}
        </div>
      ),
    },
    {
      header: 'Почистване',
      accessorKey: 'pochistvane',
      sortable: true,
      width: hideOldDebtsColumn ? '14%' : '12%',
      minWidth: '100px',
      cell: row => (
        <div className="text-right text-gray-700">
          {formatCurrency(row.pochistvane)}
        </div>
      ),
    },
    {
      header: 'Общо Такси\nза Месеца',
      accessorKey: 'obshoTaksiZaMeseca',
      sortable: true,
      width: hideOldDebtsColumn ? '16%' : '14%',
      minWidth: '120px',
      cell: row => (
        <div className="text-right">
          <Badge variant="neutral" className="text-xs font-medium">
            {formatCurrency(row.obshoTaksiZaMeseca)}
          </Badge>
        </div>
      ),
    },
  ];

  // Add the old debts column only if not hidden
  const oldDebtsColumn: Column<FeeDataWithStyle> = {
    header: 'Стари\nЗадължения',
    accessorKey: 'stariZadolzheniya',
    sortable: true,
    width: '14%',
    minWidth: '120px',
    cell: row => (
      <div className="text-right">{getDebtBadge(row.stariZadolzheniya)}</div>
    ),
  };

  const paidColumn: Column<FeeDataWithStyle> = {
    header: 'Платено',
    accessorKey: 'plateno',
    sortable: true,
    width: hideOldDebtsColumn ? '16%' : '14%',
    minWidth: '100px',
    cell: row => (
      <div className="text-right">
        {row.month === '06.2024' ? (
          <div className="inline-block">{getPaidBadge(row.plateno)}</div>
        ) : (
          getPaidBadge(row.plateno)
        )}
      </div>
    ),
  };

  // Conditionally build columns array
  const columns: Column<FeeDataWithStyle>[] = hideOldDebtsColumn
    ? [...baseColumns, paidColumn]
    : [...baseColumns, oldDebtsColumn, paidColumn];

  // Apply sorting to data
  const sortedData = [...mockFeeData];
  if (sorting && sorting.field !== 'className') {
    sortedData.sort((a, b) => {
      const aValue = a[sorting.field as keyof FeeData];
      const bValue = b[sorting.field as keyof FeeData];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sorting.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  // Apply pagination
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={paginatedData.map(row => ({
          ...row,
          className:
            row.month === '06.2024' ? 'bg-blue-50 border-blue-200' : '',
        }))}
        page={currentPage}
        pageCount={totalPages}
        sorting={sorting}
        onPageChange={setCurrentPage}
        onSortingChange={setSorting}
        className="w-full"
      />
    </div>
  );
}
