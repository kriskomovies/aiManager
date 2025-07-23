import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
// import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';
import { selectModalData } from '@/redux/slices/modal-slice';
import { useCreateEventMutation, CalendarEvent } from '@/redux/services/calendar-service';
import { Calendar, Clock, MapPin, Users, AlertTriangle, User, X, Building } from 'lucide-react';

interface AddCalendarEventModalProps {
  onClose: () => void;
}

interface CalendarEventFormData {
  title: string;
  type: CalendarEvent['type'];
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  apartmentId: string;
  priority: CalendarEvent['priority'];
  assignedTo: string;
  buildingId: string;
}

const eventTypes = [
  { value: 'meeting', label: 'Събрание/Среща', icon: Users, color: 'text-purple-600' },
  { value: 'maintenance', label: 'Поддръжка', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'inspection', label: 'Проверка/Инспекция', icon: Calendar, color: 'text-blue-600' },
  { value: 'payment', label: 'Плащане/Такси', icon: MapPin, color: 'text-green-600' },
  { value: 'repair', label: 'Ремонт', icon: AlertTriangle, color: 'text-orange-600' },
] as const;

const priorityLevels = [
  { value: 'low', label: 'Ниска', color: 'text-gray-600', badgeVariant: 'neutral' as const },
  { value: 'medium', label: 'Средна', color: 'text-yellow-600', badgeVariant: 'warning' as const },
  { value: 'high', label: 'Висока', color: 'text-orange-600', badgeVariant: 'warning' as const },
  { value: 'urgent', label: 'Спешна', color: 'text-red-600', badgeVariant: 'negative' as const },
] as const;

// Mock building data - in real app this would come from API
const mockBuildings = [
  { id: 'building-1', name: 'Сграда "Изгрев"', address: 'ул. Витоша 15' },
  { id: 'building-2', name: 'Сграда "Слънце"', address: 'бул. Витошки 42' },
  { id: 'building-3', name: 'Сграда "Централ"', address: 'ул. Васил Левски 8' },
  { id: 'building-4', name: 'Сграда "Парк"', address: 'ул. Боян Магесник 12' },
];

// Mock apartment data - in real app this would come from API
const mockApartments = [
  { id: '', label: 'Общо събитие (всички апартаменти)' },
  { id: 'apt-101', label: 'Апартамент 101' },
  { id: 'apt-102', label: 'Апартамент 102' },
  { id: 'apt-201', label: 'Апартамент 201' },
  { id: 'apt-202', label: 'Апартамент 202' },
  { id: 'apt-301', label: 'Апартамент 301' },
  { id: 'apt-302', label: 'Апартамент 302' },
];

