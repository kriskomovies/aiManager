import { motion } from 'framer-motion';
import { Users, Home, Smartphone } from 'lucide-react';
import { InformationCard } from '@/components/information-card';
import { BuildingResidentsTable } from '@/components/residents/building-residents-table';
import { useGetApartmentsByBuildingQuery } from '@/redux/services/apartment.service';
import { ResidentRole } from '@repo/interfaces';

interface ResidentsTabProps {
  buildingId: string;
}

export function UsersTab({ buildingId }: ResidentsTabProps) {
  // Fetch apartments with residents for the building
  const { data: apartments = [] } = useGetApartmentsByBuildingQuery(buildingId);

  // Calculate statistics from apartments data
  const residents = apartments.flatMap(apartment => apartment.residents || []);

  const stats = {
    totalResidents: residents.length,
    totalApartments: apartments.filter(apt => apt.residentsCount > 0).length,
    appUsers: Math.floor(residents.length * 0.7), // Mock - 70% use app
    owners: residents.filter(r => r.role === ResidentRole.OWNER).length,
    tenants: residents.filter(r => r.role === ResidentRole.TENANT).length,
    guests: residents.filter(r => r.role === ResidentRole.GUEST).length,
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
      >
        <InformationCard
          title="Апартаменти"
          value={stats.totalApartments.toString()}
          icon={Home}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          variants={cardAnimation}
        />
        <InformationCard
          title="Потребители"
          value={stats.totalResidents.toString()}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          variants={cardAnimation}
        />
        <InformationCard
          title="Използват Приложението"
          value={stats.appUsers.toString()}
          icon={Smartphone}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          variants={cardAnimation}
        />
      </motion.div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Потребители</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Собственици: {stats.owners}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Наематели: {stats.tenants}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Гости: {stats.guests}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <BuildingResidentsTable buildingId={buildingId} />
        </div>
      </div>
    </div>
  );
}
