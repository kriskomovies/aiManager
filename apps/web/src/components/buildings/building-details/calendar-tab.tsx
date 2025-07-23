import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views, NavigateAction, ToolbarProps } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { bg } from 'date-fns/locale'; // Bulgarian locale
import { Plus, Filter, Download } from 'lucide-react';
import { useGetBuildingEventsQuery, CalendarEvent } from '@/redux/services/calendar-service';
import { Button } from '@/components/ui/button';
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

interface CalendarTabProps {
  buildingId?: string;
}

interface CalendarEventFormatted {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: CalendarEvent;
}

export function CalendarTab({ buildingId = 'building-1' }: CalendarTabProps) {
  const [date, setDate] = useState(new Date());
  const dispatch = useAppDispatch();
  
  // RTK Query hooks
  const { data: events = [], isLoading, error } = useGetBuildingEventsQuery(buildingId);

  // Transform API data to calendar format
  const calendarEvents = useMemo((): CalendarEventFormatted[] => {
    return events.map((event: CalendarEvent) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      resource: event, // Store full event data in resource
    }));
  }, [events]);

  // Event style based on type
  const eventStyleGetter = (event: CalendarEventFormatted) => {
    const eventData = event.resource as CalendarEvent;
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
        borderRadius: '6px',
        border: 'none',
        fontSize: '12px',
        padding: '2px 6px',
      },
      className: `event-${eventData.type}`,
    };
  };

  // Handle event creation
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    dispatch(openModal({
      type: 'add-calendar-event',
      data: {
        buildingId,
        selectedStart: start.toISOString(),
        selectedEnd: end.toISOString(),
        isFromBuildingTab: true,
      },
    }));
  };

  // Handle add button click
  const handleAddEvent = () => {
    dispatch(openModal({
      type: 'add-calendar-event',
      data: {
        buildingId,
        isFromBuildingTab: true,
      },
    }));
  };

  // Handle event click
  const handleEventClick = (event: CalendarEventFormatted) => {
    dispatch(openModal({
      type: 'event-details',
      data: {
        event: event.resource,
        buildingId
      }
    }));
  };



  // Handle navigation
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  // Custom month cell wrapper for additional styling and scrolling
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
              <Filter className="w-3 h-3 mr-1" />
              Филтър
            </Button>
            
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              <Download className="w-3 h-3 mr-1" />
              Експорт
            </Button>
            
            <Button size="sm" className="h-8 px-3 text-xs" onClick={handleAddEvent}>
              <Plus className="w-3 h-3 mr-1" />
              Добави
            </Button>
          </div>
        </div>
      </div>
    );
  };

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
      {/* Calendar Container */}
      <div className="bg-white overflow-hidden">
        <div 
          className="calendar-container" 
          style={{ 
            height: 'calc(100vh - 160px)', 
            minHeight: '650px',
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
    </div>
  );
}