export function AddCalendarEventModal({ onClose }: AddCalendarEventModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  // Get current date/time or selected slot from modal data
  const selectedStart = modalData?.selectedStart ? new Date(modalData.selectedStart as string) : new Date();
  const selectedEnd = modalData?.selectedEnd ? new Date(modalData.selectedEnd as string) : new Date(selectedStart.getTime() + 60 * 60 * 1000); // +1 hour

  const buildingId = modalData?.buildingId || 'building-1';
  const isFromBuildingTab = Boolean(modalData?.isFromBuildingTab);

  const [formData, setFormData] = useState<CalendarEventFormData>({
    title: '',
    type: 'meeting',
    startDate: selectedStart.toISOString().split('T')[0],
    startTime: selectedStart.toTimeString().slice(0, 5),
    endDate: selectedEnd.toISOString().split('T')[0],
    endTime: selectedEnd.toTimeString().slice(0, 5),
    description: '',
    apartmentId: '',
    priority: 'medium',
    assignedTo: '',
    buildingId,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // API mutation for creating calendar event
  const [createEvent] = useCreateEventMutation();

  const handleInputChange = (
    field: keyof CalendarEventFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        dispatch(
          addAlert({
            type: 'error',
            title: 'Грешка',
            message: 'Моля въведете заглавие на събитието.',
            duration: 5000,
          })
        );
        return;
      }

      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        dispatch(
          addAlert({
            type: 'error',
            title: 'Грешка',
            message: 'Крайната дата и час трябва да бъдат след началната.',
            duration: 5000,
          })
        );
        return;
      }

      // Create event object
      const newEvent: Partial<CalendarEvent> = {
        title: formData.title.trim(),
        type: formData.type,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        description: formData.description.trim() || undefined,
        apartmentId: formData.apartmentId || undefined,
        buildingId: formData.buildingId,
        status: 'scheduled',
        priority: formData.priority,
        assignedTo: formData.assignedTo.trim() || undefined,
      };

      await createEvent(newEvent).unwrap();

      dispatch(
        addAlert({
          type: 'success',
          title: 'Успешно',
          message: 'Събитието беше създадено успешно.',
          duration: 5000,
        })
      );

      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: 'Възникна грешка при създаването на събитието.',
          duration: 5000,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEventType = eventTypes.find(type => type.value === formData.type);
  const selectedPriority = priorityLevels.find(priority => priority.value === formData.priority);

  return (
    <div className="w-full h-full flex flex-col relative max-h-[90vh]">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Добавяне на ново събитие
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Създайте ново събитие в календара на сградата
        </p>
      </div>

      {/* Form Container with Scroll */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <form id="calendar-event-form" onSubmit={handleSubmit} className="space-y-6 p-6 pb-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
              Заглавие на събитието *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="напр. Месечно събрание на собствениците"
              className="w-full"
              required
            />
          </div>

          {/* Building Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-600" />
              <Label htmlFor="buildingId" className="text-sm font-semibold text-gray-700">
                Сграда *
              </Label>
            </div>
            <Select
              value={formData.buildingId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('buildingId', e.target.value)}
              className="w-full"
              disabled={isFromBuildingTab}
            >
              {mockBuildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name} - {building.address}
                </option>
              ))}
            </Select>
            {isFromBuildingTab && (
              <p className="text-xs text-gray-500">
                Сградата е автоматично избрана на база текущия календар
              </p>
            )}
          </div>

          {/* Event Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold text-gray-700">
                Тип събитие *
              </Label>
              <Select
                value={formData.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('type', e.target.value)}
                className="w-full"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">
                Приоритет
              </Label>
              <Select
                value={formData.priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('priority', e.target.value as CalendarEvent['priority'])}
                className="w-full"
              >
                {priorityLevels.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <Label className="text-sm font-semibold text-gray-700">Дата и час</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm text-gray-600">Начална дата</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full pr-10"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm text-gray-600">Начален час</Label>
                <div className="relative">
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full pr-10"
                    required
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm text-gray-600">Крайна дата</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full pr-10"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm text-gray-600">Краен час</Label>
                <div className="relative">
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full pr-10"
                    required
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Apartment Selection and Assigned To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <Label htmlFor="apartmentId" className="text-sm font-semibold text-gray-700">
                  Апартамент
                </Label>
              </div>
              <Select
                value={formData.apartmentId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('apartmentId', e.target.value)}
                className="w-full"
              >
                {mockApartments.map((apartment) => (
                  <option key={apartment.id} value={apartment.id}>
                    {apartment.label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-gray-500">
                Оставете празно за общо събитие за цялата сграда
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <Label htmlFor="assignedTo" className="text-sm font-semibold text-gray-700">
                  Отговорник
                </Label>
              </div>
              <Input
                id="assignedTo"
                type="text"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                placeholder="напр. Иван Петров, Мария Николова"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Лице отговорно за събитието (незадължително)
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Описание
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
              placeholder="Добавете допълнителна информация за събитието..."
              rows={4}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Event Preview */}
          {formData.title && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                Преглед на събитието
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedEventType && <selectedEventType.icon className={`w-4 h-4 ${selectedEventType.color}`} />}
                  <span className="font-semibold">{formData.title}</span>
                  {selectedPriority && (
                    <Badge variant={selectedPriority.badgeVariant}>
                      {selectedPriority.label}
                    </Badge>
                  )}
                </div>
                <div className="text-gray-600">
                  🗓️ {formData.startDate} {formData.startTime} - {formData.endDate} {formData.endTime}
                </div>
                {formData.apartmentId && (
                  <div className="text-gray-600">
                    📍 {mockApartments.find(apt => apt.id === formData.apartmentId)?.label}
                  </div>
                )}
                {formData.assignedTo && (
                  <div className="text-gray-600">
                    👤 {formData.assignedTo}
                  </div>
                )}
                {formData.description && (
                  <div className="text-gray-600">
                    📝 {formData.description}
                  </div>
                )}
              </div>
            </div>
          )}

        </form>
      </div>
      
      {/* Fixed Footer with Actions */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Отказ
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title.trim()}
          form="calendar-event-form"
        >
          {isSubmitting ? 'Създаване...' : 'Създай събитие'}
        </Button>
      </div>
    </div>
  );
}