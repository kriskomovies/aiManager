import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, User, Home, MapPin, Phone, Mail } from 'lucide-react';

interface ApartmentInformationProps {
  apartment: {
    id: string;
    number: string;
    floor: number;
    quadrature: number;
    residents: Array<{
      name: string;
      surname: string;
      isMainContact: boolean;
    }>;
    monthlyRent: number;
    maintenanceFee: number;
    debt: number;
    status: string;
  };
}

export function ApartmentInformation({ apartment }: ApartmentInformationProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'OCCUPIED': { label: 'Заето', variant: 'positive' as const },
      'VACANT': { label: 'Свободно', variant: 'neutral' as const },
      'MAINTENANCE': { label: 'Поддръжка', variant: 'warning' as const },
      'RESERVED': { label: 'Резервирано', variant: 'neutral' as const },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'neutral' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getMainResident = () => {
    const mainContact = apartment.residents.find(r => r.isMainContact);
    return mainContact || apartment.residents[0];
  };

  const mainResident = getMainResident();

  return (
    <Card className="overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Home className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Информация за апартамента</h3>
            <p className="text-sm text-gray-600">Основни данни и живущи</p>
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
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                {/* Apartment Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Детайли на апартамента
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Собственик</label>
                      <p className="text-sm text-gray-900">{mainResident ? `${mainResident.name} ${mainResident.surname}` : 'Не е зададен'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Абонатен Номер</label>
                      <p className="text-sm text-gray-900">123456</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Домашни проблеми</label>
                      <p className="text-sm text-gray-900">1</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Квадратура</label>
                      <p className="text-sm text-gray-900">{apartment.quadrature} кв.м.</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Обща части</label>
                      <p className="text-sm text-gray-900">80 кв.м.</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Обща части</label>
                      <p className="text-sm text-gray-900">80 кв.м.</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Телефон</label>
                      <p className="text-sm text-gray-900">0883363963</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Имейл</label>
                      <p className="text-sm text-gray-900">alialial@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Residents */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Живущи ({apartment.residents.length})
                  </h4>
                  
                  <div className="space-y-3">
                    {apartment.residents.map((resident, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{resident.name} {resident.surname}</p>
                            <p className="text-sm text-gray-600">
                              {resident.isMainContact ? 'Основен контакт' : 'Живущ'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status and Financial Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-500">Статус</label>
                  <div className="mt-1">
                    {getStatusBadge(apartment.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Месечна наемна цена</label>
                  <p className="text-sm font-semibold text-gray-900">{apartment.monthlyRent.toFixed(2)} лв.</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Такса поддръжка</label>
                  <p className="text-sm font-semibold text-gray-900">{apartment.maintenanceFee.toFixed(2)} лв.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
