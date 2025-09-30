import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/lib/api.utils';
import {
  CalendarEventType,
  CalendarEventStatus,
  CalendarEventPriority,
  ICreateCalendarEventRequest,
  IUpdateCalendarEventRequest,
  ICalendarEventQueryParams,
  ICalendarEventStats,
  IBackendCalendarEventResponse,
  IBackendCalendarEventQueryParams,
  IBackendPaginatedResponse,
  IPaginatedResponse,
} from '@repo/interfaces';

// Updated CalendarEvent interface for frontend use
export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string for react-big-calendar
  end: string; // ISO string for react-big-calendar
  type: CalendarEventType;
  description?: string;
  apartmentId?: string; // For backward compatibility with existing UI
  buildingId: string;
  status: CalendarEventStatus;
  priority: CalendarEventPriority;
  assignedTo?: string;
  appliesToAllApartments: boolean;
  targetApartmentIds?: string[];
  location?: string;
  notes?: string;
}

// Transform backend response to frontend format
const transformPaginatedResponse = <T>(
  response: IBackendPaginatedResponse<T>
): IPaginatedResponse<T> => ({
  items: response.data.data,
  meta: {
    page: response.data.page,
    pageSize: response.data.limit,
    pageCount: response.data.totalPages,
    total: response.data.total,
  },
});

// Transform backend event to frontend CalendarEvent
const transformEventToCalendarEvent = (
  event: IBackendCalendarEventResponse
): CalendarEvent => ({
  id: event.id,
  title: event.title,
  start: event.startDate, // Use startDate as start for react-big-calendar
  end: event.endDate, // Use endDate as end for react-big-calendar
  type: event.type,
  description: event.description,
  apartmentId: event.targetApartmentIds?.[0], // For backward compatibility - use first apartment
  buildingId: event.buildingId,
  status: event.status,
  priority: event.priority,
  assignedTo: event.assignedTo,
  appliesToAllApartments: event.appliesToAllApartments,
  targetApartmentIds: event.targetApartmentIds,
  location: event.location,
  notes: event.notes,
});

export const calendarService = createApi({
  reducerPath: 'calendarService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['CalendarEvent'],
  endpoints: builder => ({
    // Get events for a specific building
    getBuildingEvents: builder.query<CalendarEvent[], string>({
      query: buildingId => ({
        url: `calendar-events/building/${buildingId}`,
      }),
      transformResponse: (response: {
        data: IBackendCalendarEventResponse[];
      }) => {
        return response.data.map(transformEventToCalendarEvent);
      },
      providesTags: (result, _error, buildingId) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'CalendarEvent' as const,
                id,
              })),
              { type: 'CalendarEvent', id: `BUILDING-${buildingId}` },
            ]
          : [{ type: 'CalendarEvent', id: `BUILDING-${buildingId}` }],
    }),

    // Get all events with pagination and filtering
    getCalendarEvents: builder.query<
      IPaginatedResponse<CalendarEvent>,
      ICalendarEventQueryParams
    >({
      query: params => {
        // Transform frontend params to backend params
        const backendParams: IBackendCalendarEventQueryParams = {
          page: params.page,
          limit: params.pageSize,
          search: params.search,
          buildingId: params.buildingId,
          type: params.type,
          status: params.status,
          priority: params.priority,
          startDate: params.startDate,
          endDate: params.endDate,
          assignedTo: params.assignedTo,
          appliesToAllApartments: params.appliesToAllApartments,
        };

        // Transform sort parameter
        if (params.sort) {
          const [field, direction] = params.sort.split(':');
          backendParams.sortBy = field;
          backendParams.sortOrder =
            (direction?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
        }

        // Remove undefined values
        Object.keys(backendParams).forEach(
          key =>
            backendParams[key as keyof IBackendCalendarEventQueryParams] ===
              undefined &&
            delete backendParams[key as keyof IBackendCalendarEventQueryParams]
        );

        return {
          url: 'calendar-events',
          params: backendParams,
        };
      },
      transformResponse: (
        response: IBackendPaginatedResponse<IBackendCalendarEventResponse>
      ) => {
        const transformed = transformPaginatedResponse(response);

        // Transform each event
        const events: CalendarEvent[] = (
          transformed.items as IBackendCalendarEventResponse[]
        ).map(transformEventToCalendarEvent);

        return {
          ...transformed,
          items: events,
        };
      },
      providesTags: ['CalendarEvent'],
    }),

    // Get single event by ID
    getCalendarEvent: builder.query<CalendarEvent, string>({
      query: id => `calendar-events/${id}`,
      transformResponse: (response: {
        data: IBackendCalendarEventResponse;
      }) => {
        return transformEventToCalendarEvent(response.data);
      },
      providesTags: (_result, _error, id) => [{ type: 'CalendarEvent', id }],
    }),

    // Create new event
    createEvent: builder.mutation<
      CalendarEvent,
      Partial<ICreateCalendarEventRequest>
    >({
      query: newEvent => ({
        url: 'calendar-events',
        method: 'POST',
        body: {
          ...newEvent,
          // Set default values
          priority: newEvent.priority || CalendarEventPriority.MEDIUM,
          appliesToAllApartments: newEvent.appliesToAllApartments ?? false,
        },
      }),
      transformResponse: (response: {
        data: IBackendCalendarEventResponse;
      }) => {
        return transformEventToCalendarEvent(response.data);
      },
      invalidatesTags: (_result, _error, { buildingId }) => [
        { type: 'CalendarEvent', id: `BUILDING-${buildingId}` },
        'CalendarEvent',
      ],
    }),

    // Update existing event
    updateEvent: builder.mutation<
      CalendarEvent,
      { id: string } & Partial<IUpdateCalendarEventRequest>
    >({
      query: ({ id, ...updates }) => ({
        url: `calendar-events/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      transformResponse: (response: {
        data: IBackendCalendarEventResponse;
      }) => {
        return transformEventToCalendarEvent(response.data);
      },
      invalidatesTags: (result, _error, { id }) => {
        const tags = [
          { type: 'CalendarEvent' as const, id },
          'CalendarEvent' as const,
        ];

        // Also invalidate building-specific cache if we have the buildingId from the result
        if (result?.buildingId) {
          tags.push({
            type: 'CalendarEvent' as const,
            id: `BUILDING-${result.buildingId}`,
          });
        }

        return tags;
      },
    }),

    // Delete event
    deleteEvent: builder.mutation<void, string>({
      query: id => ({
        url: `calendar-events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'CalendarEvent', id },
        'CalendarEvent',
      ],
    }),

    // Get event statistics
    getCalendarEventStats: builder.query<
      ICalendarEventStats,
      string | undefined
    >({
      query: buildingId => ({
        url: 'calendar-events/stats',
        params: buildingId ? { buildingId } : undefined,
      }),
      transformResponse: (response: { data: ICalendarEventStats }) => {
        return response.data;
      },
      providesTags: ['CalendarEvent'],
    }),

    // Get upcoming events for a building
    getUpcomingEvents: builder.query<CalendarEvent[], string>({
      query: buildingId => `calendar-events/building/${buildingId}/upcoming`,
      transformResponse: (response: {
        data: IBackendCalendarEventResponse[];
      }) => {
        return response.data.map(transformEventToCalendarEvent);
      },
      providesTags: (_result, _error, buildingId) => [
        { type: 'CalendarEvent', id: `UPCOMING-${buildingId}` },
      ],
    }),
  }),
});

export const {
  useGetBuildingEventsQuery,
  useGetCalendarEventsQuery,
  useGetCalendarEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetCalendarEventStatsQuery,
  useGetUpcomingEventsQuery,
} = calendarService;
