import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  CalendarWithFilters,
  CalendarEventData,
} from '@/components/calendar/calendar-with-filters';
import { useGetBuildingsQuery } from '@/redux/services/building.service';
import { useGetCalendarEventsQuery } from '@/redux/services/calendar-service';
import { CalendarEventType } from '@repo/interfaces';

export function CalendarPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [includePastEvents, setIncludePastEvents] = useState<boolean>(true);

  // Fetch buildings from API
  const {
    data: buildingsData,
    isLoading: isBuildingsLoading,
    error: buildingsError,
  } = useGetBuildingsQuery({
    page: 1,
    pageSize: 100, // Get all buildings for filter dropdown
  });

  // Fetch calendar events from API
  const {
    data: eventsData,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useGetCalendarEventsQuery({
    page: 1,
    pageSize: 1000, // Get all events for calendar view
    buildingId: selectedBuilding !== 'all' ? selectedBuilding : undefined,
    type:
      eventTypeFilter !== 'all'
        ? (eventTypeFilter as CalendarEventType)
        : undefined,
    search: undefined, // Removed search term
  });

  // Transform buildings data for calendar filter
  const buildings = useMemo(() => {
    if (!buildingsData?.items) return [];
    return buildingsData.items.map(building => ({
      id: building.id,
      name: building.name,
      address: building.address,
      apartmentCount: building.apartmentCount,
    }));
  }, [buildingsData]);

  // Transform events data for calendar display
  const calendarEvents: CalendarEventData[] = useMemo(() => {
    if (!eventsData?.items) return [];

    return eventsData.items.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      type: event.type,
      description: event.description,
      buildingId: event.buildingId,
      buildingName:
        buildings.find(b => b.id === event.buildingId)?.name ||
        'Unknown Building',
      status: event.status,
      priority: event.priority,
      apartmentId: event.apartmentId, // Keep for backward compatibility
      appliesToAllApartments: event.appliesToAllApartments, // ✅ PRESERVE THIS
      targetApartmentIds: event.targetApartmentIds, // ✅ PRESERVE THIS
      assignedTo: event.assignedTo,
    }));
  }, [eventsData, buildings]);

  // Get event counts by type for the badge
  const eventCounts = useMemo(() => {
    const events = calendarEvents;

    return {
      total: events.length,
      maintenance: events.filter(e => e.type === 'maintenance').length,
      inspection: events.filter(e => e.type === 'inspection').length,
      payment: events.filter(e => e.type === 'payment').length,
      meeting: events.filter(e => e.type === 'meeting').length,
      repair: events.filter(e => e.type === 'repair').length,
    };
  }, [calendarEvents]);

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

  const isLoading = isBuildingsLoading || isEventsLoading;
  const hasError = buildingsError || eventsError;

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Зареждане на календара...</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-600">Грешка при зареждане на календара</div>
        </div>
      </div>
    );
  }

  return (
    <CalendarWithFilters
      events={calendarEvents}
      buildings={buildings}
      selectedBuilding={selectedBuilding}
      onBuildingChange={setSelectedBuilding}
      showBuildingFilter={true}
      eventTypeFilter={eventTypeFilter}
      onEventTypeChange={setEventTypeFilter}
      showEventTypeFilter={true}
      includePastEvents={includePastEvents}
      onIncludePastEventsChange={setIncludePastEvents}
      showPastEventsFilter={true}
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
