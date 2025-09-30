import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  closeModal,
  selectModalData,
  openModal,
} from '@/redux/slices/modal-slice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { CalendarEvent } from '@/redux/services/calendar-service';

interface EventDetailsModalProps {
  onClose: () => void;
}

export function EventDetailsModal({ onClose }: EventDetailsModalProps) {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const event = modalData?.event as CalendarEvent;

  if (!event) {
    return null;
  }

  // Event type configuration
  const eventTypeConfig = {
    maintenance: {
      label: 'Поддръжка',
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    inspection: {
      label: 'Проверка',
      icon: CheckCircle,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    payment: {
      label: 'Плащане/Такси',
      icon: MapPin,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    meeting: {
      label: 'Събиране',
      icon: User,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    repair: {
      label: 'Ремонт',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  };

  // Status configuration
  const statusConfig = {
    scheduled: {
      label: 'Планирано',
      variant: 'neutral' as const,
      icon: Clock,
      color: 'text-gray-600',
    },
    'in-progress': {
      label: 'В процес',
      variant: 'warning' as const,
      icon: Pause,
      color: 'text-yellow-600',
    },
    completed: {
      label: 'Завършено',
      variant: 'positive' as const,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    cancelled: {
      label: 'Отменено',
      variant: 'negative' as const,
      icon: XCircle,
      color: 'text-red-600',
    },
  };

  // Priority configuration
  const priorityConfig = {
    low: { label: 'Ниска', variant: 'neutral' as const },
    medium: { label: 'Средна', variant: 'warning' as const },
    high: { label: 'Висока', variant: 'warning' as const },
    urgent: { label: 'Спешна', variant: 'negative' as const },
  };

  const selectedEventType = eventTypeConfig[event.type];
  const selectedStatus = statusConfig[event.status];
  const selectedPriority = priorityConfig[event.priority];

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('bg-BG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('bg-BG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const startDateTime = formatDateTime(event.start);
  const endDateTime = formatDateTime(event.end);

  const handleEdit = () => {
    dispatch(closeModal());
    // Open edit modal with event data
    dispatch({
      type: 'modal/openModal',
      payload: {
        type: 'add-edit-calendar-event',
        data: {
          buildingId: event.buildingId,
          event: event,
        },
      },
    });
  };

  const handleDelete = () => {
    // Close current modal and open delete confirmation modal
    onClose();
    dispatch(
      openModal({
        type: 'delete-calendar-event',
        data: {
          eventId: event.id,
          eventTitle: event.title,
        },
      })
    );
  };

  return (
    <div className="w-full h-full flex flex-col relative max-h-[85vh]">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      {/* Header */}
      <div
        className={`px-6 py-4 border-b border-gray-200 flex-shrink-0 ${selectedEventType.bgColor}`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${selectedEventType.color}`}>
            <selectedEventType.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {event.title}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <selectedEventType.icon
                  className={`w-4 h-4 ${selectedEventType.textColor}`}
                />
                <span
                  className={`text-sm font-medium ${selectedEventType.textColor}`}
                >
                  {selectedEventType.label}
                </span>
              </div>
              <Badge variant={selectedStatus.variant}>
                {selectedStatus.label}
              </Badge>
              <Badge variant={selectedPriority.variant}>
                {selectedPriority.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Date and Time Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            Дата и час
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="text-xs text-gray-500 uppercase font-medium">
                  Начало
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {startDateTime.date}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {startDateTime.time}
                </div>
              </div>
              <div className="flex-1 flex justify-center items-center">
                <div className="h-px bg-gray-300 flex-1"></div>
                <div className="px-2 text-xs text-gray-500">до</div>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-gray-500 uppercase font-medium">
                  Край
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {endDateTime.date}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  {endDateTime.time}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location and Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {event.apartmentId && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                Местоположение
              </h3>
              <p className="text-sm text-gray-700">
                Апартамент {event.apartmentId.replace('apt-', '')}
              </p>
            </div>
          )}

          {event.assignedTo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                Отговорник
              </h3>
              <p className="text-sm text-gray-700">{event.assignedTo}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Описание
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>
        )}

        {/* Status Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Статус на събитието
          </h3>
          <div className="flex items-center gap-2">
            <selectedStatus.icon
              className={`w-4 h-4 ${selectedStatus.color}`}
            />
            <span className="text-sm font-medium text-gray-900">
              {selectedStatus.label}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="text-xs text-gray-500">ID: {event.id}</div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Редактирай
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Изтрий
          </Button>
          <Button variant="outline" onClick={onClose}>
            Затвори
          </Button>
        </div>
      </div>
    </div>
  );
}
