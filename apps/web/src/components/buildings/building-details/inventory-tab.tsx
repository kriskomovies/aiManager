import { InformationCard } from '@/components/information-card';
import { BuildingInventory } from '@/components/inventory/building-inventory';
import {
  Wallet,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Building2,
} from 'lucide-react';

interface InventoryTabProps {
  buildingId: string;
}

export function InventoryTab({ buildingId }: InventoryTabProps) {
  // Mock data for the information cards
  const inventoryStats = {
    mainCash: {
      value: '585.00',
      change: '+230.00лв сравнено с предходния месец',
    },
    deposit: {
      value: '200.00',
      change: '-10.00лв сравнено с предходния месец',
    },
    monthlyFees: {
      value: '170.00',
      change: 'Събрано от 6 различни такси',
    },
    debts: {
      value: '1478.50',
      change: '+230.00лв сравнено с предходния месец',
    },
  };

  return (
    <div className="space-y-6">
      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <InformationCard
          title="Основна Каса"
          value={`${inventoryStats.mainCash.value} лв.`}
          icon={Wallet}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          valueColor="text-green-600"
          subtitle={inventoryStats.mainCash.change}
        />

        <InformationCard
          title="Депозит"
          value={`${inventoryStats.deposit.value} лв.`}
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          valueColor="text-blue-600"
          subtitle={inventoryStats.deposit.change}
        />

        <InformationCard
          title="Месечна Такса"
          value={`${inventoryStats.monthlyFees.value} лв.`}
          icon={Calendar}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          valueColor="text-purple-600"
          subtitle={inventoryStats.monthlyFees.change}
        />

        <InformationCard
          title="Задължения"
          value={`${inventoryStats.debts.value} лв.`}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          valueColor="text-red-600"
          subtitle={inventoryStats.debts.change}
          priority="high"
        />

        <InformationCard
          title="Апартаменти със Задължения"
          value="13"
          icon={Building2}
          iconColor="text-gray-700"
          iconBgColor="bg-violet-50"
          valueColor="text-black"
          subtitle="от общо 17 апартамента"
        />
      </div>

      {/* All Inventories Component with Tabs */}
      <BuildingInventory buildingId={buildingId} />
    </div>
  );
}
