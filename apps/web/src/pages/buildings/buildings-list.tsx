import { Button } from '@/components/ui/button';
import { BuildingsTable } from '@/components/buildings/buildings-table';
import { Plus } from 'lucide-react';

export function BuildingsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Сгради</h1>
          <p className="text-sm text-gray-500">Управлявайте всички сгради</p>
        </div>
        <Button className="gap-2 bg-red-500 hover:bg-red-600">
          <Plus className="h-4 w-4" />
          Добави Сграда
        </Button>
      </div>

      <BuildingsTable />
    </div>
  );
}
