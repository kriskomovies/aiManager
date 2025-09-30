import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PartnerStatusBadge } from '@/components/ui/partner-status-badge';
import { Tabs, TabConfig } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Pencil,
  Globe,
  FileText,
  Calendar,
  Building,
  CreditCard,
} from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { PartnerType, PartnerStatus } from './add-edit-partner.schema';
import {
  OverviewTab,
  ContractsTab,
  BuildingsTab,
  TransactionsTab,
  DocumentsTab,
  PartnerDetails,
} from '@/components/partners/partner-details';

// Extended partner data interface with type and status
interface PartnerDetailsExtended extends PartnerDetails {
  type: PartnerType;
  status: PartnerStatus;
}

type TabType =
  | 'overview'
  | 'contracts'
  | 'buildings'
  | 'transactions'
  | 'documents';

const tabs: TabConfig[] = [
  {
    id: 'overview',
    label: 'Преглед',
    icon: FileText,
  },
  {
    id: 'contracts',
    label: 'Договори',
    icon: Calendar,
  },
  {
    id: 'buildings',
    label: 'Сгради',
    icon: Building,
  },
  {
    id: 'transactions',
    label: 'Транзакции',
    icon: CreditCard,
  },
  {
    id: 'documents',
    label: 'Документи',
    icon: FileText,
  },
];

const validTabs = tabs.map(tab => tab.id) as TabType[];

export function PartnerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get tab from URL or default to 'overview'
  const getInitialTab = (): TabType => {
    const tabFromUrl = searchParams.get('tab') as TabType;
    return validTabs.includes(tabFromUrl) ? tabFromUrl : 'overview';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

  // Mock partner data
  const [partner] = useState<PartnerDetailsExtended>({
    id: id || '1',
    name: 'Строй-Инвест ЕООД',
    type: PartnerType.CONTRACTOR,
    status: PartnerStatus.ACTIVE,
    email: 'office@stroy-invest.bg',
    phone: '+359 88 123 4567',
    address: 'ул. Витоша 15, ет. 3',
    city: 'София',
    postalCode: '1000',
    country: 'България',
    taxNumber: 'BG123456789',
    registrationNumber: 'СОФ123456',
    creditLimit: 50000,
    paymentTerms: 30,
    website: 'https://stroy-invest.bg',
    description:
      'Строителна компания специализирана в жилищно строителство и ремонти. Работим с висококачествени материали и опитни специалисти.',
    contactPersonName: 'Иван Петров',
    contactPersonEmail: 'ivan.petrov@stroy-invest.bg',
    contactPersonPhone: '+359 88 123 4568',
    contractStartDate: '2024-01-01',
    contractEndDate: '2024-12-31',
    servicesProvided: ['Строителство', 'Ремонт', 'Поддръжка'],
    buildingsAccess: ['Сграда Витоша', 'Сграда Лозенец'],
    createdAt: '2023-12-15',
    updatedAt: '2024-01-15',
  });

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    const newTab = tabId as TabType;
    setActiveTab(newTab);

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

  useEffect(() => {
    if (partner) {
      dispatch(
        setPageInfo({
          title: 'Детайли на контрагент',
          subtitle: 'Управление на партньорска информация',
        })
      );
    }
  }, [partner, dispatch]);

  const handleBack = () => {
    navigate('/partners');
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/partners/${id}/edit`);
    }
  };

  // Helper functions
  const formatPartnerType = (type: PartnerType): string => {
    const typeLabels: Record<PartnerType, string> = {
      [PartnerType.SUPPLIER]: 'Доставчик',
      [PartnerType.SERVICE_PROVIDER]: 'Услугодател',
      [PartnerType.CONTRACTOR]: 'Изпълнител',
      [PartnerType.VENDOR]: 'Продавач',
      [PartnerType.CONSULTANT]: 'Консултант',
      [PartnerType.OTHER]: 'Друго',
    };
    return typeLabels[type];
  };

  const formatPartnerStatus = (status: PartnerStatus): React.JSX.Element => {
    return <PartnerStatusBadge status={status} size="md" />;
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
      {/* Header */}
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
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-semibold text-gray-900 truncate">
                  {partner.name}
                </h1>
                {formatPartnerStatus(partner.status)}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {formatPartnerType(partner.type)} • {partner.city},{' '}
                {partner.country}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {partner.website && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(partner.website, '_blank')}
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Уебсайт</span>
                </Button>
              </motion.div>
            )}

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

      {/* Tabs */}
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
        {activeTab === 'overview' && <OverviewTab partner={partner} />}
        {activeTab === 'contracts' && <ContractsTab partnerId={id!} />}
        {activeTab === 'buildings' && <BuildingsTab partnerId={id!} />}
        {activeTab === 'transactions' && <TransactionsTab partnerId={id!} />}
        {activeTab === 'documents' && <DocumentsTab partnerId={id!} />}
      </motion.div>
    </motion.div>
  );
}
