import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge, IrregularitiesBadge } from '@/components/ui/badge';
import { DropdownMenu, type DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { 
  Home, 
  MoreVertical, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Receipt, 
  BarChart3, 
  Users, 
  Edit 
} from 'lucide-react';

interface Apartment {
  id: number;
  floor: number;
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
}

export function ApartmentsTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof Apartment;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data based on the image provided
  const mockData = {
    items: [
      {
        id: 1,
        floor: 1,
        name: 'Име Фамилия',
        residents: 1,
        elevatorTax: 0.00,
        elevatorElectricity: 0.00,
        stairwayElectricity: 3.00,
        cleaning: 3.00,
        ues: 3.00,
        irregularities: 3,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
      {
        id: 2,
        floor: 1,
        name: 'Име Фамилия',
        residents: 2,
        elevatorTax: 0.00,
        elevatorElectricity: 0.00,
        stairwayElectricity: 3.00,
        cleaning: 3.00,
        ues: 3.00,
        irregularities: 0,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
      {
        id: 3,
        floor: 1,
        name: 'Име Фамилия',
        residents: 1,
        elevatorTax: 0.00,
        elevatorElectricity: 0.00,
        stairwayElectricity: 0.00,
        cleaning: 0.00,
        ues: 3.00,
        irregularities: 2,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
      {
        id: 4,
        floor: 1,
        name: 'Име Фамилия',
        residents: 2,
        elevatorTax: 0.00,
        elevatorElectricity: 0.00,
        stairwayElectricity: 3.00,
        cleaning: 3.00,
        ues: 3.00,
        irregularities: 0,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
      {
        id: 5,
        floor: 2,
        name: 'Име Фамилия',
        residents: 4,
        elevatorTax: 0.00,
        elevatorElectricity: 0.00,
        stairwayElectricity: 3.00,
        cleaning: 3.00,
        ues: 3.00,
        irregularities: 0,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
      {
        id: 6,
        floor: 2,
        name: 'Име Фамилия',
        residents: 2,
        elevatorTax: 0.00,
        elevatorElectricity: 0.00,
        stairwayElectricity: 3.00,
        cleaning: 3.00,
        ues: 3.00,
        irregularities: 0,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
      {
        id: 7,
        floor: 2,
        name: 'Име Фамилия',
        residents: 4,
        elevatorTax: 0.00,
        elevatorElectricity: 0.00,
        stairwayElectricity: 3.00,
        cleaning: 3.00,
        ues: 3.00,
        irregularities: 4,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
      {
        id: 8,
        floor: 2,
        name: 'Име Фамилия',
        residents: 3,
        elevatorTax: 0.00,
        elevatorElectricity: 0.00,
        stairwayElectricity: 3.00,
        cleaning: 3.00,
        ues: 3.00,
        irregularities: 0,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
      {
        id: 9,
        floor: 3,
        name: 'Име Фамилия',
        residents: 2,
        elevatorTax: 10.00,
        elevatorElectricity: 10.00,
        stairwayElectricity: 3.00,
        cleaning: 3.00,
        ues: 3.00,
        irregularities: 0,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
      {
        id: 10,
        floor: 3,
        name: 'Име Фамилия',
        residents: 3,
        elevatorTax: 10.00,
        elevatorElectricity: 10.00,
        stairwayElectricity: 3.00,
        cleaning: 3.00,
        ues: 3.00,
        irregularities: 0,
        newTaxes: 3.00,
        oldTaxes: 3.00,
        total: 6.00,
      },
    ],
    meta: {
      pageCount: 1,
    },
  };

  const isLoading = false;
  const isFetching = false;
  const error = null;
  const data = mockData;

  const columns: Column<Apartment>[] = [
    {
      header: 'Апартамент',
      accessorKey: 'id',
      sortable: true,
      cell: row => (
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-gray-400" />
          <span className="text-red-500 font-medium">{row.id}</span>
        </div>
      ),
    },
    {
      header: 'Етаж',
      accessorKey: 'floor',
      sortable: true,
    },
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
    },
    {
      header: 'Брой Живущи',
      accessorKey: 'residents',
      sortable: true,
    },
    {
      header: 'Такса Асансьор',
      accessorKey: 'elevatorTax',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">{row.elevatorTax.toFixed(2)} лв.</span>
      ),
      sortable: true,
    },
    {
      header: 'Ток Асансьор',
      accessorKey: 'elevatorElectricity',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">{row.elevatorElectricity.toFixed(2)} лв.</span>
      ),
      sortable: true,
    },
    {
      header: 'Ток Стълбище',
      accessorKey: 'stairwayElectricity',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">{row.stairwayElectricity.toFixed(2)} лв.</span>
      ),
      sortable: true,
    },
    {
      header: 'Почистване',
      accessorKey: 'cleaning',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">{row.cleaning.toFixed(2)} лв.</span>
      ),
      sortable: true,
    },
    {
      header: 'УЕС',
      accessorKey: 'ues',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">{row.ues.toFixed(2)} лв.</span>
      ),
      sortable: true,
    },
    {
      header: 'Нередности',
      accessorKey: 'irregularities',
      cell: row => (
        <IrregularitiesBadge count={row.irregularities} />
      ),
      sortable: true,
    },
    {
      header: 'Нови такси',
      accessorKey: 'newTaxes',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">{row.newTaxes.toFixed(2)} лв.</span>
      ),
      sortable: true,
    },
    {
      header: 'Стари такси',
      accessorKey: 'oldTaxes',
      cell: row => (
        <span className="text-gray-700 whitespace-nowrap">{row.oldTaxes.toFixed(2)} лв.</span>
      ),
      sortable: true,
    },
    {
      header: 'Общо',
      accessorKey: 'total',
      cell: row => (
        <Badge variant="negative" value={row.total} suffix=" лв." />
      ),
      sortable: true,
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      cell: row => {
        const menuItems: (DropdownMenuItem | 'separator')[] = [
          {
            label: 'Плащане',
            onClick: () => console.log('Плащане за апартамент', row.id),
            icon: CreditCard,
          },
          {
            label: 'Разпечатай Бележка Задължения',
            onClick: () => console.log('Разпечатай бележка за', row.id),
            icon: FileText,
          },
          {
            label: 'Изпрати Съобщение',
            onClick: () => console.log('Изпрати съобщение до', row.id),
            icon: MessageSquare,
          },
          'separator',
          {
            label: 'Справка Такси',
            onClick: () => console.log('Справка такси за', row.id),
            icon: Receipt,
          },
          {
            label: 'Справка Плащания',
            onClick: () => console.log('Справка плащания за', row.id),
            icon: BarChart3,
          },
          {
            label: 'Живущи',
            onClick: () => console.log('Живущи в апартамент', row.id),
            icon: Users,
          },
          'separator',
          {
            label: 'Редактирай Апартамент',
            onClick: () => console.log('Редактирай апартамент', row.id),
            icon: Edit,
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu
              trigger={
                <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100">
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

  return (
    <DataTable
      columns={columns}
      data={data?.items}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      page={page}
      pageCount={data?.meta.pageCount}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
    />
  );
}
