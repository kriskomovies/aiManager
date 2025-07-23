import { useMemo } from 'react';
import { useGetBuildingEventsQuery } from '@/redux/services/calendar-service';
import { CalendarWithFilters, CalendarEventData } from '@/components/calendar-with-filters';

interface CalendarTabProps {
  buildingId?: string;
}

export function CalendarTab({ buildingId = 'building-1' }: CalendarTabProps) {
  // RTK Query hooks
  const { data: events = [], isLoading, error } = useGetBuildingEventsQuery(buildingId);

  // Transform API events to match CalendarEventData interface
  const calendarEvents: CalendarEventData[] = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      type: event.type,
      description: event.description,
      buildingId: event.buildingId,
      buildingName: undefined, // Single building view doesn't need building name
      status: event.status,
      priority: event.priority,
      apartmentId: event.apartmentId,
      assignedTo: event.assignedTo,
    }));
  }, [events]);

  return (
    <CalendarWithFilters
      events={calendarEvents}
      isLoading={isLoading}
      error={error}
      buildingId={buildingId}
      isFromBuildingTab={true}
      showBuildingFilter={false} // Don't show building filter in single building view
      showEventTypeFilter={true}
      showSearch={true}
      height="calc(100vh - 160px)"
      minHeight="650px"
      showFilters={true}
      showLegend={true}
      showStatistics={false}
    />
  );
}
