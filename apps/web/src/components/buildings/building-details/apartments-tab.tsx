import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { InformationCard } from '@/components/information-card';
import { ApartmentsTable } from '@/components/apartments/apartments-table';
import { Button } from '@/components/ui/button';
import { IBuildingResponse } from '@repo/interfaces';
import { Home, Bell, BarChart2 } from 'lucide-react';

interface ApartmentsTabProps {
  building: IBuildingResponse;
}

export function ApartmentsTab({ building }: ApartmentsTabProps) {
  const navigate = useNavigate();

  if (!building) {
    return (
      <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Грешка</h2>
          <p className="text-gray-500">
            Информацията за сградата не може да бъде заредена.
          </p>
        </div>
      </div>
    );
  }

  const stats = {
    balance: `${(building.balance || 0).toFixed(2)} лв.`,
    balanceChange:
      (building.balance || 0) > 0
        ? '+23.00лв спрямо с предходния месец'
        : '-23.00лв спрямо с предходния месец',
    obligations: `${(building.debt || 0).toFixed(2)} лв.`,
    obligationsChange: '+230.00лв спрямо с предходния месец',
    apartments: (building.apartmentCount || 0).toString(),
    apartmentsWithDebt: '3 апартамента със задължения',
    debts: (building.irregularities || 0).toString(),
    debtsDetails: 'задължения от 3 апартамента',
  };

  // Animation variants
  const statsVariants = {
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        variants={statsVariants}
        initial="hidden"
        animate="visible"
      >
        <InformationCard
          title="Баланс"
          value={stats.balance}
          icon={BarChart2}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-50"
          subtitle={stats.balanceChange}
          variants={itemVariants}
          priority="high"
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
          priority="high"
        />

        <InformationCard
          title="Апартаменти"
          value={stats.apartments}
          icon={Home}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-50"
          variants={itemVariants}
          priority="medium"
        >
          <p className="text-xs sm:text-sm text-red-500">
            {stats.apartmentsWithDebt}
          </p>
        </InformationCard>

        <InformationCard
          title="Нередности"
          value={stats.debts}
          icon={Bell}
          iconColor="text-orange-500"
          iconBgColor="bg-orange-50"
          subtitle={stats.debtsDetails}
          variants={itemVariants}
          priority="medium"
        />
      </motion.div>

      <motion.div
        className="rounded-lg bg-white shadow-sm border border-gray-200"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{
          boxShadow:
            '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b p-4 px-6 gap-4">
          <h2 className="text-lg font-semibold">Апартаменти</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Домова Книга
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 w-full sm:w-auto"
                onClick={() => navigate(`/apartments/add/${building.id}`)}
              >
                <span className="hidden sm:inline">Добави Апартамент</span>
                <span className="sm:hidden">Добави</span>
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <ApartmentsTable buildingId={building.id} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
