import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface TransactionsTabProps {
  partnerId: string;
}

export function TransactionsTab({ partnerId }: TransactionsTabProps) {
  // TODO: Add real transactions data fetching using partnerId
  console.log('Transactions tab for partner:', partnerId);

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Транзакции</h3>
        <p className="text-gray-600">
          Историята на транзакциите с контрагента ще бъде показана тук.
        </p>
      </CardContent>
    </Card>
  );
}
