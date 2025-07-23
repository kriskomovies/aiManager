import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Mock data interface
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'maintenance' | 'inspection' | 'payment' | 'meeting' | 'repair';
  description?: string;
  apartmentId?: string;
  buildingId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
}

// Mock events data for demonstration
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Събиране Януари',
    start: '2025-01-07T14:00:00',
    end: '2025-01-07T16:00:00',
    type: 'meeting',
    description: 'Месечно събиране на собствениците',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Ала Бала',
    start: '2025-01-07T16:00:00',
    end: '2025-01-07T18:00:00',
    type: 'maintenance',
    description: 'Поддръжка на асансьора',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'high',
    assignedTo: 'Иван Петров'
  },
  {
    id: '3',
    title: 'Вечеря',
    start: '2025-01-07T18:00:00',
    end: '2025-01-07T20:00:00',
    type: 'meeting',
    description: 'Обща вечеря на жителите',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'low'
  },
  {
    id: '4',
    title: 'Дълго....',
    start: '2025-01-05T14:00:00',
    end: '2025-01-05T16:00:00',
    type: 'inspection',
    description: 'Дълга инспекция на системите',
    buildingId: 'building-1',
    status: 'completed',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Ала Ба...',
    start: '2025-01-05T10:00:00',
    end: '2025-01-05T11:00:00',
    type: 'maintenance',
    description: 'Кратка поддръжка',
    buildingId: 'building-1',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: '6',
    title: 'Вечеря',
    start: '2025-01-05T12:00:00',
    end: '2025-01-05T13:00:00',
    type: 'meeting',
    description: 'Обедна среща',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'low'
  },
  {
    id: '7',
    title: 'Събиране Януари',
    start: '2025-01-16T14:00:00',
    end: '2025-01-16T16:00:00',
    type: 'meeting',
    description: 'Второ събиране за януари',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'high'
  },
  {
    id: '8',
    title: 'Събиране',
    start: '2025-01-31T09:00:00',
    end: '2025-01-31T10:00:00',
    type: 'payment',
    description: 'Събиране на такси',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'high'
  },
  {
    id: '9',
    title: 'Ала Ба...',
    start: '2025-01-31T10:00:00',
    end: '2025-01-31T11:00:00',
    type: 'repair',
    description: 'Ремонт на общите части',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'urgent'
  },
  {
    id: '10',
    title: 'Вечеря',
    start: '2025-01-31T12:00:00',
    end: '2025-01-31T13:00:00',
    type: 'meeting',
    description: 'Заключителна вечеря за месеца',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'low'
  },
  {
    id: '11',
    title: 'Дълго....',
    start: '2025-01-31T14:00:00',
    end: '2025-01-31T16:00:00',
    type: 'inspection',
    description: 'Дълга финална инспекция',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'medium'
  },
  {
    id: '12',
    title: 'Събир...',
    start: '2025-01-31T16:00:00',
    end: '2025-01-31T18:00:00',
    type: 'meeting',
    description: 'Кратко събиране',
    buildingId: 'building-1',
    status: 'scheduled',
    priority: 'medium'
  }
];

export const calendarService = createApi({
  reducerPath: 'calendarService',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['CalendarEvent'],
  endpoints: (builder) => ({
    getBuildingEvents: builder.query<CalendarEvent[], string>({
      // For now, return mock data directly without making HTTP calls
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: mockEvents };
      },
      providesTags: (result, _error, buildingId) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'CalendarEvent' as const, id })),
              { type: 'CalendarEvent', id: `BUILDING-${buildingId}` },
            ]
          : [{ type: 'CalendarEvent', id: `BUILDING-${buildingId}` }],
    }),
    
    createEvent: builder.mutation<CalendarEvent, Partial<CalendarEvent>>({
      queryFn: async (newEvent) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const event = {
          ...newEvent,
          id: Date.now().toString(),
        } as CalendarEvent;
        mockEvents.push(event);
        return { data: event };
      },
      invalidatesTags: (_result, _error, { buildingId }) => [
        { type: 'CalendarEvent', id: `BUILDING-${buildingId}` },
      ],
    }),
    
    updateEvent: builder.mutation<CalendarEvent, { id: string } & Partial<CalendarEvent>>({
      queryFn: async ({ id, ...updates }) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const eventIndex = mockEvents.findIndex(e => e.id === id);
        if (eventIndex >= 0) {
          mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...updates };
          return { data: mockEvents[eventIndex] };
        }
        return { error: { status: 404, data: 'Event not found' } };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CalendarEvent', id },
      ],
    }),
    
    deleteEvent: builder.mutation<void, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const eventIndex = mockEvents.findIndex(e => e.id === id);
        if (eventIndex >= 0) {
          mockEvents.splice(eventIndex, 1);
          return { data: undefined };
        }
        return { error: { status: 404, data: 'Event not found' } };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'CalendarEvent', id },
      ],
    }),
  }),
});

export const {
  useGetBuildingEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = calendarService; 