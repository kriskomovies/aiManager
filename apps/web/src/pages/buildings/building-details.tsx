import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabConfig } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import {
  Home,
  Users,
  Bell,
  Calendar,
  BarChart2,
  MessageSquare,
  Pencil,
} from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { useGetBuildingQuery } from '@/redux/services/building.service';
import { ApartmentsTab } from '@/components/buildings/building-details/apartments-tab';
import { InventoryTab } from '@/components/buildings/building-details/inventory-tab';
import { CashierTab } from '@/components/buildings/building-details/cashier-tab';
import { IrregularitiesTab } from '@/components/buildings/building-details/irregularities-tab';
import { UsersTab } from '@/components/buildings/building-details/residents-tab';
import { MessagesTab } from '@/components/buildings/building-details/messages-tab';
import { CalendarTab } from '@/components/buildings/building-details/calendar-tab';

type TabType =
  | 'apartments'
  | 'inventory'
  | 'cashier'
  | 'irregularities'
  | 'users'
  | 'messages'
  | 'calendar';

const tabs: TabConfig[] = [
  {
    id: 'apartments',
    label: 'Апартаменти',
    icon: Home,
  },
  {
    id: 'inventory',
    label: 'Каса',
    icon: Users,
  },
  {
    id: 'cashier',
    label: 'Касиер',
    icon: BarChart2,
  },
  {
    id: 'irregularities',
    label: 'Нередности',
    icon: Bell,
  },
  {
    id: 'users',
    label: 'Живущи',
    icon: Users,
  },
  {
    id: 'messages',
    label: 'Съобщения',
    icon: MessageSquare,
  },
  {
    id: 'calendar',
    label: 'Календар',
    icon: Calendar,
  },
];

// Valid tab IDs for validation
const validTabs = tabs.map(tab => tab.id) as TabType[];

export function BuildingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get tab from URL or default to 'apartments'
  const getInitialTab = (): TabType => {
    const tabFromUrl = searchParams.get('tab') as TabType;
    return validTabs.includes(tabFromUrl) ? tabFromUrl : 'apartments';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    const newTab = tabId as TabType;
    setActiveTab(newTab);
    
    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', newTab);
    setSearchParams(newSearchParams, { replace: true });
  };

  // Sync tab state with URL on mount and URL changes
  useEffect(() => {
    const tabFromUrl = getInitialTab();
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // API call to get building data
  const {
    data: building,
    isLoading,
    error,
  } = useGetBuildingQuery(id!, {
    skip: !id,
  });

  useEffect(() => {
    if (building) {
      dispatch(
        setPageInfo({
          title: 'Детайли на сграда',
          subtitle: 'Управление на апартаменти и информация',
        })
      );
    }
  }, [building, dispatch]);

  const handleBack = () => {
    navigate('/buildings');
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/buildings/${id}/edit`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане на данни за сградата...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Грешка при зареждане
          </h2>
          <p className="text-gray-600 mb-4">
            Възникна грешка при зареждането на данните за сградата.
          </p>
          <Button onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Назад към сгради
          </Button>
        </div>
      </div>
    );
  }

  // Building not found
  if (!building) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Сграда не е намерена
          </h2>
          <p className="text-gray-600 mb-4">
            Сградата с ID {id} не съществува или е била изтрита.
          </p>
          <Button onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Назад към сгради
          </Button>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const tabsVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-4" variants={itemVariants}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <motion.button
              onClick={handleBack}
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                {building.name}
              </h1>
              <p className="text-sm text-gray-500 truncate">
                {building.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Редактирай</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" className="gap-2 bg-red-500 hover:bg-red-600">
                <span className="hidden sm:inline">Добави бележка</span>
                <span className="sm:hidden">Бележка</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={tabsVariants}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="underline"
          className="mb-6"
        />
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[400px] w-full"
      >
        {activeTab === 'apartments' && <ApartmentsTab building={building} />}
        {activeTab === 'inventory' && <InventoryTab buildingId={id!} />}
        {activeTab === 'cashier' && <CashierTab buildingId={id!} />}
        {activeTab === 'irregularities' && (
          <IrregularitiesTab buildingId={id!} />
        )}
        {activeTab === 'users' && <UsersTab buildingId={id!} />}
        {activeTab === 'messages' && <MessagesTab buildingId={id!} />}
        {activeTab === 'calendar' && <CalendarTab buildingId={id!} />}
      </motion.div>
    </motion.div>
  );
}
