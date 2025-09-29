import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface ContractsTabProps {
  partnerId: string;
}

export function ContractsTab({ partnerId }: ContractsTabProps) {
  // TODO: Add real contracts data fetching using partnerId
  console.log('Contracts tab for partner:', partnerId);

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Договори</h3>
        <p className="text-gray-600">
          Информацията за договорите ще бъде показана тук след интеграция с API.
        </p>
      </CardContent>
    </Card>
  );
}
