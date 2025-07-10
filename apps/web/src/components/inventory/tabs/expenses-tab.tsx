import { TemporaryExpensesSection } from '@/components/expenses/temporary-expenses/temporary-expenses-section';
import { OneTimeExpensesSection } from '@/components/expenses/one-time-expenses/one-time-expenses-section';

export function ExpensesTab() {
  return (
    <div className="space-y-8">
      {/* Temporary/Recurring Expenses Section */}
      <TemporaryExpensesSection />
      
      {/* One-time Expenses Section */}
      <OneTimeExpensesSection />
    </div>
  );
}
