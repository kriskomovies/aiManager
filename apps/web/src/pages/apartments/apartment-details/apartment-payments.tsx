import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabConfig } from '@/components/ui/tabs';
import { ChevronDown, CreditCard, Receipt, Wrench } from 'lucide-react';
import { ApartmentTaxesTable } from '@/components/apartments/apartment-details/apartment-taxes-table';
import { ApartmentRepairsTable } from '@/components/apartments/apartment-details/apartment-repairs-table';

interface ApartmentPaymentsProps {
  apartmentId: string;
}

type PaymentTabType = 'taxes' | 'repairs';

const paymentTabs: TabConfig[] = [
  {
    id: 'taxes',
    label: 'Такси',
    icon: Receipt,
  },
  {
    id: 'repairs',
    label: 'Ремонти',
    icon: Wrench,
  },
];

export function ApartmentPayments({ apartmentId }: ApartmentPaymentsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<PaymentTabType>('taxes');

  return (
    <Card className="overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Плащания</h3>
            <p className="text-sm text-gray-600">Такси и ремонти</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100">
              <div className="p-4 pb-0">
                <Tabs
                  tabs={paymentTabs}
                  activeTab={activeTab}
                  onTabChange={(tabId) => setActiveTab(tabId as PaymentTabType)}
                  variant="underline"
                  className="mb-4"
                />
              </div>
              
              <div className="px-4 pb-4">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'taxes' && <ApartmentTaxesTable apartmentId={apartmentId} />}
                  {activeTab === 'repairs' && <ApartmentRepairsTable apartmentId={apartmentId} />}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
