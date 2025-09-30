import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Building,
  Home,
  User,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
} from 'lucide-react';
import {
  IIrregularityResponse,
  IrregularityStatus,
  IrregularityPriority,
} from '@repo/interfaces';

export function IrregularityDetailsPage() {
  const { id: irregularityId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [newStatus, setNewStatus] = useState<IrregularityStatus | ''>('');

  // Mock irregularity data
  const mockIrregularity: IIrregularityResponse = {
    id: irregularityId || '1',
    title: 'Неработещ асансьор',
    description: 'Асансьорът спира между 3-ти и 4-ти етаж. Трябва спешен ремонт. Жителите са принудени да използват стълбите, което е проблем за възрастните хора.',
    buildingId: '1',
    apartmentId: undefined,
    status: IrregularityStatus.IN_PROGRESS,
    priority: IrregularityPriority.HIGH,
    location: 'Входно фоайе, асансьорна шахта',
    estimatedCost: 500,
    actualCost: undefined,
    expectedCompletionDate: '2024-02-15T18:00:00Z',
    completedAt: undefined,
    resolutionNotes: undefined,
    isArchived: false,
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-01-30T14:30:00Z',
    building: {
      id: '1',
      name: 'Сграда А',
    },
    apartment: undefined,
    reportedBy: {
      id: '1',
      name: 'Иван',
      surname: 'Петров',
      fullName: 'Иван Петров',
    },
    assignedUser: {
      id: '2',
      name: 'Петър',
      surname: 'Димитров',
      fullName: 'Петър Димитров',
    },
    attachments: [
      {
        id: '1',
        fileName: 'elevator_problem.jpg',
        filePath: '/uploads/irregularities/elevator_problem.jpg',
        fileSize: 245760,
        mimeType: 'image/jpeg',
        uploadedAt: '2024-01-28T10:05:00Z',
        uploadedBy: {
          id: '1',
          name: 'Иван',
          surname: 'Петров',
        },
      },
      {
        id: '2',
        fileName: 'maintenance_quote.pdf',
        filePath: '/uploads/irregularities/maintenance_quote.pdf',
        fileSize: 156432,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-29T16:20:00Z',
        uploadedBy: {
          id: '2',
          name: 'Петър',
          surname: 'Димитров',
        },
      },
    ],
    isOverdue: true,
    daysOverdue: 3,
  };

  const getStatusBadge = (status: IrregularityStatus) => {
    const statusMap = {
      [IrregularityStatus.REPORTED]: { label: 'Докладвана', variant: 'negative' as const, icon: AlertTriangle },
      [IrregularityStatus.PLANNED]: { label: 'Планувана', variant: 'warning' as const, icon: Calendar },
      [IrregularityStatus.IN_PROGRESS]: { label: 'В Процес', variant: 'warning' as const, icon: Clock },
      [IrregularityStatus.COMPLETED]: { label: 'Решена', variant: 'positive' as const, icon: CheckCircle },
      [IrregularityStatus.REJECTED]: { label: 'Отказана', variant: 'neutral' as const, icon: XCircle },
    };

    const config = statusMap[status];
    const IconComponent = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: IrregularityPriority) => {
    const priorityMap = {
      [IrregularityPriority.LOW]: { label: 'Ниска', variant: 'neutral' as const },
      [IrregularityPriority.MEDIUM]: { label: 'Средна', variant: 'warning' as const },
      [IrregularityPriority.HIGH]: { label: 'Висока', variant: 'negative' as const },
      [IrregularityPriority.URGENT]: { label: 'Спешна', variant: 'negative' as const },
    };

    const config = priorityMap[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleStatusUpdate = () => {
    if (!newStatus) return;
    
    console.log('Updating status to:', newStatus);
    console.log('Resolution notes:', resolutionNotes);
    
    // TODO: Replace with actual API call
    setIsEditing(false);
    setNewStatus('');
    setResolutionNotes('');
  };

  const canUpdateStatus = () => {
    return mockIrregularity.status !== IrregularityStatus.COMPLETED && 
           mockIrregularity.status !== IrregularityStatus.REJECTED;
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete irregularity:', irregularityId);
    navigate('/irregularities');
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <motion.button
              onClick={() => navigate('/irregularities')}
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-semibold text-gray-900 truncate">
                  {mockIrregularity.title}
                </h1>
                {mockIrregularity.isOverdue && (
                  <Badge variant="negative" className="flex items-center gap-1 flex-shrink-0">
                    <AlertTriangle className="h-3 w-3" />
                    Просрочена ({mockIrregularity.daysOverdue} дни)
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{mockIrregularity.building.name}</span>
                {mockIrregularity.apartment && (
                  <>
                    <span>•</span>
                    <span>Ап. {mockIrregularity.apartment.number}</span>
                  </>
                )}
                <span>•</span>
                <span>Създадена: {formatDate(mockIrregularity.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate(`/irregularities/${irregularityId}/edit`)}
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Редактирай</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Изтрий</span>
              </Button>
            </motion.div>

            {canUpdateStatus() && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="sm" 
                  className="gap-2 bg-red-500 hover:bg-red-600"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="hidden sm:inline">Актуализирай статус</span>
                  <span className="sm:hidden">Статус</span>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status and Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Статус и приоритет</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Статус</div>
                  {getStatusBadge(mockIrregularity.status)}
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Приоритет</div>
                  {getPriorityBadge(mockIrregularity.priority)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Описание
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {mockIrregularity.description || 'Няма описание.'}
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          {mockIrregularity.location && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Локация
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{mockIrregularity.location}</p>
              </CardContent>
            </Card>
          )}

          {/* Resolution Notes */}
          {mockIrregularity.resolutionNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Бележки за решението
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{mockIrregularity.resolutionNotes}</p>
              </CardContent>
            </Card>
          )}

          {/* Status Update Form */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Актуализиране на статус</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Нов статус
                  </label>
                  <Select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value as IrregularityStatus)}
                  >
                    <option value="">Изберете нов статус</option>
                    {Object.values(IrregularityStatus)
                      .filter(status => status !== mockIrregularity.status)
                      .map((status) => (
                        <option key={status} value={status}>
                          {status === IrregularityStatus.REPORTED && 'Докладвана'}
                          {status === IrregularityStatus.PLANNED && 'Планувана'}
                          {status === IrregularityStatus.IN_PROGRESS && 'В Процес'}
                          {status === IrregularityStatus.COMPLETED && 'Решена'}
                          {status === IrregularityStatus.REJECTED && 'Отказана'}
                        </option>
                      ))
                    }
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Бележки (по избор)
                  </label>
                  <Textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Добавете бележки за промяната..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={handleStatusUpdate} disabled={!newStatus}>
                    Запази промяната
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setNewStatus('');
                      setResolutionNotes('');
                    }}
                  >
                    Отказ
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {mockIrregularity.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Прикачени файлове ({mockIrregularity.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockIrregularity.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {attachment.fileName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatFileSize(attachment.fileSize)} • 
                            Качен от {attachment.uploadedBy.name} {attachment.uploadedBy.surname} • 
                            {formatDate(attachment.uploadedAt)}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Изтегли
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Building & Apartment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Местоположение
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{mockIrregularity.building.name}</span>
              </div>
              {mockIrregularity.apartment ? (
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  <span>Ап. {mockIrregularity.apartment.number} (ет. {mockIrregularity.apartment.floor})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Цяла сграда</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* People */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Хора
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Докладвана от</div>
                <div className="font-medium">{mockIrregularity.reportedBy.fullName}</div>
              </div>
              {mockIrregularity.assignedUser && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Отговорник</div>
                  <div className="font-medium">{mockIrregularity.assignedUser.fullName}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Важни дати
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Докладвана</div>
                <div className="font-medium">{formatDate(mockIrregularity.createdAt)}</div>
              </div>
              {mockIrregularity.expectedCompletionDate && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Очаквано завършване</div>
                  <div className={`font-medium ${mockIrregularity.isOverdue ? 'text-red-600' : ''}`}>
                    {formatDate(mockIrregularity.expectedCompletionDate)}
                  </div>
                </div>
              )}
              {mockIrregularity.completedAt && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Завършена</div>
                  <div className="font-medium text-green-600">
                    {formatDate(mockIrregularity.completedAt)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Costs */}
          {(mockIrregularity.estimatedCost || mockIrregularity.actualCost) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Разходи
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockIrregularity.estimatedCost && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Очаквана цена</div>
                    <div className="font-medium">{mockIrregularity.estimatedCost.toFixed(2)} лв.</div>
                  </div>
                )}
                {mockIrregularity.actualCost && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Действителна цена</div>
                    <div className="font-medium">{mockIrregularity.actualCost.toFixed(2)} лв.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
