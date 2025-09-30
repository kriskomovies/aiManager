import { format } from 'date-fns';
import {
  Clock,
  User,
  Building,
  Eye,
  Edit,
  Trash2,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Event type interface for consistency
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

interface CalendarEventItemsProps {
  events: CalendarEventData[];
  onViewEvent: (event: CalendarEventData) => void;
  onEditEvent: (event: CalendarEventData) => void;
  onDeleteEvent: (event: CalendarEventData) => void;
}

// Helper function to determine if an event is in the past
const isPastEvent = (eventEnd: string): boolean => {
  const now = new Date();
  const eventEndDate = new Date(eventEnd);
  return eventEndDate < now;
};

// Helper functions for event styling
const getEventTypeConfig = (type: string, isPast: boolean) => {
  const configs = {
    maintenance: {
      color: isPast ? 'bg-red-50' : 'bg-red-100',
      bgColor: isPast ? 'bg-red-50' : 'bg-red-100',
      textColor: isPast ? 'text-red-600' : 'text-red-800',
      label: 'Поддръжка',
    },
    inspection: {
      color: isPast ? 'bg-blue-50' : 'bg-blue-100',
      bgColor: isPast ? 'bg-blue-50' : 'bg-blue-100',
      textColor: isPast ? 'text-blue-600' : 'text-blue-800',
      label: 'Проверка',
    },
    payment: {
      color: isPast ? 'bg-green-50' : 'bg-green-100',
      bgColor: isPast ? 'bg-green-50' : 'bg-green-100',
      textColor: isPast ? 'text-green-600' : 'text-green-800',
      label: 'Плащане',
    },
    meeting: {
      color: isPast ? 'bg-purple-50' : 'bg-purple-100',
      bgColor: isPast ? 'bg-purple-50' : 'bg-purple-100',
      textColor: isPast ? 'text-purple-600' : 'text-purple-800',
      label: 'Среща',
    },
    repair: {
      color: isPast ? 'bg-orange-50' : 'bg-orange-100',
      bgColor: isPast ? 'bg-orange-50' : 'bg-orange-100',
      textColor: isPast ? 'text-orange-600' : 'text-orange-800',
      label: 'Ремонт',
    },
  };
  return (
    configs[type as keyof typeof configs] || {
      color: isPast ? 'bg-gray-50' : 'bg-gray-100',
      bgColor: isPast ? 'bg-gray-50' : 'bg-gray-100',
      textColor: isPast ? 'text-gray-600' : 'text-gray-800',
      label: type,
    }
  );
};

const getPriorityConfig = (priority: string, isPast: boolean) => {
  const configs = {
    low: {
      color: isPast ? 'bg-gray-50' : 'bg-gray-100',
      bgColor: isPast ? 'bg-gray-50' : 'bg-gray-100',
      textColor: isPast ? 'text-gray-600' : 'text-gray-800',
      label: 'Нисък',
    },
    medium: {
      color: isPast ? 'bg-yellow-50' : 'bg-yellow-100',
      bgColor: isPast ? 'bg-yellow-50' : 'bg-yellow-100',
      textColor: isPast ? 'text-yellow-600' : 'text-yellow-800',
      label: 'Среден',
    },
    high: {
      color: isPast ? 'bg-orange-50' : 'bg-orange-100',
      bgColor: isPast ? 'bg-orange-50' : 'bg-orange-100',
      textColor: isPast ? 'text-orange-600' : 'text-orange-800',
      label: 'Висок',
    },
    urgent: {
      color: isPast ? 'bg-red-50' : 'bg-red-100',
      bgColor: isPast ? 'bg-red-50' : 'bg-red-100',
      textColor: isPast ? 'text-red-600' : 'text-red-800',
      label: 'Спешен',
    },
  };
  return (
    configs[priority as keyof typeof configs] || {
      color: isPast ? 'bg-gray-50' : 'bg-gray-100',
      bgColor: isPast ? 'bg-gray-50' : 'bg-gray-100',
      textColor: isPast ? 'text-gray-600' : 'text-gray-800',
      label: priority,
    }
  );
};

const getStatusConfig = (status: string, isPast: boolean) => {
  const configs = {
    scheduled: {
      color: isPast ? 'bg-blue-50' : 'bg-blue-100',
      bgColor: isPast ? 'bg-blue-50' : 'bg-blue-100',
      textColor: isPast ? 'text-blue-600' : 'text-blue-800',
      label: 'Планирано',
    },
    'in-progress': {
      color: isPast ? 'bg-yellow-50' : 'bg-yellow-100',
      bgColor: isPast ? 'bg-yellow-50' : 'bg-yellow-100',
      textColor: isPast ? 'text-yellow-600' : 'text-yellow-800',
      label: 'В процес',
    },
    completed: {
      color: isPast ? 'bg-green-50' : 'bg-green-100',
      bgColor: isPast ? 'bg-green-50' : 'bg-green-100',
      textColor: isPast ? 'text-green-600' : 'text-green-800',
      label: 'Завършено',
    },
    cancelled: {
      color: isPast ? 'bg-gray-50' : 'bg-gray-100',
      bgColor: isPast ? 'bg-gray-50' : 'bg-gray-100',
      textColor: isPast ? 'text-gray-600' : 'text-gray-800',
      label: 'Отменено',
    },
  };
  return (
    configs[status as keyof typeof configs] || {
      color: isPast ? 'bg-gray-50' : 'bg-gray-100',
      bgColor: isPast ? 'bg-gray-50' : 'bg-gray-100',
      textColor: isPast ? 'text-gray-600' : 'text-gray-800',
      label: status,
    }
  );
};

export function CalendarEventItems({
  events,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
}: CalendarEventItemsProps) {
  return (
    <div className="space-y-3 p-6">
      {events.map(event => {
        const isPast = isPastEvent(event.end);
        const typeConfig = getEventTypeConfig(event.type, isPast);
        const priorityConfig = getPriorityConfig(event.priority, isPast);
        const statusConfig = getStatusConfig(event.status, isPast);

        return (
          <div
            key={event.id}
            className={`relative rounded-lg border p-6 transition-all duration-200 ${
              isPast
                ? 'bg-gray-50 border-gray-200 opacity-80 hover:bg-gray-75 hover:opacity-90'
                : 'bg-white border-gray-200 hover:bg-gray-25 hover:shadow-sm'
            }`}
          >
            {/* Past Event Indicator */}
            {isPast && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium border border-gray-300">
                <History className="w-3 h-3" />
                Минало събитие
              </div>
            )}

            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                {/* Event Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-1 h-12 rounded-full ${typeConfig.color}`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-lg leading-tight ${isPast ? 'text-gray-700' : 'text-gray-900'}`}
                    >
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <div
                        className={`flex items-center gap-1 ${isPast ? 'text-gray-500' : 'text-gray-600'}`}
                      >
                        <Clock
                          className={`w-4 h-4 ${isPast ? 'text-gray-400' : 'text-gray-500'}`}
                        />
                        {format(new Date(event.start), 'dd.MM.yyyy HH:mm')} -{' '}
                        {format(new Date(event.end), 'HH:mm')}
                      </div>
                      {event.buildingName && (
                        <div
                          className={`flex items-center gap-1 ${isPast ? 'text-gray-500' : 'text-gray-600'}`}
                        >
                          <Building
                            className={`w-4 h-4 ${isPast ? 'text-gray-400' : 'text-gray-500'}`}
                          />
                          {event.buildingName}
                        </div>
                      )}
                      {event.assignedTo && (
                        <div
                          className={`flex items-center gap-1 ${isPast ? 'text-gray-500' : 'text-gray-600'}`}
                        >
                          <User
                            className={`w-4 h-4 ${isPast ? 'text-gray-400' : 'text-gray-500'}`}
                          />
                          {event.assignedTo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                {event.description && (
                  <p
                    className={`text-sm mb-4 line-clamp-2 ${isPast ? 'text-gray-600' : 'text-gray-700'}`}
                  >
                    {event.description}
                  </p>
                )}

                {/* Event Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={`text-xs ${typeConfig.bgColor} ${typeConfig.textColor} border-0`}
                  >
                    {typeConfig.label}
                  </Badge>
                  <Badge
                    className={`text-xs ${priorityConfig.bgColor} ${priorityConfig.textColor} border-0`}
                  >
                    {priorityConfig.label}
                  </Badge>
                  <Badge
                    className={`text-xs ${statusConfig.bgColor} ${statusConfig.textColor} border-0`}
                  >
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons - Centered vertically */}
              <div className="flex items-center gap-2 flex-shrink-0 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewEvent(event)}
                  className={`h-8 px-3 text-xs ${isPast ? 'opacity-75' : ''}`}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Преглед
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditEvent(event)}
                  disabled={isPast && event.status === 'completed'}
                  className={`h-8 px-3 text-xs ${isPast ? 'opacity-75' : ''}`}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Редактиране
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteEvent(event)}
                  disabled={isPast && event.status === 'completed'}
                  className={`h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 ${isPast ? 'opacity-75' : ''}`}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Изтриване
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
