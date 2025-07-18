import { Button } from '@/components/ui/button';
import { OneTimeExpensesTable } from './one-time-expenses-table';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';

interface OneTimeExpensesSectionProps {
  buildingId: string;
}

export function OneTimeExpensesSection({ buildingId }: OneTimeExpensesSectionProps) {
  const dispatch = useAppDispatch();

  const handleCreateExpense = () => {
    dispatch(openModal({
      type: 'create-one-time-expense',
      data: { buildingId }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Еднократни Разходи</h2>
        <Button
          className="flex items-center gap-2"
          onClick={handleCreateExpense}
        >
          <Plus className="h-4 w-4" />
          Създай Еднократен Разход
        </Button>
      </div>
      <OneTimeExpensesTable />
    </div>
  );
}
