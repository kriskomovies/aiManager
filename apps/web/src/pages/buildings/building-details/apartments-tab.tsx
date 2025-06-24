import { motion } from 'framer-motion';
import { InformationCard } from '@/components/information-card';
import { ApartmentsTable } from '@/components/apartments/apartments-table';
import { Button } from '@/components/ui/button';
import {
  Home,
  Bell,
  BarChart2,
} from 'lucide-react';

interface ApartmentsTabProps {
  building: {
    id: number;
    name: string;
    address: string;
    apartmentCount: number;
    balance: number;
    debt: number;
    description: string;
  };
}

export function ApartmentsTab({ building }: ApartmentsTabProps) {
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
  const statsVariants = {
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

  return (
    <div className="space-y-6">
      <motion.div 
        className="grid grid-cols-4 gap-4"
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
        initial="hidden"
        animate="visible"
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
    </div>
  );
}
