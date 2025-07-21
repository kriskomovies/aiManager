import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Calendar, X } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';
import { InventoryTransfersTable } from '@/components/inventory/tabs/inventory-transfers-table';

interface InventoryData {
  id: string;
  name: string;
  title?: string;
  description?: string;
  amount: number;
}

interface InventoryTransfersModalProps {
  onClose: () => void;
}

export function InventoryTransfersModal({
  onClose,
}: InventoryTransfersModalProps) {
  const modalData = useAppSelector(selectModalData);
  const inventoryData = modalData?.inventoryData as InventoryData;

  const [filterMode, setFilterMode] = useState<'all' | 'period'>('all');
  const [dateFilter, setDateFilter] = useState({
    from: '',
    to: '',
  });

  const handleDateFilterChange = (field: 'from' | 'to', value: string) => {
    setDateFilter(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {inventoryData?.title ||
                  `Движения в ${inventoryData?.name || 'Каса'}`}
              </h3>
              <p className="text-sm text-gray-600">
                Наличен Депозит:{' '}
                <span className="font-medium">
                  {inventoryData?.amount?.toFixed(2) || '0.00'} лв.
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2 mb-4">
            <Button
              variant={filterMode === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterMode('all')}
              className="flex items-center gap-2"
            >
              Всички
            </Button>
            <Button
              variant={filterMode === 'period' ? 'default' : 'outline'}
              onClick={() => setFilterMode('period')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              За Период
            </Button>
          </div>

          {/* Date Filter Section */}
          {filterMode === 'period' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFrom">От</Label>
                  <div className="relative">
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFilter.from}
                      onChange={e =>
                        handleDateFilterChange('from', e.target.value)
                      }
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dateTo">До</Label>
                  <div className="relative">
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateFilter.to}
                      onChange={e =>
                        handleDateFilterChange('to', e.target.value)
                      }
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          <InventoryTransfersTable
            inventoryId={inventoryData?.id}
            dateFilter={filterMode === 'period' ? dateFilter : undefined}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              Затвори
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
