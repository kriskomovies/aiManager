import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MonthlyFeesTable } from '@/components/monthly-fees/monthly-fees-table';
import { Plus } from 'lucide-react';

export function MonthlyFeesTab() {
  const handleCreateMonthlyFee = () => {
    console.log('Create monthly fee');
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header with title and button */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      >
        <h2 className="text-xl font-semibold text-gray-900">Месечни Такси</h2>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="flex items-center gap-2"
            onClick={handleCreateMonthlyFee}
          >
            <Plus className="h-4 w-4" />
            Създай Месечна Такса
          </Button>
        </motion.div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
      >
        <MonthlyFeesTable />
      </motion.div>
    </motion.div>
  );
}
