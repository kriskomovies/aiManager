import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabConfig } from '@/components/ui/tabs';
import { AllInventoriesTab } from './tabs/all-inventories-tab';
import { ExpensesTab } from './tabs/expenses-tab';
import { MonthlyFeesTab } from './tabs/monthly-fees-tab';
import { TemporaryFeesTab } from './tabs/temporary-fees-tab';
import { Wallet, TrendingDown, Calendar, Clock } from 'lucide-react';

interface BuildingInventoryProps {
  buildingId: string;
}

type InventoryTabType =
  | 'inventories'
  | 'expenses'
  | 'monthly-fees'
  | 'temporary-fees';

export function BuildingInventory({ buildingId }: BuildingInventoryProps) {
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Valid inventory tab IDs for validation
  const validInventoryTabs = tabs.map(tab => tab.id) as InventoryTabType[];

  // Get inventory tab from URL or default to 'inventories'
  const getInitialInventoryTab = (): InventoryTabType => {
    const inventoryTabFromUrl = searchParams.get(
      'inventoryTab'
    ) as InventoryTabType;
    return validInventoryTabs.includes(inventoryTabFromUrl)
      ? inventoryTabFromUrl
      : 'inventories';
  };

  const [activeTab, setActiveTab] = useState<InventoryTabType>(
    getInitialInventoryTab
  );

  // Update URL when inventory tab changes
  const handleTabChange = (tabId: string) => {
    const newTab = tabId as InventoryTabType;
    setActiveTab(newTab);

    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('inventoryTab', newTab);
    setSearchParams(newSearchParams, { replace: true });
  };

  // Sync inventory tab state with URL on mount and URL changes
  useEffect(() => {
    const inventoryTabFromUrl = getInitialInventoryTab();
    if (inventoryTabFromUrl !== activeTab) {
      setActiveTab(inventoryTabFromUrl);
    }
  }, [searchParams]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inventories':
        return <AllInventoriesTab buildingId={buildingId} />;
      case 'expenses':
        return <ExpensesTab buildingId={buildingId} />;
      case 'monthly-fees':
        return <MonthlyFeesTab buildingId={buildingId} />;
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
            onTabChange={handleTabChange}
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
