import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, type DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical, ExternalLink, Edit, Trash2, Eye, Receipt } from 'lucide-react';

interface ApartmentRepairsTableProps {
  apartmentId: string;
}

interface RepairRecord {
  id: string;
  date: string;
  document: string;
  documentUrl: string;
  paidBy: string;
  cashier: string;
  tax: number;
  deposit: number;
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export function ApartmentRepairsTable({ apartmentId }: ApartmentRepairsTableProps) {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof RepairRecord;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for repairs - TODO: Replace with actual API call using apartmentId
  console.log('Loading repairs for apartment:', apartmentId);
  const mockRepairs: RepairRecord[] = [
    {
      id: '1',
      date: '15.01.2025',
      document: 'REP001',
      documentUrl: '#',
      paidBy: 'Захари Марчев',
      cashier: 'Мария Иванова',
      tax: 50.00,
      deposit: 100.00,
      totalAmount: 150.00,
      status: 'paid'
    },
    {
      id: '2',
      date: '10.01.2025',
      document: 'REP002',
      documentUrl: '#',
      paidBy: 'Банка',
      cashier: 'Петър Петров',
      tax: 25.00,
      deposit: 75.00,
      totalAmount: 100.00,
      status: 'paid'
    },
    {
      id: '3',
      date: '05.01.2025',
      document: 'REP003',
      documentUrl: '#',
      paidBy: 'Касиер',
      cashier: 'Анна Димитрова',
      tax: 30.00,
      deposit: 0.00,
      totalAmount: 30.00,
      status: 'pending'
    },
  ];

  const handleDocumentClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  const handleEdit = (repairId: string) => {
    console.log('Edit repair:', repairId);
  };

  const handleDelete = (repairId: string) => {
    console.log('Delete repair:', repairId);
  };

  const handleView = (repairId: string) => {
    console.log('View repair:', repairId);
  };

  const handleBill = (repairId: string) => {
    console.log('Generate bill for repair:', repairId);
  };

  const columns: Column<RepairRecord>[] = [
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
      width: '120px',
      minWidth: '120px',
    },
    {
      header: 'Касиер',
      accessorKey: 'cashier',
      sortable: true,
      width: '120px',
      minWidth: '120px',
    },
    {
      header: 'Такса',
      accessorKey: 'tax',
      sortable: true,
      width: '80px',
      minWidth: '80px',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.tax.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Депозит',
      accessorKey: 'deposit',
      sortable: true,
      width: '80px',
      minWidth: '80px',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.deposit.toFixed(2)} лв.
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
        const menuItems: (DropdownMenuItem | 'separator')[] = [
          {
            label: 'Преглед',
            onClick: () => handleView(row.id),
            icon: Eye,
          },
          {
            label: 'Фактура',
            onClick: () => handleBill(row.id),
            icon: Receipt,
          },
          'separator',
          {
            label: 'Редактирай',
            onClick: () => handleEdit(row.id),
            icon: Edit,
          },
          {
            label: 'Изтрий',
            onClick: () => handleDelete(row.id),
            icon: Trash2,
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu
              trigger={
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation">
                  <MoreVertical className="w-4 h-4" />
                </button>
              }
              items={menuItems}
              align="right"
            />
          </div>
        );
      },
    },
  ];

  const transformedData = {
    items: mockRepairs,
    meta: {
      pageCount: Math.ceil(mockRepairs.length / 10),
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">История на ремонтите</h4>
        <Badge variant="neutral" className="text-xs">
          {mockRepairs.length} записа
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
