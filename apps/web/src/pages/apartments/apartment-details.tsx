import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { InformationCard } from '@/components/information-card';
import { ArrowLeft, Home, Users, CreditCard, AlertTriangle, Edit } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { useGetApartmentByIdQuery } from '@/redux/services/apartment.service';
import { ApartmentInformation } from '../../components/apartments/apartment-details/apartment-information';
import { ApartmentPayments } from '../../components/apartments/apartment-details/payments/apartment-payments';
import { ApartmentIrregularities } from '../../components/apartments/apartment-details/irregularities/apartment-irregularities';

export function ApartmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Fetch apartment data
  const { data: apartmentData, isLoading, error } = useGetApartmentByIdQuery(id!, {
    skip: !id,
  });

  // Mock data for apartment details (fallback and additional mock data)
  const mockApartment = {
    id: id || '1',
    number: apartmentData?.number || 'Ап. 1',
    floor: apartmentData?.floor || 1,
    quadrature: Number(apartmentData?.quadrature) || 80.5,
    residents: apartmentData?.residents || [
      { name: 'Захари', surname: 'Марчев', isMainContact: true },
      { name: 'Мария', surname: 'Марчева', isMainContact: false }
    ],
    monthlyRent: Number(apartmentData?.monthlyRent) || 585.00,
    maintenanceFee: Number(apartmentData?.maintenanceFee) || 120.00,
    debt: Number(apartmentData?.debt) || 1478.50,
    status: apartmentData?.status || 'OCCUPIED',
    irregularitiesCount: 9, // Mock data - TODO: Add when irregularities system is implemented
    totalPayments: 2500.00, // Mock data - TODO: Add when financial system is implemented
    lastPaymentDate: '2025-01-15', // Mock data - TODO: Add when financial system is implemented
    buildingName: 'Сграда "Изгрев"', // Mock building name - TODO: Replace with actual building data
    buildingId: apartmentData?.buildingId // Real building ID from API
  };

  useEffect(() => {
    dispatch(setPageInfo({
      title: `Детайли на ${mockApartment.number}`,
      subtitle: 'Управление на информация и плащания'
    }));
  }, [dispatch, mockApartment.number]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (mockApartment.buildingId) {
      navigate(`/buildings/${mockApartment.buildingId}/apartments/${id}/edit`);
    } else {
      // Fallback - this shouldn't happen in normal operation
      console.error('Building ID not available for apartment edit');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Зареждане...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Грешка при зареждане на данните за апартамента.</p>
        <Button onClick={() => navigate('/buildings')} variant="outline">
          Назад към сгради
        </Button>
      </div>
    );
  }

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
      {/* Header */}
      <motion.div 
        className="space-y-4"
        variants={itemVariants}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <motion.button
              onClick={handleBack}
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={`Назад към ${mockApartment.buildingName}`}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={handleBack}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Назад към {mockApartment.buildingName}
                </button>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 truncate">{mockApartment.number}</h1>
              <p className="text-sm text-gray-500 truncate">
                Етаж {mockApartment.floor} • {(mockApartment.quadrature || 0).toFixed(2)} кв.м.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Редактирай</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Information Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <InformationCard
          title="Делничен"
          value={`${(mockApartment.monthlyRent || 0).toFixed(2)} лв.`}
          icon={Home}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          valueColor="text-blue-600"
          subtitle="Месечна наемна цена"
          variants={itemVariants}
        />
        
        <InformationCard
          title="Задължения"
          value={`${(mockApartment.debt || 0).toFixed(2)} лв.`}
          icon={CreditCard}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          valueColor="text-red-600"
          subtitle="Общо задължения"
          priority="high"
          variants={itemVariants}
        />
        
        <InformationCard
          title="Нередности"
          value={mockApartment.irregularitiesCount.toString()}
          icon={AlertTriangle}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
          valueColor="text-orange-600"
          subtitle="Активни нередности"
          variants={itemVariants}
        />
        
        <InformationCard
          title="Живущи"
          value={mockApartment.residents.length.toString()}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          valueColor="text-green-600"
          subtitle="Брой живущи"
          variants={itemVariants}
        />
      </motion.div>

      {/* Main Content Sections */}
      <motion.div variants={itemVariants} className="space-y-6">
        {/* Apartment Information */}
        <ApartmentInformation apartment={mockApartment} />
        
        {/* Apartment Payments */}
        <ApartmentPayments apartmentId={mockApartment.id} />
        
        {/* Apartment Irregularities */}
        <ApartmentIrregularities apartmentId={mockApartment.id} />
      </motion.div>
    </motion.div>
  );
}
