import { Button } from '@/components/ui/button';
import { TemporaryExpensesTable } from './temporary-expenses-table';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';

export function TemporaryExpensesSection() {
  const dispatch = useAppDispatch();

  const handleCreateExpense = () => {
    dispatch(openModal({ type: 'create-recurring-expense' }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Периодични Разходи
        </h2>
        <Button
          className="flex items-center gap-2"
          onClick={handleCreateExpense}
        >
          <Plus className="h-4 w-4" />
          Създай Периодичен Разход
        </Button>
      </div>
      <TemporaryExpensesTable />
    </div>
  );
}
