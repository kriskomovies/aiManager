import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Wallet,
  TrendingUp
} from 'lucide-react';

interface InventoryData {
  id: string;
  name: string;
  title?: string;
  description?: string;
  visibleInApp: boolean;
  amount: number;
  isMandatory: boolean;
  type: 'main' | 'deposit' | 'custom';
}

export function InventoriesTable() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof InventoryData;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Mock data for inventories
  const mockInventories: InventoryData[] = [
    {
      id: '1',
      name: 'Основна Каса',
      title: 'Основна Каса за Сграда',
      description: 'Основна каса за всички общи разходи и приходи на сградата',
      visibleInApp: true,
      amount: 585.00,
      isMandatory: true,
      type: 'main'
    },
    {
      id: '2',
      name: 'Депозит',
      title: 'Депозитна Каса',
      description: 'Каса за депозити от наематели и собственици',
      visibleInApp: true,
      amount: 200.00,
      isMandatory: true,
      type: 'deposit'
    },
    {
      id: '3',
      name: 'Резервна Каса',
      title: 'Резервна Каса за Спешни Случаи',
      description: 'Резервна каса за непредвидени разходи и спешни ремонти',
      visibleInApp: false,
      amount: 150.00,
      isMandatory: false,
      type: 'custom'
    },
    {
      id: '4',
      name: 'Каса за Ремонти',
      title: 'Каса за Ремонти и Поддръжка',
      description: 'Специализирана каса за ремонтни дейности и поддръжка на сградата',
      visibleInApp: true,
      amount: 320.50,
      isMandatory: false,
      type: 'custom'
    },
  ];

  const handleViewInventory = (inventory: InventoryData) => {
    dispatch(openModal({
      type: 'inventory-transfers',
      data: { 
        inventoryId: inventory.id,
        inventoryName: inventory.name,
        inventoryData: inventory
      }
    }));
  };

  const handleEditInventory = (inventory: InventoryData) => {
    dispatch(openModal({
      type: 'edit-inventory',
      data: { 
        inventoryId: inventory.id,
        inventoryName: inventory.name,
        inventoryData: inventory
      }
    }));
  };

  const handleDeleteInventory = (inventory: InventoryData) => {
    dispatch(openModal({
      type: 'delete-inventory',
      data: { 
        inventoryId: inventory.id,
        inventoryName: inventory.name,
        inventoryData: inventory
      }
    }));
  };

  const columns: Column<InventoryData>[] = [
    {
      header: 'Име на каса',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '200px',
      minWidth: '200px',
      cell: row => (
        <div className="flex items-center gap-2">
          {row.type === 'main' && <Wallet className="h-4 w-4 text-green-600" />}
          {row.type === 'deposit' && <TrendingUp className="h-4 w-4 text-blue-600" />}
          {row.type === 'custom' && <Wallet className="h-4 w-4 text-gray-600" />}
          <span className="font-medium text-gray-900">{row.name}</span>
          {row.isMandatory && (
            <Badge variant="neutral" className="text-xs">
              Задължителна
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Видима в приложение',
      accessorKey: 'visibleInApp',
      sortable: true,
      width: '150px',
      minWidth: '150px',
      cell: row => (
        <Badge variant={row.visibleInApp ? "positive" : "neutral"}>
          {row.visibleInApp ? 'Да' : 'Не'}
        </Badge>
      ),
    },
    {
      header: 'Сума',
      accessorKey: 'amount',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <span className="font-medium text-gray-900">
          {row.amount.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewInventory(row)}
            className="h-8 w-8 p-0"
            title="Преглед"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {!row.isMandatory && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditInventory(row)}
                className="h-8 w-8 p-0"
                title="Редактиране"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteInventory(row)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Изтриване"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const transformedData = {
    items: mockInventories,
    meta: {
      pageCount: Math.ceil(mockInventories.length / 10),
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
