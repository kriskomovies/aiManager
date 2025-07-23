import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CalendarWithFilters, CalendarEventData } from '@/components/calendar-with-filters';

// Mock building data
const mockBuildings = [
  { id: 'building-1', name: 'Сграда "Изгрев"', address: 'ул. Витоша 15', apartmentCount: 24 },
  { id: 'building-2', name: 'Сграда "Слънце"', address: 'бул. Витошки 42', apartmentCount: 18 },
  { id: 'building-3', name: 'Сграда "Централ"', address: 'ул. Васил Левски 8', apartmentCount: 32 },
  { id: 'building-4', name: 'Сграда "Парк"', address: 'ул. Боян Магесник 12', apartmentCount: 16 },
];

// Mock events data for all buildings
const mockAllEvents: CalendarEventData[] = [
  // Building 1 events
  {
    id: '1',
    title: 'Събиране на собствениците',
    start: '2025-01-07T14:00:00',
    end: '2025-01-07T16:00:00',
    type: 'meeting',
    description: 'Месечно събиране на собствениците за обсъждане на актуални въпроси',
    buildingId: 'building-1',
    buildingName: 'Сграда "Изгрев"',
    status: 'scheduled',
    priority: 'medium',
    apartmentId: undefined,
    assignedTo: 'Мария Петрова'
  },
  {
    id: '2',
    title: 'Ремонт на асансьор',
    start: '2025-01-07T16:00:00',
    end: '2025-01-07T18:00:00',
    type: 'maintenance',
    description: 'Профилактичен ремонт на асансьор - етаж 1-6',
    buildingId: 'building-1',
    buildingName: 'Сграда "Изгрев"',
    status: 'scheduled',
    priority: 'high',
    apartmentId: undefined,
    assignedTo: 'Иван Георгиев'
  },
  // Building 2 events
  {
    id: '3',
    title: 'Инспекция пожарна безопасност',
    start: '2025-01-09T10:00:00',
    end: '2025-01-09T12:00:00',
    type: 'inspection',
    description: 'Годишна инспекция за пожарна безопасност',
    buildingId: 'building-2',
    buildingName: 'Сграда "Слънце"',
    status: 'scheduled',
    priority: 'high',
    apartmentId: undefined,
    assignedTo: 'Пожарна служба'
  },
  {
    id: '4',
    title: 'Събиране на такси',
    start: '2025-01-10T09:00:00',
    end: '2025-01-10T17:00:00',
    type: 'payment',
    description: 'Събиране на месечни такси за януари',
    buildingId: 'building-2',
    buildingName: 'Сграда "Слънце"',
    status: 'in-progress',
    priority: 'medium',
    apartmentId: undefined,
    assignedTo: 'Елена Димитрова'
  },
  // Building 3 events
  {
    id: '5',
    title: 'Почистване на покрив',
    start: '2025-01-12T08:00:00',
    end: '2025-01-12T12:00:00',
    type: 'maintenance',
    description: 'Почистване на покрива от сняг и лед',
    buildingId: 'building-3',
    buildingName: 'Сграда "Централ"',
    status: 'completed',
    priority: 'urgent',
    apartmentId: undefined,
    assignedTo: 'Строителна компания "Алфа"'
  },
  {
    id: '6',
    title: 'Общо събрание',
    start: '2025-01-15T19:00:00',
    end: '2025-01-15T21:00:00',
    type: 'meeting',
    description: 'Извънредно общо събрание за промени в устава',
    buildingId: 'building-3',
    buildingName: 'Сграда "Централ"',
    status: 'scheduled',
    priority: 'high',
    apartmentId: undefined,
    assignedTo: 'Анна Стоянова'
  },
  // Building 4 events
  {
    id: '7',
    title: 'Ремонт отоплителна система',
    start: '2025-01-20T08:00:00',
    end: '2025-01-22T17:00:00',
    type: 'repair',
    description: 'Ремонт на отоплителната система - подмяна на тръби',
    buildingId: 'building-4',
    buildingName: 'Сграда "Парк"',
    status: 'scheduled',
    priority: 'urgent',
    apartmentId: undefined,
    assignedTo: 'ВиК "Топлофикация"'
  },
];

export function CalendarPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get event counts by type for the badge
  const eventCounts = useMemo(() => {
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
        (event.buildingName && event.buildingName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return {
      total: events.length,
      maintenance: events.filter(e => e.type === 'maintenance').length,
      inspection: events.filter(e => e.type === 'inspection').length,
      payment: events.filter(e => e.type === 'payment').length,
      meeting: events.filter(e => e.type === 'meeting').length,
      repair: events.filter(e => e.type === 'repair').length,
    };
  }, [selectedBuilding, eventTypeFilter, searchTerm]);

  // Format event title to include building name for multi-building view
  const formatEventTitle = (event: CalendarEventData) => {
    return `${event.title} (${event.buildingName})`;
  };

  // Header content for the calendar page
  const headerContent = (
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
    </div>
  );

  return (
    <CalendarWithFilters
      events={mockAllEvents}
      buildings={mockBuildings}
      selectedBuilding={selectedBuilding}
      onBuildingChange={setSelectedBuilding}
      showBuildingFilter={true}
      eventTypeFilter={eventTypeFilter}
      onEventTypeChange={setEventTypeFilter}
      showEventTypeFilter={true}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      showSearch={true}
      height="calc(100vh - 50px)"
      minHeight="750px"
      showFilters={true}
      showLegend={true}
      showStatistics={true}
      headerContent={headerContent}
      formatEventTitle={formatEventTitle}
    />
  );
}
