import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';

interface Resident {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
}

export function AddApartmentPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { buildingId } = useParams<{ buildingId: string }>();
  const [formData, setFormData] = useState({
    // Basic Information
    type: '',
    number: '',
    floor: '',
    residentsCount: '',
    pets: '',
    quadrature: '',
    commonParts: '',
    idealParts: '',
    // Invoice section
    invoiceEnabled: false,
    // Other section
    cashierNote: '',
    blockForPayment: false,
  });

  const [residents, setResidents] = useState<Resident[]>([]);
  const [building, setBuilding] = useState<{ id: string; name: string; address: string } | null>(null);

  useEffect(() => {
    // Mock building data - in real app, this would be an API call
    const mockBuildings = [
      { id: '1', name: 'Сграда Витоша', address: 'ул. Витоша 15' },
      { id: '2', name: 'Сграда Лозенец', address: 'ул. Лозенец 22' },
      { id: '3', name: 'Сграда Център', address: 'ул. Център 8' },
    ];
    
    const foundBuilding = mockBuildings.find(b => b.id === buildingId);
    setBuilding(foundBuilding || null);
    
    if (foundBuilding) {
      dispatch(setPageInfo({
        title: 'Нов Апартамент',
        subtitle: `Създайте нов апартамент в ${foundBuilding.name} - ${foundBuilding.address}`
      }));
    } else {
      dispatch(setPageInfo({
        title: 'Нов Апартамент',
        subtitle: 'Създайте нов апартамент в системата'
      }));
    }
  }, [dispatch, buildingId]);

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

  const formSectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05
      }
    }
  };

  // Mock data for apartment types
  const typeOptions = [
    { value: 'apartment', label: 'Апартамент' },
    { value: 'atelier', label: 'Ателие' },
    { value: 'office', label: 'Офис' },
    { value: 'garage', label: 'Гараж' },
    { value: 'shop', label: 'Магазин' },
    { value: 'other', label: 'Друго' },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddResident = () => {
    const newResident: Resident = {
      id: Date.now().toString(),
      name: '',
      surname: '',
      phone: '',
      email: '',
    };
    setResidents(prev => [...prev, newResident]);
  };

  const handleRemoveResident = (id: string) => {
    setResidents(prev => prev.filter(resident => resident.id !== id));
  };

  const handleResidentChange = (id: string, field: keyof Resident, value: string) => {
    setResidents(prev => prev.map(resident => 
      resident.id === id ? { ...resident, [field]: value } : resident
    ));
  };

  const handleSubmit = () => {
    console.log('Submitting apartment data:', { formData, residents, buildingId });
    // TODO: Add API call to save apartment
    if (building) {
      navigate(`/buildings/${building.id}`);
    } else {
      navigate('/buildings');
    }
  };

  const handleBack = () => {
    if (building) {
      navigate(`/buildings/${building.id}`);
    } else {
      navigate('/buildings');
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.div className="flex items-center" variants={itemVariants}>
        <motion.button
          onClick={handleBack}
          className="flex items-center gap-2 py-2 px-4 hover:bg-gray-100 rounded-3xl text-gray-600 hover:text-gray-900 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">
            {building ? `Назад към ${building.name}` : 'Назад към сгради'}
          </span>
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Основна Информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={formSectionVariants}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="type">Тип</Label>
                <Select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <option value="">Изберете тип</option>
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="number">Номер</Label>
                <Input
                  id="number"
                  placeholder="Въведете номер на апартамента"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="floor">Етаж</Label>
                <Input
                  id="floor"
                  placeholder="Въведете етаж"
                  type="number"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={formSectionVariants}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="residentsCount">Брой Живущи</Label>
                <Input
                  id="residentsCount"
                  placeholder="Брой живущи"
                  type="number"
                  min="0"
                  value={formData.residentsCount}
                  onChange={(e) => handleInputChange('residentsCount', e.target.value)}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="pets">Домашни Любимци</Label>
                <Input
                  id="pets"
                  placeholder="Брой домашни любимци"
                  type="number"
                  min="0"
                  value={formData.pets}
                  onChange={(e) => handleInputChange('pets', e.target.value)}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="quadrature">Квадратура</Label>
                <div className="relative">
                  <Input
                    id="quadrature"
                    placeholder="Въведете квадратура"
                    type="number"
                    step="0.01"
                    value={formData.quadrature}
                    onChange={(e) => handleInputChange('quadrature', e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                    кв.м.
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={formSectionVariants}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="commonParts">Общи Части</Label>
                <div className="relative">
                  <Input
                    id="commonParts"
                    placeholder="Въведете общи части"
                    type="number"
                    step="0.01"
                    value={formData.commonParts}
                    onChange={(e) => handleInputChange('commonParts', e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                    кв.м.
                  </span>
                </div>
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="idealParts">Идеални Части</Label>
                <div className="relative">
                  <Input
                    id="idealParts"
                    placeholder="Въведете идеални части"
                    type="number"
                    step="0.01"
                    value={formData.idealParts}
                    onChange={(e) => handleInputChange('idealParts', e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                    кв.м.
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Residents Section */}
            <motion.div className="pt-4 border-t" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium">Живущи</h3>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddResident}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Добави Живущ
                  </Button>
                </motion.div>
              </div>
              
              <div className="space-y-4">
                {residents.map((resident) => (
                  <motion.div
                    key={resident.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border rounded-lg bg-gray-50 relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-red-500">Собственик</span>
                      <motion.button
                        onClick={() => handleRemoveResident(resident.id)}
                        className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="h-3 w-3 text-red-600" />
                      </motion.button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`name-${resident.id}`}>Име</Label>
                        <Input
                          id={`name-${resident.id}`}
                          placeholder="Име"
                          value={resident.name}
                          onChange={(e) => handleResidentChange(resident.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`surname-${resident.id}`}>Фамилия</Label>
                        <Input
                          id={`surname-${resident.id}`}
                          placeholder="Фамилия"
                          value={resident.surname}
                          onChange={(e) => handleResidentChange(resident.id, 'surname', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`phone-${resident.id}`}>Телефон</Label>
                        <Input
                          id={`phone-${resident.id}`}
                          placeholder="Телефон"
                          type="tel"
                          value={resident.phone}
                          onChange={(e) => handleResidentChange(resident.id, 'phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`email-${resident.id}`}>Имейл</Label>
                        <Input
                          id={`email-${resident.id}`}
                          placeholder="Имейл"
                          type="email"
                          value={resident.email}
                          onChange={(e) => handleResidentChange(resident.id, 'email', e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {residents.length === 0 && (
                  <p className="text-sm text-gray-500 italic text-center py-4">
                    Няма добавени живущи. Натиснете "Добави Живущ" за да добавите.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Invoice Section */}
            <motion.div className="pt-4 border-t" variants={itemVariants}>
              <div className="mb-4">
                <Toggle
                  id="invoiceToggle"
                  label="Добави Данни за Фактура"
                  pressed={formData.invoiceEnabled}
                  onPressedChange={(pressed) => handleInputChange('invoiceEnabled', pressed)}
                />
              </div>
              {formData.invoiceEnabled && (
                <motion.div 
                  className="pl-4 border-l-2 border-gray-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm text-gray-500 italic">
                    Допълнителни полета за фактуриране ще бъдат добавени тук...
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Other Section */}
            <motion.div className="pt-4 border-t" variants={itemVariants}>
              <h3 className="text-md font-medium mb-4">Други</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cashierNote">Бележка Видима за Касиера</Label>
                  <Input
                    id="cashierNote"
                    placeholder="Въведете бележка за касиера..."
                    value={formData.cashierNote}
                    onChange={(e) => handleInputChange('cashierNote', e.target.value)}
                  />
                </div>
                
                <div>
                  <Toggle
                    id="blockForPayment"
                    label="Блокирай за Изипей"
                    pressed={formData.blockForPayment}
                    onPressedChange={(pressed) => handleInputChange('blockForPayment', pressed)}
                  />
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex justify-end space-x-3 pt-6" 
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  Отказ
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={handleSubmit}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Създай
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
