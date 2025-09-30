import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { InformationCard } from '@/components/information-card';
import { PartnersTable } from '@/components/partners/partners-table';
import {
  Plus,
  Users,
  Handshake,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';

export function PartnersListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageInfo({
        title: 'Контрагенти',
        subtitle: 'Управлявайте всички бизнес партньори',
      })
    );
  }, [dispatch]);

  const handleAddPartner = () => {
    navigate('/partners/add');
  };

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
        {/* Active Partners Card */}
        <InformationCard
          title="Активни Контрагенти"
          value="23"
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          valueColor="text-green-600"
          percentageChange="+8.7% спрямо предходния месец"
          variants={itemVariants}
        />

        {/* Total Partners Card */}
        <InformationCard
          title="Общо Контрагенти"
          value="28"
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          valueColor="text-blue-600"
          percentageChange="+12.0% спрямо предходния месец"
          variants={itemVariants}
        />

        {/* Services/Contracts Card */}
        <InformationCard
          title="Договори / Услуги"
          value=""
          icon={Handshake}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          valueColor="text-gray-900"
          subtitle="Активни партньорства"
          variants={itemVariants}
        >
          <div className="flex items-baseline space-x-2 -mt-1">
            <span className="text-2xl font-bold text-gray-900">18</span>
            <span className="text-sm text-gray-500">/</span>
            <span className="text-2xl font-bold text-gray-900">42</span>
          </div>
        </InformationCard>

        {/* Pending/Issues Card */}
        <InformationCard
          title="Чакащи Одобрение"
          value="3"
          icon={AlertTriangle}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
          valueColor="text-orange-600"
          subtitle="Изискват внимание"
          variants={itemVariants}
        />
      </motion.div>

      {/* Partners Table Section */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border"
        variants={itemVariants}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Контрагенти</h2>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Button
                className="gap-2 w-full sm:w-auto"
                onClick={handleAddPartner}
              >
                <Plus className="h-4 w-4" />
                Добави Контрагент
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="p-6">
          <PartnersTable />
        </div>
      </motion.div>
    </motion.div>
  );
}
