import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, FileText } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';

interface ApartmentIrregularitiesTableProps {
  apartmentId: string;
  isArchive: boolean;
}

interface IrregularityRecord {
  id: string;
  title: string;
  responsible: string;
  date: string;
  attachedFile?: string;
  attachedFileUrl?: string;
  reportedBy: string;
  status: 'докладвана' | 'планувана' | 'в процес' | 'решена';
}

export function ApartmentIrregularitiesTable({ apartmentId, isArchive }: ApartmentIrregularitiesTableProps) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof IrregularityRecord;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for irregularities - TODO: Replace with actual API call using apartmentId
  console.log('Loading irregularities for apartment:', apartmentId, 'isArchive:', isArchive);
  
  const mockActiveIrregularities: IrregularityRecord[] = [
    {
      id: '1',
      title: 'Неработещо Заглавие',
      responsible: 'Име Фамилия',
      date: '28.01.2025',
      attachedFile: 'document1.pdf',
      attachedFileUrl: '#',
      reportedBy: 'Име Фамилия',
      status: 'докладвана'
    },
    {
      id: '2',
      title: 'Неработещо Заглавие',
      responsible: 'Име Фамилия',
      date: '28.01.2025',
      attachedFile: 'document2.pdf',
      attachedFileUrl: '#',
      reportedBy: 'Име Фамилия',
      status: 'докладвана'
    },
    {
      id: '3',
      title: 'Неработещо Заглавие',
      responsible: 'Име Фамилия',
      date: '28.01.2025',
      reportedBy: 'Име Фамилия',
      status: 'планувана'
    },
    {
      id: '4',
      title: 'Неработещо Заглавие',
      responsible: 'Име Фамилия',
      date: '28.01.2025',
      reportedBy: 'Име Фамилия',
      status: 'в процес'
    },
    {
      id: '5',
      title: 'Неработещо Заглавие',
      responsible: 'Име Фамилия',
      date: '28.01.2025',
      reportedBy: 'Име Фамилия',
      status: 'планувана'
    },
  ];

  const mockArchivedIrregularities: IrregularityRecord[] = [
    {
      id: '6',
      title: 'Решена нередност 1',
      responsible: 'Име Фамилия',
      date: '15.12.2024',
      attachedFile: 'resolution1.pdf',
      attachedFileUrl: '#',
      reportedBy: 'Име Фамилия',
      status: 'решена'
    },
    {
      id: '7',
      title: 'Решена нередност 2',
      responsible: 'Име Фамилия',
      date: '10.12.2024',
      reportedBy: 'Име Фамилия',
      status: 'решена'
    },
  ];

  const mockData = isArchive ? mockArchivedIrregularities : mockActiveIrregularities;

  const handleFileClick = (url?: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  const handleEdit = (irregularityId: string) => {
    dispatch(openModal({
      type: 'edit-apartment-irregularity',
      data: { irregularityId, apartmentId }
    }));
  };

  const handleDelete = (irregularityId: string) => {
    const irregularity = mockData.find(item => item.id === irregularityId);
    dispatch(openModal({
      type: 'delete-apartment-irregularity',
      data: { 
        irregularityId, 
        apartmentId,
        irregularityTitle: irregularity?.title || 'Неизвестна нередност'
      }
    }));
  };

  const getStatusBadge = (status: IrregularityRecord['status']) => {
    const statusMap = {
      'докладвана': { label: 'Докладвана', variant: 'negative' as const },
      'планувана': { label: 'Планувана', variant: 'warning' as const },
      'в процес': { label: 'В Процес', variant: 'warning' as const },
      'решена': { label: 'Решена', variant: 'positive' as const },
    };
    
    const config = statusMap[status] || { label: status, variant: 'neutral' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns: Column<IrregularityRecord>[] = [
    {
      header: 'Заглавие',
      accessorKey: 'title',
      sortable: true,
      searchable: true,
      width: '200px',
      minWidth: '200px',
    },
    {
      header: 'Отговорник',
      accessorKey: 'responsible',
      sortable: true,
      width: '150px',
      minWidth: '150px',
    },
    {
      header: 'Дата',
      accessorKey: 'date',
      sortable: true,
      width: '100px',
      minWidth: '100px',
    },
    {
      header: 'Приказен файл',
      accessorKey: 'attachedFile',
      width: '120px',
      minWidth: '120px',
      cell: row => (
        row.attachedFile ? (
          <button
            onClick={() => handleFileClick(row.attachedFileUrl)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FileText className="h-3 w-3" />
            <span className="underline text-sm">{row.attachedFile}</span>
          </button>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )
      ),
    },
    {
      header: 'Докладвана от',
      accessorKey: 'reportedBy',
      sortable: true,
      width: '150px',
      minWidth: '150px',
    },
    {
      header: 'Статус',
      accessorKey: 'status',
      sortable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => getStatusBadge(row.status),
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      width: '100px',
      minWidth: '100px',
      cell: row => {
        return (
          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1">
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
    items: mockData,
    meta: {
      pageCount: Math.ceil(mockData.length / 10),
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">
          {isArchive ? 'Архивирани нередности' : 'Активни нередности'}
        </h4>
        <Badge variant="neutral" className="text-xs">
          {mockData.length} записа
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
