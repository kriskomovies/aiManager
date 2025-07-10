import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabConfig } from '@/components/ui/tabs';
import { ChevronDown, AlertTriangle, Archive, Bell } from 'lucide-react';
import { ApartmentIrregularitiesTable } from '@/components/apartments/apartment-details/apartment-irregularities-table';

interface ApartmentIrregularitiesProps {
  apartmentId: string;
}

type IrregularityTabType = 'active' | 'archive';

const irregularityTabs: TabConfig[] = [
  {
    id: 'active',
    label: 'Активни',
    icon: Bell,
  },
  {
    id: 'archive',
    label: 'Архив',
    icon: Archive,
  },
];

export function ApartmentIrregularities({ apartmentId }: ApartmentIrregularitiesProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<IrregularityTabType>('active');

  return (
    <Card className="overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Нередности</h3>
            <p className="text-sm text-gray-600">Активни и архивирани нередности</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100">
              <div className="p-4 pb-0">
                <Tabs
                  tabs={irregularityTabs}
                  activeTab={activeTab}
                  onTabChange={(tabId) => setActiveTab(tabId as IrregularityTabType)}
                  variant="underline"
                  className="mb-4"
                />
              </div>
              
              <div className="px-4 pb-4">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApartmentIrregularitiesTable 
                    apartmentId={apartmentId} 
                    isArchive={activeTab === 'archive'} 
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
