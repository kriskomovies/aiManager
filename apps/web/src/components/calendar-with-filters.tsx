import React, { useState, useMemo, ReactNode } from 'react';
import { Calendar, dateFnsLocalizer, Views, NavigateAction, ToolbarProps } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Plus, Filter, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';

// Date-fns localizer for Bulgarian
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'bg': bg,
  },
});

// Common event interface
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
  apartmentId?: string;
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
  
  // Search functionality
  searchTerm?: string;
  onSearchChange?: (search: string) => void;
  showSearch?: boolean;
  
  // Modal configuration
  buildingId?: string; // For single building mode
  isFromBuildingTab?: boolean;
  
  // Calendar configuration
  height?: string;
  minHeight?: string;
  showFilters?: boolean;
  showLegend?: boolean;
  showStatistics?: boolean;
  
  // Custom content
  headerContent?: ReactNode;
  toolbarActions?: ReactNode;
  
  // Event title formatting
  formatEventTitle?: (event: CalendarEventData) => string;
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
  searchTerm = '',
  onSearchChange,
  showSearch = true,
  buildingId,
  isFromBuildingTab = false,
  height = 'calc(100vh - 160px)',
  minHeight = '650px',
  showFilters = true,
  showLegend = true,
  showStatistics = false,
  headerContent,
  toolbarActions,
  formatEventTitle,
}: CalendarWithFiltersProps) {
  const [date, setDate] = useState(new Date());
  const dispatch = useAppDispatch();

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Building filter (only if showBuildingFilter is true and a building is selected)
    if (showBuildingFilter && selectedBuilding !== 'all') {
      filtered = filtered.filter(event => event.buildingId === selectedBuilding);
    }

    // Event type filter
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === eventTypeFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.buildingName && event.buildingName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [events, selectedBuilding, eventTypeFilter, searchTerm, showBuildingFilter]);

  // Transform events for calendar
  const calendarEvents = useMemo((): CalendarEventFormatted[] => {
    return filteredEvents.map((event) => ({
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
    
    dispatch(openModal({
      type: 'event-details',
      data: {
        event: event.resource,
        buildingId: event.resource.buildingId
      }
    }));
  };

  // Handle add event
  const handleAddEvent = (selectedStart?: Date, selectedEnd?: Date) => {
    const targetBuildingId = buildingId || 
      (selectedBuilding !== 'all' ? selectedBuilding : 'building-1');
    
    dispatch(openModal({
      type: 'add-calendar-event',
      data: {
        buildingId: targetBuildingId,
        selectedStart: selectedStart?.toISOString(),
        selectedEnd: selectedEnd?.toISOString(),
        isFromBuildingTab,
      }
    }));
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
    if (onSearchChange) onSearchChange('');
  };

  // Custom month cell wrapper for additional styling
  const MonthDateCell = ({ children, value }: { children: React.ReactNode; value: Date }) => {
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
  const CustomToolbar = (props: ToolbarProps<CalendarEventFormatted, object>) => {
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
          <h2 className="text-xl font-bold text-gray-900 text-center flex-1 min-w-0">{label}</h2>
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
          
          {showBuildingFilter && (
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              <Filter className="w-3 h-3 mr-1" />
              Филтър
            </Button>
          )}
          
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Експорт
          </Button>
          
          {toolbarActions}
          
          <Button size="sm" className="h-8 px-3 text-xs" onClick={() => handleAddEvent()}>
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
            <div className="text-lg font-bold text-gray-900">{eventCounts.total}</div>
            <div className="text-xs text-gray-600">Общо събития</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-red-600">{eventCounts.maintenance}</div>
            <div className="text-xs text-red-600">Поддръжка</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-blue-600">{eventCounts.inspection}</div>
            <div className="text-xs text-blue-600">Проверки</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-green-600">{eventCounts.payment}</div>
            <div className="text-xs text-green-600">Плащания</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-purple-600">{eventCounts.meeting}</div>
            <div className="text-xs text-purple-600">Срещи</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-orange-600">{eventCounts.repair}</div>
            <div className="text-xs text-orange-600">Ремонти</div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {showBuildingFilter && buildings.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Сграда</label>
                <Select 
                  value={selectedBuilding} 
                  onChange={(e) => onBuildingChange?.(e.target.value)}
                  className="w-full"
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
                <label className="text-sm font-medium text-gray-700">Тип събитие</label>
                <Select 
                  value={eventTypeFilter} 
                  onChange={(e) => onEventTypeChange?.(e.target.value)}
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

            {showSearch && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Търсене</label>
                <Input
                  type="text"
                  placeholder="Търси събития..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {(showBuildingFilter || showEventTypeFilter || showSearch) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Действия</label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearFilters}
                    className="flex items-center gap-2"
                  >
                    <X className="w-3 h-3" />
                    Изчисти
                  </Button>
                </div>
              </div>
            )}
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
            view={Views.MONTH}
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
              next: "Следващ",
              previous: "Предишен", 
              today: "Днес",
              month: "Месец",
              week: "Седмица",
              day: "Ден",
              agenda: "График",
              date: "Дата",
              time: "Време",
              event: "Събитие",
              noEventsInRange: "Няма събития в този период",
              showMore: (total) => `+ още ${total}`,
              allDay: "Цял ден",
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
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Легенда на събитията</h3>
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
