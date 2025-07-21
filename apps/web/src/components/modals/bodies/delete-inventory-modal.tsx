import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Select } from '@/components/ui/select';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';
import {
  useDeleteInventoryMutation,
  useTransferMoneyMutation,
  useGetInventoriesByBuildingQuery,
} from '@/redux/services/inventory.service';
import {
  IInventoryResponse,
  IInventoryTransferRequest,
} from '@repo/interfaces';

interface DeleteInventoryModalProps {
  onClose: () => void;
}

export function DeleteInventoryModal({ onClose }: DeleteInventoryModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  const inventoryData = modalData?.inventoryData as IInventoryResponse;
  const buildingId = inventoryData?.buildingId;

  // Get other inventories for the building to populate transfer options
  const { data: allInventories = [] } = useGetInventoriesByBuildingQuery(
    buildingId!,
    {
      skip: !buildingId,
    }
  );

  // Filter out the current inventory being deleted
  const otherInventories = allInventories.filter(
    inv => inv.id !== inventoryData?.id
  );

  // API mutations
  const [deleteInventory] = useDeleteInventoryMutation();
  const [transferMoneyMutation] = useTransferMoneyMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldTransferMoney, setShouldTransferMoney] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!inventoryData) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Няма избрана каса за изтриване.',
          duration: 5000,
        })
      );
      return;
    }

    // Check if trying to delete main inventory
    if (inventoryData.isMain) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Не можете да изтриете основната каса.',
          duration: 5000,
        })
      );
      return;
    }

    // Only validate transfer selection if user chose to transfer money
    if (shouldTransferMoney && inventoryData.amount > 0 && !selectedInventory) {
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Моля изберете каса за прехвърляне на сумата.',
          duration: 5000,
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // If we need to transfer money first
      if (
        shouldTransferMoney &&
        inventoryData.amount > 0 &&
        selectedInventory
      ) {
        const transferData: IInventoryTransferRequest = {
          fromInventoryId: inventoryData.id,
          toInventoryId: selectedInventory,
          amount: inventoryData.amount,
          description: `Прехвърляне преди изтриване на ${inventoryData.name}`,
        };

        await transferMoneyMutation(transferData).unwrap();
      }

      // Delete the inventory
      await deleteInventory(inventoryData.id).unwrap();

      const selectedInventoryName = selectedInventory
        ? otherInventories.find(inv => inv.id === selectedInventory)?.name
        : null;

      const successMessage =
        shouldTransferMoney && selectedInventoryName
          ? `Касата "${inventoryData.name}" беше изтрита успешно и сумата беше прехвърлена към "${selectedInventoryName}".`
          : `Касата "${inventoryData.name}" беше изтрита успешно.`;

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно изтриване!',
          message: successMessage,
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error deleting inventory:', error);

      const errorMessage =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as { message?: string })?.message ||
        'Възникна грешка при изтриването на касата. Моля опитайте отново.';

      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка при изтриване',
          message: errorMessage,
          duration: 5000,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // Check if inventory can be deleted
  const canDelete = inventoryData && !inventoryData.isMain;
  const hasBalance = inventoryData && inventoryData.amount > 0;

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {inventoryData?.title || 'Изтриване на Каса'}
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-6">
        {inventoryData?.description || 'Потвърдете изтриването на касата'}
        {inventoryData?.isMain && (
          <span className="block mt-1 text-red-600 font-medium">
            Основната каса не може да бъде изтрита
          </span>
        )}
      </p>

      {/* Warning Message */}
      <div className="text-left mb-6">
        <p className="text-sm text-red-600">
          Сигурни ли сте, че искате да изтриете Каса "
          {inventoryData?.name || 'Неизвестна'}"?
        </p>
      </div>

      {/* Amount Display */}
      <div className="text-left mb-6">
        <p className="text-sm text-gray-600 mb-1">Наличност</p>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle
            className={`h-5 w-5 ${hasBalance ? 'text-orange-500' : 'text-gray-400'}`}
          />
          <p
            className={`text-2xl font-semibold ${hasBalance ? 'text-orange-600' : 'text-gray-600'}`}
          >
            {inventoryData?.amount?.toFixed(2) || '0.00'} лв.
          </p>
        </div>
        {hasBalance && (
          <p className="text-xs text-orange-600">
            Касата има наличност - можете да я прехвърлите към друга каса
          </p>
        )}
      </div>

      {/* Transfer Money Toggle - show if inventory has balance and there are other inventories */}
      {hasBalance && otherInventories.length > 0 && (
        <div className="text-left mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Toggle
              pressed={shouldTransferMoney}
              onPressedChange={setShouldTransferMoney}
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700">
              Прехвърли сумата към друга каса
            </span>
          </div>

          {/* Transfer Inventory Select */}
          {shouldTransferMoney && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">
                Прехвърляне на Сумата към Каса
              </p>
              <Select
                value={selectedInventory}
                onChange={e => setSelectedInventory(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Изберете каса...</option>
                {otherInventories.map(inventory => (
                  <option key={inventory.id} value={inventory.id}>
                    {inventory.name} ({inventory.amount.toFixed(2)} лв.)
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}

      {/* No other inventories info */}
      {hasBalance && otherInventories.length === 0 && (
        <div className="text-left mb-6 p-3 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            💡 Няма други каси за прехвърляне на сумата. Касата ще бъде изтрита
            със сумата в нея.
          </p>
        </div>
      )}

      {/* Main inventory warning */}
      {inventoryData?.isMain && (
        <div className="text-left mb-6 p-3 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            🚫 Основната каса не може да бъде изтрита. Тя е задължителна за
            всяка сграда.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Отказ
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={
              isSubmitting ||
              !canDelete ||
              (shouldTransferMoney && hasBalance && !selectedInventory)
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Изтриване...
              </>
            ) : (
              'Изтрий'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
