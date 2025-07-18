import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { useGetInventoriesByBuildingQuery } from '@/redux/services/inventory.service';
import { IInventoryResponse } from '@repo/interfaces';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Wallet,
  TrendingUp
} from 'lucide-react';

interface InventoriesTableProps {
  buildingId: string;
}

export function InventoriesTable({ buildingId }: InventoriesTableProps) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof IInventoryResponse;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Fetch inventories data
  const { 
    data: inventories = [], 
    isLoading, 
    error 
  } = useGetInventoriesByBuildingQuery(buildingId);

  const handleViewInventory = (inventory: IInventoryResponse) => {
    dispatch(openModal({
      type: 'inventory-transfers',
      data: { 
        inventoryId: inventory.id,
        inventoryName: inventory.name,
        inventoryData: inventory
      }
    }));
  };

  const handleEditInventory = (inventory: IInventoryResponse) => {
    dispatch(openModal({
      type: 'edit-inventory',
      data: { 
        inventoryId: inventory.id,
        inventoryName: inventory.name,
        inventoryData: inventory
      }
    }));
  };

  const handleDeleteInventory = (inventory: IInventoryResponse) => {
    dispatch(openModal({
      type: 'delete-inventory',
      data: { 
        inventoryId: inventory.id,
        inventoryName: inventory.name,
        inventoryData: inventory
      }
    }));
  };

  const columns: Column<IInventoryResponse>[] = [
    {
      header: 'Име на каса',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '200px',
      minWidth: '200px',
      cell: row => (
        <div className="flex items-center gap-2">
          {row.isMain && <Wallet className="h-4 w-4 text-green-600" />}
          {!row.isMain && <TrendingUp className="h-4 w-4 text-blue-600" />}
          <span className="font-medium text-gray-900">{row.name}</span>
          {row.isMain && (
            <Badge variant="neutral" className="text-xs">
              Основна
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
          
          {!row.isMain && (
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

  // Handle loading and error states
  if (error) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-red-600">Грешка при зареждането на касите</p>
      </div>
    );
  }

  const transformedData = {
    items: inventories,
    meta: {
      pageCount: Math.ceil(inventories.length / 10),
    },
  };

  return (
    <DataTable
      columns={columns}
      data={transformedData.items}
      isLoading={isLoading}
      isFetching={false}
      error={error}
      page={page}
      pageCount={transformedData.meta.pageCount}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
    />
  );
}
