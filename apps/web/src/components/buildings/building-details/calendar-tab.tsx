import { useMemo, useState } from 'react';
import { useGetBuildingEventsQuery } from '@/redux/services/calendar-service';
import { useGetBuildingQuery } from '@/redux/services/building.service';
import { CalendarWithFilters } from '@/components/calendar/calendar-with-filters';

interface CalendarTabProps {
  buildingId?: string;
}

export function CalendarTab({ buildingId = 'building-1' }: CalendarTabProps) {
  // Filter state management
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [includePastEvents, setIncludePastEvents] = useState<boolean>(true);

  // RTK Query hooks
  const {
    data: events = [],
    isLoading,
    error,
  } = useGetBuildingEventsQuery(buildingId);

  // Fetch building data for the filter
  const { data: buildingData, isLoading: isBuildingLoading } =
    useGetBuildingQuery(buildingId);

  // Transform events to include building name for display
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      type: event.type,
      description: event.description,
      buildingId: event.buildingId,
      buildingName: buildingData?.name, // Add building name from fetched data
      status: event.status,
      priority: event.priority,
      apartmentId: event.apartmentId, // Keep for backward compatibility
      appliesToAllApartments: event.appliesToAllApartments, // ✅ PRESERVE THIS
      targetApartmentIds: event.targetApartmentIds, // ✅ PRESERVE THIS
      assignedTo: event.assignedTo,
    }));
  }, [events, buildingData?.name]);

  // Prepare buildings array with current building for the filter
  const buildings = useMemo(() => {
    if (!buildingData) return [];
    return [
      {
        id: buildingData.id,
        name: buildingData.name,
        address: buildingData.address,
        apartmentCount: buildingData.apartmentCount,
      },
    ];
  }, [buildingData]);

  return (
    <CalendarWithFilters
      events={calendarEvents}
      isLoading={isLoading || isBuildingLoading}
      error={error}
      buildingId={buildingId}
      isFromBuildingTab={true}
      // Building filter - show but disabled with preselected value
      buildings={buildings}
      selectedBuilding={buildingId}
      showBuildingFilter={true}
      onBuildingChange={() => {}} // No-op since it's disabled
      // Other filters
      showEventTypeFilter={true}
      showPastEventsFilter={true}
      // Filter state props
      eventTypeFilter={eventTypeFilter}
      onEventTypeChange={setEventTypeFilter}
      includePastEvents={includePastEvents}
      onIncludePastEventsChange={setIncludePastEvents}
      // Layout props
      height="calc(100vh - 160px)"
      minHeight="650px"
      showFilters={true}
      showLegend={true}
      showStatistics={false}
      showFilteredEventsList={true}
    />
  );
}
