import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, type DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { 
  useGetApartmentsByBuildingQuery,
} from '@/redux/services/apartment.service';
import { IApartmentResponse, ApartmentStatus } from '@repo/interfaces';
import { 
  Home, 
  MoreVertical, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Receipt, 
  BarChart3, 
  Users, 
  Edit,
  Trash2,
} from 'lucide-react';

interface ApartmentsTableProps {
  buildingId?: string;
}

// Extended type for table data
type ApartmentTableData = IApartmentResponse & { 
  name: string; 
  residents: number; 
  elevatorTax: number;
  elevatorElectricity: number;
  stairwayElectricity: number;
  cleaning: number;
  ues: number;
  irregularities: number;
  newTaxes: number;
  oldTaxes: number;
  total: number;
};

export function ApartmentsTable({ buildingId }: ApartmentsTableProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id: paramBuildingId } = useParams<{ id: string }>();
  const effectiveBuildingId = buildingId || paramBuildingId;
  
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof ApartmentTableData;
    direction: 'asc' | 'desc';
  } | null>(null);

  // API hooks
  const { 
    data: apartments = [], 
    isLoading, 
    isFetching, 
    error 
  } = useGetApartmentsByBuildingQuery(effectiveBuildingId!, {
    skip: !effectiveBuildingId,
  });

  const handleDeleteApartment = (apartmentId: string, apartmentNumber: string) => {
    dispatch(openModal({
      type: 'delete-apartment',
      data: { apartmentId, apartmentNumber }
    }));
  };

  const getMainResidentName = (apartment: IApartmentResponse): string => {
    if (!apartment.residents || apartment.residents.length === 0) {
      return 'Няма живущи';
    }
    
    const mainContact = apartment.residents.find(r => r.isMainContact);
    if (mainContact) {
      return `${mainContact.name} ${mainContact.surname}`;
    }
    
    const firstResident = apartment.residents[0];
    return `${firstResident.name} ${firstResident.surname}`;
  };

  const getStatusBadge = (status: ApartmentStatus) => {
    const statusMap = {
      [ApartmentStatus.OCCUPIED]: { label: 'Заето', variant: 'positive' as const },
      [ApartmentStatus.VACANT]: { label: 'Свободно', variant: 'neutral' as const },
      [ApartmentStatus.MAINTENANCE]: { label: 'Поддръжка', variant: 'warning' as const },
      [ApartmentStatus.RESERVED]: { label: 'Резервирано', variant: 'neutral' as const },
    };
    
    const config = statusMap[status] || { label: status, variant: 'neutral' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Transform apartments data to match table structure
  const transformedData = {
    items: apartments.map(apartment => ({
      ...apartment,
      name: getMainResidentName(apartment),
      residents: apartment.residentsCount,
      // Ensure numeric fields are properly converted
      quadrature: parseFloat(String(apartment.quadrature || 0)),
      monthlyRent: apartment.monthlyRent ? parseFloat(String(apartment.monthlyRent)) : undefined,
      maintenanceFee: apartment.maintenanceFee ? parseFloat(String(apartment.maintenanceFee)) : undefined,
      debt: parseFloat(String(apartment.debt || 0)),
      // Map existing fields to expected table structure
      elevatorTax: 0, // TODO: Add when financial system is implemented
      elevatorElectricity: 0, // TODO: Add when financial system is implemented
      stairwayElectricity: 0, // TODO: Add when financial system is implemented
      cleaning: 0, // TODO: Add when financial system is implemented
      ues: 0, // TODO: Add when financial system is implemented
      irregularities: 0, // TODO: Add when irregularities system is implemented
      newTaxes: apartment.maintenanceFee ? parseFloat(String(apartment.maintenanceFee)) : 0,
      oldTaxes: 0, // TODO: Add when financial history is implemented
      total: parseFloat(String(apartment.debt || 0)),
    } as ApartmentTableData)),
    meta: {
      pageCount: Math.ceil(apartments.length / 10), // Simple pagination for now
    },
  };

  const columns: Column<ApartmentTableData>[] = [
    {
      header: 'Апартамент',
      accessorKey: 'number',
      sortable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => (
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-gray-400" />
          <span className="text-red-500 font-medium">{row.number}</span>
        </div>
      ),
    },
    {
      header: 'Етаж',
      accessorKey: 'floor',
      sortable: true,
      width: '70px',
      minWidth: '70px',
    },
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '160px',
      minWidth: '160px',
    },
    {
      header: 'Статус',
      accessorKey: 'status',
      cell: row => getStatusBadge(row.status),
      sortable: true,
      width: '100px',
      minWidth: '100px',
    },
    {
      header: 'Брой Живущи',
      accessorKey: 'residents',
      sortable: true,
      width: '110px',
      minWidth: '110px',
    },
    {
      header: 'Квадратура',
      accessorKey: 'quadrature',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">{row.quadrature.toFixed(2)} кв.м.</span>
      ),
      sortable: true,
      width: '100px',
      minWidth: '100px',
    },
    {
      header: 'Месечна Наемна Цена',
      accessorKey: 'monthlyRent',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.monthlyRent ? `${row.monthlyRent.toFixed(2)} лв.` : 'Не е зададена'}
        </span>
      ),
      sortable: true,
      width: '150px',
      minWidth: '150px',
    },
    {
      header: 'Такса Поддръжка',
      accessorKey: 'maintenanceFee',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.maintenanceFee ? `${row.maintenanceFee.toFixed(2)} лв.` : 'Не е зададена'}
        </span>
      ),
      sortable: true,
      width: '140px',
      minWidth: '140px',
    },
    {
      header: 'Задължения',
      accessorKey: 'debt',
      cell: row => (
        <Badge 
          variant={(row.debt || 0) > 0 ? "negative" : "positive"} 
          value={row.debt || 0} 
          suffix=" лв." 
        />
      ),
      sortable: true,
      width: '100px',
      minWidth: '100px',
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      width: '70px',
      minWidth: '70px',
      cell: row => {
        const menuItems: (DropdownMenuItem | 'separator')[] = [
          {
            label: 'Плащане',
            onClick: () => dispatch(openModal({ 
              type: 'payment', 
              data: { apartmentId: row.id, apartmentNumber: row.number } 
            })),
            icon: CreditCard,
          },
          {
            label: 'Разпечатай Бележка Задължения',
            onClick: () => console.log('Разпечатай бележка за', row.number),
            icon: FileText,
          },
          {
            label: 'Изпрати Съобщение',
            onClick: () => console.log('Изпрати съобщение до', row.number),
            icon: MessageSquare,
          },
          'separator',
          {
            label: 'Справка Такси',
            onClick: () => dispatch(openModal({ 
              type: 'reference-fees', 
              data: { apartmentId: row.id, apartmentNumber: row.number } 
            })),
            icon: Receipt,
          },
          {
            label: 'Справка Плащания',
            onClick: () => dispatch(openModal({ 
              type: 'reference-payments', 
              data: { apartmentId: row.id, apartmentNumber: row.number } 
            })),
            icon: BarChart3,
          },
          {
            label: 'Живущи',
            onClick: () => console.log('Живущи в апартамент', row.number),
            icon: Users,
          },
          'separator',
          {
            label: 'Редактирай Апартамент',
            onClick: () => navigate(`/apartments/${row.id}/edit`),
            icon: Edit,
          },
          {
            label: 'Изтрий Апартамент',
            onClick: () => handleDeleteApartment(row.id, row.number),
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-red-500 mb-2">Грешка при зареждане на апартаментите</p>
          <p className="text-gray-500 text-sm">Моля, опитайте отново</p>
        </div>
      </div>
    );
  }

  if (!effectiveBuildingId) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">Не е избрана сграда</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={transformedData.items}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      page={page}
      pageCount={transformedData.meta.pageCount}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
    />
  );
}
