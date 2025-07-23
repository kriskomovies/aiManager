import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views, NavigateAction, ToolbarProps } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import { 
  Plus, 
  Download, 
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

// Mock building data
const mockBuildings = [
  { id: 'building-1', name: 'Сграда "Изгрев"', address: 'ул. Витоша 15', apartmentCount: 24 },
  { id: 'building-2', name: 'Сграда "Слънце"', address: 'бул. Витошки 42', apartmentCount: 18 },
  { id: 'building-3', name: 'Сграда "Централ"', address: 'ул. Васил Левски 8', apartmentCount: 32 },
  { id: 'building-4', name: 'Сграда "Парк"', address: 'ул. Боян Магесник 12', apartmentCount: 16 },
];

// Mock events data for all buildings
const mockAllEvents = [
  // Building 1 events
  {
    id: '1',
    title: 'Събиране на собствениците',
    start: '2025-01-07T14:00:00',
    end: '2025-01-07T16:00:00',
    type: 'meeting' as const,
    description: 'Месечно събиране на собствениците за обсъждане на актуални въпроси',
    buildingId: 'building-1',
    buildingName: 'Сграда "Изгрев"',
    status: 'scheduled' as const,
    priority: 'medium' as const,
    apartmentId: undefined,
    assignedTo: 'Мария Петрова'
  },
  {
    id: '2',
    title: 'Ремонт на асансьор',
    start: '2025-01-07T16:00:00',
    end: '2025-01-07T18:00:00',
    type: 'maintenance' as const,
    description: 'Профилактичен ремонт на асансьор - етаж 1-6',
    buildingId: 'building-1',
    buildingName: 'Сграда "Изгрев"',
    status: 'scheduled' as const,
    priority: 'high' as const,
    apartmentId: undefined,
    assignedTo: 'Иван Георгиев'
  },
  // Building 2 events
  {
    id: '3',
    title: 'Инспекция пожарна безопасност',
    start: '2025-01-09T10:00:00',
    end: '2025-01-09T12:00:00',
    type: 'inspection' as const,
    description: 'Годишна инспекция за пожарна безопасност',
    buildingId: 'building-2',
    buildingName: 'Сграда "Слънце"',
    status: 'scheduled' as const,
    priority: 'high' as const,
    apartmentId: undefined,
    assignedTo: 'Пожарна служба'
  },
  {
    id: '4',
    title: 'Събиране на такси',
    start: '2025-01-10T09:00:00',
    end: '2025-01-10T17:00:00',
    type: 'payment' as const,
    description: 'Събиране на месечни такси за януари',
    buildingId: 'building-2',
    buildingName: 'Сграда "Слънце"',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    apartmentId: undefined,
    assignedTo: 'Елена Димитрова'
  },
  // Building 3 events
  {
    id: '5',
    title: 'Почистване на покрив',
    start: '2025-01-12T08:00:00',
    end: '2025-01-12T12:00:00',
    type: 'maintenance' as const,
    description: 'Почистване на покрива от сняг и лед',
    buildingId: 'building-3',
    buildingName: 'Сграда "Централ"',
    status: 'completed' as const,
    priority: 'urgent' as const,
    apartmentId: undefined,
    assignedTo: 'Строителна компания "Алфа"'
  },
  {
    id: '6',
    title: 'Общо събрание',
    start: '2025-01-15T19:00:00',
    end: '2025-01-15T21:00:00',
    type: 'meeting' as const,
    description: 'Извънредно общо събрание за промени в устава',
    buildingId: 'building-3',
    buildingName: 'Сграда "Централ"',
    status: 'scheduled' as const,
    priority: 'high' as const,
    apartmentId: undefined,
    assignedTo: 'Анна Стоянова'
  },
  // Building 4 events
  {
    id: '7',
    title: 'Ремонт отоплителна система',
    start: '2025-01-20T08:00:00',
    end: '2025-01-22T17:00:00',
    type: 'repair' as const,
    description: 'Ремонт на отоплителната система - подмяна на тръби',
    buildingId: 'building-4',
    buildingName: 'Сграда "Парк"',
    status: 'scheduled' as const,
    priority: 'urgent' as const,
    apartmentId: undefined,
    assignedTo: 'ВиК "Топлофикация"'
  },
];

interface CalendarEventFormatted {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    id: string;
    title: string;
    start: string;
    end: string;
    type: 'meeting' | 'maintenance' | 'inspection' | 'payment' | 'repair';
    description?: string;
    buildingId: string;
    buildingName: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    apartmentId?: string;
    assignedTo?: string;
  };
}

export function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useAppDispatch();

  // Filter events based on selected building, type, and search
  const filteredEvents = useMemo(() => {
    let events = mockAllEvents;

    if (selectedBuilding !== 'all') {
      events = events.filter(event => event.buildingId === selectedBuilding);
    }

    if (eventTypeFilter !== 'all') {
      events = events.filter(event => event.type === eventTypeFilter);
    }

    if (searchTerm) {
      events = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return events;
  }, [selectedBuilding, eventTypeFilter, searchTerm]);

  // Transform events for calendar
  const calendarEvents = useMemo((): CalendarEventFormatted[] => {
    return filteredEvents.map((event) => ({
      id: event.id,
      title: `${event.title} (${event.buildingName})`,
      start: new Date(event.start),
      end: new Date(event.end),
      resource: event,
    }));
  }, [filteredEvents]);

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
    dispatch(openModal({
      type: 'add-calendar-event',
      data: {
        buildingId: selectedBuilding !== 'all' ? selectedBuilding : 'building-1',
        selectedStart: selectedStart?.toISOString(),
        selectedEnd: selectedEnd?.toISOString(),
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

  // Custom toolbar
  const CustomToolbar = (props: ToolbarProps<CalendarEventFormatted, object>) => {
    const { label, onNavigate } = props;
    
    return (
      <div className="flex items-center justify-between mb-6 p-4 bg-white">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 w-80">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('PREV' as NavigateAction)}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              ‹
            </Button>
            <h2 className="text-xl font-bold text-gray-900 text-center flex-1">{label}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('NEXT' as NavigateAction)}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              ›
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
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
            
            <Button size="sm" className="h-8 px-3 text-xs" onClick={() => handleAddEvent()}>
              <Plus className="w-3 h-3 mr-1" />
              Добави
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Get event counts by type
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              Календар на събитията
            </h1>
            <p className="text-gray-600 mt-2">
              Преглед на всички събития във всички сгради в системата
            </p>
          </div>
          <Badge variant="neutral" className="text-sm">
            {eventCounts.total} събития
          </Badge>
        </div>

        {/* Statistics Cards */}
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

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Сграда</label>
            <Select 
              value={selectedBuilding} 
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="w-full"
            >
              <option value="all">Всички сгради</option>
              {mockBuildings.map(building => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Тип събитие</label>
            <Select 
              value={eventTypeFilter} 
              onChange={(e) => setEventTypeFilter(e.target.value)}
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Търсене</label>
            <Input
              type="text"
              placeholder="Търси събития..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Действия</label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSelectedBuilding('all');
                  setEventTypeFilter('all');
                  setSearchTerm('');
                }}
                className="flex items-center gap-2"
              >
                <X className="w-3 h-3" />
                Изчисти
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white overflow-hidden">
        <div 
          className="" 
          style={{ 
            height: 'calc(100vh - 50px)', 
            minHeight: '750px',
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
            onSelectEvent={handleEventClick}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={eventStyleGetter}
            components={{
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
    </div>
  );
}
