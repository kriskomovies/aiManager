import { Card, CardContent } from '@/components/ui/card';
import { Building } from 'lucide-react';

interface BuildingsTabProps {
  partnerId: string;
}

export function BuildingsTab({ partnerId }: BuildingsTabProps) {
  // TODO: Add real buildings data fetching using partnerId
  console.log('Buildings tab for partner:', partnerId);

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Сгради</h3>
        <p className="text-gray-600">
          Списъкът със сгради, към които контрагентът има достъп, ще бъде показан тук.
        </p>
      </CardContent>
    </Card>
  );
}
