import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface InventoryTransfer {
  id: string;
  date: string;
  time: string;
  type: 'Приход' | 'Разход';
  payer: string;
  paymentMethod: string;
  note: string;
  amount: number;
}

interface InventoryTransfersTableProps {
  inventoryId?: string;
  dateFilter?: {
    from?: string;
    to?: string;
  };
}

export function InventoryTransfersTable({ dateFilter }: InventoryTransfersTableProps) {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof InventoryTransfer;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for inventory transfers
  const mockTransfers: InventoryTransfer[] = [
    {
      id: '1',
      date: '23.11.2024',
      time: '14:32',
      type: 'Приход',
      payer: 'Иван Иванов',
      paymentMethod: 'В брой',
      note: '-',
      amount: 585.00
    },
    {
      id: '2',
      date: '21.11.2024',
      time: '14:32',
      type: 'Разход',
      payer: 'Иван Иванов',
      paymentMethod: 'Банков превод',
      note: 'Прехвърляне',
      amount: -50.00
    },
    {
      id: '3',
      date: '19.11.2024',
      time: '14:32',
      type: 'Приход',
      payer: 'Иван Иванов',
      paymentMethod: 'Онлайн',
      note: 'Прехвърляне',
      amount: 200.00
    },
    {
      id: '4',
      date: '17.11.2024',
      time: '14:32',
      type: 'Приход',
      payer: 'Иван Иванов',
      paymentMethod: 'В брой',
      note: '-',
      amount: 585.00
    },
    {
      id: '5',
      date: '09.11.2024',
      time: '14:32',
      type: 'Разход',
      payer: 'Иван Иванов',
      paymentMethod: 'Банков превод',
      note: 'Прехвърляне',
      amount: -50.00
    },
    {
      id: '6',
      date: '04.11.2024',
      time: '14:32',
      type: 'Приход',
      payer: 'Иван Иванов',
      paymentMethod: 'Онлайн',
      note: '-',
      amount: 200.00
    },
    {
      id: '7',
      date: '03.11.2024',
      time: '14:32',
      type: 'Приход',
      payer: 'Иван Иванов',
      paymentMethod: 'В брой',
      note: '-',
      amount: 585.00
    },
    {
      id: '8',
      date: '29.10.2024',
      time: '14:32',
      type: 'Разход',
      payer: 'Иван Иванов',
      paymentMethod: 'Банков превод',
      note: 'Прехвърляне',
      amount: -50.00
    },
    {
      id: '9',
      date: '19.10.2024',
      time: '14:32',
      type: 'Приход',
      payer: 'Иван Иванов',
      paymentMethod: 'Онлайн',
      note: '-',
      amount: 200.00
    },
  ];

  // Filter transfers based on date filter if provided
  const filteredTransfers = dateFilter?.from || dateFilter?.to
    ? mockTransfers.filter(transfer => {
        const transferDate = new Date(transfer.date.split('.').reverse().join('-'));
        const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
        const toDate = dateFilter.to ? new Date(dateFilter.to) : null;
        
        if (fromDate && transferDate < fromDate) return false;
        if (toDate && transferDate > toDate) return false;
        
        return true;
      })
    : mockTransfers;

  const columns: Column<InventoryTransfer>[] = [
    {
      header: 'Дата',
      accessorKey: 'date',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{row.date}</div>
          <div className="text-gray-500">{row.time}</div>
        </div>
      ),
    },
    {
      header: 'Тип',
      accessorKey: 'type',
      sortable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => (
        <span className="text-sm font-medium text-gray-900">
          {row.type}
        </span>
      ),
    },
    {
      header: 'Платец',
      accessorKey: 'payer',
      sortable: true,
      searchable: true,
      width: '150px',
      minWidth: '150px',
      cell: row => (
        <span className="text-sm font-medium text-gray-900">
          {row.payer}
        </span>
      ),
    },
    {
      header: 'Метод на Плащане',
      accessorKey: 'paymentMethod',
      sortable: true,
      width: '150px',
      minWidth: '150px',
      cell: row => (
        <span className="text-sm text-gray-700">
          {row.paymentMethod}
        </span>
      ),
    },
    {
      header: 'Бележка',
      accessorKey: 'note',
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <span className="text-sm text-gray-700">
          {row.note}
        </span>
      ),
    },
    {
      header: 'Сума',
      accessorKey: 'amount',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <Badge 
          value={row.amount} 
          suffix=" лв." 
          autoColor
          className="font-medium"
        />
      ),
    },
  ];

  const transformedData = {
    items: filteredTransfers,
    meta: {
      pageCount: Math.ceil(filteredTransfers.length / 10),
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
