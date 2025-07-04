import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { useGetBuildingQuery } from '@/redux/services/building.service';
import { ApartmentsTab } from './building-details/apartments-tab';
import { CashTab } from './building-details/cash-tab';
import { CashierTab } from './building-details/cashier-tab';
import { IrregularitiesTab } from './building-details/irregularities-tab';
import { UsersTab } from './building-details/users-tab';
import { MessagesTab } from './building-details/messages-tab';
import { CalendarTab } from './building-details/calendar-tab';

type TabType = 'apartments' | 'cash' | 'cashier' | 'irregularities' | 'users' | 'messages' | 'calendar';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabConfig[] = [
  {
    id: 'apartments',
    label: 'Апартаменти',
    icon: Home,
  },
  {
    id: 'cash',
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
    label: 'Потребители',
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

export function BuildingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>('apartments');
  
  // API call to get building data
  const { 
    data: building, 
    isLoading, 
    error 
  } = useGetBuildingQuery(id!, { 
    skip: !id 
  });

  useEffect(() => {
    if (building) {
      dispatch(setPageInfo({
        title: 'Детайли на сграда',
        subtitle: 'Управление на апартаменти и информация'
      }));
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
          <Button
            onClick={handleBack}
            className="gap-2"
          >
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
            Сградата не е намерена
          </h2>
          <p className="text-gray-600 mb-4">
            Сградата с ID {id} не съществува или е била изтрита.
          </p>
          <Button
            onClick={handleBack}
            className="gap-2"
          >
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const tabsVariants = {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-gray-900">{building.name}</h1>
            <p className="text-sm text-gray-500">{building.address}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
              Редактирай
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button size="sm" className="gap-2 bg-red-500 hover:bg-red-600">
              Добави бележка
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="flex border-b"
        variants={tabsVariants}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-none ${
                activeTab === tab.id 
                  ? 'text-red-500 border-b-2 border-red-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'apartments' && <ApartmentsTab building={building} />}
        {activeTab === 'cash' && <CashTab />}
        {activeTab === 'cashier' && <CashierTab />}
        {activeTab === 'irregularities' && <IrregularitiesTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'calendar' && <CalendarTab />}
      </motion.div>
    </motion.div>
  );
}
