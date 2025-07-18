import { Button } from '@/components/ui/button';
import { InventoriesTable } from '../inventories-table';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { 
  ArrowRightLeft,
  Plus
} from 'lucide-react';

interface AllInventoriesTabProps {
  buildingId: string;
}

export function AllInventoriesTab({ buildingId }: AllInventoriesTabProps) {
  const dispatch = useAppDispatch();

  const handleCreateInventory = () => {
    dispatch(openModal({
      type: 'create-inventory',
      data: { buildingId }
    }));
  };

  const handleTransferMoney = () => {
    dispatch(openModal({
      type: 'transfer-inventory-money',
      data: { buildingId }
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header with title and action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold">Всички каси</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleTransferMoney}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Прехвърляне на пари
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={handleCreateInventory}
          >
            <Plus className="h-4 w-4" />
            Създай каса
          </Button>
        </div>
      </div>
      <InventoriesTable buildingId={buildingId} />
    </div>
  );
}
