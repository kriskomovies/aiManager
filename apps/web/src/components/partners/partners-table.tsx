import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/data-table';
import { PartnerStatusBadge } from '@/components/ui/partner-status-badge';
import { Edit, Trash2, Mail, Phone, Globe } from 'lucide-react';
// import { useAppDispatch } from '@/redux/hooks';
// import { openModal } from '@/redux/slices/modal-slice';
import {
  PartnerType,
  PartnerStatus,
} from '@/pages/partners/add-edit-partner.schema';

// Mock Partner interface based on our schema
export interface IPartnerListItem {
  id: string;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  email: string;
  phone: string;
  city: string;
  country: string;
  taxNumber: string;
  website?: string;
  creditLimit?: number;
  servicesCount: number;
  buildingsCount: number;
  contractActive: boolean;
  lastActivity: string;
}

// Mock data for partners
const mockPartnersData: IPartnerListItem[] = [
  {
    id: '1',
    name: 'Строй-Инвест ЕООД',
    type: PartnerType.CONTRACTOR,
    status: PartnerStatus.ACTIVE,
    email: 'office@stroy-invest.bg',
    phone: '+359 88 123 4567',
    city: 'София',
    country: 'България',
    taxNumber: 'BG123456789',
    website: 'https://stroy-invest.bg',
    creditLimit: 50000,
    servicesCount: 3,
    buildingsCount: 12,
    contractActive: true,
    lastActivity: '2024-01-15',
  },
  {
    id: '2',
    name: 'Чистота и Ред ООД',
    type: PartnerType.SERVICE_PROVIDER,
    status: PartnerStatus.ACTIVE,
    email: 'contact@clean-order.bg',
    phone: '+359 87 654 3210',
    city: 'Пловдив',
    country: 'България',
    taxNumber: 'BG987654321',
    servicesCount: 2,
    buildingsCount: 8,
    contractActive: true,
    lastActivity: '2024-01-12',
  },
  {
    id: '3',
    name: 'Електро-Сервиз АД',
    type: PartnerType.SERVICE_PROVIDER,
    status: PartnerStatus.ACTIVE,
    email: 'info@electro-service.bg',
    phone: '+359 89 111 2222',
    city: 'Варна',
    country: 'България',
    taxNumber: 'BG456789123',
    creditLimit: 25000,
    servicesCount: 4,
    buildingsCount: 15,
    contractActive: true,
    lastActivity: '2024-01-10',
  },
  {
    id: '4',
    name: 'Градинарство Плюс ЕООД',
    type: PartnerType.CONTRACTOR,
    status: PartnerStatus.INACTIVE,
    email: 'office@garden-plus.bg',
    phone: '+359 88 999 8888',
    city: 'Бургас',
    country: 'България',
    taxNumber: 'BG789123456',
    servicesCount: 1,
    buildingsCount: 3,
    contractActive: false,
    lastActivity: '2023-12-20',
  },
  {
    id: '5',
    name: 'Консулт Експерт ООД',
    type: PartnerType.CONSULTANT,
    status: PartnerStatus.PENDING,
    email: 'consult@expert.bg',
    phone: '+359 87 777 6666',
    city: 'София',
    country: 'България',
    taxNumber: 'BG321654987',
    creditLimit: 15000,
    servicesCount: 2,
    buildingsCount: 0,
    contractActive: false,
    lastActivity: '2024-01-08',
  },
];

// Helper functions for formatting
const formatPartnerType = (type: PartnerType): string => {
  const typeLabels: Record<PartnerType, string> = {
    [PartnerType.SUPPLIER]: 'Доставчик',
    [PartnerType.SERVICE_PROVIDER]: 'Услугодател',
    [PartnerType.CONTRACTOR]: 'Изпълнител',
    [PartnerType.VENDOR]: 'Продавач',
    [PartnerType.CONSULTANT]: 'Консултант',
    [PartnerType.OTHER]: 'Друго',
  };
  return typeLabels[type];
};

const formatPartnerStatus = (status: PartnerStatus): React.JSX.Element => {
  return <PartnerStatusBadge status={status} />;
};

export function PartnersTable() {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof IPartnerListItem;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock API response structure
  const mockApiResponse = {
    items: mockPartnersData,
    meta: {
      pageCount: 1,
      total: mockPartnersData.length,
      page: 1,
      pageSize: 10,
    },
  };

  const handleDeletePartner = (partner: IPartnerListItem) => {
    // TODO: Implement delete partner modal
    console.log('Delete partner:', partner);
    // dispatch(
    //   openModal({
    //     type: 'delete-partner',
    //     data: {
    //       partnerId: partner.id,
    //       partnerName: partner.name,
    //     },
    //   })
    // );
  };

  const columns: Column<IPartnerListItem>[] = [
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '20%',
      minWidth: '180px',
      cell: row => (
        <div className="font-medium text-red-600 hover:text-red-800 cursor-pointer truncate">
          {row.name}
        </div>
      ),
    },
    {
      header: 'Тип',
      accessorKey: 'type',
      sortable: true,
      width: '12%',
      minWidth: '100px',
      cell: row => (
        <span className="text-gray-700 text-xs sm:text-sm">
          {formatPartnerType(row.type)}
        </span>
      ),
    },
    {
      header: 'Статус',
      accessorKey: 'status',
      sortable: true,
      width: '10%',
      minWidth: '90px',
      cell: row => formatPartnerStatus(row.status),
    },
    {
      header: 'Контакт',
      accessorKey: 'email',
      width: '15%',
      minWidth: '150px',
      cell: row => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Mail className="w-3 h-3" />
            <span className="truncate">{row.email}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Phone className="w-3 h-3" />
            <span className="truncate">{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Локация',
      accessorKey: 'city',
      sortable: true,
      width: '12%',
      minWidth: '100px',
      cell: row => (
        <div className="text-xs sm:text-sm text-gray-700">
          <div>{row.city}</div>
          <div className="text-gray-500">{row.country}</div>
        </div>
      ),
    },
    {
      header: 'Услуги/Сгради',
      accessorKey: 'servicesCount',
      sortable: true,
      width: '10%',
      minWidth: '90px',
      cell: row => (
        <div className="text-xs sm:text-sm text-gray-700 text-center">
          <div>{row.servicesCount} услуги</div>
          <div className="text-gray-500">{row.buildingsCount} сгради</div>
        </div>
      ),
    },
    {
      header: 'Договор',
      accessorKey: 'contractActive',
      sortable: true,
      width: '8%',
      minWidth: '70px',
      cell: row => (
        <div className="flex items-center justify-center">
          <span
            className={`w-2 h-2 rounded-full ${
              row.contractActive ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={
              row.contractActive ? 'Активен договор' : 'Няма активен договор'
            }
          />
        </div>
      ),
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      minWidth: '100px',
      width: '100px',
      cell: row => (
        <div className="flex items-center gap-1">
          {row.website && (
            <button
              onClick={e => {
                e.stopPropagation();
                window.open(row.website, '_blank');
              }}
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
              title="Отвори уебсайт"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}
          <button
            onClick={e => {
              e.stopPropagation();
              navigate(`/partners/${row.id}/edit`);
            }}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Редактирай"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              handleDeletePartner(row);
            }}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            title="Изтрий"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={mockApiResponse.items}
      isLoading={false}
      isFetching={false}
      error={undefined}
      page={page}
      pageCount={mockApiResponse.meta.pageCount}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
      onRowClick={row => navigate(`/partners/${row.id}`)}
    />
  );
}
