import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
// import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';
import { selectModalData } from '@/redux/slices/modal-slice';
import { useGetBuildingsQuery } from '@/redux/services/building.service';
import { useGetApartmentsByBuildingQuery } from '@/redux/services/apartment.service';
import {
  useCreateEventMutation,
  useUpdateEventMutation,
  CalendarEvent,
} from '@/redux/services/calendar-service';
import { CalendarEventType, CalendarEventPriority } from '@repo/interfaces';
import { Calendar, Clock, MapPin, User, X, Building } from 'lucide-react';

interface AddEditCalendarEventModalProps {
  onClose: () => void;
}

interface CalendarEventFormData {
  title: string;
  type: CalendarEventType;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  apartmentIds: string[]; // Changed from apartmentId to apartmentIds array
  priority: CalendarEventPriority;
  assignedTo: string;
  buildingId: string;
}

export const AddEditCalendarEventModal: React.FC<
  AddEditCalendarEventModalProps
> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);

  // Determine if we're in edit mode
  const isEditMode = Boolean(modalData?.event || modalData?.editEvent);
  const eventToEdit = (modalData?.event || modalData?.editEvent) as
    | CalendarEvent
    | undefined;

  // Extract selectedStart and selectedEnd from modalData if available (for create mode)
  const selectedStart = modalData?.selectedStart
    ? new Date(modalData.selectedStart as string)
    : new Date();
  const selectedEnd = modalData?.selectedEnd
    ? new Date(modalData.selectedEnd as string)
    : new Date();

  const [formData, setFormData] = useState<CalendarEventFormData>({
    title: '',
    type: CalendarEventType.MEETING,
    startDate: selectedStart.toISOString().split('T')[0],
    startTime: selectedStart.toTimeString().slice(0, 5),
    endDate: selectedEnd.toISOString().split('T')[0],
    endTime: selectedEnd.toTimeString().slice(0, 5),
    description: '',
    apartmentIds: [], // Changed from apartmentId to apartmentIds array
    priority: CalendarEventPriority.MEDIUM,
    assignedTo: '',
    buildingId: '',
  });

  // Event types with proper enum values
  const eventTypes = [
    {
      value: CalendarEventType.MEETING,
      label: 'Събрание/Среща',
      icon: User,
      color: 'text-purple-600',
    },
    {
      value: CalendarEventType.MAINTENANCE,
      label: 'Поддръжка',
      icon: Building,
      color: 'text-red-600',
    },
    {
      value: CalendarEventType.INSPECTION,
      label: 'Инспекция',
      icon: Building,
      color: 'text-yellow-600',
    },
    {
      value: CalendarEventType.PAYMENT,
      label: 'Плащане/Такси',
      icon: Building,
      color: 'text-green-600',
    },
    {
      value: CalendarEventType.REPAIR,
      label: 'Ремонт',
      icon: Building,
      color: 'text-orange-600',
    },
  ];

  // Priority levels with proper enum values
  const priorityLevels = [
    {
      value: CalendarEventPriority.LOW,
      label: 'Нисък',
      color: 'text-green-600',
    },
    {
      value: CalendarEventPriority.MEDIUM,
      label: 'Среден',
      color: 'text-yellow-600',
    },
    {
      value: CalendarEventPriority.HIGH,
      label: 'Висок',
      color: 'text-red-600',
    },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  // API queries for buildings and apartments
  const {
    data: buildingsData,
    isLoading: isBuildingsLoading,
    error: buildingsError,
  } = useGetBuildingsQuery({
    page: 1,
    pageSize: 100, // Get all buildings for dropdown
  });

  const { data: apartmentsData = [], isLoading: isApartmentsLoading } =
    useGetApartmentsByBuildingQuery(formData.buildingId, {
      skip: !formData.buildingId, // Only fetch when buildingId is selected
    });

  // API mutation for creating calendar event
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  // Transform buildings data for dropdown
  const buildings = useMemo(() => {
    if (!buildingsData?.items) return [];
    return buildingsData.items.map(building => ({
      id: building.id,
      name: building.name,
      address: building.address,
    }));
  }, [buildingsData]);

  // Transform apartments data for multi-select
  const apartmentOptions: MultiSelectOption[] = useMemo(() => {
    const options: MultiSelectOption[] = [
      { value: 'all', label: 'Всички апартаменти' },
    ];

    if (apartmentsData.length > 0) {
      const sortedApartments = [...apartmentsData].sort((a, b) => {
        // Sort by floor first, then by apartment number
        if (a.floor !== b.floor) {
          return a.floor - b.floor;
        }
        return a.number.localeCompare(b.number, 'bg', { numeric: true });
      });

      sortedApartments.forEach(apartment => {
        options.push({
          value: apartment.id,
          label: `Апартамент ${apartment.number} (Етаж ${apartment.floor})`,
        });
      });
    }

    return options;
  }, [apartmentsData]);

  // Handle edit mode - populate form with event data (runs once when eventToEdit changes)
  useEffect(() => {
    if (isEditMode && eventToEdit) {
      const startDate = new Date(eventToEdit.start);
      const endDate = new Date(eventToEdit.end);

      // Convert backend apartment data to frontend format
      let apartmentIds: string[] = [];

      if (eventToEdit.appliesToAllApartments) {
        apartmentIds = ['all'];
      } else if (
        eventToEdit.targetApartmentIds &&
        eventToEdit.targetApartmentIds.length > 0
      ) {
        apartmentIds = [...eventToEdit.targetApartmentIds]; // Spread to ensure it's a new array
      } else if (eventToEdit.apartmentId) {
        // Fallback for old format
        apartmentIds = [eventToEdit.apartmentId];
      }

      setFormData({
        title: eventToEdit.title,
        type: eventToEdit.type,
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        description: eventToEdit.description || '',
        apartmentIds: apartmentIds,
        priority: eventToEdit.priority,
        assignedTo: eventToEdit.assignedTo || '',
        buildingId: eventToEdit.buildingId,
      });
    }
  }, [isEditMode, eventToEdit]);

  // Handle create mode - set building from modal data or default
  useEffect(() => {
    if (!isEditMode) {
      const buildingIdFromModal = modalData?.buildingId || '';
      const isFromBuildingTabFromModal = Boolean(modalData?.isFromBuildingTab);

      if (isFromBuildingTabFromModal && buildingIdFromModal) {
        setFormData(prev => ({
          ...prev,
          buildingId: buildingIdFromModal as string,
        }));
      } else if (buildings.length > 0 && !formData.buildingId) {
        // Set first building as default when opened from calendar page
        setFormData(prev => ({
          ...prev,
          buildingId: buildings[0].id,
        }));
      }
    }
  }, [
    modalData?.buildingId,
    modalData?.isFromBuildingTab,
    buildings,
    isEditMode,
  ]);

  const handleInputChange = (
    field: keyof CalendarEventFormData,
    value: string
  ) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Reset apartment selection when building changes
      if (field === 'buildingId') {
        updated.apartmentIds = [];
      }

      return updated;
    });
  };

  // Handle apartment selection with special logic for "all apartments"
  const handleApartmentChange = (selectedValues: string[]) => {
    setFormData(prev => {
      let newApartmentIds = [...selectedValues];

      // If "all" is selected, only keep "all" and remove other selections
      if (selectedValues.includes('all')) {
        newApartmentIds = ['all'];
      }
      // If other apartments are selected and then "all" is selected, only keep "all"
      else if (prev.apartmentIds.includes('all') && selectedValues.length > 0) {
        // "all" was previously selected but now other apartments are selected
        // Remove "all" and keep the specific apartment selections
        newApartmentIds = selectedValues.filter(id => id !== 'all');
      }

      return {
        ...prev,
        apartmentIds: newApartmentIds,
      };
    });
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

      if (!formData.buildingId) {
        dispatch(
          addAlert({
            type: 'error',
            title: 'Грешка',
            message: 'Моля изберете сграда за събитието.',
            duration: 5000,
          })
        );
        return;
      }

      // Combine date and time
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`
      );
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
      const eventData = {
        title: formData.title.trim(),
        type: formData.type,
        startDate: startDateTime.toISOString(), // Backend expects startDate
        endDate: endDateTime.toISOString(), // Backend expects endDate
        description: formData.description.trim() || undefined,
        buildingId: formData.buildingId,
        priority: formData.priority,
        assignedTo: formData.assignedTo.trim() || undefined,
        // Convert frontend apartment selection to backend format
        appliesToAllApartments: formData.apartmentIds.includes('all'),
        targetApartmentIds: formData.apartmentIds.includes('all')
          ? undefined
          : formData.apartmentIds.length > 0
            ? formData.apartmentIds
            : undefined,
      };

      if (isEditMode && eventToEdit) {
        // Update existing event - exclude buildingId since it can't be changed
        const updateData = {
          title: eventData.title,
          type: eventData.type,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          description: eventData.description,
          // Note: buildingId is excluded as it cannot be updated
          priority: eventData.priority,
          assignedTo: eventData.assignedTo,
          // Handle apartment targeting - convert to backend format
          appliesToAllApartments: eventData.appliesToAllApartments,
          targetApartmentIds: eventData.targetApartmentIds,
        };

        await updateEvent({ id: eventToEdit.id, ...updateData }).unwrap();

        dispatch(
          addAlert({
            type: 'success',
            title: 'Успешно',
            message: 'Събитието беше обновено успешно.',
            duration: 5000,
          })
        );
      } else {
        // Create new event
        await createEvent(eventData).unwrap();

        dispatch(
          addAlert({
            type: 'success',
            title: 'Успешно',
            message: 'Събитието беше създадено успешно.',
            duration: 5000,
          })
        );
      }

      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      dispatch(
        addAlert({
          type: 'error',
          title: 'Грешка',
          message: `Възникна грешка при ${isEditMode ? 'обновяването' : 'създаването'} на събитието.`,
          duration: 5000,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEventType = eventTypes.find(
    type => type.value === formData.type
  );
  const selectedPriority = priorityLevels.find(
    priority => priority.value === formData.priority
  );

  // Helper function to get apartment display text for preview
  const getApartmentDisplayText = () => {
    if (formData.apartmentIds.length === 0) {
      return 'Общо събитие (всички апартаменти)';
    }

    if (formData.apartmentIds.includes('all')) {
      return 'Всички апартаменти';
    }

    if (formData.apartmentIds.length === 1) {
      const apartment = apartmentOptions.find(
        opt => opt.value === formData.apartmentIds[0]
      );
      return apartment?.label || 'Избран апартамент';
    }

    return `${formData.apartmentIds.length} избрани апартамента`;
  };

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
          {isEditMode ? 'Редактиране на събитие' : 'Добавяне на ново събитие'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {isEditMode
            ? 'Редактирайте събитието в календара'
            : 'Създайте ново събитие в календара на сградата'}
        </p>
      </div>

      {/* Form Container with Scroll */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <form
          id="calendar-event-form"
          onSubmit={handleSubmit}
          className="space-y-6 p-6 pb-4"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-gray-700"
            >
              Заглавие на събитието *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="напр. Месечно събрание на собствениците"
              className="w-full"
              required
            />
          </div>

          {/* Building Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-600" />
              <Label
                htmlFor="buildingId"
                className="text-sm font-semibold text-gray-700"
              >
                Сграда *
              </Label>
            </div>
            {isBuildingsLoading ? (
              <div className="w-full h-10 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
                Зареждане на сгради...
              </div>
            ) : buildingsError ? (
              <div className="w-full h-10 bg-red-50 border border-red-200 rounded-md flex items-center justify-center text-sm text-red-600">
                Грешка при зареждане на сгради
              </div>
            ) : (
              <Select
                value={formData.buildingId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange('buildingId', e.target.value)
                }
                className="w-full"
                disabled={
                  isBuildingsLoading ||
                  Boolean(modalData?.isFromBuildingTab as boolean)
                }
                required
              >
                <option value="">Изберете сграда</option>
                {buildings.map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name} - {building.address}
                  </option>
                ))}
              </Select>
            )}
            {(modalData?.isFromBuildingTab as boolean) && (
              <p className="text-xs text-gray-500">
                Сграда е предварително избрана от текущия раздел
              </p>
            )}
          </div>

          {/* Event Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="type"
                className="text-sm font-semibold text-gray-700"
              >
                Тип събитие *
              </Label>
              <Select
                value={formData.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange('type', e.target.value as CalendarEventType)
                }
                className="w-full"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="text-sm font-semibold text-gray-700"
              >
                Приоритет
              </Label>
              <Select
                value={formData.priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange(
                    'priority',
                    e.target.value as CalendarEventPriority
                  )
                }
                className="w-full"
              >
                {priorityLevels.map(priority => (
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
              <Label className="text-sm font-semibold text-gray-700">
                Дата и час
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm text-gray-600">
                  Начална дата
                </Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={e =>
                      handleInputChange('startDate', e.target.value)
                    }
                    className="w-full pr-10"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm text-gray-600">
                  Начален час
                </Label>
                <div className="relative">
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={e =>
                      handleInputChange('startTime', e.target.value)
                    }
                    className="w-full pr-10"
                    required
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm text-gray-600">
                  Крайна дата
                </Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={e => handleInputChange('endDate', e.target.value)}
                    className="w-full pr-10"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm text-gray-600">
                  Краен час
                </Label>
                <div className="relative">
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={e => handleInputChange('endTime', e.target.value)}
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
                <Label
                  htmlFor="apartmentIds"
                  className="text-sm font-semibold text-gray-700"
                >
                  Апартаменти
                </Label>
              </div>
              {isApartmentsLoading ? (
                <div className="w-full h-10 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
                  Зареждане на апартаменти...
                </div>
              ) : (
                <>
                  <MultiSelect
                    options={apartmentOptions}
                    value={formData.apartmentIds}
                    onChange={handleApartmentChange}
                    placeholder="Изберете апартаменти..."
                    className="w-full"
                  />
                </>
              )}
              <p className="text-xs text-gray-500">
                Изберете "Всички апартаменти" за общо събитие или конкретни
                апартаменти
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <Label
                  htmlFor="assignedTo"
                  className="text-sm font-semibold text-gray-700"
                >
                  Отговорник
                </Label>
              </div>
              <Input
                id="assignedTo"
                type="text"
                value={formData.assignedTo}
                onChange={e => handleInputChange('assignedTo', e.target.value)}
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
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700"
            >
              Описание
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange('description', e.target.value)
              }
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
                  {selectedEventType && (
                    <selectedEventType.icon
                      className={`w-4 h-4 ${selectedEventType.color}`}
                    />
                  )}
                  <span className="font-semibold">{formData.title}</span>
                  {selectedPriority && <Badge>{selectedPriority.label}</Badge>}
                </div>
                <div className="text-gray-600">
                  🗓️ {formData.startDate} {formData.startTime} -{' '}
                  {formData.endDate} {formData.endTime}
                </div>
                <div className="text-gray-600">
                  📍 {getApartmentDisplayText()}
                </div>
                {formData.assignedTo && (
                  <div className="text-gray-600">👤 {formData.assignedTo}</div>
                )}
                {formData.description && (
                  <div className="text-gray-600">📝 {formData.description}</div>
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
          disabled={
            isSubmitting || !formData.title.trim() || !formData.buildingId
          }
          form="calendar-event-form"
        >
          {isSubmitting
            ? isEditMode
              ? 'Обновяване...'
              : 'Създаване...'
            : isEditMode
              ? 'Обнови събитие'
              : 'Създай събитие'}
        </Button>
      </div>
    </div>
  );
};
