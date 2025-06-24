import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { InformationCard } from '@/components/information-card';
import { BuildingsTable } from '@/components/buildings/buildings-table';
import { Plus, Lock, AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';

export function BuildingsListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageInfo({
      title: 'Сгради',
      subtitle: 'Управлявайте всички сгради'
    }));
  }, [dispatch]);

  const handleAddBuilding = () => {
    navigate('/buildings/add');
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

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Statistics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        {/* Balance Card */}
        <motion.div variants={itemVariants}>
          <InformationCard
            title="Баланс"
            value="585.00 лв."
            icon={Lock}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
            valueColor="text-green-600"
            percentageChange="+120.00% спрямо в предходния месец"
          />
        </motion.div>

        {/* Debt Card */}
        <motion.div variants={itemVariants}>
          <InformationCard
            title="Задлъжения"
            value="1478.50 лв."
            icon={AlertTriangle}
            iconColor="text-red-600"
            iconBgColor="bg-red-50"
            valueColor="text-red-600"
            percentageChange="+33.00% спрямо в предходния месец"
          />
        </motion.div>

        {/* Buildings/Apartments Card */}
        <motion.div variants={itemVariants}>
          <InformationCard
            title="Сгради / Апартаменти"
            value=""
            icon={Home}
            iconColor="text-gray-600"
            iconBgColor="bg-gray-50"
            valueColor="text-gray-900"
            subtitle="Управление на 5 апартамента"
          >
            <div className="flex items-baseline space-x-2 -mt-1">
              <span className="text-2xl font-bold text-gray-900">23</span>
              <span className="text-sm text-gray-500">/</span>
              <span className="text-2xl font-bold text-gray-900">161</span>
            </div>
          </InformationCard>
        </motion.div>

        {/* Irregularities Card */}
        <motion.div variants={itemVariants}>
          <InformationCard
            title="Нередности"
            value="9"
            icon={AlertTriangle}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-50"
            valueColor="text-orange-600"
            subtitle="Ден създаден от 3 апартамента"
          />
        </motion.div>
      </motion.div>

      {/* Buildings Table Section */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border"
        variants={itemVariants}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Сгради</h2>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                className="gap-2 bg-red-500 hover:bg-red-600 text-white"
                onClick={handleAddBuilding}
              >
                <Plus className="h-4 w-4" />
                Добави Сграда
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="p-6">
          <BuildingsTable />
        </div>
      </motion.div>
    </motion.div>
  );
}
