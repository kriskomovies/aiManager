import { motion } from 'framer-motion';
import {
  Euro,
  TrendingDown,
  TrendingUp,
  Building,
  Calculator,
} from 'lucide-react';
import { InformationCard } from '@/components/information-card';
import { CashierTable } from '@/components/cashier/cashier-table';
import { useGetBuildingQuery } from '@/redux/services/building.service';
import { useGetApartmentsByBuildingQuery } from '@/redux/services/apartment.service';

interface CashierTabProps {
  buildingId: string;
}

export function CashierTab({ buildingId }: CashierTabProps) {
  // Fetch building data
  const { data: building } = useGetBuildingQuery(buildingId);

  // Fetch apartments to calculate stats
  const { data: apartments = [] } = useGetApartmentsByBuildingQuery(buildingId);

  // Calculate statistics
  const stats = {
    balance: building?.balance || 585.0,
    obligations:
      apartments.reduce((sum, apt) => sum + (apt.debt || 0), 0) || 1478.5,
    monthlyTax: building?.monthlyFee
      ? building.monthlyFee * (apartments.length || 13)
      : 170.0,
    apartmentCount: apartments.length || 13,
    totalDebt: apartments.filter(apt => (apt.debt || 0) > 0).length || 9,
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

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
      >
        <InformationCard
          title="Баланс"
          value={`${stats.balance.toFixed(2)} лв.`}
          subtitle={`+230.00лв спрямо предходния месец`}
          icon={Euro}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          valueColor="text-green-600"
          variants={cardAnimation}
        />
        <InformationCard
          title="Задължения"
          value={`${stats.obligations.toFixed(2)} лв.`}
          subtitle={`+230.00лв спрямо предходния месец`}
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          valueColor="text-red-600"
          variants={cardAnimation}
        />
        <InformationCard
          title="Месечна Такса"
          value={`${stats.monthlyTax.toFixed(2)} лв.`}
          subtitle={`Събрано от 6 различни такси`}
          icon={Calculator}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          variants={cardAnimation}
        />
        <InformationCard
          title="Апартаменти"
          value={stats.apartmentCount.toString()}
          subtitle={`3 апартамента със задължения`}
          icon={Building}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          variants={cardAnimation}
        />
        <InformationCard
          title="Нередности"
          value={stats.totalDebt.toString()}
          subtitle={`докладвани от 3 апартамента`}
          icon={TrendingUp}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50"
          variants={cardAnimation}
        />
      </motion.div>

      {/* Cashier Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Апартаменти</h3>
        </div>

        <div className="p-6">
          <CashierTable buildingId={buildingId} />
        </div>
      </div>
    </div>
  );
}
