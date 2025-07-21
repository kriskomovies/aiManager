import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessagesTable } from '@/components/messages/messages-table';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';

interface MessagesTabProps {
  buildingId: string;
}

export function MessagesTab({ buildingId }: MessagesTabProps) {
  const dispatch = useAppDispatch();

  const handleAddMessage = () => {
    dispatch(openModal({
      type: 'create-new-message',
      data: { buildingId }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Съобщения</h2>
        <Button
          size="sm"
          onClick={handleAddMessage}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добави Съобщение
        </Button>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <MessagesTable buildingId={buildingId} />
        </div>
      </div>
    </div>
  );
} 