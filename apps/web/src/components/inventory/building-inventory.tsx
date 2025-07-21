import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabConfig } from '@/components/ui/tabs';
import { AllInventoriesTab } from './tabs/all-inventories-tab';
import { ExpensesTab } from './tabs/expenses-tab';
import { MonthlyFeesTab } from './tabs/monthly-fees-tab';
import { TemporaryFeesTab } from './tabs/temporary-fees-tab';
import { Wallet, TrendingDown, Calendar, Clock } from 'lucide-react';

interface BuildingInventoryProps {
  buildingId: string;
}

export function BuildingInventory({ buildingId }: BuildingInventoryProps) {
  const [activeTab, setActiveTab] = useState('inventories');

  const tabs: TabConfig[] = [
    {
      id: 'inventories',
      label: 'Каси',
      icon: Wallet,
    },
    {
      id: 'expenses',
      label: 'Разходи',
      icon: TrendingDown,
    },
    {
      id: 'monthly-fees',
      label: 'Месечни такси',
      icon: Calendar,
    },
    {
      id: 'temporary-fees',
      label: 'Временни такси',
      icon: Clock,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inventories':
        return <AllInventoriesTab buildingId={buildingId} />;
      case 'expenses':
        return <ExpensesTab buildingId={buildingId} />;
      case 'monthly-fees':
        return <MonthlyFeesTab />;
      case 'temporary-fees':
        return <TemporaryFeesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
          />
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
