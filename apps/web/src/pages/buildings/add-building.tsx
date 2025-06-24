import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';

export function AddBuildingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    // General Information
    name: '',
    type: '',
    city: '',
    district: '',
    street: '',
    number: '',
    entrance: '',
    postalCode: '',
    commonPartsArea: '',
    quadrature: '',
    parkingSlots: '',
    basements: '',
    taxGenerationPeriod: '',
    taxGenerationDay: '',
    homebookStartDate: '',
    // Invoice section
    invoiceEnabled: false,
    // People with access
    peopleWithAccess: [] as string[],
  });

  useEffect(() => {
    dispatch(setPageInfo({
      title: 'Добави Сграда',
      subtitle: 'Създайте нова сграда в системата'
    }));
  }, [dispatch]);

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

  // Mock data for dropdowns
  const typeOptions = [
    { value: 'residential', label: 'Жилищна' },
    { value: 'commercial', label: 'Търговска' },
    { value: 'office', label: 'Офис сграда' },
    { value: 'mixed', label: 'Смесена' },
  ];

  const cityOptions = [
    { value: 'sofia', label: 'София' },
    { value: 'plovdiv', label: 'Пловдив' },
    { value: 'varna', label: 'Варна' },
    { value: 'burgas', label: 'Бургас' },
  ];

  const districtOptions = [
    { value: 'center', label: 'Център' },
    { value: 'lozenets', label: 'Лозенец' },
    { value: 'vitosha', label: 'Витоша' },
    { value: 'mladost', label: 'Младост' },
  ];

  const taxPeriodOptions = [
    { value: 'monthly', label: 'Месечно' },
    { value: 'quarterly', label: 'Тримесечно' },
    { value: 'yearly', label: 'Годишно' },
  ];

  const peopleOptions: MultiSelectOption[] = [
    { value: 'admin1', label: 'Иван Петров - Администратор' },
    { value: 'manager1', label: 'Мария Георгиева - Управител' },
    { value: 'accountant1', label: 'Петър Стоянов - Счетоводител' },
    { value: 'resident1', label: 'Елена Димитрова - Жилец' },
    { value: 'resident2', label: 'Георги Николов - Жилец' },
  ];

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting form data:', formData);
    // TODO: Add API call to save building
    navigate('/buildings');
  };

  const handleBack = () => {
    navigate('/buildings');
  };

  const handleAddCompany = () => {
    console.log('Add company clicked');
    // TODO: Implement add company functionality
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
          <span className="text-sm font-medium">Назад към сгради</span>
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Обща Информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General Information Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={formSectionVariants}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="name">Име</Label>
                <Input
                  id="name"
                  placeholder="Въведете име на сградата"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </motion.div>
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
                <Label htmlFor="city">Град</Label>
                <Select
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                >
                  <option value="">Изберете град</option>
                  {cityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={formSectionVariants}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="district">Район</Label>
                <Select
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                >
                  <option value="">Изберете район</option>
                  {districtOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="street">Улица</Label>
                <Input
                  id="street"
                  placeholder="Въведете улица"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="number">Номер</Label>
                <Input
                  id="number"
                  placeholder="Въведете номер"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={formSectionVariants}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="entrance">Вход</Label>
                <Input
                  id="entrance"
                  placeholder="Въведете вход"
                  value={formData.entrance}
                  onChange={(e) => handleInputChange('entrance', e.target.value)}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="postalCode">Пощенски код</Label>
                <Input
                  id="postalCode"
                  placeholder="Въведете пощенски код"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="commonPartsArea">Общи части площ</Label>
                <Input
                  id="commonPartsArea"
                  placeholder="кв.м."
                  value={formData.commonPartsArea}
                  onChange={(e) => handleInputChange('commonPartsArea', e.target.value)}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={formSectionVariants}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="quadrature">Квадратура</Label>
                <Input
                  id="quadrature"
                  placeholder="кв.м."
                  value={formData.quadrature}
                  onChange={(e) => handleInputChange('quadrature', e.target.value)}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="parkingSlots">Паркоместа</Label>
                <Input
                  id="parkingSlots"
                  placeholder="Брой"
                  value={formData.parkingSlots}
                  onChange={(e) => handleInputChange('parkingSlots', e.target.value)}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="basements">Мазета</Label>
                <Input
                  id="basements"
                  placeholder="Брой"
                  value={formData.basements}
                  onChange={(e) => handleInputChange('basements', e.target.value)}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={formSectionVariants}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="taxGenerationPeriod">Период за генериране на такси</Label>
                <Select
                  id="taxGenerationPeriod"
                  value={formData.taxGenerationPeriod}
                  onChange={(e) => handleInputChange('taxGenerationPeriod', e.target.value)}
                >
                  <option value="">Изберете период</option>
                  {taxPeriodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="taxGenerationDay">Ден за генериране</Label>
                <Input
                  id="taxGenerationDay"
                  placeholder="Ден от месеца"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.taxGenerationDay}
                  onChange={(e) => handleInputChange('taxGenerationDay', e.target.value)}
                />
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="homebookStartDate">Начална дата на домовата книга</Label>
                <Input
                  id="homebookStartDate"
                  type="date"
                  value={formData.homebookStartDate}
                  onChange={(e) => handleInputChange('homebookStartDate', e.target.value)}
                />
              </motion.div>
            </motion.div>

            {/* Invoice Section */}
            <motion.div className="pt-4 border-t" variants={itemVariants}>
              <div className="mb-4">
                <Toggle
                  id="invoiceToggle"
                  label="Фактура"
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

            {/* People with Access */}
            <motion.div className="pt-4 border-t" variants={itemVariants}>
              <h3 className="text-md font-medium mb-4">Хора с достъп</h3>
              <div className="space-y-2">
                <MultiSelect
                  options={peopleOptions}
                  value={formData.peopleWithAccess}
                  onChange={(value) => handleInputChange('peopleWithAccess', value)}
                  placeholder="Изберете хора с достъп..."
                  className="w-full"
                />
              </div>
            </motion.div>

            {/* Partnering Companies */}
            <motion.div className="pt-4 border-t" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium">Партньорски компании</h3>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCompany}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Добави компания
                  </Button>
                </motion.div>
              </div>
              <p className="text-sm text-gray-500 italic">
                Списък с партньорски компании ще бъде показан тук...
              </p>
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
