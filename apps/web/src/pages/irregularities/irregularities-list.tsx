import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Download, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InformationCard } from '@/components/information-card';
import { IrregularitiesTable } from '@/components/irregularities/irregularities-table';
import {
  IrregularityStatus,
  IrregularityPriority,
} from '@repo/interfaces';

export function IrregularitiesListPage() {
  const navigate = useNavigate();

  // Mock data for stats only
  const mockIrregularities = [
    {
      id: '1',
      title: 'Неработещ асансьор',
      buildingName: 'Сграда А',
      apartmentNumber: '12А',
      status: IrregularityStatus.REPORTED,
      priority: IrregularityPriority.HIGH,
      reportedBy: 'Иван Петров',
      assignedUser: undefined,
      createdAt: '2024-01-28T10:00:00Z',
      expectedCompletionDate: '2024-02-05T18:00:00Z',
      isOverdue: false,
      attachmentCount: 2,
    },
    {
      id: '2',
      title: 'Течаща тръба в мазето',
      buildingName: 'Сграда Б',
      apartmentNumber: undefined, // Building-wide issue
      status: IrregularityStatus.IN_PROGRESS,
      priority: IrregularityPriority.URGENT,
      reportedBy: 'Мария Георгиева',
      assignedUser: 'Петър Димитров',
      createdAt: '2024-01-25T14:30:00Z',
      expectedCompletionDate: '2024-01-30T12:00:00Z',
      isOverdue: true,
      attachmentCount: 1,
    },
    {
      id: '3',
      title: 'Счупено стъкло на входа',
      buildingName: 'Сграда А',
      apartmentNumber: undefined,
      status: IrregularityStatus.PLANNED,
      priority: IrregularityPriority.MEDIUM,
      reportedBy: 'Стефан Николов',
      assignedUser: 'Георги Стоянов',
      createdAt: '2024-01-26T09:15:00Z',
      expectedCompletionDate: '2024-02-02T16:00:00Z',
      isOverdue: false,
      attachmentCount: 0,
    },
    {
      id: '4',
      title: 'Проблем с отоплението',
      buildingName: 'Сграда В',
      apartmentNumber: '5Б',
      status: IrregularityStatus.COMPLETED,
      priority: IrregularityPriority.HIGH,
      reportedBy: 'Елена Василева',
      assignedUser: 'Димитър Христов',
      createdAt: '2024-01-20T16:45:00Z',
      expectedCompletionDate: '2024-01-25T10:00:00Z',
      isOverdue: false,
      attachmentCount: 3,
    },
    {
      id: '5',
      title: 'Шум от съседи',
      buildingName: 'Сграда Б',
      apartmentNumber: '8А',
      status: IrregularityStatus.REJECTED,
      priority: IrregularityPriority.LOW,
      reportedBy: 'Николай Тодоров',
      assignedUser: undefined,
      createdAt: '2024-01-22T20:00:00Z',
      expectedCompletionDate: undefined,
      isOverdue: false,
      attachmentCount: 0,
    },
  ];

  const handleCreateIrregularity = () => {
    navigate('/irregularities/add');
  };

  // Mock statistics
  const stats = {
    total: mockIrregularities.length,
    reported: mockIrregularities.filter(i => i.status === IrregularityStatus.REPORTED).length,
    inProgress: mockIrregularities.filter(i => i.status === IrregularityStatus.IN_PROGRESS).length,
    overdue: mockIrregularities.filter(i => i.isOverdue).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Нередности</h1>
          <p className="text-gray-600 mt-1">
            Управление на докладвани нередности в сградите
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Филтри
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Експорт
          </Button>
          <Button onClick={handleCreateIrregularity}>
            <Plus className="h-4 w-4 mr-2" />
            Нова нередност
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InformationCard
          title="Общо нередности"
          value={stats.total.toString()}
          icon={AlertTriangle}
          iconColor="text-gray-600"
          iconBgColor="bg-gray-100"
          valueColor="text-gray-900"
        />
        <InformationCard
          title="Докладвани"
          value={stats.reported.toString()}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          valueColor="text-red-600"
          priority="high"
        />
        <InformationCard
          title="В процес"
          value={stats.inProgress.toString()}
          icon={Clock}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50"
          valueColor="text-yellow-600"
        />
        <InformationCard
          title="Просрочени"
          value={stats.overdue.toString()}
          icon={XCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-50"
          valueColor="text-red-600"
          priority="high"
        />
      </div>

      {/* Table */}
      <IrregularitiesTable 
        entityId="all" 
        entityType="building" 
        isArchive={false} 
      />
    </div>
  );
}
