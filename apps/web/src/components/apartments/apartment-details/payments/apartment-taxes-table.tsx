import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye } from 'lucide-react';

interface ApartmentTaxesTableProps {
  apartmentId: string;
}

interface TaxRecord {
  id: string;
  date: string;
  document: string;
  documentUrl: string;
  paidBy: string;
  monthlyTax: number;
  oldAmount: number;
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export function ApartmentTaxesTable({ apartmentId }: ApartmentTaxesTableProps) {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof TaxRecord;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for taxes - TODO: Replace with actual API call using apartmentId
  console.log('Loading taxes for apartment:', apartmentId);
  const mockTaxes: TaxRecord[] = [
    {
      id: '1',
      date: '20.02.2025',
      document: '200381392',
      documentUrl: '#',
      paidBy: 'Касиер',
      monthlyTax: 20.0,
      oldAmount: 0.0,
      totalAmount: 20.0,
      status: 'paid',
    },
    {
      id: '2',
      date: '20.02.2025',
      document: '200381392',
      documentUrl: '#',
      paidBy: 'Банка',
      monthlyTax: 20.0,
      oldAmount: 0.0,
      totalAmount: 20.0,
      status: 'paid',
    },
    {
      id: '3',
      date: '19.02.2025',
      document: '200381392',
      documentUrl: '#',
      paidBy: 'И-мей',
      monthlyTax: 20.0,
      oldAmount: 0.0,
      totalAmount: 20.0,
      status: 'paid',
    },
    {
      id: '4',
      date: '18.02.2025',
      document: '200381392',
      documentUrl: '#',
      paidBy: 'Захари',
      monthlyTax: 20.0,
      oldAmount: 0.0,
      totalAmount: 20.0,
      status: 'paid',
    },
    {
      id: '5',
      date: '18.02.2025',
      document: '200381392',
      documentUrl: '#',
      paidBy: 'Касиер',
      monthlyTax: 20.0,
      oldAmount: 0.0,
      totalAmount: 20.0,
      status: 'paid',
    },
  ];

  const handleDocumentClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  const handleView = (taxId: string) => {
    console.log('View tax:', taxId);
  };

  const columns: Column<TaxRecord>[] = [
    {
      header: 'Дата',
      accessorKey: 'date',
      sortable: true,
      width: '100px',
      minWidth: '100px',
    },
    {
      header: 'Документ',
      accessorKey: 'document',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <button
          onClick={() => handleDocumentClick(row.documentUrl)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="underline">{row.document}</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      ),
    },
    {
      header: 'Платено от',
      accessorKey: 'paidBy',
      sortable: true,
      width: '100px',
      minWidth: '100px',
    },
    {
      header: 'Месечна Такса',
      accessorKey: 'monthlyTax',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.monthlyTax.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Старо',
      accessorKey: 'oldAmount',
      sortable: true,
      width: '80px',
      minWidth: '80px',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.oldAmount.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Обща сума',
      accessorKey: 'totalAmount',
      sortable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => (
        <span className="text-gray-900 font-medium whitespace-nowrap">
          {row.totalAmount.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      width: '70px',
      minWidth: '70px',
      cell: row => {
        return (
          <div onClick={e => e.stopPropagation()}>
            <button
              onClick={() => handleView(row.id)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              title="Преглед"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const transformedData = {
    items: mockTaxes,
    meta: {
      pageCount: Math.ceil(mockTaxes.length / 10),
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">История на таксите</h4>
        <Badge variant="neutral" className="text-xs">
          {mockTaxes.length} записа
        </Badge>
      </div>

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
    </div>
  );
}
