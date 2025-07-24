import React, { useState, useMemo, ReactNode } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  View,
  NavigateAction,
  ToolbarProps,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Download, 
  Calendar as CalendarIcon,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { CalendarEventItems } from './calendar-event-items';

// Date-fns localizer for Bulgarian
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    bg: bg,
  },
});

// Common event interface for this component
export interface CalendarEventData {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'meeting' | 'maintenance' | 'inspection' | 'payment' | 'repair';
  description?: string;
  buildingId: string;
  buildingName?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  apartmentId?: string; // Keep for backward compatibility
  appliesToAllApartments?: boolean; // ✅ ADD THIS
  targetApartmentIds?: string[]; // ✅ ADD THIS
  assignedTo?: string;
}

interface CalendarEventFormatted {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: CalendarEventData;
}

interface Building {
  id: string;
  name: string;
  address?: string;
  apartmentCount?: number;
}

interface CalendarWithFiltersProps {
  // Event data
  events: CalendarEventData[];
  isLoading?: boolean;
  error?: unknown;

  // Building configuration
  buildings?: Building[];
  selectedBuilding?: string;
  onBuildingChange?: (buildingId: string) => void;
  showBuildingFilter?: boolean;

  // Event type filtering
  eventTypeFilter?: string;
  onEventTypeChange?: (eventType: string) => void;
  showEventTypeFilter?: boolean;

  // Past events filtering
  includePastEvents?: boolean;
  onIncludePastEventsChange?: (include: boolean) => void;
  showPastEventsFilter?: boolean;

  // Modal configuration
  buildingId?: string; // For single building mode
  isFromBuildingTab?: boolean;

  // Calendar configuration
  height?: string;
  minHeight?: string;
  showFilters?: boolean;
  showLegend?: boolean;
  showStatistics?: boolean;
  showFilteredEventsList?: boolean;

  // Custom content
  headerContent?: ReactNode;
  toolbarActions?: ReactNode;

  // Event title formatting
  formatEventTitle?: (event: CalendarEventData) => string;

  // Event actions
  onEditEvent?: (event: CalendarEventData) => void;
  onDeleteEvent?: (event: CalendarEventData) => void;
  onViewEvent?: (event: CalendarEventData) => void;
}

