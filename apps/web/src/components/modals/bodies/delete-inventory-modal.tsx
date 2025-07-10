import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Select } from '@/components/ui/select';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { addAlert } from '@/redux/slices/alert-slice';

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

interface DeleteInventoryModalProps {
  onClose: () => void;
}

export function DeleteInventoryModal({ onClose }: DeleteInventoryModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  
  const inventoryData = modalData?.inventoryData as InventoryData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferMoney, setTransferMoney] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState('');

  // Mock data for other inventories (excluding the current one being deleted)
  const mockInventories = [
    { id: '1', name: 'Основна Каса', title: 'Основна Каса за Сграда', amount: 585.00 },
    { id: '2', name: 'Депозит', title: 'Депозитна Каса', amount: 200.00 },
    { id: '3', name: 'Резервна Каса', title: 'Резервна Каса за Спешни Случаи', amount: 150.00 },
    { id: '4', name: 'Каса за Ремонти', title: 'Каса за Ремонти и Поддръжка', amount: 320.50 },
  ].filter(inv => inv.id !== inventoryData?.id); // Exclude current inventory

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!inventoryData) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Няма избрана каса за изтриване.',
        duration: 5000
      }));
      return;
    }

    if (transferMoney && !selectedInventory) {
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка',
        message: 'Моля изберете каса за прехвърляне на сумата.',
        duration: 5000
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual delete inventory API call
      console.log('Deleting inventory:', inventoryData);
      if (transferMoney && selectedInventory) {
        const selectedInventoryName = mockInventories.find(inv => inv.id === selectedInventory)?.name;
        console.log('Transferring money to:', selectedInventoryName);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const successMessage = transferMoney && selectedInventory
        ? `Касата "${inventoryData.name}" беше изтрита успешно и сумата беше прехвърлена към "${mockInventories.find(inv => inv.id === selectedInventory)?.name}".`
        : `Касата "${inventoryData.name}" беше изтрита успешно.`;
      
      dispatch(addAlert({
        type: 'success',
        title: 'Успешно изтриване!',
        message: successMessage,
        duration: 5000
      }));
      
      onClose();
    } catch (error) {
      console.error('Error deleting inventory:', error);
      
      dispatch(addAlert({
        type: 'error',
        title: 'Грешка при изтриване',
        message: 'Възникна грешка при изтриването на касата. Моля опитайте отново.',
        duration: 5000
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

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
      </p>

      {/* Warning Message */}
      <div className="text-left mb-6">
        <p className="text-sm text-red-600">
          Сигурни ли сте, че искате да изтриете Каса "{inventoryData?.name || 'Неизвестна'}"?
        </p>
      </div>

      {/* Amount Display */}
      <div className="text-left mb-6">
        <p className="text-sm text-gray-600 mb-1">Наличност</p>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <p className="text-2xl font-semibold text-gray-900">
            {inventoryData?.amount?.toFixed(2) || '0.00'} лв.
          </p>
        </div>
      </div>

      {/* Transfer Money Toggle */}
      <div className="text-left mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Toggle
            pressed={transferMoney}
            onPressedChange={setTransferMoney}
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-700">
            Прехвърли сумата към друга каса
          </span>
        </div>

        {/* Transfer Inventory Select */}
        {transferMoney && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Прехвърляне на Сумата към Каса</p>
            <Select
              value={selectedInventory}
              onChange={(e) => setSelectedInventory(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Изберете каса...</option>
              {mockInventories.map((inventory) => (
                <option key={inventory.id} value={inventory.id}>
                  {inventory.name} ({inventory.amount.toFixed(2)} лв.)
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

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
            disabled={isSubmitting}
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
