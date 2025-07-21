import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';

interface MessagesTableProps {
  buildingId: string;
}

interface MessageRecord {
  id: string;
  title: string;
  deliveryMethod: 'SMS' | 'EMAIL' | 'PUSH' | 'IN_APP';
  recipients: string;
  date: string;
  status: 'sent' | 'pending' | 'failed';
  recipientCount: number;
}

export function MessagesTable({ buildingId }: MessagesTableProps) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof MessageRecord;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for messages - TODO: Replace with actual API call using buildingId
  console.log('Loading messages for building:', buildingId);
  
  const mockMessages: MessageRecord[] = [
    {
      id: '1',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: '2',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 2,
    },
    {
      id: '2',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: 'Всички (12)',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 12,
    },
    {
      id: '3',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: 'Всички (12)',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 12,
    },
    {
      id: '4',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: '7',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 7,
    },
    {
      id: '5',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: '10',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 10,
    },
    {
      id: '6',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: 'Всички (12)',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 12,
    },
    {
      id: '7',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: 'Всички (12)',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 12,
    },
    {
      id: '8',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: '7',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 7,
    },
    {
      id: '9',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: '3',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 3,
    },
    {
      id: '10',
      title: 'Заглавие Съобщение',
      deliveryMethod: 'SMS',
      recipients: '1',
      date: '28.01.2025',
      status: 'sent',
      recipientCount: 1,
    },
  ];

  const handleView = (messageId: string) => {
    dispatch(openModal({
      type: 'view-message',
      data: { messageId, buildingId }
    }));
  };

  const handleEdit = (messageId: string) => {
    dispatch(openModal({
      type: 'edit-message',
      data: { messageId, buildingId }
    }));
  };

  const handleDelete = (messageId: string) => {
    const message = mockMessages.find(item => item.id === messageId);
    dispatch(openModal({
      type: 'delete-message',
      data: { 
        messageId, 
        buildingId,
        messageTitle: message?.title || 'Неизвестно съобщение'
      }
    }));
  };

  const getDeliveryMethodBadge = (method: MessageRecord['deliveryMethod']) => {
    const methodMap = {
      'SMS': { label: 'SMS', variant: 'positive' as const },
      'EMAIL': { label: 'Email', variant: 'neutral' as const },
      'PUSH': { label: 'Push', variant: 'warning' as const },
      'IN_APP': { label: 'В Приложението', variant: 'default' as const },
    };
    
    const config = methodMap[method] || { label: method, variant: 'neutral' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns: Column<MessageRecord>[] = [
    {
      header: 'Заглавие',
      accessorKey: 'title',
      sortable: true,
      searchable: true,
      width: '250px',
      minWidth: '250px',
    },
    {
      header: 'Метод на Доставка',
      accessorKey: 'deliveryMethod',
      sortable: true,
      width: '150px',
      minWidth: '150px',
      cell: row => getDeliveryMethodBadge(row.deliveryMethod),
    },
    {
      header: 'Получатели',
      accessorKey: 'recipients',
      sortable: true,
      width: '120px',
      minWidth: '120px',
    },
    {
      header: 'Дата',
      accessorKey: 'date',
      sortable: true,
      width: '100px',
      minWidth: '100px',
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      width: '120px',
      minWidth: '120px',
      cell: row => {
        return (
          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1">
            <button 
              onClick={() => handleView(row.id)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              title="Прегледай"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleEdit(row.id)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              title="Редактирай"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDelete(row.id)}
              className="p-2 text-gray-500 hover:text-red-700 transition-colors rounded-md hover:bg-red-50 active:bg-red-100 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              title="Изтрий"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const transformedData = {
    items: mockMessages,
    meta: {
      pageCount: Math.ceil(mockMessages.length / 10),
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">
          Съобщения към жители
        </h4>
        <Badge variant="neutral" className="text-xs">
          {mockMessages.length} съобщения
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
