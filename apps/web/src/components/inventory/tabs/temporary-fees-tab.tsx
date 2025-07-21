import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TemporaryFeesTable } from '@/components/temporary-fees/temporary-fees-table';
import { ArchiveTemporaryFeesTable } from '@/components/temporary-fees/archive-temporary-fees-table';
import { Plus } from 'lucide-react';

export function TemporaryFeesTab() {
  const handleCreateTemporaryFee = () => {
    console.log('Create temporary fee');
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Current Temporary Fees Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Header with title and button */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Текущи Временни Такси
          </h2>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="flex items-center gap-2"
              onClick={handleCreateTemporaryFee}
            >
              <Plus className="h-4 w-4" />
              Създай Временна Такса
            </Button>
          </motion.div>
        </motion.div>

        {/* Current Temporary Fees Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          <TemporaryFeesTable />
        </motion.div>
      </motion.div>

      {/* Archive Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* Archive Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Архив Временни Такси
          </h2>
        </motion.div>

        {/* Archive Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        >
          <ArchiveTemporaryFeesTable />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
