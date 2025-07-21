import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { useGetApartmentsByBuildingQuery } from '@/redux/services/apartment.service';
import { ResidentRole } from '@repo/interfaces';

interface BuildingResidentsTableProps {
  buildingId: string;
}

interface ResidentWithApartment {
  id: string;
  apartmentNumber: string;
  fullName: string;
  role: ResidentRole;
  email: string;
  phone: string;
  usesApp: boolean;
  isMainContact: boolean;
  apartmentId: string;
}

export function BuildingResidentsTable({ buildingId }: BuildingResidentsTableProps) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof ResidentWithApartment;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Fetch apartments with residents for the building
  const { 
    data: apartments = [], 
    isLoading, 
    error 
  } = useGetApartmentsByBuildingQuery(buildingId);

  // Transform apartments data to flat residents list
  const residents: ResidentWithApartment[] = apartments.flatMap(apartment => 
    (apartment.residents || []).map(resident => ({
      id: resident.id,
      apartmentNumber: apartment.number,
      fullName: `${resident.name} ${resident.surname}`,
      role: resident.role,
      email: resident.email,
      phone: resident.phone,
      usesApp: Math.random() > 0.5, // Mock data - TODO: Replace with actual app usage data
      isMainContact: resident.isMainContact,
      apartmentId: apartment.id,
    }))
  );

  const handleEdit = (residentId: string, apartmentId: string) => {
    dispatch(openModal({
      type: 'edit-apartment-irregularity', // TODO: Create edit-resident modal type
      data: { residentId, apartmentId }
    }));
  };

  const handleDelete = (residentId: string, residentName: string) => {
    dispatch(openModal({
      type: 'delete-apartment-irregularity', // TODO: Create delete-resident modal type
      data: { 
        residentId,
        residentName
      }
    }));
  };

  const getRoleBadge = (role: ResidentRole) => {
    const roleMap = {
      [ResidentRole.OWNER]: { label: 'Собственик', variant: 'positive' as const },
      [ResidentRole.TENANT]: { label: 'Наемател', variant: 'neutral' as const },
      [ResidentRole.GUEST]: { label: 'Гост', variant: 'warning' as const },
    };
    
    const config = roleMap[role] || { label: role, variant: 'neutral' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAppUsageBadge = (usesApp: boolean) => {
    return (
      <Badge variant={usesApp ? 'positive' : 'negative'}>
        {usesApp ? 'Да' : 'Не'}
      </Badge>
    );
  };

  const columns: Column<ResidentWithApartment>[] = [
    {
      header: 'Апартамент',
      accessorKey: 'apartmentNumber',
      sortable: true,
      width: '100px',
      minWidth: '100px',
    },
    {
      header: 'Име',
      accessorKey: 'fullName',
      sortable: true,
      searchable: true,
      width: '200px',
      minWidth: '200px',
    },
    {
      header: 'Тип',
      accessorKey: 'role',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => getRoleBadge(row.role),
    },
    {
      header: 'Имейл',
      accessorKey: 'email',
      sortable: true,
      searchable: true,
      width: '200px',
      minWidth: '200px',
    },
    {
      header: 'Телефон',
      accessorKey: 'phone',
      sortable: true,
      width: '140px',
      minWidth: '140px',
    },
    {
      header: 'Използва приложението',
      accessorKey: 'usesApp',
      sortable: true,
      width: '160px',
      minWidth: '160px',
      cell: row => getAppUsageBadge(row.usesApp),
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
              onClick={() => handleEdit(row.id, row.apartmentId)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              title="Редактирай"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDelete(row.id, row.fullName)}
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

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Грешка при зареждане на жители. Моля опитайте отново.
      </div>
    );
  }

  const transformedData = {
    items: residents,
    meta: {
      pageCount: Math.ceil(residents.length / 10),
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">
          Жители на сградата
        </h4>
        <Badge variant="neutral" className="text-xs">
          {residents.length} жители
        </Badge>
      </div>
      
      <DataTable
        columns={columns}
        data={transformedData.items}
        isLoading={isLoading}
        isFetching={isLoading}
        error={error ? 'Грешка при зареждане' : null}
        page={page}
        pageCount={transformedData.meta.pageCount}
        sorting={sorting}
        onPageChange={setPage}
        onSortingChange={setSorting}
      />
    </div>
  );
}
