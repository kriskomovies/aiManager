import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, XCircle, Plus, Archive } from 'lucide-react';
import { InformationCard } from '@/components/information-card';
import { IrregularitiesTable } from '@/components/irregularities/irregularities-table';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';

interface IrregularitiesTabProps {
  buildingId: string;
}

export function IrregularitiesTab({ buildingId = '1' }: IrregularitiesTabProps) {
  const dispatch = useAppDispatch();
  const [showArchive, setShowArchive] = useState(false);

  // Mock statistics - TODO: Replace with actual API call
  const stats = {
    total: 9,
    reported: 7,
    resolved: 2,
    inProgress: 2,
    planned: 0,
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleAddIrregularity = () => {
    dispatch(openModal({
      type: 'create-building-irregularity',
      data: { buildingId }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
      >
        <InformationCard
          title="Общо"
          value={stats.total.toString()}
          icon={AlertTriangle}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50"
          variants={cardAnimation}
        />
        <InformationCard
          title="Оправени"
          value={stats.reported.toString()}
          icon={CheckCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          variants={cardAnimation}
        />
        <InformationCard
          title="Отказани"
          value={stats.resolved.toString()}
          icon={XCircle}
          iconColor="text-gray-600"
          iconBgColor="bg-gray-50"
          variants={cardAnimation}
        />
        <InformationCard
          title="В Процес"
          value={stats.inProgress.toString()}
          icon={Clock}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          variants={cardAnimation}
        />
        <InformationCard
          title="Планувани"
          value={stats.planned.toString()}
          icon={Clock}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
          variants={cardAnimation}
        />
        <InformationCard
          title="Докладвана"
          value="1"
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          variants={cardAnimation}
        />
      </motion.div>

      {/* Action Buttons and Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Нередности</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowArchive(!showArchive)}
                className="flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                {showArchive ? 'Покажи активни' : 'Покажи архив'}
              </Button>
              <Button
                size="sm"
                onClick={handleAddIrregularity}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Добави Нередност
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <IrregularitiesTable 
            entityId={buildingId}
            entityType="building"
            isArchive={showArchive}
          />
        </div>
      </div>
    </div>
  );
} 