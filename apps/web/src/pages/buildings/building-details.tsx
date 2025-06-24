import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { InformationCard } from '@/components/information-card';
import { ApartmentsTable } from '@/components/apartments/apartments-table';
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



const mockBuildings = {
  1: {
    id: 1,
    name: 'Сграда А',
    address: 'ул. Първа 1',
    apartmentCount: 24,
    balance: 1500.5,
    debt: 300.0,
    description: 'Жилищна сграда с 24 апартамента',
  },
  2: {
    id: 2,
    name: 'Сграда Б',
    address: 'ул. Втора 2',
    apartmentCount: 16,
    balance: -500.25,
    debt: 1200.0,
    description: 'Жилищна сграда с 16 апартамента',
  },
  3: {
    id: 3,
    name: 'Сграда В',
    address: 'бул. Трети 3',
    apartmentCount: 32,
    balance: 2300.75,
    debt: 0.0,
    description: 'Жилищна сграда с 32 апартамента',
  },
};



export function BuildingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const buildingId = id ? parseInt(id) : null;
  const building = buildingId
    ? mockBuildings[buildingId as keyof typeof mockBuildings]
    : null;

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

  if (!building) {
    return <div>Building not found</div>;
  }

  const stats = {
    balance: `${building.balance.toFixed(2)} лв.`,
    balanceChange:
      building.balance > 0
        ? '+23.00лв спрямо с предходния месец'
        : '-23.00лв спрямо с предходния месец',
    obligations: `${building.debt.toFixed(2)} лв.`,
    obligationsChange: '+230.00лв спрямо с предходния месец',
    apartments: building.apartmentCount.toString(),
    apartmentsWithDebt: '3 апартамента със задължения',
    debts: '9',
    debtsDetails: 'задължения от 3 апартамента',
  };

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

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
            <Button variant="outline" size="sm" className="gap-2">
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
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-red-500 border-b-2 border-red-500 rounded-none"
        >
          <Home className="h-4 w-4" />
          Апартаменти
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <Users className="h-4 w-4" />
          Каса
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <BarChart2 className="h-4 w-4" />
          Касиер
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <Bell className="h-4 w-4" />
          Нередности
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <Users className="h-4 w-4" />
          Потребители
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <MessageSquare className="h-4 w-4" />
          Съобщения
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <Calendar className="h-4 w-4" />
          Календар
        </Button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-4 gap-4"
        variants={statsVariants}
      >
        <InformationCard
          title="Баланс"
          value={stats.balance}
          icon={BarChart2}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-50"
          subtitle={stats.balanceChange}
          variants={itemVariants}
        />
        
        <InformationCard
          title="Задължения"
          value={stats.obligations}
          icon={Bell}
          iconColor="text-red-500"
          iconBgColor="bg-red-50"
          valueColor="text-red-500"
          subtitle={stats.obligationsChange}
          variants={itemVariants}
        />
        
        <InformationCard
          title="Апартаменти"
          value={stats.apartments}
          icon={Home}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-50"
          variants={itemVariants}
        >
          <p className="text-sm text-red-500">{stats.apartmentsWithDebt}</p>
        </InformationCard>
        
        <InformationCard
          title="Нередности"
          value={stats.debts}
          icon={Bell}
          iconColor="text-orange-500"
          iconBgColor="bg-orange-50"
          subtitle={stats.debtsDetails}
          variants={itemVariants}
        />
      </motion.div>

      <motion.div 
        className="rounded-lg bg-white shadow-sm border border-gray-200"
        variants={itemVariants}
        whileHover={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        <div className="flex items-center justify-between border-b p-4 px-6">
          <h2 className="text-lg font-semibold">Апартаменти</h2>
          <div className="space-x-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button variant="outline" size="sm">
                Домова Книга
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button size="sm" className="bg-red-500 hover:bg-red-600">
                Добави Апартамент
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="p-6">
          <ApartmentsTable />
        </div>
      </motion.div>
    </motion.div>
  );
}
