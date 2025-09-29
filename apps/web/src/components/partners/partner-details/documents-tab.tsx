import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface DocumentsTabProps {
  partnerId: string;
}

export function DocumentsTab({ partnerId }: DocumentsTabProps) {
  // TODO: Add real documents data fetching using partnerId
  console.log('Documents tab for partner:', partnerId);

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Документи</h3>
        <p className="text-gray-600">
          Документите, свързани с контрагента, ще бъдат показани тук.
        </p>
      </CardContent>
    </Card>
  );
}