export function CalendarWithFilters({
  events,
  isLoading = false,
  error,
  buildings = [],
  selectedBuilding = 'all',
  onBuildingChange,
  showBuildingFilter = false,
  eventTypeFilter = 'all',
  onEventTypeChange,
  showEventTypeFilter = true,
  includePastEvents = true,
  onIncludePastEventsChange,
  showPastEventsFilter = true,
  buildingId,
  isFromBuildingTab = false,
  height = 'calc(100vh - 160px)',
  minHeight = '650px',
  showFilters = true,
  showLegend = true,
  showStatistics = false,
  showFilteredEventsList = true,
  headerContent,
  toolbarActions,
  formatEventTitle,
  onEditEvent,
  onDeleteEvent,
  onViewEvent,
}: CalendarWithFiltersProps) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH); // Use proper View type
  const [isFilteredEventsCollapsed, setIsFilteredEventsCollapsed] = useState(false);
  const dispatch = useAppDispatch();

  // Handler for view changes
  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Building filter (only if showBuildingFilter is true and a building is selected)
    if (showBuildingFilter && selectedBuilding !== 'all') {
      filtered = filtered.filter(
        event => event.buildingId === selectedBuilding
      );
    }

    // Event type filter
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === eventTypeFilter);
    }

    // Past events filter - only filter out past events if includePastEvents is false
    if (!includePastEvents) {
      const now = new Date();
      // Set time to start of today to include events from today
      now.setHours(0, 0, 0, 0);
      filtered = filtered.filter(event => new Date(event.end) >= now);
    }

    return filtered;
  }, [
    events,
    selectedBuilding,
    eventTypeFilter,
    includePastEvents,
  ]);

  // Transform events for calendar
  const calendarEvents = useMemo((): CalendarEventFormatted[] => {
    return filteredEvents.map(event => ({
      id: event.id,
      title: formatEventTitle ? formatEventTitle(event) : event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      resource: event,
    }));
  }, [filteredEvents, formatEventTitle]);

  // Event styling
  const eventStyleGetter = (event: CalendarEventFormatted) => {
    const eventData = event.resource;
    if (!eventData) return { style: {} };

    const styles = {
      maintenance: { backgroundColor: '#EB5757', color: 'white' },
      inspection: { backgroundColor: '#2F80ED', color: 'white' },
      payment: { backgroundColor: '#27AE60', color: 'white' },
      meeting: { backgroundColor: '#9B59B6', color: 'white' },
      repair: { backgroundColor: '#F39C12', color: 'white' },
    };

    return {
      style: {
        ...styles[eventData.type],
        borderRadius: '4px',
        border: 'none',
        fontSize: '10px',
        padding: '2px 6px',
      },
      className: `event-${eventData.type}`,
    };
  };

  // Handle event click
  const handleEventClick = (event: CalendarEventFormatted) => {
    if (!event.resource) return;

    dispatch(
      openModal({
        type: 'event-details',
        data: {
          event: event.resource,
          buildingId: event.resource.buildingId,
        },
      })
    );
  };

  // Handle add event
  const handleAddEvent = (selectedStart?: Date, selectedEnd?: Date) => {
    const targetBuildingId =
      buildingId ||
      (selectedBuilding !== 'all' ? selectedBuilding : 'building-1');

    dispatch(
      openModal({
        type: 'add-edit-calendar-event',
        data: {
          buildingId: targetBuildingId,
          selectedStart: selectedStart?.toISOString(),
          selectedEnd: selectedEnd?.toISOString(),
          isFromBuildingTab,
        },
      })
    );
  };

  // Handle slot selection (clicking on a date)
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    handleAddEvent(start, end);
  };

  // Handle navigation
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    if (onBuildingChange) onBuildingChange('all');
    if (onEventTypeChange) onEventTypeChange('all');
    if (onIncludePastEventsChange) onIncludePastEventsChange(true); // Reset to true
  };

  // Custom month cell wrapper for additional styling
  const MonthDateCell = ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: Date;
  }) => {
    const today = new Date();
    const isToday = value.toDateString() === today.toDateString();

    return (
      <div
        className={`rbc-date-cell ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
      >
        {children}
      </div>
    );
  };

  // Custom toolbar component
  const CustomToolbar = (
    props: ToolbarProps<CalendarEventFormatted, object>
  ) => {
    const { label, onNavigate } = props;

    return (
      <div className="flex items-center justify-between p-4 bg-white min-h-[64px]">
        <div className="flex items-center gap-3 min-w-0 flex-1 max-w-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV' as NavigateAction)}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            ‹
          </Button>
          <h2 className="text-xl font-bold text-gray-900 text-center flex-1 min-w-0">
            {label}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT' as NavigateAction)}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            ›
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('TODAY' as NavigateAction)}
            className="h-8 px-3 text-xs"
          >
            Днес
          </Button>


          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Експорт
          </Button>

          {toolbarActions}

          <Button
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => handleAddEvent()}
          >
            <Plus className="w-3 h-3 mr-1" />
            Добави
          </Button>
        </div>
      </div>
    );
  };

  // Get event counts by type for statistics
  const eventCounts = useMemo(() => {
    const counts = {
      total: filteredEvents.length,
      maintenance: filteredEvents.filter(e => e.type === 'maintenance').length,
      inspection: filteredEvents.filter(e => e.type === 'inspection').length,
      payment: filteredEvents.filter(e => e.type === 'payment').length,
      meeting: filteredEvents.filter(e => e.type === 'meeting').length,
      repair: filteredEvents.filter(e => e.type === 'repair').length,
    };
    return counts;
  }, [filteredEvents]);



  // Handle event actions
  const handleViewEvent = (event: CalendarEventData) => {
    if (onViewEvent) {
      onViewEvent(event);
    } else {
      dispatch(
        openModal({
          type: 'event-details',
          data: {
            event: event,
            buildingId: event.buildingId,
          },
        })
      );
    }
  };

  const handleEditEvent = (event: CalendarEventData) => {
    if (onEditEvent) {
      onEditEvent(event);
    } else {
      dispatch(
        openModal({
          type: 'add-edit-calendar-event',
          data: {
            event: event,
            buildingId: event.buildingId,
            isEdit: true,
          },
        })
      );
    }
  };

  const handleDeleteEvent = (event: CalendarEventData) => {
    if (onDeleteEvent) {
      onDeleteEvent(event);
    } else {
      // Open delete calendar event modal
      dispatch(
        openModal({
          type: 'delete-calendar-event',
          data: {
            eventId: event.id,
            eventTitle: event.title,
          },
        })
      );
    }
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      (showBuildingFilter && selectedBuilding !== 'all') ||
      (eventTypeFilter !== 'all') ||
      (includePastEvents !== true) // Changed from searchTerm to includePastEvents
    );
  }, [showBuildingFilter, selectedBuilding, eventTypeFilter, includePastEvents]);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Зареждане на календара...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">Грешка при зареждане на календара</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Content */}
      {headerContent}

      {/* Statistics Cards */}
      {showStatistics && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900">
              {eventCounts.total}
            </div>
            <div className="text-xs text-gray-600">Общо събития</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-red-600">
              {eventCounts.maintenance}
            </div>
            <div className="text-xs text-red-600">Поддръжка</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-blue-600">
              {eventCounts.inspection}
            </div>
            <div className="text-xs text-blue-600">Проверки</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-green-600">
              {eventCounts.payment}
            </div>
            <div className="text-xs text-green-600">Плащания</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-purple-600">
              {eventCounts.meeting}
            </div>
            <div className="text-xs text-purple-600">Срещи</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-orange-600">
              {eventCounts.repair}
            </div>
            <div className="text-xs text-orange-600">Ремонти</div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              {showBuildingFilter && buildings.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Сграда
                  </label>
                  <Select
                    value={selectedBuilding}
                    onChange={e => onBuildingChange?.(e.target.value)}
                    className="w-full"
                    disabled={isFromBuildingTab}
                  >
                    <option value="all">Всички сгради</option>
                    {buildings.map(building => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {showEventTypeFilter && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Тип събитие
                  </label>
                  <Select
                    value={eventTypeFilter}
                    onChange={e => onEventTypeChange?.(e.target.value)}
                    className="w-full"
                  >
                    <option value="all">Всички типове</option>
                    <option value="maintenance">Поддръжка</option>
                    <option value="inspection">Проверки</option>
                    <option value="payment">Плащания</option>
                    <option value="meeting">Срещи</option>
                    <option value="repair">Ремонти</option>
                  </Select>
                </div>
              )}

              {showPastEventsFilter && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Настройки
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includePastEvents"
                      checked={includePastEvents}
                      onChange={e => onIncludePastEventsChange?.(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-2 cursor-pointer"
                    />
                    <label htmlFor="includePastEvents" className="text-sm text-gray-700 mt-2">
                      Покажи минали събития
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button - Right aligned and centered */}
            {(showBuildingFilter || showEventTypeFilter) && (
              <div className="flex-shrink-0 flex justify-center pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center"
                  title="Изчисти филтрите"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
        {/* Filtered Events List */}
        {showFilteredEventsList && hasActiveFilters && filteredEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div 
              className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsFilteredEventsCollapsed(!isFilteredEventsCollapsed)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Филтрирани събития
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Показани са {filteredEvents.length} от общо {events.length} събития
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-50 text-blue-700">
                    {filteredEvents.length} резултата
                  </Badge>
                  <motion.div
                    animate={{ rotate: isFilteredEventsCollapsed ? 0 : 180 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {!isFilteredEventsCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <CalendarEventItems
                    events={filteredEvents}
                    onViewEvent={handleViewEvent}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      {/* Empty State for Filtered Events */}
      {showFilteredEventsList && hasActiveFilters && filteredEvents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Няма намерени събития
            </h3>
            <p className="text-gray-600 mb-4">
              Не са намерени събития, отговарящи на избраните филтри.
            </p>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Изчисти филтрите
            </Button>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white overflow-hidden">
        <div
          className="calendar-container"
          style={{
            height,
            minHeight,
          }}
        >
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', fontFamily: 'Montserrat, sans-serif' }}
            view={view}
            onView={handleViewChange}
            date={date}
            onNavigate={handleNavigate}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEventClick}
            eventPropGetter={eventStyleGetter}
            components={{
              dateCellWrapper: MonthDateCell,
              toolbar: CustomToolbar,
            }}
            messages={{
              next: 'Следващ',
              previous: 'Предишен',
              today: 'Днес',
              month: 'Месец',
              week: 'Седмица',
              day: 'Ден',
              agenda: 'График',
              date: 'Дата',
              time: 'Време',
              event: 'Събитие',
              noEventsInRange: 'Няма събития в този период',
              showMore: total => `+ още ${total}`,
              allDay: 'Цял ден',
            }}
            culture="bg"
            popup
            step={30}
            timeslots={2}
            formats={{
              dayFormat: 'dd',
              dayHeaderFormat: 'dddd',
              dayRangeHeaderFormat: ({ start, end }) =>
                `${format(start, 'dd MMM', { locale: bg })} - ${format(end, 'dd MMM yyyy', { locale: bg })}`,
              monthHeaderFormat: 'MMMM yyyy',
              weekdayFormat: 'EEEEEE',
            }}
          />
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Легенда на събитията
          </h3>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-700">Поддръжка</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Проверки</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-700">Плащания</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-gray-700">Срещи</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-700">Ремонти</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
